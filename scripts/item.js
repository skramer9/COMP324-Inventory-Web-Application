document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters to identify which item to display
    const urlParams = new URLSearchParams(window.location.search);
    const collectionName = urlParams.get('collection');
    const itemName = urlParams.get('item');
    
    // If no collection or item name is provided, display an error and return
    if (!collectionName || !itemName) {
        alert('Missing collection or item name. Cannot display item.');
        return;
    }
    
    // Load and display the item details
    loadItemDetails(collectionName, itemName);
    
    // Setup edit item button
    const editButton = document.getElementById('edit-item-button');
    if (editButton) {
        editButton.addEventListener('click', function() {
            // Navigate to edit item page
            window.location.href = `editItem.html?collection=${collectionName}&item=${itemName}`;
        });
    }
    
    // Setup delete item button
    const deleteButton = document.getElementById('delete-item-button');
    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            // Confirm deletion
            if (confirm(`Are you sure you want to delete "${itemName}" from your collection?`)) {
                deleteItem(collectionName, itemName);
            }
        });
    }
});

/**
 * Loads and displays the item details from localStorage
 * @param {string} collectionName - The name of the collection
 * @param {string} itemName - The name of the item to display
 */
function loadItemDetails(collectionName, itemName) {
    // Get the collection data from localStorage
    const items = JSON.parse(localStorage.getItem(`${collectionName}_items`)) || {};
    
    // Find the specific item in the collection
    if (items[collectionName] && items[collectionName].length > 0) {
        const item = items[collectionName].find(item => 
            item.name.toLowerCase() === itemName.toLowerCase());
        
        if (item) {
            // Display item details
            displayItemDetails(item, collectionName);
        } else {
            // Item not found
            displayErrorMessage(`Item "${itemName}" not found in collection "${collectionName}".`);
        }
    } else {
        // Try to load from JSON file as fallback
        fetchItemFromJSON(collectionName, itemName);
    }
}

/**
 * Try to fetch item from JSON file if not in localStorage
 * @param {string} collectionName - The name of the collection
 * @param {string} itemName - The name of the item to find
 */
function fetchItemFromJSON(collectionName, itemName) {
    fetch(collectionName + '.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(jsonData => {
            if (jsonData[collectionName]) {
                const item = jsonData[collectionName].find(item => 
                    item.name.toLowerCase() === itemName.toLowerCase());
                
                if (item) {
                    // Display item details
                    displayItemDetails(item, collectionName);
                } else {
                    // Item not found in JSON
                    displayErrorMessage(`Item "${itemName}" not found in collection "${collectionName}".`);
                }
            } else {
                // Collection not found in JSON
                displayErrorMessage(`Collection "${collectionName}" not found.`);
            }
        })
        .catch(error => {
            console.error("Error loading item:", error);
            displayErrorMessage("Error loading item. Item not found.");
        });
}

/**
 * Display item details on the page
 * @param {Object} item - The item object containing details
 * @param {string} collectionName - The name of the collection
 */
function displayItemDetails(item, collectionName) {
    // Update page title
    document.title = `${item.name} Details`;
    
    // Update item name
    const nameElement = document.getElementById('item-name');
    if (nameElement) {
        nameElement.textContent = item.name;
    }
    
    // Update collection info
    const collectionElement = document.querySelector('.item-collection');
    if (collectionElement) {
        const formattedName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);
        collectionElement.textContent = `Collection: ${formattedName}`;
    }
    
    // Update date/creator info
    const dateElement = document.querySelector('.item-date');
    if (dateElement) {
        const creatorInfo = item.author || item.category || '';
        const yearInfo = item.year ? ` • ${item.year}` : '';
        dateElement.textContent = creatorInfo + yearInfo;
    }
    
    // Update description
    const descriptionElement = document.querySelector('.item-description');
    if (descriptionElement) {
        descriptionElement.textContent = item.description || item.blurb || '';
    }
    
    // Update rating
    const ratingElement = document.querySelector('.item-rating');
    if (ratingElement) {
        ratingElement.innerHTML = 'Rating: ' + getStarRating(item.rating);
    }
    
    // Update image if available
    const imageElement = document.querySelector('.item-large-image');
    if (imageElement && item.imageUrl) {
        imageElement.src = item.imageUrl;
        imageElement.alt = item.name;
    }
    
    // Update tags (if implemented)
    updateTagsSection(item);
}

/**
 * Update tags section with appropriate tags based on item data
 * @param {Object} item - The item object
 */
function updateTagsSection(item) {
    const tagsContainer = document.querySelector('.item-tags');
    if (!tagsContainer) return;
    
    // Clear existing tags
    tagsContainer.innerHTML = '';
    
    // Add category/author tag if available
    if (item.category || item.author) {
        const categoryTag = document.createElement('span');
        categoryTag.className = 'tag';
        categoryTag.textContent = item.category || item.author;
        tagsContainer.appendChild(categoryTag);
    }
    
    // Add favorite tag if item is marked as favorite
    if (item.isFavorite) {
        const favoriteTag = document.createElement('span');
        favoriteTag.className = 'tag';
        favoriteTag.textContent = 'Favorite';
        tagsContainer.appendChild(favoriteTag);
    }
    
    // Add year tag if available
    if (item.year) {
        const yearTag = document.createElement('span');
        yearTag.className = 'tag';
        yearTag.textContent = item.year;
        tagsContainer.appendChild(yearTag);
    }
}

/**
 * Display error message on the page
 * @param {string} message - The error message to display
 */
function displayErrorMessage(message) {
    // Update the item container with an error message
    const container = document.querySelector('.item-main-content');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>Error</h3>
                <p>${message}</p>
                <a href="main.html" class="add-button">Back to Home</a>
            </div>
        `;
    }
}

/**
 * Generate HTML for star rating display
 * @param {number} rating - The rating value (1-5)
 * @returns {string} HTML string with filled and empty stars
 */
function getStarRating(rating) {
    const numRating = parseInt(rating) || 0;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= numRating) {
            stars += '★';
        } else {
            stars += '☆';
        }
    }
    
    return stars;
}

/**
 * Delete an item from a collection
 * @param {string} collectionName - The name of the collection
 * @param {string} itemName - The name of the item to delete
 */
function deleteItem(collectionName, itemName) {
    // Get the collection data from localStorage
    const items = JSON.parse(localStorage.getItem(`${collectionName}_items`)) || {};
    
    // Find and remove the item
    if (items[collectionName] && items[collectionName].length > 0) {
        const itemIndex = items[collectionName].findIndex(item => 
            item.name.toLowerCase() === itemName.toLowerCase());
        
        if (itemIndex !== -1) {
            // Remove the item
            items[collectionName].splice(itemIndex, 1);
            
            // Save updated collection back to localStorage
            localStorage.setItem(`${collectionName}_items`, JSON.stringify(items));
            
            // Show success message
            alert('Item deleted successfully!');
            
            // Navigate back to collection page
            window.location.href = `collection.html?collection=${collectionName}`;
        } else {
            // Item not found
            alert(`Item "${itemName}" not found in collection "${collectionName}".`);
        }
    } else {
        // Collection is empty or doesn't exist
        alert(`Collection "${collectionName}" is empty or doesn't exist.`);
    }
} 