import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [connectedFriends, setConnectedFriends] = useState([]);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  // Centralized Loading Wrapper for API Calls
  const withLoading = useCallback(async (callback) => {
    setLoading(true);
    try {
      await callback();
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Current User
  useEffect(() => {
    withLoading(async () => {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        withCredentials: true,
      });
      setCurrentUser(res.data);
    }).catch(() => {
      navigate("/login");
    });
  }, [navigate, withLoading]);

  // Fetch Users, Recommendations, Friends after Current User is set
  useEffect(() => {
    if (currentUser && !hasFetched.current) {
      withLoading(async () => {
        const [usersRes, recRes, friendsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users/all", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/users/recommendations", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/users/friends", {
            withCredentials: true,
          }),
        ]);

        setUsers(usersRes.data.filter((user) => user._id !== currentUser?._id));
        setRecommendations(
          recRes.data.filter((user) => user._id !== currentUser?._id)
        );
        setConnectedFriends(friendsRes.data);
      });

      hasFetched.current = true;
    }
  }, [currentUser, withLoading]);

  // Handle User Connection
  const handleConnect = async (id) => {
    withLoading(async () => {
      await axios.post(
        `http://localhost:5000/api/users/connect/${id}`,
        {},
        { withCredentials: true }
      );

      alert("Connected!");

      // Update UI After Connection
      setRecommendations(recommendations.filter((user) => user._id !== id));
      const friendsRes = await axios.get(
        "http://localhost:5000/api/users/friends",
        { withCredentials: true }
      );
      setConnectedFriends(friendsRes.data);
    });
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      alert("Logged out!");
      navigate("/");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  // Render Loading Component
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Find Friends</h1>
          {currentUser && (
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/profile")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <SearchBar setUsers={setUsers} currentUser={currentUser} />

        {/* Conditionally Render Search Results or Recommendations */}
        {users.length > 0 ? (
          <>
            <h2 className="text-3xl font-semibold mt-12 mb-6">
              Search Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  connectedFriends={connectedFriends}
                  handleConnect={handleConnect}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-semibold mt-12 mb-6">
              Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  connectedFriends={connectedFriends}
                  handleConnect={handleConnect}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Reusable User Card Component
function UserCard({ user, connectedFriends, handleConnect }) {
  const isConnected = connectedFriends.some(
    (friend) => friend._id === user._id
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
      <h3 className="text-xl font-semibold">{user.username}</h3>
      <p className="text-gray-500">{user.email}</p>
      <div className="mt-2">
        {user.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full m-1"
          >
            {tag}
          </span>
        ))}
      </div>
      <button
        onClick={() => handleConnect(user._id)}
        className={`mt-4 py-2 px-4 rounded-lg ${
          isConnected ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        } text-white`}
      >
        {isConnected ? "Connected" : "Connect"}
      </button>
    </div>
  );
}

export default Dashboard;
