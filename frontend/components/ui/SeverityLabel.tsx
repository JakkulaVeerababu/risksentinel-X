import "../../styles/severity.css";

export default function SeverityLabel({ severity }: { severity: string }) {
  const normalized = severity.toLowerCase();
  const level = ["critical", "high", "medium", "low"].includes(normalized) ? normalized : "unknown";
  const label = level.charAt(0).toUpperCase() + level.slice(1);
  return <span className="risk-severity" data-level={level}><span aria-hidden="true" />{label}</span>;
}
