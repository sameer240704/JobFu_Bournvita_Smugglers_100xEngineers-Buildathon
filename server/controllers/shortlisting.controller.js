import mongoose from "mongoose";
import Shortlisting from "../models/shortlisting.model.js";
import { sendOfferEmail } from "../middlewares/email.middleware.js";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from 'uuid';

export const addShortlistedCandidate = async (req, res) => {
  try {
    const { userId, candidateId, chatHistoryId, offerDetails } = req.body;

    const user = await User.findOne({ supabaseId: userId });
    const newUserId = user._id;

    const existingShortlisting = await Shortlisting.findOne({
      newUserId,
      candidateId,
    });
    if (existingShortlisting) {
      return res
        .status(400)
        .json({ message: "Candidate is already shortlisted" });
    }

    const newOfferId = uuidv4();

    const shortlisted = new Shortlisting({
      userId: newUserId,
      candidateId: new mongoose.Types.ObjectId(candidateId),
      chatHistoryId: new mongoose.Types.ObjectId(chatHistoryId),
      offerId: newOfferId,
      offerDetails,
      status: "none",
      emailStatus: {
        sentAt: new Date(),
        openedAt: null,
        lastViewed: null,
      },
    });

    await shortlisted.save();

    res.status(201).json({ message: "Candidate added to shortlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShortlistedCandidates = async (req, res) => {
  try {
    const { userId, chatId } = req.params;

    const user = await User.findOne({ supabaseId: userId });
    const newUserId = user._id;

    const shortlisted = await Shortlisting.find({
      userId: newUserId,
      chatHistoryId: new mongoose.Types.ObjectId(chatId)
    })
      .populate(
        "candidateId",
        "offerDetails"
      )
      .select("candidateId")
      .lean();

    const candidateIds = shortlisted
      .filter(item => item.candidateId && item.candidateId._id)
      .map(item => item.candidateId._id);

    res.status(200).json(candidateIds);
  } catch (error) {
    console.error("Error fetching shortlisted candidates:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch shortlisted candidates"
    });
  }
};

export const sendOffer = async (req, res) => {
  try {
    const { userId } = req.params;
    const { candidate, emailTemplate, templateVariables } = req.body;

    const sessionUserId = await User.find({ supabaseId: userId }, { _id: 1 });

    const result = await sendOfferEmail(
      sessionUserId,
      candidate,
      emailTemplate,
      templateVariables
    );

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Email sent successfully",
        offerId: result.offerId,
        // shortlistingId: result.shortlistingId
      });
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const trackEmailOpen = async (req, res) => {
  try {
    const { offerId } = req.params;

    await Shortlisting.findOneAndUpdate(
      { offerId },
      {
        $set: {
          status: "viewed",
          "emailStatus.openedAt": new Date(),
          "emailStatus.lastViewed": new Date(),
        },
      }
    );

    res.set("Content-Type", "image/png");
    res.send(
      Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        "base64"
      )
    );
  } catch (error) {
    console.error("Error tracking email open:", error);
    res.status(500).end();
  }
};

export const getOfferDetails = async (req, res) => {
  try {
    const { offerId } = req.params;

    const offer = await Shortlisting.findOne({ offerId })
      .populate("candidateId", "candidate_name contact_information")
      .populate("userId", "name email");

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update offer response
export const respondToOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { decision, comments } = req.body;

    const updatedOffer = await Shortlisting.findOneAndUpdate(
      { offerId },
      {
        $set: {
          status: decision,
          response: {
            decision,
            comments,
            respondedAt: new Date(),
          },
        },
        $push: {
          communications: {
            type: "email",
            content: `Candidate ${decision} the offer`,
            direction: "inbound",
          },
        },
      },
      { new: true }
    ).populate("candidateId", "candidate_name");

    if (!updatedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json({
      message: `Offer ${decision} successfully`,
      candidateName: updatedOffer.candidateId.candidate_name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteShortlistedCandidate = async (req, res) => {
  try {
    const { shortlistingId } = req.params;
    const deletedShortlisting = await Shortlisting.findByIdAndDelete(
      shortlistingId
    );
    if (!deletedShortlisting) {
      return res.status(404).json({ message: "Shortlisting not found" });
    }
    res.status(200).json({ message: "Shortlisting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this new controller method
export const getShortlistedCandidatesForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, search, page = 1, limit = 10 } = req.query;

    const user = await User.findOne({ supabaseId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const query = { userId: user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { 'candidateId.candidate_name': { $regex: search, $options: 'i' } },
        { 'candidateId.contact_information.email': { $regex: search, $options: 'i' } },
        { 'offerDetails.jobTitle': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const shortlistings = await Shortlisting.find(query)
      .populate({
        path: 'candidateId',
        select: 'candidate_name contact_information experience skills linkedin_data'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Shortlisting.countDocuments(query);

    // Transform the data to include candidate details and status
    const candidates = shortlistings.map(item => ({
      ...item.candidateId,
      shortlistingId: item._id,
      status: item.status,
      lastContacted: item.emailStatus?.sentAt || item.createdAt,
      contactCount: item.communications?.length || 0
    }));

    res.status(200).json({
      success: true,
      data: candidates,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error fetching shortlisted candidates:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch shortlisted candidates"
    });
  }
};
