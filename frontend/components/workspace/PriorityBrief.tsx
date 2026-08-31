import type { ReactNode } from "react";
import "../../styles/recommendations.css";

type PriorityBriefProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: { label: string; value: string | number }[];
  action?: ReactNode;
};

export default function PriorityBrief({ eyebrow, title, description, stats, action }: PriorityBriefProps) {
  return (
    <section className="recommendations-brief workspace-priority-brief" aria-label={eyebrow}>
      <div className="recommendations-brief-content">
        <div className="recommendations-brief-copy">
          <p className="recommendations-brief-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <div className="priority-brief-footer">
            <p className="recommendations-brief-description">{description}</p>
            {action && <div className="priority-brief-action">{action}</div>}
          </div>
        </div>
        <dl className="recommendations-brief-stats">
          {stats.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </div>
    </section>
  );
}
