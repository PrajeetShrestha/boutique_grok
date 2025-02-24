function showMeasurements(order) {
    const modal = document.getElementById('measurements-modal');
    
    // Set customer information
    document.getElementById('modal-customer-name').textContent = order.fullName;
    document.getElementById('modal-delivery-date').textContent = new Date(order.deliveryDate).toLocaleDateString();
    document.getElementById('modal-unit').textContent = order.unit;

    // Set blouse measurements
    const blouseMeasurements = document.getElementById('blouse-measurements');
    blouseMeasurements.innerHTML = `
        <p><span>Length:</span> <span>${order.blouseLength} ${order.unit}</span></p>
        <p><span>Chest:</span> <span>${order.chest} ${order.unit}</span></p>
        <p><span>Waist:</span> <span>${order.waist} ${order.unit}</span></p>
        <p><span>Front Neck:</span> <span>${order.frontNeck} ${order.unit}</span></p>
        <p><span>Back Neck:</span> <span>${order.backNeck} ${order.unit}</span></p>
        <p><span>Shoulder:</span> <span>${order.shoulder} ${order.unit}</span></p>
        <p><span>Sleeves Length:</span> <span>${order.sleevesLength} ${order.unit}</span></p>
        <p><span>Sleeves Round:</span> <span>${order.sleevesRound} ${order.unit}</span></p>
        <p><span>Arm Hole:</span> <span>${order.armHole} ${order.unit}</span></p>
    `;

    // Set lehenga measurements
    const lehengaMeasurements = document.getElementById('lehenga-measurements');
    lehengaMeasurements.innerHTML = `
        <p><span>Length:</span> <span>${order.lehengaLength} ${order.unit}</span></p>
        <p><span>Waist:</span> <span>${order.lehengaWaist} ${order.unit}</span></p>
    `;

    // Show modal
    modal.style.display = 'flex';
}

// Close modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('measurements-modal');
    const closeBtn = modal.querySelector('.close-modal');

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});

function updateOrderStatus(selectElement) {
    const orderId = selectElement.dataset.orderId;
    const newStatus = selectElement.value;
    
    fetch(`/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update the status badge
            const statusBadge = selectElement.nextElementSibling;
            statusBadge.className = `status-badge status-${newStatus}`;
            statusBadge.textContent = newStatus.replace('_', ' ');
            
            // Show success message
            showNotification('Status updated successfully', 'success');
        } else {
            showNotification('Failed to update status', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Failed to update status', 'error');
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 