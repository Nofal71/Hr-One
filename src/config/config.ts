export const authConfig = {
  clientId: '36ef5f28-5932-410d-8082-a06cf6cb88b4',
  initiateLoginEndpoint: `https://white-dune-00f6d0e0f.2.azurestaticapps.net/auth-start.html`,
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
