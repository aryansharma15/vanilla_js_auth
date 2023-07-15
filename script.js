const regForm = document.getElementById("reg-form");

regForm.addEventListener("submit", function (event) {
	event.preventDefault();

	const name = document.getElementById("reg-name");
	const email = document.getElementById("reg-email");
	const uname = document.getElementById("reg-uname");
	const password = document.getElementById("reg-pass");

	registerUser(name, email, uname, password);
});
