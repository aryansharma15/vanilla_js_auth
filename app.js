// app.js
const express = require("express");
const session = require("express-session");
const auth0 = require("auth0");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Set the public folder as the static folder to serve HTML, CSS, JS files
app.use(express.static("public"));

// Set up express-session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

// Initialize Auth0
const auth0Client = new auth0.AuthenticationClient({
	domain: process.env.AUTH0_DOMAIN,
	clientId: process.env.AUTH0_CLIENT_ID,
	clientSecret: process.env.AUTH0_CLIENT_SECRET,
});

// Home page
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

// Login route (redirect to Auth0 login page)
app.get("/login", (req, res) => {
	const authorizeUrl = auth0Client.buildAuthorizeUrl({
		redirect_uri: process.env.AUTH0_CALLBACK_URL,
		response_type: "code",
		scope: "openid profile",
	});
	res.redirect(authorizeUrl);
});

// Callback route (handle Auth0 callback and set session)
app.get("/callback", async (req, res) => {
	const { code } = req.query;
	try {
		const tokenSet = await auth0Client.oauth.authorizationCodeGrant({
			code,
			redirect_uri: process.env.AUTH0_CALLBACK_URL,
			scope: "openid profile",
		});

		// Save user info in session (customize as needed)
		req.session.accessToken = tokenSet.access_token;
		req.session.idToken = tokenSet.id_token;

		res.redirect("/profile");
	} catch (err) {
		console.error(err);
		res.status(500).send("Error occurred during login");
	}
});

// Profile route (protected route, ensure user is logged in)
app.get("/profile", (req, res) => {
	if (req.session.accessToken && req.session.idToken) {
		// Replace {USER_NAME} with the user's name (extracted from the ID token payload)
		const userName = req.session.idTokenPayload.name;
		const profileHtml = __dirname + "/public/profile.html";
		// Read the profile.html file and replace {USER_NAME} with the actual user name
		fs.readFile(profileHtml, "utf8", (err, data) => {
			if (err) {
				console.error(err);
				res.status(500).send("Error occurred while reading profile.html");
			} else {
				const modifiedProfileHtml = data.replace("{USER_NAME}", userName);
				res.send(modifiedProfileHtml);
			}
		});
	} else {
		res.redirect("/login");
	}
});

// Logout route (clear session and redirect to home)
app.get("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/");
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

// generating the secret session string
const generateString = (length) => {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * chars.length);
		result += chars[randomIndex];
	}
	return result;
};

const sessionSecret = generateString(32);
process.env.SESSION_SECRET = sessionSecret;
