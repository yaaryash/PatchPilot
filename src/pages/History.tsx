
import { Clock3 } from "lucide-react";
import { Card, Badge } from "../components/ui";

export default function History() {
  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">ACTIVITY LOG</p><h1>Repair history</h1>
          <p className="muted">Review previous repair runs and their outcomes.</p></div>
        <Badge>0 runs</Badge>
      </div>
      <Card className="empty-state">
        <span className="empty-icon"><Clock3 size={25} /></span>
        <h2>No repair history</h2>
        <p className="muted">Your repair runs will appear here when execution is implemented.</p>
      </Card>
    </>
  );
}
