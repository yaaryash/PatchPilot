
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import crypto from "node:crypto";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";
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

  const authorizationUrl = new URL(
    "https://github.com/login/oauth/authorize",
  );

  authorizationUrl.searchParams.set("client_id", CLIENT_ID);
  authorizationUrl.searchParams.set("redirect_uri", CALLBACK_URL);
  authorizationUrl.searchParams.set("scope", "read:user user:email");
  authorizationUrl.searchParams.set("state", state);

  res.redirect(authorizationUrl.toString());
});

app.get("/auth/github/callback", async (req, res) => {
  const code =
    typeof req.query.code === "string" ? req.query.code : undefined;
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
