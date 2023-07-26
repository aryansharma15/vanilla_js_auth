const { auth } = require("express-openid-connect");

const config = {
	authRequired: false,
	auth0Logout: true,
	secret: "a long, randomly-generated string stored in env",
	baseURL: "https://127.0.0.1:5500",
	clientID: "85eOHVFdxg8HPMuhhAuTjFpgbzxzu33O",
	issuerBaseURL: "https://dev-oo7j7v2fgym2imov.us.auth0.com",
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
	res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

const auth0 = new auth0.WebAuth({
	domain: "YOUR_AUTH0_DOMAIN",
	clientID: "YOUR_AUTH0_CLIENT_ID",
	redirectUri: "http://localhost:YOUR_PORT/callback", // The URL to redirect back to after authentication
	audience: "https://YOUR_AUTH0_API_IDENTIFIER", // The audience value is optional but may be required for certain setups.
	responseType: "token id_token",
	scope: "openid profile", // Adjust the scope as needed for your application
});

function login() {
	auth0.authorize;
}
