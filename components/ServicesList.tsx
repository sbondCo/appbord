import { Service } from "../utils/types";
import styles from "../styles/ServicesList.module.css";

type ServicesListProps = {
  services: Service[];
};

export default function ServicesList({ services }: ServicesListProps) {
  return (
    <div className={styles.services}>
      {services.map((s: Service) => s.name && <Service service={s} key={s.name} />)}
    </div>
  );
}

type ServiceProps = {
  service: Service;
};

function Service({ service }: ServiceProps) {
  const { name, url, icon, new_tab, use_favi = false } = service;

  return (
    <a href={url} target={new_tab ? "_blank" : "_self"} rel="noreferrer" className="upOnHover">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {icon ? !use_favi ? <i className={"si si-" + icon}></i> : <img src={icon} alt="" /> : <></>}
      <p>{name}</p>
    </a>
  );
}
