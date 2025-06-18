import React from "react";
import AdvancedSiteBuilder from "@/components/SiteBuilder/AdvancedSiteBuilder";
import SiteBuilderErrorBoundary from "@/components/SiteBuilder/ErrorBoundary";

const SiteBuilderPage: React.FC = () => {
  return (
    <SiteBuilderErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <AdvancedSiteBuilder />
      </div>
    </SiteBuilderErrorBoundary>
  );
};

export default SiteBuilderPage;
