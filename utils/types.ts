export type Conf = {
  services: Service[];
  weather: Weather;
  api_key: string;
};

export type Service = {
  name: string;
  url: string;
  icon?: string;
};

export type Weather = {
  city: string;
  celsius: boolean;
};
