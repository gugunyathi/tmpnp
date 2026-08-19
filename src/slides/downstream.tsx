import type React from "react";
import bikeCourier from "@/assets/bike-courier.jpg";
import storePicking from "@/assets/store-picking.jpg";
import { Body, Card, SlideBase, SlideChrome } from "@/components/slide-kit";

/* ------------------------------------------------------------------ */
/* 15 — Why now: positioning for the TM pitch                          */
/* ------------------------------------------------------------------ */

const PRESSURES: [string, string][] = [
  [
    "Brick-and-mortar is no longer defensible",
    "Footfall retail cannot hold share on its own. The defensible asset is the customer relationship, not the store estate.",
  ],
  [
    "Buyers are price-led, not brand-led",
    "Households shop the cheapest basket available on the day. Informal channels are winning that comparison by default.",
  ],
  [
    "The Malayitsha channel is being constricted",
    "One-stop border posts, electronic travel authority and tighter vehicle declarations are squeezing the informal cross-border van trade.",
  ],
  [
    "The opening left behind",
    "Diaspora funding + bank rails + owned delivery + wholesale into the informal channel — a brand that lives in people's homes.",
  ],
];

function WhyNowSlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="Slide 14 · Why Now" index={15} hideFooter />
      <Body>
        <h2 className="slide-title text-pnp-blue">
          A market intelligence driven model
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-8">
          {PRESSURES.map(([t, d], i) => (
            <Card key={t} title={t} accent={i % 2 ? "blue" : "red"}>
              {d}
            </Card>
          ))}
        </div>
        <div className="mt-10 rounded-3xl bg-pnp-blue px-12 py-8">
          <p className="slide-subtitle text-white">
            Positioning discipline: the pitch is market access and demand intelligence. Framed as a
            diaspora product, it reads as a niche remittance play and stalls in committee.
          </p>
        </div>
      </Body>
    </SlideBase>
  );
}

/* ------------------------------------------------------------------ */
/* 16 — Retail-agnostic end state                                      */
/* ------------------------------------------------------------------ */

const PHASES: [string, string, string][] = [
  [
    "Phase 1 · Entry",
    "TM Pick n Pay value-add",
    "Single-tenant. TM branded, TM catalogue, TM fulfilment. The platform earns its place inside one retailer before anything else is discussed.",
  ],
  [
    "Phase 2 · Depth",
    "Wholesale and informal channel",
    "TM supplies tuck shops and repackagers through the same rails. Volume grows without adding a competing banner to the storefront.",
  ],
  [
    "Phase 3 · End state",
    "Retail-agnostic trading platform",
    "Shopper asks for cooking oil; the request goes out to every participating supplier and the best price wins. Retailers become suppliers on a marketplace.",
  ],
];

