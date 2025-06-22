import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import TournamentModel from "@/models/Tournament";
import type { Tournament } from "@/types/tournament";

interface TournamentsPageProps {
  tournaments: Tournament[];
}

export default function TournamentsPage({ tournaments }: TournamentsPageProps) {
  return (
    <>
      <Head>
        <title>SuperPredicto - Tournaments</title>
      </Head>
      <div className="container mt-4">
        <h2 className="mb-4">Select a Tournament_</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {tournaments.map((t) => (
            <div key={t._id} className="col">
              <div className="card tournament-card h-100 border-1 bg-light position-relative">
                {/* Completion Icon */}
                <img
                  src={
                    t.is_completed
                      ? "/icons/check-complete.png"
                      : "/icons/check-incomplete.png"
                  }
                  alt={t.is_completed ? "Completed" : "Incomplete"}
                  className="position-absolute top-0 end-0 m-2"
                  style={{ width: "20px", height: "20px" }}
                />

                <div className="card-body d-flex flex-column justify-content-between h-100">
                  <div>
                    <h5 className="card-title">
                      {t.year} {t.name}
                    </h5>
                    <p className="card-text text-muted">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Facilis similique dolorem animi asperiores ut, doloremque
                      porro quae consectetur maiores officia ratione repellendus
                      molestias dignissimos earum fugit pariatur corrupti
                      explicabo fugiat!
                    </p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <div>
                      <Link
                        href={`/schedule?tournament=${t._id}`}
                        className="me-2 small text-decoration-none text-primary"
                      >
                        Match Schedule
                      </Link>
                      <span className="text-muted">|</span>
                      <Link
                        href={`/leaderboard?tournament=${t._id}`}
                        className="ms-2 small text-decoration-none text-primary"
                      >
                        Leaderboard
                      </Link>
                    </div>

                    <Link
                      href={`/tournament/${t._id}`}
                      className="text-decoration-none text-dark small"
                    >
                      &gt;&gt;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// 👇 Lean type
type LeanTournament = {
  _id: any;
  name: string;
  year: number;
  is_completed: boolean;
};

export const getServerSideProps: GetServerSideProps = async () => {
  await connectToDatabase();

  const rawTournaments = await TournamentModel.find(
    {},
    { name: 1, year: 1, is_completed: 1 }
  )
    .sort({ year: 1, name: 1 })
    .lean();

  const tournaments = (rawTournaments as unknown as LeanTournament[]).map(
    (t) => ({
      _id: t._id.toString(),
      name: t.name,
      year: t.year,
      is_completed: t.is_completed ?? false,
    })
  ) as Tournament[];

  return {
    props: {
      tournaments,
    },
  };
};
