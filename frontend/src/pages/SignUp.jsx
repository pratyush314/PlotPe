import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";
import { useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        "https://plotpe-mern-project.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      if (!data?.success) {
        setError(data.message);
      } else {
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border border-slate-200 p-3 rounded-lg bg-white"
          type="text"
          value={formData.username}
          name="username"
          onChange={handleChange}
          placeholder="username"
        />
        <input
          className="border border-slate-200 p-3 rounded-lg bg-white"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email"
        />
        <input
          className="border border-slate-200 p-3 rounded-lg bg-white"
          type="password"
          value={formData.password}
          name="password"
          onChange={handleChange}
          placeholder="password"
        />
        <button
          disabled={loading}
          className="uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <Oauth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account ? </p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;
