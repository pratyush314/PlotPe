import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
const Header = () => {
  return (
    <div>
      <header className="bg-slate-200 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
          <Link to={"/"}>
            <h1 className="font-bold text-sm sm:text-2xl flex flex-wrap">
              <span className="text-slate-500">Plot</span>
              <span className="text-slate-700">Pe</span>
            </h1>
          </Link>
          <form className="bg-slate-100 p-3 rounded-lg flex items-center">
            <input
              className="bg-transparent focus:outline-none w-24 sm:w-64"
              type="text"
              placeholder="Search ..."
            />
            <button>
              <FaSearch className="text-slate-600" />
            </button>
          </form>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Sign In</li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
