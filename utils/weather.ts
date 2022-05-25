import { Weather } from "./types";
import { parse } from "node-html-parser";
import { getCache } from "./cache";

type WeatherResponse = Weather & {
  // If undefined we assume error.
  // Not needed as a number so we can keep it as a string for now.
  temp: string | null;

  location: string | null;
};

export default async function fetchWeather(wConf: Weather): Promise<WeatherResponse | undefined> {
  let temps: { c: string | null; f: string | null } = { c: null, f: null };
  let loc = null;

  try {
    const cache = getCache();
    const cachedTemp = cache.get("temps") as { c: string; f: string; loc: string };

    if (cachedTemp && cachedTemp.c && cachedTemp.f) {
      console.debug("Retrieved temp from cache");
      temps = { c: cachedTemp.c, f: cachedTemp.f };
      loc = cachedTemp.loc;
    } else {
      console.debug("Fetching temp");

      // Search google for results with weather in `city` set in conf.
      const res = await fetch(`https://www.google.com/search?q=${encodeURIComponent(`Weather in ${wConf.city}`)}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61/63 Safari/537.36"
        }
      });

      // Parse response body and query for spans/divs containing data we want to retreive.
      const resDom = parse(await res.text());
      const cSpan = resDom.querySelector("#wob_tm");
      const fSpan = resDom.querySelector("#wob_ttm");
      const lSpan = resDom.querySelector("#wob_loc");

      // If we found the spans/divs, set the appropriate vars with the text in them.
      if (cSpan && fSpan) temps = { c: cSpan.rawText, f: fSpan.rawText };
      if (lSpan) loc = lSpan.rawText;

      // Save fetched temp data in cache.
      cache.set("temps", { ...temps, loc: loc });
      console.debug("Set app temp cache:", cache.get("temps"));
    }
  } catch (ex) {
    console.error("Couldn't fetch weather:", ex);
  }

  return {
    ...wConf,
    temp: wConf.celsius ? temps.c : temps.f,
    location: loc
  };
}
