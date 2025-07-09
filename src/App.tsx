import { FluentProvider, Spinner } from "@fluentui/react-components";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "./context/Context";
import MainRoutes from "./routes/main-route";
import { lightTheme } from "./themeConfig";
import { authConfig, loginScopes } from "./config/config";
import { AuthProvider } from "./context/AuthContext";
import { FeedBackProvider } from "./context/FeedbackContext";
import { SitesProvider } from "./context/SitesContext";
import { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { ThemeProvider } from "@mui/material";
import muiTheme from "./mui-theme";
import { PublicClientApplication } from "@azure/msal-browser";
import * as microsoftTeams from "@microsoft/teams-js";
import { RecruitmentProvider } from "./context/RecruitmentContext";


export default function App() {
  const [isInTeams, setIsInTeams] = useState(false);
  const [tokenReady, setTokenReady] = useState(false);
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);
  const { loading, theme, themeString, teamsUserCredential } = useTeamsUserCredential({
    clientId: authConfig.clientId,
    initiateLoginEndpoint: `${authConfig.initiateLoginEndpoint}/auth-start.html`,
  });

  useEffect(() => {
    const checkInTeams = async () => {
      if (window.location.ancestorOrigins?.[0]?.includes("teams.microsoft.com")) {
        try {
          await import("@microsoft/teams-js").then((teams) => {
            teams.app.initialize().then(() => setIsInTeams(true));
          });
        } catch {
          setIsInTeams(false);
        }
      } else {
        setIsInTeams(false);
        const msal = new PublicClientApplication({
          auth: {
            clientId: authConfig.clientId,
            authority: `https://login.microsoftonline.com/common`,
            redirectUri: import.meta.env.VITE_TAB_ENDPOINT
          },
          cache: { cacheLocation: "sessionStorage" },
        });
        await msal.initialize();
        setMsalInstance(msal);
      }
    };
    checkInTeams();
  }, []);

  useEffect(() => {
    if (loading || (!isInTeams && !msalInstance)) return;

    const setToken = async () => {
      try {
        if (isInTeams && teamsUserCredential) {
          let cashed = localStorage.getItem('auth')
          if (!cashed) {
            const token = await new Promise<string>((resolve, reject) => {
              microsoftTeams.app.initialize().then(() => {
                microsoftTeams.authentication.authenticate({
                  url: `${window.location.origin}/auth-start.html?clientId=${authConfig.clientId}&scope=${loginScopes.join("%20")}`,
                  width: 600,
                  height: 535,
                  successCallback: (result: string) => {
                    resolve(result);
                  },
                  failureCallback: (error: any) => {
                    reject(new Error(error));
                  },
                });
              }).catch(err => {
                console.error("Teams SDK Error:", err);
                reject(err);
              });
            });
            localStorage.setItem('auth', JSON.stringify(token))
            axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
          } else {
            axiosInstance.defaults.headers["Authorization"] = `Bearer ${JSON.parse(cashed)}`;
          }
          setTokenReady(true);
        } else if (msalInstance) {
          const tokenResponse = await msalInstance.handleRedirectPromise();
          if (tokenResponse) {
            axiosInstance.defaults.headers["Authorization"] = `Bearer ${tokenResponse.accessToken}`;
            setTokenReady(true);
          } else {
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length > 0) {
              const token = await msalInstance.acquireTokenSilent({
                scopes: loginScopes,
                account: accounts[0],
              });
              axiosInstance.defaults.headers["Authorization"] = `Bearer ${token.accessToken}`;
              setTokenReady(true);
            } else {
              await msalInstance.loginRedirect({ scopes: loginScopes });
            }
          }
        }
      } catch (error) {
        console.error("Token acquisition failed:", error);
      }
    };

    setToken();
  }, [loading, msalInstance, teamsUserCredential, isInTeams]);

  if (loading || !tokenReady) return <Spinner size="extra-large" style={{ height: "100dvh" }} />;

  return (
    <ThemeProvider theme={muiTheme}>
      <TeamsFxContext.Provider value={{ theme, themeString, teamsUserCredential }}>
        <RecruitmentProvider>
          <SitesProvider>
            <AuthProvider inTeams={isInTeams} msalInstance={msalInstance}>
              <FeedBackProvider>
                <FluentProvider theme={lightTheme}>
                  <MainRoutes theme="light" inTeams={isInTeams} />
                </FluentProvider>
              </FeedBackProvider>
            </AuthProvider>
          </SitesProvider>
        </RecruitmentProvider>
      </TeamsFxContext.Provider>
    </ThemeProvider>
  );
}