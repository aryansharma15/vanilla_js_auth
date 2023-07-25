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
