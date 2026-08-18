import { execSync } from "node:child_process";
import fs from "node:fs";
import { resolve } from "node:path";
import PptxGenJS from "pptxgenjs";

const RED = "D0103A";
const RED_DEEP = "A50C2D";
const BLUE = "1B3A6B";
const BLUE_DEEP = "10243F";
const PAPER = "F7F7F9";
const INK = "16233A";
const MUTED = "5C6779";
const GOLD = "F2B233";
const WHITE = "FFFFFF";

// Pre-process and crop images to exact bounding box aspect ratios to prevent any stretching
const assetDir = resolve("/tmp/deck/assets");
fs.mkdirSync(assetDir, { recursive: true });

function cropImage(src, target, gravity, width, height) {
  const outPath = resolve(assetDir, target);
  if (!fs.existsSync(outPath)) {
    execSync(`convert "${src}" -gravity ${gravity} -crop ${width}x${height}+0+0 +repage "${outPath}"`);
  }
  return outPath;
}

const pCover = cropImage("src/assets/delivery-door.jpg", "door-cover.jpg", "East", 924, 1000);
const pFirstMover = cropImage("src/assets/delivery-door.jpg", "door-fm.jpg", "East", 782, 1000);
const pShopper = cropImage("src/assets/diaspora-shopper.jpg", "shopper-card.jpg", "Center", 780, 1000);
const pPickingBanner = cropImage("src/assets/store-picking.jpg", "picking-banner.jpg", "Center", 1600, 202);
const pBikeBanner = cropImage("src/assets/bike-courier.jpg", "bike-banner.jpg", "Center", 1600, 202);

const img = (p) => `image/${p.endsWith(".png") ? "png" : "jpeg"};base64,${fs.readFileSync(p).toString("base64")}`;

const LOGO_RECT = img("src/assets/tmpnp-logo-rect.png");
const LOGO_SQUARE = img("src/assets/tmpnp-logo-square.png");
const LOGO = LOGO_RECT;
const DOOR_COVER = img(pCover);
const DOOR_FM = img(pFirstMover);
const SHOPPER = img(pShopper);
const PICKING_BANNER = img(pPickingBanner);
const BIKE_BANNER = img(pBikeBanner);

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9"; // 10 x 5.625 in, landscape
const W = 10;
const H = 5.625;
const HEAD = "Georgia";
const BODY = "Calibri";

function chrome(slide, kicker, n, dark, narrow = 0) {
  const right = narrow ? narrow : W - 0.45;
  // White pill container with logo maintaining exact 7.11 aspect ratio
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 0.28, w: 1.75, h: 0.42, fill: { color: WHITE }, line: { color: WHITE }, rectRadius: 0.08 });
  slide.addImage({ data: LOGO, x: 0.54, y: 0.35, w: 1.56, h: 0.22 });
  slide.addText(kicker.toUpperCase(), { x: 2.35, y: 0.32, w: right - 2.95, h: 0.35, fontFace: BODY, fontSize: 10.5, bold: true, charSpacing: 1.5, color: dark ? "FFFFFF" : RED });
  slide.addText(String(n).padStart(2, "0"), { x: right - 0.55, y: 0.32, w: 0.55, h: 0.35, align: "right", fontFace: BODY, fontSize: 11, bold: true, color: dark ? "AAB6C8" : MUTED });
  slide.addText("TM Pick n Pay Express — Diaspora-to-Door", { x: 0.45, y: H - 0.45, w: 5, h: 0.3, fontFace: BODY, fontSize: 9, color: dark ? "8C9BB0" : MUTED });
  if (!narrow) slide.addText("Confidential · Executive Board Proposal", { x: W - 5.45, y: H - 0.45, w: 5, h: 0.3, align: "right", fontFace: BODY, fontSize: 9, color: dark ? "8C9BB0" : MUTED });
}

function title(slide, text, dark, y = 0.92) {
  slide.addText(text, { x: 0.45, y, w: W - 0.9, h: 0.8, fontFace: HEAD, fontSize: 26, bold: true, color: dark ? WHITE : BLUE });
}

function card(slide, { x, y, w, h, heading, body, accent = RED, dark = false, hs = 13, bs = 10, hh = 0.55 }) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: dark ? "1E426F" : WHITE }, line: { color: dark ? "1E426F" : "E2E5EB" }, rectRadius: 0.08 });
  slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.2, y: y + 0.18, w: 0.45, h: 0.055, fill: { color: accent }, line: { color: accent }, rectRadius: 0.03 });
  slide.addText(heading, { x: x + 0.2, y: y + 0.3, w: w - 0.4, h: hh, fontFace: HEAD, fontSize: hs, bold: true, color: dark ? WHITE : BLUE, margin: 0, valign: "top" });
  slide.addText(body, { x: x + 0.2, y: y + 0.3 + hh + 0.06, w: w - 0.4, h: h - (0.3 + hh + 0.06) - 0.15, fontFace: BODY, fontSize: bs, color: dark ? "D5DEEA" : MUTED, margin: 0, valign: "top" });
}

function panel(slide, { x, y, w, h, heading, body, fill = "1E426F", head = WHITE, text = "D5DEEA" }) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.08 });
  slide.addText(heading, { x: x + 0.2, y: y + 0.18, w: w - 0.4, h: 0.38, fontFace: HEAD, fontSize: 12.5, bold: true, color: head, margin: 0, valign: "top" });
  slide.addText(body, { x: x + 0.2, y: y + 0.58, w: w - 0.4, h: h - 0.72, fontFace: BODY, fontSize: 9.5, color: text, margin: 0, valign: "top" });
}

/* ================================================================== */
/* ACT 1 — THE PROPOSAL                                               */
/* ================================================================== */

/* 1 — Title */
{
  const s = pptx.addSlide();
  s.background = { color: BLUE_DEEP };
  s.addImage({ data: DOOR_COVER, x: 4.8, y: 0, w: 5.2, h: H });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 5.0, h: H, fill: { color: BLUE_DEEP } });
  s.addShape(pptx.ShapeType.rect, { x: 4.8, y: 0, w: 0.8, h: H, fill: { color: BLUE_DEEP, transparency: 30 }, line: { color: BLUE_DEEP, transparency: 100 } });
  
  s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 0.45, w: 2.1, h: 0.52, fill: { color: WHITE }, line: { color: WHITE }, rectRadius: 0.08 });
  s.addImage({ data: LOGO, x: 0.55, y: 0.53, w: 1.9, h: 0.267 });
  
  s.addText("EXECUTIVE BOARD PROPOSAL", { x: 0.45, y: 1.6, w: 5, h: 0.3, fontFace: BODY, fontSize: 12, bold: true, charSpacing: 3, color: GOLD });
  s.addText("TM Pick n Pay Express", { x: 0.45, y: 2.0, w: 4.7, h: 0.75, fontFace: HEAD, fontSize: 33, bold: true, color: WHITE });
  s.addText("Evolving Click & Collect into Diaspora-to-Door delivery", { x: 0.45, y: 2.85, w: 4.6, h: 0.7, fontFace: BODY, fontSize: 16, color: "D5DEEA" });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 3.75, w: 1.2, h: 0.08, fill: { color: RED }, line: { color: RED }, rectRadius: 0.04 });
  s.addText("Prepared for the Executive Board · TM Pick n Pay Zimbabwe & Meikles Limited", { x: 0.45, y: 4.1, w: 4.6, h: 0.5, fontFace: BODY, fontSize: 11.5, color: "9FB0C6" });
}

