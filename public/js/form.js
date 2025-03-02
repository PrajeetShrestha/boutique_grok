class MeasurementForm {
    constructor() {
        this.form = document.getElementById('measurement-form');
        this.toggleInfo = document.getElementById('toggleInfo');
        this.toggleUnit = document.getElementById('toggleUnit');
        this.infoLinks = document.querySelectorAll('.info-link');
        this.unitRadios = document.querySelectorAll('input[name="unit"]');
        this.referenceImagesInput = document.getElementById('reference-images');
        this.referenceImagesPreview = document.querySelector('.reference-images-preview');

        this.initializeEventListeners();
        this.initializeState();
    }

    initializeEventListeners() {
        this.toggleInfo.addEventListener('change', () => this.toggleInfoLinks());
        this.toggleUnit.addEventListener('change', () => this.toggleUnitType());
        this.referenceImagesInput.addEventListener('change', (e) => this.handleImagePreview(e));
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
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

    collectFormData() {
        const formData = new FormData();

        // Add customer details
        formData.append('customer[fullName]', document.getElementById('full-name').value);
        formData.append('customer[address]', document.getElementById('address').value);
        formData.append('customer[deliveryDate]', document.getElementById('delivery-date').value);

        // Add blouse measurements
        const blouseMeasurements = {
            length: document.getElementById('blouse-length').value,
            chest: document.getElementById('chest').value,
            waist: document.getElementById('waist').value,
            frontNeck: document.getElementById('front-neck').value,
            backNeck: document.getElementById('back-neck').value,
            shoulder: document.getElementById('shoulder').value,
            sleevesLength: document.getElementById('sleeves-length').value,
            sleevesRound: document.getElementById('sleeves-round').value,
            armHole: document.getElementById('arm-hole').value
        };

        // Add lehenga measurements
        const lehengaMeasurements = {
            length: document.getElementById('lehenga-length').value,
            waist: document.getElementById('lehenga-waist').value
        };

        // Add measurements as JSON strings
        formData.append('blouse', JSON.stringify(blouseMeasurements));
        formData.append('lehenga', JSON.stringify(lehengaMeasurements));

        // Add unit and order date
        formData.append('unit', document.querySelector('input[name="unit"]:checked').value);
        formData.append('orderDate', new Date().toISOString());

        // Add reference images if any
        const referenceImages = this.referenceImagesInput.files;
        Array.from(referenceImages).forEach(file => {
            formData.append('reference-images', file);
        });

        return formData;
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        try {
            const formData = this.collectFormData();

            // Submit the form
            const response = await fetch('/form', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Form submission failed');
            }

            // Handle success
            alert(result.message);
            if (result.redirectUrl) {
                window.location.href = result.redirectUrl;
            }

        } catch (error) {
            console.error('Form submission error:', error);
            alert('Error submitting form: ' + error.message);
        }
    }
}

// Initialize form handling when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MeasurementForm();
}); 