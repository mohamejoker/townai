import { useContext } from "react";
import SiteBuilderContext from "../context/SiteBuilderContext";

export const useSiteBuilder = () => {
  const context = useContext(SiteBuilderContext);

  if (!context) {
    throw new Error("useSiteBuilder must be used within a SiteBuilderProvider");
  }

  return context;
};

export default useSiteBuilder;
