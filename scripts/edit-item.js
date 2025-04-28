document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters to identify the item being edited
    const urlParams = new URLSearchParams(window.location.search);
    const collectionName = urlParams.get('collection');
    const itemName = urlParams.get('item');
    
    // If no collection or item name is provided, display an error and return
    if (!collectionName || !itemName) {
        alert('Missing collection or item name. Cannot edit item.');
        return;
    }
    
    // Load the item from localStorage
    loadItemForEditing(collectionName, itemName);
    
    // Setup the form submit event
    const form = document.querySelector('.add-item-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            updateItem(collectionName, itemName);
        });
    }
    
    // Setup the cancel button
    const cancelButton = document.querySelector('.cancel-button');
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            // Navigate back to the item view page
            window.location.href = `item.html?collection=${collectionName}&item=${itemName}`;
        });
    }
});

/**
 * Loads the item data from localStorage and populates the form
 * @param {string} collectionName - The name of the collection
 * @param {string} itemName - The name of the item to edit
 */
function loadItemForEditing(collectionName, itemName) {
    // Get the collection data from localStorage
    const items = JSON.parse(localStorage.getItem(`${collectionName}_items`)) || {};
    
    // Find the specific item in the collection
    if (items[collectionName] && items[collectionName].length > 0) {
        const item = items[collectionName].find(item => 
            item.name.toLowerCase() === itemName.toLowerCase());
        
        if (item) {
            // Populate the form with item data
            document.getElementById('item-name').value = item.name || '';
            document.getElementById('item-description').value = item.description || item.blurb || '';
            document.getElementById('item-category').value = item.category || item.author || '';
            
            // Set the image if it exists
            const imgElement = document.querySelector('.add-item-form img');
            if (imgElement && item.imageUrl) {
                imgElement.src = item.imageUrl;
                imgElement.alt = item.name;
            }
        } else {
            // Item not found
            alert(`Item "${itemName}" not found in collection "${collectionName}".`);
        }
    } else {
        // Collection is empty or doesn't exist
        alert(`Collection "${collectionName}" is empty or doesn't exist.`);
    }
}

/**
 * Updates the item in localStorage with the form data
 * @param {string} collectionName - The name of the collection
 * @param {string} originalItemName - The original name of the item (to find it)
 */
function updateItem(collectionName, originalItemName) {
    // Get the collection data from localStorage
    const items = JSON.parse(localStorage.getItem(`${collectionName}_items`)) || {};
    
    // Find the specific item in the collection
    if (items[collectionName] && items[collectionName].length > 0) {
        const itemIndex = items[collectionName].findIndex(item => 
            item.name.toLowerCase() === originalItemName.toLowerCase());
        
        if (itemIndex !== -1) {
            // Get form values
            const name = document.getElementById('item-name').value;
            const description = document.getElementById('item-description').value;
            const category = document.getElementById('item-category').value;
            const imageInput = document.getElementById('item-image');
            
            // Get the current item
            const currentItem = items[collectionName][itemIndex];
            
            // Update item with form values
            currentItem.name = name;
            currentItem.blurb = description;
            currentItem.description = description;
            currentItem.category = category;
            currentItem.author = category; // Using category as author for now
            
            // Handle image upload if selected
            if (imageInput && imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    currentItem.imageUrl = event.target.result; // Store base64 image data
                    saveUpdatedItem(items, collectionName, originalItemName, currentItem.name);
                };
                
                reader.readAsDataURL(imageInput.files[0]); // Read image as data URL
            } else {
                // Save item without changing the image
                saveUpdatedItem(items, collectionName, originalItemName, currentItem.name);
            }
        } else {
            // Item not found
            alert(`Item "${originalItemName}" not found in collection "${collectionName}".`);
        }
    } else {
        // Collection is empty or doesn't exist
        alert(`Collection "${collectionName}" is empty or doesn't exist.`);
    }
}

/**
 * Save the updated item back to localStorage
 * @param {Object} items - The collection items object
 * @param {string} collectionName - The name of the collection
 * @param {string} originalItemName - The original name of the item
 * @param {string} newItemName - The new name of the item (in case it changed)
 */
function saveUpdatedItem(items, collectionName, originalItemName, newItemName) {
    // Save to localStorage
    localStorage.setItem(`${collectionName}_items`, JSON.stringify(items));
    
    // Show success message
    alert('Item updated successfully!');
    
    // Navigate back to the item view page
    // If the name changed, use the new name in the URL
    window.location.href = `item.html?collection=${collectionName}&item=${newItemName.toLowerCase()}`;
} 