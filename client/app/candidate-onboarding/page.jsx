import CandidateDetailsForm from "@/components/candidate-details-form";
import { Logo } from "@/public";
import Image from "next/image";
import React from "react";

const CandidateOnboardingPage = () => {
  return (
    <div className="flex h-screen p-3">
      <div className="h-full w-86 bg-gray-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-8">
          <div className="dark:bg-white rounded-xl flex items-center justify-center">
            <Image
              src={Logo}
              alt="Disha AI"
              className="h-12 w-auto rounded-md"
            />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400 tracking-tighter">
            Disha AI
          </span>
        </div>

        <div className="space-y-6 tracking-tighter">
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900">Chat to sales</h3>
            <p className="text-sm text-gray-600">
              Interested in switching? Speak to our team.
            </p>
            <a
              href="mailto:sales@untitledui.com"
              className="text-sm text-gray-900 font-semibold underline"
            >
              sales@dishaai.com
            </a>
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          <div className="space-y-2">
            <h3 className="font-bold text-gray-900">Email support</h3>
            <p className="text-sm text-gray-600">
              We'll get back to you within 24 hours.
            </p>
            <a
              href="mailto:support@untitledui.com"
              className="text-sm text-gray-900 font-semibold underline"
            >
              support@dishaai.com
            </a>
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Chat support</h3>
            <p className="text-sm text-gray-600">
              Chat to our staff 24/7 for instant support.
            </p>
            <span className="flex gap-x-4">
              <button className="text-gray-900 underline p-0 rounded-lg text-sm font-semibold transition-colors">
                Start live chat
              </button>
              <div className="flex items-center space-x-1.5 border border-gray-600 p-0.5 px-1 rounded-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">
                  Online
                </span>
              </div>
            </span>
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Call us</h3>
            <p className="text-sm text-gray-600">
              Mon - Fri, 9:00 AM - 5:00 PM (UTC +10:00).
            </p>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900 underline">
                123456789
              </p>
              <p className="text-sm font-semibold text-gray-900 underline">
                +91 123456789
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center overflow-auto">
        <CandidateDetailsForm />
      </div>
    </div>
  );
};

export default CandidateOnboardingPage;
