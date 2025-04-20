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

    // Listen for messages from the item form
    window.addEventListener('message', function(event) {
        // Close the modal
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.style.display = 'none';
        }

        // Reload the collection to show the new item
        loadCollection();
    }, false);
});

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
    
    // Format collection name with first letter capitalized
    const formattedName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);
    
    // Update the h1 in the collection banner
    const titleElement = document.querySelector('.collection-banner h1');
    if (titleElement) {
        titleElement.textContent = formattedName;
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
