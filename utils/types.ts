export type Conf = {
  services: Service[];
  weather: Weather;
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
