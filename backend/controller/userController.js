import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const connectUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user.id);
  const friend = await User.findById(id);

  if (!user.friends.includes(friend._id)) {
    user.friends.push(friend._id);
    await user.save();
    res.json({ message: "Connected" });
  } else {
    res.json({ message: "Already connected" });
  }
};

export const searchUsers = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error searching users" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch current user" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "username email"
    );
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch friends" });
  }
};

export const disconnectUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(req.user.id);
    const friendIndex = user.friends.indexOf(id);

    if (friendIndex > -1) {
      user.friends.splice(friendIndex, 1);
      await user.save();
      res.json({ message: "Disconnected successfully" });
    } else {
      res.status(400).json({ error: "User not in friends list" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to disconnect user" });
  }
};
