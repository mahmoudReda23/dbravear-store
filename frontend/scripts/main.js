let cart = [];

// جلب البيانات
async function fetchProducts() {
    const container = document.getElementById('products-container');
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        container.innerHTML = '<p style="color:red; text-align:center;">تعذر تحميل المنتجات. تأكد من تشغيل السيرفر.</p>';
    }
}

// عرض المنتجات
function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = products.map(p => {
        const isOut = p.stock <= 0 || p.is_available == 0;
        return `
            <div class="product-card" style="opacity: ${isOut ? '0.6' : '1'}">
                <img src="${p.image_url}" alt="${p.name}">
                <div class="product-info">
                    <small>${p.category}</small>
                    <h3>${p.name}</h3>
                    <p class="price">${p.price} ج.م</p>
                    <p class="stock">${isOut ? '<span style="color:red">غير متوفر</span>' : 'المخزون: ' + p.stock}</p>
                    <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})" ${isOut ? 'disabled' : ''} class="add-to-cart-btn">
                        ${isOut ? 'انتهى' : 'أضف للسلة'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// نظام السلة
function addToCart(id, name, price) {
    const item = cart.find(i => i.id === id);
    if (item) item.quantity++;
    else cart.push({ id, name, price, quantity: 1 });
    updateCart();
}

function updateCart() {
    document.getElementById('cart-count').innerText = cart.reduce((s, i) => s + i.quantity, 0);
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map(i => `
        <div class="cart-item">
            <span>${i.name} (x${i.quantity})</span>
            <span>${i.price * i.quantity} ج.م</span>
        </div>
    `).join('');
    document.getElementById('cart-total').innerText = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

// البحث
document.getElementById('search-btn').onclick = () => {
    const term = document.getElementById('user-search').value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(term) ? 'block' : 'none';
    });
};

// الفلترة
function filterProducts(cat) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const category = card.querySelector('small').innerText;
        card.style.display = (cat === 'الكل' || category === cat) ? 'block' : 'none';
    });
}

window.onload = fetchProducts;