/* 2 — Opportunity */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Slide 01 · The Opportunity", 1, false);
  title(s, "Monetising the digital infrastructure you already own", false);
  const cw = 2.15, ch = 3.15;
  card(s, { x: 0.45, y: 1.8, w: cw, h: ch, heading: "The foundation", body: "tmpnponline.co.zw and the dedicated app are already live, running localized Click & Collect across the estate.", hs: 13, bs: 10, hh: 0.5 });
  card(s, { x: 0.45 + cw + 0.15, y: 1.8, w: cw, h: ch, heading: "The optimization gap", accent: BLUE, body: "Collection demands transport, fuel and time. Diaspora buyers still pay Malayitsha vans purely for doorstep convenience.", hs: 13, bs: 10, hh: 0.5 });
  card(s, { x: 0.45 + 2 * (cw + 0.15), y: 1.8, w: cw, h: ch, heading: "Our value proposition", body: "A Diaspora UI mode plus a decentralised last-mile network turns 57+ branches into on-demand fulfilment nodes.", hs: 13, bs: 10, hh: 0.5 });
  
  // Right side photo matching web app card
  s.addShape(pptx.ShapeType.roundRect, { x: 7.35, y: 1.8, w: 2.2, h: ch, fill: { color: WHITE }, line: { color: "E2E5EB" }, rectRadius: 0.08 });
  s.addImage({ data: SHOPPER, x: 7.35, y: 1.8, w: 2.2, h: ch });
}

/* 3 — Status quo vs evolution */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Slide 02 · Status Quo vs Evolution", 2, false);
  title(s, "Bypassing physical logistics friction", false);
  const flow = (y, label, dot, steps) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y, w: 9.1, h: 1.15, fill: { color: WHITE }, line: { color: "E2E5EB" }, rectRadius: 0.08 });
    s.addShape(pptx.ShapeType.ellipse, { x: 0.7, y: y + 0.22, w: 0.16, h: 0.16, fill: { color: dot }, line: { color: dot } });
    s.addText(label, { x: 0.95, y: y + 0.13, w: 8.4, h: 0.35, fontFace: HEAD, fontSize: 13.5, bold: true, color: BLUE, margin: 0 });
    const bw = (8.6 - (steps.length - 1) * 0.18) / steps.length;
    steps.forEach((st, i) => {
      const x = 0.7 + i * (bw + 0.18);
      s.addShape(pptx.ShapeType.roundRect, { x, y: y + 0.6, w: bw, h: 0.42, fill: { color: PAPER }, line: { color: "E2E5EB" }, rectRadius: 0.06 });
      s.addText(st, { x, y: y + 0.6, w: bw, h: 0.42, align: "center", valign: "middle", fontFace: BODY, fontSize: 9.5, bold: true, color: INK, margin: 0 });
    });
  };
  flow(1.8, "Current system — Click & Collect", RED, ["Diaspora shopper", "Web / app order", "Recipient must travel", "Urban branches only"]);
  flow(3.1, "The evolution — On-demand diaspora engine", BLUE, ["Diaspora shopper", "Targeted ad tracking", "Pure US$ gateway", "Local bike courier", "Recipient's door"]);
  s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 4.45, w: 4.45, h: 0.65, fill: { color: BLUE }, line: { color: BLUE }, rectRadius: 0.08 });
  s.addText("Rural and elderly recipients cannot easily reach a flagship branch such as Borrowdale or Kamfinsa to collect heavy hampers.", { x: 0.65, y: 4.45, w: 4.05, h: 0.65, valign: "middle", fontFace: BODY, fontSize: 9.5, color: WHITE, margin: 0 });
  s.addShape(pptx.ShapeType.roundRect, { x: 5.1, y: 4.45, w: 4.45, h: 0.65, fill: { color: RED }, line: { color: RED }, rectRadius: 0.08 });
  s.addText("Door-to-door fulfilment expands the addressable market to sponsors who want absolute confirmation that food arrived safely.", { x: 5.3, y: 4.45, w: 4.05, h: 0.65, valign: "middle", fontFace: BODY, fontSize: 9.5, color: WHITE, margin: 0 });
}

/* 4 — The Moat (multi-cart, multi-currency) */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "The Moat", 3, false);
  title(s, "Multi-cart, multi-currency: the moat competitors can’t copy quickly", false);
  const items = [
    ["Multi-cart", "One diaspora sender runs several carts at once — mother in Bulawayo, sister in Gweru, a school tuck order — each with its own recipient, address and delivery slot.", RED],
    ["Multi-currency", "Pay in GBP, USD, ZAR or EUR; settle in-country. FX is handled inside the platform, so the sender never touches a parallel-market rate.", RED],
    ["Sender control", "The payer chooses the goods, not the cash. Money lands as groceries at a door, with proof of delivery back to the sender.", RED],
    ["Why it defends", "Remittance apps move money and stop. Retailers sell locally and stop. Owning both sides of that handover is what nobody else in the market has assembled.", BLUE],
  ];
  items.forEach(([h, b, a], i) => {
    const x = 0.45 + (i % 2) * 4.68;
    const y = 1.8 + Math.floor(i / 2) * 1.5;
    card(s, { x, y, w: 4.42, h: 1.38, heading: h, body: b, accent: a, hs: 13.5, bs: 10.5, hh: 0.38 });
  });
}

/* 5 — Value proposition */
{
  const VALUE_PROPS = [
    ["White-label solution", "A customizable platform retailers brand as their own, with flexible commercial models — subscription or commission-based."],
    ["Time-to-market advantage", "Leverage existing integrations (API, SIM switch, payments platform) to launch quickly and capture customers before competitors."],
    ["Robust and secure platform", "A reliable, scalable and secure system compared to informal, unregulated channels."],
    ["Bank-agnostic integration", "Participation across multiple banks, expanding reach and customer access."],
    ["Critical mass creation", "Not just a platform — support in building user adoption through partnerships with banks and diaspora communities."],
    ["Hybrid commercial model", "Transaction-based fees, subscription or discounts, allowing flexibility for different business strategies."],
    ["Adaptability to market dynamics", "Analytics and intelligence to adjust pricing, packaging and delivery models as consumer behaviour shifts."],
    ["Direct-to-Consumer", "Moving beyond brick-and-mortar retail into a direct relationship with the shopper."],
  ];
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Slide 09 · Value Proposition", 4, false);
  title(s, "What the platform uniquely delivers", false);
  const cw = 2.2, ch = 1.48, gx = 0.24, gy = 0.18, x0 = 0.45, y0 = 1.8;
  VALUE_PROPS.forEach(([h, b], i) => {
    const x = x0 + (i % 4) * (cw + gx);
    const y = y0 + Math.floor(i / 4) * (ch + gy);
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: cw, h: ch, fill: { color: WHITE }, line: { color: "E2E5EB" }, rectRadius: 0.08 });
    const accent = i % 2 ? BLUE : RED;
    s.addShape(pptx.ShapeType.roundRect, { x: x + 0.2, y: y + 0.18, w: 0.4, h: 0.055, fill: { color: accent }, line: { color: accent }, rectRadius: 0.03 });
    s.addText(h, { x: x + 0.2, y: y + 0.32, w: cw - 0.4, h: 0.42, fontFace: HEAD, fontSize: 11, bold: true, color: BLUE, margin: 0, valign: "top" });
    s.addText(b, { x: x + 0.2, y: y + 0.74, w: cw - 0.4, h: ch - 0.9, fontFace: BODY, fontSize: 8.5, color: MUTED, margin: 0, valign: "top" });
  });
}

/* 6 — First mover */
{
  const s = pptx.addSlide();
  s.background = { color: RED_DEEP };
  s.addImage({ data: DOOR_FM, x: 5.6, y: 0, w: 4.4, h: H });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 5.8, h: H, fill: { color: RED_DEEP } });
  chrome(s, "Slide 08 · First-Mover Advantage", 5, true, 5.7);
  s.addText("A defensive moat against OK Zimbabwe & Choppies", { x: 0.45, y: 0.95, w: 5.1, h: 0.85, fontFace: HEAD, fontSize: 24, bold: true, color: WHITE });
  const block = (y, tag, text) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y, w: 5.1, h: 1.35, fill: { color: "C21740" }, line: { color: "C21740" }, rectRadius: 0.08 });
    s.addShape(pptx.ShapeType.roundRect, { x: 0.68, y: y + 0.18, w: 1.75, h: 0.3, fill: { color: WHITE }, line: { color: WHITE }, rectRadius: 0.15 });
    s.addText(tag, { x: 0.68, y: y + 0.18, w: 1.75, h: 0.3, align: "center", valign: "middle", fontFace: BODY, fontSize: 9.5, bold: true, color: RED_DEEP, margin: 0 });
    s.addText(text, { x: 0.68, y: y + 0.58, w: 4.65, h: 0.68, fontFace: BODY, fontSize: 11, color: "FDE7EC", margin: 0, valign: "top" });
  };
  block(1.95, "Market leadership", "While competitors stay focused on brick-and-mortar or basic localized delivery, TM PnP becomes the definitive cross-border retail pipeline for the diaspora ecosystem.");
  block(3.45, "Maximising group assets", "Collection desks convert into high-volume dispatch stations, lifting stock turnover speed across all primary product lines.");
}

