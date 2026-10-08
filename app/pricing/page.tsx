"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Crown,
  CreditCard,
  HelpCircle,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

const safeHref = (href: string) => {
  if (typeof href !== "string") return "/";
  const clean = href.trim().toLowerCase();
  if (clean.startsWith("javascript:") || clean.startsWith("data:")) return "/";
  return href;
};

const safeText = (val: unknown) => {
  if (typeof val !== "string") return "";
  return val.replace(/<script.*?>.*?<\/script>/gi, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

const formatEuro = (value: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

const PLANS = Object.freeze([
  {
    icon: Sparkles,
    name: "Starter",
    price: "Free",
    desc: "Perfect to start your first products.",
    features: ["Basic product creation", "Limited customization", "Community support"],
    button: "Start for free",
    href: "/signup",
    highlight: false,
  },
  {
    icon: Crown,
    name: "Pro",
    price: "€19 / month",
    desc: "Best for growing creators.",
    features: ["Unlimited products", "Advanced customization", "Priority support", "Discount codes"],
    button: "Get Pro",
    href: "/signup",
    highlight: true,
  },
  {
    icon: ShieldCheck,
    name: "Business",
    price: "€49 / month",
    desc: "For serious brands and scaling stores.",
    features: ["Everything in Pro", "Automation tools", "Analytics dashboard", "Dedicated support"],
    button: "Contact sales",
    href: "/contact",
    highlight: false,
  },
]);

const COMPARISON = Object.freeze([
  { feature: "Monthly price", starter: "Free", pro: "€19", business: "€49" },
  { feature: "Product creation", starter: true, pro: true, business: true },
  { feature: "Product limits", starter: "Limited", pro: "Unlimited", business: "Unlimited" },
  { feature: "AI design tools", starter: "Basic", pro: "Advanced", business: "Advanced" },
  { feature: "Store integrations", starter: false, pro: true, business: true },
  { feature: "Discount codes", starter: false, pro: true, business: true },
  { feature: "Analytics dashboard", starter: false, pro: false, business: true },
  { feature: "Automation tools", starter: false, pro: false, business: true },
  { feature: "Priority support", starter: false, pro: true, business: true },
  { feature: "Dedicated support", starter: false, pro: false, business: true },
]);

const FAQS = Object.freeze([
  {
    question: "Can I start for free?",
    answer: "Yes. The Starter plan is listed as free and links to the normal sign-up flow.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "The plans are structured so creators can begin small and move to Pro or Business when they need more tools.",
  },
  {
    question: "Do you offer yearly billing?",
    answer: "This page currently shows monthly pricing only because yearly billing support was not found in the pricing implementation.",
  },
  {
    question: "What is included in the free plan?",
    answer: "Starter includes basic product creation, limited customization and community support according to the current pricing data.",
  },
  {
    question: "Which plan is best for creators?",
    answer: "Starter fits first tests, Pro is highlighted for growing creators, and Business is aimed at brands that need analytics, automation and dedicated support.",
  },
]);

function Pill({ icon: Icon, children }: { icon: typeof Sparkles; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/35 bg-purple-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[0_0_28px_rgba(168,85,247,0.24)]">
      <Icon size={13} className="text-fuchsia-300" aria-hidden="true" />
      {children}
    </div>
  );
}

function IncludedValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? <Check size={16} className="mx-auto text-fuchsia-300" aria-label="Included" /> : <span className="text-white/34">—</span>;
  }
  return <span>{safeText(value)}</span>;
}

function PricingCard({ plan }: { plan: (typeof PLANS)[number] }) {
  const Icon = plan.icon;
  return (
    <article
      className={`relative flex min-h-[390px] flex-col rounded-[16px] border p-6 transition duration-300 hover:-translate-y-0.5 md:min-h-[470px] md:p-8 lg:min-h-[520px] lg:p-9 ${
        plan.highlight
          ? "border-fuchsia-500/70 bg-[linear-gradient(180deg,rgba(94,28,140,.42),rgba(255,255,255,.045))] shadow-[0_0_44px_rgba(168,85,247,.34)]"
          : "border-white/12 bg-white/[0.035] shadow-[0_18px_60px_rgba(0,0,0,.24)] hover:border-fuchsia-300/35"
      }`}
    >
      {plan.highlight && (
        <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-white shadow-[0_0_22px_rgba(217,70,239,.55)]">
          Most popular
        </div>
      )}
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/12 bg-white/[0.055] text-fuchsia-200 lg:h-14 lg:w-14">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h2 className="text-base font-black uppercase tracking-[-0.025em] text-white lg:text-lg">{safeText(plan.name)}</h2>
      <p className="mt-3 text-[34px] font-black leading-none tracking-[-0.07em] text-white lg:text-[40px]">{safeText(plan.price)}</p>
      <p className="mt-4 min-h-[44px] text-base font-medium leading-relaxed text-white/66">{safeText(plan.desc)}</p>
      <div className="mb-8 mt-8 space-y-4 text-base font-medium text-white/82 lg:mb-10 lg:mt-9">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/30 text-fuchsia-200">
              <Check size={12} aria-hidden="true" />
            </span>
            <span className="leading-tight">{safeText(feature)}</span>
          </div>
        ))}
      </div>
      <Link
        href={safeHref(plan.href)}
        className={`mt-auto inline-flex h-14 items-center justify-center gap-2 rounded-xl text-base font-black transition focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-[#080711] ${
          plan.highlight
            ? "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 text-white shadow-[0_0_32px_rgba(217,70,239,.42)] hover:brightness-110"
            : "border border-white/12 bg-white/[0.055] text-white hover:border-fuchsia-300/40 hover:bg-white/[0.09]"
        }`}
      >
        {safeText(plan.button)}
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </article>
  );
}

