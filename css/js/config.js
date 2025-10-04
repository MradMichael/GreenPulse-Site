/* Global config for imagery provider and app defaults */
const CONFIG = {
  provider: "GLOBAL_OFFER", // or "PLANETARY_COMPUTER"
  // If using a public XYZ tile service from a Global Offer:
  tilesTemplate: "https://YOUR_TILE_HOST/ndvi/{z}/{x}/{y}.png?key=YOUR_KEY&date={date}",
  // If you will hide the key behind a proxy, switch to: "/tiles/{z}/{x}/{y}.png?date={date}"
  attribution: "Data via Space Apps Global Offers",
  defaultYear: 2024,
  defaultDateForYear: y => `${y}-07-15`,
  initialView: { lat: 0, lon: 0, zoom: 2 }
};