/* ================================================================== */
/* ACT 2 — THE NUMBERS TODAY                                          */
/* ================================================================== */

/* 7 — GMV assumptions */
{
  const s = pptx.addSlide();
  s.background = { color: BLUE_DEEP };
  chrome(s, "Slide 03 · P&L Assumptions", 6, true);
  title(s, "Consolidating diaspora remittances and cross-border shopping into a US$61.2M pipeline", true);
  const stats = [["40,000", "Active diaspora customers"], ["1.5", "Orders per month"], ["US$85", "Average basket size"], ["12", "Months"]];
  stats.forEach(([v, l], i) => {
    const x = 0.45 + i * 2.31;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.95, w: 2.11, h: 1.2, fill: { color: "1E426F" }, line: { color: "1E426F" }, rectRadius: 0.08 });
    s.addText(v, { x: x + 0.2, y: 2.1, w: 1.75, h: 0.6, fontFace: HEAD, fontSize: 26, bold: true, color: WHITE, margin: 0 });
    s.addText(l, { x: x + 0.2, y: 2.68, w: 1.75, h: 0.4, fontFace: BODY, fontSize: 10, color: "AEBED2", margin: 0 });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 3.35, w: 9.1, h: 1.5, fill: { color: RED }, line: { color: RED }, rectRadius: 0.1 });
  s.addText("TOTAL GROSS BASKET SPEND (GMV)", { x: 0.85, y: 3.55, w: 5, h: 0.3, fontFace: BODY, fontSize: 11, bold: true, charSpacing: 2, color: "F7CBD4", margin: 0 });
  s.addText("US$61,200,000", { x: 0.85, y: 3.85, w: 5, h: 0.8, fontFace: HEAD, fontSize: 36, bold: true, color: WHITE, margin: 0 });
  s.addText("40,000 customers × 1.5 orders × US$85 × 12 months — migrated from cash remittances and Malayitsha vans into a tracked US$ retail pipeline (capturing ~28% direct ecosystem revenue in Phase 1).", { x: 5.7, y: 3.55, w: 3.5, h: 1.1, fontFace: BODY, fontSize: 10.5, color: "FBE3E8", margin: 0, valign: "middle" });
}

/* 8 — Revenue streams */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Slide 03 · Five Revenue Streams", 7, false);
  title(s, "Five stacked revenue streams", false);
  s.addShape(pptx.ShapeType.roundRect, { x: 5.6, y: 0.98, w: 3.95, h: 0.36, fill: { color: "FBE3E8" }, line: { color: "FBE3E8" }, rectRadius: 0.18 });
  s.addText("Captured Value: ~28% take-rate on US$61.2M GMV", { x: 5.6, y: 0.98, w: 3.95, h: 0.36, align: "center", valign: "middle", fontFace: BODY, fontSize: 9.5, bold: true, color: RED, margin: 0 });
  const items = [
    ["1. Retail product margins", "Spread captured on goods otherwise bought in South African cash-and-carries. 21% gross margin.", "US$12,852,000"],
    ["2. Last-mile delivery share", "US$4.50 fee within 10km; the platform retains US$1.50 net per drop.", "US$1,080,000"],
    ["3. Cross-border surcharge", "3% checkout fee on international cards originating outside Zimbabwe.", "US$1,836,000"],
    ["4. Diaspora Priority tiers", "US$8.99/month for free delivery and recurring staple baskets. 15% adoption.", "US$647,280"],
    ["5. Retail media network", "FMCG brands bid for sponsored placement in front of high-spend diaspora buyers.", "US$734,400"],
  ];
  const cw = 2.95, ch = 1.35;
  items.forEach((it, i) => {
    const x = 0.45 + (i % 3) * (cw + 0.15);
    const y = 1.95 + Math.floor(i / 3) * (ch + 0.15);
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: cw, h: ch, fill: { color: WHITE }, line: { color: "E2E5EB" }, rectRadius: 0.08 });
    s.addText(it[0], { x: x + 0.2, y: y + 0.15, w: cw - 0.4, h: 0.3, fontFace: HEAD, fontSize: 13, bold: true, color: BLUE, margin: 0 });
    s.addText(it[1], { x: x + 0.2, y: y + 0.48, w: cw - 0.4, h: 0.5, fontFace: BODY, fontSize: 9.5, color: MUTED, margin: 0, valign: "top" });
    s.addText(it[2], { x: x + 0.2, y: y + 1.0, w: cw - 0.4, h: 0.3, fontFace: HEAD, fontSize: 14.5, bold: true, color: RED, margin: 0 });
  });
  const x = 0.45 + 2 * (cw + 0.15), y = 1.95 + (ch + 0.15);
  s.addShape(pptx.ShapeType.roundRect, { x, y, w: cw, h: ch, fill: { color: BLUE }, line: { color: BLUE }, rectRadius: 0.08 });
  s.addText("PHASE 1 ECOSYSTEM", { x: x + 0.2, y: y + 0.2, w: cw - 0.4, h: 0.25, fontFace: BODY, fontSize: 10, bold: true, charSpacing: 2, color: GOLD, margin: 0 });
  s.addText("US$17,149,680", { x: x + 0.2, y: y + 0.5, w: cw - 0.4, h: 0.45, fontFace: HEAD, fontSize: 22, bold: true, color: WHITE, margin: 0 });
  s.addText("Direct margin & platform fees captured on US$61.2M GMV", { x: x + 0.2, y: y + 0.95, w: cw - 0.4, h: 0.35, fontFace: BODY, fontSize: 8.5, color: "C6D3E4", margin: 0 });
}

/* 9 — Breakdown chart */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Slide 04 · Revenue Breakdown", 8, false);
  title(s, "Projected total ecosystem annual revenue", false);
  s.addText("US$17,149,680", { x: 0.45, y: 1.62, w: 4, h: 0.4, fontFace: HEAD, fontSize: 20, bold: true, color: RED });
  const rows = [
    ["Incremental retail margins", 12852000, "21% gross retail margin"],
    ["Last-mile delivery share", 1080000, "US$1.50 net per drop"],
    ["Cross-border tech surcharge", 1836000, "3% on international cards"],
    ["Diaspora Priority subscriptions", 647280, "6,000 subscribers @ US$8.99"],
    ["Supplier-funded retail media", 734400, "1.2% of platform GMV"],
  ];
  const max = 12852000;
  rows.forEach((r, i) => {
    const y = 2.2 + i * 0.55;
    s.addText(r[0], { x: 0.45, y, w: 3.0, h: 0.26, fontFace: BODY, fontSize: 11.5, bold: true, color: INK, margin: 0 });
    s.addText(r[2], { x: 0.45, y: y + 0.24, w: 3.0, h: 0.24, fontFace: BODY, fontSize: 9, color: MUTED, margin: 0 });
    s.addShape(pptx.ShapeType.roundRect, { x: 3.6, y: y + 0.1, w: 4.35, h: 0.3, fill: { color: "E7EAF0" }, line: { color: "E7EAF0" }, rectRadius: 0.15 });
    s.addShape(pptx.ShapeType.roundRect, { x: 3.6, y: y + 0.1, w: Math.max(0.35, (r[1] / max) * 4.35), h: 0.3, fill: { color: RED }, line: { color: RED }, rectRadius: 0.15 });
    s.addText("US$" + r[1].toLocaleString("en-US"), { x: 8.1, y: y + 0.08, w: 1.45, h: 0.32, align: "right", fontFace: HEAD, fontSize: 12.5, bold: true, color: BLUE, margin: 0 });
  });
}

