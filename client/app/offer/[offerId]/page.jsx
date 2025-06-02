"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const OfferResponsePage = () => {
  const { offerId } = usePathname;
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState(null);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!offerId) {
      setLoading(false);
      return;
    }

    const fetchOffer = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/shortlist/offer/${offerId}`
        );
        const data = await response.json();

        if (response.ok) {
          setOffer(data);

          if (data.status === "accepted" || data.status === "rejected") {
            setDecision(data.status);
          }
        } else {
          toast.error(data.message || "Failed to load offer");
        }
      } catch (error) {
        toast.error("Error fetching offer details");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [offerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!decision) {
      toast.warning("Please select a response");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/shortlisting/offer/${offerId}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ decision, comments }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(`Offer ${decision} successfully`);
        setOffer((prev) => ({ ...prev, status: decision }));
        setDecision(decision);
      } else {
        toast.error(data.message || "Failed to submit response");
      }
    } catch (error) {
      toast.error("Error submitting response");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!offerId || !offer) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Offer Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The offer you're looking for doesn't exist or may have expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (decision) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              Offer {decision === "accepted" ? "Accepted" : "Declined"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Thank you for your response. The recruiter has been notified.
            </p>
            {comments && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                <p className="font-medium">Your comments:</p>
                <p>{comments}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Job Offer Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">
                {offer.offerDetails?.jobTitle || "Job Offer"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {offer.offerDetails?.jobDescription ||
                  "No description available"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={decision === "accepted"}
                    onChange={() => setDecision("accepted")}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span>I accept this offer</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={decision === "rejected"}
                    onChange={() => setDecision("rejected")}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span>I decline this offer</span>
                </label>
              </div>

              <div className="space-y-2">
                <label htmlFor="comments" className="block text-sm font-medium">
                  Additional Comments (Optional)
                </label>
                <textarea
                  id="comments"
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Response"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferResponsePage;
