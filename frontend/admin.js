import { db, auth } from "./firebase-config.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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

// Lead System Elements
const leadsSection = document.getElementById("leadsSection");
const leadsTableBody = document.getElementById("adminLeadsList");
const adminNavItems = document.querySelectorAll(".admin-nav-item");
const refreshLeadsBtn = document.getElementById("refreshLeadsBtn");

// State
let properties = [];
let leads = [];
let uploadWidget;

// ==========================================
// 1. AUTHENTICATION & STATE MANAGEMENT
// ==========================================

function isAdminLoggedIn() {
    return auth.currentUser !== null;
}

// Check auth state from Firebase
function checkAuthState(user) {
    // Hide all sections initially
    [loginSection, dashboardSection, leadsSection].forEach(sec => sec.classList.remove("active"));

    if (user) {
        // User is logged in
        dashboardSection.classList.add("active");
        logoutBtn.style.display = "block";
        adminNavItems.forEach(item => item.style.display = ""); // Show nav items

        // Load data
        fetchProperties();
    } else {
        // User is logged out
        loginSection.classList.add("active");
        logoutBtn.style.display = "none";
        adminNavItems.forEach(item => item.style.display = "none"); // Hide nav items
        properties = [];
        leads = [];
    }
}

onAuthStateChanged(auth, (user) => {
    checkAuthState(user);
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginError.textContent = "";
    } catch (error) {
        loginError.textContent = "Invalid Credentials. Please try again.";
        console.error("Login error:", error);
    }
});

logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        properties = [];
        leads = [];
        // No need to reload, onAuthStateChanged will handle UI changes
    } catch (error) {
        console.error("Logout error:", error);
    }
});

// Admin Navigation (Tab Switching)
adminNavItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetSectionId = item.dataset.section;

        // Toggle Active Class in Nav
        adminNavItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        // Toggle Sections
        [dashboardSection, leadsSection].forEach(sec => sec.classList.remove("active"));
        document.getElementById(targetSectionId).classList.add("active");

        if (targetSectionId === "leadsSection") {
            fetchLeads();
        } else {
            fetchProperties();
        }
    });
});

// ==========================================
// 2. FIRESTORE CRUD OPERATIONS
// ==========================================
async function fetchProperties() {
    if (!isAdminLoggedIn()) {
        console.warn("Unauthorized access blocked");
        return;
    }
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

// ==========================================
// 5. LEAD MANAGEMENT
// ==========================================
async function fetchLeads() {
    if (!isAdminLoggedIn()) {
        console.warn("Unauthorized access blocked");
        return;
    }
    try {
        leadsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Loading leads...</td></tr>`;
        const querySnapshot = await getDocs(collection(db, "leads"));
        leads = [];
        querySnapshot.forEach((doc) => {
            leads.push({ id: doc.id, ...doc.data() });
        });

        // Sort by timestamp descending
        leads.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

        renderLeadsTable();
    } catch (err) {
        console.error("Error fetching leads:", err);
        leadsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error loading leads.</td></tr>`;
    }
}

function renderLeadsTable() {
    leadsTableBody.innerHTML = "";
    if (leads.length === 0) {
        leadsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No leads found.</td></tr>`;
        return;
    }

    leads.forEach((l) => {
        const date = l.timestamp ? new Date(l.timestamp.seconds * 1000).toLocaleString() : "N/A";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${date}</td>
            <td><strong>${l.phone}</strong></td>
            <td>${l.propertyName || "Unknown"}</td>
            <td><span class="status-badge status-${l.status.toLowerCase()}">${l.status}</span></td>
            <td>
                <select class="status-select" data-id="${l.id}">
                    <option value="New" ${l.status === 'New' ? 'selected' : ''}>New</option>
                    <option value="Contacted" ${l.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                    <option value="Closed" ${l.status === 'Closed' ? 'selected' : ''}>Closed</option>
                </select>
                <button class="action-btn delete-lead-btn" data-id="${l.id}">Delete</button>
            </td>
        `;
        leadsTableBody.appendChild(tr);
    });

    // Attach Lead Events
    document.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", (e) => updateLeadStatus(e.target.dataset.id, e.target.value));
    });

    document.querySelectorAll(".delete-lead-btn").forEach(btn => {
        btn.addEventListener("click", () => deleteLead(btn.dataset.id));
    });
}

async function updateLeadStatus(id, newStatus) {
    try {
        await updateDoc(doc(db, "leads", id), { status: newStatus });
        fetchLeads();
    } catch (err) {
        alert("Error updating lead status.");
        console.error(err);
    }
}

async function deleteLead(id) {
    if (confirm("Delete this lead permanently?")) {
        try {
            await deleteDoc(doc(db, "leads", id));
            fetchLeads();
        } catch (err) {
            alert("Error deleting lead.");
            console.error(err);
        }
    }
}

if (refreshLeadsBtn) {
    refreshLeadsBtn.addEventListener("click", fetchLeads);
}