/* 10 — Distinction: GMV vs Ecosystem Revenue */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Financial Architecture · GMV vs Revenue", 9, false);
  title(s, "The Distinction: GMV vs. Ecosystem Revenue", false);
  s.addShape(pptx.ShapeType.roundRect, { x: 6.8, y: 0.98, w: 2.75, h: 0.36, fill: { color: BLUE }, line: { color: BLUE }, rectRadius: 0.18 });
  s.addText("Numbers Breakdown", { x: 6.8, y: 0.98, w: 2.75, h: 0.36, align: "center", valign: "middle", fontFace: BODY, fontSize: 9.5, bold: true, color: WHITE, margin: 0 });

  const cards = [
    {
      tag: "TRANSACTION FLOW",
      tagColor: RED,
      tagTextColor: WHITE,
      metric: "Gross Merchandise Value",
      amount: "US$61,200,000",
      amountColor: RED,
      role: "TOTAL GROCERY BASKET SPEND THROUGHPUT",
      desc: "40,000 diaspora shoppers × 1.5 orders/mo × US$85 avg basket × 12 months. This is the total cash transacted at checkout.",
      detail: "Represents migrated spend currently captured by South African cash-and-carries and informal Malayitsha vans.",
      border: "F7CBD4",
      bg: WHITE,
    },
    {
      tag: "DIRECT CAPTURE (~28%)",
      tagColor: BLUE,
      tagTextColor: WHITE,
      metric: "Phase 1 Ecosystem Revenue",
      amount: "US$17,149,680",
      amountColor: BLUE,
      role: "DIRECT CAPTURED EARNINGS ON $61.2M GMV",
      desc: "Direct value captured on that basket volume across 5 stacked streams:",
      detail: "• 21% Retail Margin (US$12.85M)\n• 3% Card Surcharge (US$1.84M)\n• Last-Mile Delivery Share (US$1.08M)\n• Retail Media Network (US$734k)\n• Diaspora Priority Memberships (US$647k)",
      border: "C6D3E4",
      bg: WHITE,
    },
    {
      tag: "FULL PLATFORM STEADY STATE",
      tagColor: GOLD,
      tagTextColor: INK,
      metric: "Phase 2 Ecosystem Revenue",
      amount: "US$21,841,380",
      amountColor: BLUE_DEEP,
      role: "PHASE 1 CAPTURE + B2B/B2C SUBSCRIPTIONS",
      desc: "Phase 1 Retail Capture ($17.15M) + Phase 2 Recurring Subscription Layer ($4.69M):",
      detail: "• 240 Tenant Software Licences ($717k)\n• 900 Scooter Rider Fleet Plans ($486k)\n• 900 Garage & Maintenance Plans ($194k)\n• 40 Market Data Licences ($720k)\n• 45,000 Shopper Memberships ($2.15M)\n• 3,500 Tuck-Shop Apps ($420k)",
      border: "335C94",
      bg: "F0F4FA",
    },
  ];

  cards.forEach((c, i) => {
    const x = 0.45 + i * 3.1;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.75, w: 2.9, h: 3.45, fill: { color: c.bg }, line: { color: c.border }, rectRadius: 0.08 });
    s.addShape(pptx.ShapeType.roundRect, { x: x + 0.18, y: 1.9, w: 2.54, h: 0.28, fill: { color: c.tagColor }, line: { color: c.tagColor }, rectRadius: 0.14 });
    s.addText(c.tag, { x: x + 0.18, y: 1.9, w: 2.54, h: 0.28, align: "center", valign: "middle", fontFace: BODY, fontSize: 8.5, bold: true, color: c.tagTextColor, margin: 0 });
    
    s.addText(c.metric, { x: x + 0.18, y: 2.25, w: 2.54, h: 0.35, fontFace: HEAD, fontSize: 11.5, bold: true, color: BLUE, margin: 0 });
    s.addText(c.amount, { x: x + 0.18, y: 2.55, w: 2.54, h: 0.45, fontFace: HEAD, fontSize: 18, bold: true, color: c.amountColor, margin: 0 });
    s.addText(c.role, { x: x + 0.18, y: 2.98, w: 2.54, h: 0.2, fontFace: BODY, fontSize: 7.5, bold: true, charSpacing: 1, color: MUTED, margin: 0 });
    s.addText(c.desc, { x: x + 0.18, y: 3.2, w: 2.54, h: 0.65, fontFace: BODY, fontSize: 8.5, color: INK, margin: 0, valign: "top" });

    s.addShape(pptx.ShapeType.roundRect, { x: x + 0.15, y: 3.9, w: 2.6, h: 1.15, fill: { color: PAPER }, line: { color: "E2E5EB" }, rectRadius: 0.06 });
    s.addText(c.detail, { x: x + 0.22, y: 3.95, w: 2.46, h: 1.05, fontFace: BODY, fontSize: 7.5, color: MUTED, margin: 0, valign: "top" });
  });
}

/* ================================================================== */
/* ACT 3 — HOW WE DO THE DEAL                                         */
/* ================================================================== */

/* 11 — Options */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Slide 05 · Business Model Options", 10, false);
  title(s, "Aligning risk, capital and structure", false);
  
  const opts = [
    {
      tag: "OPTION 1",
      title: "Independent Concierge (Reseller)",
      body: "We operate as a standalone entity mirroring your catalog via API. Senders pay us in US$; we buy stock from TM PnP at a negotiated wholesale discount and fulfill with our own driver network.",
      setup: "US$100,000",
      rev: "5–8% markup + 3–5% rebate",
    },
    {
      tag: "OPTION 2",
      title: "White-Label Software Licensing",
      body: "We build the cross-border storefront extension and license it to TM PnP. It integrates into tmpnponline.co.zw, natively branded, fulfilled by third-party Zimbabwean couriers.",
      setup: "US$75,000",
      rev: "1.5–2% GMV revenue share",
    },
  ];

  opts.forEach((o, i) => {
    const x = 0.45 + i * 4.7;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.75, w: 4.4, h: 2.15, fill: { color: WHITE }, line: { color: "E2E5EB" }, rectRadius: 0.08 });
    s.addShape(pptx.ShapeType.roundRect, { x: x + 0.22, y: 1.9, w: 1.1, h: 0.28, fill: { color: RED }, line: { color: RED }, rectRadius: 0.14 });
    s.addText(o.tag, { x: x + 0.22, y: 1.9, w: 1.1, h: 0.28, align: "center", valign: "middle", fontFace: BODY, fontSize: 9.5, bold: true, color: WHITE, margin: 0 });
    s.addText(o.title, { x: x + 1.4, y: 1.86, w: 2.85, h: 0.34, fontFace: HEAD, fontSize: 12.5, bold: true, color: BLUE, margin: 0, valign: "middle" });
    s.addText(o.body, { x: x + 0.22, y: 2.25, w: 3.98, h: 0.85, fontFace: BODY, fontSize: 9.5, color: MUTED, margin: 0, valign: "top" });
    
    // Pricing grid
    const cx1 = x + 0.22;
    s.addText("SETUP FEE", { x: cx1, y: 3.15, w: 1.9, h: 0.18, fontFace: BODY, fontSize: 8, bold: true, charSpacing: 1, color: MUTED, margin: 0 });
    s.addText(o.setup, { x: cx1, y: 3.32, w: 1.9, h: 0.45, fontFace: HEAD, fontSize: 13, bold: true, color: RED, margin: 0, valign: "top" });

    const cx2 = x + 2.2;
    s.addText("COMMERCIAL SPLIT / TAKE", { x: cx2, y: 3.15, w: 2.0, h: 0.18, fontFace: BODY, fontSize: 8, bold: true, charSpacing: 1, color: MUTED, margin: 0 });
    s.addText(o.rev, { x: cx2, y: 3.32, w: 2.0, h: 0.45, fontFace: BODY, fontSize: 9, bold: true, color: BLUE, margin: 0, valign: "top" });
  });

  s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 4.05, w: 9.1, h: 1.15, fill: { color: WHITE }, line: { color: "E2E5EB" }, rectRadius: 0.08 });
  s.addImage({ data: PICKING_BANNER, x: 0.45, y: 4.05, w: 9.1, h: 1.15 });
}

