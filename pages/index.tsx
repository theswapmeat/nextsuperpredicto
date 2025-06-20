import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>SuperPredicto</title>
      </Head>
      <div className="container mt-5">
        <h2 className="mb-4">Welcome_</h2>
        <p className="lead" style={{ fontSize: "1.1rem" }}>
          <strong>SuperPredicto</strong> is a thrilling football prediction game where fans
          compete to guess the outcomes of real matches. Whether you're a stats
          nerd, a gut-feel gambler, or just out to beat your friends, SuperPredicto adds a layer of
          strategy and suspense to every game. With a live leaderboard, perfect pick bonuses, and
          bragging rights on the line, every goal means more when you're predicting it. It's
          football, but with a competitive twist that keeps you hooked match after match.
        </p>
      </div>
    </>
  );
}