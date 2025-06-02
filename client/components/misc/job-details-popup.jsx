import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const JobDetailsPopup = ({ isOpen, onClose, onSave, candidateName }) => {
  const [jobDetails, setJobDetails] = useState({
    jobTitle: "",
    jobDescription: "",
    salary: "",
    benefits: "",
    startDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fillDemoData = () => {
    setJobDetails({
      jobTitle: "Frontend Developer",
      jobDescription:
        "Build responsive UI components using React and Tailwind CSS.",
      salary: "₹8,00,000 per annum",
      benefits: "Health insurance, Remote-friendly, Flexible hours",
      startDate: new Date().toISOString().split("T")[0], // today's date
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Job Details for {candidateName}
        </h2>

        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title*
            </Label>
            <Input
              type="text"
              name="jobTitle"
              value={jobDetails.jobTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description*
            </Label>
            <Textarea
              name="jobDescription"
              value={jobDetails.jobDescription}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Salary*
            </Label>
            <Input
              type="text"
              name="salary"
              value={jobDetails.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Benefits
            </Label>
            <Input
              type="text"
              name="benefits"
              value={jobDetails.benefits}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date*
            </Label>
            <Input
              type="date"
              name="startDate"
              value={jobDetails.startDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Button variant="secondary" onClick={fillDemoData}>
            Fill Demo Data
          </Button>

          <div className="flex gap-3 ml-auto">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => onSave(jobDetails)}
              disabled={
                !jobDetails.jobTitle ||
                !jobDetails.jobDescription ||
                !jobDetails.salary ||
                !jobDetails.startDate
              }
            >
              Save & Shortlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPopup;
