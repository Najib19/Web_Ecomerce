// Data produk
const products = [
  {
    id: 1,
    name: 'CANON EOS 1500D Kit Lens 18-55',
    price: 8199000,
    category: 'elektronik',
    image: 'img/kamera.png',
  },
  { id: 2, name: 'Macbook Pro', price: 15000000, category: 'elektronik', image: 'img/laptop.webp' },
  { id: 2, name: 'Handphone', price: 15000000, category: 'elektronik', image: '' },
  { id: 3, name: 'Kemeja Pria', price: 150000, category: 'fashion', image: '' },
  { id: 4, name: 'Sepatu Sneakers', price: 500000, category: 'fashion', image: '' },
  { id: 4, name: 'Baju Wispie', price: 500000, category: 'fashion', image: '' },
  { id: 5, name: 'Kursi Kantor', price: 1200000, category: 'rumah', image: '' },
  { id: 6, name: 'Meja Belajar', price: 800000, category: 'rumah', image: '' },
  { id: 6, name: 'Meja Belajar', price: 800000, category: 'rumah', image: '' },
  { id: 7, name: 'Sepatu Lari', price: 600000, category: 'olahraga', image: '' },
  { id: 8, name: 'Matras Yoga', price: 200000, category: 'olahraga', image: '' },
  { id: 9, name: 'Baju Lari', price: 200000, category: 'olahraga', image: '' },
];

let cart = [];
let currentCategory = 'all';
let currentUser = null;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function () {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUIForLoggedInUser();
  }
  renderProducts();
});

// Format currency
function formatPrice(price) {
  return 'Rp ' + price.toLocaleString('id-ID');
}

// Render products
function renderProducts(productsToShow = products) {
  const productGrid = document.getElementById('productGrid');
  productGrid.innerHTML = '';

  productsToShow.forEach((product) => {
    const productCard = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        Tambah ke Keranjang
                    </button>
                </div>
            </div>
        `;
    productGrid.innerHTML += productCard;
  });
}

// Add to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartCount();
}

// Update cart count
function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Open cart modal
function openCart() {
  const modal = document.getElementById('cartModal');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  cartItems.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Keranjang kosong</p>';
  } else {
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItem = `
                        <div class="cart-item">
                            <div>
                                <h4>${item.name}</h4>
                                <p>${formatPrice(item.price)} x ${item.quantity}</p>
                            </div>
                            <div>
                                <button onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer;">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    `;
      cartItems.innerHTML += cartItem;
    });
  }

  cartTotal.textContent = `Total: ${formatPrice(total)}`;
  modal.style.display = 'block';
}

// Close cart modal
function closeCart() {
  document.getElementById('cartModal').style.display = 'none';
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartCount();
  openCart(); // Refresh cart display
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert('Keranjang masih kosong!');
    return;
  }

  if (!currentUser) {
    closeCart();
    alert('Silakan login terlebih dahulu untuk checkout');
    openLogin();
    return;
  }

  alert('Terima kasih ' + currentUser.name + '! Pesanan Anda sedang diproses.');
  cart = [];
  updateCartCount();
  closeCart();
}

// Filter products by category
function filterProducts(category) {
  currentCategory = category;
  if (category === 'all') {
    renderProducts(products);
  } else {
    const filtered = products.filter((p) => p.category === category);
    renderProducts(filtered);
  }
}

// Search products
function searchProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filtered = products.filter((p) => p.name.toLowerCase().includes(searchTerm));
  renderProducts(filtered);
}

// Toggle mobile menu
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
}

// Close modal when clicking outside
window.onclick = function (event) {
  const cartModal = document.getElementById('cartModal');
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');

  if (event.target === cartModal) {
    closeCart();
  } else if (event.target === loginModal || event.target === registerModal) {
    closeAuth();
  }
};

// Authentication Functions
function openLogin() {
  if (currentUser) {
    // User is already logged in, show user menu instead
    return;
  }
  document.getElementById('loginModal').style.display = 'block';
}

function openRegister() {
  document.getElementById('registerModal').style.display = 'block';
}

function closeAuth() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('registerModal').style.display = 'none';
}

function switchToRegister() {
  closeAuth();
  setTimeout(() => {
    document.getElementById('registerModal').style.display = 'block';
  }, 100);
}

function switchToLogin() {
  closeAuth();
  setTimeout(() => {
    document.getElementById('loginModal').style.display = 'block';
  }, 100);
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  // Simulate login validation
  if (email && password) {
    // In real app, this would be an API call
    const user = {
      name: email.split('@')[0],
      email: email,
      id: Date.now(),
    };

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));

    updateUIForLoggedInUser();
    closeAuth();

    // Show success message
    alert('Login berhasil! Selamat datang, ' + user.name);
  }
}

function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;

  if (password !== confirmPassword) {
    alert('Password tidak cocok!');
    return;
  }

  if (name && email && password) {
    // In real app, this would be an API call
    const user = {
      name: name,
      email: email,
      id: Date.now(),
    };

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));

    updateUIForLoggedInUser();
    closeAuth();

    // Show success message
    alert('Pendaftaran berhasil! Selamat datang, ' + user.name);
  }
}

function updateUIForLoggedInUser() {
  const loginLink = document.querySelector('a[onclick="openLogin()"]');
  const userMenu = document.getElementById('userMenu');
  const userName = document.getElementById('userName');

  if (currentUser) {
    loginLink.style.display = 'none';
    userMenu.style.display = 'block';
    userName.textContent = currentUser.name;
  } else {
    loginLink.style.display = 'block';
    userMenu.style.display = 'none';
  }
}

function toggleUserDropdown() {
  const dropdown = document.getElementById('userDropdown');
  dropdown.classList.toggle('active');
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateUIForLoggedInUser();

  // Close dropdown
  document.getElementById('userDropdown').classList.remove('active');

  alert('Anda telah keluar dari akun');
}

function loginWithGoogle() {
  alert('Fitur login dengan Google akan segera hadir!');
}

function loginWithFacebook() {
  alert('Fitur login dengan Facebook akan segera hadir!');
}

function registerWithGoogle() {
  alert('Fitur daftar dengan Google akan segera hadir!');
}

function registerWithFacebook() {
  alert('Fitur daftar dengan Facebook akan segera hadir!');
}

function forgotPassword() {
  const email = prompt('Masukkan email Anda untuk reset password:');
  if (email) {
    alert('Link reset password telah dikirim ke ' + email);
  }
}

function viewProfile() {
  window.location.href = "profile.html";
}

function viewOrders() {
  window.location.href = "order.html";
}

function viewWishlist() {
  window.location.href = "wishlist.html";
}

// Logo navigation
function goToHome() {
  // Scroll to top/home section
  document.getElementById('home').scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  // Close mobile menu if open
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.remove('active');

  // Reset any filters
  currentCategory = 'all';
  renderProducts();

  // Clear search
  document.getElementById('searchInput').value = '';
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

// Search on Enter key
document.getElementById('searchInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchProducts();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUIForLoggedInUser();
  }
  renderProducts();
});
