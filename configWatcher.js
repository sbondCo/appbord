const fs = require("fs");
const YAML = require("yaml");

// const isDev = process.env.NODE_ENV === "development";

console.log("Config Watcher Started");

// console.log(process.env.NODE_ENV);

const conf = YAML.parse(fs.readFileSync("config.yml").toString());

// Exit if api key isn't set
// Without it we can't call the revalidate route
if (!conf.api_key) {
  console.error("API Key not set in config! Config file won't be watched.");
  process.exit(1);
}

fs.unwatchFile("config.yml");
fs.watchFile("config.yml", (curr, prev) => {
  if (+curr.mtime - +prev.mtime) {
    console.log("config modified... revalidating home page");

    // const http = isDev ? require("http") : require("https");
    const http = require("http");
    const req = http.get(
      {
        // href: `http://localhost:3000/api/revalidate?api_key=${encodeURIComponent(conf.api_key)}`,
        hostname: "127.0.0.1",
        port: 3000,
        path: `/api/revalidate?api_key=${encodeURIComponent(conf.api_key)}`
      },
      (res) => {
        if (res.statusCode === 200) console.log("..Home page revalidated");
      }
    );

    req.on("error", (err) => {
      console.error("..Error attempting to revalidate home page: ", err);
    });

    req.end();
  }
});
