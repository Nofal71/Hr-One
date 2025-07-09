import { ReactNode } from "react";
import { UserType } from "../types/userTypes";
import { PublicClientApplication } from "@azure/msal-browser";

export interface ProviderProps {
  children: ReactNode;
  inTeams?: boolean;
  token?: any
  msalInstance?: PublicClientApplication | null;

}

export interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
  isAdmin: boolean | null;
}


export type SiteContextType = {
  getSitesData: (siteName: string, listNames: string[]) => Promise<{ siteData: any, listsData: any } | null> | any;
  getSiteIds: (siteName: string, listNames: string[]) => Promise<any>;
  loading: boolean;
};

export interface HR_Operations {
  siteId: number | null,
  userRoles: any,
  AttendanceTimeLine: any
}

export interface HR_Recruitment {
  siteId: number | null,
  CVLibraries: any,
}

export interface BreadcrumbItemType {
  displayName: string;
  path: string;
  value?: any;
}

export interface FeedbackContextType {
  breadcrumbs: BreadcrumbItemType[];
  setBreadcrumbs: (crumbs: BreadcrumbItemType[]) => void;
  pushBreadcrumb: (crumb: BreadcrumbItemType) => void;
  popBreadcrumb: () => void;
  resetBreadcrumbs: () => void;
}
