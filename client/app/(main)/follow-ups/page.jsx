"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTheme } from "@/context/theme-context";
import { demoCandidates } from "@/constants/candidates-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { FaSpinner } from "react-icons/fa6";

const ITEMS_PER_PAGE = 8;

const FollowUpsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState({
    subject: "Exciting Opportunity at Our Company",
    body: `Dear {candidateName},\n\nWe were impressed by your profile and would like to discuss the {jobTitle} position at our company.\n\nThis role focuses on {jobDescription} and we believe your skills in {skills} would be a great fit.\n\nPlease review the offer details and let us know your decision:\n{offerLink}\n\nBest regards,\n{recruiterName}`,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [templateVariables, setTemplateVariables] = useState({
    jobTitle: "Senior AI Engineer",
    jobDescription: "developing cutting-edge generative AI solutions",
    recruiterName: "Alex Johnson",
  });
  const [useDemoData, setUseDemoData] = useState(true);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);

        if (useDemoData) {
          setCandidates(demoCandidates);
        } else {
          const response = await fetch("/api/candidates/follow-ups");
          const data = await response.json();
          setCandidates(data);
        }
      } catch (error) {
        toast.error("Failed to fetch candidates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [useDemoData]);

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCandidates(
        paginatedCandidates.map((candidate) => candidate._id)
      );
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSendEmails = async () => {
    if (selectedCandidates.length === 0) {
      toast.warning("Please select at least one candidate");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/emails/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateIds: selectedCandidates,
          emailTemplate,
          templateVariables,
        }),
      });

      if (response.ok) {
        toast.success(
          `Emails sent to ${selectedCandidates.length} candidates!`
        );
        const updatedResponse = await fetch("/api/candidates/follow-ups");
        const updatedData = await updatedResponse.json();
        setCandidates(updatedData);
        setSelectedCandidates([]);
        setIsEmailModalOpen(false);
      } else {
        throw new Error("Failed to send emails");
      }
    } catch (error) {
      toast.error("Error sending emails");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateChange = (e) => {
    const { name, value } = e.target;
    setEmailTemplate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariableChange = (name, value) => {
    setTemplateVariables((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getPreviewEmail = () => {
    let preview = emailTemplate.body;
    const variables = {
      ...templateVariables,
      candidateName: "John Doe",
      skills: "LangChain, RAG, and Python",
      offerLink: "https://yourdomain.com/offer/abc123",
    };

    for (const [key, value] of Object.entries(variables)) {
      preview = preview.replace(new RegExp(`{${key}}`, "g"), value);
    }

    return preview;
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Candidate Follow-ups
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your candidate pipeline and send personalized communications
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Search candidates..."
            className="w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-3">
            <Button
              onClick={() => setIsEmailModalOpen(true)}
              disabled={selectedCandidates.length === 0}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 cursor-pointer"
            >
              Contact ({selectedCandidates.length})
            </Button>
          </div>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Candidate Pipeline</CardTitle>
              <CardDescription>
                {filteredCandidates.length} candidates found
                {useDemoData && (
                  <span className="ml-2 text-purple-600 dark:text-purple-400">
                    (Using demo data)
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="demo-mode"
                checked={useDemoData}
                onCheckedChange={setUseDemoData}
              />
              <Label htmlFor="demo-mode">Demo Mode</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && !candidates.length ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedCandidates.length > 0 &&
                            selectedCandidates.length ===
                              paginatedCandidates.length
                          }
                          onChange={handleSelectAll}
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                      </TableHead>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Match</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Last Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCandidates.map((candidate) => (
                      <TableRow
                        key={candidate._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedCandidates.includes(candidate._id)}
                            onChange={() =>
                              handleSelectCandidate(candidate._id)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback>
                                {candidate.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{candidate.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {candidate.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{candidate.position}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {candidate.location}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={candidate.matchScore || 75}
                              className="h-2 w-16"
                            />
                            <span className="text-sm font-medium">
                              {candidate.matchScore || 75}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              candidate.status === "pending"
                                ? "outline"
                                : candidate.status === "accepted"
                                ? "success"
                                : "destructive"
                            }
                            className="capitalize"
                          >
                            {candidate.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {new Date(
                                candidate.lastContacted
                              ).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {candidate.contactMethod || "Email"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredCandidates.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" x2="19" y1="8" y2="14" />
                      <line x1="22" x2="16" y1="11" y2="11" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No candidates found matching your search
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>

        {filteredCandidates.length > 0 && (
          <div className="border-t px-6 py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="h-[90vh] max-w-5xl overflow-auto">
          <DialogHeader>
            <DialogTitle>Compose Follow-up Email</DialogTitle>
            <DialogDescription>
              Customize the email template for selected candidates
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={emailTemplate.subject}
                  onChange={handleTemplateChange}
                  placeholder="Email subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Email Body</Label>
                <Textarea
                  id="body"
                  name="body"
                  value={emailTemplate.body}
                  onChange={handleTemplateChange}
                  rows={10}
                  placeholder="Write your email template here..."
                  className="font-mono text-sm min-h-[200px]"
                />
                <div className="text-sm text-muted-foreground p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="font-medium mb-2">Available variables:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        {"{candidateName}"}
                      </code>
                      <span className="text-sm">Candidate's name</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        {"{jobTitle}"}
                      </code>
                      <span className="text-sm">Job position</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        {"{jobDescription}"}
                      </code>
                      <span className="text-sm">Job description</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        {"{skills}"}
                      </code>
                      <span className="text-sm">Candidate's skills</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        {"{offerLink}"}
                      </code>
                      <span className="text-sm">Offer link</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        {"{recruiterName}"}
                      </code>
                      <span className="text-sm">Your name</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Template Variables</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={templateVariables.jobTitle}
                      onChange={(e) =>
                        handleVariableChange("jobTitle", e.target.value)
                      }
                      placeholder="Senior AI Engineer"
                      className="placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Input
                      id="jobDescription"
                      value={templateVariables.jobDescription}
                      onChange={(e) =>
                        handleVariableChange("jobDescription", e.target.value)
                      }
                      placeholder="What the job entails"
                      className="placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recruiterName">Your Name</Label>
                    <Input
                      id="recruiterName"
                      value={templateVariables.recruiterName}
                      onChange={(e) =>
                        handleVariableChange("recruiterName", e.target.value)
                      }
                      placeholder="Recruiter Name"
                      className="placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Preview</Label>
                  <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <h3 className="font-bold mb-3 text-purple-600 dark:text-purple-400">
                      {emailTemplate.subject}
                    </h3>
                    <div className="whitespace-pre-line text-sm">
                      {getPreviewEmail()}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Selected Candidates ({selectedCandidates.length})
                  </Label>
                  <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                    {filteredCandidates
                      .filter((c) => selectedCandidates.includes(c._id))
                      .map((candidate) => (
                        <div
                          key={candidate._id}
                          className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback>
                                {candidate.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {candidate.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {candidate.position}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-red-500"
                            onClick={() => handleSelectCandidate(candidate._id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEmailModalOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmails}
              disabled={isLoading || selectedCandidates.length === 0}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin duration-300" />
                  Sending...
                </>
              ) : (
                `Send to ${selectedCandidates.length} Candidates`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowUpsPage;
