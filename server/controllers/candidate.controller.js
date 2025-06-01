import Candidate from "../models/candidate.model.js";

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Public
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch candidates", error });
  }
};

// @desc    Get a single candidate by ID
// @route   GET /api/candidates/:id
// @access  Public
export const getCandidateById = async (req, res) => {
  const { id } = req.params;

  try {
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving candidate", error });
  }
};

// @desc    Update a candidate by ID
// @route   PUT /api/candidates/:id
// @access  Public or Protected (depending on your app)
export const updateCandidateById = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      { ...updateData, updated_at: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json(updatedCandidate);
  } catch (error) {
    res.status(500).json({ message: "Failed to update candidate", error });
  }
};
