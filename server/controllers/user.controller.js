import User from "../models/user.model.js";

const syncUser = async (req, res) => {
  try {
    const { supabaseId, email, name, avatar, provider } = req.body;

    let user = await User.findOne({ supabaseId });

    if (!user) {
      user = new User({
        supabaseId,
        email,
        name: name || null,
        avatar: avatar || null,
        provider: provider || "email",
        profileCompleted: false,
      });
      await user.save();
    } else {
      if (avatar) {
        user.avatar = avatar;
      }
      user.lastLogin = Date.now();
      await user.save();
    }

    res.status(200).json({
      success: true,
      userId: user._id,
      profileCompleted: user.profileCompleted,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ success: false, error: "Failed to sync user" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.find({ supabaseId: userId });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, error: "Failed to fetch user" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      name,
      phone,
      organization,
      role,
      linkedinUrl,
      githubUrl,
      twitterUrl,
    } = req.body;

    const updateData = {
      name,
      phone,
      organization,
      role,
      linkedinUrl,
      githubUrl,
      twitterUrl,
      profileCompleted: true,
      updatedAt: Date.now(),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
};

export { syncUser, updateProfile, getCurrentUser };
