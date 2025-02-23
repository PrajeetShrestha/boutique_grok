// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Product Data (Static for now, replace with API or backend later)
const products = [
    { id: 1, name: "Silk Dress", category: "dresses", price: 89.99, img: "https://picsum.photos/id/1/300/533", color: "Red", fabric: "Silk", description: "Elegant silk dress perfect for evening wear." },
    { id: 2, name: "Cotton Top", category: "tops", price: 29.99, img: "https://picsum.photos/id/2/300/533", color: "White", fabric: "Cotton", description: "Light and breathable cotton top for casual days." },
    { id: 3, name: "Leather Bag", category: "accessories", price: 59.99, img: "https://picsum.photos/id/3/300/533", color: "Black", fabric: "Leather", description: "Stylish leather bag for all occasions." },
    { id: 4, name: "Floral Skirt", category: "dresses", price: 49.99, img: "https://picsum.photos/id/4/300/533", color: "Multicolor", fabric: "Polyester", description: "Vibrant floral skirt for a summery look." },
    { id: 5, name: "Velvet Blouse", category: "tops", price: 39.99, img: "https://picsum.photos/id/5/300/533", color: "Navy", fabric: "Velvet", description: "Luxurious velvet blouse with a soft touch." },
    { id: 6, name: "Denim Dress", category: "dresses", price: 69.99, img: "https://picsum.photos/id/6/300/533", color: "Blue", fabric: "Denim", description: "Classic denim dress with a modern twist." },
    { id: 7, name: "Wool Scarf", category: "accessories", price: 19.99, img: "https://picsum.photos/id/7/300/533", color: "Grey", fabric: "Wool", description: "Warm wool scarf for chilly days." },
    { id: 8, name: "Linen Top", category: "tops", price: 34.99, img: "https://picsum.photos/id/8/300/533", color: "Beige", fabric: "Linen", description: "Cool linen top for a relaxed vibe." },
    { id: 9, name: "Chiffon Dress", category: "dresses", price: 79.99, img: "https://picsum.photos/id/9/300/533", color: "Pink", fabric: "Chiffon", description: "Flowy chiffon dress for a dreamy look." },
    { id: 10, name: "Suede Clutch", category: "accessories", price: 49.99, img: "https://picsum.photos/id/10/300/533", color: "Brown", fabric: "Suede", description: "Chic suede clutch for evening outings." },
    { id: 11, name: "Pleated Skirt", category: "dresses", price: 54.99, img: "https://picsum.photos/id/11/300/533", color: "Green", fabric: "Polyester", description: "Elegant pleated skirt with a bold color." },
    { id: 12, name: "Silk Scarf", category: "accessories", price: 24.99, img: "https://picsum.photos/id/12/300/533", color: "Purple", fabric: "Silk", description: "Smooth silk scarf with vibrant hues." },
    { id: 13, name: "Knit Top", category: "tops", price: 27.99, img: "https://picsum.photos/id/13/300/533", color: "Yellow", fabric: "Wool", description: "Cozy knit top for cooler weather." },
    { id: 14, name: "Maxi Dress", category: "dresses", price: 99.99, img: "https://picsum.photos/id/14/300/533", color: "Teal", fabric: "Cotton", description: "Floor-length maxi dress for a bold statement." },
    { id: 15, name: "Canvas Tote", category: "accessories", price: 39.99, img: "https://picsum.photos/id/15/300/533", color: "Natural", fabric: "Canvas", description: "Durable canvas tote for everyday use." },
    { id: 16, name: "Crop Top", category: "tops", price: 19.99, img: "https://picsum.photos/id/16/300/533", color: "Black", fabric: "Cotton", description: "Trendy crop top for a youthful look." },
    { id: 17, name: "A-Line Dress", category: "dresses", price: 64.99, img: "https://picsum.photos/id/17/300/533", color: "Red", fabric: "Polyester", description: "Flattering A-line dress for any occasion." },
    { id: 18, name: "Beaded Bag", category: "accessories", price: 69.99, img: "https://picsum.photos/id/18/300/533", color: "Gold", fabric: "Satin", description: "Glamorous beaded bag for special events." },
    { id: 19, name: "Tank Top", category: "tops", price: 14.99, img: "https://picsum.photos/id/19/300/533", color: "White", fabric: "Cotton", description: "Simple tank top for layering or solo wear." },
    { id: 20, name: "Wrap Dress", category: "dresses", price: 74.99, img: "https://picsum.photos/id/20/300/533", color: "Blue", fabric: "Silk", description: "Versatile wrap dress with a flattering fit." },
    { id: 21, name: "Leather Belt", category: "accessories", price: 29.99, img: "https://picsum.photos/id/21/300/533", color: "Brown", fabric: "Leather", description: "Classic leather belt to cinch any outfit." },
    { id: 22, name: "Tunic Top", category: "tops", price: 32.99, img: "https://picsum.photos/id/22/300/533", color: "Olive", fabric: "Cotton", description: "Flowy tunic top for effortless style." },
    { id: 23, name: "Shift Dress", category: "dresses", price: 59.99, img: "https://picsum.photos/id/23/300/533", color: "Black", fabric: "Polyester", description: "Sleek shift dress for a minimalist look." },
    { id: 24, name: "Straw Hat", category: "accessories", price: 22.99, img: "https://picsum.photos/id/24/300/533", color: "Natural", fabric: "Straw", description: "Light straw hat for sunny days." },
    { id: 25, name: "Peasant Top", category: "tops", price: 36.99, img: "https://picsum.photos/id/25/300/533", color: "Cream", fabric: "Cotton", description: "Boho-style peasant top with soft fabric." },
    { id: 26, name: "Cocktail Dress", category: "dresses", price: 109.99, img: "https://picsum.photos/id/26/300/533", color: "Emerald", fabric: "Satin", description: "Stunning cocktail dress for parties." },
    { id: 27, name: "Crossbody Bag", category: "accessories", price: 44.99, img: "https://picsum.photos/id/27/300/533", color: "Tan", fabric: "Leather", description: "Practical crossbody bag for on-the-go." },
    { id: 28, name: "Ruffle Top", category: "tops", price: 24.99, img: "https://picsum.photos/id/28/300/533", color: "Pink", fabric: "Chiffon", description: "Playful ruffle top with a feminine touch." },
    { id: 29, name: "Midi Dress", category: "dresses", price: 84.99, img: "https://picsum.photos/id/29/300/533", color: "Navy", fabric: "Cotton", description: "Chic midi dress for day-to-night wear." },
    { id: 30, name: "Hoop Earrings", category: "accessories", price: 15.99, img: "https://picsum.photos/id/30/300/533", color: "Silver", fabric: "Metal", description: "Bold hoop earrings to elevate any look." },
    { id: 31, name: "Off-Shoulder Top", category: "tops", price: 31.99, img: "https://picsum.photos/id/31/300/533", color: "White", fabric: "Cotton", description: "Trendy off-shoulder top for summer." },
    { id: 32, name: "Slip Dress", category: "dresses", price: 44.99, img: "https://picsum.photos/id/32/300/533", color: "Black", fabric: "Silk", description: "Sleek slip dress for layering or solo." },
    { id: 33, name: "Tote Bag", category: "accessories", price: 54.99, img: "https://picsum.photos/id/33/300/533", color: "Blue", fabric: "Canvas", description: "Spacious tote bag for daily essentials." },
    { id: 34, name: "Button-Up Top", category: "tops", price: 28.99, img: "https://picsum.photos/id/34/300/533", color: "Green", fabric: "Cotton", description: "Crisp button-up top for a polished look." },
    { id: 35, name: "Sundress", category: "dresses", price: 39.99, img: "https://picsum.photos/id/35/300/533", color: "Yellow", fabric: "Cotton", description: "Bright sundress for warm days." },
    { id: 36, name: "Statement Necklace", category: "accessories", price: 34.99, img: "https://picsum.photos/id/36/300/533", color: "Gold", fabric: "Metal", description: "Eye-catching necklace for bold style." },
    { id: 37, name: "Halter Top", category: "tops", price: 21.99, img: "https://picsum.photos/id/37/300/533", color: "Red", fabric: "Polyester", description: "Sassy halter top for a fun look." },
    { id: 38, name: "Sheath Dress", category: "dresses", price: 94.99, img: "https://picsum.photos/id/38/300/533", color: "Black", fabric: "Polyester", description: "Fitted sheath dress for formal occasions." },
    { id: 39, name: "Woven Clutch", category: "accessories", price: 49.99, img: "https://picsum.photos/id/39/300/533", color: "Natural", fabric: "Straw", description: "Textured woven clutch for a rustic vibe." },
    { id: 40, name: "Sleeveless Top", category: "tops", price: 17.99, img: "https://picsum.photos/id/40/300/533", color: "Grey", fabric: "Cotton", description: "Simple sleeveless top for layering." },
    { id: 41, name: "Pencil Skirt", category: "dresses", price: 52.99, img: "https://picsum.photos/id/41/300/533", color: "Navy", fabric: "Polyester", description: "Slim pencil skirt for a tailored fit." },
    { id: 42, name: "Silk Tie", category: "accessories", price: 19.99, img: "https://picsum.photos/id/42/300/533", color: "Blue", fabric: "Silk", description: "Smooth silk tie for a refined touch." },
    { id: 43, name: "Blazer Top", category: "tops", price: 45.99, img: "https://picsum.photos/id/43/300/533", color: "Black", fabric: "Wool", description: "Structured blazer top for work or play." },
    { id: 44, name: "Evening Gown", category: "dresses", price: 129.99, img: "https://picsum.photos/id/44/300/533", color: "Purple", fabric: "Satin", description: "Glamorous evening gown for special nights." },
    { id: 45, name: "Leather Wallet", category: "accessories", price: 39.99, img: "https://picsum.photos/id/45/300/533", color: "Brown", fabric: "Leather", description: "Compact leather wallet for essentials." },
    { id: 46, name: "Cropped Shirt", category: "tops", price: 26.99, img: "https://picsum.photos/id/46/300/533", color: "White", fabric: "Cotton", description: "Stylish cropped shirt for a modern edge." },
    { id: 47, name: "Fit & Flare Dress", category: "dresses", price: 79.99, img: "https://picsum.photos/id/47/300/533", color: "Red", fabric: "Cotton", description: "Flattering fit and flare dress for all." },
    { id: 48, name: "Beaded Scarf", category: "accessories", price: 27.99, img: "https://picsum.photos/id/48/300/533", color: "Multicolor", fabric: "Silk", description: "Intricate beaded scarf for a unique look." },
    { id: 49, name: "Graphic Tee", category: "tops", price: 19.99, img: "https://picsum.photos/id/49/300/533", color: "Grey", fabric: "Cotton", description: "Casual graphic tee with bold design." },
    { id: 50, name: "Tulle Skirt", category: "dresses", price: 64.99, img: "https://picsum.photos/id/50/300/533", color: "Pink", fabric: "Tulle", description: "Ethereal tulle skirt for a fairy-tale vibe." },
    { id: 51, name: "Felt Hat", category: "accessories", price: 29.99, img: "https://picsum.photos/id/51/300/533", color: "Black", fabric: "Felt", description: "Stylish felt hat for a cool finish." },
    { id: 52, name: "Long Sleeve Top", category: "tops", price: 33.99, img: "https://picsum.photos/id/52/300/533", color: "Blue", fabric: "Cotton", description: "Versatile long sleeve top for any season." },
    { id: 53, name: "Shirt Dress", category: "dresses", price: 59.99, img: "https://picsum.photos/id/53/300/533", color: "White", fabric: "Cotton", description: "Crisp shirt dress for a clean look." },
    { id: 54, name: "Chain Necklace", category: "accessories", price: 24.99, img: "https://picsum.photos/id/54/300/533", color: "Gold", fabric: "Metal", description: "Simple chain necklace for everyday wear." },
    { id: 55, name: "Polo Top", category: "tops", price: 22.99, img: "https://picsum.photos/id/55/300/533", color: "Navy", fabric: "Cotton", description: "Classic polo top for a sporty feel." },
    { id: 56, name: "Jumper Dress", category: "dresses", price: 69.99, img: "https://picsum.photos/id/56/300/533", color: "Grey", fabric: "Wool", description: "Cozy jumper dress for layering." },
    { id: 57, name: "Sunglasses", category: "accessories", price: 34.99, img: "https://picsum.photos/id/57/300/533", color: "Black", fabric: "Plastic", description: "Sleek sunglasses for sunny days." },
    { id: 58, name: "V-Neck Top", category: "tops", price: 25.99, img: "https://picsum.photos/id/58/300/533", color: "Red", fabric: "Cotton", description: "Flattering V-neck top for casual wear." },
    { id: 59, name: "Bodycon Dress", category: "dresses", price: 74.99, img: "https://picsum.photos/id/59/300/533", color: "Black", fabric: "Polyester", description: "Fitted bodycon dress for a night out." },
    { id: 60, name: "Bracelet Set", category: "accessories", price: 19.99, img: "https://picsum.photos/id/60/300/533", color: "Silver", fabric: "Metal", description: "Dainty bracelet set for stacking." },
    { id: 61, name: "Sweater Top", category: "tops", price: 39.99, img: "https://picsum.photos/id/61/300/533", color: "Beige", fabric: "Wool", description: "Warm sweater top for cool days." },
    { id: 62, name: "Peplum Dress", category: "dresses", price: 84.99, img: "https://picsum.photos/id/62/300/533", color: "Pink", fabric: "Polyester", description: "Chic peplum dress with a playful flair." },
    { id: 63, name: "Satchel Bag", category: "accessories", price: 59.99, img: "https://picsum.photos/id/63/300/533", color: "Brown", fabric: "Leather", description: "Structured satchel bag for work or play." },
    { id: 64, name: "Camisole", category: "tops", price: 16.99, img: "https://picsum.photos/id/64/300/533", color: "White", fabric: "Silk", description: "Delicate camisole for layering." },
    { id: 65, name: "Tiered Dress", category: "dresses", price: 89.99, img: "https://picsum.photos/id/65/300/533", color: "Yellow", fabric: "Cotton", description: "Fun tiered dress for a breezy look." },
    { id: 66, name: "Stud Earrings", category: "accessories", price: 14.99, img: "https://picsum.photos/id/66/300/533", color: "Gold", fabric: "Metal", description: "Subtle stud earrings for everyday." },
    { id: 67, name: "Bodysuit Top", category: "tops", price: 29.99, img: "https://picsum.photos/id/67/300/533", color: "Black", fabric: "Polyester", description: "Sleek bodysuit top for a fitted look." },
    { id: 68, name: "High-Low Dress", category: "dresses", price: 79.99, img: "https://picsum.photos/id/68/300/533", color: "Teal", fabric: "Chiffon", description: "Dramatic high-low dress for flair." },
    { id: 69, name: "Backpack", category: "accessories", price: 49.99, img: "https://picsum.photos/id/69/300/533", color: "Grey", fabric: "Canvas", description: "Practical backpack for daily use." },
    { id: 70, name: "Wrap Top", category: "tops", price: 34.99, img: "https://picsum.photos/id/70/300/533", color: "Red", fabric: "Cotton", description: "Elegant wrap top with a flattering fit." },
    { id: 71, name: "Flared Skirt", category: "dresses", price: 54.99, img: "https://picsum.photos/id/71/300/533", color: "Blue", fabric: "Polyester", description: "Playful flared skirt for movement." },
    { id: 72, name: "Pendant Necklace", category: "accessories", price: 29.99, img: "https://picsum.photos/id/72/300/533", color: "Silver", fabric: "Metal", description: "Delicate pendant necklace for charm." },
    { id: 73, name: "Henley Top", category: "tops", price: 27.99, img: "https://picsum.photos/id/73/300/533", color: "Green", fabric: "Cotton", description: "Casual henley top with buttons." },
    { id: 74, name: "Smock Dress", category: "dresses", price: 69.99, img: "https://picsum.photos/id/74/300/533", color: "White", fabric: "Cotton", description: "Relaxed smock dress for comfort." },
    { id: 75, name: "Watch", category: "accessories", price: 89.99, img: "https://picsum.photos/id/75/300/533", color: "Black", fabric: "Leather", description: "Sleek watch for timeless style." },
    { id: 76, name: "Ribbed Top", category: "tops", price: 23.99, img: "https://picsum.photos/id/76/300/533", color: "Navy", fabric: "Cotton", description: "Textured ribbed top for a snug fit." },
    { id: 77, name: "Trapeze Dress", category: "dresses", price: 64.99, img: "https://picsum.photos/id/77/300/533", color: "Orange", fabric: "Polyester", description: "Flowy trapeze dress for ease." },
    { id: 78, name: "Bangle", category: "accessories", price: 19.99, img: "https://picsum.photos/id/78/300/533", color: "Gold", fabric: "Metal", description: "Bold bangle for wrist flair." },
    { id: 79, name: "Tube Top", category: "tops", price: 18.99, img: "https://picsum.photos/id/79/300/533", color: "Pink", fabric: "Polyester", description: "Fitted tube top for a sleek look." },
    { id: 80, name: "Kaftan Dress", category: "dresses", price: 99.99, img: "https://picsum.photos/id/80/300/533", color: "Multicolor", fabric: "Cotton", description: "Boho kaftan dress for a free spirit." },
    { id: 81, name: "Tassel Bag", category: "accessories", price: 44.99, img: "https://picsum.photos/id/81/300/533", color: "Tan", fabric: "Leather", description: "Fun tassel bag for a playful touch." },
    { id: 82, name: "Peplum Top", category: "tops", price: 31.99, img: "https://picsum.photos/id/82/300/533", color: "White", fabric: "Cotton", description: "Chic peplum top with a flared hem." },
    { id: 83, name: "Boho Dress", category: "dresses", price: 74.99, img: "https://picsum.photos/id/83/300/533", color: "Beige", fabric: "Cotton", description: "Flowy boho dress for a laid-back vibe." },
    { id: 84, name: "Drop Earrings", category: "accessories", price: 24.99, img: "https://picsum.photos/id/84/300/533", color: "Silver", fabric: "Metal", description: "Elegant drop earrings for a statement." },
    { id: 85, name: "Mock Neck Top", category: "tops", price: 26.99, img: "https://picsum.photos/id/85/300/533", color: "Black", fabric: "Cotton", description: "Sleek mock neck top for a modern look." },
    { id: 86, name: "Asymmetric Dress", category: "dresses", price: 84.99, img: "https://picsum.photos/id/86/300/533", color: "Red", fabric: "Polyester", description: "Unique asymmetric dress for drama." },
    { id: 87, name: "Mini Backpack", category: "accessories", price: 39.99, img: "https://picsum.photos/id/87/300/533", color: "Blue", fabric: "Canvas", description: "Cute mini backpack for light travel." },
    { id: 88, name: "Lace Top", category: "tops", price: 35.99, img: "https://picsum.photos/id/88/300/533", color: "White", fabric: "Lace", description: "Delicate lace top for a romantic feel." },
    { id: 89, name: "Sweater Dress", category: "dresses", price: 94.99, img: "https://picsum.photos/id/89/300/533", color: "Grey", fabric: "Wool", description: "Cozy sweater dress for fall." },
    { id: 90, name: "Ankle Bracelet", category: "accessories", price: 17.99, img: "https://picsum.photos/id/90/300/533", color: "Silver", fabric: "Metal", description: "Subtle ankle bracelet for a touch of shine." },
    { id: 91, name: "Bell Sleeve Top", category: "tops", price: 32.99, img: "https://picsum.photos/id/91/300/533", color: "Purple", fabric: "Cotton", description: "Flared bell sleeve top for flair." },
    { id: 92, name: "Pinafore Dress", category: "dresses", price: 59.99, img: "https://picsum.photos/id/92/300/533", color: "Green", fabric: "Cotton", description: "Playful pinafore dress for layering." },
    { id: 93, name: "Bucket Hat", category: "accessories", price: 19.99, img: "https://picsum.photos/id/93/300/533", color: "Black", fabric: "Cotton", description: "Trendy bucket hat for a cool vibe." },
    { id: 94, name: "Tie-Front Top", category: "tops", price: 28.99, img: "https://picsum.photos/id/94/300/533", color: "Yellow", fabric: "Cotton", description: "Chic tie-front top for a cute detail." },
    { id: 95, name: "Empire Dress", category: "dresses", price: 79.99, img: "https://picsum.photos/id/95/300/533", color: "Navy", fabric: "Polyester", description: "Elegant empire dress with a high waist." },
    { id: 96, name: "Charm Bracelet", category: "accessories", price: 29.99, img: "https://picsum.photos/id/96/300/533", color: "Gold", fabric: "Metal", description: "Charming bracelet with playful charms." },
    { id: 97, name: "Oversized Top", category: "tops", price: 24.99, img: "https://picsum.photos/id/97/300/533", color: "Grey", fabric: "Cotton", description: "Relaxed oversized top for comfort." },
    { id: 98, name: "T-shirt Dress", category: "dresses", price: 44.99, img: "https://picsum.photos/id/98/300/533", color: "Black", fabric: "Cotton", description: "Casual T-shirt dress for easy wear." },
    { id: 99, name: "Fanny Pack", category: "accessories", price: 34.99, img: "https://picsum.photos/id/99/300/533", color: "Red", fabric: "Nylon", description: "Trendy fanny pack for hands-free style." },
    { id: 100, name: "Kimono Top", category: "tops", price: 39.99, img: "https://picsum.photos/id/100/300/533", color: "Multicolor", fabric: "Polyester", description: "Flowy kimono top for a boho touch." }
];

