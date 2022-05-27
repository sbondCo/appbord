import * as fs from "fs";
import YAML from "yaml";
import { Conf } from "./types";

let _conf: Conf;

export function getConf(): Conf {
  if (!_conf) {
    console.debug("CONF not set, reading config file...");
    _conf = YAML.parse(fs.readFileSync("config.yml").toString()) as Conf;
  } else console.debug("Fetched saved CONF");

  return _conf;
}
