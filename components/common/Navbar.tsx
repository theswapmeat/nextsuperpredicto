"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleNavbar = () => setNavbarOpen(!navbarOpen);
  const isAdmin = session?.user?.email === "admin@superpredicto.com";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <nav className="navbar navbar-expand-xl navbar-custom">
      <div className="container">
        <Link href="/" className="navbar-brand">
          SuperPredicto
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-label="Toggle navigation"
        >
          <div className={`toggler-icon ${navbarOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <div className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto text-uppercase small">
            <li className="nav-item">
              <Link href="/tournaments" className="nav-link">
                Tournaments
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/leaderboard" className="nav-link">
                Leaderboard
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/submitpicks" className="nav-link">
                Edit / Submit Picks
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/predictions" className="nav-link">
                All Predictions
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/schedule" className="nav-link">
                Schedule
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/scoring" className="nav-link">
                Scoring Guidelines
              </Link>
            </li>
            {mounted && status === "authenticated" ? (
              <>
                {isAdmin && (
                  <li className="nav-item">
                    <Link href="/dashboard" className="nav-link">
                      Dashboard
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    onClick={handleLogout}
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link href="/login" className="nav-link">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
