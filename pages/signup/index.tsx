import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.message || "Something went wrong");
    } else {
      router.push("/login");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#fefcf3" }}
    >
      <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
        <h2
          className="text-center mb-4"
          style={{ fontFamily: "Nunito", fontWeight: 700 }}
        >
          Create your account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label">First Name</label>
              <input
                name="firstName"
                type="text"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label">Last Name</label>
              <input
                name="lastName"
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              name="username"
              type="text"
              className="form-control"
              required
            />
            <div className="form-text">
              3–15 characters, letters and numbers only
            </div>
          </div>
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
          {error && <p className="text-danger text-center">{error}</p>}
          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}
