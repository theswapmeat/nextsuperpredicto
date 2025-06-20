import Head from "next/head";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";

export default function LeaderboardPage() {
  return (
    <>
      <Head>
        <title>SuperPredicto - Leaderboard</title>
      </Head>
      <div className="container mt-4">
        <h2>Leaderboard</h2>
        <p>This is a placeholder for the leaderboard content.</p>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: `/login?reason=login_required&page=leaderboard`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
