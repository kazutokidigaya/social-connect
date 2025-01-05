import User from "../models/User.js";

export const recommendUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const allUsers = await User.find({ _id: { $ne: req.user.id } });

    const recommendations = allUsers
      .map((user) => ({
        ...user._doc,
        commonTags: user.tags.filter((tag) => currentUser.tags.includes(tag))
          .length,
      }))
      .filter((user) => user.commonTags > 0) // Show users with common tags
      .sort((a, b) => b.commonTags - a.commonTags);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recommendations" });
  }
};
