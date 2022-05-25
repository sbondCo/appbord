import "../styles/globals.css";
import "../node_modules/simple-icons-font/font/simple-icons.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="page">
      <div className="content">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
