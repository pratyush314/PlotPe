import { Link } from "react-router-dom";
import Oauth from "../components/Oauth";

const SignIn = () => {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4">
        <input
          className="border border-slate-200 p-3 rounded-lg bg-white"
          type="email"
          placeholder="email"
        />
        <input
          className="border border-slate-200 p-3 rounded-lg bg-white"
          type="password"
          placeholder="password"
        />
        <button className="uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80">
          Sign In
        </button>
        <Oauth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account? </p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
