import type { ReactNode } from "react";

type ShowcaseFrameProps = {
  children: ReactNode;
  tone?: "blue" | "pearl" | "mint";
  caption?: string;
  compact?: boolean;
};

export default function ShowcaseFrame({ children, tone = "blue", caption, compact = false }: ShowcaseFrameProps) {
  return (
    <figure className="landing-showcase" data-tone={tone} data-compact={compact}>
      <div className="landing-showcase-window">{children}</div>
      {caption && <figcaption className="landing-showcase-caption">{caption}</figcaption>}
    </figure>
  );
}
