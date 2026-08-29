import Link from "next/link";
export default function BrandLogo({ compact = false, href = "/" }: { compact?: boolean; href?: string }) {
  return (
    <Link href={href} aria-label="RiskSentinel X home" className="inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
      <span aria-hidden="true" className={compact ? "brand-mark-image" : "brand-wordmark-image"} />
    </Link>
  );
}
