// pages/403.tsx
import Head from "next/head";
import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <>
      <Head>
        <title>SuperPredicto - Access Denied</title>
      </Head>
      <div className="container text-center mt-5">
        <h1>🚫 Access Denied</h1>
        <p>You are not authorized to view this page.</p>
      </div>
    </>
  );
}
