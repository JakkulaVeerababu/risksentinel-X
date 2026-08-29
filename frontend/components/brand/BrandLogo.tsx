import Link from "next/link";
export default function BrandLogo({ compact = false, inverse = false, href = "/" }: { compact?: boolean; inverse?: boolean; href?: string }) {
  return (
    <Link href={href} aria-label="RiskSentinel X home" className="inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
      <span aria-hidden="true" className={`brand-wordmark ${compact ? "brand-wordmark-compact" : ""} ${inverse ? "brand-wordmark-inverse" : ""}`}>
        <span>RiskSentinel</span><span className="brand-x">X</span>
      </span>
    </Link>
  );
}
