import type React from "react";
import bikeCourier from "@/assets/bike-courier.jpg";
import deliveryDoor from "@/assets/delivery-door.jpg";
import diasporaShopper from "@/assets/diaspora-shopper.jpg";
import storePicking from "@/assets/store-picking.jpg";
import logoRect from "@/assets/tmpnp-logo-rect.png";
import logoSquare from "@/assets/tmpnp-logo-square.png";
import { Body, Card, Pill, SlideBase, SlideChrome } from "@/components/slide-kit";
import { downstreamSlides, MoatSlide } from "@/slides/downstream";


const REVENUE = [
  { label: "Incremental retail margins", value: 12852000, note: "21% gross retail margin" },
  { label: "Last-mile delivery share", value: 1080000, note: "US$1.50 net per drop" },
  { label: "Cross-border tech surcharge", value: 1836000, note: "3% on international cards" },
  { label: "Diaspora Priority subscriptions", value: 647280, note: "6,000 subscribers @ US$8.99" },
  { label: "Supplier-funded retail media", value: 734400, note: "1.2% of platform GMV" },
];
const MAX = Math.max(...REVENUE.map((r) => r.value));
const usd = (n: number) => "US$" + n.toLocaleString("en-US");

function TitleSlide() {
  return (
    <SlideBase tone="blue">
      <img
        src={deliveryDoor}
        alt="Courier handing groceries to a family at their door"
        referrerPolicy="no-referrer"
        width={1600}
        height={1000}
        className="absolute right-0 top-0 h-full w-[900px] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-pnp-blue-deep via-pnp-blue-deep/95 to-transparent" />
      <div className="absolute left-[96px] top-[110px] rounded-2xl bg-white px-6 py-4 shadow-md">
        <img src={logoRect} alt="TM Pick n Pay" referrerPolicy="no-referrer" className="h-[52px] w-auto max-w-[300px] object-contain" />
      </div>
      <div className="absolute left-[96px] top-[300px] w-[1000px]">
        <span className="slide-kicker text-pnp-gold">Executive Board Proposal</span>
        <h1 className="slide-title-lg mt-6">TM Pick n Pay Express</h1>
        <p className="slide-subtitle mt-6 text-white/85">
          Evolving Click &amp; Collect into Diaspora-to-Door delivery
        </p>
        <div className="mt-10 h-[10px] w-[220px] rounded-full bg-pnp-red" />
        <p className="slide-body mt-10 text-white/70">
          Prepared for the Executive Board · TM Pick n Pay Zimbabwe &amp; Meikles Limited
        </p>
      </div>
      <div className="slide-footer absolute bottom-[52px] left-[96px] text-white/55">
        Confidential · Venture Partnership Proposal
      </div>
    </SlideBase>
  );
}

function OpportunitySlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="Slide 01 · The Opportunity" index={1} />
      <Body>
        <h2 className="slide-title text-pnp-blue">
          Monetising the digital infrastructure you already own
        </h2>
        <div className="mt-12 grid grid-cols-[1fr_1fr_1fr_620px] gap-8">
          <div className="col-span-3 grid grid-cols-3 gap-8">
            <Card title="The foundation">
              tmpnponline.co.zw and the dedicated app are already live, running localized Click
              &amp; Collect across the estate.
            </Card>
            <Card title="The optimization gap" accent="blue">
              Collection demands transport, fuel and time. Diaspora buyers still pay Malayitsha vans
              purely for doorstep convenience.
            </Card>
            <Card title="Our value proposition">
              A Diaspora UI mode plus a decentralised last-mile network turns 74+ branches into
              on-demand fulfilment nodes.
            </Card>
          </div>
          <div className="row-span-1 overflow-hidden rounded-3xl">
            <img
              src={diasporaShopper}
              alt="Diaspora shopper ordering groceries on her phone"
              referrerPolicy="no-referrer"
              width={1600}
              height={1000}
              loading="lazy"
              className="h-[430px] w-full object-cover"
            />
          </div>
        </div>
      </Body>
    </SlideBase>
  );
}

