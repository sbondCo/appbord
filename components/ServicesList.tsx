import { Service } from "../utils/types";
import styles from "../styles/ServicesList.module.css";

type ServicesListProps = {
  services: Service[];
};

export default function ServicesList({ services }: ServicesListProps) {
  return (
    <div className={styles.services}>
      {services.map(
        (s: Service) =>
          s.name && (
            <a href={s.url} className="upOnHover" key={s.name}>
              <i className={"si si-" + s.icon}></i>
              <p>{s.name}</p>
            </a>
          )
      )}
    </div>
  );
}
