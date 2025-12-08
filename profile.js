// ✅ Protect Profile Page
const loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) {
    window.location.href = "home.html";
}

// ✅ Display Logged-in Email
document.getElementById("profileEmail").textContent = loggedInUser;

// ✅ UNIQUE KEYS PER USER
const PROFILE_PIC_KEY = "profilePic_" + loggedInUser;
const USERNAME_KEY = "username_" + loggedInUser;
const BIO_KEY = "bio_" + loggedInUser;
const BIRTHDAY_KEY = "birthday_" + loggedInUser;
// ✅ NEW: Key for recent photos list
const RECENT_PHOTOS_KEY = "recentPhotos_" + loggedInUser;

// ✅ Load Profile Picture (per user)
const savedImage = localStorage.getItem(PROFILE_PIC_KEY);
if (savedImage) {
    document.getElementById("profileImage").src = savedImage;
}

// ✅ NEW: Load Recent Photos on Startup
loadRecentPhotos();

// ✅ Upload & Save Profile Picture (per user)
document.getElementById("uploadPic").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    // ✅ 2MB FILE SIZE LIMIT
    if (file.size > 2 * 1024 * 1024) {
        alert("File too large! Maximum size is 2MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const newImageData = reader.result;

        // --- START NEW LOGIC: SAVE TO HISTORY ---
        
        // 1. Get the CURRENT saved image (before we overwrite it)
        const currentSavedImage = localStorage.getItem(PROFILE_PIC_KEY);

        // 2. If there was an old image, add it to the history list
        if (currentSavedImage) {
            saveToHistory(currentSavedImage);
        }
        
        // --- END NEW LOGIC ---

        // 3. Set and Save the NEW image
        document.getElementById("profileImage").src = newImageData;
        localStorage.setItem(PROFILE_PIC_KEY, newImageData);
    };
    reader.readAsDataURL(file);
});

// ✅ NEW: Function to Save Old Image to History Array
function saveToHistory(oldImageData) {
    // Get existing history or empty array
    let history = JSON.parse(localStorage.getItem(RECENT_PHOTOS_KEY)) || [];

    // Add new "old" image to the beginning of the array
    history.unshift(oldImageData);

    // LIMIT STORAGE: Keep only the last 3 photos to prevent "Quota Exceeded" errors
    if (history.length > 3) {
        history.pop(); // Remove the oldest one
    }

    // Save back to local storage
    localStorage.setItem(RECENT_PHOTOS_KEY, JSON.stringify(history));

    // Refresh the display
    loadRecentPhotos();
}

// ✅ NEW: Function to Display Recent Photos
function loadRecentPhotos() {
    const container = document.getElementById("recentPhotos");
    const history = JSON.parse(localStorage.getItem(RECENT_PHOTOS_KEY)) || [];

    // Clear current display
    container.innerHTML = "";

    if (history.length === 0) {
        container.innerHTML = "<p>No recent photos.</p>";
        return;
    }

    // Loop through history and create images
    history.forEach((imgData) => {
        const img = document.createElement("img");
        img.src = imgData;
        img.className = "recent-img-item"; // Class for styling
        img.style.width = "80px";
        img.style.height = "80px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "50%";
        img.style.margin = "5px";
        img.style.border = "2px solid #ccc";
        img.style.cursor = "pointer";

        // Optional: Click a recent photo to restore it
        img.onclick = function() {
            if(confirm("Restore this photo as your profile picture?")) {
                document.getElementById("profileImage").src = imgData;
                localStorage.setItem(PROFILE_PIC_KEY, imgData);
            }
        };

        container.appendChild(img);
    });
}

// ✅ NEW: Clear History Function
document.getElementById("clearHistoryBtn").addEventListener("click", () => {
    localStorage.removeItem(RECENT_PHOTOS_KEY);
    loadRecentPhotos(); // Refresh UI
});

// ✅ Logout Function
function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("rememberedUser");
    window.location.href = "landing.html";
}

// ✅ LOAD PROFILE DATA (PER USER)
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("displayUsername").textContent =
        localStorage.getItem(USERNAME_KEY) || "Not set";

    document.getElementById("displayBio").textContent =
        localStorage.getItem(BIO_KEY) || "Not set";

    document.getElementById("displayBirthday").textContent =
        localStorage.getItem(BIRTHDAY_KEY) || "Not set";
});

// ✅ TOGGLE EDIT FORM
document.getElementById("editProfileBtn").addEventListener("click", () => {
    document.getElementById("editProfileForm").style.display = "block";

    document.getElementById("usernameInput").value =
        localStorage.getItem(USERNAME_KEY) || "";

    document.getElementById("bioInput").value =
        localStorage.getItem(BIO_KEY) || "";

    document.getElementById("birthdayInput").value =
        localStorage.getItem(BIRTHDAY_KEY) || "";
});

// ✅ SAVE PROFILE DATA (PER USER)
function saveProfile() {
    const username = document.getElementById("usernameInput").value;
    const bio = document.getElementById("bioInput").value;
    const birthday = document.getElementById("birthdayInput").value;

    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(BIO_KEY, bio);
    localStorage.setItem(BIRTHDAY_KEY, birthday);

    document.getElementById("displayUsername").textContent = username;
    document.getElementById("displayBio").textContent = bio;
    document.getElementById("displayBirthday").textContent = birthday;

    document.getElementById("editProfileForm").style.display = "none";
}