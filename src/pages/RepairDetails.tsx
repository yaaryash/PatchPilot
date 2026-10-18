import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock3,
  FileCode2,
  GitBranch,
  GitPullRequest,
  LoaderCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  mockRepairDetails,
  type ChangedFile,
} from "../data/mockRepairDetails";
import "./RepairDetails.css";

type Decision = "approved" | "rejected" | "cancelled" | null;

function statusLabel(status: string) {
  switch (status) {
    case "completed":
      return "Completed";
    case "running":
      return "In progress";
    case "pending":
      return "Pending";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

function FileDiff({ file }: { file: ChangedFile }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rd-file">
      <button
        type="button"
        className="rd-file-heading"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        <span className="rd-file-heading-main">
          {expanded ? (
            <ChevronDown size={17} />
          ) : (
            <ChevronRight size={17} />
          )}
          <FileCode2 size={17} />
          <span className="rd-file-path">{file.path}</span>
        </span>

        <span className="rd-file-changes">
          <span className="rd-additions">+{file.additions}</span>
          <span className="rd-deletions">−{file.deletions}</span>
          <span className={`rd-file-type ${file.change}`}>
            {file.change}
          </span>
        </span>
      </button>

      {expanded && (
        <div className="rd-diff-code" role="region" aria-label={`Diff for ${file.path}`}>
          {file.diff.map((line, index) => {
            const isAddition = line.startsWith("+");
            const isDeletion = line.startsWith("-");
            const className = isAddition
              ? "rd-diff-line addition"
              : isDeletion
                ? "rd-diff-line deletion"
                : "rd-diff-line";

            return (
              <div className={className} key={`${file.path}-${index}`}>
                <span className="rd-diff-marker">
                  {isAddition ? "+" : isDeletion ? "−" : " "}
                </span>
                <code>{line.replace(/^[+-]/, "")}</code>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function RepairDetails() {
  const repair = mockRepairDetails;

  const [decision, setDecision] = useState<Decision>(null);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const isAwaitingReview = decision === null;

  function handleDecision(nextDecision: Exclude<Decision, null>) {
    const messages: Record<Exclude<Decision, null>, string> = {
      approved:
        "Approve this proposed patch? This demo will only update the UI; it will not merge code.",
      rejected:
        "Reject this proposed patch? This demo will only update the UI; it will not delete code.",
      cancelled:
        "Cancel this repair run? This demo will only update the UI; it will not stop a backend job.",
    };

    if (!window.confirm(messages[nextDecision])) {
      return;
    }

    setDecision(nextDecision);
  }

  function handleRestart() {
    setIsRestarting(true);

    window.setTimeout(() => {
      setDecision(null);
      setIsRestarting(false);
    }, 500);
  }

  const decisionText: Record<Exclude<Decision, null>, string> = {
    approved: "Patch approved in demo",
    rejected: "Patch rejected in demo",
    cancelled: "Repair cancelled in demo",
  };

  const decisionTone: Record<Exclude<Decision, null>, string> = {
    approved: "success",
    rejected: "danger",
    cancelled: "neutral",
  };

  return (
    <main className="repair-details-page">
      <div className="rd-container">
        <Link to="/" className="rd-back-link">
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="rd-page-heading">
          <div>
            <div className="rd-eyebrow">
              <GitPullRequest size={15} />
              Repair run · {repair.id}
            </div>

            <h1>{repair.title}</h1>

            <p className="rd-subtitle">
              Review the proposed repair, inspect the diff and check test results.
            </p>
          </div>

          <span
            className={`rd-status-pill ${
              decision ? decisionTone[decision] : "warning"
            }`}
          >
            {decision ? decisionText[decision] : "Awaiting review"}
          </span>
        </div>

        {decision && (
          <div className={`rd-notice ${decisionTone[decision]}`}>
            {decision === "approved" ? (
              <CheckCircle2 size={19} />
            ) : decision === "rejected" ? (
              <XCircle size={19} />
            ) : (
              <Circle size={19} />
            )}
            <div>
              <strong>{decisionText[decision]}</strong>
              <p>
                Demo state only. No repository files or backend jobs were changed.
              </p>
            </div>
          </div>
        )}

        <section className="rd-summary-grid" aria-label="Repair summary">
          <article className="rd-card rd-summary-card">
            <span className="rd-card-label">Repository</span>
            <strong>{repair.repository}</strong>
            <span className="rd-muted">
              <GitBranch size={14} /> {repair.branch}
            </span>
          </article>

          <article className="rd-card rd-summary-card">
            <span className="rd-card-label">Changed files</span>
            <strong>{repair.files.length}</strong>
            <span className="rd-muted">
              <FileCode2 size={14} />{" "}
              {repair.files.filter((file) => file.change === "modified").length}{" "}
              modified ·{" "}
              {repair.files.filter((file) => file.change === "added").length} added
            </span>
          </article>

          <article className="rd-card rd-summary-card">
            <span className="rd-card-label">Test results</span>
            <strong>
              {repair.tests.filter((test) => test.status === "passed").length} /{" "}
              {repair.tests.length}
            </strong>
            <span className="rd-muted">
              <CheckCircle2 size={14} /> Passed tests in mock data
            </span>
          </article>

          <article className="rd-card rd-summary-card">
            <span className="rd-card-label">Created</span>
            <strong className="rd-created-date">{repair.createdAt.split(" · ")[0]}</strong>
            <span className="rd-muted">
              <Clock3 size={14} /> {repair.createdAt.split(" · ")[1]}
            </span>
          </article>
        </section>

        <section className="rd-card rd-section">
          <div className="rd-section-heading">
            <div>
              <h2>Repair information</h2>
              <p>Original issue details supplied for this demo run.</p>
            </div>
            <span className="rd-language-pill">{repair.language}</span>
          </div>

          <div className="rd-detail-field">
            <h3>Bug description</h3>
            <p>{repair.description}</p>
          </div>

          <div className="rd-detail-field">
            <button
              type="button"
              className="rd-steps-toggle"
              onClick={() => setShowAllSteps((current) => !current)}
              aria-expanded={showAllSteps}
            >
              <span>Reproduction steps</span>
              {showAllSteps ? (
                <ChevronDown size={17} />
              ) : (
                <ChevronRight size={17} />
              )}
            </button>

            {showAllSteps && (
              <ol className="rd-reproduction-list">
                {repair.reproductionSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            )}
          </div>
        </section>

        <section className="rd-card rd-section">
          <div className="rd-section-heading">
            <div>
              <h2>Status timeline</h2>
              <p>Stages for this sample repair run.</p>
            </div>
          </div>

          <div className="rd-timeline">
            {repair.stages.map((stage, index) => (
              <div className="rd-timeline-item" key={stage.id}>
                <div className="rd-timeline-rail">
                  <span className={`rd-timeline-icon ${stage.status}`}>
                    {stage.status === "completed" ? (
                      <Check size={15} />
                    ) : stage.status === "running" ? (
                      <LoaderCircle size={15} />
                    ) : stage.status === "failed" ? (
                      <X size={15} />
                    ) : (
                      <Circle size={12} />
                    )}
                  </span>
                  {index < repair.stages.length - 1 && (
                    <span className="rd-timeline-line" />
                  )}
                </div>

                <div className="rd-timeline-content">
                  <div className="rd-timeline-title-row">
                    <strong>{stage.title}</strong>
                    <span className={`rd-stage-status ${stage.status}`}>
                      {statusLabel(stage.status)}
                    </span>
                  </div>
                  <p>{stage.description}</p>
                </div>

                <span className="rd-timeline-time">{stage.time}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rd-card rd-section">
          <div className="rd-section-heading">
            <div>
              <h2>Changed files</h2>
              <p>Inspect the sample patch before making a decision.</p>
            </div>
            <span className="rd-language-pill">
              +{repair.files.reduce((total, file) => total + file.additions, 0)}{" "}
              additions
            </span>
          </div>

          <div className="rd-file-list">
            {repair.files.map((file) => (
              <FileDiff file={file} key={file.path} />
            ))}
          </div>

          <p className="rd-demo-note">
            <ShieldCheck size={16} />
            Illustrative diff only — these changes have not been applied to a repository.
          </p>
        </section>

        <section className="rd-card rd-section">
          <div className="rd-section-heading">
            <div>
              <h2>Test results</h2>
              <p>Example results for the proposed patch.</p>
            </div>
            <span className="rd-language-pill">Demo data</span>
          </div>

          <div className="rd-test-list">
            {repair.tests.map((test) => (
              <details className="rd-test-row" key={test.id}>
                <summary>
                  <span className={`rd-test-icon ${test.status}`}>
                    {test.status === "passed" ? (
                      <CheckCircle2 size={17} />
                    ) : test.status === "failed" ? (
                      <XCircle size={17} />
                    ) : (
                      <Circle size={17} />
                    )}
                  </span>

                  <span className="rd-test-name">{test.name}</span>
                  <span className={`rd-test-status ${test.status}`}>
                    {test.status}
                  </span>
                  <span className="rd-test-duration">{test.duration}</span>
                </summary>

                <p className="rd-test-output">{test.output}</p>
              </details>
            ))}
          </div>

          <p className="rd-demo-note">
            <Play size={15} />
            No tests were executed by this frontend page.
          </p>
        </section>

        <section className="rd-card rd-actions-section">
          <div>
            <h2>Review decision</h2>
            <p>
              Inspect the proposed changes before choosing an action.
            </p>
          </div>

          <div className="rd-action-buttons">
            {isAwaitingReview ? (
              <>
                <button
                  type="button"
                  className="rd-button danger-outline"
                  onClick={() => handleDecision("cancelled")}
                >
                  <X size={16} />
                  Cancel repair
                </button>

                <button
                  type="button"
                  className="rd-button secondary"
                  onClick={() => handleDecision("rejected")}
                >
                  <XCircle size={16} />
                  Reject patch
                </button>

                <button
                  type="button"
                  className="rd-button primary"
                  onClick={() => handleDecision("approved")}
                >
                  <CheckCircle2 size={16} />
                  Approve patch
                </button>
              </>
            ) : (
              <button
                type="button"
                className="rd-button secondary"
                onClick={handleRestart}
                disabled={isRestarting}
              >
                <RotateCcw size={16} />
                {isRestarting ? "Resetting..." : "Reset demo"}
              </button>
            )}
          </div>
        </section>

        <p className="rd-footer-note">
          PatchPilot frontend prototype · All repair details, diffs and test results on
          this page are mock data.
        </p>
      </div>
    </main>
  );
}