import mongoose from "mongoose";
import Shortlisting from "../models/shortlisting.model.js";
import { sendOfferEmail } from "../middlewares/email.middleware.js";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from 'uuid';

export const addShortlistedCandidate = async (req, res) => {
  try {
    const { userId, candidateId, chatHistoryId, offerDetails } = req.body;

    const user = await User.findOne({ supabaseId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newUserId = user._id;

    // Check for existing shortlisting with proper userId
    const existingShortlisting = await Shortlisting.findOne({
      userId: newUserId,
      candidateId: new mongoose.Types.ObjectId(candidateId),
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
        sentAt: null,
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
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newUserId = user._id;

    const shortlisted = await Shortlisting.find({
      userId: newUserId,
      chatHistoryId: new mongoose.Types.ObjectId(chatId)
    })
      .populate("candidateId", "offerDetails")
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

    const user = await User.findOne({ supabaseId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find existing shortlisting or create a new one
    let shortlisting = await Shortlisting.findOneAndUpdate(
      {
        userId: user._id,
        candidateId: candidate._id
      },
      {
        $set: {
          status: "sent",
          emailStatus: {
            sentAt: new Date(),
            openedAt: null,
            lastViewed: null
          },
          offerDetails: {
            jobTitle: templateVariables.jobTitle,
            jobDescription: templateVariables.jobDescription,
            salary: templateVariables.salary || 'Not specified',
            benefits: templateVariables.benefits || 'Standard benefits package'
          }
        },
        $push: {
          communications: {
            type: "email",
            content: `Offer sent for ${templateVariables.jobTitle}`,
            direction: "outbound",
            timestamp: new Date()
          }
        }
      },
      { new: true, upsert: true }
    );

    const result = await sendOfferEmail(
      user._id, // Pass the actual ObjectId, not the array
      candidate,
      emailTemplate,
      templateVariables
    );

    if (result.success) {
      // Update with the actual offerId from email sending
      await Shortlisting.findByIdAndUpdate(shortlisting._id, {
        $set: { offerId: result.offerId }
      });

      res.status(200).json({
        success: true,
        message: "Email sent successfully",
        offerId: result.offerId,
      });
    } else {
      // Rollback status if email failed
      await Shortlisting.findByIdAndUpdate(shortlisting._id, {
        $set: { status: "none" }
      });
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const trackEmailOpen = async (req, res) => {
  try {
    const { offerId } = req.params;

    const updated = await Shortlisting.findOneAndUpdate(
      { offerId },
      {
        $set: {
          status: "viewed",
          "emailStatus.openedAt": new Date(),
          "emailStatus.lastViewed": new Date(),
        },
        $push: {
          communications: {
            type: "email",
            content: "Candidate viewed the offer email",
            direction: "inbound",
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Offer not found" });
    }

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
      .populate("candidateId", "candidate_name contact_information skills experience")
      .populate("userId", "name email");

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const respondToOffer = async (req, res) => {
  console.log(req.params)
  try {
    const { offerId } = req.params;
    const { decision, comments } = req.body;

    if (!['accepted', 'rejected'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Invalid decision. Must be either 'accepted' or 'rejected'"
      });
    }

    const updatedOffer = await Shortlisting.findOneAndUpdate(
      { offerId },
      {
        $set: {
          status: decision,
          response: {
            decision,
            comments: comments || '',
            respondedAt: new Date(),
          },
        },
        $push: {
          communications: {
            type: "email",
            content: `Candidate ${decision} the offer${comments ? ` with comments: ${comments}` : ''}`,
            direction: "inbound",
            timestamp: new Date()
          },
        },
      },
      {
        new: true,
        runValidators: true
      }
    )
      .populate("candidateId", "candidate_name contact_information")
      .populate("userId", "name email");

    if (!updatedOffer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found"
      });
    }

    const responseData = {
      success: true,
      message: `Offer ${decision} successfully`,
      data: {
        status: updatedOffer.status,
        candidate: {
          name: updatedOffer.candidateId?.candidate_name || 'Unknown',
          email: updatedOffer.candidateId?.contact_information?.email || '',
        },
        recruiter: {
          name: updatedOffer.userId?.name || 'Unknown',
          email: updatedOffer.userId?.email || '',
        },
        responseDetails: {
          decision: updatedOffer.response?.decision,
          comments: updatedOffer.response?.comments,
          respondedAt: updatedOffer.response?.respondedAt
        }
      }
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error responding to offer:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process offer response"
    });
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

    const candidates = shortlistings.map(item => ({
      ...item.candidateId,
      shortlistingId: item._id,
      status: item.status,
      offerDetails: item.offerDetails,
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

export const exportToExcel = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const user = await User.findOne({ supabaseId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const query = { userId: user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const shortlistings = await Shortlisting.find(query)
      .populate({
        path: 'candidateId',
        select: 'candidate_name contact_information experience skills education'
      })
      .sort({ createdAt: -1 })
      .lean();

    const excelData = shortlistings.map(item => ({
      "Candidate Name": item.candidateId?.candidate_name || 'N/A',
      "Email": item.candidateId?.contact_information?.email || 'N/A',
      "Phone": item.candidateId?.contact_information?.phone || 'N/A',
      "Current Position": item.candidateId?.experience?.[0]?.position || 'N/A',
      "Current Company": item.candidateId?.experience?.[0]?.company || 'N/A',
      "Skills": item.candidateId?.skills?.technical_skills?.programming_languages?.join(', ') || 'N/A',
      "Education": item.candidateId?.education?.[0]?.degree || 'N/A',
      "Status": item.status,
      "Offer Title": item.offerDetails?.jobTitle || 'N/A',
      "Offer Salary": item.offerDetails?.salary || 'N/A',
      "Sent Date": item.emailStatus?.sentAt?.toISOString().split('T')[0] || 'N/A',
      "Last Viewed": item.emailStatus?.lastViewed?.toISOString().split('T')[0] || 'N/A',
      "Response": item.response?.decision || 'No response'
    }));

    res.status(200).json(excelData);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to export data"
    });
  }
};

// New endpoint to merge duplicate candidates
export const cleanupDuplicates = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ supabaseId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all shortlistings for this user
    const shortlistings = await Shortlisting.find({ userId: user._id });

    // Group by candidateId
    const candidatesMap = new Map();

    for (const shortlisting of shortlistings) {
      const candidateId = shortlisting.candidateId.toString();

      if (!candidatesMap.has(candidateId)) {
        candidatesMap.set(candidateId, []);
      }
      candidatesMap.get(candidateId).push(shortlisting);
    }

    let mergedCount = 0;

    // Process each candidate's shortlistings
    for (const [candidateId, shortlistings] of candidatesMap.entries()) {
      if (shortlistings.length > 1) {
        // Sort by createdAt (newest first)
        shortlistings.sort((a, b) => b.createdAt - a.createdAt);

        // Keep the newest one as primary
        const primary = shortlistings[0];

        // Merge data from others
        for (let i = 1; i < shortlistings.length; i++) {
          const duplicate = shortlistings[i];

          // Merge communications
          if (duplicate.communications?.length) {
            primary.communications = [
              ...(primary.communications || []),
              ...duplicate.communications
            ];
          }

          // Keep the most advanced status
          const statusPriority = {
            'accepted': 4,
            'rejected': 3,
            'viewed': 2,
            'sent': 1,
            'none': 0
          };

          if (statusPriority[duplicate.status] > statusPriority[primary.status]) {
            primary.status = duplicate.status;
          }

          // Merge email status
          if (duplicate.emailStatus?.sentAt &&
            (!primary.emailStatus?.sentAt || duplicate.emailStatus.sentAt > primary.emailStatus.sentAt)) {
            primary.emailStatus = {
              ...primary.emailStatus,
              sentAt: duplicate.emailStatus.sentAt
            };
          }

          // Merge other fields if missing in primary
          if (!primary.offerId && duplicate.offerId) {
            primary.offerId = duplicate.offerId;
          }

          if (!primary.offerDetails && duplicate.offerDetails) {
            primary.offerDetails = duplicate.offerDetails;
          }

          // Delete the duplicate
          await Shortlisting.findByIdAndDelete(duplicate._id);
          mergedCount++;
        }

        // Save the merged primary
        await primary.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Merged ${mergedCount} duplicate shortlistings`,
      totalCandidates: candidatesMap.size
    });
  } catch (error) {
    console.error("Error cleaning up duplicates:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to clean up duplicates"
    });
  }
};