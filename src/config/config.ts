export const authConfig = {
  clientId: import.meta.env.VITE_AAD_APP_CLIENT_ID!,
  initiateLoginEndpoint: `${import.meta.env.VITE_TAB_ENDPOINT}/auth-start.html`,
  authority: "https://login.microsoftonline.com/common",
};

export const loginScopes = [
  "User.Read",
  "openid",
  "profile",
  "email",
  "Files.ReadWrite.All",
  "Sites.ReadWrite.All",
  "Directory.ReadWrite.All",
  "Group.ReadWrite.All",
  "Sites.Manage.All"
];
