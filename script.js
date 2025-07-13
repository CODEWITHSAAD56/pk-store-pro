
let registeredEmails = [];
let currentUserType = "login"; // Default user type

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    if (!registeredEmails.includes(email)) {
        alert('Email not registered. Please signup first.');
        return false;
    }
    currentUserType = "login";
    window.location.href = "dashboard.html";
    return false;
}

function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signupEmail').value;
    if (registeredEmails.includes(email)) {
        alert('This email is already registered.');
        return false;
    }
    registeredEmails.push(email);
    currentUserType = "signup";
    window.location.href = "dashboard.html";
    return false;
}

window.onload = function() {
    const homeWelcome = document.getElementById('homeWelcomeText');
    if (homeWelcome) {
        if (currentUserType === "signup") {
            homeWelcome.textContent = "WELCOME TO PK INTERNATIONAL STORE";
        } else {
            homeWelcome.textContent = "WELCOME BACK TO STORE";
        }
    }
};

function logout() {
    window.location.href = "index.html";
}

function toggleSubMenu(id) {
    const allSubMenus = document.querySelectorAll('.submenu');
    allSubMenus.forEach(submenu => {
        if (submenu.id !== id) {
            submenu.style.display = "none";
        }
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
        if (item.textContent.toLowerCase().includes(input)) {
            item.classList.add('highlight');
        } else {
            item.classList.remove('highlight');
        }
    });
}
