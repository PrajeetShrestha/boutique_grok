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
    }

    loadSavedFormData() {
        const savedData = localStorage.getItem('formData');
        console.log(savedData);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (parsedData && Object.keys(parsedData).length > 0) {
                    this.formData = parsedData;
                    this.populateFormFields();
                } else {
                    console.warn('Saved data is an empty object.');
                }
            } catch (error) {
                console.error('Error parsing saved data:', error);
            }
        } else {
            console.warn('No saved data found.');
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

            // Store form data 
            this.formData = result.data || formData;
            localStorage.setItem('formData', JSON.stringify(this.formData));
            

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

    
}

// Initialize the form handler when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MeasurementForm();
}); 