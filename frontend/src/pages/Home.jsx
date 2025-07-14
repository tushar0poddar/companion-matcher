import { useNavigate } from 'react-router-dom';
import { HeartHandshake, Music2, BookOpenCheck, Gamepad2, Cpu, Users2 } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/register'); // Adjust route if needed
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500 text-white px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold drop-shadow-md animate-fade-in-up">
          Welcome to Companion Matcher
        </h1>
        <p className="mt-4 text-xl">
          Discover people who share your interests. Whether it’s tech, music, books, or gaming — find someone who vibes with you.
        </p>

        {/* Icons section */}
        <div className="mt-8 grid grid-cols-3 gap-6 justify-items-center text-white">
          <div className="flex flex-col items-center">
            <Music2 className="w-10 h-10" />
            <span className="mt-2">Music</span>
          </div>
          <div className="flex flex-col items-center">
            <BookOpenCheck className="w-10 h-10" />
            <span className="mt-2">Books</span>
          </div>
          <div className="flex flex-col items-center">
            <Gamepad2 className="w-10 h-10" />
            <span className="mt-2">Gaming</span>
          </div>
          <div className="flex flex-col items-center">
            <Cpu className="w-10 h-10" />
            <span className="mt-2">Tech</span>
          </div>
          <div className="flex flex-col items-center">
            <Users2 className="w-10 h-10" />
            <span className="mt-2">Community</span>
          </div>
          <div className="flex flex-col items-center">
            <HeartHandshake className="w-10 h-10" />
            <span className="mt-2">Match</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleClick}
          className="mt-10 px-6 py-3 bg-white text-purple-700 text-lg font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out animate-bounce"
        >
          Let’s find your companion 💫
        </button>
      </div>
    </div>
  );
};

export default Home;
