
// DATOS Y ESTADO
// ====================

// <<-- AÑADE ESTO: La lista inicial de sabores para tener una base
const initialFlavors = [
    { id: 1, name: "Vainilla Bourbon", description: "Vainilla de Madagascar con notas de caramelo", price: 3.50, tags: ["Clásico", "Premium"], type: "crema", image: "https://images.unsplash.com/photo-1576613109753-27804de1c280?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Chocolate Negro 70%", description: "Intenso chocolate amargo con cacao de Ecuador", price: 4.00, tags: ["Chocolate", "Sin azúcar"], type: "chocolate", image: "https://images.unsplash.com/photo-1600326145557-02c826d2d457?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "Frambuesa Silvestre", description: "Frambuesas orgánicas con un toque de limón", price: 3.75, tags: ["Frutos Rojos", "Vegano"], type: "fruta", image: "https://images.unsplash.com/photo-1567253968596-a34a13590a21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" },
    { id: 4, name: "Limón de Sorrento", description: "Limones italianos con ralladura natural", price: 3.25, tags: ["Cítrico", "Vegano"], type: "fruta", image: "https://images.unsplash.com/photo-1626201416998-56379b37e0ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" },
    { id: 5, name: "Lavanda y Miel", description: "Delicada flor de lavanda con miel local", price: 4.25, tags: ["Exótico", "Edición Limitada"], type: "crema", image: "https://images.unsplash.com/photo-1599028030594-9d7658035105?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" },
    { id: 6, name: "Matcha Premium", description: "Té matcha japonés con leche de almendras", price: 4.50, tags: ["Vegano", "Sin lactosa"], type: "crema", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" }
];

let currentUser = null;
const storedFlavors = JSON.parse(localStorage.getItem('flavors'));
let flavors = (storedFlavors && storedFlavors.length > 0) ? storedFlavors : initialFlavors;
let currentEditFlavorId = null;

// ====================
// ELEMENTOS DOM
// ====================
const logoutAdminBtn = document.getElementById('logout-admin-btn');
const adminFlavorsList = document.getElementById('admin-flavors-list');
const saveFlavorBtn = document.getElementById('save-flavor');
const flavorImageInput = document.getElementById('flavor-image');
const imagePreview = document.getElementById('image-preview');

// ====================
// FUNCIONES
// ====================
function checkAdmin() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (currentUser.role === 'admin') {
            return true;
        }
    }
    // Si no es admin, redirigir a index.html
    window.location.href = 'index.html';
    return false;
}

