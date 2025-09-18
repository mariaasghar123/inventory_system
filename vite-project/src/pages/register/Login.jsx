import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ✅ Base URL for API
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // ✅ Save token
        localStorage.setItem("token", data.token);

        // ✅ Save user info (if backend is sending user object)
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // ✅ Redirect after login
        navigate("/"); // home/dashboard page
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side Image */}
      <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center">
        <img
          src="/media/i2.png"
          alt="Login visual"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl px-8 py-10 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
            Login
          </h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              name="username"
              onChange={handleChange}
              placeholder="Enter your username"
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Enter your password"
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 rounded bg-blue-600 text-white font-semibold shadow transition duration-300 hover:bg-blue-700 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-gray-500 mt-4">
            Don’t have an account?
            <Link to="/signup" className="text-blue-600 hover:underline ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
