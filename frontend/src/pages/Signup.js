import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TagSelector from "../components/TagSelector";
import Loading from "../components/Loading";

function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    tags: [], // Store tags here
  });
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]); // Store tags separately
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Attach selected tags to form at submission
    const updatedForm = { ...form, tags: selectedTags };
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/signup", updatedForm, {
        withCredentials: true,
      });
      setLoading(false);
      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        alert("User already exists. Please login.");
        navigate("/login");
      } else {
        alert("Signup failed. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full">
        <Loading />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 w-full max-w-lg">
        <h2 className="text-4xl font-bold text-center mb-6">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">
          Join and connect with amazing people!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="John Doe"
              required
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="johndoe"
              required
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="email"
              placeholder="example@email.com"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              placeholder="Enter a secure password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Tag Selection */}
          <TagSelector
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Sign Up
          </button>

          <p className="text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 hover:underline focus:outline-none"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
