
import { useState } from "react";
import { Card, Button, Badge } from "../components/ui";

export default function NewRepair() {
  const [repository, setRepository] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert("UI foundation only: repair execution will be added in a later feature.");
  }

  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">REPAIR WORKFLOW</p><h1>New repair</h1>
          <p className="muted">Describe the issue you want PatchPilot to investigate.</p></div>
        <Badge>Draft</Badge>
      </div>
      <Card className="form-card">
        <form onSubmit={handleSubmit} className="repair-form">
          <label>Repository
            <select required value={repository} onChange={(e) => setRepository(e.target.value)}>
              <option value="">Select a repository</option>
            </select>
          </label>
          <p className="field-hint">No repositories available yet. Repository integration comes later.</p>
          <label>Issue description
            <textarea required rows={5} value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the bug, unexpected behavior, or failing test..." />
          </label>
          <div className="form-footer">
            <span className="muted">Execution is not connected yet.</span>
            <Button type="submit" disabled={!repository || !description.trim()}>Prepare repair</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
