const CONFIG = {
  provider: "TEST",
  tilesTemplate: "https://tile.openstreetmap.org/{z}/{x}/{y}.png?date={date}", // harmless placeholder
  attribution: "© OpenStreetMap",
  defaultYear: 2024,
  defaultDateForYear: y => `${y}-07-15`,
  initialView: { lat: 0, lon: 0, zoom: 2 }
};
