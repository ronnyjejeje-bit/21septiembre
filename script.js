const galaxy = document.getElementById('galaxy');
const universe = document.getElementById('universe');

const messages = [
    { icon: '💛', title: 'Mi Centro', text: 'Eres el núcleo de este universo. Todo lo hermoso gira a tu alrededor.💜' },
    { icon: '🌻', title: 'Mi Sol', text: 'Tus sonrisas son como estas flores: brillantes y únicas.💜' },
    { icon: '✨', title: 'Magia Pura', text: 'Cada momento a tu lado es como flotar entre las estrellas.💜' },
    { icon: '💌', title: 'El Destino', text: 'Qué suerte tan increíble fue habernos encontrado en este universo.💜' },
    { icon: '🌹', title: 'Amor Infinito', text: 'Mi amor por ti seguirá brillando intacto siempre.💜' }
];

const billboards = []; // Ahora solo guardará las flores y textos (menos de 60 elementos)

function create3DElement(type, content, radiusMax, isInteractive = false, data = null) {
    const item = document.createElement('div');
    item.className = 'item';
    
    const theta = Math.random() * Math.PI * 2; 
    const phi = Math.acos((Math.random() * 2) - 1); 
    const r = Math.cbrt(Math.random()) * radiusMax; 
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = (r * Math.sin(phi) * Math.sin(theta)) * 0.4; 
    const z = r * Math.cos(phi);

    item.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    
    // OPTIMIZACIÓN CLAVE: Si es una estrella, no creamos un billboard ni calculamos su rotación
    if (type === 'star') {
        item.classList.add('star');
        const size = Math.random() * 2 + 1;
        item.style.width = `${size}px`;
        item.style.height = `${size}px`;
        galaxy.appendChild(item);
        return; 
    }
    
    const billboard = document.createElement('div');
    billboard.className = `billboard ${type}`;
    billboard.innerHTML = content;
    
    if (isInteractive) {
        billboard.classList.add('interactive');
        const clickHandler = (e) => {
            if (!hasDragged) openModal(data);
        };
        billboard.addEventListener('mouseup', clickHandler);
        billboard.addEventListener('touchend', clickHandler);
    }

    item.appendChild(billboard);
    galaxy.appendChild(item);
    billboards.push(billboard); // Solo metemos las flores, letras y botones aquí
}

// 1. Estrellas reducidas a 200 (Y ya no consumen cálculos por frame)
for (let i = 0; i < 200; i++) {
    create3DElement('star', '', 1000);
}

// 2. Flores balanceadas (35 es suficiente para verse bien sin causar lag)
const flowers = ['🌻', '🌼', '💛'💜'🌷'];
for (let i = 0; i < 35; i++) {
    create3DElement('flower', flowers[Math.floor(Math.random() * flowers.length)], 700);
}

// 3. Textos balanceados
const phrases = ["Te amo", "Eres mi sol", "Preciosa", "Única", "Mi reyna", "Me encantas", "Mi mochi", "Mi mujer", "Mi cielo"];
for (let i = 0; i < 15; i++) {
    create3DElement('text', phrases[Math.floor(Math.random() * phrases.length)], 600);
}

// 4. Los 5 NÚCLEOS interactivos
messages.forEach((msg, index) => {
    const distance = index === 0 ? 30 : 350 + Math.random() * 150;
    create3DElement('interactive', msg.icon, distance, true, msg);
});

// --- FÍSICA Y CONTROLES ---
let currentRotX = -15, currentRotY = 0;
let targetRotX = -15, targetRotY = 0;
let isDragging = false, hasDragged = false;
let startX, startY;

function animate() {
    if (!isDragging) { targetRotY -= 0.1; } // Rotación automática suave

    currentRotX += (targetRotX - currentRotX) * 0.1;
    currentRotY += (targetRotY - currentRotY) * 0.1;

    galaxy.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
    
    // Ahora esto solo se calcula para ~55 elementos, no para 650. Cero lag.
    billboards.forEach(b => {
        b.style.transform = `rotateY(${-currentRotY}deg) rotateX(${-currentRotX}deg)`;
    });

    requestAnimationFrame(animate);
}
animate();

// Lógica de Arrastre
function startDrag(e) {
    if(e.target.closest('#modal')) return; 
    isDragging = true; hasDragged = false;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
}

function drag(e) {
    if (!isDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = x - startX;
    const deltaY = y - startY;
    
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) hasDragged = true;

    targetRotY += deltaX * 0.3;
    targetRotX -= deltaY * 0.3;
    
    targetRotX = Math.max(-80, Math.min(80, targetRotX));
    
    startX = x; startY = y;
}

function endDrag() { isDragging = false; }

universe.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', drag);
window.addEventListener('mouseup', endDrag);

universe.addEventListener('touchstart', startDrag, {passive: false});
window.addEventListener('touchmove', drag, {passive: false});
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

closeBtn.addEventListener('click', () => { modal.classList.remove('active'); });
