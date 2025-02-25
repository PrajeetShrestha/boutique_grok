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

    // Set initial filter state from URL
    const urlParams = new URLSearchParams(window.location.search);
    const statusFilter = urlParams.get('status');
    if (statusFilter) {
        document.getElementById('status-filter').value = statusFilter;
        filterOrders(statusFilter);
    }
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
            // Update all status elements for this order (both in card and table view)
            const orderElements = document.querySelectorAll(`[data-status][data-order-id="${orderId}"]`);
            orderElements.forEach(element => {
                element.dataset.status = newStatus;
            });

            // Update all status selects for this order
            const statusSelects = document.querySelectorAll(`select[data-order-id="${orderId}"]`);
            statusSelects.forEach(select => {
                select.value = newStatus;
            });

            // Update status badges if they exist
            const statusBadges = document.querySelectorAll(`.status-badge[data-order-id="${orderId}"]`);
            statusBadges.forEach(badge => {
                badge.className = `status-badge status-${newStatus}`;
                badge.textContent = newStatus.replace('_', ' ');
            });
            
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

function filterOrders(status) {
    const orderElements = document.querySelectorAll('[data-status]'); // This will select both cards and rows
    
    orderElements.forEach(element => {
        if (status === 'all' || element.dataset.status === status) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });

    // Update URL
    const url = new URL(window.location);
    if (status === 'all') {
        url.searchParams.delete('status');
    } else {
        url.searchParams.set('status', status);
    }
    window.history.pushState({}, '', url);
} 