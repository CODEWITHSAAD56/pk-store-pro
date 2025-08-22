// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDrhmIcWcS8AhP-41q2OCzGrHteKJCDkUQ",
  authDomain: "database-eade8.firebaseapp.com",
  databaseURL: "https://database-eade8-default-rtdb.asia-southeast1.firebasedatabase.app/",  // ✅ THIS LINE IS REQUIRED
  projectId: "database-eade8",
  storageBucket: "database-eade8.appspot.com",
  messagingSenderId: "338136504463",
  appId: "1:338136504463:web:7f2c217c23d7f6afb7b8fa"
};

// ✅ Initialize Firebase (v8 CDN compatible)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ✅ Signup function
function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  db.ref("users").orderByChild("email").equalTo(email).once("value", snapshot => {
    if (snapshot.exists()) {
      alert("This email is already registered.");
    } else {
      const userData = { name, email, password, createdAt: new Date().toISOString() };
      db.ref("users").push(userData).then(() => {
        localStorage.setItem("currentUser", JSON.stringify(userData));
        alert("Signup successful!");
        window.location.href = "dashboard.html";
      });
    }
  });
}

// ✅ Login function
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  db.ref("users").once("value", snapshot => {
    let found = false;
    snapshot.forEach(child => {
      const user = child.val();
      if (user.email === email && user.password === password) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Login successful!");
        window.location.href = "dashboard.html";
        found = true;
      }
    });
    if (!found) {
      alert("Invalid email or password.");
    }
  });
}

// ✅ Dashboard welcome setup
window.onload = function () {
  const homeWelcome = document.getElementById('homeWelcomeText');
  const userData = localStorage.getItem("currentUser");

  if (homeWelcome && userData) {
    const user = JSON.parse(userData);

    if (user && user.name) {
      homeWelcome.textContent = `WELCOME BACK, ${user.name.toUpperCase()}`;
      const textEl = document.getElementById("welcomeText");
      if (textEl) {
        textEl.textContent = `Welcome, ${user.name}`;
      }
    } else {
      homeWelcome.textContent = "WELCOME BACK!";
    }
  }
};
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

function toggleSubMenu(id) {
  const allSubMenus = document.querySelectorAll('.submenu');
  allSubMenus.forEach(submenu => {
    if (submenu.id !== id) submenu.style.display = "none";
  });
  const submenu = document.getElementById(id);
  submenu.style.display = submenu.style.display === "block" ? "none" : "block";
}

function showContent(section) {
  const homeContent = document.getElementById('homeContent');
  const settingsContent = document.getElementById('settingsContent');
  if (section === 'home') {
    homeContent.style.display = 'block';
    settingsContent.style.display = 'none';
  } else if (section === 'settings') {
    homeContent.style.display = 'none';
    settingsContent.style.display = 'block';
  }
}

function searchSidebar() {
  const input = document.getElementById('sidebarSearch').value.toLowerCase();
  const sidebarItems = document.querySelectorAll('.sidebar li');
  sidebarItems.forEach(item => {
    item.classList.toggle('highlight', item.textContent.toLowerCase().includes(input));
  });
}
//  Product Upload to Firebase
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const description = document.getElementById("productDescription").value;

  const newProduct = {
    name,
    price,
    description,
    createdAt: new Date().toISOString(),
  };

  db.ref("products").push(newProduct).then(() => {
    alert("✅ Product uploaded successfully!");
    document.getElementById("productForm").reset();
  });
});

//  Payment Option Selection
document.getElementById("paymentOptionsForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const selected = document.querySelector("input[name='paymentMethod']:checked").value;
  const detailsDiv = document.getElementById("paymentDetails");

  if (selected === "JazzCash") {
    detailsDiv.innerHTML = `
      <p><strong>JazzCash Number:</strong> 0300-XXXXXXX</p>
      <p><strong>Account Title:</strong> PK International</p>
      <p>Please share screenshot via <a href="https://wa.me/923001234567" target="_blank">WhatsApp</a></p>
    `;
  } else if (selected === "EasyPaisa") {
    detailsDiv.innerHTML = `
      <p><strong>EasyPaisa Number:</strong> 0345-XXXXXXX</p>
      <p><strong>Account Title:</strong> PK International</p>
      <p>Please share screenshot via <a href="https://wa.me/923001234567" target="_blank">WhatsApp</a></p>
    `;
  } else if (selected === "Stripe") {
    window.open("https://buy.stripe.com/test_123456789", "_blank");
  }

  // Optional: Store selected payment method
  const userId = "user-" + Date.now();
  db.ref("payments/" + userId).set({
    method: selected,
    createdAt: new Date().toISOString()
  });
});