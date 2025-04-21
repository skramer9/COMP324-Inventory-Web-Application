document.addEventListener('DOMContentLoaded', function() {
    // Load the collection
    loadCollection();

    // Setup add item button
    const addItemButton = document.getElementById('add-item-button');
    const modalContainer = document.getElementById('modal-container');
    const modalClose = document.querySelector('.close-modal');
    const modalIframe = document.getElementById('modal-iframe');

    if (addItemButton && modalContainer && modalClose && modalIframe) {
        // Open modal when add item button is clicked
        addItemButton.addEventListener('click', function() {
            // Get the current collection name from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const collectionName = urlParams.get('collection');

            // Set the iframe source to the new item page with the collection name
            modalIframe.src = `newItem.html?collection=${collectionName}`;
            
            // Display the modal
            modalContainer.style.display = 'block';
        });

        // Close modal when close button is clicked
        modalClose.addEventListener('click', function() {
            modalContainer.style.display = 'none';
        });

        // Close modal when clicking outside the modal content
        modalContainer.addEventListener('click', function(event) {
            if (event.target === modalContainer) {
                modalContainer.style.display = 'none';
            }
        });
    }

    // Setup edit collection button (if present)
    const editCollectionButton = document.getElementById('edit-collection-button');
    if (editCollectionButton && modalContainer && modalIframe) {
        editCollectionButton.addEventListener('click', function() {
            // Get the current collection name from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const collectionName = urlParams.get('collection');
            
            // Open edit collection modal
            openEditCollectionModal(collectionName);
        });
    }
    
    // Setup delete collection button (if present)
    const deleteCollectionButton = document.getElementById('delete-collection-button');
    if (deleteCollectionButton && modalContainer && modalIframe) {
        deleteCollectionButton.addEventListener('click', function() {
            // Get the current collection name from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const collectionName = urlParams.get('collection');
            
            // Open delete collection modal
            openDeleteCollectionModal(collectionName);
        });
    }

    // Listen for messages from the item form or collection edit form
    window.addEventListener('message', function(event) {
        if (event.data === 'closeModal') {
            // Close the modal
            const modalContainer = document.getElementById('modal-container');
            if (modalContainer) {
                modalContainer.style.display = 'none';
            }
        } else if (event.data && event.data.type === 'newCollection') {
            // Close the modal
            const modalContainer = document.getElementById('modal-container');
            if (modalContainer) {
                modalContainer.style.display = 'none';
            }
            
            // Reload the page to show updated items
            loadCollection();
        } else if (event.data && event.data.type === 'updatedCollection') {
            // Close the modal
            const modalContainer = document.getElementById('modal-container');
            if (modalContainer) {
                modalContainer.style.display = 'none';
            }
            
            // Update the collection title and reload items
            updateCollectionTitle(event.data.collection.name);
            loadCollection();
        } else if (event.data && event.data.type === 'deletedCollection') {
            // Redirect to the main page
            window.location.href = 'main.html';
        } else {
            // Default behavior for other messages (like item add)
            const modalContainer = document.getElementById('modal-container');
            if (modalContainer) {
                modalContainer.style.display = 'none';
            }
            
            // Reload the collection to show the new or updated item
            loadCollection();
        }
    }, false);
});

/**
 * Opens the edit collection modal dialog
 * @param {string} collectionName - Name of the collection to edit
 */
