import React, { useState, useEffect } from "react";
import { MerkatoTopUtilityBar } from "./components/landing/MerkatoTopUtilityBar";
import { MerkatoNavbar } from "./components/landing/MerkatoNavbar";
import { HeroSection } from "./components/landing/HeroSection";
import { WebinarBanner } from "./components/landing/WebinarBanner";
import { TrustedBrands } from "./components/landing/TrustedBrands";
import { SoftwarePreviewSection } from "./components/landing/SoftwarePreviewSection";
import { RecognitionStrip } from "./components/landing/RecognitionStrip";
import { FeaturePillars } from "./components/landing/FeaturePillars";
import { AtYourFingertips } from "./components/landing/AtYourFingertips";
import { SalesAndOrdersSection } from "./components/landing/SalesAndOrdersSection";
import { PackingAndTrackingSection } from "./components/landing/PackingAndTrackingSection";
import { ExtensibilitySection } from "./components/landing/ExtensibilitySection";
import { IntegrationsSection } from "./components/landing/IntegrationsSection";
import { MobileAppsSection } from "./components/landing/MobileAppsSection";
import { PricingSection } from "./components/landing/PricingSection";
import { CustomerTestimonialSection } from "./components/landing/CustomerTestimonialSection";
import { BottomCtaSection } from "./components/landing/BottomCtaSection";
import { MerkatoFooter } from "./components/landing/MerkatoFooter";
import { FloatingDemoWidget } from "./components/landing/FloatingDemoWidget";

// Modals & Dashboard
import { DemoRequestModal } from "./components/modals/DemoRequestModal";
import { WebinarModal } from "./components/modals/WebinarModal";
import { FreeToolModal } from "./components/modals/FreeToolModal";
import { AuthModal } from "./components/modals/AuthModal";
import { DashboardApp } from "./components/dashboard/DashboardApp";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/dashboard/ui/Ui";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");

  // Modals state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isWebinarModalOpen, setIsWebinarModalOpen] = useState(false);
  const [activeFreeTool, setActiveFreeTool] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<"signup" | "signin" | null>(null);

  // Sync dark mode class with root html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLaunchDashboard = () => {
    setAuthModal(null);
    setCurrentView("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AuthProvider>
    <ToastProvider>
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        isDarkMode ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
      }`}
    >
      {currentView === "dashboard" ? (
        <DashboardApp
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onBackToHome={() => {
            setCurrentView("landing");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      ) : (
        <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
          {/* Top Utility Bar (Sign In, Contact, Search, Language, Dark Mode) */}
          <MerkatoTopUtilityBar
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onSignInClick={() => setAuthModal("signin")}
            onLaunchDashboard={handleLaunchDashboard}
          />

          {/* Sticky Main Navigation with Mega Menus */}
          <MerkatoNavbar
            isDarkMode={isDarkMode}
            onSignUpClick={() => setAuthModal("signup")}
            onScheduleDemoClick={() => setIsDemoModalOpen(true)}
            onOpenDashboard={handleLaunchDashboard}
          />

          {/* Hero Section */}
          <HeroSection
            isDarkMode={isDarkMode}
            onScheduleDemo={() => setIsDemoModalOpen(true)}
            onStartTrial={() => setAuthModal("signup")}
            onOpenLiveDashboard={handleLaunchDashboard}
          />

          {/* Interactive Webinar Strip */}
          <WebinarBanner
            isDarkMode={isDarkMode}
            onRegister={() => setIsWebinarModalOpen(true)}
          />

          {/* Trusted Customer Logos Strip */}
          <TrustedBrands isDarkMode={isDarkMode} />

          {/* Interactive Software Preview UI */}
          <SoftwarePreviewSection
            isDarkMode={isDarkMode}
            onOpenFullDashboard={handleLaunchDashboard}
          />

          {/* Awards & Recognition Strip */}
          <RecognitionStrip isDarkMode={isDarkMode} />

          {/* 3 Core Value Pillars */}
          <FeaturePillars isDarkMode={isDarkMode} />

          {/* "At Your Fingertips" Module */}
          <AtYourFingertips
            isDarkMode={isDarkMode}
            onExploreFeatures={() => {
              const el = document.getElementById("software-preview");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Sales & Orders Multi-Channel Flow */}
          <SalesAndOrdersSection
            isDarkMode={isDarkMode}
            onTryDemo={handleLaunchDashboard}
          />

          {/* Packing & Tracking Geometry Section */}
          <PackingAndTrackingSection
            isDarkMode={isDarkMode}
            onExplore={() => setIsDemoModalOpen(true)}
          />

          {/* Extensibility & Workflows Section */}
          <ExtensibilitySection isDarkMode={isDarkMode} />

          {/* 30+ Channel & App Integrations */}
          <IntegrationsSection
            isDarkMode={isDarkMode}
            onExploreAll={() => setIsDemoModalOpen(true)}
          />

          {/* Mobile Apps Section */}
          <MobileAppsSection isDarkMode={isDarkMode} />

          {/* Pricing Plans Section */}
          <PricingSection
            isDarkMode={isDarkMode}
            onSelectPlan={(plan) => {
              if (plan.toLowerCase().includes("contact") || plan.toLowerCase().includes("enterprise")) {
                setIsDemoModalOpen(true);
              } else {
                setAuthModal("signup");
              }
            }}
          />

          {/* Customer Testimonials & Case Studies */}
          <CustomerTestimonialSection
            isDarkMode={isDarkMode}
            onExploreCaseStudies={() => setIsDemoModalOpen(true)}
          />

          {/* Final Call to Action */}
          <BottomCtaSection
            isDarkMode={isDarkMode}
            onScheduleDemo={() => setIsDemoModalOpen(true)}
            onStartTrial={() => setAuthModal("signup")}
          />

          {/* Full Enterprise Footer */}
          <MerkatoFooter
            isDarkMode={isDarkMode}
            onRequestDemo={() => setIsDemoModalOpen(true)}
            onOpenFreeTool={(tool) => setActiveFreeTool(tool)}
          />

          {/* Floating "Request a demo" specialist avatar widget */}
          <FloatingDemoWidget onClick={() => setIsDemoModalOpen(true)} />
        </div>
      )}

      {/* Global Modals */}
      <DemoRequestModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <WebinarModal
        isOpen={isWebinarModalOpen}
        onClose={() => setIsWebinarModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <FreeToolModal
        toolName={activeFreeTool}
        onClose={() => setActiveFreeTool(null)}
        isDarkMode={isDarkMode}
      />

      <AuthModal
        isOpen={authModal !== null}
        mode={authModal || "signup"}
        onClose={() => setAuthModal(null)}
        onSuccess={handleLaunchDashboard}
        isDarkMode={isDarkMode}
      />
    </div>
    </ToastProvider>
    </AuthProvider>
  );
}