function FlowRow({
  tone,
  label,
  steps,
}: {
  tone: "red" | "green";
  label: string;
  steps: string[];
}) {
  const dot = tone === "red" ? "bg-pnp-red" : "bg-pnp-blue";
  return (
    <div className="rounded-3xl border border-pnp-line bg-white p-10">
      <div className="flex items-center gap-4">
        <span className={`h-[20px] w-[20px] rounded-full ${dot}`} />
        <span className="slide-subtitle text-pnp-blue">{label}</span>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-4">
            <span className="slide-caption rounded-2xl bg-pnp-paper px-6 py-4 font-semibold text-pnp-ink">
              {s}
            </span>
            {i < steps.length - 1 && <span className="slide-caption text-pnp-red">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusQuoSlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="Slide 02 · Status Quo vs Evolution" index={2} />
      <Body>
        <h2 className="slide-title text-pnp-blue">Bypassing physical logistics friction</h2>
        <div className="mt-10 space-y-6">
          <FlowRow
            tone="red"
            label="Current system — Click & Collect"
            steps={["Diaspora shopper", "Web / app order", "Recipient must travel", "Urban branches only"]}
          />
          <FlowRow
            tone="green"
            label="The evolution — On-demand diaspora engine"
            steps={[
              "Diaspora shopper",
              "Targeted ad tracking",
              "Pure US$ gateway",
              "Local bike courier",
              "Recipient's door",
            ]}
          />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8">
          <p className="slide-body rounded-3xl bg-pnp-blue p-8 text-white/90">
            Rural and elderly recipients cannot easily reach a flagship branch such as Borrowdale or
            Kamfinsa to collect heavy hampers.
          </p>
          <p className="slide-body rounded-3xl bg-pnp-red p-8 text-white/95">
            Door-to-door fulfilment expands the addressable market to sponsors who want absolute
            confirmation that food arrived safely.
          </p>
        </div>
      </Body>
    </SlideBase>
  );
}

function GmvSlide() {
  return (
    <SlideBase tone="blue">
      <SlideChrome kicker="Slide 03 · P&L Assumptions" index={3} tone="blue" />
      <Body>
        <h2 className="slide-title">
          Consolidating diaspora remittances and cross-border shopping into a US$61.2M pipeline
        </h2>
        <div className="mt-12 grid grid-cols-4 gap-8">
          {[
            ["40,000", "Active diaspora customers"],
            ["1.5", "Orders per month"],
            ["US$85", "Average basket size"],
            ["12", "Months"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-3xl bg-white/10 p-10">
              <div className="text-[76px] font-extrabold leading-none">{v}</div>
              <div className="slide-caption mt-4 text-white/70">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center gap-10 rounded-3xl bg-pnp-red p-12">
          <div>
            <div className="inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Total Gross Basket Spend (GMV)
            </div>
            <div className="mt-3 text-[104px] font-extrabold leading-none">US$61,200,000</div>
          </div>
          <div className="ml-auto max-w-[520px] space-y-3 text-white/90">
            <p className="slide-body">
              40,000 customers × 1.5 orders × US$85 × 12 months — migrated from cash remittances and Malayitsha vans into a fully tracked, US$-settled retail pipeline.
            </p>
            <div className="inline-flex items-center gap-2 rounded-xl bg-black/20 px-4 py-2 text-xs font-bold text-pnp-gold">
              <span>Direct Ecosystem Capture: ~28% take-rate (US$17.15M in Phase 1)</span>
            </div>
          </div>
        </div>
      </Body>
    </SlideBase>
  );
}

function StreamsSlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="Slide 03 · Five Revenue Streams" index={4} />
      <Body>
        <div className="flex items-baseline justify-between">
          <h2 className="slide-title text-pnp-blue">Five stacked revenue streams</h2>
          <span className="rounded-full bg-pnp-red/10 px-4 py-1.5 text-xs font-bold text-pnp-red">
            Captured Value: ~28% aggregate take-rate on US$61.2M GMV
          </span>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-7">
          {[
            {
              t: "1. Retail product margins",
              d: "Spread captured on goods otherwise bought in South African cash-and-carries. 21% gross margin.",
              v: "US$12,852,000",
            },
            {
              t: "2. Last-mile delivery share",
              d: "US$4.50 fee within 10km; the platform retains US$1.50 net per drop.",
              v: "US$1,080,000",
            },
            {
              t: "3. Cross-border surcharge",
              d: "3% checkout fee on international cards originating outside Zimbabwe.",
              v: "US$1,836,000",
            },
            {
              t: "4. Diaspora Priority tiers",
              d: "US$8.99/month for free delivery and recurring staple baskets. 15% adoption.",
              v: "US$647,280",
            },
            {
              t: "5. Retail media network",
              d: "FMCG brands bid for sponsored placement in front of high-spend diaspora buyers.",
              v: "US$734,400",
            },
          ].map((s) => (
            <div
              key={s.t}
              className="flex flex-col rounded-3xl border border-pnp-line bg-white p-9 shadow-sm"
            >
              <h3 className="slide-subtitle text-pnp-blue">{s.t}</h3>
              <p className="slide-caption mt-4 flex-1 text-pnp-muted">{s.d}</p>
              <div className="slide-body-lg mt-6 font-extrabold text-pnp-red">{s.v}</div>
            </div>
          ))}
          <div className="flex flex-col justify-center rounded-3xl bg-pnp-blue p-9 text-white">
            <span className="slide-kicker text-pnp-gold">Phase 1 Total Ecosystem</span>
            <div className="mt-3 text-[52px] font-extrabold leading-none">US$17,149,680</div>
            <p className="slide-caption mt-3 text-white/70">
              Direct gross margin + platform fees captured on US$61.2M GMV
            </p>
          </div>
        </div>
      </Body>
    </SlideBase>
  );
}

function BreakdownSlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="Slide 04 · Revenue Breakdown" index={5} />
      <Body>
        <h2 className="slide-title text-pnp-blue">Projected total ecosystem annual revenue</h2>
        <div className="mt-4 slide-body-lg font-extrabold text-pnp-red">US$17,149,680</div>
        <div className="mt-10 space-y-6">
          {REVENUE.map((r) => (
            <div key={r.label} className="flex items-center gap-8">
              <div className="w-[520px]">
                <div className="slide-body font-semibold text-pnp-ink">{r.label}</div>
                <div className="slide-caption text-pnp-muted">{r.note}</div>
              </div>
              <div className="h-[52px] flex-1 rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-pnp-red"
                  style={{ width: `${(r.value / MAX) * 100}%` }}
                />
              </div>
              <div className="slide-body w-[280px] text-right font-extrabold text-pnp-blue">
                {usd(r.value)}
              </div>
            </div>
          ))}
        </div>
      </Body>
    </SlideBase>
  );
}

