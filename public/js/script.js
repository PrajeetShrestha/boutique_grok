// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Client-side filtering and sorting (optional, if you want to keep it client-side)
document.getElementById('category-filter')?.addEventListener('change', () => {
    filterAndSortProducts();
});
document.getElementById('sort')?.addEventListener('change', () => {
    filterAndSortProducts();
});

function filterAndSortProducts() {
    // Placeholder: Server-side rendering handles this now
    // For client-side, you'd fetch updated products from an API endpoint
}

// Form Submission and Export Logic
if (document.getElementById('measurement-form')) {
    const form = document.getElementById('measurement-form');
    let formData = null;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const formInputs = new FormData(form);
        const data = Object.fromEntries(formInputs.entries());
        const orderDate = new Date().toLocaleString();

        // Structure the data for the API
        const submissionData = {
            customer: {
                fullName: data['full-name'],
                address: data.address,
                deliveryDate: data['delivery-date']
            },
            blouse: {
                length: parseFloat(data['blouse-length']),
                chest: parseFloat(data.chest),
                waist: parseFloat(data.waist),
                frontNeck: parseFloat(data['front-neck']),
                backNeck: parseFloat(data['back-neck']),
                shoulder: parseFloat(data.shoulder),
                sleevesLength: parseFloat(data['sleeves-length']),
                sleevesRound: parseFloat(data['sleeves-round']),
                armHole: parseFloat(data['arm-hole'])
            },
            lehenga: {
                length: parseFloat(data['lehenga-length']),
                waist: parseFloat(data['lehenga-waist'])
            },
            unit: data.unit,
            orderDate: orderDate
        };

        try {
            console.log('Submitting form data:', submissionData);
            // Send data to the server via API
            const response = await fetch('/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });

            console.log('API Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(`Failed to submit form: ${errorData.message || 'Unknown error'}`);
            }

            const responseData = await response.json();
            console.log('API Success:', responseData);

            formData = submissionData; // Store for export
            alert('Form submitted successfully! Use the buttons below to export your data.');
            document.querySelector('.export-buttons').style.display = 'flex'; // Show export buttons
        } catch (error) {
            console.error('Form submission error:', error);
            alert(`An error occurred while submitting the form: ${error.message}`);
        }
    });

    // Export to Email (Plain Text)
    document.getElementById('export-email')?.addEventListener('click', () => {
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

    // Export to PDF
    document.getElementById('export-pdf')?.addEventListener('click', () => {
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
        doc.line(10, 20, 200, 20);

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