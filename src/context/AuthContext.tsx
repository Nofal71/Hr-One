import React, { createContext, useContext, useEffect, useState } from "react";
import { authConfig, loginScopes } from "../config/config";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";
import { AuthContextType, ProviderProps } from "./types";
import axiosInstance from "../axiosInstance";
import { UserType } from "../types/userTypes";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<ProviderProps> = ({ children, inTeams, msalInstance }) => {
    const { teamsUserCredential } = useTeamsUserCredential({
        clientId: authConfig.clientId,
        initiateLoginEndpoint: authConfig.initiateLoginEndpoint,
    });
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);


    const logout = async () => {
        localStorage.removeItem('auth')
        if (inTeams && teamsUserCredential) {
            setUser(null)
        } else if (msalInstance) {
            await msalInstance.logoutRedirect();
        }
        setUser(null);
        setIsAdmin(null);
    };

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            try {
                let token;
                if (msalInstance) {
                    const tokenResponse = await msalInstance.handleRedirectPromise();
                    if (tokenResponse) {
                        token = tokenResponse;
                    } else {
                        const accounts = msalInstance.getAllAccounts();
                        if (accounts.length > 0) {
                            token = await msalInstance.acquireTokenSilent({
                                scopes: loginScopes,
                                account: accounts[0],
                            });
                        } else {
                            await msalInstance.loginRedirect({ scopes: loginScopes });
                            return;
                        }
                    }
                    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token.accessToken}`;
                }
                const response = await axiosInstance.get("/me");
                setUser(response.data);
                setIsAdmin(true);
            } catch (err) {
                setError(err as Error);
                console.error("Auth error:", err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [teamsUserCredential, inTeams, msalInstance]);

    return (
        <AuthContext.Provider value={{ user, loading, error, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};