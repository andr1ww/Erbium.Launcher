"use client";

import Particles from "@/components/core/particles";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeStep from "@/components/onboarding/steps/welcome-step";
import UsernameStep from "@/components/onboarding/steps/username-step";
import ConfirmationStep from "@/components/onboarding/steps/confirmation-step";
import FinishingStep from "@/components/onboarding/steps/finishing-step";
import { useUserState } from "@/zustand/user-state";
import { useRouter } from "next/navigation";

type OnboardingStep = "welcome" | "username" | "confirmation" | "finishing";

export default function Home() {
  const [onboardingStep, setOnboardingStep] =
    useState<OnboardingStep>("welcome");
  const [username, setUsername] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleStepNavigation = {
    welcome: {
      continue: () => setOnboardingStep("username"),
    },
    username: {
      back: () => setOnboardingStep("welcome"),
      continue: () => setOnboardingStep("confirmation"),
    },
    confirmation: {
      back: () => setOnboardingStep("username"),
      confirm: () => setOnboardingStep("finishing"),
    },
    finishing: {
      back: () => setOnboardingStep("confirmation"),
      continue: () => {},
    },
  };

  const state = useUserState();
  const nav = useRouter();

  useEffect(() => {
    if (state.DisplayName !== "") {
      nav.push("/home");
    }
  }, [username]);

  return (
    <div className="font-sans min-h-screen flex items-center justify-center relative">
      <Particles className="absolute inset-0 -z-10" />

      <main className="flex-1 flex items-center justify-center p-3 relative z-10">
        <AnimatePresence mode="wait">
          {onboardingStep === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <WelcomeStep onContinue={handleStepNavigation.welcome.continue} />
            </motion.div>
          )}

          {onboardingStep === "username" && (
            <motion.div
              key="username"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <UsernameStep
                username={username}
                onUsernameChange={setUsername}
                onBack={handleStepNavigation.username.back}
                onContinue={handleStepNavigation.username.continue}
              />
            </motion.div>
          )}

          {onboardingStep === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <ConfirmationStep
                username={username}
                onBack={handleStepNavigation.confirmation.back}
                onConfirm={handleStepNavigation.confirmation.confirm}
              />
            </motion.div>
          )}

          {onboardingStep === "finishing" && (
            <motion.div
              key="finishing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <FinishingStep username={username} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
