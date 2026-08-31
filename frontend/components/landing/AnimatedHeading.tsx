"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type AnimatedHeadingProps = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  accentLine?: number;
};

/** Keeps the complete sentence in the accessibility tree and reserves its layout. */
export default function AnimatedHeading({ text, as: Tag = "h2", className = "", accentLine }: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [phase, setPhase] = useState<"static" | "waiting" | "playing">("static");

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const heading = ref.current;
    if (!heading) return;
    let observer: IntersectionObserver | undefined;

    const observe = () => {
      observer?.disconnect();
      if (preference.matches || !("IntersectionObserver" in window)) {
        setPhase("static");
        return;
      }
      setPhase("waiting");
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= .18) setPhase("playing");
        // Reset only after leaving the viewport, not on small scroll movements.
        else if (!entry.isIntersecting) setPhase("waiting");
      }, { threshold: [0, .18], rootMargin: "0px 0px -4% 0px" });
      observer.observe(heading);
    };
    observe();
    preference.addEventListener("change", observe);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", observe);
    };
  }, [text]);

  let characterIndex = 0;
  const stagger = Math.min(18, 700 / Math.max(1, text.replace(/\s/g, "").length));
  return (
    <Tag ref={ref} className={"letter-heading " + className} data-reveal={phase}>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      <span aria-hidden="true">
        {text.split("\n").map((line, lineIndex) => (
          <span key={lineIndex} className={(lineIndex > 0 ? "block -mt-2 sm:-mt-4 " : "") + (accentLine === lineIndex ? "text-[#2f6bff]" : "")}>
            {line.split(" ").map((word, wordIndex) => (
              <span key={wordIndex}>
                {wordIndex > 0 ? " " : null}
                <span className={`inline-block whitespace-nowrap ${word === "workspace." ? "font-serif italic font-bold text-[1.15em] tracking-normal align-baseline" : ""}`}>
                  {Array.from(word).map((letter, index) => {
                    const delay = characterIndex++ * stagger;
                    return <span key={index} className="reveal-letter" style={{ "--letter-delay": delay + "ms" } as CSSProperties}>{letter}</span>;
                  })}
                </span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}
