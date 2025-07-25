// ====================
// DATOS INICIALES
// ====================
const initialFlavors = [
   {
        id: 1,
        name: "Vainilla Bourbon",
        description: "Vainilla de Madagascar con notas de caramelo y un aroma embriagador",
        price: 3.50,
        tags: ["Clásico", "Premium"],
        type: "crema",
        color: "#e0f7fa",
        image: "images/vainilla.jpg" 
    },
    {
        id: 2,
        name: "Chocolate Negro 70%",
        description: "Intenso chocolate amargo con cacao de Ecuador y trozos de cacao",
        price: 4.00,
        tags: ["Chocolate", "Sin azúcar añadido"],
        type: "chocolate",
        color: "#d7ccc8",
        image: "images/chocolate.jpg" // RUTA LOCAL
    },
    {
        id: 3,
        name: "Frambuesa Silvestre",
        description: "Frambuesas orgánicas con un toque de limón y semillas reales",
        price: 3.75,
        tags: ["Frutos Rojos", "Vegano"],
        type: "fruta",
        color: "#f8bbd0",
        image: "images/frambuesa.jpg" // RUTA LOCAL
    },
    {
        id: 4,
        name: "Limón de Sorrento",
        description: "Limones italianos con ralladura natural y un toque de albahaca",
        price: 3.25,
        tags: ["Cítrico", "Vegano"],
        type: "fruta",
        color: "#fff9c4",
        image: "images/limon.jpg" // RUTA LOCAL
    },
    {
        id: 5,
        name: "Lavanda y Miel",
        description: "Delicada flor de lavanda con miel de flores silvestres locales",
        price: 4.25,
        tags: ["Exótico", "Edición Limitada"],
        type: "crema",
        color: "#d1c4e9",
        image: "images/lavanda.jpg" // RUTA LOCAL
    },
    {
        id: 6,
        name: "Matcha Premium",
        description: "Té matcha japonés grado ceremonial con leche de almendras",
        price: 4.50,
        tags: ["Vegano", "Sin lactosa"],
        type: "crema",
        color: "#c8e6c9",
        image: "images/matcha.jpg" // RUTA LOCAL
    }

];
const initialUsers = [{ id: 1, name: "Ana Martínez", email: "ana@ejemplo.com", password: "ana123", role: "user" }, { id: 2, name: "Carlos Rodríguez", email: "carlos@ejemplo.com", password: "carlos123", role: "user" }];
const adminUsers = [{ id: 100, name: "Administrador", email: "admin@heladeria.com", password: "admin123", role: "admin" }];

// ====================
// ESTADO DE LA APLICACIÓN
// ====================
let currentUser = null;
let flavors = JSON.parse(localStorage.getItem('flavors')) || initialFlavors;
let users = JSON.parse(localStorage.getItem('users')) || [...initialUsers, ...adminUsers];

// ====================
// DOM ELEMENTS
// ====================
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const flavorsList = document.getElementById('flavors-list');
const customizeBtn = document.getElementById('customize-btn');

// ====================
// FUNCIONES DE RENDERIZADO
// ====================
function renderFlavors() {
    if (!flavorsList) return;
    flavorsList.innerHTML = '';
    flavors.forEach(flavor => {
        const flavorCard = document.createElement('div');
        flavorCard.className = 'flavor-card fade-in';
        flavorCard.innerHTML = `
            <div class="flavor-img-container">
                <img src="${flavor.image}" alt="${flavor.name}" class="flavor-image">
            </div>
            <div class="flavor-content">
                <h3>${flavor.name}</h3>
                <p>${flavor.description}</p>
                <div class="flavor-tags">
                    ${flavor.tags.map(tag => `<span class="tag ${getTagClass(tag)}">${tag}</span>`).join('')}
                </div>
                <div class="flavor-price">${flavor.price.toFixed(2)} €</div>
            </div>`;
        flavorsList.appendChild(flavorCard);
    });
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('appear'));
    }, 100);
}

function updateAuthUI() {
    if (currentUser) {
        loginBtn.textContent = currentUser.name.split(' ')[0];
        registerBtn.textContent = 'Cerrar Sesión';
        registerBtn.classList.remove('btn-primary');
        registerBtn.classList.add('btn-outline');
    } else {
        loginBtn.textContent = 'Iniciar Sesión';
        registerBtn.textContent = 'Registrarse';
        registerBtn.classList.remove('btn-outline');
        registerBtn.classList.add('btn-primary');
    }
}

// ====================
// FUNCIONES UTILITARIAS
// ====================
function getTagClass(tag) {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes('vegano')) return 'vegan';
    if (lowerTag.includes('fruta') || lowerTag.includes('cítrico') || lowerTag.includes('rojos')) return 'fruit';
    if (lowerTag.includes('chocolate')) return 'chocolate';
    if (lowerTag.includes('nueces') || lowerTag.includes('almendra')) return 'nut';
    if (lowerTag.includes('nuevo') || lowerTag.includes('limitada')) return 'new';
    return '';
}

// ====================
// EVENT LISTENERS
// ====================
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) currentUser = JSON.parse(savedUser);
    
    renderFlavors();
    updateAuthUI();
    
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('appear');
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(element => observer.observe(element));
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    loginBtn.addEventListener('click', () => { window.location.href = 'login.html'; });

    registerBtn.addEventListener('click', (e) => {
        if (currentUser) {
            e.preventDefault();
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateAuthUI();
        } else {
            window.location.href = 'login.html#register';
        }
    });

    // Redirigir a la página de personalización
    if (customizeBtn) {
        customizeBtn.addEventListener('click', () => {
            window.location.href = 'personalizar.html';
        });
    }
});