class MeasurementForm {
    constructor() {
        this.form = document.getElementById('measurement-form');
        this.toggleInfo = document.getElementById('toggleInfo');
        this.toggleUnit = document.getElementById('toggleUnit');
        this.infoLinks = document.querySelectorAll('.info-link');
        this.unitRadios = document.querySelectorAll('input[name="unit"]');
        this.referenceImagesInput = document.getElementById('reference-images');
        this.referenceImagesPreview = document.querySelector('.reference-images-preview');
        this.deliveryDateInput = document.getElementById('delivery-date');
        this.exportButtons = document.querySelector('.export-buttons');
        this.formData = null;

        this.initializeEventListeners();
        this.initializeState();
        this.setupDeliveryDateMin();
        this.loadSavedFormData();
    }

    initializeEventListeners() {
        this.toggleInfo.addEventListener('change', () => this.toggleInfoLinks());
        this.toggleUnit.addEventListener('change', () => this.toggleUnitType());
        this.referenceImagesInput.addEventListener('change', (e) => this.handleImagePreview(e));
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.unitRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateMeasurementLimits());
        });

        // Export button listeners
        document.getElementById('export-email')?.addEventListener('click', () => this.exportToEmail());
        document.getElementById('export-pdf')?.addEventListener('click', () => this.exportToPDF());
    }

    loadSavedFormData() {
        const savedData = localStorage.getItem('formData');
        if (savedData) {
            this.formData = JSON.parse(savedData);
            this.exportButtons.style.display = 'flex';
            this.populateFormFields();
        }
    }

    populateFormFields() {
        if (!this.formData) return;

        // Populate customer details
        document.getElementById('full-name').value = this.formData.customer.fullName || '';
        document.getElementById('delivery-date').value = this.formData.customer.deliveryDate || '';
        document.getElementById('address').value = this.formData.customer.address || '';

        // Populate blouse measurements
        document.getElementById('blouse-length').value = this.formData.blouse.length || '';
        document.getElementById('chest').value = this.formData.blouse.chest || '';
        document.getElementById('waist').value = this.formData.blouse.waist || '';
        document.getElementById('front-neck').value = this.formData.blouse.frontNeck || '';
        document.getElementById('back-neck').value = this.formData.blouse.backNeck || '';
        document.getElementById('shoulder').value = this.formData.blouse.shoulder || '';
        document.getElementById('sleeves-length').value = this.formData.blouse.sleevesLength || '';
        document.getElementById('sleeves-round').value = this.formData.blouse.sleevesRound || '';
        document.getElementById('arm-hole').value = this.formData.blouse.armHole || '';

        // Populate lehenga measurements
        document.getElementById('lehenga-length').value = this.formData.lehenga.length || '';
        document.getElementById('lehenga-waist').value = this.formData.lehenga.waist || '';

        // Set unit
        const unitRadios = document.getElementsByName('unit');
        unitRadios.forEach(radio => {
            if (radio.value === this.formData.unit) {
                radio.checked = true;
            }
        });
    }

    initializeState() {
        this.toggleInfoLinks();
        this.toggleUnitType();
    }

    toggleInfoLinks() {
        this.infoLinks.forEach(link => {
            link.style.display = this.toggleInfo.checked ? 'inline-flex' : 'none';
        });
    }

    toggleUnitType() {
        const useInches = this.toggleUnit.checked;
        const cmRadio = document.querySelector('input[value="cm"]');
        const inchesRadio = document.querySelector('input[value="inches"]');
        
        if (useInches) {
            inchesRadio.checked = true;
        } else {
            cmRadio.checked = true;
        }
    }

    handleImagePreview(event) {
        this.referenceImagesPreview.innerHTML = '';
        const files = event.target.files;

        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewContainer = document.createElement('div');
                previewContainer.className = 'reference-image-preview';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `Reference image ${index + 1}`;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-image';
                removeBtn.innerHTML = '×';
                removeBtn.onclick = () => {
                    const newFiles = new DataTransfer();
                    Array.from(this.referenceImagesInput.files)
                        .filter((_, i) => i !== index)
                        .forEach(file => newFiles.items.add(file));
                    this.referenceImagesInput.files = newFiles.files;
                    previewContainer.remove();
                };
                
                previewContainer.appendChild(img);
                previewContainer.appendChild(removeBtn);
                this.referenceImagesPreview.appendChild(previewContainer);
            };
            reader.readAsDataURL(file);
        });
    }

    setupDeliveryDateMin() {
        const today = new Date().toISOString().split('T')[0];
        this.deliveryDateInput.min = today;
    }

    updateMeasurementLimits() {
        // Implementation of updateMeasurementLimits method
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
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
            orderDate: new Date().toISOString()
        };

        // Handle reference images
        const referenceImages = this.referenceImagesInput.files;
        if (referenceImages.length > 0) {
            const formDataWithFiles = new FormData();
            
            // Add JSON data
            formDataWithFiles.append('data', JSON.stringify(submissionData));
            
            // Add files
            Array.from(referenceImages).forEach(file => {
                formDataWithFiles.append('reference-images', file);
            });
            
            return formDataWithFiles;
        }

        return submissionData;
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        try {
            const formData = this.collectFormData();
            const isMultipart = formData instanceof FormData;

            const response = await fetch('/form', {
                method: 'POST',
                headers: isMultipart ? {} : {
                    'Content-Type': 'application/json'
                },
                body: isMultipart ? formData : JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                let errorMsg = result.message || 'Unknown error';
                if (result.errors) {
                    const customerErrors = result.errors.customer?.join(', ') || '';
                    const measurementErrors = result.errors.measurements?.join(', ') || '';
                    errorMsg += `\nCustomer Errors: ${customerErrors || 'None'}\nMeasurement Errors: ${measurementErrors || 'None'}`;
                }
                throw new Error(errorMsg);
            }

            // Store form data and show export buttons
            this.formData = result.data || formData;
            localStorage.setItem('formData', JSON.stringify(this.formData));
            this.exportButtons.style.display = 'flex';

            // Handle success
            alert('Form submitted successfully!');
            if (result.redirectUrl) {
                window.location.href = result.redirectUrl;
            }

        } catch (error) {
            console.error('Form submission error:', error);
            alert('Error submitting form: ' + error.message);
        }
    }

    exportToEmail() {
        if (!this.formData) {
            alert('Please submit the form first!');
            return;
        }

        const textContent = `
Boutique Order Details
----------------------------------------
Customer Information
----------------------------------------
Full Name: ${this.formData.customer.fullName}
Address:
${this.formData.customer.address}
Delivery Date: ${this.formData.customer.deliveryDate}
Order Date: ${this.formData.orderDate}
Measurements (${this.formData.unit})
----------------------------------------
Blouse
----------------------------------------
Length: ${this.formData.blouse.length}
Chest: ${this.formData.blouse.chest}
Waist: ${this.formData.blouse.waist}
Front Neck Depth: ${this.formData.blouse.frontNeck}
Back Neck Depth: ${this.formData.blouse.backNeck}
Shoulder Width: ${this.formData.blouse.shoulder}
Sleeves Length: ${this.formData.blouse.sleevesLength}
Sleeves Round: ${this.formData.blouse.sleevesRound}
Arm Hole: ${this.formData.blouse.armHole}
Lehenga
----------------------------------------
Length: ${this.formData.lehenga.length}
Waist: ${this.formData.lehenga.waist}
----------------------------------------
© 2025 Boutique
        `;

        const subject = encodeURIComponent(`Order Measurements for ${this.formData.customer.fullName}`);
        const body = encodeURIComponent(textContent);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }

    exportToPDF() {
        if (!this.formData) {
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
        doc.text(`Full Name: ${this.formData.customer.fullName}`, 10, 40);
        doc.text('Address:', 10, 50);
        doc.text(this.formData.customer.address, 10, 55, { maxWidth: 180 });
        let yOffset = 55 + Math.ceil(this.formData.customer.address.length / 90) * 5;
        doc.text(`Delivery Date: ${this.formData.customer.deliveryDate}`, 10, yOffset + 10);
        doc.text(`Order Date: ${this.formData.orderDate}`, 10, yOffset + 20);

        yOffset += 30;
        doc.setFontSize(14);
        doc.setTextColor(85, 85, 85);
        doc.text(`Measurements (${this.formData.unit})`, 10, yOffset);
        
        // Blouse measurements
        doc.setFontSize(12);
        doc.setTextColor(119, 119, 119);
        doc.text('Blouse', 10, yOffset + 10);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const blouseMeasurements = [
            ['Length', this.formData.blouse.length],
            ['Chest', this.formData.blouse.chest],
            ['Waist', this.formData.blouse.waist],
            ['Front Neck Depth', this.formData.blouse.frontNeck],
            ['Back Neck Depth', this.formData.blouse.backNeck],
            ['Shoulder Width', this.formData.blouse.shoulder],
            ['Sleeves Length', this.formData.blouse.sleevesLength],
            ['Sleeves Round', this.formData.blouse.sleevesRound],
            ['Arm Hole', this.formData.blouse.armHole]
        ];

        blouseMeasurements.forEach((measurement, index) => {
            doc.text(`${measurement[0]}: ${measurement[1]}`, 10, yOffset + 20 + (index * 10));
        });

        // Lehenga measurements
        yOffset += 110;
        doc.setFontSize(12);
        doc.setTextColor(119, 119, 119);
        doc.text('Lehenga', 10, yOffset);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Length: ${this.formData.lehenga.length}`, 10, yOffset + 10);
        doc.text(`Waist: ${this.formData.lehenga.waist}`, 10, yOffset + 20);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(119, 119, 119);
        doc.text('© 2025 Boutique', 105, 290, { align: 'center' });

        doc.save(`Order_${this.formData.customer.fullName}_${this.formData.orderDate.replace(/[, :]/g, '_')}.pdf`);
    }
}

// Initialize the form handler when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MeasurementForm();
}); 