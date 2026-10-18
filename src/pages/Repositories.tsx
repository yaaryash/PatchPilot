
import { GitBranch, Plus } from "lucide-react";
import { Card, Button, Badge } from "../components/ui";

export default function Repositories() {
  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">YOUR CODEBASES</p><h1>Repositories</h1>
          <p className="muted">Manage codebases for your repair workflows.</p></div>
        <Button variant="secondary" disabled><Plus size={17} /> Connect repository</Button>
      </div>
      <Card className="empty-state">
        <span className="empty-icon"><GitBranch size={25} /></span>
        <h2>No repositories yet</h2>
        <p className="muted">Repository connection will be implemented in a later feature.</p>
        <Badge>0 repositories</Badge>
      </Card>
    </>
  );
}
