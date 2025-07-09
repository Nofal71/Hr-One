import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { SiteContextType, ProviderProps } from "./types";
import axiosInstance from "../axiosInstance";

const SiteContext = createContext<SiteContextType | null>(null);

export const SitesProvider: React.FC<ProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [siteNotCreated, setSiteNotCreated] = useState<string | null>(null)

    const getSitesData = useCallback(async (siteName: string, listNames: string[]) => {
        setLoading(true);
        try {
            const siteSearch = await axiosInstance.get(`/sites?search=${siteName}`)
            const site = siteSearch.data.value?.[0];
            if (!site.id) {
                setSiteNotCreated(siteName)
                return
            }
            let listsData = [];
            const lists = await axiosInstance.get(`/sites/${site.id}/lists`)
            listsData = await Promise.all(listNames.map(async (e) => {
                const list = lists.data.value.find((l: any) => l.name.toLowerCase() === e.toLowerCase());
                if (list) {
                    if (list.list?.template === 'documentLibrary') {
                        const drive = await axiosInstance.get(`/sites/${site.id}/lists/${list.id}/drive?expand=fields`);
                        return { ...list, driveId: drive.data.id };
                    }
                    return list;
                }
                return null;
            }));
            listsData = listsData.filter(item => item !== null);
            return {
                siteData: await site,
                listsData,
            };
        } catch (error: unknown) {
            console.error('Error fetching site data:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getSiteIds = useCallback(async (siteName: string, listNames: string[]) => {
        const cachedData = localStorage.getItem('siteData');
        let savedIds = cachedData
            ? JSON.parse(cachedData)
            : {
                sites: [],
                lists: [],
            };

        const cachedSite = savedIds.sites.find((site: { name: string; id: number | null }) => site.name === siteName);
        const cachedLists = savedIds.lists.filter((list: { name: string; id: number | null }) =>
            listNames.includes(list.name)
        );
        if (cachedSite?.id && cachedLists.length > 0) {
            return {
                siteId: cachedSite.id,
                lists: cachedLists.map((list: { name: string; id: number | null }) => ({
                    name: list.name,
                    id: list.id,
                })),
            };
        }

        const data = await getSitesData(siteName, listNames);
        if (!data) return null;

        const newSite = { name: siteName, id: data.siteData.id };
        const newLists = data.listsData.map((list: any) => ({
            name: list.name,
            id: list.id,
        }));

        savedIds = {
            sites: [
                ...savedIds.sites.filter((site: { name: string }) => site.name !== siteName),
                newSite,
            ],
            lists: [
                ...savedIds.lists.filter((list: { name: string }) => !listNames.includes(list.name)),
                ...newLists,
            ],
        };

        localStorage.setItem('siteData', JSON.stringify(savedIds));

        return {
            siteId: newSite.id,
            lists: newLists,
        };
    }, [getSitesData]);


    useEffect(() => {
        if (siteNotCreated) {
            alert(`We are troubling in getting site data , please make sure site with named ${siteNotCreated} is created...!`)
        }
    }, [siteNotCreated])

    return (
        <SiteContext.Provider value={{ getSitesData, getSiteIds, loading }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSites = (): SiteContextType => {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error("useSites must be used within a SitesProvider");
    }
    return context;
};