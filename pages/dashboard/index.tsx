import Head from "next/head";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>SuperPredicto - Dashboard</title>
      </Head>
      <div className="container mt-4">
        <h2>Dashboard</h2>
        <p>This is a placeholder for the dashboard content.</p>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: `/login?reason=login_required&page=dashboard`,
        permanent: false,
      },
    };
  }

  if (session.user?.email !== "admin@superpredicto.com") {
    return {
      redirect: {
        destination: "/403",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
