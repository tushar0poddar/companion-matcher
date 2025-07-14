import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-600">
          CompanionMatcher
        </Link>

        <ul className="flex gap-6 text-gray-700 font-medium">
          <li>
            <Link to="/" className="hover:text-purple-600 transition duration-200">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-purple-600 transition duration-200">About</Link>
          </li>
          <li>
            <Link to="/register" className="hover:text-purple-600 transition duration-200">Register</Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-purple-600 transition duration-200">Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
