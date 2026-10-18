
import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  LoaderCircle,
  RotateCcw,
  Wrench,
} from "lucide-react";

import { Badge, Button, Card } from "../components/ui";
import { mockRepositories } from "../data/mockRepositories";

type RepairForm = {
  repositoryId: string;
  title: string;
  description: string;
  reproductionSteps: string;
};

type FormErrors = Partial<Record<keyof RepairForm, string>>;

const initialForm: RepairForm = {
  repositoryId: "",
  title: "",
  description: "",
  reproductionSteps: "",
};

function validateForm(form: RepairForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.repositoryId) {
    errors.repositoryId = "Please select a repository.";
  }

  if (!form.title.trim()) {
    errors.title = "Bug title is required.";
  } else if (form.title.trim().length < 5) {
    errors.title = "Title must contain at least 5 characters.";
  } else if (form.title.trim().length > 120) {
    errors.title = "Title cannot exceed 120 characters.";
  }

  if (!form.description.trim()) {
    errors.description = "Bug description is required.";
  } else if (form.description.trim().length < 20) {
    errors.description = "Description must contain at least 20 characters.";
  } else if (form.description.trim().length > 2000) {
    errors.description = "Description cannot exceed 2,000 characters.";
  }

  if (!form.reproductionSteps.trim()) {
    errors.reproductionSteps = "Reproduction steps are required.";
  } else if (form.reproductionSteps.trim().length < 10) {
    errors.reproductionSteps =
      "Please provide enough detail to reproduce the issue.";
  } else if (form.reproductionSteps.trim().length > 3000) {
    errors.reproductionSteps =
      "Reproduction steps cannot exceed 3,000 characters.";
  }

  return errors;
}

export default function NewRepair() {
  const [form, setForm] = useState<RepairForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  useEffect(() => {
    if (!isSubmitting) return;

    const timer = window.setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        "Demo submission completed. No repair was executed and no data was saved."
      );
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [isSubmitting]);

  function updateField<K extends keyof RepairForm>(
    field: K,
    value: RepairForm[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSuccessMessage("");
    setSubmissionError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    setSuccessMessage("");
    setSubmissionError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // DEVELOPMENT ONLY: simulate a submission.
    // This does not call an API or start a real repair.
    setIsSubmitting(true);
  }

  function handleReset() {
    if (isSubmitting) return;

    setForm(initialForm);
    setErrors({});
    setSuccessMessage("");
    setSubmissionError("");
  }

  const selectedRepository = mockRepositories.find(
    (repository) => repository.id === form.repositoryId,
  );

  return (
    <>
      <div className="page-heading repair-page-heading">
        <div>
          <p className="eyebrow">REPAIR WORKFLOW / NEW TASK</p>
          <h1>Start a new repair</h1>
          <p className="muted">
            Describe the bug and explain how to reproduce it.
          </p>
        </div>

        <Badge>Development mode</Badge>
      </div>

      <div className="repair-development-notice" role="note">
        <AlertCircle size={17} />
        <div>
          <strong>Development-only form</strong>
          <p>
            Repository data is fictional. Submission is simulated; no code
            analysis, repair execution, or persistent storage is connected.
          </p>
        </div>
      </div>

      <form className="new-repair-form" onSubmit={handleSubmit} noValidate>
        <Card className="repair-form-card">
          <div className="repair-section-heading">
            <span className="repair-section-icon"><GitBranch size={18} /></span>
            <div>
              <h2>Repository</h2>
              <p className="muted">Choose the codebase containing the bug.</p>
            </div>
          </div>

          <label className="repair-field">
            <span>Repository <span className="required-mark">*</span></span>
            <select
              value={form.repositoryId}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.repositoryId)}
              aria-describedby={
                errors.repositoryId ? "repository-error" : undefined
              }
              onChange={(event) =>
                updateField("repositoryId", event.target.value)
              }
            >
              <option value="">Select a repository</option>
              {mockRepositories.map((repository) => (
                <option key={repository.id} value={repository.id}>
                  {repository.name} — {repository.language}
                </option>
              ))}
            </select>

            {errors.repositoryId && (
              <span className="field-error" id="repository-error" role="alert">
                {errors.repositoryId}
              </span>
            )}
          </label>

          {selectedRepository && (
            <div className="selected-repository">
              <GitBranch size={15} />
              <span>
                <strong>{selectedRepository.name}</strong>
                <span className="muted">Branch: {selectedRepository.branch}</span>
              </span>
              <Badge>{selectedRepository.language}</Badge>
            </div>
          )}
        </Card>

        <Card className="repair-form-card">
          <div className="repair-section-heading">
            <span className="repair-section-icon"><Wrench size={18} /></span>
            <div>
              <h2>Bug details</h2>
              <p className="muted">
                Provide a clear title and describe the unexpected behavior.
              </p>
            </div>
          </div>

          <label className="repair-field">
            <span>Bug title <span className="required-mark">*</span></span>
            <input
              type="text"
              value={form.title}
              minLength={5}
              maxLength={120}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : "title-hint"}
              placeholder="e.g. Payment handler crashes on null response"
              onChange={(event) => updateField("title", event.target.value)}
            />
            {errors.title ? (
              <span className="field-error" id="title-error" role="alert">
                {errors.title}
              </span>
            ) : (
              <span className="field-hint" id="title-hint">
                5–120 characters · {form.title.length}/120
              </span>
            )}
          </label>

          <label className="repair-field">
            <span>Bug description <span className="required-mark">*</span></span>
            <textarea
              value={form.description}
              minLength={20}
              maxLength={2000}
              rows={5}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? "description-error" : "description-hint"
              }
              placeholder="What happened? What did you expect to happen? Include relevant error messages..."
              onChange={(event) =>
                updateField("description", event.target.value)
              }
            />
            {errors.description ? (
              <span className="field-error" id="description-error" role="alert">
                {errors.description}
              </span>
            ) : (
              <span className="field-hint" id="description-hint">
                20–2,000 characters · {form.description.length}/2000
              </span>
            )}
          </label>
        </Card>

        <Card className="repair-form-card">
          <div className="repair-section-heading">
            <span className="repair-section-icon"><RotateCcw size={18} /></span>
            <div>
              <h2>Reproduction steps</h2>
              <p className="muted">
                Explain how someone can trigger the bug.
              </p>
            </div>
          </div>

          <label className="repair-field">
            <span>Steps to reproduce <span className="required-mark">*</span></span>
            <textarea
              value={form.reproductionSteps}
              minLength={10}
              maxLength={3000}
              rows={5}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.reproductionSteps)}
              aria-describedby={
                errors.reproductionSteps
                  ? "steps-error"
                  : "steps-hint"
              }
              placeholder={"1. Start the application\n2. Send a request with the problematic input\n3. Observe the error"}
              onChange={(event) =>
                updateField("reproductionSteps", event.target.value)
              }
            />
            {errors.reproductionSteps ? (
              <span className="field-error" id="steps-error" role="alert">
                {errors.reproductionSteps}
              </span>
            ) : (
              <span className="field-hint" id="steps-hint">
                10–3,000 characters · {form.reproductionSteps.length}/3000
              </span>
            )}
          </label>
        </Card>

        {submissionError && (
          <div className="repair-feedback repair-feedback-error" role="alert">
            <AlertCircle size={18} /> {submissionError}
          </div>
        )}

        {successMessage && (
          <div className="repair-feedback repair-feedback-success" role="status">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="repair-form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset form
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderCircle size={16} className="repair-submit-spinner" />
                Preparing demo...
              </>
            ) : (
              <>
                Start Repair <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