function ProfitEstimator() {
  const [sellingPrice, setSellingPrice] = useState(25);
  const [productCost, setProductCost] = useState(8);
  const [shippingCost, setShippingCost] = useState(4);
  const [monthlySales, setMonthlySales] = useState(100);

  const numbers = useMemo(() => {
    const profitPerSale = Math.max(sellingPrice - productCost - shippingCost, 0);
    return {
      profitPerSale,
      revenue: sellingPrice * monthlySales,
      monthlyProfit: profitPerSale * monthlySales,
      costPerSale: productCost + shippingCost,
    };
  }, [sellingPrice, productCost, shippingCost, monthlySales]);

  const fields = [
    { label: "Selling price", value: sellingPrice, min: 5, max: 80, prefix: "€", onChange: setSellingPrice },
    { label: "Product cost", value: productCost, min: 1, max: 40, prefix: "€", onChange: setProductCost },
    { label: "Shipping / fulfillment cost", value: shippingCost, min: 0, max: 25, prefix: "€", onChange: setShippingCost },
    { label: "Estimated monthly sales", value: monthlySales, min: 1, max: 500, prefix: "", onChange: setMonthlySales },
  ];

  return (
    <section className="relative mx-auto max-w-[1800px] px-4 md:px-8 lg:px-12">
      <div className="relative overflow-hidden rounded-[22px] border border-purple-400/22 bg-[linear-gradient(135deg,rgba(49,20,74,.42),rgba(255,255,255,.025)_48%,rgba(73,28,112,.22))] p-6 shadow-[0_0_80px_rgba(124,58,237,.14)] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_48%,rgba(168,85,247,.18),transparent_28%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[0.82fr_1.16fr_1fr] lg:items-center">
          <div>
            <Pill icon={BarChart3}>Profit estimator</Pill>
            <h2 className="mt-5 max-w-[580px] text-[42px] font-black uppercase leading-[0.91] tracking-[-0.055em] sm:text-[56px] lg:text-[60px] xl:text-[66px]">
              See how much<br />
              you could <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">make</span>
            </h2>
            <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-white/70">
              Estimate potential revenue and profit from the products you create and sell. Costs are editable estimator inputs.
            </p>
          </div>

          <div className="relative mx-auto flex min-h-[540px] w-full max-w-[780px] items-center justify-center">
            <div className="absolute h-72 w-[132%] rotate-[-18deg] rounded-[50%] border-2 border-fuchsia-500/70 shadow-[0_0_52px_rgba(217,70,239,.44)]" />
            <div className="absolute h-64 w-[112%] rotate-[18deg] rounded-[50%] border border-violet-400/35" />
            <Image
              src="/custom-products/custom-t-shirts.webp"
              alt="Custom t-shirt product preview"
              width={680}
              height={820}
              className="relative z-10 max-h-[590px] w-auto object-contain drop-shadow-[0_46px_76px_rgba(0,0,0,.66)]"
            />
            <div className="absolute bottom-24 left-[8%] z-30 rounded-2xl border border-fuchsia-400/35 bg-[#120b1d]/92 p-5 shadow-[0_0_38px_rgba(168,85,247,.28)] backdrop-blur-xl">
              <BarChart3 className="mb-3 text-fuchsia-300" size={32} aria-hidden="true" />
              <p className="text-base font-black leading-tight">Your design.</p>
              <p className="mt-1 text-sm font-semibold text-white/68">Your profit.</p>
            </div>
            <div className="absolute bottom-14 right-[3%] z-30 rounded-2xl border border-fuchsia-400/35 bg-[#120b1d]/92 p-5 shadow-[0_0_38px_rgba(168,85,247,.28)] backdrop-blur-xl">
              <Star className="mb-3 text-fuchsia-300" size={32} aria-hidden="true" />
              <p className="text-base font-black leading-tight">Turn ideas</p>
              <p className="mt-1 text-sm font-semibold text-white/68">into income.</p>
            </div>
          </div>

          <div className="rounded-[18px] border border-white/12 bg-[#0c0b14]/72 shadow-[0_20px_60px_rgba(0,0,0,.26)] backdrop-blur-xl">
            <div className="space-y-4 p-5 sm:p-6">
              {fields.map((field) => (
                <label key={field.label} className="grid gap-2">
                  <span className="text-sm font-bold text-white/82">
                    {field.label}
                    <HelpCircle className="ml-1 inline h-3.5 w-3.5 text-white/35" aria-hidden="true" />
                  </span>
                  <span className="flex items-center gap-4">
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      value={field.value}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                      className="pricing-range h-2 flex-1 accent-fuchsia-400"
                      aria-label={field.label}
                    />
                    <span className="flex h-11 w-24 items-center justify-center rounded-lg border border-white/12 bg-white/[0.035] text-sm font-bold">
                      {field.prefix}
                      {field.value}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <div className="border-t border-white/10 p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-white/60">Estimated monthly profit</p>
              <p className="mt-2 text-5xl font-black tracking-[-0.08em] text-fuchsia-300">{formatEuro(numbers.monthlyProfit)}</p>
              <div className="mt-5 grid grid-cols-3 divide-x divide-white/10 border-t border-white/8 pt-4 text-sm">
                <div>
                  <p className="text-white/50">Revenue</p>
                  <p className="mt-1 text-xl font-bold text-fuchsia-200">{formatEuro(numbers.revenue)}</p>
                </div>
                <div className="pl-4">
                  <p className="text-white/50">Cost per sale</p>
                  <p className="mt-1 text-xl font-bold text-fuchsia-200">{formatEuro(numbers.costPerSale)}</p>
                </div>
                <div className="pl-4">
                  <p className="text-white/50">Profit per sale</p>
                  <p className="mt-1 text-xl font-bold text-fuchsia-200">{formatEuro(numbers.profitPerSale)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="relative mx-auto max-w-[1800px] px-4 pt-14 md:px-8 lg:px-12">
      <div className="mb-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Pill icon={SlidersHorizontal}>Compare plans</Pill>
          <h2 className="mt-4 text-3xl font-black uppercase leading-tight tracking-[-0.06em] sm:text-5xl">
            Find the plan that <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">fits you</span>
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-white/58">Compare features and choose the plan that matches how you create and grow.</p>
      </div>

      <div className="overflow-x-auto rounded-[14px] border border-white/12 bg-white/[0.025] [scrollbar-width:thin]">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-fuchsia-400/25 text-[11px] font-black uppercase tracking-[0.12em] text-white">
              <th className="w-[25%] px-6 py-4">Features</th>
              <th className="px-6 py-4 text-center">Starter</th>
              <th className="bg-purple-500/22 px-6 py-4 text-center shadow-[inset_0_2px_0_rgba(217,70,239,.7)]">Pro</th>
              <th className="px-6 py-4 text-center">Business</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.feature} className="border-b border-white/7 last:border-b-0">
                <th className="px-6 py-3 text-xs font-black text-white/92">{safeText(row.feature)}</th>
                <td className="px-6 py-3 text-center text-white/82"><IncludedValue value={row.starter} /></td>
                <td className="bg-purple-500/14 px-6 py-3 text-center text-white"><IncludedValue value={row.pro} /></td>
                <td className="px-6 py-3 text-center text-white/82"><IncludedValue value={row.business} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { icon: CreditCard, title: "No hidden fees", text: "What you see is what you pay." },
    { icon: Sparkles, title: "Clear plan steps", text: "Start small and scale." },
    { icon: Zap, title: "Start for free", text: "Starter is listed as free." },
    { icon: BarChart3, title: "Upgrade anytime", text: "Move to more tools as you grow." },
  ];
  return (
    <section className="mx-auto max-w-[1800px] px-4 pt-6 md:px-8 lg:px-12">
      <div className="grid gap-4 rounded-[14px] border border-purple-400/18 bg-[linear-gradient(90deg,rgba(95,35,145,.34),rgba(255,255,255,.035),rgba(95,35,145,.24))] p-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-center gap-4">
              <Icon className="h-9 w-9 text-fuchsia-300" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-black uppercase">{safeText(item.title)}</h3>
                <p className="mt-1 text-xs text-white/62">{safeText(item.text)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto grid max-w-[1800px] gap-8 px-4 py-16 md:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-12">
      <div>
        <Pill icon={HelpCircle}>FAQ</Pill>
        <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.07em] sm:text-5xl">
          Pricing <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">FAQ</span>
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/64">Quick answers to the most common questions about our plans and pricing.</p>
        <Link href={safeHref("/support")} className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl border border-white/12 bg-white/[0.055] px-6 text-sm font-black hover:border-fuchsia-300/40">
          Contact support
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <div className="space-y-2">
        {FAQS.map((item, index) => {
          const expanded = open === index;
          return (
            <div key={item.question} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.035]">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fuchsia-300"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? -1 : index)}
              >
                {safeText(item.question)}
                <ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-white/62">{safeText(item.answer)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050711] text-white">
      <section className="relative overflow-hidden px-4 pb-8 pt-20 text-center md:px-8 lg:px-12 lg:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(168,85,247,.34),transparent_25%),radial-gradient(circle_at_10%_8%,rgba(14,165,233,.16),transparent_22%),linear-gradient(180deg,#06101e_0%,#070712_42%,#050711_100%)]" />
        <div className="absolute inset-x-0 top-0 h-60 bg-[radial-gradient(ellipse_at_top,rgba(217,70,239,.2),transparent_58%)]" />
        <div className="relative mx-auto max-w-6xl">
          <Pill icon={Zap}>Flexible plans for every creator</Pill>
          <h1 className="mt-6 text-5xl font-black uppercase leading-[0.9] tracking-[-0.075em] sm:text-6xl md:text-7xl">
            Simple <span className="bg-gradient-to-r from-violet-300 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/68 sm:text-base">Start free and scale as you grow. No hidden fees, no surprises.</p>
          <div className="mx-auto mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.055] p-1 text-xs font-black">
            <span className="rounded-full bg-white px-7 py-3 text-black">Monthly</span>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-8 md:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-6 md:grid-cols-3 lg:gap-8 xl:max-w-[1460px]">
          {PLANS.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      <ProfitEstimator />
      <ComparisonSection />
      <TrustStrip />
      <FaqSection />

      <section className="relative overflow-hidden border-t border-purple-400/16 px-4 py-20 text-center md:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2%_100%,rgba(37,99,235,.62),transparent_21%),radial-gradient(circle_at_10%_100%,rgba(168,85,247,.55),transparent_28%),radial-gradient(circle_at_96%_100%,rgba(124,58,237,.62),transparent_24%),linear-gradient(180deg,#050711_0%,#130820_100%)]" />
        <div className="absolute -bottom-28 left-[-8%] h-60 w-[42%] rounded-[50%] bg-blue-600/40 blur-3xl" />
        <div className="absolute -bottom-24 right-[-8%] h-60 w-[42%] rounded-[50%] bg-fuchsia-700/45 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <Pill icon={Zap}>Start creating</Pill>
          <h2 className="mt-6 text-4xl font-black uppercase leading-tight tracking-[-0.065em] sm:text-6xl">
            Turn your ideas into <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">products</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/66 sm:text-base">Start creating for free and upgrade when you need more.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={safeHref("/signup")} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 text-sm font-black shadow-[0_0_34px_rgba(217,70,239,.38)] hover:brightness-110">
              Start for free
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href={safeHref("/catalog")} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.055] px-8 text-sm font-black hover:border-fuchsia-300/40">
              Explore products
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .pricing-range::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,.12);
        }
        .pricing-range::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          margin-top: -5px;
          border-radius: 999px;
          background: #f5d0fe;
          box-shadow: 0 0 16px rgba(217,70,239,.6);
        }
        .pricing-range::-moz-range-track {
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,.12);
        }
        .pricing-range::-moz-range-progress {
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(90deg, #c026d3, #a855f7);
        }
        .pricing-range::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border: 0;
          border-radius: 999px;
          background: #f5d0fe;
          box-shadow: 0 0 16px rgba(217,70,239,.6);
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
