import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import crypto from "node:crypto";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const CALLBACK_URL =
  process.env.GITHUB_CALLBACK_URL ||
  "http://localhost:3000/auth/github/callback";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET || !SESSION_SECRET) {
  throw new Error(
    "Missing GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, or SESSION_SECRET in server/.env",
  );
}

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    name: "patchpilot.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Local HTTP development only
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

type GithubUser = {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
};

declare module "express-session" {
  interface SessionData {
    oauthState?: string;
    user?: GithubUser;
    githubAccessToken?: string;
  }
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "PatchPilot API",
    timestamp: new Date().toISOString(),
  });
});

app.get("/auth/github", (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");
  req.session.oauthState = state;

  const authorizationUrl = new URL("https://github.com/login/oauth/authorize");

  authorizationUrl.searchParams.set("client_id", CLIENT_ID);
  authorizationUrl.searchParams.set("redirect_uri", CALLBACK_URL);
  authorizationUrl.searchParams.set("scope", "read:user user:email");
  authorizationUrl.searchParams.set("state", state);

  res.redirect(authorizationUrl.toString());
});

app.get("/auth/github/callback", async (req, res) => {
  const code = typeof req.query.code === "string" ? req.query.code : undefined;
  const state =
    typeof req.query.state === "string" ? req.query.state : undefined;

  if (
    !code ||
    !state ||
    !req.session.oauthState ||
    state !== req.session.oauthState
  ) {
    req.session.destroy(() => {
      res.status(400).send("Invalid OAuth callback or state.");
    });
    return;
  }

  delete req.session.oauthState;

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          redirect_uri: CALLBACK_URL,
        }),
      },
    );

    const tokenData = (await tokenResponse.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("GitHub token exchange failed:", tokenData.error);
      res.status(401).send("GitHub authentication failed.");
      return;
    }

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!userResponse.ok) {
      res.status(401).send("Could not retrieve GitHub profile.");
      return;
    }

    const githubUser = (await userResponse.json()) as GithubUser;

    // Regenerate the session after authentication to reduce session-fixation risk.
    req.session.regenerate((sessionError) => {
      if (sessionError) {
        console.error("Session regeneration failed.");
        res.status(500).send("Could not create a login session.");
        return;
      }

      req.session.user = {
        id: githubUser.id,
        login: githubUser.login,
        name: githubUser.name,
        avatar_url: githubUser.avatar_url,
      };
      req.session.githubAccessToken = tokenData.access_token;

      req.session.save((saveError) => {
        if (saveError) {
          console.error("Session save failed.");
          res.status(500).send("Could not save login session.");
          return;
        }

        res.redirect(FRONTEND_URL);
      });
    });
  } catch (error) {
    console.error("GitHub OAuth request failed:", error);
    res.status(502).send("Could not complete GitHub authentication.");
  }
});

app.get("/api/auth/me", (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ authenticated: false });
    return;
  }

  res.json({
    authenticated: true,
    user: req.session.user,
  });
});

app.get("/api/github/repos", async (req, res) => {
  const accessToken = req.session.githubAccessToken;

  if (!req.session.user || !accessToken) {
    res.status(401).json({
      message: "Please log in with GitHub first.",
    });
    return;
  }

  try {
    const githubResponse = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=100",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!githubResponse.ok) {
      console.error(
        "GitHub repositories request failed:",
        githubResponse.status,
      );

      res.status(502).json({
        message: "Could not fetch GitHub repositories.",
      });
      return;
    }

    const repositories = (await githubResponse.json()) as Array<{
      id: number;
      name: string;
      full_name: string;
      description: string | null;
      html_url: string;
      private: boolean;
      language: string | null;
      stargazers_count: number;
      updated_at: string;
    }>;

    res.json({
      repositories: repositories.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        private: repo.private,
        language: repo.language,
        stars: repo.stargazers_count,
        updated_at: repo.updated_at,
      })),
    });
  } catch (error) {
    console.error("GitHub repositories request failed:", error);

    res.status(502).json({
      message: "Could not connect to GitHub.",
    });
  }
});

app.get("/api/github/repos/:owner/:repo", async (req, res) => {
  const accessToken = req.session.githubAccessToken;

  if (!req.session.user || !accessToken) {
    res.status(401).json({
      message: "Please log in with GitHub first.",
    });
    return;
  }

  const { owner, repo } = req.params;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  try {
    const repositoryResponse = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      { headers },
    );

    if (repositoryResponse.status === 404) {
      res.status(404).json({
        message: "Repository not found or you do not have access to it.",
      });
      return;
    }

    if (!repositoryResponse.ok) {
      res.status(502).json({
        message: "Could not fetch repository details from GitHub.",
      });
      return;
    }

    const repository = (await repositoryResponse.json()) as {
      id: number;
      name: string;
      full_name: string;
      description: string | null;
      html_url: string;
      private: boolean;
      language: string | null;
      default_branch: string;
      stargazers_count: number;
      updated_at: string;
    };

    const treeResponse = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(repository.default_branch)}?recursive=1`,
      { headers },
    );

    if (!treeResponse.ok) {
      res.status(502).json({
        message:
          "Repository details loaded, but the file tree could not be fetched.",
      });
      return;
    }

    const treeData = (await treeResponse.json()) as {
      tree: Array<{
        path: string;
        type: "blob" | "tree" | "commit";
        size?: number;
      }>;
      truncated: boolean;
    };

    res.json({
      repository: {
        id: repository.id,
        name: repository.name,
        full_name: repository.full_name,
        description: repository.description,
        html_url: repository.html_url,
        private: repository.private,
        language: repository.language,
        default_branch: repository.default_branch,
        stars: repository.stargazers_count,
        updated_at: repository.updated_at,
      },
      files: treeData.tree.map((item) => ({
        path: item.path,
        type: item.type,
        size: item.size ?? null,
      })),
      tree_truncated: treeData.truncated,
    });
  } catch (error) {
    console.error("Repository details request failed:", error);

    res.status(502).json({
      message: "Could not connect to GitHub.",
    });
  }
});

app.get("/api/github/repos/:owner/:repo/content", async (req, res) => {
  try {
    const user = req.session.user;
    const accessToken = req.session.githubAccessToken;

    if (!user || !accessToken) {
      return res.status(401).json({
        message: "Please log in with GitHub again.",
      });
    }

    const { owner, repo } = req.params;
    const path = String(req.query.path || "");

    if (!path.trim()) {
      return res.status(400).json({
        message: "A file path is required.",
      });
    }

    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${accessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data.message || "Could not load the file from GitHub.",
      });
    }

    if (Array.isArray(data) || data.type !== "file") {
      return res.status(400).json({
        message: "The requested path is not a file.",
      });
    }

    if (data.size > 1_000_000) {
      return res.status(413).json({
        message: "This file is too large to preview (over 1 MB).",
      });
    }

    if (data.encoding !== "base64" || !data.content) {
      return res.status(415).json({
        message: "GitHub did not return a previewable file.",
      });
    }

    const content = Buffer.from(
      data.content.replace(/\n/g, ""),
      "base64",
    ).toString("utf8");

    return res.json({
      name: data.name,
      path: data.path,
      size: data.size,
      content,
      html_url: data.html_url,
    });
  } catch (error) {
    console.error("GitHub file content error:", error);

    return res.status(500).json({
      message: "An unexpected error occurred while loading the file.",
    });
  }
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).json({ message: "Could not log out." });
      return;
    }

    res.clearCookie("patchpilot.sid", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`PatchPilot API running at http://localhost:${PORT}`);
});
