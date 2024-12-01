// التحقق من حالة تسجيل الدخول عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
	const accountLink = document.getElementById("accountLink");
	const logoutLink = document.getElementById("logoutLink");
	const welcomeMessage = document.getElementById("welcomeMessage");
	const userNameSpan = document.getElementById("userName");
	const content = document.getElementById("content");

	// استرجاع حالة تسجيل الدخول واسم المستخدم من localStorage
	const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
	const userName = localStorage.getItem("userName");

	// إذا كان المستخدم مسجل الدخول
	if (isLoggedIn) {
		accountLink.style.display = "none"; // إخفاء رابط إنشاء الحساب
		logoutLink.style.display = "inline"; // إظهار رابط تسجيل الخروج
		welcomeMessage.style.display = "inline"; // إظهار رسالة الترحيب
		userNameSpan.textContent = userName;
		content.style.display = "block"; // عرض المحتوى

		// إظهار الروابط المحمية
		document.querySelectorAll(".protected").forEach((link) => {
			link.style.pointerEvents = "auto";
			link.style.color = "black";
		});
	} else {
		// إخفاء الروابط المحمية إذا لم يكن مسجل الدخول
		document.querySelectorAll(".protected").forEach((link) => {
			link.style.pointerEvents = "none";
			link.style.color = "gray";
		});
		content.style.display = "none"; // إخفاء المحتوى
	}
});

// دالة تسجيل الخروج
function logout() {
	localStorage.removeItem("isLoggedIn");
	localStorage.removeItem("userName");
	window.location.href = "index.html";
}

// حفظ بيانات المستخدم عند إنشاء حساب بنجاح
function onRegisterSuccess(userName) {
	localStorage.setItem("isLoggedIn", "true");
	localStorage.setItem("userName", userName);
	window.location.href = "login.html"; // العودة إلى الصفحة الرئيسية بعد التسجيل
}

// دالة التحقق من التسجيل
// دالة التحقق من المدخلات في إنشاء الحساب
function validateRegister() {
	let isValid = true;

	// جمع المدخلات من النموذج
	const firstName = document.getElementById("firstName");
	const lastName = document.getElementById("lastName");
	const email = document.getElementById("email");
	const password = document.getElementById("password");
	const confirmPassword = document.getElementById("confirmPassword");

	// استرجاع رسائل الخطأ لكل حقل
	const firstNameError = document.getElementById("firstNameError");
	const lastNameError = document.getElementById("lastNameError");
	const emailError = document.getElementById("emailError");
	const passwordError = document.getElementById("passwordError");
	const confirmPasswordError = document.getElementById("confirmPasswordError");

	// إعادة تعيين رسائل الخطأ
	firstNameError.style.display = "none";
	lastNameError.style.display = "none";
	emailError.style.display = "none";
	passwordError.style.display = "none";
	confirmPasswordError.style.display = "none";

	// التحقق من صحة حقل الاسم الأول
	firstName.addEventListener("input", () => {
		if (firstName.value.trim() === "" || firstName.value.length > 8) {
			firstNameError.style.display = "block";
		} else {
			firstNameError.style.display = "none";
		}
	});

	if (firstName.value.trim() === "" || firstName.value.length > 8) {
		firstNameError.style.display = "block";
		isValid = false;
	}
	// التحقق من صحة حقل الاسم الثاني
	lastName.addEventListener("input", () => {
		if (lastName.value.trim() === "" || lastName.value.length > 8) {
			lastNameError.style.display = "block";
		} else {
			lastNameError.style.display = "none";
		}
	});

	if (lastName.value.trim() === "" || lastName.value.length > 8) {
		lastNameError.style.display = "block";
		isValid = false;
	}

	// التحقق من صحة البريد الإلكتروني
	email.addEventListener("input", () => {
		if (email.value.trim() === "") {
			emailError.style.display = "block";
		} else {
			emailError.style.display = "none";
		}
	});

	if (email.value.trim() === "") {
		emailError.style.display = "block";
		isValid = false;
	}

	// التحقق من صحة كلمة المرور
	password.addEventListener("input", () => {
		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
		if (!passwordRegex.test(password.value)) {
			passwordError.style.display = "block";
		} else {
			passwordError.style.display = "none";
		}
	});

	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	if (!passwordRegex.test(password.value)) {
		passwordError.style.display = "block";
		isValid = false;
	}
	// التحقق من تطابق كلمة المرور
	confirmPassword.addEventListener("input", () => {
		if (password.value !== confirmPassword.value) {
			confirmPasswordError.style.display = "block";
		} else {
			confirmPasswordError.style.display = "none";
		}
	});

	if (password.value !== confirmPassword.value) {
		confirmPasswordError.style.display = "block";
		isValid = false;
	}

	// إذا كانت المدخلات صحيحة
	if (isValid) {
		localStorage.setItem("userFirstName", firstName.value);

		localStorage.setItem("userEmail", email.value); // حفظ البريد الإلكتروني في localStorage
		localStorage.setItem("userPassword", password.value); // حفظ كلمة المرور في localStorage
		onRegisterSuccess(firstName.value); // استدعاء دالة النجاح وتمرير الاسم الأول
	}
}
// دالة لتسجيل الدخول والتحقق من البيانات
document
	.getElementById("loginForm")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // منع إرسال النموذج بشكل افتراضي

		const email = document.getElementById("loginEmail").value;
		const password = document.getElementById("loginPassword").value;
		const storedFirstName = localStorage.getItem("userFirstName");
		const storedEmail = localStorage.getItem("userEmail"); // يجب تخزين البريد الإلكتروني عند إنشاء الحساب
		const storedPassword = localStorage.getItem("userPassword"); // يجب تخزين كلمة المرور عند إنشاء الحساب

		const loginError = document.getElementById("loginError");

		// تحقق من البريد الإلكتروني وكلمة المرور
		if (email === storedEmail && password === storedPassword) {
			// إذا كانت البيانات صحيحة
			localStorage.setItem("isLoggedIn", "true");
			localStorage.setItem("userName", storedFirstName); // يمكنك تخزين الاسم بدلاً من البريد إذا كنت تفضّل
			window.location.href = "index.html"; // إعادة التوجيه إلى الصفحة الرئيسية
		} else {
			// إذا كانت البيانات غير صحيحة
			loginError.style.display = "block";
		}
	});
