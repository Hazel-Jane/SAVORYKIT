// ✅ Protect Profile Page
const loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) {
    window.location.href = "home.html";
}

// ✅ Display Logged-in Email
document.getElementById("profileEmail").textContent = loggedInUser;

// ✅ Load Profile Picture (if exists)
const savedImage = localStorage.getItem("profilePic_" + loggedInUser);
if (savedImage) {
    document.getElementById("profileImage").src = savedImage;
}

// ✅ Upload & Save Profile Picture
document.getElementById("uploadPic").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
        const imageData = reader.result;
        document.getElementById("profileImage").src = imageData;
        localStorage.setItem("profilePic_" + loggedInUser, imageData);
    };
    reader.readAsDataURL(file);
});

// ✅ Logout Function
function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("rememberedUser");
    window.location.href = "hs.html";
}
