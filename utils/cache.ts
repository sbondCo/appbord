import NodeCache from "node-cache";

let appCache: NodeCache;

export function getCache() {
  if (!appCache) {
    appCache = new NodeCache({ maxKeys: 1 });
    console.debug("App cache not set, creating...");
    return appCache;
  } else {
    return appCache;
  }
}
