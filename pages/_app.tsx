import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/globals.scss';
import type { AppProps } from 'next/app'
import Head from "next/head"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="content">
      <Head>
        <title>プリコネラジオファン</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      <footer className="text-center pt-3 pb-3">
        <a href="https://twitter.com/@JADENgygo" className="me-3">
          <i className="bi bi-twitter"></i>
        </a>
        <a href="https://priconne-portfolio.vercel.app" className="link">
          闇プリン開発室
        </a>
        <div>一部画像 &copy; Cygames, Inc.</div>
      </footer>
    </div>
  )
}

export default MyApp