/* 12 — Matrix */
{
  const s = pptx.addSlide();
  s.background = { color: BLUE_DEEP };
  chrome(s, "Slide 06 · Configuration Matrix", 11, true);
  title(s, "Commercial model comparison", true);
  const head = ["Metric", "Option 1 · Independent Concierge (Reseller)", "Option 2 · White-Label Software Licensing"];
  const rows = [
    ["Upfront capital", "US$100,000", "US$75,000"],
    ["Operational effort", "Extremely high", "Very low"],
    ["Time to market", "3–4 months", "4–5 months"],
    ["Primary revenue", "Product markups", "Licensing fees"],
    ["TM PnP risk tier", "Zero risk (Turnkey operator)", "Technology buyer & owner"],
  ];
  const body = [
    head.map((h) => ({ text: h, options: { fill: { color: RED }, color: WHITE, bold: true, fontSize: 11.5, fontFace: HEAD } })),
    ...rows.map((r, i) => r.map((c, j) => ({
      text: c,
      options: { fill: { color: i % 2 ? "16304F" : "1B3A6B" }, color: j === 0 ? GOLD : "E3EAF4", bold: j === 0, fontSize: 10.5, fontFace: BODY },
    }))),
  ];
  s.addTable(body, { x: 0.45, y: 1.95, w: 9.1, colW: [2.5, 3.3, 3.3], rowH: 0.52, valign: "middle", margin: 0.12, border: { type: "solid", color: BLUE_DEEP, pt: 1 } });
}

/* 13 — Integrations */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Slide 07 · Critical Integrations", 12, false);
  title(s, "Building beyond the current platform", false);
  s.addText("Three new components layer over the existing web framework.", { x: 0.45, y: 1.72, w: 8, h: 0.3, fontFace: BODY, fontSize: 12.5, color: MUTED });
  const cw = 2.9, ch = 2.6;
  card(s, { x: 0.45, y: 2.15, w: cw, h: ch, heading: "Geo-fenced marketing core", body: "Hyper-targeted social and digital advertising aimed at high-density Zimbabwean pockets — Hillbrow and Randburg in South Africa, London and Leeds in the UK." });
  card(s, { x: 0.45 + cw + 0.2, y: 2.15, w: cw, h: ch, accent: BLUE, heading: "API logistics middleware", body: "A dispatch interface linking the TM PnP back-end to localized courier networks and on-demand e-bike fleets for route optimisation and proof of delivery." });
  card(s, { x: 0.45 + 2 * (cw + 0.2), y: 2.15, w: cw, h: ch, heading: "Real-time substitution logic", body: "An automated WhatsApp bot lets the sender or recipient approve alternatives instantly when an item goes out of stock during picking." });
}

/* 14 — Benefits */
{
  const BENEFITS = [
    ["Faster market entry", "Existing developer integrations accelerate rollout."],
    ["Customer convenience", "Digital shift lets diaspora and local customers buy from anywhere."],
    ["Expanded customer base", "Diaspora markets plus multiple banks' captured audiences."],
    ["Replacement of informal trading", "A legitimate, tax-compliant alternative to unreliable channels."],
    ["Cross-border resilience", "Bypasses constraints on physical goods movement between countries."],
    ["Economies of scale", "Better prices and smaller packages matched to consumer cash flow."],
    ["Increased loyalty & retention", "Secure, reliable delivery builds trust vs informal traders."],
    ["Revenue diversification", "Subscriptions, fees or discounts plus wholesale partnerships."],
    ["Scalability", "Regional expansion with packaging adapted to local needs."],
    ["Convenience-driven adoption", "Small daily-use packages fit township and village habits."],
    ["Government alignment", "Formalized trade supports taxation and regulation."],
  ];
  const s = pptx.addSlide();
  s.background = { color: BLUE_DEEP };
  chrome(s, "Slide 10 · Benefits", 13, true);
  title(s, "Benefits to TM Pick n Pay and the market", true);
  const cw = 2.98, ch = 0.72, gx = 0.18, gy = 0.1, x0 = 0.45, y0 = 1.78;
  BENEFITS.forEach(([h, b], i) => {
    const x = x0 + (i % 3) * (cw + gx);
    const y = y0 + Math.floor(i / 3) * (ch + gy);
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: cw, h: ch, fill: { color: "1E426F" }, line: { color: "1E426F" }, rectRadius: 0.07 });
    s.addShape(pptx.ShapeType.ellipse, { x: x + 0.18, y: y + 0.16, w: 0.12, h: 0.12, fill: { color: GOLD }, line: { color: GOLD } });
    s.addText(h, { x: x + 0.4, y: y + 0.1, w: cw - 0.6, h: 0.24, fontFace: HEAD, fontSize: 10.5, bold: true, color: WHITE, margin: 0, valign: "top" });
    s.addText(b, { x: x + 0.4, y: y + 0.34, w: cw - 0.6, h: 0.36, fontFace: BODY, fontSize: 8.5, color: "C6D3E4", margin: 0, valign: "top" });
  });
}

/* ================================================================== */
/* ACT 4 — WHERE IT GOES NEXT: THE AGNOSTIC PLATFORM                  */
/* ================================================================== */

/* 15 — Why now */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Slide 14 · Why Now", 14, false);
  title(s, "Sell market access and intelligence — not “a diaspora solution”", false);
  const items = [
    ["Brick-and-mortar is no longer defensible", "Footfall retail cannot hold share on its own. The defensible asset is the customer relationship, not the store estate."],
    ["Buyers are price-led, not brand-led", "Households shop the cheapest basket available on the day. Informal channels are winning that comparison by default."],
    ["The Malayitsha channel is being constricted", "One-stop border posts, electronic travel authority and tighter vehicle declarations are squeezing the informal cross-border van trade."],
    ["The opening left behind", "Diaspora funding + bank rails + owned delivery + wholesale into the informal channel — a brand that lives in people's homes."],
  ];
  items.forEach(([h, b], i) => {
    card(s, { x: 0.45 + (i % 2) * 4.68, y: 1.85 + Math.floor(i / 2) * 1.35, w: 4.42, h: 1.22, heading: h, body: b, accent: i % 2 ? BLUE : RED });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 4.6, w: 9.1, h: 0.62, fill: { color: BLUE }, line: { color: BLUE }, rectRadius: 0.08 });
  s.addText("Positioning discipline: the pitch is market access and demand intelligence. Framed as a diaspora product, it reads as a niche remittance play and stalls in committee.", { x: 0.7, y: 4.6, w: 8.6, h: 0.62, valign: "middle", fontFace: BODY, fontSize: 10, color: WHITE, margin: 0 });
}

