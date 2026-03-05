// Firebase imports kept for Firestore CRUD, but Auth is removed
import { db } from "./firebase-config.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// UI Elements
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");

const propertiesTableBody = document.getElementById("adminPropertiesList");
const addPropertyBtn = document.getElementById("addPropertyBtn");
const propertyModal = document.getElementById("propertyAdminModal");
const propertyForm = document.getElementById("propertyForm");
const modalClose = document.querySelector(".close-admin-modal");
const cancelBtn = document.getElementById("cancelBtn");

// State
let properties = [];
let uploadWidget;

// ==========================================
// 1. AUTHENTICATION & STATE MANAGEMENT
// ==========================================

// Check localStorage on load
function checkAuthState() {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (isLoggedIn) {
        // User is logged in
        loginSection.classList.remove("active");
        dashboardSection.classList.add("active");
        logoutBtn.style.display = "block";

        // Load data
        fetchProperties();
    } else {
        // User is logged out
        loginSection.classList.add("active");
        dashboardSection.classList.remove("active");
        logoutBtn.style.display = "none";
    }
}

// Initial Check
checkAuthState();

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Hardcoded credentials as requested
    if (email === "mukeshattri78@gmail.com" && password === "MkConsultant@1979") {
        loginError.textContent = "";
        localStorage.setItem("adminLoggedIn", "true");
        checkAuthState();
    } else {
        loginError.textContent = "Invalid Credentials. Please try again.";
    }
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminLoggedIn");
    checkAuthState();
});

// ==========================================
// 2. FIRESTORE CRUD OPERATIONS
// ==========================================
async function fetchProperties() {
    try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        properties = [];
        querySnapshot.forEach((doc) => {
            properties.push({ id: doc.id, ...doc.data() });
        });
        renderAdminTable();
    } catch (err) {
        console.error("Error fetching properties:", err);
        // If fails due to config, just show empty table
        renderAdminTable();
    }
}

function renderAdminTable() {
    propertiesTableBody.innerHTML = "";
    if (properties.length === 0) {
        propertiesTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No properties found or Firebase not connected.</td></tr>`;
        return;
    }

    properties.forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td><img src="${p.image || 'images/office1.jpeg'}" class="property-thumb" alt="thumb"></td>
      <td><strong>${p.title}</strong></td>
      <td>${p.location}, ${p.city}</td>
      <td>₹${(p.price || 0).toLocaleString()}</td>
      <td>
        <button class="action-btn edit-btn" data-id="${p.id}">Edit</button>
        <button class="action-btn delete-btn" data-id="${p.id}">Delete</button>
      </td>
    `;
        propertiesTableBody.appendChild(tr);
    });

    // Attach event listeners for edit/delete
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => openEditModal(btn.dataset.id));
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => deleteProperty(btn.dataset.id));
    });
}

// ==========================================
// 3. CLOUDINARY CUSTOM UPLOAD (Direct Device Select)
// ==========================================
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmx6z5lja/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "office_rental_preset"; // Create an "unsigned" preset in Cloudinary Settings -> Upload

document.getElementById("propImageFile").addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById("uploadStatus");
    const previewEl = document.getElementById("imagePreview");
    const hiddenUrlInput = document.getElementById("propImage");
    const saveBtn = document.getElementById("savePropertyBtn");

    try {
        statusEl.textContent = "Uploading to Cloudinary... please wait.";
        statusEl.style.color = "#0056b3";
        previewEl.style.display = "none";
        saveBtn.disabled = true;
        saveBtn.style.opacity = "0.5";
        saveBtn.innerText = "Uploading Image...";

        // Prepare FormData for Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        // API Call
        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.secure_url) {
            // Success
            const downloadURL = data.secure_url;
            hiddenUrlInput.value = downloadURL;
            previewEl.src = downloadURL;
            previewEl.style.display = "block";

            statusEl.textContent = "Upload successful!";
            statusEl.style.color = "green";
            console.log("Image stored in Cloudinary:", downloadURL);
        } else {
            console.error("Cloudinary error response:", data);
            const errMsg = (data.error && data.error.message) ? data.error.message : "Upload failed (status: " + response.status + ")";
            throw new Error(errMsg);
        }

    } catch (error) {
        console.error("Cloudinary Error Logged:", error);
        statusEl.textContent = "Error: " + error.message;
        statusEl.style.color = "red";

        // Detailed troubleshooting for the user
        let alertMsg = "Upload Failed!\n\nReason: " + error.message + "\n\nPlease ensure:\n1. Your Cloudinary Cloud Name is correctly set to 'dmx6z5lja'.\n2. You have an UNSIGNED upload preset named 'office_rental_preset'.\n3. You are connected to the internet.";
        alert(alertMsg);
    } finally {
        saveBtn.disabled = false;
        saveBtn.style.opacity = "1";
        saveBtn.innerText = "Save Property";
    }
});

