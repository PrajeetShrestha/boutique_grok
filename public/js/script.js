// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Client-side filtering and sorting (optional, if you want to keep it)
document.getElementById('category-filter')?.addEventListener('change', () => {
    filterAndSortProducts();
});
document.getElementById('sort')?.addEventListener('change', () => {
    filterAndSortProducts();
});

function filterAndSortProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    const products = Array.from(productGrid.querySelectorAll('.product-card'));
    products.forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.productId;
            window.location.href = `/detail/${productId}`;
        });
        card.style.cursor = 'pointer';
    });
}

// Form Export Logic
if (document.getElementById('measurement-form')) {
    document.getElementById('export-email')?.addEventListener('click', () => {
        // Server-side data is already rendered; this is a placeholder
        const formData = JSON.parse(document.querySelector('#form-data')?.textContent || '{}');
        if (!Object.keys(formData).length) return alert('No form data available!');
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

    document.getElementById('export-pdf')?.addEventListener('click', () => {
        const formData = JSON.parse(document.querySelector('#form-data')?.textContent || '{}');
        if (!Object.keys(formData).length) return alert('No form data available!');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(51, 51, 51);
        doc.text('Boutique Order Details', 105, 15, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line(10, 20, 200, 20);

        doc.setFontSize(14);
        doc.setTextColor(85, 85, 85);
        doc.text('Customer Information', 10, 30);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Full Name: ${formData.customer.fullName}`, 10, 40);
        doc.text('Address:', 10, 50);
        doc.text(formData.customer.address, 10, 55, { maxWidth: 180 });
        let yOffset = 55 + Math.ceil(formData.customer.address.length / 90) * 5;
        doc.text(`Delivery Date: ${formData.customer.deliveryDate}`, 10, yOffset + 10);
        doc.text(`Order Date: ${formData.orderDate}`, 10, yOffset + 20);

        yOffset += 30;
        doc.setFontSize(14);
        doc.setTextColor(85, 85, 85);
        doc.text(`Measurements (${formData.unit})`, 10, yOffset);
        doc.setFontSize(12);
        doc.setTextColor(119, 119, 119);
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
        doc.setTextColor(119, 119, 119);
        doc.text('Lehenga', 10, yOffset + 110);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Length: ${formData.lehenga.length}`, 10, yOffset + 120);
        doc.text(`Waist: ${formData.lehenga.waist}`, 10, yOffset + 130);

        doc.setFontSize(8);
        doc.setTextColor(119, 119, 119);
        doc.text('© 2025 Boutique', 105, 290, { align: 'center' });

        doc.save(`Order_${formData.customer.fullName}_${formData.orderDate.replace(/[, :]/g, '_')}.pdf`);
    });
}