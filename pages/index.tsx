import type { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { Service } from "../utils/types";
import ServicesList from "../components/ServicesList";
import fetchWeather from "../utils/weather";
import { getConf } from "../utils/conf";
import axios from "axios";
import { parse } from "node-html-parser";

export const getStaticProps: GetStaticProps = async (context) => {
  // Get services from conf.
  const conf = getConf();
  const services: Service[] = conf.services;

  for (const sk in services) {
    const serv = services[sk];

    // Fetch favicon for site if set to
    if (serv.use_favi && serv.url) {
      axios
        .get(serv.url)
        .then((res) => {
          const dom = parse(res.data);
          const links = dom.getElementsByTagName("link");
          console.log(links);
          const favis = [];
          for (var i = 0, n = links.length; i < n; i++) {
            try {
              let link = links[i];

              if (
                link.getAttribute("rel") == "icon" ||
                link.getAttribute("rel") == "shortcut icon" ||
                link.getAttribute("rel") == "apple-touch-icon"
              ) {
                let href = link.getAttribute("href");
                if (!href) continue;
                favis.push({
                  href: new URL(href, serv.url),
                  sizes: Number(link.getAttribute("sizes")?.split("x")[0]) || 0
                });
              }
            } catch (err) {
              console.error(`Caught error collecting favicons for ${serv.url}`, err);
            }
          }
          let bestFavi = favis.reduce((max, obj) => {
            if (!obj.sizes) {
              return max;
            }

            return obj.sizes > max.sizes ? obj : max;
          });
          console.log("bestFavi", bestFavi);
          if (bestFavi) serv.icon = bestFavi.href.href;
        })
        .catch((err) => {
          console.error(`Failed attempting to fetch favicon from ${serv.name}:`, err);
        });
    }
  }

  // Get hello msg
  const hour = new Date().getHours();
  let helloMsg = "What time is it?";
  if (hour >= 0 && hour <= 5) helloMsg = "You're up late!";
  else if (hour >= 5 && hour <= 12) helloMsg = "Good Morning!";
  else if (hour >= 12 && hour <= 17) helloMsg = "Good Afternoon!";
  else if (hour >= 17 && hour <= 21) helloMsg = "Good Evening!";
  else if (hour >= 21 && hour <= 24) helloMsg = "Good Night!";

  // Get weather
  let weather;
  if (conf.weather) {
    weather = await fetchWeather(conf.weather);
  }

  return {
    props: {
      services,
      helloMsg,
      weather
    },
    revalidate: 300
  };
};

const Home: NextPage = ({ services, helloMsg, weather }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [searchBarVal, setSearchBarVal] = useState("");
  const [sortedServices, setSortedServices] = useState<Service[]>(services);

  // Looks cleaner without the C/F, just going to put a title on the text
  // const tempSymbol = weather.celsius ? "°C" : "°F";

  const search = () => {
    // Filter through all services and set sortedServices if any matched
    setSortedServices(services.filter((e: Service) => e.name.toLowerCase().includes(searchBarVal.toLowerCase())));
  };

  return (
    <>
      <Head>
        <title>AppBord</title>
        <meta name="description" content="The easy way to access all your self-hosted web applications." />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className={styles.header}>
        <h1>{helloMsg}</h1>
        <h1
          className={styles.weather}
          title={`In ${weather.location ? weather.location : "unknown location"} using ${
            weather.celsius ? "celsius (°C)" : "fahrenheit (°F)"
          }`}
        >
          {weather.temp && weather.temp + "°"}
        </h1>
      </div>

      <div className={styles.search + " upOnHover"}>
        <input
          id="search"
          placeholder="What are you looking for?"
          value={searchBarVal}
          onChange={(v) => setSearchBarVal(v.target.value)}
          onKeyUp={search}
          autoComplete="off"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/search.svg" alt="" />
      </div>

      {sortedServices.length > 0 ? (
        <ServicesList services={sortedServices} />
      ) : (
        <>
          <h2 className="error">Couldn&apos;t find any services!</h2>
          <ServicesList services={services} />
        </>
      )}
    </>
  );
};

export default Home;
