//
// const express = require("express");
// const { join } = require("path");

// const app = express();

// // Serving static files from the directory
// // There is no public directory, change if there's an error
// app.use(express.static(join(__dirname, "public")));

// // Endpoint to serve the configuration file
// app.get("/auth_config.json", (req, res) => {
// 	res.sendFile(join(__dirname, "auth_config.json"));
// });

// // Serve the index page for all other requests
// app.get("/*", (_, res) => {
// 	res.sendFile(join(__dirname, "index.html"));
// });

// // Listen on port 3000
// app.listen(3000, () => console.log("Application running on port 3000"));

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

// middleware
// const { requiresAuth } = require("express-openid-connect");

// app.get("/profile", requiresAuth(), (req, res) => {
// 	res.send(JSON.stringify(req.oidc.user));
// });
