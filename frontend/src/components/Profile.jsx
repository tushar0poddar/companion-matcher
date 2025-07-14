import { useEffect, useState } from 'react';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const Profile = () => {
  const username = localStorage.getItem('username');
  const authUserId = localStorage.getItem('auth_user_id');
  console.log(username, authUserId);

  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!authUserId || !username) return;

    // Fetch profile
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/${authUserId}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Profile fetch failed:', err);
      }
    };

    // Fetch matches
    const fetchMatches = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/users/matches/${username}`
        );
        const data = await res.json();

        setMatches(data);
      } catch (err) {
        console.error('Matches fetch failed:', err);
      }
    };

    fetchProfile();
    fetchMatches();
  }, [authUserId, username]);

  if (!username) {
    return (
      <p className="text-center mt-10 text-red-500">Please login first.</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-purple-700 mb-4">Your Profile</h2>

      {profile ? (
        <div className="mb-8">
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Age:</strong> {profile.age}
          </p>
          <p>
            <strong>Interests:</strong> {profile.interests.join(', ')}
          </p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      <hr className="my-6" />

      <h3 className="text-2xl font-semibold text-gray-700 mb-4">
        Matched Companions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {matches.length > 0 ? (
          matches.map((match, idx) => (
            <div
              key={idx}
              className="border p-4 rounded shadow-sm hover:shadow-md transition"
            >
              <p>
                <strong>Name:</strong> {match.name}
              </p>
              <p>
                <strong>Interests:</strong> {match.interests.join(', ')}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">
            No companions found with similar interests yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