const itemsPerPage = 20;
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
        card.addEventListener('click', () => {
            window.location.href = `detail.html?id=${product.id}`;
        });
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

// Detail Page Logic
function renderProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) return;

    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-color').textContent = `Color: ${product.color}`;
    document.getElementById('product-fabric').textContent = `Fabric: ${product.fabric}`;
    document.getElementById('product-description').textContent = product.description;

    const gallery = document.getElementById('product-gallery');
    gallery.innerHTML = '';
    // Simulate additional images using Picsum by offsetting the ID
    for (let i = 0; i < 3; i++) {
        const img = document.createElement('img');
        img.src = `https://picsum.photos/id/${product.id + i}/300/533`;
        img.alt = `${product.name} View ${i + 1}`;
        gallery.appendChild(img);
    }
}

// Initial Render
if (document.getElementById('product-grid')) {
    filterAndSortProducts();
} else if (document.getElementById('product-detail')) {
    renderProductDetail();
}

// Measurement Form Submission
if (document.getElementById('measurement-form')) {
    let formData = null;

    document.getElementById('measurement-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const orderDate = new Date().toLocaleString();
        const unit = document.querySelector('input[name="unit"]:checked').value;
        formData = {
            customer: {
                fullName: document.getElementById('full-name').value,
                address: document.getElementById('address').value,
                deliveryDate: document.getElementById('delivery-date').value
            },
            blouse: {
                length: document.getElementById('blouse-length').value,
                chest: document.getElementById('chest').value,
                waist: document.getElementById('waist').value,
                frontNeck: document.getElementById('front-neck').value,
                backNeck: document.getElementById('back-neck').value,
                shoulder: document.getElementById('shoulder').value,
                sleevesLength: document.getElementById('sleeves-length').value,
                sleevesRound: document.getElementById('sleeves-round').value,
                armHole: document.getElementById('arm-hole').value
            },
            lehenga: {
                length: document.getElementById('lehenga-length').value,
                waist: document.getElementById('lehenga-waist').value
            },
            unit: unit,
            orderDate: orderDate
        };
        alert('Form submitted! Use the buttons below to export your data.');
    });

    // Export to Email (Plain Text)
    document.getElementById('export-email').addEventListener('click', () => {
        if (!formData) {
            alert('Please submit the form first!');
            return;
        }
        const textContent = `
Boutique Order Details
----------------------------------------

Customer Information
----------------------------------------
Full Name: ${formData.customer.fullName}
Address:
${formData.customer.address}
Delivery Date: ${formData.customer.deliveryDate}
Order Date: ${formData.orderDate}

Measurements (${formData.unit})
----------------------------------------
Blouse
----------------------------------------
Length: ${formData.blouse.length}
Chest: ${formData.blouse.chest}
Waist: ${formData.blouse.waist}
Front Neck Depth: ${formData.blouse.frontNeck}
Back Neck Depth: ${formData.blouse.backNeck}
Shoulder Width: ${formData.blouse.shoulder}
Sleeves Length: ${formData.blouse.sleevesLength}
Sleeves Round: ${formData.blouse.sleevesRound}
Arm Hole: ${formData.blouse.armHole}

Lehenga
----------------------------------------
Length: ${formData.lehenga.length}
Waist: ${formData.lehenga.waist}

----------------------------------------
© 2025 Boutique
        `;
        const subject = encodeURIComponent(`Order Measurements for ${formData.customer.fullName}`);
        const body = encodeURIComponent(textContent);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });

    // Export to PDF (Remains Professional)
    document.getElementById('export-pdf').addEventListener('click', () => {
        if (!formData) {
            alert('Please submit the form first!');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.setTextColor(51, 51, 51); // #333
        doc.text('Boutique Order Details', 105, 15, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line(10, 20, 200, 20); // Horizontal line

        // Customer Details
        doc.setFontSize(14);
        doc.setTextColor(85, 85, 85); // #555
        doc.text('Customer Information', 10, 30);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Black
        doc.text(`Full Name: ${formData.customer.fullName}`, 10, 40);
        doc.text('Address:', 10, 50);
        doc.text(formData.customer.address, 10, 55, { maxWidth: 180 });
        let yOffset = 55 + Math.ceil(formData.customer.address.length / 90) * 5; // Adjust for address length
        doc.text(`Delivery Date: ${formData.customer.deliveryDate}`, 10, yOffset + 10);
        doc.text(`Order Date: ${formData.orderDate}`, 10, yOffset + 20);

        // Measurements
        yOffset += 30;
        doc.setFontSize(14);
        doc.setTextColor(85, 85, 85); // #555
        doc.text(`Measurements (${formData.unit})`, 10, yOffset);
        doc.setFontSize(12);
        doc.setTextColor(119, 119, 119); // #777
        doc.text('Blouse', 10, yOffset + 10);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Length: ${formData.blouse.length}`, 10, yOffset + 20);
        doc.text(`Chest: ${formData.blouse.chest}`, 10, yOffset + 30);
        doc.text(`Waist: ${formData.blouse.waist}`, 10, yOffset + 40);
        doc.text(`Front Neck Depth: ${formData.blouse.frontNeck}`, 10, yOffset + 50);
        doc.text(`Back Neck Depth: ${formData.blouse.backNeck}`, 10, yOffset + 60);
        doc.text(`Shoulder Width: ${formData.blouse.shoulder}`, 10, yOffset + 70);
        doc.text(`Sleeves Length: ${formData.blouse.sleevesLength}`, 10, yOffset + 80);
        doc.text(`Sleeves Round: ${formData.blouse.sleevesRound}`, 10, yOffset + 90);
        doc.text(`Arm Hole: ${formData.blouse.armHole}`, 10, yOffset + 100);

        doc.setFontSize(12);
        doc.setTextColor(119, 119, 119); // #777
        doc.text('Lehenga', 10, yOffset + 110);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Length: ${formData.lehenga.length}`, 10, yOffset + 120);
        doc.text(`Waist: ${formData.lehenga.waist}`, 10, yOffset + 130);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(119, 119, 119); // #777
        doc.text('© 2025 Boutique', 105, 290, { align: 'center' });

        doc.save(`Order_${formData.customer.fullName}_${formData.orderDate.replace(/[, :]/g, '_')}.pdf`);
    });
}