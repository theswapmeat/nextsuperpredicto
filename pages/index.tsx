import Head from "next/head";

const steps = [
  {
    number: 1,
    description:
      "Select a live tournament.  (You can play more than one tournament.)",
  },
  { number: 2, description: "Pay up! You've got to pay to play." },
  {
    number: 3,
    description:
      "Make your predictions. Perfect Picks are 🤌",
  },
  {
    number: 4,
    description: "Follow how you're doing on the live leaderboard.",
  },
  { number: 5, description: "Win!" },
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>SuperPredicto</title>
      </Head>
      <div className="container mt-4">
        <h2 className="mb-4">Welcome_</h2>
        <p className="lead" style={{ fontSize: "1.1rem" }}>
          <strong>SuperPredicto</strong> is a thrilling football prediction game
          where fans compete to guess the outcomes of real matches. Whether
          you're a stats nerd, a gut-feel gambler, or just out to beat your
          friends, SuperPredicto adds a layer of strategy and suspense to every
          game. With a live leaderboard, perfect pick bonuses, and bragging
          rights on the line, every goal means more when you're predicting it.
          It's football, but with a competitive twist that keeps you hooked
          match after match.
        </p>

        <h5 className="text-center mt-5 mb-4">
          It's easy to start playing SuperPredicto
        </h5>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4 justify-content-center">
          {steps.map((step) => (
            <div key={step.number} className="col">
              <div className="card step-card position-relative border-0 h-100 shadow-sm">
                <div className="polygon-badge">{step.number}</div>
                <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
                  <p className="card-text">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
