import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="プリコネチャンネルRe:Diveのファンサイト" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@JADENgygo" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="プリコネラジオファン" />
        <meta property="og:description" content="プリコネチャンネルRe:Diveのファンサイト" />
        <meta property="og:url" content="https://priconne-radio.vercel.app" />
        <meta
          property="og:image"
          content="https://priconne-radio.vercel.app/card.webp"
        />
        <link rel="icon" href="/peko.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
