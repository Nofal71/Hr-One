import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import axiosInstance from "../axiosInstance";



export interface JobPostingItem {
  job_title: string;
  job_description: string;
  job_status: string;
}


interface ListData {
  name: string;
  id: string;
  type: "documentLibrary" | "generic";
  driveId?: string;
}

interface SiteData {
  name: string;
  id: string;
}

interface RecruitmentContextType {
  getRecruitmentData: () => Promise<{
    siteData: SiteData;
    listsData: ListData[];
  } | null>;
  getRecruitmentIds: () => Promise<{
    siteId: string;
    lists: { name: string; id: string; type: "documentLibrary" | "generic" }[];
  } | null>;
  loading: boolean;
}

interface ProviderProps {
  children: React.ReactNode;
}

const RecruitmentContext = createContext<RecruitmentContextType | null>(null);

export const RecruitmentProvider: React.FC<ProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [siteNotCreated, setSiteNotCreated] = useState<string | null>(null);

  const SITE_NAME = "HumanResource";
  const listNames = ["CvLibrary", "JobPosting", "candidate_stages", "communication_skills" , "Tags"];
  const listTypes: { [key: string]: "documentLibrary" | "generic" } = {
    CvLibrary: "documentLibrary",
    JobPosting: "generic",
    candidate_stages: "generic",
    communication_skills: "generic",
    Tags: "generic",
  };

  const getRecruitmentData = useCallback(async () => {
    setLoading(true);
    try {
      const siteSearch = await axiosInstance.get(`/sites?search=${SITE_NAME}`);
      const site: SiteData = siteSearch.data.value?.[0];
      if (!site?.id) {
        setSiteNotCreated(SITE_NAME);
        return null;
      }

      const lists = await axiosInstance.get(`/sites/${site.id}/lists`);
      const listsData = await Promise.all(
        listNames.map(async (name) => {
          const list = lists.data.value.find((l: { name: string; id: string }) => l.name.toLowerCase() === name.toLowerCase());
          if (!list) return null;

          const type = listTypes[name];
          if (type === "documentLibrary") {
            const drive = await axiosInstance.get(`/sites/${site.id}/lists/${list.id}/drive?expand=fields`);
            return { name, id: list.id, type, driveId: drive.data.id } as ListData;
          }
          return { name, id: list.id, type } as ListData;
        })
      );

      return {
        siteData: site,
        listsData: listsData.filter((item): item is ListData => item !== null),
      };
    } catch (error: unknown) {
      console.error("Error fetching recruitment data:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecruitmentIds = useCallback(async () => {
    const cachedData = localStorage.getItem("recruitmentData");
    let savedIds = cachedData
      ? JSON.parse(cachedData)
      : { sites: [], lists: [] };

    const cachedSite = savedIds.sites.find((site: { name: string; id: string }) => site.name === SITE_NAME);
    const cachedLists = savedIds.lists.filter((list: { name: string }) => listNames.includes(list.name));

    if (cachedSite?.id && cachedLists.length === listNames.length) {
      return {
        siteId: cachedSite.id,
        lists: cachedLists.map((list: { name: string; id: string }) => ({
          name: list.name,
          id: list.id,
          type: listTypes[list.name],
        })),
      };
    }

    const data = await getRecruitmentData();
    if (!data) return null;

    const newSite = { name: SITE_NAME, id: data.siteData.id };
    const newLists = data.listsData.map((list) => ({
      name: list.name,
      id: list.id,
      type: listTypes[list.name],
    }));

    savedIds = {
      sites: [...savedIds.sites.filter((site: { name: string }) => site.name !== SITE_NAME), newSite],
      lists: [
        ...savedIds.lists.filter((list: { name: string }) => !listNames.includes(list.name)),
        ...newLists,
      ],
    };

    localStorage.setItem("recruitmentData", JSON.stringify(savedIds));

    return {
      siteId: newSite.id,
      lists: newLists,
    };
  }, [getRecruitmentData]);

  useEffect(() => {
    if (siteNotCreated) {
      alert(`Trouble fetching site data. Please ensure site named ${siteNotCreated} is created.`);
    }
  }, [siteNotCreated]);

  return (
    <RecruitmentContext.Provider value={{ getRecruitmentData, getRecruitmentIds, loading }}>
      {children}
    </RecruitmentContext.Provider>
  );
};

export const useRecruitment = (): RecruitmentContextType => {
  const context = useContext(RecruitmentContext);
  if (!context) {
    throw new Error("useRecruitment must be used within a RecruitmentProvider");
  }
  return context;
};