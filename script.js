const regForm = document.getElementById("reg-form");

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
