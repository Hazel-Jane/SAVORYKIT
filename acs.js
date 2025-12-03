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

/*--------------- Form Handling Fixes --------------*/


const formOpenBtn = document.querySelector(".login-btn"); 
const formContainer = document.querySelector(".form_container");
const formCloseBtn = document.querySelector(".form_close");
const signupLink = document.querySelector(".login_form .signup-link"); 
const loginLink = document.querySelector(".signup_form .login-link");   
const pwShowHide = document.querySelectorAll(".pw_hide");


// 1. Open the form on 'Login' button click (No change here)
if (formOpenBtn) {
    formOpenBtn.addEventListener("click", (e) => {
        e.preventDefault();
        formContainer.style.opacity = '1';
        formContainer.style.pointerEvents = 'auto';
        formContainer.style.transform = 'translate(-50%, -50%) scale(1)';
        formContainer.classList.remove("active"); 
    });
}


// 2. Close the form on 'X' button click (No change here)
if (formCloseBtn) {
    formCloseBtn.addEventListener("click", () => {
        formContainer.style.opacity = '0';
        formContainer.style.pointerEvents = 'none';
        formContainer.style.transform = 'translate(-50%, -50%) scale(1.2)';
    });
}


// 3. Toggle to Signup form
if (signupLink) {
    signupLink.addEventListener("click", (e) => {
        e.preventDefault(); 
        formContainer.classList.add("active"); 
    });
}

// 4. Toggle back to Login form
if (loginLink) {
    loginLink.addEventListener("click", (e) => {
        e.preventDefault(); // 
        formContainer.classList.remove("active"); 
    });
}


// 5. Password Show/Hide Toggle 
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

//  6. Navigation Fix for Popup Login Button
const popupLoginBtn = document.getElementById('popup-login-btn');

if (popupLoginBtn) {
    popupLoginBtn.addEventListener('click', () => {
        window.location.href = "home.html"; 
    });
}

// 7. Password Matching and Direct Navigation Fix for Popup Signup Button
const popupSignupBtn = document.getElementById('popup-signup-btn');

if (popupSignupBtn) {
    popupSignupBtn.addEventListener('click', () => {
        // 1. Get the password and confirm password inputs
        const signupForm = popupSignupBtn.closest('.signup_form');
        
        // Find inputs by placeholder or other unique identifier if necessary
        const createPasswordInput = signupForm.querySelector('input[placeholder="Create password"]');
        const confirmPasswordInput = signupForm.querySelector('input[placeholder="Confirm password"]');

        if (!createPasswordInput || !confirmPasswordInput) {
             console.error("Could not find password inputs.");
             return; // Stop if inputs aren't found
        }
        
        const createPassword = createPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // 2. Check if the passwords match
        if (createPassword !== confirmPassword) {
           
            alert("The password and confirm password fields do not match. Please try again.");
             
            confirmPasswordInput.value = '';
           
            return; 
        }

        // 3. If they match, proceed DIRECTLY to the homepage (No alert shown)
        window.location.href = "home.html"; 
    });
}
});