import { authConfig } from "../config/config";
import axiosInstance from "../axiosInstance";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";

const scopes = ["User.Read", "Sites.Read.All"];


export const initTokenService = async () => {
  const { teamsUserCredential } = useTeamsUserCredential({
    clientId: authConfig.clientId,
    initiateLoginEndpoint: authConfig.initiateLoginEndpoint,
  })

  if (!teamsUserCredential) return null

  try {
    const token = await teamsUserCredential.getToken(scopes);
    if (token?.token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token.token}`;
    } else {
      const newToken = await teamsUserCredential.getToken(scopes);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken?.token}`;
    }
  } catch (err) {
    console.error("Token initialization failed:", err);
    throw err;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (!teamsUserCredential) return null
  try {
    const token = await teamsUserCredential.getToken(scopes);
    return token?.token ?? null;
  } catch (err) {
    console.error("Access token fetch failed:", err);
    return null;
  }
};

export const getGraphClient = () => {
  if (!teamsUserCredential) throw new Error("Token service not initialized");
  return teamsUserCredential;
};
