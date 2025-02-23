#!/bin/bash

# Create main directory
mkdir -p boutique-website/{css,js,images}

# Create index.html (Home Page)
cat << 'EOF' > boutique-website/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - Boutique</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">Boutique</div>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="products.html">Products</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="about.html">About</a></li>
            </ul>
            <div class="hamburger">☰</div>
        </nav>
    </header>
    <main>
        <section class="hero">
            <h1>Unique Styles for Every Occasion</h1>
            <a href="products.html" class="btn">Shop Now</a>
        </section>
    </main>
    <footer>
        <p>© 2025 Boutique. All rights reserved.</p>
    </footer>
    <script src="js/script.js"></script>
</body>
</html>
EOF

# Create products.html (Products Page)
cat << 'EOF' > boutique-website/products.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products - Boutique</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">Boutique</div>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="products.html">Products</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="about.html">About</a></li>
            </ul>
            <div class="hamburger">☰</div>
        </nav>
    </header>
    <main>
        <section class="products-section">
            <h1>Our Collection</h1>
            <div class="filters">
                <select id="category-filter">
                    <option value="all">All Categories</option>
                    <option value="dresses">Dresses</option>
                    <option value="tops">Tops</option>
                    <option value="accessories">Accessories</option>
                </select>
                <select id="sort">
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A-Z</option>
                </select>
            </div>
            <div class="product-grid" id="product-grid">
                <!-- Products will be populated by JS -->
            </div>
            <div class="pagination" id="pagination">
                <!-- Pagination buttons will be added by JS -->
            </div>
        </section>
    </main>
    <footer>
        <p>© 2025 Boutique. All rights reserved.</p>
    </footer>
    <script src="js/script.js"></script>
</body>
</html>
EOF

# Create blog.html (Blog Page)
cat << 'EOF' > boutique-website/blog.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Boutique</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">Boutique</div>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="products.html">Products</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="about.html">About</a></li>
            </ul>
            <div class="hamburger">☰</div>
        </nav>
    </header>
    <main>
        <section class="blog-section">
            <h1>Blog</h1>
            <article>
                <h2>5 Ways to Style Our Signature Scarf</h2>
                <p>Explore creative ways to wear this versatile piece...</p>
            </article>
            <article>
                <h2>Spring Trends We’re Loving</h2>
                <p>Fresh looks to inspire your wardrobe...</p>
            </article>
        </section>
    </main>
    <footer>
        <p>© 2025 Boutique. All rights reserved.</p>
    </footer>
    <script src="js/script.js"></script>
</body>
</html>
EOF

# Create about.html (About Page)
cat << 'EOF' > boutique-website/about.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - Boutique</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">Boutique</div>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="products.html">Products</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="about.html">About</a></li>
            </ul>
            <div class="hamburger">☰</div>
        </nav>
    </header>
    <main>
        <section class="about-section">
            <h1>About Us</h1>
            <p>We’re a small boutique passionate about unique, sustainable fashion. Founded in 2025, our mission is to bring you styles that stand out and feel good.</p>
        </section>
    </main>
    <footer>
        <p>© 2025 Boutique. All rights reserved.</p>
    </footer>
    <script src="js/script.js"></script>
</body>
</html>
EOF

# Create styles.css (CSS)
cat << 'EOF' > boutique-website/css/styles.css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    line-height: 1.6;
    color: #333;
    background: #f9f9f9;
}

header {
    background: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    list-style: none;
}

.nav-links li {
    margin-left: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
}

.hamburger {
    display: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.btn {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    background: #333;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    transition: background 0.3s;
}

.btn:hover {
    background: #555;
}

/* Home Page */
.hero {
    text-align: center;
    padding: 4rem 2rem;
    background: url('../images/hero-bg.jpg') no-repeat center/cover;
    color: #fff;
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.hero h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
}

/* Products Page */
.products-section {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 2rem;
}

.products-section h1 {
    text-align: center;
    margin-bottom: 2rem;
}

.filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;
}

.filters select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.product-card {
    background: #fff;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.product-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 5px;
}

.product-card h3 {
    margin: 0.5rem 0;
}

.product-card p {
    color: #777;
}

.pagination {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
}

.pagination button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    border-radius: 5px;
}

.pagination button.active {
    background: #333;
    color: #fff;
}

/* Blog & About Pages */
.blog-section, .about-section {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 2rem;
}

.blog-section h1, .about-section h1 {
    text-align: center;
    margin-bottom: 2rem;
}

article {
    margin-bottom: 2rem;
}

footer {
    text-align: center;
    padding: 1rem;
    background: #fff;
    border-top: 1px solid #ddd;
    margin-top: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-links {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 60px;
        left: 0;
        width: 100%;
        background: #fff;
        padding: 1rem;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .nav-links.active {
        display: flex;
    }

    .nav-links li {
        margin: 0.5rem 0;
    }

    .hamburger {
        display: block;
    }

    .hero h1 {
        font-size: 1.8rem;
    }

    .filters {
        flex-direction: column;
        align-items: center;
    }
}
EOF

# Create script.js (JavaScript)
cat << 'EOF' > boutique-website/js/script.js
// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Product Data (Static for now, replace with API or backend later)
const products = [
    { id: 1, name: "Silk Dress", category: "dresses", price: 89.99, img: "images/dress.jpg" },
    { id: 2, name: "Cotton Top", category: "tops", price: 29.99, img: "images/top.jpg" },
    { id: 3, name: "Leather Bag", category: "accessories", price: 59.99, img: "images/bag.jpg" },
    { id: 4, name: "Floral Skirt", category: "dresses", price: 49.99, img: "images/skirt.jpg" },
    // Add more products as needed
];

const itemsPerPage = 3;
let currentPage = 1;

// Render Products
function renderProducts(filteredProducts, page) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    paginatedProducts.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
        `;
        productGrid.appendChild(card);
    });

    renderPagination(filteredProducts.length);
}

// Render Pagination
function renderPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        if (i === currentPage) button.classList.add('active');
        button.addEventListener('click', () => {
            currentPage = i;
            filterAndSortProducts();
        });
        pagination.appendChild(button);
    }
}

// Filter and Sort Products
function filterAndSortProducts() {
    const category = document.getElementById('category-filter')?.value || 'all';
    const sort = document.getElementById('sort')?.value || 'price-asc';

    let filteredProducts = [...products];
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (sort === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProducts(filteredProducts, currentPage);
}

// Event Listeners for Filters and Sorting
document.getElementById('category-filter')?.addEventListener('change', () => {
    currentPage = 1;
    filterAndSortProducts();
});
document.getElementById('sort')?.addEventListener('change', () => {
    currentPage = 1;
    filterAndSortProducts();
});

// Initial Render
if (document.getElementById('product-grid')) {
    filterAndSortProducts();
}
EOF

# Make the script executable
chmod +x create_boutique_website.sh

echo "Boutique website files and folders created successfully in ./boutique-website/"