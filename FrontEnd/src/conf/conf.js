const conf = {
    serverUrl: String(import.meta.env.VITE_SERVER_URL),
    accessTokenExpiry: Number(import.meta.env.VITE_ACCESS_TOKEN_EXPIRY),
    refreshTokenExpiry: Number(import.meta.env.VITE_REFRESH_TOKEN_EXPIRY),
    loginRoute: "/users/login",
    registerRoute: "/users/register",
};

export default conf;
