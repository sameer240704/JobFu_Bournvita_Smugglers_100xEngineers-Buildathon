"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Check, X, ArrowRight, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

const OfferResponsePage = () => {
  const { offerId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleResponse = async (decision) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/offer/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerId,
          response: decision,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(decision);
        toast.success(`You've ${decision} the offer!`);
      } else {
        throw new Error(data.message || "Failed to submit response");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (response) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-purple-900/20 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200 rounded-full opacity-20 dark:bg-purple-800 dark:opacity-10"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-300 rounded-full opacity-20 dark:bg-purple-700 dark:opacity-10"></div>

            <CardHeader className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/50"
              >
                {response === "accepted" ? (
                  <BadgeCheck className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                ) : (
                  <X className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                )}
              </motion.div>
              <CardTitle className="text-center text-2xl">
                {response === "accepted" ? "🎉 Congratulations!" : "Thank You!"}
              </CardTitle>
              <CardDescription className="text-center">
                {response === "accepted"
                  ? "Your journey with us begins now!"
                  : "We appreciate your consideration"}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 text-center">
              <p className="text-lg mb-6">
                {response === "accepted"
                  ? "We're excited to have you on board! Our team will contact you shortly with next steps."
                  : "We wish you the best in your future endeavors."}
              </p>

              {response === "accepted" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6"
                >
                  <Button className="gap-2">
                    Next Steps <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const offerDetails = [
    { label: "Position", value: "Senior AI Engineer" },
    { label: "Location", value: "Remote" },
    { label: "Salary Range", value: "$120,000 - $150,000 per year" },
    { label: "Start Date", value: "Flexible" },
    { label: "Benefits", value: "Health insurance, 401k, Stock options" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-purple-900/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200 rounded-full opacity-20 dark:bg-purple-800 dark:opacity-10"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-300 rounded-full opacity-20 dark:bg-purple-700 dark:opacity-10"></div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-center text-2xl">Job Offer</CardTitle>
            <CardDescription className="text-center">
              We're excited to extend this opportunity to you
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="mb-8">
              <p className="text-lg mb-6 text-center">
                Thank you for your interest in this position. Please review the
                offer details below and let us know your decision.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {offerDetails.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 rounded-lg border border-purple-100 dark:border-purple-900/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  >
                    <h3 className="font-semibold text-purple-600 dark:text-purple-400">
                      {detail.label}
                    </h3>
                    <p className="mt-1">{detail.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4 text-center">
                Additional Information
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <Check className="w-4 h-4 mt-1 mr-2 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span>Flexible work hours and remote-first culture</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 mt-1 mr-2 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span>Annual learning and development budget</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 mt-1 mr-2 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span>Quarterly team retreats</span>
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                variant="destructive"
                onClick={() => handleResponse("rejected")}
                disabled={isLoading}
                className="w-full h-12 gap-2"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <X className="w-5 h-5" /> Decline Offer
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={() => handleResponse("accepted")}
                disabled={isLoading}
                className="w-full h-12 gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <Check className="w-5 h-5" /> Accept Offer
                  </>
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default OfferResponsePage;
