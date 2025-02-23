// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', (e) => {
    e.preventDefault();
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
        console.log('Hamburger clicked, nav-links active:', navLinks.classList.contains('active'));
    } else {
        console.error('nav-links not found');
    }
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

// Product Card Quick View Handler
document.querySelectorAll('.product-card__quick-view').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = button.getAttribute('data-id');
        if (productId) {
            fetch(`/detail?id=${productId}`)
                .then(response => response.text())
                .then(html => {
                    const product = {
                        id: productId,
                        name: button.parentElement.querySelector('h3').textContent,
                        price: button.parentElement.querySelector('p').textContent.replace('$', ''),
                        img: button.parentElement.querySelector('img').src,
                        color: 'N/A',
                        fabric: 'N/A',
                        description: 'Description placeholder'
                    };
                    showProductModal(product);
                })
                .catch(error => console.error('Error fetching product:', error));
        }
    });
});

// Product Detail Page Gallery
if (document.querySelector('.product-detail-page__gallery')) {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.product-detail-page__thumbnail');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            mainImage.src = thumbnail.getAttribute('data-full');
            thumbnails.forEach(t => t.classList.remove('product-detail-page__thumbnail--active'));
            thumbnail.classList.add('product-detail-page__thumbnail--active');
        });
    });
    

    // Full-Screen Gallery Trigger
    mainImage.addEventListener('click', () => {
        if (mainImage.getAttribute('data-gallery') === 'true') {

            const images = Array.from(thumbnails).map(t => t.getAttribute('data-full'));
  
            showGalleryModal(images, mainImage.src);
        }
    });
}

// Product Modal Logic
function showProductModal(product) {
    console.log("Show")
    const modal = document.getElementById('product-modal');
    if (!modal) {
        console.error('Product modal not found in DOM');
        return;
    }

    document.getElementById('modal-main-image').src = product.img;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = `$${parseFloat(product.price).toFixed(2)}`;
    document.getElementById('modal-color').textContent = product.color;
    document.getElementById('modal-fabric').textContent = product.fabric;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-full-details').href = `/detail?id=${product.id}`;

    const thumbnailsContainer = document.getElementById('modal-thumbnails');
    thumbnailsContainer.innerHTML = '';
    const images = [
        product.img,
        `https://picsum.photos/id/${parseInt(product.id) + 1}/300/533`,
        `https://picsum.photos/id/${parseInt(product.id) + 2}/300/533`
    ];
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${product.name} Thumbnail ${index + 1}`;
        img.setAttribute('data-full', src);
        img.classList.add('product-detail__thumbnail');
        if (index === 0) img.classList.add('product-detail__thumbnail--active');
        thumbnailsContainer.appendChild(img);
    });

    modal.style.display = 'block';

    const thumbnails = modal.querySelectorAll('.product-detail__thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            document.getElementById('modal-main-image').src = thumbnail.getAttribute('data-full');
            thumbnails.forEach(t => t.classList.remove('product-detail__thumbnail--active'));
            thumbnail.classList.add('product-detail__thumbnail--active');
        });
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}


// Full-Screen Gallery Modal Logic
function showGalleryModal(images, initialSrc) {
    const modal = document.getElementById('gallery-modal');
    if (!modal) {
        console.error('Gallery modal not found in DOM');
        return;
    }
    const mainImage = document.getElementById('gallery-main-image');
    const thumbnailsContainer = document.getElementById('gallery-thumbnails');
    const prevButton = modal.querySelector('.gallery-modal__prev');
    const nextButton = modal.querySelector('.gallery-modal__next');
    let currentIndex = images.indexOf(initialSrc);

    // Populate main image
    mainImage.src = initialSrc;

    // Populate thumbnails
    thumbnailsContainer.innerHTML = '';
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Gallery Image ${index + 1}`;
        img.classList.add('gallery-modal__thumbnail');
        if (src === initialSrc) img.classList.add('gallery-modal__thumbnail--active');
        img.addEventListener('click', () => {
            currentIndex = index;
            mainImage.src = src;
            updateThumbnails();
        });
    });
    

    // Update active thumbnail
    function updateThumbnails() {
        const thumbnails = modal.querySelectorAll('.gallery-modal__thumbnail');
        thumbnails.forEach((t, i) => {
            t.classList.toggle('gallery-modal__thumbnail--active', i === currentIndex);
        });
    }

    // Navigation
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        mainImage.src = images[currentIndex];
        updateThumbnails();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        mainImage.src = images[currentIndex];
        updateThumbnails();
    });

    // Show modal
    modal.style.display = 'block';

    // Close modal
    modal.querySelector('.gallery-modal__close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Form Submission and Export Logic (Unchanged)
if (document.getElementById('measurement-form')) {
    const form = document.getElementById('measurement-form');
    let formData = null;

    if (localStorage.getItem('formData')) {
        formData = JSON.parse(localStorage.getItem('formData'));
        document.querySelector('.export-buttons').style.display = 'flex';

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

        const unitRadios = document.getElementsByName('unit');
        unitRadios.forEach(radio => {
            if (radio.value === formData.unit) {
                radio.checked = true;
            }
        });
    }

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

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
            alert('Form submitted successfully! Use the buttons below to export your data.');
            document.querySelector('.export-buttons').style.display = 'flex';
        } catch (error) {
            console.error('Form submission error:', error);
            alert(`An error occurred while submitting the form: ${error.message}`);
        }
    });

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