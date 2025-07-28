// ====================
// DATOS INICIALES
// ====================

const initialFlavors = [
    { id: 1, name: "Vainilla Bourbon", description: "Vainilla de Madagascar con notas de caramelo", price: 3.50, tags: ["Clásico", "Premium"], type: "crema", image: "images/vainilla.jpg" },
    { id: 2, name: "Chocolate Negro 70%", description: "Intenso chocolate amargo con cacao de Ecuador", price: 4.00, tags: ["Chocolate", "Sin azúcar"], type: "chocolate", image: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "Frambuesa Silvestre", description: "Frambuesas orgánicas con un toque de limón", price: 3.75, tags: ["Frutos Rojos", "Vegano"], type: "fruta", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
    { id: 4, name: "Limón de Sorrento", description: "Limones italianos con ralladura natural", price: 3.25, tags: ["Cítrico", "Vegano"], type: "fruta", image: "https://images.unsplash.com/photo-1551751299-1b51cab2694c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80" },
    { id: 5, name: "Lavanda y Miel", description: "Delicada flor de lavanda con miel local", price: 4.25, tags: ["Exótico", "Edición Limitada"], type: "crema", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
    { id: 6, name: "Matcha Premium", description: "Té matcha japonés con leche de almendras", price: 4.50, tags: ["Vegano", "Sin lactosa"], type: "crema", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" }
];

const storedFlavors = JSON.parse(localStorage.getItem('flavors'));
let flavors = (storedFlavors && storedFlavors.length > 0) ? storedFlavors : initialFlavors;

// ====================
// DOM ELEMENTS
// ====================
const prevStepBtn = document.getElementById('prev-step');
const nextStepBtn = document.getElementById('next-step');
const stepBase = document.getElementById('step-base');
const stepFlavors = document.getElementById('step-flavors');
const stepToppings = document.getElementById('step-toppings');
const customizeFlavorsList = document.getElementById('customize-flavors-list');
const customizeSummary = document.getElementById('customize-summary');
const customizeTotal = document.getElementById('customize-total');

// ====================
// ESTADO Y PRECIOS
// ====================
let currentStep = 1;
let selectedBase = null;
let selectedFlavors = []; // {id, quantity}
let selectedToppings = []; // {value, quantity}

const basePrices = { 'cono': 0.5, 'vaso': 0.0, 'cucurucho-chocolate': 1.0, 'tarrina': 0.0 };
const toppingPrices = { 'chocolate-caliente': 0.5, 'fruta-fresca': 0.7, 'galletas': 0.6, 'chocolate-chips': 0.4, 'caramelo': 0.5, 'frutos-secos': 0.8 };

// ====================
// FUNCIONES
// ====================
function showStep(step) {
    currentStep = step;
    document.querySelectorAll('.customize-step').forEach(s => s.classList.remove('active'));

    if (step === 1) {
        stepBase.classList.add('active');
        prevStepBtn.disabled = true;
        nextStepBtn.textContent = 'Siguiente';
        nextStepBtn.onclick = nextStep;
    } else if (step === 2) {
        stepFlavors.classList.add('active');
        prevStepBtn.disabled = false;
        nextStepBtn.textContent = 'Siguiente';
        nextStepBtn.onclick = nextStep;
        renderFlavorOptions();
    } else if (step === 3) {
        stepToppings.classList.add('active');
        prevStepBtn.disabled = false;
        nextStepBtn.textContent = 'Finalizar Pedido';
        nextStepBtn.onclick = () => {
            alert('¡Gracias por tu pedido! Total: ' + calculateTotal().toFixed(2) + ' €');
            window.location.href = 'index.html';
        };
    }
    updateSummary();
}

function nextStep() {
    if (currentStep === 1 && !selectedBase) {
        alert('Por favor selecciona una base');
        return;
    }
    if (currentStep === 2) {
        const totalFlavors = selectedFlavors.reduce((sum, f) => sum + f.quantity, 0);
        if (totalFlavors === 0) {
            alert('Por favor selecciona al menos un sabor');
            return;
        }
        if (totalFlavors > 3) {
            alert('Solo puedes seleccionar hasta 3 sabores en total');
            return;
        }
    }
    if (currentStep < 3) {
        showStep(currentStep + 1);
    }
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function selectBase(e) {
    const option = e.target.closest('.option');
    if (!option) return;
    const value = option.getAttribute('data-value');
    stepBase.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    selectedBase = value;
    updateSummary();
}

function renderFlavorOptions() {
    customizeFlavorsList.innerHTML = '';
    flavors.forEach(flavor => {
        const flavorOption = document.createElement('div');
        flavorOption.className = 'flavor-option';
        
        const flavorQty = selectedFlavors.find(f => f.id === flavor.id)?.quantity || 0;
        
        flavorOption.innerHTML = `
            <div class="flavor-info">
                <div class="flavor-name">${flavor.name}</div>
                <div class="flavor-price">${flavor.price.toFixed(2)} €</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn minus" data-id="${flavor.id}">-</button>
                <span class="quantity-display" id="qty-${flavor.id}">${flavorQty}</span>
                <button class="quantity-btn plus" data-id="${flavor.id}">+</button>
            </div>
            <img src="${flavor.image}" alt="${flavor.name}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">
        `;
        customizeFlavorsList.appendChild(flavorOption);
        
        flavorOption.querySelector('.minus').addEventListener('click', decreaseFlavor);
        flavorOption.querySelector('.plus').addEventListener('click', increaseFlavor);
    });
}

function increaseFlavor(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const display = document.getElementById(`qty-${id}`);
    let quantity = parseInt(display.textContent);
    
    const totalFlavors = selectedFlavors.reduce((sum, f) => sum + f.quantity, 0);
    if (totalFlavors >= 3) {
        alert('Solo puedes seleccionar hasta 3 sabores en total');
        return;
    }
    
    quantity++;
    display.textContent = quantity;
    
    const existing = selectedFlavors.find(f => f.id === id);
    if (existing) {
        existing.quantity = quantity;
    } else {
        selectedFlavors.push({ id, quantity });
    }
    
    updateSummary();
}

function decreaseFlavor(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const display = document.getElementById(`qty-${id}`);
    let quantity = parseInt(display.textContent);
    
    if (quantity > 0) {
        quantity--;
        display.textContent = quantity;
        
        const existingIndex = selectedFlavors.findIndex(f => f.id === id);
        if (existingIndex !== -1) {
            if (quantity === 0) {
                selectedFlavors.splice(existingIndex, 1);
            } else {
                selectedFlavors[existingIndex].quantity = quantity;
            }
        }
        
        updateSummary();
    }
}

function selectTopping(e) {
    if (e.target.classList.contains('quantity-btn')) return;
    
    const option = e.target.closest('.option');
    if (!option) return;
    const value = option.getAttribute('data-value');
    
    // Crear controles de cantidad si no existen
    let quantityControls = option.querySelector('.quantity-controls');
    if (!quantityControls) {
        quantityControls = document.createElement('div');
        quantityControls.className = 'quantity-controls';
        quantityControls.innerHTML = `
            <button class="quantity-btn minus" data-value="${value}">-</button>
            <span class="quantity-display">1</span>
            <button class="quantity-btn plus" data-value="${value}">+</button>
        `;
        option.appendChild(quantityControls);
        
        quantityControls.querySelector('.minus').addEventListener('click', decreaseTopping);
        quantityControls.querySelector('.plus').addEventListener('click', increaseTopping);
    }
    
    // Cambiar estado de selección
    if (option.classList.contains('selected')) {
        option.classList.remove('selected');
        selectedToppings = selectedToppings.filter(t => t.value !== value);
    } else {
        option.classList.add('selected');
        const quantity = 1;
        selectedToppings.push({ value, quantity });
    }
    
    updateSummary();
}

function increaseTopping(e) {
    const value = e.target.getAttribute('data-value');
    const option = document.querySelector(`.option[data-value="${value}"]`);
    const display = option.querySelector('.quantity-display');
    let quantity = parseInt(display.textContent);
    
    quantity++;
    display.textContent = quantity;
    
    const topping = selectedToppings.find(t => t.value === value);
    if (topping) {
        topping.quantity = quantity;
    }
    
    updateSummary();
}

function decreaseTopping(e) {
    const value = e.target.getAttribute('data-value');
    const option = document.querySelector(`.option[data-value="${value}"]`);
    const display = option.querySelector('.quantity-display');
    let quantity = parseInt(display.textContent);
    
    if (quantity > 1) {
        quantity--;
        display.textContent = quantity;
        
        const topping = selectedToppings.find(t => t.value === value);
        if (topping) {
            topping.quantity = quantity;
        }
    } else {
        option.classList.remove('selected');
        selectedToppings = selectedToppings.filter(t => t.value !== value);
    }
    
    updateSummary();
}

function updateSummary() {
    let summaryHTML = '';
    if (selectedBase) summaryHTML += `<div>Base: ${getBaseName(selectedBase)} (${basePrices[selectedBase].toFixed(2)} €)</div>`;
    
    if (selectedFlavors.length > 0) {
        summaryHTML += `<div>Sabores: `;
        selectedFlavors.forEach(f => {
            const flavor = flavors.find(fl => fl.id === f.id);
            if (flavor) {
                summaryHTML += `${flavor.name}${f.quantity > 1 ? ` (x${f.quantity})` : ''}, `;
            }
        });
        summaryHTML = summaryHTML.slice(0, -2) + '</div>';
    }
    
    if (selectedToppings.length > 0) {
        summaryHTML += `<div>Toppings: `;
        selectedToppings.forEach(t => {
            summaryHTML += `${getToppingName(t.value)}${t.quantity > 1 ? ` (x${t.quantity})` : ''}, `;
        });
        summaryHTML = summaryHTML.slice(0, -2) + '</div>';
    }
    
    customizeSummary.innerHTML = summaryHTML || '<div>Selecciona opciones...</div>';
    customizeTotal.textContent = 'Total: ' + calculateTotal().toFixed(2) + ' €';
}

function calculateTotal() {
    let total = 0;
    if (selectedBase) total += basePrices[selectedBase];
    
    selectedFlavors.forEach(f => {
        const flavor = flavors.find(fl => fl.id === f.id);
        if (flavor) total += flavor.price * f.quantity;
    });
    
    selectedToppings.forEach(t => {
        total += toppingPrices[t.value] * t.quantity;
    });
    
    return total;
}

function getBaseName(value) {
    const names = { 'cono': 'Cono clásico', 'vaso': 'Vaso', 'cucurucho-chocolate': 'Cucurucho de chocolate', 'tarrina': 'Tarrina' };
    return names[value] || value;
}

function getToppingName(value) {
    const names = { 'chocolate-caliente': 'Chocolate caliente', 'fruta-fresca': 'Fruta fresca', 'galletas': 'Galletas', 'chocolate-chips': 'Chocolate chips', 'caramelo': 'Caramelo', 'frutos-secos': 'Frutos secos' };
    return names[value] || value;
}

// ====================
// EVENT LISTENERS
// ====================
document.addEventListener('DOMContentLoaded', function() {
    showStep(1);
    updateSummary();

    prevStepBtn.addEventListener('click', prevStep);
    nextStepBtn.addEventListener('click', nextStep);
    stepBase.addEventListener('click', selectBase);
    stepToppings.addEventListener('click', selectTopping);
});