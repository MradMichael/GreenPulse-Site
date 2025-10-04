/* Only this file should know provider specifics */
function buildTileUrl(dateStr){
  return CONFIG.tilesTemplate.replace("{date}", encodeURIComponent(dateStr));
}

/* If you later use Planetary Computer STAC + tiler:
async function fetchStacItem(bbox, datetime){ ... }
function tileUrlFromTileJSON(tilejsonUrl, renderOpts){ ... }
*/
