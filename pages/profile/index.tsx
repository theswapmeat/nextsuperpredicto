import Head from "next/head";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import type { GetServerSideProps } from "next";
import toast from "react-hot-toast";

type Tournament = {
  _id: string;
  name: string;
  year: number;
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });
  const [originalData, setOriginalData] = useState(userData);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      axios
        .get(`/api/profile?email=${session.user.email}`)
        .then((res) => {
          setUserData(res.data);
          setOriginalData(res.data);
        })
        .catch((err) => console.error("Failed to load user data:", err));

      axios
        .get(`/api/tournaments?email=${session.user.email}`)
        .then((res) => setTournaments(res.data))
        .catch((err) => console.error("Failed to load tournaments:", err));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...userData, [name]: value };
    setUserData(updated);
    setIsChanged(
      updated.firstName !== originalData.firstName ||
        updated.lastName !== originalData.lastName ||
        updated.username !== originalData.username
    );
  };

  const handleSave = () => {
    setSaving(true);

    const saveData = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
    };

    const savePromise = axios.post("/api/profile", saveData);

    toast
      .promise(
        savePromise,
        {
          loading: "Saving changes...",
          success: "Profile updated successfully!",
          error: (err) =>
            err?.response?.data?.error || "Unexpected error occurred.",
        },
        { position: "top-center" }
      )
      .then(() => {
        setOriginalData(userData);
        setIsChanged(false);
      })
      .catch((err) => {
        console.error("Save failed:", err);
        // No toast here — already handled via toast.promise `error`
      })
      .finally(() => {
        setSaving(false);
      });
  };

  // Group tournaments by year, sorted descending
  const groupedTournaments = tournaments.reduce((acc, tournament) => {
    const { year, name, _id } = tournament;
    if (!acc[year]) acc[year] = [];
    acc[year].push({ _id, name });
    return acc;
  }, {} as Record<number, { _id: string; name: string }[]>);

  const sortedYears = Object.keys(groupedTournaments)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <>
      <Head>
        <title>SuperPredicto - Profile</title>
      </Head>

      {saving && (
        <div className="saving-overlay-full d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      <div className="container mt-4">
        <h2 className="mb-4">You_</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <div className="col d-flex justify-content-center">
            <div className="card border-0 shadow-sm" style={{ width: "500px" }}>
              <div className="card-body">
                <h5 className="card-title">Personal Stuff</h5>
                <hr className="text-muted my-2" />
                <form>
                  <div className="row gap-2">
                    <div className="col">
                      <label className="form-label-tight small">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col">
                      <label className="form-label-tight small">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="form-label-tight small">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mt-2">
                    <label className="form-label-tight small">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      value={userData.email}
                      disabled
                    />
                  </div>

                  <div className="d-flex justify-content-end mt-3">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled={!isChanged}
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Tournament History Card */}
          <div className="col d-flex justify-content-center">
            <div className="card border-0 shadow-sm" style={{ width: "500px" }}>
              <div className="card-body">
                <h5 className="card-title">Tournament History</h5>
                <hr className="text-muted my-2" />
                {sortedYears.length > 0 ? (
                  <div className="small text-muted">
                    {sortedYears.map((year) => (
                      <div key={year} className="mb-3">
                        <strong>{year}</strong>
                        <ul className="list-unstyled mb-0 ms-2 mt-1">
                          {groupedTournaments[year].map((t) => (
                            <li key={t._id}>{t.name}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="small text-muted">No tournaments found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment History Placeholder */}
          <div className="col d-flex justify-content-center">
            <div
              className="card border-0 shadow-sm"
              style={{ width: "500px", height: "300px" }}
            >
              <div className="card-body">
                <h5 className="card-title">Payment History</h5>
                <hr className="text-muted my-2" />
                <p className="card-text small text-muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  nec justo a nisl.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  return { props: {} };
};
