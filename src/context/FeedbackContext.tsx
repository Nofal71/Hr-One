import * as React from 'react';
import { BreadcrumbItemType, FeedbackContextType, ProviderProps } from "./types";

const FeedbackContext = React.createContext<FeedbackContextType | null>(null);

export const FeedBackProvider: React.FC<ProviderProps> = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItemType[]>([
    { displayName: "Home", path: "/" }
  ]);

  const pushBreadcrumb = (crumb: BreadcrumbItemType) => {
    setBreadcrumbs(prev => [...prev, crumb]);
  };

  const popBreadcrumb = () => {
    setBreadcrumbs(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const resetBreadcrumbs = () => {
    setBreadcrumbs([{ displayName: "Home", path: "/" }]);
  };

  return (
    <FeedbackContext.Provider
      value={{ breadcrumbs, setBreadcrumbs, pushBreadcrumb, popBreadcrumb, resetBreadcrumbs }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedbacks = (): FeedbackContextType => {
  const context = React.useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedbacks must be used within a FeedBackProvider");
  }
  return context;
};
