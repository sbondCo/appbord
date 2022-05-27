import NodeCache from "node-cache";

let _cache: NodeCache;

export function getCache() {
  if (!_cache) {
    console.debug("App cache not set, creating...");
    _cache = new NodeCache({ maxKeys: 1 });
    return _cache;
  }

  return _cache;
}
