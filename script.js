import { createAuth0Client } from "@auth0/auth0-spa-js";

let auth0Client = null;

const regForm = document.getElementById("reg-form");
const loginForm = document.getElementById("login-form");

// fetching the auth_config file
const fetchAuthConfig = () => fetch("/auth_config.json");

// downloads the configuration file and initialize the "auth0Client"
const configureClient = async () => {
	const response = await fetchAuthConfig();
	const config = await response.json();
	auth0Client = await auth0.createAuth0Client({
		domain: config.domain,
		clientId: config.clientId,
	});
};

window.onload = async () => {
	await configureClient();
};

//
// Implementing registering functionality for new users

regForm.addEventListener("submit", function (event) {
	event.preventDefault();

	const name = document.getElementById("reg-name");
	const email = document.getElementById("reg-email");
	const uname = document.getElementById("reg-uname");
	const password = document.getElementById("reg-pass");

	registerUser(name, email, uname, password);
});

function registerUser(name, email, uname, password) {
	const userData = {
		name: name,
		email: email,
		username: uname,
		password: password,
	};

	fetch("", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		})

		.catch((error) => {
			console.error("Error:", error);
		});
}

//
// Implementing login functionality

loginForm.addEventListener("submit", function (event) {
	event.preventDefault();
	const uname = document.getElementById("login-uname");
	const pass = document.getElementById("login-pass");

	loginUser(uname, pass);
});

function loginUser(username, password) {
	const userData = {
		username: username,
		password: password,
	};

	fetch("", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.error("Error: ", error);
		});
}

// Logging out method

function logoutUser() {
	localStorage.removeItem("jwtToken");

	window.location.href = "/regis.html";
}
