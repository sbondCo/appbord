import { Weather } from "./types";
import { parse } from "node-html-parser";
import { getCache } from "./cache";

type WeatherResponse = Weather & {
  // If undefined we assume error.
  // Not needed as a number so we can keep it as a string for now.
  temp: string | null;
};

export default async function fetchWeather(wConf: Weather): Promise<WeatherResponse | undefined> {
  let temp = null;

  try {
    const weatherCache = getCache();
    const cachedTemp = weatherCache.get("temps") as { c: string; f: string };

    if (cachedTemp && cachedTemp.c && cachedTemp.f) {
      console.debug("Retrieved temp from cache");
      temp = wConf.celsius ? cachedTemp.c : cachedTemp.f;
    } else {
      const res = await fetch(`https://www.google.com/search?q=${encodeURIComponent(`Weather in ${wConf.city}`)}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61/63 Safari/537.36"
          // Cookies:
        }
      });
      const resBody = await res.text();
      const resBodyDom = parse(resBody);
      const cSpan = resBodyDom.querySelectorAll(`#wob_tm`);
      const fSpan = resBodyDom.querySelectorAll(`#wob_ttm`);

      temp = wConf.celsius ? cSpan[0].rawText : fSpan[0].rawText;
      console.debug("Fetched temp");

      weatherCache.set("temps", { c: cSpan[0].rawText, f: fSpan[0].rawText });
    }
  } catch (ex) {
    console.error("Couldn't fetch weather:", ex);
  }

  return {
    ...wConf,
    temp: temp
  };
}
