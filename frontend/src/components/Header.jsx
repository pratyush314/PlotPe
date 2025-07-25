import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
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
          <ul className="flex gap-4">
            <Link to={"/"}>
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Home
              </li>
            </Link>
            <Link to={"/about"}>
              <li className="hidden sm:inline text-slate-700 hover:underline">
                About
              </li>
            </Link>
            {currentUser ? (
              <Link to="/profile">
                <li className="text-slate-700 hover:underline" to={"/profile"}>
                  <img
                    src={currentUser.avatar}
                    alt="profile"
                    className="h-7 w-7 rounded-2xl object-cover"
                  />
                </li>
              </Link>
            ) : (
              <Link to="/sign-in">
                <li className="text-slate-700 hover:underline">Sign In</li>
              </Link>
            )}
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
