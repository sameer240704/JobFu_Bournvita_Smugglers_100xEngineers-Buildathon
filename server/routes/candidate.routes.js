// routes/candidateRoutes.js

import express from "express";
import {
  getAllCandidates,
  getCandidateById,
  updateCandidateById,
} from "../controllers/candidate.controller.js";

const router = express.Router();

router.get("/", getAllCandidates);
router.get("/:id", getCandidateById);
router.put("/:id", updateCandidateById);

export default router;
