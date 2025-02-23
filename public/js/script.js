// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
        console.log('Hamburger clicked, nav-links active:', navLinks.classList.contains('active'));
    } else {
        console.error('nav-links not found');
    }
});

window.addEventListener('scroll', () => {
    document.querySelector('header').classList.toggle('scrolled', window.scrollY > 50);
});

// Client-side filtering and sorting (optional)
document.getElementById('category-filter')?.addEventListener('change', () => {
    filterAndSortProducts();
});
document.getElementById('sort')?.addEventListener('change', () => {
    filterAndSortProducts();
});

function filterAndSortProducts() {
    // Placeholder: Server-side rendering handles this now
}

// Product Card Click Handler
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = card.getAttribute('data-id');
        if (productId) {
            window.location.href = `/detail?id=${productId}`;
        }
    });
});

// Infinite Carousel for Detail Page
if (document.querySelector('.product-carousel')) {
    const track = document.querySelector('.carousel-track');
    const images = Array.from(track.children);
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentIndex = 0;
    const imageWidth = images[0].getBoundingClientRect().width;

    images.forEach(img => {
        const clone = img.cloneNode(true);
        track.appendChild(clone);
    });

    function updateCarousel() {
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
    }

    track.addEventListener('transitionend', () => {
        if (currentIndex >= images.length) {
            track.style.transition = 'none';
            currentIndex = 0;
            track.style.transform = `translateX(0)`;
        } else if (currentIndex < 0) {
            track.style.transition = 'none';
            currentIndex = images.length - 1;
            track.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
        }
    });

    nextButton.addEventListener('click', () => {
        currentIndex++;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex--;
        updateCarousel();
    });
}

// Form Submission and Export Logic
if (document.getElementById('measurement-form')) {
    const form = document.getElementById('measurement-form');
    let formData = null;

    // Prepopulate form from localStorage if available
    if (localStorage.getItem('formData')) {
        formData = JSON.parse(localStorage.getItem('formData'));
        document.querySelector('.export-buttons').style.display = 'flex';

        // Prepopulate text fields
        document.getElementById('full-name').value = formData.customer.fullName || '';
        document.getElementById('delivery-date').value = formData.customer.deliveryDate || '';
        document.getElementById('address').value = formData.customer.address || '';
        document.getElementById('blouse-length').value = formData.blouse.length || '';
        document.getElementById('chest').value = formData.blouse.chest || '';
        document.getElementById('waist').value = formData.blouse.waist || '';
        document.getElementById('front-neck').value = formData.blouse.frontNeck || '';
        document.getElementById('back-neck').value = formData.blouse.backNeck || '';
        document.getElementById('shoulder').value = formData.blouse.shoulder || '';
        document.getElementById('sleeves-length').value = formData.blouse.sleevesLength || '';
        document.getElementById('sleeves-round').value = formData.blouse.sleevesRound || '';
        document.getElementById('arm-hole').value = formData.blouse.armHole || '';
        document.getElementById('lehenga-length').value = formData.lehenga.length || '';
        document.getElementById('lehenga-waist').value = formData.lehenga.waist || '';

        // Prepopulate radio buttons
        const unitRadios = document.getElementsByName('unit');
        unitRadios.forEach(radio => {
            if (radio.value === formData.unit) {
                radio.checked = true;
            }
        });
    }

    // Remove existing listeners to prevent duplicates
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.checkValidity();
        });
    });
    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formInputs = new FormData(newForm);
        const data = Object.fromEntries(formInputs.entries());
        const orderDate = new Date().toLocaleString();

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
                let errorMsg = errorData.message || 'Unknown error';
                if (errorData.errors) {
                    const customerErrors = errorData.errors.customer?.join(', ') || '';
                    const measurementErrors = errorData.errors.measurements?.join(', ') || '';
                    errorMsg += `\nCustomer Errors: ${customerErrors || 'None'}\nMeasurement Errors: ${measurementErrors || 'None'}`;
                }
                throw new Error(errorMsg);
            }

            const responseData = await response.json();
            console.log('API Success:', responseData);

            formData = responseData.data;
            localStorage.setItem('formData', JSON.stringify(formData));
            document.querySelector('.export-buttons').style.display = 'flex';
            window.location.href = `/order-confirmation?id=${responseData.orderId}`;
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



// Product Detail Gallery
if (document.querySelector('.product-detail__gallery')) {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.product-detail__thumbnail');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // Update main image
            mainImage.src = thumbnail.getAttribute('data-full');
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('product-detail__thumbnail--active'));
            thumbnail.classList.add('product-detail__thumbnail--active');
        });
    });
}

document.getElementById('product-search')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    fetch(`/products?search=${encodeURIComponent(query)}`)
        .then(response => response.text())
        .then(html => {
            document.querySelector('.products-section').innerHTML = html;
        });
});