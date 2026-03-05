// ===== DATA =====
import { db } from "./firebase-config.js";
import { collection, getDocs } from "firebase/firestore";

let properties = [
  {
    title: "Creative Workspace",
    price: 320000,
    location: "Sector 83A",
    city: "Mohali",
    image: "images/office1.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "5000 sqft",
    washrooms: "2",
    description: "Office space available in prime location"
  },
  {
    title: "Modern Office",
    price: 480000,
    location: "Sector 67",
    city: "Mohali",
    image: "images/offiice2.jpeg",
    furnishing: "Furnished",
    listed: "Dealer",
    area: "8000 sqft",
    washrooms: "2",
    description: "Fully furnished office in IT Park"
  },
  {
    title: "Creative Workspace",
    price: 650000,
    location: "Sector 74",
    city: "Mohali",
    image: "images/office3.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "12000 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 55000,
    location: "Industrial Area Phase 8B",
    city: "Mohali",
    image: "images/office5.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "1000 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 90000,
    location: "Industrial Area Phase 7",
    city: "Mohali",
    image: "images/office6.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "1500 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 350000,
    location: "Industrial Area Phase 8A",
    city: "Mohali",
    image: "images/office7.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "5000 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 135000,
    location: "Creative Workspace",
    city: "Chandigarh",
    image: "images/office8.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "1500 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 240000,
    location: "IT Park Chandigarh",
    city: "Chandigarh",
    image: "images/office9.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "3000 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 120000,
    location: "Sector 7 (Madhya Marg)",
    city: "Chandigarh",
    image: "images/office10.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "900 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 100000,
    location: "Sector8 (Madhya Marg)",
    city: "Chandigarh",
    image: "images/office11.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "800 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 100000,
    location: "Sector8 (Madhya Marg)",
    city: "Chandigarh",
    image: "images/office12.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "800 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 150000,
    location: "Sector8",
    city: "Chandigarh",
    image: "images/office13.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "1200 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 75000,
    location: "Industrial Area Phase 8B",
    city: "Mohali",
    image: "images/officeX.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "1200 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 40000,
    location: "Sector 9",
    city: "Chandigarh",
    image: "images/office14.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "350 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 108000,
    location: "Sector 17C",
    city: "Chandigarh",
    image: "images/office15.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "800 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 28000,
    location: "Sector 34A",
    city: "Chandigarh",
    image: "images/office16.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "250 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 144000,
    location: "Sector 34A",
    city: "Chandigarh",
    image: "images/office17.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "1200 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 170000,
    location: "Sector 34C",
    city: "Chandigarh",
    image: "images/office18.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "1500 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 180000,
    location: "Sector 35C",
    city: "Chandigarh",
    image: "images/office19.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "1500 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 100000,
    location: "Sector 40",
    city: "Chandigarh",
    image: "images/office20.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "900 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 60000,
    location: "Sector 47",
    city: "Chandigarh",
    image: "images/office21.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "500 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 240000,
    location: "Sector 74(Phase 8)",
    city: "Mohali",
    image: "images/office22.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "4000 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Meeting Room",
    price: 125000,
    location: "Sector 75",
    city: "Mohali",
    image: "images/office23.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "2500 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Creative Workspace",
    price: 450000,
    location: "Sector 83A",
    city: "Mohali",
    image: "images/office24.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "7000 sqft",
    washrooms: "2",
    description: "Premium office space"
  }, {
    title: "Executive Office Suite",
    price: 540000,
    location: "Sector 101A",
    city: "Mohali",
    image: "images/office25.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "9000 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Executive Office Suite",
    price: 155000,
    location: "Sector 17C",
    city: "Chandigarh",
    image: "images/office22.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "1000 sqft",
    washrooms: "2",
    description: "Premium office space"
  },
  {
    title: "Warehouse",
    price: 2000000,
    location: "Tepla Road",
    city: "Mohali",
    image: "images/wrhs1.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "100000 sqft",
    washrooms: "",
    description: "Warehouse on Rent or Lease"
  },
  {
    title: "Warehouse",
    price: 100000,
    location: "Tepla Road",
    city: "Mohali",
    image: "images/wrhs2.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "50000 sqft",
    washrooms: "",
    description: "Warehouse on Rent or Lease"
  },
  {
    title: "Co-Working Space",
    price: 55000,
    location: "Sector 74",
    city: "Mohali",
    image: "images/coworking.jpeg",
    furnishing: "Furnished",
    listed: "Owner",
    area: "10 Seatings",
    washrooms: "1",
    description: "Affordable co-working space"
  }
];


