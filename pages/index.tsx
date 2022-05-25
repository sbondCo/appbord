import type { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import * as fs from "fs";
import YAML from "yaml";
import { useState } from "react";
import { Service } from "../utils/types";
import ServicesList from "../components/ServicesList";
import fetchWeather from "../utils/weather";

export const getStaticProps: GetStaticProps = async (context) => {
  // Get services from conf.
  const confData = fs.readFileSync("config.yml");
  const conf = YAML.parse(confData.toString());
  const services: Service[] = conf.services;

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
    setSortedServices(services.filter((e: Service) => e.name.includes(searchBarVal)));
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
        <img src="search.svg" alt="" />
      </div>

      {sortedServices.length > 0 ? (
        <ServicesList services={sortedServices} />
      ) : (
        <>
          <h2 className="error">Couldn't find any services!</h2>
          <ServicesList services={services} />
        </>
      )}
    </>
  );
};

export default Home;
