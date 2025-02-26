#!/bin/bash

# Create index.html
cat << 'EOF' > index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trendy Threads</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Trendy Threads</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#shop">Shop</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <section id="products">
        <h2>Featured Items</h2>
        <div class="product-grid">
            <div class="product">
                <img src="https://via.placeholder.com/150" alt="T-Shirt">
                <h3>Classic Tee</h3>
                <p>$19.99</p>
                <button onclick="addToCart('Classic Tee', 19.99)">Add to Cart</button>
            </div>
            <div class="product">
                <img src="https://via.placeholder.com/150" alt="Jeans">
                <h3>Slim Jeans</h3>
                <p>$39.99</p>
                <button onclick="addToCart('Slim Jeans', 39.99)">Add to Cart</button>
            </div>
            <div class="product">
                <img src="https://via.placeholder.com/150" alt="Jacket">
                <h3>Denim Jacket</h3>
                <p>$59.99</p>
                <button onclick="addToCart('Denim Jacket', 59.99)">Add to Cart</button>
            </div>
        </div>
    </section>

    <div id="cart">
        <h2>Cart</h2>
        <ul id="cart-items"></ul>
        <p>Total: $<span id="cart-total">0.00</span></p>
    </div>

    <footer>
        <p>© 2025 Trendy Threads. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
EOF

# Create styles.css
cat << 'EOF' > styles.css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

header {
    background-color: #333;
    color: white;
    padding: 1rem;
    text-align: center;
}

header h1 {
    margin: 0;
}

nav ul {
    list-style: none;
    padding: 0;
}

nav ul li {
    display: inline;
    margin: 0 10px;
}

nav ul li a {
    color: white;
    text-decoration: none;
}

#products {
    padding: 2rem;
    text-align: center;
}

.product-grid {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.product {
    background-color: white;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    width: 200px;
}

.product img {
    max-width: 100%;
}

.product button {
    background-color: #333;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
}

.product button:hover {
    background-color: #555;
}

#cart {
    padding: 2rem;
    text-align: center;
}

#cart-items {
    list-style: none;
    padding: 0;
}

footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 1rem;
    position: fixed;
    bottom: 0;
    width: 100%;
}
EOF

# Create script.js
cat << 'EOF' > script.js
let cart = [];
let total = 0;

function addToCart(itemName, price) {
    cart.push({ name: itemName, price: price });
    total += price;
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        cartItems.appendChild(li);
    });
    
    cartTotal.textContent = total.toFixed(2);
}
EOF

# Make the script executable (optional, for running it directly later)
chmod +x "$0"

echo "Files created: index.html, styles.css, script.js"
echo "You can now open index.html in a browser!"`