/* 17 — Retail-agnostic end state */
{
  const s = pptx.addSlide();
  s.background = { color: BLUE_DEEP };
  chrome(s, "Slide 15 · Downstream Innovation", 16, true);
  title(s, "The end state is a trading platform, not a single-retailer app", true);
  const phases = [
    ["Phase 1 · Entry", "TM Pick n Pay value-add", "Single-tenant. TM branded, TM catalogue, TM fulfilment. The platform earns its place inside one retailer before anything else is discussed."],
    ["Phase 2 · Depth", "Wholesale and informal channel", "TM supplies tuck shops and repackagers through the same rails. Volume grows without adding a competing banner to the storefront."],
    ["Phase 3 · End state", "Retail-agnostic trading platform", "Shopper asks for cooking oil; the request goes to every participating supplier and the best price wins. Retailers become suppliers on a marketplace."],
  ];
  phases.forEach(([k, t, d], i) => {
    const x = 0.45 + i * 3.1;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.85, w: 2.9, h: 2.0, fill: { color: "1E426F" }, line: { color: "1E426F" }, rectRadius: 0.08 });
    s.addShape(pptx.ShapeType.roundRect, { x: x + 0.22, y: 2.02, w: 1.5, h: 0.3, fill: { color: GOLD }, line: { color: GOLD }, rectRadius: 0.15 });
    s.addText(k, { x: x + 0.22, y: 2.02, w: 1.5, h: 0.3, align: "center", valign: "middle", fontFace: BODY, fontSize: 9, bold: true, color: INK, margin: 0 });
    s.addText(t, { x: x + 0.22, y: 2.42, w: 2.46, h: 0.4, fontFace: HEAD, fontSize: 12, bold: true, color: WHITE, margin: 0 });
    s.addText(d, { x: x + 0.22, y: 2.84, w: 2.46, h: 0.9, fontFace: BODY, fontSize: 9, color: "C6D3E4", margin: 0, valign: "top" });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 4.05, w: 4.45, h: 1.05, fill: { color: RED }, line: { color: RED }, rectRadius: 0.08 });
  s.addText("Multi-tenant has already been prototyped — three banners running in one app — then deliberately pulled back to a single tenant for the entry conversation.", { x: 0.68, y: 4.05, w: 4.0, h: 1.05, valign: "middle", fontFace: BODY, fontSize: 9.5, color: "FDE7EC", margin: 0 });
  s.addShape(pptx.ShapeType.roundRect, { x: 5.1, y: 4.05, w: 4.45, h: 1.05, fill: { color: "1E426F" }, line: { color: "1E426F" }, rectRadius: 0.08 });
  s.addText("Sequencing is the safeguard: introduce the platform as a TM advantage, without signalling that competitors sit on the same rails on day one.", { x: 5.33, y: 4.05, w: 4.0, h: 1.05, valign: "middle", fontFace: BODY, fontSize: 9.5, color: "C6D3E4", margin: 0 });
}

/* 18 — Price comparison engine */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Slide 16 · Price Comparison Engine", 17, false);
  title(s, "Item-level price comparison is the reason to participate", false);
  s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 1.85, w: 5.0, h: 3.25, fill: { color: WHITE }, line: { color: "E2E5EB" }, rectRadius: 0.08 });
  s.addText("SHOPPER REQUEST · “COOKING OIL”", { x: 0.7, y: 2.02, w: 4.5, h: 0.28, fontFace: BODY, fontSize: 9, bold: true, charSpacing: 1.5, color: MUTED, margin: 0 });
  const rows = [
    ["Supplier A · 2L cooking oil", "US$3.10", "Best price · 2.1km"],
    ["Supplier B · 2L cooking oil", "US$3.45", "Faster slot · 0.8km"],
    ["Supplier C · 2L cooking oil", "US$3.60", "Bundle offer"],
    ["Tuck shop · 500ml repack", "US$0.95", "Local fulfilment"],
  ];
  rows.forEach(([item, price, note], i) => {
    const y = 2.4 + i * 0.66;
    const best = i === 0;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.7, y, w: 4.5, h: 0.56, fill: { color: best ? BLUE : PAPER }, line: { color: best ? BLUE : "E2E5EB" }, rectRadius: 0.07 });
    s.addText(item, { x: 0.9, y: y + 0.07, w: 2.9, h: 0.24, fontFace: BODY, fontSize: 10, bold: true, color: best ? WHITE : INK, margin: 0 });
    s.addText(note, { x: 0.9, y: y + 0.3, w: 2.9, h: 0.22, fontFace: BODY, fontSize: 8.5, color: best ? "C6D3E4" : MUTED, margin: 0 });
    s.addText(price, { x: 3.85, y, w: 1.15, h: 0.56, align: "right", valign: "middle", fontFace: HEAD, fontSize: 14, bold: true, color: best ? WHITE : INK, margin: 0 });
  });
  card(s, { x: 5.65, y: 1.85, w: 3.9, h: 1.55, heading: "Comparison across every participating supplier", body: "One request fans out to all listed suppliers. The shopper sees price, distance and slot side by side and picks. Price competition, not shelf position, decides the sale." });
  card(s, { x: 5.65, y: 3.55, w: 3.9, h: 1.55, accent: BLUE, heading: "AI ranking of most-tradable items", body: "The engine ranks demand by item, area and week — a what-to-stock signal feeding order-to-cash: buy the right depth, in the right pack size, before the demand lands." });
}

/* 19 — Bank-agnostic rails */
{
  const s = pptx.addSlide();
  s.background = { color: BLUE_DEEP };
  chrome(s, "Slide 22 · Payment Rails", 18, true);
  title(s, "Bank-agnostic by design, multi-bank in practice", true);
  panel(s, { x: 0.45, y: 1.85, w: 4.45, h: 2.35, heading: "What we say to banks", body: "Plug your remittance APIs into the platform and we bring transaction share-of-wallet: recurring diaspora flows landing as retail settlement rather than cash-out.\n\nNo exclusivity is requested and none is given. Every rail is one integration among several, so pricing stays competitive and no single institution gates the platform." });
  panel(s, { x: 5.1, y: 1.85, w: 4.45, h: 2.35, heading: "What we say to the retailer", body: "Banks bring critical mass. Their diaspora bases are already captured audiences; the platform converts those balances into baskets inside your estate.\n\nInstitutions under discussion are prospects at this stage. Nothing is presented in-app as a confirmed partnership until an agreement is signed." });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 4.35, w: 9.1, h: 0.72, fill: { color: RED }, line: { color: RED }, rectRadius: 0.08 });
  s.addText("Design rule: no bank-specific logic in the core. Rails are adapters, so adding or dropping an institution is a configuration change, never a rebuild.", { x: 0.7, y: 4.35, w: 8.6, h: 0.72, valign: "middle", fontFace: BODY, fontSize: 10.5, color: WHITE, margin: 0 });
}

/* 20 — Scooter economics */
{
  const s = pptx.addSlide();
  s.background = { color: BLUE_DEEP };
  chrome(s, "Slide 20 · Owned Delivery Network", 19, true);
  title(s, "The last mile is owned, not outsourced", true);
  const stats = [["500–2,000", "Platform-owned electric scooters"], ["12 months", "Rent-to-buy, then the rider owns it"], ["~5 months", "Asset pays itself back"], ["~10%", "Platform fee per dollar earned after ownership"]];
  stats.forEach(([v, l], i) => {
    const x = 0.45 + i * 2.31;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.8, w: 2.11, h: 1.05, fill: { color: "1E426F" }, line: { color: "1E426F" }, rectRadius: 0.08 });
    s.addText(v, { x: x + 0.2, y: 1.9, w: 1.75, h: 0.45, fontFace: HEAD, fontSize: 20, bold: true, color: GOLD, margin: 0 });
    s.addText(l, { x: x + 0.2, y: 2.35, w: 1.75, h: 0.42, fontFace: BODY, fontSize: 9, color: "C6D3E4", margin: 0, valign: "top" });
  });
  const blocks = [
    ["Rent-to-buy", "The rider operates for twelve months and then owns the scooter. The asset repays itself in roughly five months; months six to twelve are margin."],
    ["Advertising rights", "Livery is sold on subscription: 80% reserved for the anchor retailer, 20% open inventory. A moving media network across every delivery route."],
    ["Own the garage", "Repairs, parts and accessories stay inside the platform on a maintenance plan. Electric tricycles extend the fleet into rural routes, with women riders as the first cohort."],
  ];
  blocks.forEach(([h, b], i) => {
    panel(s, { x: 0.45 + i * 3.1, y: 3.0, w: 2.9, h: 2.15, heading: h, body: b });
  });
}

