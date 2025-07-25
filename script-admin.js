// ====================
// DATOS Y ESTADO
// ====================
let currentUser = null;
let flavors = JSON.parse(localStorage.getItem('flavors')) || [];
let currentEditFlavorId = null;

// ====================
// ELEMENTOS DOM
// ====================
const logoutAdminBtn = document.getElementById('logout-admin-btn');
const adminFlavorsList = document.getElementById('admin-flavors-list');
const saveFlavorBtn = document.getElementById('save-flavor');

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
                tags
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
            image: "https://via.placeholder.com/300x200?text=Helado" // Imagen por defecto
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
});