function AgnosticSlide() {
  return (
    <SlideBase tone="blue">
      <SlideChrome kicker="Slide 15 · Downstream Innovation" index={16} tone="blue" hideFooter />
      <Body>
        <h2 className="slide-title">
          The end state is a trading platform, not a single-retailer app
        </h2>
        <div className="mt-12 grid grid-cols-3 gap-8">
          {PHASES.map(([k, t, d]) => (
            <div key={k} className="rounded-3xl bg-white/10 p-10">
              <span className="slide-badge inline-block rounded-full bg-pnp-gold px-5 py-2 text-pnp-ink">
                {k}
              </span>
              <h3 className="slide-subtitle mt-6 text-white">{t}</h3>
              <p className="slide-body mt-4 text-white/75">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-8">
          <div className="rounded-3xl bg-pnp-red px-10 py-7">
            <p className="slide-body text-white">
              Multi-tenant has already been prototyped — three banners running in one app — then
              deliberately pulled back to a single tenant for the entry conversation.
            </p>
          </div>
          <div className="rounded-3xl bg-white/12 px-10 py-7">
            <p className="slide-body text-white/85">
              Sequencing is the safeguard: introduce the platform as a TM advantage, without
              signalling that competitors sit on the same rails on day one.
            </p>
          </div>
        </div>
      </Body>
    </SlideBase>
  );
}

/* ------------------------------------------------------------------ */
/* 17 — Price comparison engine                                        */
/* ------------------------------------------------------------------ */

const OIL_ROWS: [string, string, string][] = [
  ["Supplier A · 2L cooking oil", "US$3.10", "Best price · 2.1km"],
  ["Supplier B · 2L cooking oil", "US$3.45", "Faster slot · 0.8km"],
  ["Supplier C · 2L cooking oil", "US$3.60", "Bundle offer"],
  ["Tuck shop · 500ml repack", "US$0.95", "Local fulfilment"],
];

function PriceEngineSlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="Slide 16 · Price Comparison Engine" index={17} hideFooter />
      <Body>
        <h2 className="slide-title text-pnp-blue">
          Item-level price comparison is the reason to participate
        </h2>
        <div className="mt-12 grid grid-cols-[1.15fr_1fr] gap-10">
          <div className="rounded-3xl border border-pnp-line bg-white p-10 shadow-sm">
            <div className="slide-chrome text-pnp-muted">Shopper request · &ldquo;cooking oil&rdquo;</div>
            <div className="mt-6 flex flex-col gap-4">
              {OIL_ROWS.map(([item, price, note], i) => (
                <div
                  key={item}
                  className={`flex items-center justify-between rounded-2xl px-8 py-6 ${
                    i === 0 ? "bg-pnp-blue text-white" : "bg-pnp-paper text-pnp-ink"
                  }`}
                >
                  <div>
                    <div className="slide-caption font-bold">{item}</div>
                    <div
                      className={`slide-chrome mt-1 ${i === 0 ? "text-white/70" : "text-pnp-muted"}`}
                    >
                      {note}
                    </div>
                  </div>
                  <div className="slide-subtitle font-extrabold">{price}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <Card title="Comparison across every participating supplier">
              One request fans out to all listed suppliers. The shopper sees price, distance and
              slot side by side and picks. Price competition, not shelf position, decides the sale.
            </Card>
            <Card title="AI ranking of most-tradable items" accent="blue">
              The engine ranks demand by item, area and week — a what-to-stock signal feeding
              order-to-cash: buy the right depth, in the right pack size, before the demand lands.
            </Card>
          </div>
        </div>
      </Body>
    </SlideBase>
  );
}

/* ------------------------------------------------------------------ */
/* 18 — Subscription is the model                                      */
/* ------------------------------------------------------------------ */

const SUBS: [string, string][] = [
  ["Rider fees", "Scooter rent-to-buy instalments, then a standing platform fee per dollar earned."],
  ["Advertising", "Scooter livery, in-app placement and supplier media sold as monthly inventory."],
  ["Garage services", "Servicing, parts and accessories on a maintenance plan, not a per-repair invoice."],
  ["Tenant fees", "Each retailer, wholesaler and tuck shop pays a tiered monthly platform fee."],
  ["Shopper plans", "Priority delivery and family basket sharing on a recurring plan."],
  ["Data products", "Demand and price intelligence licensed by subscription to suppliers."],
];

function SubscriptionSlide() {
  return (
    <SlideBase tone="red">
      <SlideChrome kicker="The Subscription Model" index={18} tone="red" hideFooter />
      <Body>
        <h2 className="slide-title">
          Anything that allows a subscription is the model. The rest is not sustainable.
        </h2>
        <div className="mt-10 grid grid-cols-3 gap-8">
          {SUBS.map(([t, d]) => (
            <div key={t} className="rounded-3xl bg-white/12 p-9">
              <h3 className="slide-subtitle text-white">{t}</h3>
              <p className="slide-body mt-4 text-white/80">{d}</p>
            </div>
          ))}
        </div>
        <p className="slide-body-lg mt-8 text-white/85">
          Every line above is bent toward recurring revenue: one-off fees fund a project, recurring
          fees fund a company.
        </p>
      </Body>
    </SlideBase>
  );
}

/* ------------------------------------------------------------------ */
/* 19 — Scooter economics                                              */
/* ------------------------------------------------------------------ */

const SCOOTER_STATS: [string, string][] = [
  ["500–2,000", "Platform-owned electric scooters"],
  ["12 months", "Rent-to-buy, then the rider owns it"],
  ["~5 months", "Asset pays itself back"],
  ["~10%", "Platform fee per dollar earned after ownership"],
];

function ScooterSlide() {
  return (
    <SlideBase tone="blue">
      <SlideChrome kicker="Slide 20 · Owned Delivery Network" index={21} tone="blue" hideFooter />
      <Body>
        <h2 className="slide-title">The last mile is owned, not outsourced</h2>
        <div className="mt-10 grid grid-cols-4 gap-6">
          {SCOOTER_STATS.map(([v, l]) => (
            <div key={l} className="rounded-3xl bg-white/10 p-9">
              <div className="slide-title text-pnp-gold">{v}</div>
              <div className="slide-caption mt-3 text-white/75">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-[1fr_1fr_1fr] gap-8">
          <div className="rounded-3xl bg-white/12 p-9">
            <h3 className="slide-subtitle text-white">Rent-to-buy</h3>
            <p className="slide-body mt-4 text-white/80">
              The rider operates for twelve months and then owns the scooter. The asset repays
              itself in roughly five months; months six to twelve are margin.
            </p>
          </div>
          <div className="rounded-3xl bg-white/12 p-9">
            <h3 className="slide-subtitle text-white">Advertising rights</h3>
            <p className="slide-body mt-4 text-white/80">
              Livery is sold on subscription: 80% reserved for the anchor retailer, 20% open
              inventory. A moving media network across every delivery route.
            </p>
          </div>
          <div className="rounded-3xl bg-white/12 p-9">
            <h3 className="slide-subtitle text-white">Own the garage</h3>
            <p className="slide-body mt-4 text-white/80">
              Repairs, parts and accessories stay inside the platform on a maintenance plan.
              Electric tricycles extend the fleet into rural routes, with women riders as the
              first cohort.
            </p>
          </div>
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl">
          <img
            src={bikeCourier}
            alt="Electric scooter courier on a delivery route"
            referrerPolicy="no-referrer"
            width={1600}
            height={1000}
            loading="lazy"
            className="h-[190px] w-full object-cover"
          />
        </div>
      </Body>
    </SlideBase>
  );
}

/* ------------------------------------------------------------------ */
/* 20 — Loyalty programme                                              */
/* ------------------------------------------------------------------ */

function LoyaltySlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="Slide 21 · Loyalty & Device Migration" index={22} hideFooter />
      <Body>
        <h2 className="slide-title text-pnp-blue">
          Trade US$100 a month for five months — earn the handset
        </h2>
        <div className="mt-12 grid grid-cols-5 gap-5">
          {["Month 1", "Month 2", "Month 3", "Month 4", "Month 5"].map((m, i) => (
            <div
              key={m}
              className={`rounded-3xl px-8 py-9 text-center ${
                i === 4 ? "bg-pnp-red text-white" : "bg-white text-pnp-ink border border-pnp-line"
              }`}
            >
              <div className="slide-subtitle font-extrabold">{m}</div>
              <div className={`slide-caption mt-3 ${i === 4 ? "text-white/85" : "text-pnp-muted"}`}>
                {i === 4 ? "5G-lite smartphone awarded" : "US$100 traded"}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-3 gap-8">
          <Card title="Discovery-Vitality mechanics" accent="blue">
            Consecutive qualifying months unlock the reward. Behaviour is earned, not bought, and
            the tier resets if trading lapses.
          </Card>
          <Card title="Family basket sharing">
            Several household members contribute to one qualifying basket, so families reach the
            threshold faster and consolidate spend on the platform.
          </Card>
          <Card title="The real purpose" accent="blue">
            A ~US$50 landed handset with the markup absorbed migrates 2G and 3G users onto the
            platform. Device cost is customer acquisition, booked as such.
          </Card>
        </div>
      </Body>
    </SlideBase>
  );
}

/* ------------------------------------------------------------------ */
/* 21 — Bank-agnostic rails                                            */
/* ------------------------------------------------------------------ */

function BankingSlide() {
  return (
    <SlideBase tone="blue">
      <SlideChrome kicker="Slide 22 · Payment Rails" index={23} tone="blue" />
      <Body>
        <h2 className="slide-title">Bank-agnostic by design, multi-bank in practice</h2>
        <div className="mt-12 grid grid-cols-2 gap-10">
          <div className="rounded-3xl bg-white/10 p-10">
            <h3 className="slide-subtitle text-white">What we say to banks</h3>
            <p className="slide-body mt-4 text-white/80">
              Plug your remittance APIs into the platform and we bring transaction share-of-wallet:
              recurring diaspora flows landing as retail settlement rather than cash-out.
            </p>
            <p className="slide-body mt-5 text-white/80">
              No exclusivity is requested and none is given. Every rail is one integration among
              several, so pricing stays competitive and no single institution gates the platform.
            </p>
          </div>
          <div className="rounded-3xl bg-white/10 p-10">
            <h3 className="slide-subtitle text-white">What we say to the retailer</h3>
            <p className="slide-body mt-4 text-white/80">
              Banks bring critical mass. Their diaspora bases are already captured audiences; the
              platform converts those balances into baskets inside your estate.
            </p>
            <p className="slide-body mt-5 text-white/80">
              Institutions under discussion are prospects at this stage. Nothing is presented in-app
              as a confirmed partnership until an agreement is signed.
            </p>
          </div>
        </div>
        <div className="mt-10 rounded-3xl bg-pnp-red px-12 py-8">
          <p className="slide-subtitle text-white">
            Design rule: no bank-specific logic in the core. Rails are adapters, so adding or
            dropping an institution is a configuration change, never a rebuild.
          </p>
        </div>
      </Body>
    </SlideBase>
  );
}

/* ------------------------------------------------------------------ */
/* 22 — Wholesale / tuck-shop model                                    */
/* ------------------------------------------------------------------ */

function WholesaleSlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="Slide 23 · Wholesale & Informal Channel" index={24} />
      <Body>
        <h2 className="slide-title text-pnp-blue">
          Tuck shops become distribution extensions, not competitors
        </h2>
        <div className="mt-12 grid grid-cols-4 gap-6">
          {[
            ["Aggregate", "Local orders in a suburb are pooled in the app rather than fragmented across trips."],
            ["Fulfil locally", "The nearest tuck shop picks and hands over, cutting distance, fuel and delivery cost."],
            ["Repackage", "Bulk stock is broken into the 200g-type pack sizes the market actually buys."],
            ["Supply", "The retailer sells bulk into the channel as a wholesaler and keeps the volume."],
          ].map(([t, d], i) => (
            <div
              key={t}
              className={`rounded-3xl p-9 ${
                i % 2 ? "bg-white border border-pnp-line" : "bg-pnp-blue text-white"
              }`}
            >
              <div className={`slide-chrome ${i % 2 ? "text-pnp-muted" : "text-white/70"}`}>
                Step {i + 1}
              </div>
              <h3 className={`slide-subtitle mt-3 ${i % 2 ? "text-pnp-blue" : "text-white"}`}>{t}</h3>
              <p className={`slide-body mt-4 ${i % 2 ? "text-pnp-muted" : "text-white/80"}`}>{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-8">
          <Card title="Pack size is the unlock">
            Households buy 200g, not 2kg. The retailer sells bulk to the tuck shop, the tuck shop
            repackages to the price point the street can afford — the small-multipack playbook
            proven by packaged brands expanding regionally.
          </Card>
          <Card title="The government argument" accent="blue">
            Routing informal trade through the platform makes it visible: tax is captured, stock is
            traceable and counterfeit product is squeezed out. Legitimisation, not enforcement.
          </Card>
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl">
          <img
            src={storePicking}
            alt="Wholesale stock being picked for local distribution"
            referrerPolicy="no-referrer"
            width={1600}
            height={1000}
            loading="lazy"
            className="h-[150px] w-full object-cover"
          />
        </div>
      </Body>
    </SlideBase>
  );
}

/* ------------------------------------------------------------------ */
/* 23 — Commercial and entity structure                                */
/* ------------------------------------------------------------------ */

function StructureSlide() {
  return (
    <SlideBase tone="blue">
      <SlideChrome kicker="Slide 24 · Commercial & Entity Structure" index={25} tone="blue" hideFooter />
      <Body>
        <h2 className="slide-title">Hybrid commercial model, two-country structure</h2>
        <div className="mt-12 grid grid-cols-3 gap-8">
          {[
            ["White-label", "The storefront and app ship under the retailer's brand, licensed rather than sold."],
            ["Subscription", "Tiered monthly platform fees per tenant, opening at a 100,000-participant tier."],
            ["Commission", "A thin transaction share on GMV, sitting on top of the recurring base."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-3xl bg-white/10 p-10">
              <h3 className="slide-subtitle text-white">{t}</h3>
              <p className="slide-body mt-4 text-white/80">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-8">
          <div className="rounded-3xl bg-white/12 p-10">
            <h3 className="slide-subtitle text-white">South African company</h3>
            <p className="slide-body mt-4 text-white/80">
              Holds the platform IP and raises capital where liquidity and investor access are
              deepest. Contracts with tenants and banks sit here.
            </p>
          </div>
          <div className="rounded-3xl bg-white/12 p-10">
            <h3 className="slide-subtitle text-white">Zimbabwean subsidiary</h3>
            <p className="slide-body mt-4 text-white/80">
              Runs logistics, the scooter fleet and local agreements on the ground, with local
              employment and local regulatory standing.
            </p>
          </div>
        </div>
        <p className="slide-caption mt-8 text-white/60">
          Directional as at 13 August — structure to be confirmed with tax and legal counsel before
          any binding term sheet.
        </p>
      </Body>
    </SlideBase>
  );
}

/* ------------------------------------------------------------------ */
/* 19 — Consolidated ecosystem revenue model                           */
/* ------------------------------------------------------------------ */

const CONSOLIDATED: [string, string, string, string][] = [
  ["Retail product margins", "21% margin on migrated basket", "Transactional", "US$12,852,000"],
  ["Last-mile delivery share", "US$1.50 net per drop", "Transactional", "US$1,080,000"],
  ["Cross-border surcharge", "3% on international cards", "Transactional", "US$1,836,000"],
  ["Diaspora Priority plans", "6,000 subscribers @ US$8.99", "Recurring", "US$647,280"],
  ["Retail media network", "1.2% of platform GMV", "Semi-recurring", "US$734,400"],
];

/** Phase 2 recurring lines — modelled at steady state, year 3 of the agnostic build. */
const LAYERED: [string, string, string][] = [
  ["Tenant platform fees", "240 retail / wholesale tenants @ US$249 pm", "US$717,120"],
  ["Rider plans", "900 riders @ US$45 pm platform fee", "US$486,000"],
  ["Garage & maintenance plans", "900 units @ US$18 pm service cover", "US$194,400"],
  ["Data & price intelligence", "40 supplier licences @ US$1,500 pm", "US$720,000"],
  ["Shopper plans", "45,000 households @ US$3.99 pm", "US$2,154,600"],
  ["Tuck-shop trading app", "3,500 shops @ US$9.99 pm", "US$419,580"],
];

function ConsolidatedRevenueSlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="Consolidated Ecosystem Revenue" index={19} />
      <Body>
        <div className="flex items-baseline justify-between">
          <h2 className="slide-subtitle text-pnp-blue">
            The full ecosystem: US$21,841,380 a year
          </h2>
          <span className="rounded-full bg-pnp-blue/10 px-4 py-1.5 text-xs font-bold text-pnp-blue">
            Built on US$61.2M Baseline GMV ($17.15M Phase 1) + US$4.69M B2B/B2C Recurring Services
          </span>
        </div>
        <div className="mt-6 grid grid-cols-[1.05fr_1fr] gap-8">
          <div className="rounded-3xl border border-pnp-line bg-white p-9 shadow-sm">
            <span className="slide-kicker text-pnp-red">Phase 1 · Modelled today</span>
            <div className="mt-6 space-y-4">
              {CONSOLIDATED.map(([label, basis, kind, value]) => (
                <div key={label} className="flex items-center gap-5">
                  <div className="flex-1">
                    <div className="slide-caption font-bold text-pnp-ink">{label}</div>
                    <div className="slide-chrome text-pnp-muted">
                      {basis} · {kind}
                    </div>
                  </div>
                  <div className="slide-caption font-extrabold text-pnp-blue">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-pnp-line pt-5">
              <span className="slide-caption font-bold text-pnp-ink">Phase 1 Total ecosystem</span>
              <span className="slide-body font-extrabold text-pnp-red">US$17,149,680</span>
            </div>
          </div>
          <div className="rounded-3xl bg-pnp-blue p-9 text-white">
            <span className="slide-kicker text-pnp-gold">Phase 2 · Subscription layer</span>
            <div className="mt-6 space-y-4">
              {LAYERED.map(([t, d, v]) => (
                <div key={t} className="flex items-center gap-5">
                  <div className="flex-1">
                    <div className="slide-caption font-bold text-white">{t}</div>
                    <div className="slide-chrome text-white/70">{d}</div>
                  </div>
                  <div className="slide-caption font-extrabold text-pnp-gold">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-5">
              <span className="slide-caption font-bold text-white">Subscription subtotal</span>
              <span className="slide-body font-extrabold text-pnp-gold">US$4,691,700</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between rounded-3xl bg-pnp-red px-12 py-5 text-white">
          <span className="slide-body-lg font-semibold">
            Combined annual ecosystem revenue at steady state
          </span>
          <span className="slide-subtitle font-extrabold text-white">US$21,841,380</span>
        </div>
      </Body>
    </SlideBase>
  );
}

/* ------------------------------------------------------------------ */
/* 20 — Revenue mix shift                                              */
/* ------------------------------------------------------------------ */

function RevenueMixSlide() {
  return (
    <SlideBase tone="blue">
      <SlideChrome kicker="Future Revenue Mix" index={20} tone="blue" />
      <Body>
        <h2 className="slide-title">
          From transaction-led to subscription-led
        </h2>
        <div className="mt-10 grid grid-cols-3 gap-8">
          {[
            [
              "Launch · US$17.1M",
              "Door-to-door on TMPNP stock",
              "Retail margin, delivery share and the cross-border surcharge carry the model. One recurring line: Diaspora Priority at US$647,280 — 4% of revenue.",
            ],
            [
              "Scale · +US$1.4M",
              "Second and third retailers onboard",
              "Tenant fees (US$717,120), rider plans (US$486,000) and garage cover (US$194,400) start billing monthly, whatever the basket does.",
            ],
            [
              "Agnostic · US$21.8M",
              "Marketplace of retailers and tuck shops",
              "Shopper plans, tuck-shop apps and data licences add US$3.29M. Recurring revenue reaches US$5,338,980 — 24% of the ecosystem.",
            ],
          ].map(([phase, sub, body]) => (
            <div key={phase} className="rounded-3xl bg-white/10 p-9">
              <span className="slide-kicker text-pnp-gold">{phase}</span>
              <h3 className="slide-subtitle mt-3 text-white">{sub}</h3>
              <p className="slide-body mt-5 text-white/80">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-3xl bg-pnp-red px-12 py-8">
          <p className="slide-subtitle text-white">
            Same ecosystem, valued differently: transaction fees fund a project, recurring fees fund
            a company.
          </p>
        </div>
      </Body>
    </SlideBase>
  );
}

/* ------------------------------------------------------------------ */
/* The moat — multi-cart, multi-currency diaspora shopping             */
/* ------------------------------------------------------------------ */

const MOAT: [string, string][] = [
  [
    "Multi-cart",
    "One diaspora sender runs several carts at once — mother in Bulawayo, sister in Gweru, a school tuck order — each with its own recipient, address and delivery slot.",
  ],
  [
    "Multi-currency",
    "Pay in GBP, USD, ZAR or EUR; settle in-country. FX is handled inside the platform, so the sender never touches a parallel-market rate.",
  ],
  [
    "Sender control",
    "The payer chooses the goods, not the cash. Money lands as groceries at a door, with proof of delivery back to the sender.",
  ],
  [
    "Why it defends",
    "Remittance apps move money and stop. Retailers sell locally and stop. Owning both sides of that handover is what nobody else in the market has assembled.",
  ],
];

export function MoatSlide() {
  return (
    <SlideBase>
      <SlideChrome kicker="The Moat" index={4} />
      <Body>
        <h2 className="slide-title text-pnp-blue">
          Multi-cart, multi-currency: the moat competitors can’t copy quickly
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-8">
          {MOAT.map(([t, d]) => (
            <Card key={t} title={t} accent={t === "Why it defends" ? "blue" : "red"}>
              {d}
            </Card>
          ))}
        </div>
      </Body>
    </SlideBase>
  );
}

export const downstreamSlides: {
  id: string;
  title: string;
  Component: () => React.ReactElement;
}[] = [
  { id: "why-now", title: "Why Now", Component: WhyNowSlide },
  { id: "agnostic", title: "Retail-Agnostic End State", Component: AgnosticSlide },
  { id: "price-engine", title: "Price Comparison Engine", Component: PriceEngineSlide },
  { id: "subscription", title: "Subscription Is the Model", Component: SubscriptionSlide },
  { id: "consolidated-revenue", title: "Consolidated Revenue Model", Component: ConsolidatedRevenueSlide },
  { id: "revenue-mix", title: "Future Revenue Mix", Component: RevenueMixSlide },
  { id: "scooters", title: "Owned Delivery Network", Component: ScooterSlide },
  { id: "loyalty", title: "Loyalty & Device Migration", Component: LoyaltySlide },
  { id: "banking", title: "Bank-Agnostic Rails", Component: BankingSlide },
  { id: "wholesale", title: "Wholesale & Tuck Shops", Component: WholesaleSlide },
  { id: "structure", title: "Commercial & Entity Structure", Component: StructureSlide },
];
