import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

function Profile() {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/users/friends", {
        withCredentials: true,
      });
      setLoading(false);
      setFriends(res.data);
    };

    fetchFriends();
  }, []);

  const handleDisconnect = async (id) => {
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/users/disconnect/${id}`,
        {},
        { withCredentials: true }
      );
      setLoading(false);
      alert("Disconnected!");
      setFriends(friends.filter((friend) => friend._id !== id));
    } catch (error) {
      setLoading(false);
      console.error("Failed to disconnect", error);
    }
  };

  const handleBack = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <div className="h-screen w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Friends</h1>
          <button
            onClick={handleBack}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>

        {friends.length === 0 ? (
          <p className="text-center text-gray-500">No friends connected.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="bg-white shadow-lg rounded-lg p-6 text-center"
              >
                <h3 className="text-xl font-semibold">{friend.username}</h3>
                <p className="text-gray-500">{friend.email}</p>
                <button
                  onClick={() => handleDisconnect(friend._id)}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Disconnect
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