function renderAdminFlavors() {
    adminFlavorsList.innerHTML = '';
    
    if (flavors.length === 0) {
        adminFlavorsList.innerHTML = '<p style="text-align: center; padding: 20px;">No hay sabores registrados</p>';
        return;
    }
    
    flavors.forEach(flavor => {
        const flavorItem = document.createElement('div');
        flavorItem.className = 'flavor-item';
        flavorItem.innerHTML = `
            <div>
                <h4>${flavor.name}</h4>
                <div class="flavor-tags">
                    ${flavor.tags.map(tag => `<span class="tag ${getTagClass(tag)}">${tag}</span>`).join('')}
                </div>
                <div class="flavor-price">${flavor.price.toFixed(2)} $</div>
            </div>
            <div class="flavor-actions">
                <button class="edit-btn" data-id="${flavor.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${flavor.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        adminFlavorsList.appendChild(flavorItem);
    });
    
    // Añadir event listeners para editar y eliminar
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            editFlavor(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            deleteFlavor(id);
        });
    });
}

// Obtener clase CSS para etiqueta
function getTagClass(tag) {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes('vegano')) return 'vegan';
    if (lowerTag.includes('fruta') || lowerTag.includes('cítrico') || lowerTag.includes('rojos')) return 'fruit';
    if (lowerTag.includes('chocolate')) return 'chocolate';
    if (lowerTag.includes('nueces') || lowerTag.includes('almendra')) return 'nut';
    if (lowerTag.includes('nuevo') || lowerTag.includes('limitada')) return 'new';
    return '';
}

// Guardar un nuevo sabor o actualizar existente
function saveFlavor() {
    const name = document.getElementById('flavor-name').value;
    const type = document.getElementById('flavor-type').value;
    const price = parseFloat(document.getElementById('flavor-price').value);
    const desc = document.getElementById('flavor-desc').value;
    const tags = document.getElementById('flavor-tags').value.split(',').map(tag => tag.trim());
    const image = document.getElementById('flavor-image').value;
    
    if (!name || !type || isNaN(price) || !desc) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    if (currentEditFlavorId) {
        // Actualizar sabor existente
        const index = flavors.findIndex(f => f.id === currentEditFlavorId);
        if (index !== -1) {
            flavors[index] = {
                ...flavors[index],
                name,
                type,
                price,
                description: desc,
                tags,
                image: image || flavors[index].image // Actualiza la imagen, o mantiene la anterior si no se provee una nueva
            };
        }
        currentEditFlavorId = null;
    } else {
        // Crear nuevo sabor
        const newFlavor = {
            id: Date.now(),
            name,
            type,
            price,
            description: desc,
            tags,
            color: getRandomColor(),
            image: image || "https://via.placeholder.com/300x200?text=Helado" // Usa la imagen del input o una por defecto
        };
        flavors.push(newFlavor);
    }
    
    // Guardar en localStorage
    localStorage.setItem('flavors', JSON.stringify(flavors));
    
    // Actualizar UI
    renderAdminFlavors();
    
    // Limpiar formulario
    document.getElementById('flavor-name').value = '';
    document.getElementById('flavor-type').value = '';
    document.getElementById('flavor-price').value = '';
    document.getElementById('flavor-desc').value = '';
    document.getElementById('flavor-tags').value = '';
    document.getElementById('flavor-image').value = '';

    // Limpiar previsualización
    imagePreview.src = '';
    imagePreview.style.display = 'none';
    
    alert('Sabor guardado exitosamente');
}

// Editar un sabor existente
function editFlavor(id) {
    const flavor = flavors.find(f => f.id === id);
    if (flavor) {
        document.getElementById('flavor-name').value = flavor.name;
        document.getElementById('flavor-type').value = flavor.type;
        document.getElementById('flavor-price').value = flavor.price;
        document.getElementById('flavor-desc').value = flavor.description;
        document.getElementById('flavor-tags').value = flavor.tags.join(', ');
        document.getElementById('flavor-image').value = flavor.image || '';

        // Mostrar previsualización de la imagen existente
        if (flavor.image) {
            imagePreview.src = flavor.image;
            imagePreview.style.display = 'block';
        } else {
            imagePreview.style.display = 'none';
        }
        
        currentEditFlavorId = id;
        
        // Scroll al formulario
        document.getElementById('flavor-name').scrollIntoView({ behavior: 'smooth' });
    }
}

// Eliminar un sabor
function deleteFlavor(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este sabor?')) {
        flavors = flavors.filter(f => f.id !== id);
        localStorage.setItem('flavors', JSON.stringify(flavors));
        renderAdminFlavors();
        alert('Sabor eliminado exitosamente');
    }
}

// Generar color aleatorio
function getRandomColor() {
    const colors = ['#e0f7fa', '#d7ccc8', '#f8bbd0', '#fff9c4', '#d1c4e9', '#c8e6c9', '#ffccbc', '#e1bee7'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ====================
// INICIALIZACIÓN
// ====================
document.addEventListener('DOMContentLoaded', function() {
    if (checkAdmin()) {
        renderAdminFlavors();
    }
    
    // Event Listeners
    logoutAdminBtn.addEventListener('click', logout);
    saveFlavorBtn.addEventListener('click', saveFlavor);

    // Event listener para la previsualización de la imagen
    flavorImageInput.addEventListener('input', () => {
        const url = flavorImageInput.value;
        if (url) {
            imagePreview.src = url;
            imagePreview.style.display = 'block';
        } else {
            imagePreview.style.display = 'none';
        }
    });
});