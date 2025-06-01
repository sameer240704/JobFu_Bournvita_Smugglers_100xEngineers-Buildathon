import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    filters: {
      location: [String],
      jobTitle: String,
      industry: String,
      yearsOfExperience: [Number],
      skills: [String],
    },
    response: [
      {
        candidate: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Candidate",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
export default ChatHistory;
