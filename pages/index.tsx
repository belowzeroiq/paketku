import Head from "next/head";
import SmartResiBox from "../components/SmartResiBox";

export default function Home() {
  return (
    <>
      <Head>
        <title>Smart Resi Box Simulator</title>
        <meta
          name="description"
          content="Smart Residential Delivery Box Simulator"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SmartResiBox />
    </>
  );
}