function DistinctionSlide() {
  const cards = [
    {
      metric: "Gross Merchandise Value (GMV)",
      tag: "Transaction Flow",
      tagColor: "bg-pnp-red text-white",
      amount: "US$61,200,000",
      amountColor: "text-pnp-red",
      role: "Total grocery basket spend throughput",
      desc: "40,000 diaspora shoppers × 1.5 orders/mo × US$85 avg basket × 12 months. This is the total cash transacted at the checkout.",
      detail: "Represents migrated spend currently captured by South African cash-and-carries and informal Malayitsha vans.",
      border: "border-pnp-red/30 bg-white",
    },
    {
      metric: "Phase 1 Ecosystem Revenue",
      tag: "Direct Capture (~28%)",
      tagColor: "bg-pnp-blue text-white",
      amount: "US$17,149,680",
      amountColor: "text-pnp-blue",
      role: "Direct captured earnings on US$61.2M GMV",
      desc: "Direct value captured on that basket volume across 5 stacked streams:",
      detail: "• 21% Retail Margin (US$12.85M)\n• 3% International Card Surcharge (US$1.84M)\n• Last-Mile Delivery Share (US$1.08M)\n• Retail Media Network (US$734k)\n• Diaspora Priority Memberships (US$647k)",
      border: "border-pnp-blue/30 bg-white",
    },
    {
      metric: "Phase 2 Ecosystem Revenue",
      tag: "Full Platform Steady State",
      tagColor: "bg-pnp-gold text-pnp-ink font-bold",
      amount: "US$21,841,380",
      amountColor: "text-pnp-ink",
      role: "Phase 1 Capture + B2B/B2C Subscriptions",
      desc: "Phase 1 Retail Capture ($17.15M) + Phase 2 Recurring Subscription Layer ($4.69M):",
      detail: "• 240 Tenant Software Licences ($717k)\n• 900 Scooter Rider Fleet Plans ($486k)\n• 900 Fleet Garage & Maintenance Plans ($194k)\n• 40 Market Data & Price Licences ($720k)\n• 45,000 Shopper Memberships ($2.15M)\n• 3,500 Tuck-Shop Trading Apps ($420k)",
      border: "border-pnp-blue bg-pnp-blue/5",
    },
  ];

  return (
    <SlideBase>
      <SlideChrome kicker="Financial Architecture · GMV vs Revenue" index={6} />
      <Body>
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="slide-title text-pnp-blue">The Distinction: GMV vs. Ecosystem Revenue</h2>
            <p className="slide-caption mt-2 text-pnp-muted">
              The fundamental difference between total transaction flow (checkout spend) and net captured earnings.
            </p>
          </div>
          <span className="rounded-full bg-pnp-blue text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
            Numbers Breakdown
          </span>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.metric}
              className={`flex flex-col justify-between rounded-3xl border ${c.border} p-8 shadow-sm`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-wide ${c.tagColor}`}>
                    {c.tag}
                  </span>
                </div>
                <h3 className="slide-subtitle mt-4 text-pnp-blue font-bold leading-snug">{c.metric}</h3>
                <div className={`mt-3 text-[42px] font-extrabold leading-none ${c.amountColor}`}>
                  {c.amount}
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-wider text-pnp-muted">
                  {c.role}
                </div>
                <p className="slide-caption mt-2 text-pnp-ink leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-6 rounded-2xl bg-pnp-paper border border-pnp-line/80 p-4">
                <p className="text-[12.5px] leading-relaxed text-pnp-muted whitespace-pre-line font-medium">
                  {c.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Body>
    </SlideBase>
  );
}

function OptionCard({
  n,
  title,
  mechanics,
  setup,
  opex,
  revenue,
}: {
  n: string;
  title: string;
  mechanics: string;
  setup: string;
  opex?: string | null;
  revenue: string;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-pnp-line bg-white p-9 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="slide-badge rounded-full bg-pnp-red px-5 py-2 text-white">{n}</span>
        <h3 className="slide-subtitle text-pnp-blue">{title}</h3>
      </div>
      <p className="slide-caption mt-5 flex-1 text-pnp-muted">{mechanics}</p>
      <div className={`mt-6 grid ${opex ? "grid-cols-3" : "grid-cols-2"} gap-6 border-t border-pnp-line pt-6`}>
        <div>
          <div className="slide-chrome text-pnp-muted">Setup Fee</div>
          <div className="slide-subtitle mt-1 font-bold text-pnp-red">{setup}</div>
        </div>
        {opex && (
          <div>
            <div className="slide-chrome text-pnp-muted">Monthly</div>
            <div className="slide-caption mt-1 font-bold text-pnp-ink">{opex}</div>
          </div>
        )}
        <div>
          <div className="slide-chrome text-pnp-muted">Commercial Split / Take</div>
          <div className="slide-body mt-1 font-bold text-pnp-blue">{revenue}</div>
        </div>
      </div>
    </div>
  );
}

function OptionsASlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="Slide 05 · Business Model Options" index={6} />
      <Body>
        <h2 className="slide-title text-pnp-blue">Aligning risk, capital and structure</h2>
        <div className="mt-10 grid grid-cols-2 gap-8">
          <OptionCard
            n="Option 1"
            title="Independent Concierge (Reseller)"
            mechanics="We operate as a standalone entity mirroring your catalog via API. Senders pay us in US$; we buy stock from TM PnP at a negotiated wholesale discount and fulfill with our own driver network."
            setup="US$100,000"
            revenue="5–8% markup + 3–5% rebate"
          />
          <OptionCard
            n="Option 2"
            title="White-Label Software Licensing"
            mechanics="We build the cross-border storefront extension and license it to TM PnP. It integrates cleanly into tmpnponline.co.zw, natively branded, fulfilled by third-party Zimbabwean couriers."
            setup="US$75,000"
            revenue="1.5–2% GMV revenue share"
          />
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl">
          <img
            src={storePicking}
            alt="Store staff picking online grocery orders"
            referrerPolicy="no-referrer"
            width={1600}
            height={1000}
            loading="lazy"
            className="h-[220px] w-full object-cover"
          />
        </div>
      </Body>
    </SlideBase>
  );
}

const MATRIX = {
  head: ["Metric", "Option 1 · Independent Concierge (Reseller)", "Option 2 · White-Label Software Licensing"],
  rows: [
    ["Upfront capital", "US$100,000", "US$75,000"],
    ["Operational effort", "Extremely high", "Very low"],
    ["Time to market", "3–4 months", "4–5 months"],
    ["Primary revenue", "Product markups", "Licensing fees"],
    ["TM PnP risk tier", "Zero risk (Turnkey operator)", "Technology buyer & owner"],
  ],
};

function MatrixSlide() {
  return (
    <SlideBase tone="blue">
      <SlideChrome kicker="Slide 06 · Configuration Matrix" index={7} tone="blue" />
      <Body>
        <h2 className="slide-title">Commercial model comparison</h2>
        <div className="mt-12 overflow-hidden rounded-3xl bg-white/8">
          <div className="grid grid-cols-3 bg-pnp-red">
            {MATRIX.head.map((h, idx) => (
              <div key={h} className={`slide-body px-8 py-7 font-extrabold text-white ${idx === 0 ? "w-1/4" : ""}`}>
                {h}
              </div>
            ))}
          </div>
          {MATRIX.rows.map((row, i) => (
            <div key={row[0]} className={`grid grid-cols-3 ${i % 2 ? "bg-white/5" : ""}`}>
              {row.map((cell, j) => (
                <div
                  key={cell + j}
                  className={`slide-caption px-8 py-7 text-base ${j === 0 ? "font-bold text-pnp-gold" : "text-white/90"}`}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Body>
    </SlideBase>
  );
}

function IntegrationsSlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="Slide 07 · Critical Integrations" index={9} />
      <Body>
        <h2 className="slide-title text-pnp-blue">Building beyond the current platform</h2>
        <p className="slide-body mt-6 text-pnp-muted">
          Three new components layer over the existing web framework.
        </p>
        <div className="mt-12 grid grid-cols-3 gap-8">
          <Card title="Geo-fenced marketing core">
            Hyper-targeted social and digital advertising aimed at high-density Zimbabwean pockets —
            Hillbrow and Randburg in South Africa, London and Leeds in the UK.
          </Card>
          <Card title="API logistics middleware" accent="blue">
            A dispatch interface linking the TM PnP back-end to localized courier networks and
            on-demand e-bike fleets for route optimisation and proof of delivery.
          </Card>
          <Card title="Real-time substitution logic">
            An automated WhatsApp bot lets the sender or recipient approve alternatives instantly
            when an item goes out of stock during picking.
          </Card>
        </div>
      </Body>
    </SlideBase>
  );
}

function FirstMoverSlide() {
  return (
    <SlideBase tone="red">
      <img
        src={deliveryDoor}
        alt="Family receiving a grocery delivery"
        referrerPolicy="no-referrer"
        width={1600}
        height={1000}
        loading="lazy"
        className="absolute right-0 top-0 h-full w-[820px] object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-pnp-red-deep via-pnp-red-deep/95 to-transparent" />
      <SlideChrome kicker="Slide 08 · First-Mover Advantage" index={10} tone="red" />
      <Body>
        <div className="w-[1050px]">
          <h2 className="slide-title">A defensive moat against OK Zimbabwe &amp; Choppies</h2>
          <div className="mt-12 space-y-8">
            <div className="rounded-3xl bg-white/12 p-10">
              <Pill tone="light">Market leadership</Pill>
              <p className="slide-body-lg mt-5 text-white/90">
                While competitors stay focused on brick-and-mortar or basic localized delivery, TM
                PnP becomes the definitive cross-border retail pipeline for the diaspora ecosystem.
              </p>
            </div>
            <div className="rounded-3xl bg-white/12 p-10">
              <Pill tone="light">Maximising group assets</Pill>
              <p className="slide-body-lg mt-5 text-white/90">
                Collection desks convert into high-volume dispatch stations, lifting stock turnover
                speed across all primary product lines.
              </p>
            </div>
          </div>
        </div>
      </Body>
    </SlideBase>
  );
}

const VALUE_PROPS: [string, string][] = [
  ["White-label solution", "A customizable platform retailers brand as their own, with flexible commercial models — subscription or commission-based."],
  ["Time-to-market advantage", "Leverage existing integrations (API, SIM switch, payments platform) to launch quickly and capture customers before competitors."],
  ["Robust and secure platform", "A reliable, scalable and secure system compared to informal, unregulated channels."],
  ["Bank-agnostic integration", "Participation across multiple banks, expanding reach and customer access."],
  ["Critical mass creation", "Not just a platform — support in building user adoption through partnerships with banks and diaspora communities."],
  ["Hybrid commercial model", "Transaction-based fees, subscription or discounts, allowing flexibility for different business strategies."],
  ["Adaptability to market dynamics", "Analytics and intelligence to adjust pricing, packaging and delivery models as consumer behaviour shifts."],
  ["Direct-to-Consumer", "Moving beyond brick-and-mortar retail into a direct relationship with the shopper."],
];

const BENEFITS: [string, string][] = [
  ["Faster market entry", "Existing developer integrations accelerate rollout."],
  ["Customer convenience", "Shift from brick-and-mortar to digital so diaspora and local customers buy easily from anywhere."],
  ["Expanded customer base", "Access to diaspora markets and multiple banks' captured audiences."],
  ["Replacement of informal trading", "A legitimate, tax-compliant alternative to informal, unreliable channels."],
  ["Cross-border resilience", "A digital platform bypasses constraints on physical goods movement between countries."],
  ["Economies of scale", "Better negotiated prices and smaller, affordable packages matched to consumer cash-flow realities."],
  ["Increased loyalty & retention", "Secure, reliable delivery builds trust compared to informal traders."],
  ["Revenue diversification", "Subscriptions, transaction fees or discounts, plus wholesale distribution partnerships."],
  ["Scalability", "Expansion into regional markets with product packaging adapted to local needs."],
  ["Convenience-driven adoption", "Delivery of small daily-use packages (sugar, bread, beans) fits township and village habits."],
  ["Government alignment", "Formalizing trade supports taxation and regulation, strengthening retailer-government relations."],
];

function ValuePropSlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="Slide 09 · Value Proposition" index={11} />
      <Body>
        <h2 className="slide-title text-pnp-blue">What the platform uniquely delivers</h2>
        <div className="mt-10 grid grid-cols-4 grid-rows-2 gap-7">
          {VALUE_PROPS.map(([t, d], idx) => (
            <div
              key={t}
              className="flex flex-col rounded-3xl border border-pnp-line bg-white p-8 shadow-sm"
            >
              <div
                className={`mb-4 h-[8px] w-[64px] rounded-full ${idx % 2 ? "bg-pnp-blue" : "bg-pnp-red"}`}
              />
              <h3 className="slide-subtitle text-pnp-blue">{t}</h3>
              <p className="slide-caption mt-3 text-pnp-muted">{d}</p>
            </div>
          ))}
        </div>
      </Body>
    </SlideBase>
  );
}

function BenefitsSlide() {
  return (
    <SlideBase tone="blue">
      <SlideChrome kicker="Slide 10 · Benefits" index={12} tone="blue" />
      <Body>
        <h2 className="slide-title">Benefits to TM Pick n Pay and the market</h2>
        <div className="mt-10 grid grid-cols-3 gap-6">
          {BENEFITS.map(([t, d]) => (
            <div key={t} className="rounded-2xl bg-white/12 p-7">
              <div className="flex items-start gap-4">
                <span className="mt-[6px] h-[14px] w-[14px] shrink-0 rounded-full bg-pnp-gold" />
                <div>
                  <h3 className="slide-caption font-bold text-white">{t}</h3>
                  <p className="slide-caption mt-2 text-white/75">{d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Body>
    </SlideBase>
  );
}

function CloseSlide() {

  return (
    <SlideBase tone="blue">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="rounded-2xl bg-white p-6 shadow-xl border border-white/20">
          <img src={logoSquare} alt="TM Pick n Pay" referrerPolicy="no-referrer" className="h-[110px] w-auto max-w-[170px] object-contain mx-auto" />
        </div>
        <h2 className="slide-title-lg mt-14 max-w-[1400px]">
          Turn 74+ branches into a diaspora fulfilment network
        </h2>
        <div className="mt-10 h-[10px] w-[240px] rounded-full bg-pnp-red" />
        <p className="slide-subtitle mt-10 max-w-[1200px] text-white/80">
          Recommended next step: select a commercial structure and mandate a 60-day pilot on two
          flagship Harare branches.
        </p>
      </div>
      <div className="slide-footer absolute bottom-[52px] left-[96px] right-[96px] flex justify-between text-white/55">
        <span>TM Pick n Pay Express</span>
        <span>Thank you</span>
      </div>
    </SlideBase>
  );
}

const byId = (id: string) => {
  const s = downstreamSlides.find((d) => d.id === id);
  if (!s) throw new Error(`Unknown downstream slide: ${id}`);
  return s;
};

export const slides: { id: string; title: string; Component: () => React.ReactElement }[] = [
  /* Act 1 — The proposal */
  { id: "title", title: "TM Pick n Pay Express", Component: TitleSlide },
  { id: "opportunity", title: "The Opportunity", Component: OpportunitySlide },
  { id: "status-quo", title: "Status Quo vs Evolution", Component: StatusQuoSlide },
  { id: "moat", title: "The Moat", Component: MoatSlide },
  { id: "value-prop", title: "Value Proposition", Component: ValuePropSlide },
  { id: "first-mover", title: "First-Mover Advantage", Component: FirstMoverSlide },

  /* Act 2 — The numbers today */
  { id: "gmv", title: "P&L Assumptions", Component: GmvSlide },
  { id: "streams", title: "Revenue Streams", Component: StreamsSlide },
  { id: "breakdown", title: "Revenue Breakdown", Component: BreakdownSlide },
  { id: "distinction", title: "GMV vs Ecosystem Revenue", Component: DistinctionSlide },

  /* Act 3 — How we do the deal */
  { id: "options-a", title: "Business Model Options", Component: OptionsASlide },
  { id: "matrix", title: "Configuration Matrix", Component: MatrixSlide },
  { id: "integrations", title: "Critical Integrations", Component: IntegrationsSlide },
  { id: "benefits", title: "Benefits", Component: BenefitsSlide },

  /* Act 4 — Where it goes next: the agnostic platform */
  byId("why-now"),
  byId("agnostic"),
  byId("price-engine"),
  byId("banking"),
  byId("scooters"),
  byId("loyalty"),
  byId("wholesale"),
  byId("subscription"),

  /* Act 5 — The consolidated ecosystem economics */
  byId("consolidated-revenue"),
  byId("revenue-mix"),
  byId("structure"),

  { id: "close", title: "Next Steps", Component: CloseSlide },
];

