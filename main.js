function mainApp() {
	// Get modal elements
	const modalContainer = document.getElementById('modal-container');
	const modalIframe = document.getElementById('modal-iframe');
	
	// Get buttons
	const addItemButton = document.getElementById('add-item-button');
	const newCollectionButton = document.getElementById('new-collection-button');
	
	// Get close button
	const closeModal = document.getElementsByClassName('close-modal')[0];
	
	// Show modal with newItem.html when Add Item button is clicked
	if (addItemButton) {
		addItemButton.addEventListener('click', () => {
			modalIframe.src = 'newItem.html';
			modalContainer.style.display = 'block';
		});
	}
	
	// Show modal with newCollection.html when New Collection button is clicked
	if (newCollectionButton) {
		newCollectionButton.addEventListener('click', () => {
			modalIframe.src = 'newCollection.html';
			modalContainer.style.display = 'block';
		});
	}
	
	// Close modal when X is clicked
	if (closeModal) {
		closeModal.addEventListener('click', () => {
			modalContainer.style.display = 'none';
			modalIframe.src = '';  // Clear the iframe
		});
	}
	
	// Close modal when clicking outside
	window.addEventListener('click', (event) => {
		if (event.target === modalContainer) {
			modalContainer.style.display = 'none';
			modalIframe.src = '';  // Clear the iframe
		}
	});
	
	// Listen for messages from the iframe (for form submission)
	window.addEventListener('message', (event) => {
		if (event.data === 'closeModal') {
			modalContainer.style.display = 'none';
			modalIframe.src = '';  // Clear the iframe
		}
	});
}

mainApp();