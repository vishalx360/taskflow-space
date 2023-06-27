import Document, { Head, Html, Main, NextScript } from "next/document";

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || "";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <meta name="theme-color" content="#000000" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta charSet="utf-8" />
          <meta
            name="title"
            content="Taskflow.space | Project Management made easy"
          />
          <meta name="description" content="Project Management made easy" />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="Taskflow.space | Project Management made easy"
          />
          <meta
            property="og:description"
            content="Project Management made easy"
          />
          <meta property="og:image" content={`${HOST_URL}/poster.png`} />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:url" content={HOST_URL} />
          <meta property="og:site_name" content="taskflow.space" />
          <meta property="twitter:card" content="summary_large_image" />
          <meta
            name="keywords"
            content="taskflow.space, project management, vishalx360"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
