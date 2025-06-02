"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { FaSpinner } from "react-icons/fa6";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const OfferResponsePage = () => {
  const pathname = usePathname();
  const [offerId, setOfferId] = useState(null);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pathname) {
      const parts = pathname.split("/");
      const id = parts[2];
      setOfferId(id);
    }
  }, [pathname]);

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

    console.log(offerId, "RIH");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/shortlist/offer/${offerId}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ decision, comments }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        setOffer((prev) => ({
          ...prev,
          status: decision,
          response: {
            decision,
            comments,
            respondedAt: new Date().toISOString(),
          },
        }));
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
            <p className="text-gray-600 dark:text-gray-400">
              The offer you're looking for doesn't exist or may have expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (
    decision &&
    (offer?.status === "accepted" || offer?.status === "rejected")
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {decision === "accepted" ? (
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
            )}
            <CardTitle className="text-2xl">
              Offer {decision === "accepted" ? "Accepted" : "Declined"}
            </CardTitle>
            <CardDescription>
              Thank you for your response. The recruiter has been notified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {comments && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="font-medium text-sm">Your comments:</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {comments}
                </p>
              </div>
            )}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              You can close this page now.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Job Offer Response</CardTitle>
          <CardDescription>
            Please review the offer details and submit your response
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Decision Radio Group */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Your decision:</Label>
              <RadioGroup
                value={decision}
                onValueChange={setDecision}
                className="space-y-2"
              >
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <RadioGroupItem value="accepted" id="accepted" />
                  <Label htmlFor="accepted" className="cursor-pointer flex-1">
                    I accept this offer
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <RadioGroupItem value="rejected" id="rejected" />
                  <Label htmlFor="rejected" className="cursor-pointer flex-1">
                    I decline this offer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Comments Input */}
            <div className="space-y-2">
              <Label htmlFor="comments" className="block text-sm font-medium">
                Additional Comments (Optional)
              </Label>
              <Textarea
                id="comments"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full"
                placeholder="Any additional comments for the recruiter..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !decision}
              className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-md transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin duration-300 h-6 w-6" />
                  Submitting...
                </span>
              ) : (
                "Submit Response"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferResponsePage;
