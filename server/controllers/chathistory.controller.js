import ChatHistory from "../models/chathistory.model.js";

// Add new chat history
export const addChatHistory = async (req, res) => {
  try {
    const { user, query, filters, response } = req.body;

    // Validate required fields
    if (!user || !query) {
      return res.status(400).json({
        success: false,
        message: "User ID and query are required fields",
      });
    }

    // Create new chat history
    const newChatHistory = new ChatHistory({
      user,
      query,
      filters: filters || {},
      response: response || [],
    });

    const savedChatHistory = await newChatHistory.save();

    // Populate user and candidate references
    const populatedChatHistory = await ChatHistory.findById(
      savedChatHistory._id
    )
      .populate("user", "name email")
      .populate("response.candidate", "name email jobTitle");

    res.status(201).json({
      success: true,
      message: "Chat history added successfully",
      data: populatedChatHistory,
    });
  } catch (error) {
    console.error("Error adding chat history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all chat histories
export const getAllChatHistories = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;

    // Build filter object
    const filter = {};
    if (userId) {
      filter.user = userId;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get chat histories with pagination
    const chatHistories = await ChatHistory.find(filter)
      .populate("user", "name email")
      .populate("response.candidate", "name email jobTitle")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination info
    const totalCount = await ChatHistory.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      chatHistories,
    });
  } catch (error) {
    console.error("Error getting chat histories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get chat history by ID
export const getChatHistoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat history ID format",
      });
    }

    const chatHistory = await ChatHistory.findById(id)
      .populate("user", "name email")
      .populate("response.candidate", "name email jobTitle skills experience");

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        message: "Chat history not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat history retrieved successfully",
      data: chatHistory,
    });
  } catch (error) {
    console.error("Error getting chat history by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update chat history by ID
export const updateChatHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat history ID format",
      });
    }

    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedChatHistory = await ChatHistory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("user", "name email")
      .populate("response.candidate", "name email jobTitle");

    if (!updatedChatHistory) {
      return res.status(404).json({
        success: false,
        message: "Chat history not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat history updated successfully",
      data: updatedChatHistory,
    });
  } catch (error) {
    console.error("Error updating chat history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete chat history by ID
export const deleteChatHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat history ID format",
      });
    }

    const deletedChatHistory = await ChatHistory.findByIdAndDelete(id);

    if (!deletedChatHistory) {
      return res.status(404).json({
        success: false,
        message: "Chat history not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat history deleted successfully",
      data: deletedChatHistory,
    });
  } catch (error) {
    console.error("Error deleting chat history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get chat histories by user ID
export const getChatHistoriesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate ObjectId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const chatHistories = await ChatHistory.find({ user: userId })
      .populate("user", "name email")
      .populate("response.candidate", "name email jobTitle")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await ChatHistory.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      message: "User chat histories retrieved successfully",
      data: chatHistories,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error getting chat histories by user ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete all chat histories for a user
export const deleteUserChatHistories = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const result = await ChatHistory.deleteMany({ user: userId });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} chat histories deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting user chat histories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteChatHistoryById = async (req, res) => {
  try {
    const { chatHistoryId } = req.params;
    // Validate ObjectId format
    if (!chatHistoryId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat history ID format",
      });
    }
    const deletedChatHistory = await ChatHistory.findByIdAndDelete(
      chatHistoryId
    );
    if (!deletedChatHistory) {
      return res.status(404).json({
        success: false,
        message: "Chat history not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Chat history deleted successfully",
      data: deletedChatHistory,
    });
  } catch (error) {
    console.error("Error deleting chat history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
