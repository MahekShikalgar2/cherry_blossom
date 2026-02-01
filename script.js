// DOM Elements
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const filterButtons = document.querySelectorAll('.filter-btn');
const flowerGrid = document.querySelector('.flower-grid');
const cartCount = document.querySelector('.cart-count');
const cartIcon = document.querySelector('.cart-icon a');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.total-price');
const checkoutBtn = document.querySelector('.checkout-btn');
const backToTopBtn = document.getElementById('backToTop');
const successMessage = document.getElementById('successMessage');
const contactForm = document.getElementById('contactForm');
const subscribeForm = document.querySelector('.subscribe-form');

// Flower data
const flowers = [
    { id: 1, name: "Red Rose", type: "rose", price: 4.99, img: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=718&q=80" },
    { id: 2, name: "Pink Tulip", type: "tulip", price: 3.99, img: "https://jooinn.com/images/pink-tulips-1.jpg" },
    { id: 3, name: "White Lily", type: "lily", price: 5.99, img: "https://a-z-animals.com/media/2023/03/shutterstock_2008819298.jpg" },
    { id: 4, name: "Sunflower", type: "sunflower", price: 4.49, img: "https://www.thespruce.com/thmb/hCuNm8YshuuFYcJmI0s97VpuYnU=/3008x2000/filters:no_upscale():max_bytes(150000):strip_icc()/F_Sunflower_HeliosFlameF1-Harris-5936d6e13df78c08abfbf025.jpg" },
    { id: 5, name: "Purple Orchid", type: "orchid", price: 8.99, img: "https://cdn.wallpapersafari.com/90/29/Do1g68.jpg" },
    { id: 6, name: "Yellow Rose", type: "rose", price: 4.49, img: "https://images.pexels.com/photos/209004/pexels-photo-209004.jpeg?cs=srgb&dl=pexels-pixabay-209004.jpg&fm=jpg" },
    { id: 7, name: "Purple Tulip", type: "tulip", price: 4.29, img: "https://i5.walmartimages.com/asr/9807af5b-4048-4861-a786-c13dc6b1ec2a.de8d8657a1d3f6c9824c7da89bafd842.jpeg" },
    { id: 8, name: "Pink Lily", type: "lily", price: 6.49, img: "https://www.thespruce.com/thmb/30NwrBiUieqWVRohkA49zFPNyiY=/4288x2848/filters:fill(auto,1)/lily-types-to-grow-in-garden-1315809-hero-4882303dc806493d86f56d7a71b3d189.jpg" },
    { id: 9, name: "White Orchid", type: "orchid", price: 9.99, img: "https://getwallpapers.com/wallpaper/full/f/5/d/955743-popular-white-orchid-wallpaper-1920x1285-ipad-pro.jpg" }
];

// Cart data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Generate flower cards
    renderFlowers(flowers);
    
    // Update cart count
    updateCartCount();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize filter buttons
    setupFilterButtons();
    
    // Check if there are items in cart and render them
    if (cart.length > 0) {
        renderCartItems();
    }
});

// Render flower cards
function renderFlowers(flowersToRender) {
    flowerGrid.innerHTML = '';
    
    flowersToRender.forEach(flower => {
        const flowerCard = document.createElement('div');
        flowerCard.className = 'flower-card';
        flowerCard.setAttribute('data-type', flower.type);
        
        flowerCard.innerHTML = `
            <img src="${flower.img}" alt="${flower.name}" class="flower-img">
            <div class="flower-info">
                <h3 class="flower-name">${flower.name}</h3>
                <p class="flower-type">${flower.type}</p>
                <span class="flower-price">$${flower.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${flower.id}">Add to Cart</button>
            </div>
        `;
        
        flowerGrid.appendChild(flowerCard);
    });
    
    // Add event listeners to the new "Add to Cart" buttons
    document.querySelectorAll('.flower-card .add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const flowerId = parseInt(e.target.getAttribute('data-id'));
            addToCart(flowerId);
        });
    });
}

// Setup filter buttons
function setupFilterButtons() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            if (filter === 'all') {
                renderFlowers(flowers);
            } else {
                const filteredFlowers = flowers.filter(flower => flower.type === filter);
                renderFlowers(filteredFlowers);
            }
        });
    });
}

// Cart functionality
function addToCart(id) {
    // Find the flower in the flowers array
    const flower = flowers.find(item => item.id === id);
    
    // Check if flower is already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...flower,
            quantity: 1
        });
    }
    
    // Update cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showSuccessMessage();
    
    // If cart modal is open, update the display
    if (cartModal.classList.contains('active')) {
        renderCartItems();
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartItemsContainer.style.display = 'none';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update total
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners to quantity buttons and remove buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(id, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(id, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity += change;
        
        // Remove item if quantity is 0 or less
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Re-render cart items
        renderCartItems();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Re-render cart items
    renderCartItems();
}

function showSuccessMessage() {
    successMessage.classList.add('active');
    
    setTimeout(() => {
        successMessage.classList.remove('active');
    }, 3000);
}

// Setup all event listeners
function setupEventListeners() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Update active nav link
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Cart icon click to open cart modal
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.classList.add('active');
        renderCartItems();
    });
    
    // Close cart modal
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
    
    // Close cart modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        alert('Thank you for your order! This is a demo website, so no real transaction will occur.');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        cartModal.classList.remove('active');
    });
    
    // Back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Form submissions
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = subscribeForm.querySelector('input[type="email"]');
            alert(`Thank you for subscribing with email: ${emailInput.value}`);
            emailInput.value = '';
        });
    }
    
    // Add to cart buttons for arrangements
    document.querySelectorAll('.arrangement-card .add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const arrangementId = parseInt(e.target.getAttribute('data-id'));
            // For demo, we'll use a simple approach
            addToCart(arrangementId + 9); // Adding 9 to avoid conflict with flower IDs
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip for cart icon which has its own handler
            if (href === '#cart') return;
            
            e.preventDefault();
            
            if (href !== '#') {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeIn 0.8s ease forwards`;
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    document.querySelectorAll('.flower-card, .arrangement-card, .feature, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// Add some surprise animations for fun
document.addEventListener('click', (e) => {
    // Create a flower emoji at click position
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && !e.target.closest('button') && !e.target.closest('a')) {
        const flowerEmojis = ['🌸', '🌺', '🌷', '🌹', '💐', '🥀', '🌼', '🌻'];
        const randomEmoji = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
        
        // Only create the effect occasionally (10% chance)
        if (Math.random() > 0.9) {
            const flower = document.createElement('div');
            flower.innerHTML = randomEmoji;
            flower.style.position = 'fixed';
            flower.style.left = `${e.clientX}px`;
            flower.style.top = `${e.clientY}px`;
            flower.style.fontSize = '1.5rem';
            flower.style.pointerEvents = 'none';
            flower.style.zIndex = '9999';
            flower.style.animation = 'float 2s ease forwards';
            
            document.body.appendChild(flower);
            
            // Remove after animation completes
            setTimeout(() => {
                flower.remove();
            }, 2000);
        }
    }
});
