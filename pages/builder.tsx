
import React, { useRef } from "react";
import Head from "next/head";
import { Builder, VisualComponents, Designer } from "@/components";
import { FrameProvider } from "../components/context/frameContext";


export default function PageBuilder() {
  const builderRef = useRef<HTMLIFrameElement>(null);

  return (
    <>
      <Head>
        <title>CS Weeb</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <nav>Navigation</nav>

        <FrameProvider value={builderRef}>
          <div id="app">
            <VisualComponents />
            <Builder builderRef={builderRef} />
            <Designer />
          </div>
        </FrameProvider>
      </main>
    </>
  );
}
