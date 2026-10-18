
import { GitBranch, History, Wrench, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Card, Button } from "../components/ui";

export default function Dashboard() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Good to see you, Developer.</h1>
          <p className="muted">Monitor your repositories and AI-powered repair workflows.</p>
        </div>
        <Link to="/repair"><Button>＋ New repair</Button></Link>
      </div>

      <div className="stats-grid">
        {[
          { label: "Repositories", value: "0", icon: GitBranch },
          { label: "Repair runs", value: "0", icon: Wrench },
          { label: "Completed repairs", value: "0", icon: History },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="stat-card">
            <div className="stat-top"><span>{label}</span><Icon size={19} /></div>
            <strong className="stat-value">{value}</strong>
            <span className="muted stat-caption">No activity yet</span>
          </Card>
        ))}
      </div>

      <div className="section-heading">
        <div><h2>Get started</h2><p className="muted">Set up your workspace in a few steps.</p></div>
        <Badge tone="neutral">Setup required</Badge>
      </div>

      <div className="starter-grid">
        <Card className="starter-card">
          <span className="step-number">01</span>
          <GitBranch size={23} />
          <h3>Connect a repository</h3>
          <p className="muted">Choose the codebase you want PatchPilot to inspect.</p>
          <Link to="/repositories" className="text-link">Explore repositories <ArrowUpRight size={15} /></Link>
        </Card>
        <Card className="starter-card">
          <span className="step-number">02</span>
          <Wrench size={23} />
          <h3>Start a repair</h3>
          <p className="muted">Prepare a repair task for your codebase.</p>
          <Link to="/repair" className="text-link">Create repair <ArrowUpRight size={15} /></Link>
        </Card>
      </div>
    </>
  );
}
