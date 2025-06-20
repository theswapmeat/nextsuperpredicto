import Head from "next/head";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";

export default function SubmitPicksPage() {
  return (
    <>
      <Head>
        <title>SuperPredicto - Submit/Edit Picks</title>
      </Head>
      <div className="container mt-4">
        <h2>Submit / Edit Picks</h2>
        <p>This is a placeholder for the Submit/Edit content.</p>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: `/login?reason=login_required&page=submitpicks`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
