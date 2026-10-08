"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const STEPS = [
  { title: "Describe your idea", image: "/1.webp", eyebrow: "IDEA", copy: "Start with a thought, a prompt or a feeling." },
  { title: "AI creates the design", image: "/how/01-editor.webp", eyebrow: "AI DESIGN", copy: "Ryfio turns your words into a visual direction." },
  { title: "Preview the product", image: "/how/03-preview.webp", eyebrow: "PRODUCT", copy: "See the design come to life on a real product." },
  { title: "Order or sell online", image: "/how/04-my-products.webp", eyebrow: "BUSINESS", copy: "Launch it, order it or share it with your audience." },
] as const;

export default function IdeaToIncomeStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner || reducedMotion) return;

    const update = () => {
      frameRef.current = null;
      const rect = section.getBoundingClientRect();
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollDistance));
      const nextStep = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));

      inner.style.setProperty("--story-progress", progress.toFixed(4));
      if (nextStep !== activeStep) setActiveStep(nextStep);
    };

    const onScroll = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [activeStep, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[250vh] overflow-hidden bg-[#1d1726] lg:min-h-[360vh]"
      aria-label="From idea to income"
    >
      <div
        ref={innerRef}
        className="sticky top-0 flex min-h-screen items-center overflow-hidden py-14 sm:py-20"
        style={{ "--story-progress": "0" } as CSSProperties}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_85%_50%,rgba(14,165,233,0.14),transparent_24%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div className="story-media relative mx-auto h-[300px] w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/10 bg-black/20 shadow-[0_30px_90px_rgba(93,35,142,0.3)] sm:h-[420px] lg:h-[560px]">
              {STEPS.map((step, index) => (
                <Image
                  key={step.image}
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className={`absolute inset-0 object-cover object-center transition-[opacity,transform,filter] duration-700 ease-out ${index === activeStep ? "scale-100 opacity-100 blur-0" : "scale-110 opacity-0 blur-sm"}`}
                  priority={index === 0}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090611]/70 via-transparent to-purple-500/10" />
              <div className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] font-black tracking-[0.28em] text-white/75 backdrop-blur-md">
                {STEPS[activeStep].eyebrow}
              </div>
              <div className="absolute right-5 top-5 flex gap-1.5">
                {STEPS.map((step, index) => (
                  <span key={step.title} className={`h-1.5 rounded-full transition-all duration-500 ${index <= activeStep ? "w-7 bg-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.8)]" : "w-2 bg-white/25"}`} />
                ))}
              </div>
            </div>

            <div className="relative p-0 lg:p-4">
              <div className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-purple-400">From idea to income</div>

              <h2 className="mb-5 text-3xl font-black uppercase leading-[0.94] tracking-tight md:text-6xl lg:whitespace-nowrap">
                Build a product <span className="bg-gradient-to-r from-violet-300 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">people want</span>
              </h2>

              <p className="mb-7 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
                No designer, no inventory and no complicated setup. Bring the idea — Ryfio helps you turn it into a product ready to sell.
              </p>

              <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur-md transition duration-500 sm:px-5">
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.25em] text-fuchsia-300">{STEPS[activeStep].eyebrow}</div>
                <p className="text-sm font-semibold text-white sm:text-base">{STEPS[activeStep].copy}</p>
              </div>

              <div className="grid gap-3">
                {STEPS.map((step, index) => {
                  const isActive = index === activeStep;
                  const isComplete = index < activeStep;
                  return (
                    <div
                      key={step.title}
                      className={`flex items-center gap-3 rounded-2xl border p-3 transition-[border-color,background,box-shadow,opacity,transform] duration-500 sm:p-4 ${isActive ? "translate-x-1 border-fuchsia-400/50 bg-fuchsia-400/[0.11] shadow-[0_0_30px_rgba(168,85,247,0.16)]" : isComplete ? "border-purple-400/25 bg-white/[0.045] opacity-80" : "border-white/10 bg-white/[0.025] opacity-45"}`}
                    >
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition duration-500 ${isActive || isComplete ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-[0_0_16px_rgba(217,70,239,0.5)]" : "bg-white/10 text-white/45"}`}>
                        {isComplete ? "✓" : index + 1}
                      </div>
                      <p className="text-sm font-semibold text-white/80 sm:text-base">{step.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
