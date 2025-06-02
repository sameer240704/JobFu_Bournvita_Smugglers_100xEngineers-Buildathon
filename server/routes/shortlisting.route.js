import express from "express";
import {
  addShortlistedCandidate,
  getShortlistedCandidates,
  sendOffer,
  trackEmailOpen,
  getOfferDetails,
  respondToOffer,
  deleteShortlistedCandidate,
  getShortlistedCandidatesForUser,
  exportToExcel
} from "../controllers/shortlisting.controller.js";

const router = express.Router();

router.post("/user/:userId/add", addShortlistedCandidate);
router.get("/user/:userId/chat/:chatId", getShortlistedCandidates);
router.post("/user/:userId/send-offer", sendOffer);
router.get("/track-email/:offerId", trackEmailOpen);
router.get("/offer/:offerId", getOfferDetails);
router.post("/offer/:offerId/respond", respondToOffer);
router.delete("/user/:userId/delete/:candidateId", deleteShortlistedCandidate);
router.get('/user/:userId', getShortlistedCandidatesForUser);
router.get('/user/:userId/export', exportToExcel);

export default router;
