import Sidebar from "@/components/misc/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { NextStepProvider, NextStep } from "nextstepjs";
import { steps } from "@/lib/step";

export default function MindPlayLayout({ children }) {
  return (
    <NextStepProvider>
      <NextStep steps={steps}>
        <div className="h-screen flex">
          <Sidebar />

          <main className="h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-300 w-full p-5 flex flex-col justify-start">
            {children}
          </main>

          <Toaster />
        </div>
      </NextStep>
    </NextStepProvider>
  );
}
