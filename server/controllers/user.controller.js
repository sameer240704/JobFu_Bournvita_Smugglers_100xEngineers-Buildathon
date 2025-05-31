import { User } from "../models/user.model.js";

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
                provider: provider || 'email',
                profileCompleted: false
            });
            await user.save();
        } else {
            user.lastLogin = Date.now();
            await user.save();
        }

        res.status(200).json({
            success: true,
            userId: user._id,
            profileCompleted: user.profileCompleted
        });
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ success: false, error: 'Failed to sync user' });
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
            twitterUrl
        } = req.body;

        let avatar;
        if (req.file) {
            avatar = await processAvatarUpload(req.file);
        }

        const updateData = {
            name,
            phone,
            organization,
            role,
            linkedinUrl,
            githubUrl,
            twitterUrl,
            profileCompleted: true,
            updatedAt: Date.now()
        };

        if (avatar) {
            updateData.avatar = avatar;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: updatedUser,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
};

async function processAvatarUpload(file) {
    // Implement your avatar processing logic here
    // This might involve resizing, storing in S3/Cloudinary, etc.
    // Return the URL of the stored avatar
    return `https://your-storage.com/avatars/${file.filename}`;
}

export {
    syncUser,
    updateProfile
};