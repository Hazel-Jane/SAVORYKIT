let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
menuIcon.classList.toggle('bx-x'); 
 navbar.classList.toggle('active'); 
};

let navLinks = document.querySelectorAll('.navbar a');

navLinks.forEach(link => {
 link.addEventListener('click', () => {
 menuIcon.classList.remove('bx-x');
 navbar.classList.remove('active');
 });
});

window.addEventListener('scroll', () => {
 let header = document.querySelector('.header');
 header.classList.toggle('sticky', window.scrollY > 50);
});

// Function to toggle the visibility of the login/signup buttons
function toggleAuthButtons() {
const getStartedButton = document.getElementById('get-started-btn');
const authButtonsContainer = document.getElementById('auth-buttons');

 getStartedButton.addEventListener('click', function() {
 const isVisible = authButtonsContainer.classList.contains('show');

 authButtonsContainer.classList.toggle('show');
 if (isVisible) {
 getStartedButton.textContent = 'Get Started';
 } else {
 getStartedButton.textContent = 'Hide Options';
 }
});
}
document.addEventListener('DOMContentLoaded', toggleAuthButtons);

/*--------------- Form Handling --------------*/


const formOpenBtn = document.querySelector(".login-btn"); 
const formContainer = document.querySelector(".form_container");
const formCloseBtn = document.querySelector(".form_close");
const signupLink = document.querySelector(".login_form .signup-link"); 
const loginLink = document.querySelector(".signup_form .login-link");   
const pwShowHide = document.querySelectorAll(".pw_hide");


// Open the form on 'Login' button click 
if (formOpenBtn) {
    formOpenBtn.addEventListener("click", (e) => {
        e.preventDefault();
        formContainer.style.opacity = '1';
        formContainer.style.pointerEvents = 'auto';
        formContainer.style.transform = 'translate(-50%, -50%) scale(1)';
        formContainer.classList.remove("active"); 
    });
}


// Close the form on 'X' button click (No change here)
if (formCloseBtn) {
    formCloseBtn.addEventListener("click", () => {
        formContainer.style.opacity = '0';
        formContainer.style.pointerEvents = 'none';
        formContainer.style.transform = 'translate(-50%, -50%) scale(1.2)';
    });
}


// Toggle to Signup form
if (signupLink) {
    signupLink.addEventListener("click", (e) => {
        e.preventDefault(); 
        formContainer.classList.add("active"); 
    });
}

// Toggle back to Login form
if (loginLink) {
    loginLink.addEventListener("click", (e) => {
        e.preventDefault(); 
        formContainer.classList.remove("active"); 
    });
};


// Password Show/Hide Toggle 
pwShowHide.forEach(icon => {
icon.addEventListener("click", () =>  {
 let getPwInput = icon.parentElement.querySelector("input");
 if (getPwInput.type === "password") {
getPwInput.type = "text";
icon.classList.replace("uil-eye-slash", "uil-eye");
 } else {
 getPwInput.type = "password";
 icon.classList.replace("uil-eye", "uil-eye-slash");
 }
 });
 });


// SIGNUP SYSTEM
document.getElementById("popup-signup-btn").addEventListener("click", function () {
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirm").value;

    if (!email || !password || !confirmPassword) {
        alert("All fields are required!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert("This email is already registered!");
        return;
    }

    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", email);
    alert("Account created successfully!");
    window.location.href = "homies.html";
});



// LOGIN SYSTEM
document.getElementById("popup-login-btn").addEventListener("click", function () {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const rememberMe = document.getElementById("check").checked;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(user => user.email === email && user.password === password);

    if (!validUser) {
        alert("Invalid email or password!");
        return;
    }
    localStorage.setItem("loggedInUser", email);

    if (rememberMe) {
        localStorage.setItem("rememberedUser", email);
    } else {
        localStorage.removeItem("rememberedUser");
    }

    window.location.href = "homies.html";
});



// AUTO LOGIN 
window.addEventListener("DOMContentLoaded", function () {
    const rememberedUser = localStorage.getItem("rememberedUser");

    if (rememberedUser) {
        window.location.href = "homies.html";
    }
});