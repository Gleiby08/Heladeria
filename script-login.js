// ====================
// DATOS INICIALES
// ====================

// Usuarios de prueba
const initialUsers = [
    { id: 1, name: "Ana Martínez", email: "ana@ejemplo.com", password: "ana123", role: "user" },
    { id: 2, name: "Carlos Rodríguez", email: "carlos@ejemplo.com", password: "carlos123", role: "user" }
];

// Administradores
const adminUsers = [
    { id: 100, name: "Administrador", email: "admin@heladeria.com", password: "admin123", role: "admin" }
];

// ====================
// ESTADO DE LA APLICACIÓN
// ====================
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [...initialUsers, ...adminUsers];

// ====================
// DOM ELEMENTS
// ====================
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const adminLoginModal = document.getElementById('admin-login-modal');
const closeButtons = document.querySelectorAll('.close-modal');
const backToUserLogin = document.getElementById('back-to-user-login');
const adminLoginBtn = document.getElementById('admin-login-btn');
const switchToLogin = document.getElementById('switch-to-login');

// ====================
// FUNCIONES DE AUTENTICACIÓN
// ====================

// Iniciar sesión
function loginUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return true;
    }
    
    return false;
}

// Registrar nuevo usuario
function registerUser(name, email, password) {
    // Verificar si el usuario ya existe
    const userExists = users.some(u => u.email === email);
    if (userExists) {
        alert('Este correo electrónico ya está registrado');
        return false;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: 'user'
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('¡Registro exitoso! Ahora puedes iniciar sesión');
    return true;
}

// ====================
// EVENT LISTENERS
// ====================

// Tabs
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
});

// Login de usuario
document.getElementById('login-submit').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (email && password) {
        if (loginUser(email, password)) {
            // Redirigir a index.html
            window.location.href = 'index.html';
        } else {
            alert('Credenciales incorrectas');
        }
    } else {
        alert('Por favor completa todos los campos');
    }
});

// Registro de usuario
document.getElementById('register-submit').addEventListener('click', () => {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    if (password !== confirm) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    if (name && email && password) {
        if (registerUser(name, email, password)) {
            // Después de registrar, mostramos el formulario de login
            loginTab.click();
            // Limpiar formulario de registro?
            document.getElementById('register-name').value = '';
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('register-confirm').value = '';
        }
    } else {
        alert('Por favor completa todos los campos');
    }
});

// Abrir modal de administrador
adminLoginBtn.addEventListener('click', () => {
    adminLoginModal.style.display = 'flex';
});

// Cerrar modal
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        adminLoginModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === adminLoginModal) adminLoginModal.style.display = 'none';
});

// Login de administrador
document.getElementById('admin-submit').addEventListener('click', () => {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    if (email && password) {
        if (loginUser(email, password) && currentUser.role === 'admin') {
            adminLoginModal.style.display = 'none';
            window.location.href = 'admin.html';
        } else {
            alert('Credenciales de administrador incorrectas');
        }
    } else {
        alert('Por favor completa todos los campos');
    }
});

// Cambiar a login desde registro
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginTab.click();
});

// Volver a login de usuario desde admin
backToUserLogin.addEventListener('click', (e) => {
    e.preventDefault();
    adminLoginModal.style.display = 'none';
});

// Comprobar hash en URL para mostrar registro
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#register') {
        registerTab.click();
    }
});