// MOBILE MENU (Hamburger)
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
}

// ==========================================
// 4. MODAL LOGIC & FORM SUBMISSION
// ==========================================
addPropertyBtn.addEventListener("click", () => {
    propertyForm.reset();
    document.getElementById("editPropertyId").value = "";
    document.getElementById("imagePreview").style.display = "none";
    document.getElementById("imagePreview").src = "";
    document.getElementById("propImage").value = "";
    document.getElementById("uploadStatus").textContent = "";
    document.getElementById("modalTitle").textContent = "Add Property";
    propertyModal.style.display = "block";
});

modalClose.addEventListener("click", () => propertyModal.style.display = "none");
cancelBtn.addEventListener("click", () => propertyModal.style.display = "none");

function openEditModal(id) {
    const p = properties.find(prop => prop.id === id);
    if (!p) return;

    document.getElementById("editPropertyId").value = p.id;
    document.getElementById("propTitle").value = p.title || "";
    document.getElementById("propPrice").value = p.price || "";
    document.getElementById("propLocation").value = p.location || "";
    document.getElementById("propCity").value = p.city || "Chandigarh";
    document.getElementById("propArea").value = p.area || "";
    document.getElementById("propFurnishing").value = p.furnishing || "Furnished";
    document.getElementById("propListed").value = p.listed || "Owner";
    document.getElementById("propWashrooms").value = p.washrooms || "";
    document.getElementById("propDescription").value = p.description || "";

    if (p.image) {
        document.getElementById("propImage").value = p.image;
        document.getElementById("imagePreview").src = p.image;
        document.getElementById("imagePreview").style.display = "block";
    } else {
        document.getElementById("propImage").value = "";
        document.getElementById("imagePreview").style.display = "none";
    }

    document.getElementById("uploadStatus").textContent = "You can upload a new image to replace the current one.";
    document.getElementById("modalTitle").textContent = "Edit Property";
    propertyModal.style.display = "block";
}

propertyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Gather Data
    const propertyData = {
        title: document.getElementById("propTitle").value,
        price: parseInt(document.getElementById("propPrice").value),
        location: document.getElementById("propLocation").value,
        city: document.getElementById("propCity").value,
        area: document.getElementById("propArea").value,
        furnishing: document.getElementById("propFurnishing").value,
        listed: document.getElementById("propListed").value,
        washrooms: document.getElementById("propWashrooms").value,
        description: document.getElementById("propDescription").value,
        image: document.getElementById("propImage").value || "images/office1.jpeg" // fallback image
    };

    const editId = document.getElementById("editPropertyId").value;

    try {
        if (editId) {
            // Update
            const docRef = doc(db, "properties", editId);
            await updateDoc(docRef, propertyData);
        } else {
            // Add
            await addDoc(collection(db, "properties"), propertyData);
        }

        propertyModal.style.display = "none";
        fetchProperties(); // Refresh list
    } catch (err) {
        alert("Error saving property. Make sure Firebase is configured.");
        console.error(err);
    }
});

async function deleteProperty(id) {
    if (confirm("Are you sure you want to delete this property?")) {
        try {
            await deleteDoc(doc(db, "properties", id));
            fetchProperties();
        } catch (err) {
            alert("Error deleting property");
            console.error(err);
        }
    }
}
