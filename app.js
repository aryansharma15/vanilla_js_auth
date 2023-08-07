const express = require("express");
const session = require("express-session");
const auth0 = require("auth0");
const dotenv = require("dotenv");
const { auth } = require("express-openid-connect");
const fs = require("fs");

dotenv.config();

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

const app = express();

app.use(express.static("public"));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);
// saveUninitialised for a new session for each user

const auth0Client = new auth0.AuthenticationClient({
	domain: process.env.domain,
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

app.get("/login", (req, res) => {
	const authorizeUrl = auth0Client.buildAuthorizeUrl({
		redirect_uri: process.env.AUTH0_CALLBACK_URL,
		response_type: "code",
		scope: "openid profile",
	});
	res.redirect(authorizeUrl);
});

app.get("/callback", async (req, res) => {
	const { code } = req.query;
	try {
		const tokenSet = await auth0Client.oauth.authorizationCodeGrant({
			code,
			redirect_uri: process.env.AUTH0_CALLBACK_URL,
			scope: "openid profile",
		});

		// Saving user info in the session
		req.session.accessToken = tokenSet.access_token;
		req.session.idToken = tokenSet.id_token;

		res.redirect("/profile");
	} catch (err) {
		console.error(err);
		res.status(500).send("Error occurred during login");
	}
});

// Middleware
function requireAuth(req, res, next) {
	if (req.session.accessToken && req.session.idToken) {
		next(); //to state that user is authenticated, move to next middleware/route
	} else {
		res.redirect("/login");
	}
}

// protected route
app.get("/dashboard", (req, res) => {
	if (req.session.accessToken && req.session.idToken) {
		const username = req.session.idTokenPayload.name;
		const userEmail = req.session.idTokenPayload.email;
		const dashHtml = __dirname + "/public/dashboard.html";

		fs.readFile(dashHtml, "utf8", (err, data) => {
			if (err) {
				console.log(err);
				res.status(500).send("Error occurred while reading dashboard.html");
			} else {
				const modifiedDashHtml = data
					.replace(document.getElementById("dash-username"), username)
					.replace(document.getElementById("dash-email"), userEmail);

				res.send(modifiedDashHtml);
			}
		});
	} else {
		res.redirect("/login");
	}
});

app.get("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
