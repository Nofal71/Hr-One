export const authConfig = {
  clientId: '0b4ba56d-259e-42e8-a649-b489a72672fb',
  initiateLoginEndpoint: `https://white-dune-00f6d0e0f.2.azurestaticapps.net/auth-start.html`,
  authority: "https://login.microsoftonline.com/d6c5be03-e08b-4cee-a1dc-c409911f78a4",
};

export const loginScopes = [
  "User.Read",
  "openid",
  "profile",
  "email",
  "Files.ReadWrite.All",
  "Sites.ReadWrite.All",
];
