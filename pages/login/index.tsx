import { getCsrfToken, getSession, signIn } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

interface LoginProps {
  csrfToken: string;
}

export default function Login({ csrfToken }: LoginProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [redirectMessage, setRedirectMessage] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("/");

  useEffect(() => {
    const reason = router.query.reason;
    const page = router.query.page;

    if (reason === "login_required" && page) {
      setRedirectMessage(`You must be logged in to access this page.`);
      // Decode full page path if encoded (e.g., /leaderboard or /tournaments/123)
      setCallbackUrl(`/${page}`);
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (res?.error) {
      setError(res.error);
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };

  return (
    <>
      <Head>
        <title>SuperPredicto - Login</title>
      </Head>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", background: "#fefcf3" }}
      >
        <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
          <h2
            className="text-center mb-4"
            style={{ fontFamily: "Nunito", fontWeight: 700 }}
          >
            Login (and let's get predicting)
          </h2>

          {redirectMessage && (
            <div className="alert alert-warning text-center">
              {redirectMessage}
            </div>
          )}
          {error && <p className="text-danger text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>

          <p className="mt-3 text-center">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </>
  );
}

// Redirect already-logged-in users away from /login
Login.getInitialProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);

  if (session && ctx.res) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return { csrfToken: "" };
  }

  const csrfToken = await getCsrfToken(ctx);
  return { csrfToken: csrfToken ?? "" };
};
