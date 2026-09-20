const galaxy = document.getElementById('galaxy');
const universe = document.getElementById('universe');

// Base de datos de tus botones interactivos
const messages = [
    { icon: '💛', title: 'Mi Centro', text: 'Eres el núcleo de este universo. Todo lo hermoso gira a tu alrededor, iluminando mi vida.💜' },
    { icon: '🌻', title: 'Mi Sol', text: 'Tus sonrisas son como estas flores: brillantes, únicas y capaces de alegrarme incluso el día más gris.💜' },
    { icon: '✨', title: 'Magia Pura', text: 'Cada momento a tu lado se siente como estar flotando entre las estrellas. Eres mi constelación favorita.💜' },
    { icon: '💌', title: 'El Destino', text: 'Si el universo es infinito, qué suerte tan increíble fue habernos encontrado en él. No te cambio por nada.💜' },
    { icon: '🌹', title: 'Amor Infinito', text: 'Incluso si algún día todas estas estrellas se apagan, mi amor por ti seguirá brillando intacto.💜' }
];

const billboards = []; // Guardaremos los elementos aquí para que siempre miren a la cámara

// Función para crear objetos en 3D (Matemática Esférica para dispersión)
function create3DElement(type, content, radiusMax, isInteractive = false, data = null) {
    const item = document.createElement('div');
    item.className = 'item';
    
    // Calcular posición aleatoria en una esfera (distribución 3D)
    const theta = Math.random() * Math.PI * 2; 
    const phi = Math.acos((Math.random() * 2) - 1); 
    
    // Dispersión: Concentramos un poco más en el centro, pero dejamos que floten lejos
    const r = Math.cbrt(Math.random()) * radiusMax; 
    
    // Ejes X, Y, Z. Aplastamos un poco la Y para que parezca un disco galáctico.
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = (r * Math.sin(phi) * Math.sin(theta)) * 0.4; 
    const z = r * Math.cos(phi);

    item.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    
    // Crear el cartel (billboard) que girará para mirar siempre al usuario
    const billboard = document.createElement('div');
    billboard.className = `billboard ${type}`;
    billboard.innerHTML = content;
    
    if (isInteractive) {
        billboard.classList.add('interactive');
        // Usamos hasDragged para evitar que abra la carta si solo estaba arrastrando la pantalla
        const clickHandler = (e) => {
            if (!hasDragged) openModal(data);
        };
        billboard.addEventListener('mouseup', clickHandler);
        billboard.addEventListener('touchend', clickHandler);
    }

    item.appendChild(billboard);
    galaxy.appendChild(item);
    billboards.push(billboard);
    
    return billboard;
}

// --- GENERACIÓN DEL UNIVERSO ---

// 1. Crear 500 estrellas dispersas a gran distancia
for (let i = 0; i < 500; i++) {
    const size = Math.random() * 3 + 1;
    const star = create3DElement('star', '', 1200);
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
}

// 2. Crear 100 Flores amarillas
const flowers = ['🌻', '🌼', '🏵️', '💛'];
for (let i = 0; i < 100; i++) {
    const f = flowers[Math.floor(Math.random() * flowers.length)];
    create3DElement('flower', f, 800);
}

// 3. Crear Textos flotantes
const phrases = ["Te amo", "Eres mi sol", "Preciosa", "Única", "Mi cielo", "Me encantas", "Mi mujer", "Mi mochi", "Mi reyna"];
for (let i = 0; i < 40; i++) {
    const p = phrases[Math.floor(Math.random() * phrases.length)];
    create3DElement('text', p, 700);
}

// 4. Crear los 5 NÚCLEOS interactivos (Alejados para que se busquen)
messages.forEach((msg, index) => {
    // El primer mensaje va más al centro, los demás en radios amplios
    const distance = index === 0 ? 50 : 500 + Math.random() * 200;
    create3DElement('interactive', msg.icon, distance, true, msg);
});

// --- FÍSICA Y CONTROLES DEL MOUSE/TOUCH ---
let currentRotX = -15, currentRotY = 0;
let targetRotX = -15, targetRotY = 0;
let isDragging = false, hasDragged = false;
let startX, startY;

function animate() {
    // Si no está arrastrando, la galaxia gira sola lentamente
    if (!isDragging) {
        targetRotY -= 0.1; 
    }

    // Efecto Lerp para un movimiento suave e inercial
    currentRotX += (targetRotX - currentRotX) * 0.1;
    currentRotY += (targetRotY - currentRotY) * 0.1;

    // Rotar todo el sistema espacial
    galaxy.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
    
    // MAGIA: Contrarrestar la rotación de los elementos para que SIEMPRE miren a la cámara
    billboards.forEach(b => {
        b.style.transform = `rotateY(${-currentRotY}deg) rotateX(${-currentRotX}deg)`;
    });

    requestAnimationFrame(animate);
}
animate(); // Iniciar motor físico

// Lógica de Arrastre
function startDrag(e) {
    if(e.target.closest('#modal')) return; // No mover si tocó la tarjeta
    isDragging = true;
    hasDragged = false;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
}

function drag(e) {
    if (!isDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = x - startX;
    const deltaY = y - startY;
    
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) hasDragged = true;

    targetRotY += deltaX * 0.4;
    targetRotX -= deltaY * 0.4;
    
    // Limitar la inclinación vertical para que no se voltee boca abajo
    targetRotX = Math.max(-80, Math.min(80, targetRotX));
    
    startX = x;
    startY = y;
}

function endDrag() {
    isDragging = false;
}

// Eventos de PC
universe.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', drag);
window.addEventListener('mouseup', endDrag);

// Eventos de Móvil
universe.addEventListener('touchstart', startDrag);
window.addEventListener('touchmove', drag);
window.addEventListener('touchend', endDrag);

// --- LÓGICA DE LA TARJETA ---
const modal = document.getElementById('modal');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const closeBtn = document.getElementById('close-btn');

function openModal(data) {
    modalIcon.innerText = data.icon;
    modalTitle.innerText = data.title;
    modalText.innerText = data.text;
    modal.classList.add('active');
}

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});