/* 21 — Loyalty */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Slide 21 · Loyalty & Device Migration", 20, false);
  title(s, "Trade US$100 a month for five months — earn the handset", false);
  ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5"].forEach((m, i) => {
    const x = 0.45 + i * 1.85;
    const last = i === 4;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.85, w: 1.7, h: 1.0, fill: { color: last ? RED : WHITE }, line: { color: last ? RED : "E2E5EB" }, rectRadius: 0.08 });
    s.addText(m, { x, y: 2.02, w: 1.7, h: 0.32, align: "center", fontFace: HEAD, fontSize: 13, bold: true, color: last ? WHITE : INK, margin: 0 });
    s.addText(last ? "5G-lite smartphone awarded" : "US$100 traded", { x: x + 0.15, y: 2.36, w: 1.4, h: 0.42, align: "center", fontFace: BODY, fontSize: 9, color: last ? "FDE7EC" : MUTED, margin: 0 });
  });
  const cards = [
    ["Discovery-Vitality mechanics", "Consecutive qualifying months unlock the reward. Behaviour is earned, not bought, and the tier resets if trading lapses.", BLUE],
    ["Family basket sharing", "Several household members contribute to one qualifying basket, so families reach the threshold faster and consolidate spend on the platform.", RED],
    ["The real purpose", "A ~US$50 landed handset with the markup absorbed migrates 2G and 3G users onto the platform. Device cost is customer acquisition, booked as such.", BLUE],
  ];
  cards.forEach(([h, b, a], i) => {
    card(s, { x: 0.45 + i * 3.1, y: 3.05, w: 2.9, h: 2.0, heading: h, body: b, accent: a });
  });
}

/* 22 — Wholesale and tuck shops */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Slide 23 · Wholesale & Informal Channel", 21, false);
  title(s, "Tuck shops become distribution extensions, not competitors", false);
  const steps = [
    ["Aggregate", "Local orders in a suburb are pooled in the app rather than fragmented across trips."],
    ["Fulfil locally", "The nearest tuck shop picks and hands over, cutting distance, fuel and delivery cost."],
    ["Repackage", "Bulk stock is broken into the 200g-type pack sizes the market actually buys."],
    ["Supply", "The retailer sells bulk into the channel as a wholesaler and keeps the volume."],
  ];
  steps.forEach(([h, b], i) => {
    const x = 0.45 + i * 2.31;
    const dark = i % 2 === 0;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.85, w: 2.11, h: 1.25, fill: { color: dark ? BLUE : WHITE }, line: { color: dark ? BLUE : "E2E5EB" }, rectRadius: 0.08 });
    s.addText(`STEP ${i + 1}`, { x: x + 0.2, y: 1.97, w: 1.75, h: 0.2, fontFace: BODY, fontSize: 8, bold: true, charSpacing: 1.5, color: dark ? "AEBED2" : MUTED, margin: 0 });
    s.addText(h, { x: x + 0.2, y: 2.17, w: 1.75, h: 0.28, fontFace: HEAD, fontSize: 12, bold: true, color: dark ? WHITE : BLUE, margin: 0 });
    s.addText(b, { x: x + 0.2, y: 2.45, w: 1.75, h: 0.6, fontFace: BODY, fontSize: 8.5, color: dark ? "C6D3E4" : MUTED, margin: 0, valign: "top" });
  });
  card(s, { x: 0.45, y: 3.25, w: 4.45, h: 1.85, heading: "Pack size is the unlock", body: "Households buy 200g, not 2kg. The retailer sells bulk to the tuck shop, the tuck shop repackages to the price point the street can afford — the small-multipack playbook proven by packaged brands expanding regionally." });
  card(s, { x: 5.1, y: 3.25, w: 4.45, h: 1.85, accent: BLUE, heading: "The government argument", body: "Routing informal trade through the platform makes it visible: tax is captured, stock is traceable and counterfeit product is squeezed out. Legitimisation, not enforcement." });
}

/* 23 — Subscription is the model */
{
  const s = pptx.addSlide();
  s.background = { color: RED_DEEP };
  chrome(s, "The Subscription Model", 22, true);
  title(s, "Anything that allows a subscription is the model. The rest is not sustainable.", true);
  const subs = [
    ["Rider fees", "Scooter rent-to-buy instalments, then a standing platform fee per dollar earned."],
    ["Advertising", "Scooter livery, in-app placement and supplier media sold as monthly inventory."],
    ["Garage services", "Servicing, parts and accessories on a maintenance plan, not a per-repair invoice."],
    ["Tenant fees", "Each retailer, wholesaler and tuck shop pays a tiered monthly platform fee."],
    ["Shopper plans", "Priority delivery and family basket sharing on a recurring plan."],
    ["Data products", "Demand and price intelligence licensed by subscription to suppliers."],
  ];
  subs.forEach(([h, b], i) => {
    panel(s, { x: 0.45 + (i % 3) * 3.1, y: 1.85 + Math.floor(i / 3) * 1.3, w: 2.9, h: 1.18, heading: h, body: b, fill: "C21740", text: "FDE7EC" });
  });
  s.addText("Every line above is bent toward recurring revenue: one-off fees fund a project, recurring fees fund a company.", { x: 0.45, y: 4.55, w: 9.1, h: 0.6, fontFace: BODY, fontSize: 11.5, color: "FDE7EC", margin: 0 });
}

/* ================================================================== */
/* ACT 5 — THE CONSOLIDATED ECOSYSTEM ECONOMICS                       */
/* ================================================================== */

/* 24 — Consolidated ecosystem revenue model */
{
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  chrome(s, "Consolidated Ecosystem Revenue", 23, false);
  title(s, "The full ecosystem: US$21,841,380 a year", false);
  s.addShape(pptx.ShapeType.roundRect, { x: 4.8, y: 0.98, w: 4.75, h: 0.36, fill: { color: "E7EAF0" }, line: { color: "E7EAF0" }, rectRadius: 0.18 });
  s.addText("US$61.2M Baseline GMV ($17.15M Phase 1) + US$4.69M Services", { x: 4.8, y: 0.98, w: 4.75, h: 0.36, align: "center", valign: "middle", fontFace: BODY, fontSize: 8.5, bold: true, color: BLUE, margin: 0 });

  // Left card: Phase 1
  s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 1.75, w: 4.6, h: 3.1, fill: { color: WHITE }, line: { color: "E2E5EB" }, rectRadius: 0.08 });
  s.addText("PHASE 1 · MODELLED TODAY", { x: 0.65, y: 1.88, w: 4.2, h: 0.24, fontFace: BODY, fontSize: 9.5, bold: true, charSpacing: 1.5, color: RED, margin: 0 });
  const p1Rows = [
    ["Retail product margins", "21% margin on migrated basket · Transactional", "US$12,852,000"],
    ["Last-mile delivery share", "US$1.50 net per drop · Transactional", "US$1,080,000"],
    ["Cross-border surcharge", "3% on international cards · Transactional", "US$1,836,000"],
    ["Diaspora Priority plans", "6,000 subscribers @ US$8.99 · Recurring", "US$647,280"],
    ["Retail media network", "1.2% of platform GMV · Semi-recurring", "US$734,400"],
  ];
  p1Rows.forEach(([l, b, v], i) => {
    const y = 2.16 + i * 0.44;
    s.addText(l, { x: 0.65, y, w: 2.8, h: 0.2, fontFace: BODY, fontSize: 10, bold: true, color: INK, margin: 0 });
    s.addText(b, { x: 0.65, y: y + 0.18, w: 2.8, h: 0.18, fontFace: BODY, fontSize: 8, color: MUTED, margin: 0 });
    s.addText(v, { x: 3.45, y: y + 0.02, w: 1.45, h: 0.24, align: "right", fontFace: HEAD, fontSize: 10.5, bold: true, color: BLUE, margin: 0 });
  });
  s.addShape(pptx.ShapeType.rect, { x: 0.65, y: 4.4, w: 4.2, h: 0.01, fill: { color: "E2E5EB" }, line: { color: "E2E5EB" } });
  s.addText("Total ecosystem", { x: 0.65, y: 4.48, w: 2.4, h: 0.26, fontFace: BODY, fontSize: 10.5, bold: true, color: INK, margin: 0 });
  s.addText("US$17,149,680", { x: 3.0, y: 4.46, w: 1.9, h: 0.28, align: "right", fontFace: HEAD, fontSize: 12.5, bold: true, color: RED, margin: 0 });

  // Right card: Phase 2 Subscription Layer
  s.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 1.75, w: 4.35, h: 3.1, fill: { color: BLUE }, line: { color: BLUE }, rectRadius: 0.08 });
  s.addText("PHASE 2 · SUBSCRIPTION LAYER", { x: 5.4, y: 1.88, w: 3.95, h: 0.24, fontFace: BODY, fontSize: 9.5, bold: true, charSpacing: 1.5, color: GOLD, margin: 0 });
  const p2Rows = [
    ["Tenant platform fees", "240 tenants @ US$249 pm", "US$717,120"],
    ["Rider plans", "900 riders @ US$45 pm", "US$486,000"],
    ["Garage & maintenance plans", "900 units @ US$18 pm", "US$194,400"],
    ["Data & price intelligence", "40 licences @ US$1,500 pm", "US$720,000"],
    ["Shopper plans", "45,000 households @ US$3.99 pm", "US$2,154,600"],
    ["Tuck-shop trading app", "3,500 shops @ US$9.99 pm", "US$419,580"],
  ];
  p2Rows.forEach(([l, b, v], i) => {
    const y = 2.14 + i * 0.37;
    s.addText(l, { x: 5.4, y, w: 2.5, h: 0.18, fontFace: BODY, fontSize: 9.5, bold: true, color: WHITE, margin: 0 });
    s.addText(b, { x: 5.4, y: y + 0.16, w: 2.5, h: 0.16, fontFace: BODY, fontSize: 7.5, color: "C6D3E4", margin: 0 });
    s.addText(v, { x: 7.9, y: y + 0.02, w: 1.45, h: 0.22, align: "right", fontFace: HEAD, fontSize: 10, bold: true, color: GOLD, margin: 0 });
  });
  s.addShape(pptx.ShapeType.rect, { x: 5.4, y: 4.4, w: 3.95, h: 0.01, fill: { color: "335C94" }, line: { color: "335C94" } });
  s.addText("Subscription subtotal", { x: 5.4, y: 4.48, w: 2.4, h: 0.26, fontFace: BODY, fontSize: 10.5, bold: true, color: WHITE, margin: 0 });
  s.addText("US$4,691,700", { x: 7.7, y: 4.46, w: 1.65, h: 0.28, align: "right", fontFace: HEAD, fontSize: 12.5, bold: true, color: GOLD, margin: 0 });

  // Bottom Banner
  s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 4.95, w: 9.1, h: 0.45, fill: { color: RED }, line: { color: RED }, rectRadius: 0.08 });
  s.addText("Combined annual ecosystem revenue at steady state", { x: 0.75, y: 4.95, w: 6.0, h: 0.45, valign: "middle", fontFace: BODY, fontSize: 11, bold: true, color: WHITE, margin: 0 });
  s.addText("US$21,841,380", { x: 6.75, y: 4.95, w: 2.5, h: 0.45, align: "right", valign: "middle", fontFace: HEAD, fontSize: 14, bold: true, color: WHITE, margin: 0 });
}

