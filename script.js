// Initialize Firebase v8
(function(){
  const cfg = window.__FIREBASE_CONFIG__;
  if (!firebase.apps.length) firebase.initializeApp(cfg);
  window.db = firebase.database();
})();

// ---- AUTH (simple DB-based) ----
function handleSignup(e){
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;

  db.ref('users').orderByChild('email').equalTo(email).once('value', snap=>{
    if(snap.exists()){ alert('This email is already registered.'); return; }
    const user = { name, email, password, createdAt: new Date().toISOString() };
    db.ref('users').push(user).then(()=>{
      localStorage.setItem('currentUser', JSON.stringify(user));
      location.href='dashboard.html';
    });
  });
}

function handleLogin(e){
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  db.ref('users').orderByChild('email').equalTo(email).once('value', snap=>{
    if(!snap.exists()){ alert('Email not registered.'); return; }
    let ok=false; snap.forEach(ch=>{ const u=ch.val(); if(u.password===password){ ok=true; localStorage.setItem('currentUser', JSON.stringify(u)); } });
    if(ok){ location.href='dashboard.html'; } else { alert('Invalid password.'); }
  });
}

// Attach on load
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  if (signupForm) signupForm.addEventListener('submit', handleSignup);

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // Dashboard boot
  if (document.querySelector('.dashboard')) {
    bootDashboard();
  }
});

// ---- DASHBOARD ----
function bootDashboard(){
  // Welcome
  const userStr = localStorage.getItem('currentUser');
  const homeWelcome = document.getElementById('homeWelcomeText');
  const welcomeText = document.getElementById('welcomeText');
  if(userStr){
    const u = JSON.parse(userStr);
    if (homeWelcome) homeWelcome.textContent = 'WELCOME BACK, ' + (u.name||'User').toUpperCase();
    if (welcomeText) welcomeText.textContent = 'Welcome, ' + (u.name||'User');
  }

  // Sidebar events: rotate arrow + toggle submenu + show content
  window.toggleSubMenu = function(id, li){
    // close others
    document.querySelectorAll('.submenu').forEach(sm => { if (sm.id !== id) sm.style.display='none'; });
    document.querySelectorAll('.menu-root>li').forEach(item => item.classList.remove('active'));

    // toggle this
    const sm = document.getElementById(id);
    if(!sm) return;
    const isOpen = sm.style.display==='block';
    sm.style.display = isOpen ? 'none' : 'block';
    if(li){ li.classList.toggle('active', !isOpen); }
  };

  window.showContent = function(id){
    document.querySelectorAll('.content-section').forEach(s=>s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
  };

  window.setActive = function(li){
    document.querySelectorAll('.menu-root>li').forEach(item => item.classList.remove('active'));
    const parentLi = li.closest('ul').previousElementSibling;
    if (parentLi && parentLi.tagName==='LI') parentLi.classList.add('active');
  };

  // Search highlight
  window.searchSidebar = function (){
    const q = (document.getElementById('sidebarSearch').value||'').toLowerCase();
    document.querySelectorAll('.sidebar li').forEach(li=>{
      li.classList.toggle('highlight', li.textContent.toLowerCase().includes(q) && q.length>0);
    });
  };

  // Logout
  window.logout = function(){
    localStorage.removeItem('currentUser');
    location.href='index.html';
  };

  // Product upload
  const productForm = document.getElementById('productForm');
  if(productForm){
    productForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('productName').value.trim();
      const price = document.getElementById('productPrice').value.trim();
      const description = document.getElementById('productDescription').value.trim();
      if(!name||!price||!description){ alert('All fields required'); return; }
      const item = { name, price, description, createdAt: new Date().toISOString() };
      db.ref('products').push(item).then(()=>{
        alert('✅ Product uploaded');
        productForm.reset();
      });
    });
  }

  // Live products list
  const productsUl = document.getElementById('productsUl');
  if(productsUl){
    db.ref('products').on('value', snap=>{
      productsUl.innerHTML='';
      snap.forEach(ch=>{
        const p = ch.val();
        const li = document.createElement('li');
        li.textContent = p.name + ' — Rs.' + p.price + ' — ' + p.description;
        productsUl.appendChild(li);
      });
    });
  }

  // Payments
  const paymentForm = document.getElementById('paymentOptionsForm');
  const paymentDetails = document.getElementById('paymentDetails');
  if(paymentForm){
    paymentForm.addEventListener('submit', function(e){
      e.preventDefault();
      const selected = document.querySelector("input[name='paymentMethod']:checked").value;
      if(selected==='JazzCash'){
        paymentDetails.innerHTML = '<p><b>JazzCash Number:</b> 0300-XXXXXXX</p><p><b>Account Title:</b> PK International</p><p>Share receipt on <a target="_blank" href="https://wa.me/923001234567">WhatsApp</a></p>';
      }else if(selected==='EasyPaisa'){
        paymentDetails.innerHTML = '<p><b>EasyPaisa Number:</b> 0345-XXXXXXX</p><p><b>Account Title:</b> PK International</p><p>Share receipt on <a target="_blank" href="https://wa.me/923001234567">WhatsApp</a></p>';
      }else{
        window.open('https://buy.stripe.com/test_123456789','_blank');
      }
      const key = 'pay-' + Date.now();
      db.ref('payments/'+key).set({method:selected, at:new Date().toISOString()});
    });
  }
}
