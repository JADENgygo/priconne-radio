import type { NextPage } from 'next'
import Image from 'next/future/image'
import Twitter from 'twit';
import { addDoc, getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore/lite";
import { initializeApp } from "firebase/app";
import { useEffect } from 'react';
import Link from "next/link"
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Tweet } from 'react-twitter-widgets';
import { parseCookies, setCookie } from "nookies";

const Home: NextPage<{ids: string[]}> = ({ ids }: { ids: string[] }) => {
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState<"" | "light" | "dark">("");
  const router = useRouter();
  const page = router.query.page ? parseInt(router.query.page as string) : 0;
  const min_ = page - (page % 3);

  useEffect(() => {
    const f = () => setLoaded(false);
    router.events.on("routeChangeStart", f);
    return () => router.events.off("routeChangeStart", f);
  }, []);

  useEffect(() => {
    const cookie = parseCookies();
    if (cookie.theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    }
    setTheme(cookie.theme === "dark" ? "dark" : "light");
  }, []);

  const changeTheme = () => {
    document.documentElement.classList.toggle("dark");
    document.body.classList.toggle("dark");
    const cookie = parseCookies();
    setCookie(null, "theme", cookie.theme === "dark" ? "light" : "dark", {
      maxAge: 60 * 60 * 24 * 30 * 12 * 1,
      path: "/"
    });
    setTheme(cookie.theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="container">
      <div className={`text-end pt-1 mb-3 ${theme === "" ? "invisible" : "visible"}`}>
        <span className="link" onClick={changeTheme}>ダークモード: { theme === "light" ? "オフ" : "オン" }</span>
      </div>
      <div className="text-center fs-1 mb-3">プリコネラジオファン</div>
      <p>プリコネはプレイしているけどプリコネラジオは聴いたことがない方も一度聴いてみませんか？</p>
      <p>お便りを送るとアクリルスタンドが貰えるチャンスもありますよ！</p>
      <div className="alert alert-primary" role="alert">Twitter API有料化のため更新停止中</div>
      <div className="text-center mb-3">プリコネラジオのツイート集</div>
      <nav aria-label="Page navigation" id="pagination">
        <ul className="pagination justify-content-center">
          <li className={"page-item" + ((page <= 2) ? " disabled" : "")}>
            <Link href={{pathname: "/", query: {page: page - 3}}} scroll={false}>
              <a className="page-link" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </Link>
          </li>
          <li className={"page-item" + ((page % 3 === 0) ? " disabled" : "")}>
            <Link href={{pathname: "/", query: {page: min_}}} scroll={false}><a className="page-link">{min_ + 1}</a></Link>
          </li>
          <li className={"page-item" + (((ids.length <= (min_ + 1) * 3) || (page % 3 === 1)) ? " disabled" : "")}>
            <Link href={{pathname: "/", query: {page: min_ + 1}}} scroll={false}><a className="page-link">{min_ + 2}</a></Link>
          </li>
          <li className={"page-item" + (((ids.length <= (min_ + 1 + 1) * 3) || (page % 3 === 2)) ? " disabled" : "")}>
            <Link href={{pathname: "/", query: {page: min_ + 2}}} scroll={false}><a className="page-link">{min_ + 3}</a></Link>
          </li>
          <li className={"page-item" + ((ids.length <= (min_ + 2 + 1) * 3) ? " disabled" : "")}>
            <Link href={{pathname: "/", query: {page: min_ + 3}}} scroll={false}>
              <a className="page-link" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      {
        !loaded && (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )
      }
      <div className="row mb-3">
      {
        ids.slice(page * 3, page * 3 + 3).map(e => {
          return (
            <div key={e} className="col-12 col-sm-12 col-md-6 col-lg-4 keep">
              <Tweet tweetId={e} options={{"align": "center"}} onLoad={() => setLoaded(true)} />
            </div>
          );
        })
      }
      </div>
      <div className="text-center mb-3">
        <div>貰えるアクリルスタンド</div>
        <div>(横: 約13 cm, 奥行: 約9 cm, 高さ: 約14 cm)</div>
      </div>
      <div className="text-center">
        <Image className="img-fluid mb-3" src="/stand.webp" width={1536 / 4} height={2048 / 4} alt="アクリルスタンド"/>
      </div>
      <div className="mb-3">リンク集</div>
      <ul className="list-group list-group-flush mb-3">
        <li className="list-group-item">
          <a className="link" href="https://hibiki-radio.jp/description/priconne_re/detail">響 - HiBiKi Radio Station - | プリコネチャンネルRe:Dive</a>
        </li>
        <li className="list-group-item">
          <a className="link" href="https://www.youtube.com/playlist?list=PLPq8soy4FhfaXYsSg8TnpOnwKoOtEmj7d">プリコネチャンネルRe:Dive - YouTube</a>
        </li>
        <li className='list-group-item'>
          <a className="link" href='https://twitter.com/search?q=from%3Apriconne_redive%20url%3Ahibiki-radio.jp&f=live'>プリコネ公式ツイッターのラジオツイート検索結果</a>
        </li>
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  /*
  const twitter = new Twitter({
    consumer_key: process.env.CONSUMER_KEY as string,
    consumer_secret: process.env.CONSUMER_SECRET as string,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  });

  const params = {
    q: 'from:priconne_redive url:hibiki-radio.jp',
    result_type: "recent",
    exclude: "retweets",
    count: 100,
  };
  const data = await twitter.get('search/tweets', params as Twitter.Params);
  const newIds = ((data.data as any).statuses as any[]).map(e => e.id_str).reverse();
  */

  const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
  };
  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);
  /*
  for (let e of newIds) {
    const d = doc(db, "urls", e);
    await setDoc(d, {url: e});
  }
  */

  const col = collection(db, 'urls');
  const snapshot = await getDocs(col);
  const docs = snapshot.docs.map(doc => doc.data());
  const ids = docs.map(e => e.url);
  ids.sort((a: string, b: string) => {
    if (a.length !== b.length) {
      return a.length - b.length;
    }
    for (let i = 0; i < a.length; ++i) {
      const a_ = parseInt(a[i]);
      const b_ = parseInt(b[i]);
      if (a_ !== b_) {
        return a_ - b_;
      }
    }
    return 0;
  }).reverse();

  return {
    props: {
      ids,
    },
    revalidate: 60 * 60,
  };
}

export default Home
