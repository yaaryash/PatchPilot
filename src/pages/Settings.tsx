
import { useState } from "react";
import {
  UserRound,
  GitBranch,
  Wrench,
  ShieldCheck,
  Bell,
  Building2,
  Save,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

import { Badge, Button, Card } from "../components/ui";
import {
  getUserProfile,
  saveUserProfile,
} from "../data/userProfile";
import "./Settings.css";

type SettingsSection =
  | "profile"
  | "github"
  | "repair"
  | "security"
  | "notifications"
  | "workspace";

const sections: {
  id: SettingsSection;
  label: string;
  description: string;
  icon: typeof UserRound;
}[] = [
  {
    id: "profile",
    label: "Profile",
    description: "Your personal information",
    icon: UserRound,
  },
  {
    id: "github",
    label: "GitHub connections",
    description: "Repository access and integrations",
    icon: GitBranch,
  },
  {
    id: "repair",
    label: "Repair preferences",
    description: "Configure repair defaults",
    icon: Wrench,
  },
  {
    id: "security",
    label: "Security",
    description: "Review security options",
    icon: ShieldCheck,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Choose what to be notified about",
    icon: Bell,
  },
  {
    id: "workspace",
    label: "Workspace",
    description: "Your personal workspace",
    icon: Building2,
  },
];

export default function Settings() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");

  const [displayName, setDisplayName] = useState(
    () => getUserProfile().displayName
  );

  const [email, setEmail] = useState(() => getUserProfile().email);

  const [repairApproval, setRepairApproval] = useState(true);
  const [runTests, setRunTests] = useState(true);

  const [successNotifications, setSuccessNotifications] = useState(true);
  const [failureNotifications, setFailureNotifications] = useState(true);
  const [approvalNotifications, setApprovalNotifications] = useState(true);

  const [workspaceName, setWorkspaceName] = useState("Personal workspace");
  const [saved, setSaved] = useState(false);

  function savePreferences() {
    saveUserProfile({ displayName, email });

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  const section = sections.find((item) => item.id === activeSection)!;

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PREFERENCES</p>
          <h1>Settings</h1>
          <p className="muted">
            Manage your profile, integrations and repair preferences.
          </p>
        </div>

        <Badge>Local demo</Badge>
      </div>

      <div className="settings-layout">
        <Card className="settings-sidebar">
          <p className="settings-sidebar-label">SETTINGS</p>

          <nav aria-label="Settings sections">
            {sections.map(({ id, label, description, icon: Icon }) => (
              <button
                type="button"
                key={id}
                className={`settings-nav-item ${
                  activeSection === id ? "active" : ""
                }`}
                onClick={() => setActiveSection(id)}
              >
                <Icon size={18} />

                <span>
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
              </button>
            ))}
          </nav>
        </Card>

        <Card className="settings-content">
          <div className="settings-section-heading">
            <div>
              <p className="eyebrow">SETTINGS</p>
              <h2>{section.label}</h2>
              <p className="muted">{section.description}</p>
            </div>

            <section.icon size={23} />
          </div>

          {activeSection === "profile" && (
            <div className="settings-form">
              <div className="settings-profile-preview">
                <div className="settings-avatar">
                  {displayName.trim().charAt(0).toUpperCase() || "D"}
                </div>

                <div>
                  <strong>{displayName.trim() || "Developer"}</strong>
                  <p className="muted">Local demo profile</p>
                </div>
              </div>

              <label className="settings-field">
                <span>Display name</span>
                <input
                  value={displayName}
                  onChange={(event) => {
                    setDisplayName(event.target.value);
                    setSaved(false);
                  }}
                  placeholder="Your display name"
                />
              </label>

              <label className="settings-field">
                <span>Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setSaved(false);
                  }}
                  placeholder="you@example.com"
                />
                <small>
                  Email is not verified or linked to an account.
                </small>
              </label>
            </div>
          )}

          {activeSection === "github" && (
            <div className="settings-info-panel">
              <div className="settings-info-icon">
                <GitBranch size={24} />
              </div>

              <div>
                <h3>Connect your GitHub account</h3>
                <p className="muted">
                  GitHub OAuth is not configured yet. Repository entries
                  currently use local demo state.
                </p>
                <Badge tone="warning">Not connected</Badge>
              </div>

              <Button
                variant="secondary"
                onClick={() =>
                  window.alert(
                    "GitHub OAuth will be available after backend authentication is implemented."
                  )
                }
              >
                <ExternalLink size={15} />
                Setup pending
              </Button>
            </div>
          )}

          {activeSection === "repair" && (
            <div className="settings-form">
              <div className="settings-setting-row">
                <div>
                  <strong>
                    Require approval before applying repairs
                  </strong>
                  <p className="muted">
                    Keep a human approval step before changes are accepted.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={repairApproval}
                  onChange={(event) =>
                    setRepairApproval(event.target.checked)
                  }
                  aria-label="Require approval before applying repairs"
                />
              </div>

              <div className="settings-setting-row">
                <div>
                  <strong>Run tests after generating a patch</strong>
                  <p className="muted">
                    Preferred test behavior for future repair runs.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={runTests}
                  onChange={(event) => setRunTests(event.target.checked)}
                  aria-label="Run tests after generating a patch"
                />
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="settings-security-list">
              <div className="settings-security-item">
                <ShieldCheck size={20} />

                <div>
                  <strong>Authentication</strong>
                  <p className="muted">
                    No login provider is configured in this frontend demo.
                  </p>
                </div>

                <Badge>Pending</Badge>
              </div>

              <div className="settings-security-item">
                <GitBranch size={20} />

                <div>
                  <strong>GitHub token storage</strong>
                  <p className="muted">
                    No GitHub access token is currently stored by this UI.
                  </p>
                </div>

                <Badge>Not configured</Badge>
              </div>

              <div className="settings-security-item">
                <ShieldCheck size={20} />

                <div>
                  <strong>Repair execution isolation</strong>
                  <p className="muted">
                    Secure sandbox enforcement must be implemented in the backend.
                  </p>
                </div>

                <Badge tone="warning">Pending</Badge>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="settings-form">
              {[
                {
                  label: "Successful repairs",
                  description: "When a repair completes successfully",
                  checked: successNotifications,
                  onChange: setSuccessNotifications,
                },
                {
                  label: "Failed repairs",
                  description: "When a repair or test fails",
                  checked: failureNotifications,
                  onChange: setFailureNotifications,
                },
                {
                  label: "Approval required",
                  description: "When a repair needs your review",
                  checked: approvalNotifications,
                  onChange: setApprovalNotifications,
                },
              ].map((item) => (
                <div className="settings-setting-row" key={item.label}>
                  <div>
                    <strong>{item.label}</strong>
                    <p className="muted">{item.description}</p>
                  </div>

                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(event) =>
                      item.onChange(event.target.checked)
                    }
                    aria-label={item.label}
                  />
                </div>
              ))}
            </div>
          )}

          {activeSection === "workspace" && (
            <div className="settings-form">
              <div className="settings-workspace-card">
                <div className="settings-workspace-icon">
                  <Building2 size={22} />
                </div>

                <div>
                  <strong>{workspaceName || "Personal workspace"}</strong>
                  <p className="muted">
                    Your private workspace for repositories and repair runs.
                  </p>
                </div>

                <Badge>Personal</Badge>
              </div>

              <label className="settings-field">
                <span>Workspace name</span>
                <input
                  value={workspaceName}
                  onChange={(event) => setWorkspaceName(event.target.value)}
                  placeholder="Workspace name"
                />
              </label>

              <p className="settings-help">
                Workspace membership and access controls require backend support.
              </p>
            </div>
          )}

          <div className="settings-actions">
            {saved && (
              <span className="settings-saved-message" role="status">
                <CheckCircle2 size={16} />
                Profile saved in this browser
              </span>
            )}

            <Button onClick={savePreferences}>
              <Save size={16} />
              Save preferences
            </Button>
          </div>

          <p className="settings-demo-note">
            Demo mode: profile information is stored in this browser only.
            Other preferences are still held in React state and are not
            persisted after refresh.
          </p>
        </Card>
      </div>
    </>
  );
}
