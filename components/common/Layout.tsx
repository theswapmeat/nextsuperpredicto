import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Navbar from "./Navbar";
import Head from "next/head";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const hideNavbar = ["/signup", "/login"].includes(router.pathname);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? "" : "container mt-4"}>{children}</main>
    </>
  );
}