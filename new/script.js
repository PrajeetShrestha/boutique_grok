document.getElementById("categoryFilter").addEventListener("change", function() {
    let category = this.value;
    let products = document.querySelectorAll(".product");

    products.forEach(product => {
        if (category === "all" || product.getAttribute("data-category") === category) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
});

// Pagination Logic
const itemsPerPage = 10;
let currentPage = 1;
let allProducts = Array.from(document.querySelectorAll(".product"));

function showPage(page) {
    let start = (page - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    allProducts.forEach((product, index) => {
        if (index >= start && index < end) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

function nextPage() {
    if (currentPage * itemsPerPage < allProducts.length) {
        currentPage++;
        showPage(currentPage);
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    showPage(currentPage);
    document.getElementById("nextPage").addEventListener("click", nextPage);
    document.getElementById("prevPage").addEventListener("click", prevPage);
});