/* 25 — Future revenue mix */
{
  const s = pptx.addSlide();
  s.background = { color: BLUE_DEEP };
  chrome(s, "Future Revenue Mix", 24, true);
  title(s, "From transaction-led to subscription-led", true);
  const phases = [
    ["LAUNCH · US$17.1M", "Diaspora-to-door on TM stock", "Retail margin, delivery share and the cross-border surcharge carry the model. One recurring line: Diaspora Priority at US$647,280 — 4% of revenue."],
    ["SCALE · +US$1.4M", "Second and third retailers onboard", "Tenant fees (US$717,120), rider plans (US$486,000) and garage cover (US$194,400) start billing monthly, whatever the basket does."],
    ["AGNOSTIC · US$21.8M", "Marketplace of retailers and tuck shops", "Shopper plans, tuck-shop apps and data licences add US$3.29M. Recurring revenue reaches US$5,338,980 — 24% of the ecosystem."],
  ];
  phases.forEach(([k, h, b], i) => {
    const x = 0.45 + i * 3.1;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.85, w: 2.9, h: 2.35, fill: { color: "1E426F" }, line: { color: "1E426F" }, rectRadius: 0.08 });
    s.addText(k, { x: x + 0.25, y: 2.0, w: 2.4, h: 0.25, fontFace: BODY, fontSize: 9.5, bold: true, charSpacing: 1.5, color: GOLD, margin: 0 });
    s.addText(h, { x: x + 0.25, y: 2.28, w: 2.4, h: 0.55, fontFace: HEAD, fontSize: 13, bold: true, color: WHITE, margin: 0, valign: "top" });
    s.addText(b, { x: x + 0.25, y: 2.9, w: 2.4, h: 1.2, fontFace: BODY, fontSize: 9.5, color: "C6D3E4", margin: 0, valign: "top" });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 4.35, w: 9.1, h: 0.65, fill: { color: RED }, line: { color: RED }, rectRadius: 0.08 });
  s.addText("Same ecosystem, valued differently: transaction fees fund a project, recurring fees fund a company.", { x: 0.75, y: 4.45, w: 8.5, h: 0.45, fontFace: HEAD, fontSize: 13, bold: true, color: WHITE, margin: 0 });
}

/* 26 — Commercial and entity structure */
{
  const s = pptx.addSlide();
  s.background = { color: BLUE_DEEP };
  chrome(s, "Slide 24 · Commercial & Entity Structure", 25, true);
  title(s, "Hybrid commercial model, two-country structure", true);
  const model = [
    ["White-label", "The storefront and app ship under the retailer's brand, licensed rather than sold."],
    ["Subscription", "Tiered monthly platform fees per tenant, opening at a 100,000-participant tier."],
    ["Commission", "A thin transaction share on GMV, sitting on top of the recurring base."],
  ];
  model.forEach(([h, b], i) => {
    panel(s, { x: 0.45 + i * 3.1, y: 1.85, w: 2.9, h: 1.25, heading: h, body: b });
  });
  panel(s, { x: 0.45, y: 3.25, w: 4.45, h: 1.3, heading: "South African company", body: "Holds the platform IP and raises capital where liquidity and investor access are deepest. Contracts with tenants and banks sit here." });
  panel(s, { x: 5.1, y: 3.25, w: 4.45, h: 1.3, heading: "Zimbabwean subsidiary", body: "Runs logistics, the scooter fleet and local agreements on the ground, with local employment and local regulatory standing." });
  s.addText("Directional as at 13 August — structure to be confirmed with tax and legal counsel before any binding term sheet.", { x: 0.45, y: 4.68, w: 9.1, h: 0.32, fontFace: BODY, fontSize: 9.5, color: "8C9BB0", margin: 0 });
}

/* 27 — Close */
{
  const s = pptx.addSlide();
  s.background = { color: BLUE_DEEP };
  s.addShape(pptx.ShapeType.roundRect, { x: 4.2, y: 0.55, w: 1.6, h: 1.35, fill: { color: WHITE }, line: { color: WHITE }, rectRadius: 0.1 });
  s.addImage({ data: LOGO_SQUARE, x: 4.3, y: 0.65, w: 1.4, h: 1.15 });
  s.addText("Turn 57+ branches into a diaspora fulfilment network", { x: 1.0, y: 2.1, w: 8, h: 1.0, align: "center", valign: "top", fontFace: HEAD, fontSize: 30, bold: true, color: WHITE });
  s.addShape(pptx.ShapeType.roundRect, { x: 4.4, y: 3.25, w: 1.2, h: 0.08, fill: { color: RED }, line: { color: RED }, rectRadius: 0.04 });
  s.addText("Recommended next step: select a commercial structure and mandate a 60-day pilot on two flagship Harare branches.", { x: 1.6, y: 3.6, w: 6.8, h: 0.9, align: "center", fontFace: BODY, fontSize: 15, color: "C6D3E4" });
  s.addText("TM Pick n Pay Express", { x: 0.45, y: H - 0.5, w: 4, h: 0.3, fontFace: BODY, fontSize: 9, color: "8C9BB0" });
  s.addText("Thank you", { x: W - 4.45, y: H - 0.5, w: 4, h: 0.3, align: "right", fontFace: BODY, fontSize: 9, color: "8C9BB0" });
}

fs.mkdirSync("/tmp/deck", { recursive: true });
fs.mkdirSync("public", { recursive: true });

await pptx.writeFile({ fileName: "/tmp/deck/TM-Pick-n-Pay-Express.raw.pptx" });
console.log("raw pptx generated");