// ===== CREATE CARD =====
function createCard(p) {
  return `
    <div class="card"
      data-city="${p.city}"
      data-furnishing="${p.furnishing}"
      data-listed="${p.listed}"
      data-area="${p.area}"
      data-washrooms="${p.washrooms}"
      data-description="${p.description}">

      <div class="property-image">
        <img src="${p.image}" loading="lazy" alt="Property">
        <div class="overlay">
          <button class="view-btn">View Details</button>
        </div>
      </div>

      <div class="card-body">
        <h3>${p.title}</h3>
        <p class="price">₹${p.price.toLocaleString()} / month</p>
        <p class="location">${p.location}</p>
      </div>
    </div>
  `;
}


// ===== RENDER =====
function renderProperties(data = properties) {
  const container = document.getElementById("cardsContainer");

  if (data.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>No properties found</p>";
    return;
  }

  container.innerHTML = data.map(createCard).join("");
}


// ===== FILTER =====
window.filterProperties = function () {
  const searchInput = document.querySelector('.search-box input[type="text"]');
  const searchText = searchInput ? searchInput.value.toLowerCase() : "";
  const budgetRange = document.getElementById("budgetRange");
  const maxBudget = budgetRange ? parseInt(budgetRange.value) : Infinity;

  const activeBtn = document.querySelector(".filter-buttons .active");
  const selectedCity = activeBtn ? activeBtn.innerText.toLowerCase() : "all";

  const filtered = properties.filter(p => {
    const matchCity = selectedCity === "all" || p.city.toLowerCase() === selectedCity;
    const matchBudget = Number(p.price) <= maxBudget;
    const matchSearch = p.location.toLowerCase().includes(searchText);

    return matchCity && matchBudget && matchSearch;
  });

  renderProperties(filtered);
}


// ===== CITY FILTER =====
window.filterCity = function (city, btn) {
  document.querySelectorAll(".filter-buttons button")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");

  window.filterProperties();
}


// ===== MODAL (EVENT DELEGATION) =====
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("view-btn")) {

    const card = e.target.closest(".card");

    document.getElementById("modal-title").innerText = card.querySelector("h3").innerText;
    document.getElementById("modal-price").innerText = card.querySelector(".price").innerText;
    document.getElementById("modal-location").innerText = card.querySelector(".location").innerText;

    document.getElementById("modal-furnishing").innerText = card.dataset.furnishing || "N/A";
    document.getElementById("modal-listed").innerText = card.dataset.listed || "N/A";
    document.getElementById("modal-area").innerText = card.dataset.area || "N/A";
    document.getElementById("modal-washrooms").innerText = card.dataset.washrooms || "N/A";
    document.getElementById("modal-description").innerText = card.dataset.description || "N/A";

    document.getElementById("property-modal").style.display = "block";
  }
});


// ===== CLOSE MODAL =====
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("close") || e.target.id === "property-modal") {
    document.getElementById("property-modal").style.display = "none";
  }
});


// ===== SLIDER =====
const range = document.getElementById("budgetRange");
const value = document.getElementById("budgetValue");

if (range && value) {
  range.addEventListener("input", () => {
    value.textContent = range.value;
    window.filterProperties();
  });
}

// ===== LIVE SEARCH =====
const searchInputEl = document.querySelector('.search-box input[type="text"]');
if (searchInputEl) {
  searchInputEl.addEventListener("input", window.filterProperties);
}


// ===== INIT =====
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const snapshot = await getDocs(collection(db, "properties"));
    const fetched = [];
    snapshot.forEach(doc => fetched.push({ id: doc.id, ...doc.data() }));
    if (fetched.length > 0) properties = [...fetched, ...properties];
  } catch (err) {
    console.warn("Firebase config not set or query failed. Using fallback array.", err);
  } finally {
    renderProperties();
    const defaultCity = document.getElementById("defaultCity");
    if (defaultCity) defaultCity.click();
  }
});

// ===== VIEW ALL LISTINGS BUTTON =====
const viewAllBtn = document.getElementById("viewAllBtn");
if (viewAllBtn) {
  viewAllBtn.addEventListener("click", () => {
    document.querySelectorAll(".filter-buttons button").forEach(b => b.classList.remove("active"));
    renderProperties(properties);
    document.getElementById("cardsContainer").scrollIntoView({ behavior: 'smooth' });
  });
}

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });
}