function openEditCollectionModal(collectionName) {
    const modalContainer = document.getElementById('modal-container');
    const modalIframe = document.getElementById('modal-iframe');
    
    if (modalContainer && modalIframe) {
        // Generate simple edit collection HTML directly in the iframe
        const editHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Edit Collection</title>
                <link rel="stylesheet" href="style.css">
                <style>
                    /* Emoji Grid Styling for edit form */
                    .emoji-grid {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        margin-bottom: 20px;
                    }

                    .emoji-option {
                        text-align: center;
                    }

                    .emoji-option input[type="radio"] {
                        display: none;
                    }

                    .emoji-option label {
                        display: block;
                        width: 50px;
                        height: 50px;
                        background: white;
                        border-radius: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 24px;
                    }

                    .emoji-option input[type="radio"]:checked + label {
                        background: #FFBDF7;
                        box-shadow: 0 0 0 2px #65548f;
                    }
                </style>
            </head>
            <body class="popup-page">
                <form class="add-collection-form" id="editCollectionForm">
                    <h2>Edit Collection</h2>
                    
                    <label for="collection-emoji">Choose an icon</label>
                    <div class="emoji-grid">
                        <div class="emoji-option">
                            <input type="radio" name="collection-emoji" id="emoji-books" value="📚">
                            <label for="emoji-books">📚</label>
                        </div>
                        <div class="emoji-option">
                            <input type="radio" name="collection-emoji" id="emoji-film" value="🎬">
                            <label for="emoji-film">🎬</label>
                        </div>
                        <div class="emoji-option">
                            <input type="radio" name="collection-emoji" id="emoji-music" value="🎵">
                            <label for="emoji-music">🎵</label>
                        </div>
                        <div class="emoji-option">
                            <input type="radio" name="collection-emoji" id="emoji-food" value="🍽️">
                            <label for="emoji-food">🍽️</label>
                        </div>
                        <div class="emoji-option">
                            <input type="radio" name="collection-emoji" id="emoji-travel" value="✈️">
                            <label for="emoji-travel">✈️</label>
                        </div>
                        <div class="emoji-option">
                            <input type="radio" name="collection-emoji" id="emoji-games" value="🎮">
                            <label for="emoji-games">🎮</label>
                        </div>
                        <div class="emoji-option">
                            <input type="radio" name="collection-emoji" id="emoji-art" value="🎨">
                            <label for="emoji-art">🎨</label>
                        </div>
                        <div class="emoji-option">
                            <input type="radio" name="collection-emoji" id="emoji-wishlist" value="💫">
                            <label for="emoji-wishlist">💫</label>
                        </div>
                        <div class="emoji-option">
                            <input type="radio" name="collection-emoji" id="emoji-folder" value="📁">
                            <label for="emoji-folder">📁</label>
                        </div>
                    </div>
                    
                    <label for="collection-name">Collection Name</label>
                    <input type="text" id="collection-name" required>

                    <label for="collection-description">Description</label>
                    <textarea id="collection-description"></textarea>

                    <label for="collection-category">Category</label>
                    <input type="text" id="collection-category">

                    <label for="item-image">Image Upload</label>
                    <input type="file" id="item-image" accept="image/*">
                    <div id="current-image-container">
                        <p id="current-image-text" style="display: none;">Current image:</p>
                        <img id="current-image" src="" alt="Current collection image" style="max-width: 200px; margin-top: 10px; display: none;">
                    </div>

                    <div class="form-buttons">
                        <button type="submit" class="update-button">Update Collection</button>
                        <button type="button" class="cancel-button">Cancel</button>
                    </div>
                </form>

                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        // Get collection name from URL parameters
                        const collectionName = "${collectionName}";
                        
                        // Load existing collections from localStorage
                        const collections = JSON.parse(localStorage.getItem('collections')) || [];
                        
                        // Find the collection by name
                        const collection = collections.find(c => c.name.toLowerCase() === collectionName.toLowerCase());
                        
                        if (!collection) {
                            alert('Collection not found');
                            window.parent.postMessage('closeModal', '*');
                            return;
                        }
                        
                        // Fill the form with collection data
                        document.getElementById('collection-name').value = collection.name;
                        document.getElementById('collection-description').value = collection.description || '';
                        document.getElementById('collection-category').value = collection.category || '';
                        
                        // Set the selected emoji if available
                        if (collection.emoji) {
                            const emojiInput = document.querySelector(\`input[value="\${collection.emoji}"]\`);
                            if (emojiInput) {
                                emojiInput.checked = true;
                            } else {
                                // If the current emoji isn't in our options, select the default folder
                                document.getElementById('emoji-folder').checked = true;
                            }
                        } else {
                            // Default to folder emoji if none set
                            document.getElementById('emoji-folder').checked = true;
                        }
                        
                        // Display current image if available
                        if (collection.imageUrl) {
                            const currentImage = document.getElementById('current-image');
                            const currentImageText = document.getElementById('current-image-text');
                            currentImage.src = collection.imageUrl;
                            currentImage.style.display = 'block';
                            currentImageText.style.display = 'block';
                        }
                        
                        // Handle form submission
                        const form = document.getElementById('editCollectionForm');
                        form.addEventListener('submit', function(e) {
                            e.preventDefault();
                            
                            // Get form values
                            const newName = document.getElementById('collection-name').value;
                            const description = document.getElementById('collection-description').value;
                            const category = document.getElementById('collection-category').value;
                            const imageInput = document.getElementById('item-image');
                            
                            // Get the selected emoji
                            const selectedEmoji = document.querySelector('input[name="collection-emoji"]:checked').value;
                            
                            // Check if collection with the new name already exists (if name was changed)
                            if (newName.toLowerCase() !== collection.name.toLowerCase() && 
                                collections.some(c => c.name.toLowerCase() === newName.toLowerCase())) {
                                alert('A collection with this name already exists. Please choose a different name.');
                                return;
                            }
                            
                            // Update collection object
                            collection.name = newName;
                            collection.description = description;
                            collection.category = category;
                            collection.emoji = selectedEmoji;
                            collection.lastAccessed = new Date().toISOString();
                            
                            // Handle image upload if a new image was selected
                            if (imageInput && imageInput.files && imageInput.files[0]) {
                                const reader = new FileReader();
                                
                                reader.onload = function(event) {
                                    collection.imageUrl = event.target.result;
                                    saveUpdatedCollection(collection, collections, collectionName);
                                };
                                
                                reader.readAsDataURL(imageInput.files[0]);
                            } else {
                                // Save collection without changing the image
                                saveUpdatedCollection(collection, collections, collectionName);
                            }
                        });
                        
                        // Close modal button functionality
                        const closeModalButton = document.querySelector('.cancel-button');
                        if (closeModalButton) {
                            closeModalButton.addEventListener('click', function() {
                                window.parent.postMessage('closeModal', '*');
                            });
                        }
                    });
                    
                    function saveUpdatedCollection(collection, collections, oldCollectionName) {
                        // Get the index of the collection in the array
                        const index = collections.findIndex(c => c.name.toLowerCase() === oldCollectionName.toLowerCase());
                        
                        if (index !== -1) {
                            // Replace the collection at the found index
                            collections[index] = collection;
                            
                            // Save updated collections to localStorage
                            localStorage.setItem('collections', JSON.stringify(collections));
                            
                            // If the name was changed, update the collection items
                            if (oldCollectionName.toLowerCase() !== collection.name.toLowerCase()) {
                                // Get the collection items
                                const items = JSON.parse(localStorage.getItem(\`\${oldCollectionName}_items\`)) || {};
                                
                                // Create new collection items with the new name
                                if (items[oldCollectionName]) {
                                    const newItems = {};
                                    newItems[collection.name] = items[oldCollectionName];
                                    
                                    // Save items with the new collection name
                                    localStorage.setItem(\`\${collection.name}_items\`, JSON.stringify(newItems));
                                    
                                    // Remove old collection items
                                    localStorage.removeItem(\`\${oldCollectionName}_items\`);
                                }
                            }
                            
                            // Show success message
                            alert('Collection updated successfully!');
                            
                            // Notify parent that collection was updated
                            window.parent.postMessage({ type: 'updatedCollection', collection: collection }, '*');
                        } else {
                            alert('Error updating collection');
                        }
                    }
                </script>
            </body>
        </html>
        `;
        
        // Set the iframe src using data URL
        modalIframe.srcdoc = editHtml;
        
        // Display the modal
        modalContainer.style.display = 'block';
    }
}

/**
 * Opens the delete collection confirmation modal
 * @param {string} collectionName - Name of the collection to delete
 */
function openDeleteCollectionModal(collectionName) {
    const modalContainer = document.getElementById('modal-container');
    const modalIframe = document.getElementById('modal-iframe');
    
    if (modalContainer && modalIframe) {
        // Generate simple delete confirmation HTML directly in the iframe
        const deleteHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Delete Collection</title>
                <link rel="stylesheet" href="style.css">
                <style>
                    .delete-container {
                        text-align: center;
                        padding: 20px;
                    }
                    
                    .delete-warning {
                        color: #ff6b6b;
                        font-weight: bold;
                        margin: 20px 0;
                    }
                    
                    .collection-name {
                        font-size: 1.2em;
                        font-weight: bold;
                        margin: 10px 0;
                    }
                    
                    .delete-buttons {
                        display: flex;
                        justify-content: center;
                        gap: 20px;
                        margin-top: 30px;
                    }
                    
                    .confirm-delete {
                        background-color: #ff6b6b;
                    }
                </style>
            </head>
            <body class="popup-page">
                <div class="delete-container">
                    <h2>Delete Collection</h2>
                    
                    <p class="delete-warning">Warning: This action cannot be undone!</p>
                    
                    <p>Are you sure you want to delete this collection?</p>
                    
                    <p class="collection-name" id="collection-name-display">${collectionName}</p>
                    
                    <p>This will delete the collection and all its items permanently.</p>
                    
                    <div class="delete-buttons">
                        <button class="confirm-delete" id="confirm-delete-btn">Yes, Delete Collection</button>
                        <button class="cancel-button" id="cancel-delete-btn">Cancel</button>
                    </div>
                </div>

                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        // Handle confirm delete button
                        const confirmButton = document.getElementById('confirm-delete-btn');
                        const collectionName = "${collectionName}";
                        
                        confirmButton.addEventListener('click', function() {
                            // Load existing collections from localStorage
                            let collections = JSON.parse(localStorage.getItem('collections')) || [];
                            
                            // Find and remove the collection
                            const index = collections.findIndex(c => c.name.toLowerCase() === collectionName.toLowerCase());
                            
                            if (index !== -1) {
                                // Remove the collection
                                collections.splice(index, 1);
                                
                                // Save updated collections to localStorage
                                localStorage.setItem('collections', JSON.stringify(collections));
                                
                                // Remove collection items
                                localStorage.removeItem(\`\${collectionName}_items\`);
                                
                                // Show success message
                                alert('Collection deleted successfully!');
                                
                                // Notify parent that collection was deleted
                                window.parent.postMessage({ type: 'deletedCollection', collectionName: collectionName }, '*');
                            } else {
                                alert('Collection not found');
                                window.parent.postMessage('closeModal', '*');
                            }
                        });
                        
                        // Handle cancel button
                        const cancelButton = document.getElementById('cancel-delete-btn');
                        cancelButton.addEventListener('click', function() {
                            window.parent.postMessage('closeModal', '*');
                        });
                    });
                </script>
            </body>
        </html>
        `;
        
        // Set the iframe src using data URL
        modalIframe.srcdoc = deleteHtml;
        
        // Display the modal
        modalContainer.style.display = 'block';
    }
}

/**
 * Loads and displays all items in a collection
 * This function first tries to get items from localStorage,
 * and if none are found, falls back to fetching from a JSON file
 */
function loadCollection() {
    // Get the name of the collection that was passed into the URL
    const urlParams = new URLSearchParams(window.location.search);
    const collectionName = urlParams.get('collection');
    const collectionDisplay = document.querySelector('.collections');
    const noItems = document.getElementById('no-items');
    
    // Update the collection title
    updateCollectionTitle(collectionName);
    
    // Clear any existing content
    if (collectionDisplay) {
        collectionDisplay.innerHTML = '';
    }
    
    // Load items from local storage
    const items = JSON.parse(localStorage.getItem(`${collectionName}_items`)) || {};
    
    if (items[collectionName] && items[collectionName].length > 0) {
        // Display items from the collection
        displayItems(items[collectionName], collectionDisplay);
        if (noItems) noItems.style.display = 'none';
    } else {
        // Try to fetch from JSON file if not in localStorage
        fetchCollectionFromJSON(collectionName, collectionDisplay, noItems);
    }
}

/**
 * Fetches collection data from a JSON file when no data is found in localStorage
 * @param {string} collectionName - The name of the collection to fetch
 * @param {Element} collectionDisplay - The DOM element to display items in
 * @param {Element} noItems - The DOM element to hide when items are displayed
 */
function fetchCollectionFromJSON(collectionName, collectionDisplay, noItems) {
    fetch(collectionName + '.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(jsonData => {
        // Store data in localStorage for future use
        localStorage.setItem(`${collectionName}_items`, JSON.stringify(jsonData));
        console.log(`Loaded ${collectionName} data from JSON file and saved to localStorage`);
        
        const items = jsonData[collectionName].reduce((accumulator, currentVal) => {
            const container = document.createElement('div');
            container.classList.add('display-item');
            const link = document.createElement('a');
            const description = document.createElement('p');
            description.classList.add('item-description');
            const blurb = document.createTextNode(currentVal.blurb);
            description.appendChild(blurb);
            link.href = 'item.html?collection=' + collectionName + '&item=' + currentVal.name.toLowerCase();
            link.classList.add('item-link');
            const itemName = document.createTextNode(currentVal.name);
            link.appendChild(itemName);
            container.appendChild(link);
            container.appendChild(description);
            accumulator.appendChild(container);
            return accumulator;
        }, document.createElement('div'));
        collectionDisplay.appendChild(items);
        if (noItems) noItems.style.display = 'none';
    })
    .catch(error => {
        console.log("error loading collection: " + error);
        // Show empty state
        collectionDisplay.innerHTML = '<p>No items in this collection yet. Add an item to get started!</p>';
    });
}

/**
 * Updates the collection title in the page
 * @param {string} collectionName - The name of the collection
 */
function updateCollectionTitle(collectionName) {
    if (!collectionName) return;
    
    // Get collection emoji from localStorage
    const collections = JSON.parse(localStorage.getItem('collections')) || [];
    const currentCollection = collections.find(c => c.name.toLowerCase() === collectionName.toLowerCase());
    const collectionEmoji = currentCollection?.emoji || '📁';
    
    // Format collection name with first letter capitalized
    const formattedName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);
    
    // Update the h1 in the collection banner
    const titleElement = document.querySelector('.collection-banner h1');
    if (titleElement) {
        titleElement.innerHTML = `${collectionEmoji} ${formattedName}`;
    }
    
    // Update document title
    document.title = `${formattedName} Collection`;
}

/**
 * Displays items in the collection using the enhanced UI
 * @param {Array} items - Array of item objects to display
 * @param {Element} container - The DOM element to display items in
 */
function displayItems(items, container) {
    // Make sure container exists
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Check if there are items
    if (!items || items.length === 0) {
        container.innerHTML = '<p>No items in this collection yet. Add an item to get started!</p>';
        return;
    }
    
    // Create items
    items.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        
        // Set image source (use placeholder if none provided)
        const imgSrc = item.imageUrl || 'placeholder-image.jpg';
        
        // Create HTML for the item row
        itemRow.innerHTML = `
            <img src="${imgSrc}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="author">${item.author || item.category || ''} ${item.year ? '• ' + item.year : ''}</p>
                <p class="description">${item.blurb || item.description || ''}</p>
            </div>
            <div class="item-rating">${getStarRating(item.rating)}</div>
            <button class="favorite-button">${item.isFavorite ? '♥' : '♡'}</button>
        `;
        
        // Add click handler for item name to navigate to detail page
        const itemName = itemRow.querySelector('h3');
        itemName.style.cursor = 'pointer';
        itemName.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const collectionName = urlParams.get('collection');
            window.location.href = `item.html?item=${item.name.toLowerCase()}&collection=${collectionName}`;
        });
        
        // Add click handler for favorite button
        const favoriteButton = itemRow.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', () => {
            // Toggle favorite status
            item.isFavorite = !item.isFavorite;
            favoriteButton.textContent = item.isFavorite ? '♥' : '♡';
            
            // Update in local storage
            const urlParams = new URLSearchParams(window.location.search);
            const collectionName = urlParams.get('collection');
            const items = JSON.parse(localStorage.getItem(`${collectionName}_items`)) || {};
            
            // Find and update the specific item
            const itemIndex = items[collectionName].findIndex(i => i.name === item.name);
            if (itemIndex !== -1) {
                items[collectionName][itemIndex] = item;
                localStorage.setItem(`${collectionName}_items`, JSON.stringify(items));
            }
        });
        
        // Add the item row to the container
        container.appendChild(itemRow);
    });
}

/**
 * Helper function to display star rating
 * @param {number} rating - The rating value (1-5)
 * @returns {string} HTML string with filled and empty stars
 */
function getStarRating(rating) {
    const numRating = parseInt(rating) || 0; // Default to 0 stars if not provided
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
 * Creates an empty collection in localStorage
 * @param {string} collectionName - The name of the collection to create
 */
function createEmptyCollection(collectionName) {
    const emptyCollection = {};
    emptyCollection[collectionName] = [];
    
    // Store in local storage
    localStorage.setItem(`${collectionName}_items`, JSON.stringify(emptyCollection));
    
    console.log(`Created empty collection for ${collectionName}`);
}