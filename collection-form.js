document.addEventListener('DOMContentLoaded', function() {
    // Get form element
    const form = document.querySelector('.add-collection-form');
    if (!form) return;
    
    // Add event listener for form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('collection-name').value;
        const description = document.getElementById('collection-description').value;
        const category = document.getElementById('collection-category').value;
        const imageInput = document.getElementById('item-image'); // Note your HTML uses item-image not collection-image
        
        // Create collection object
        const collection = {
            id: Date.now().toString(),
            name: name,
            description: description,
            category: category,
            lastAccessed: new Date().toISOString()
        };
        
        // Handle image upload if selected
        if (imageInput && imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                collection.imageUrl = event.target.result; // Store base64 image data
                saveCollection(collection);
            };
            
            reader.readAsDataURL(imageInput.files[0]); // Read image as data URL
        } else {
            // Save collection without image
            saveCollection(collection);
        }
    });

    // Close modal button functionality
    const closeModalButton = document.querySelector('.cancel-button');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            // Send message to close the modal
            window.parent.postMessage('closeModal', '*');
        });
    }
});

/**
 * Saves a new collection to localStorage
 * @param {Object} collection - The collection object to save
 */
function saveCollection(collection) {
    // Load existing collections from local storage
    let existingCollections = JSON.parse(localStorage.getItem('collections')) || [];

    // Check if collection with the same name already exists
    if (existingCollections.some(c => c.name.toLowerCase() === collection.name.toLowerCase())) {
        alert('A collection with this name already exists. Please choose a different name.');
        return;
    }

    // Add the new collection
    existingCollections.push(collection);

    // Save updated collections to local storage
    localStorage.setItem('collections', JSON.stringify(existingCollections));

    // Create an empty collection items structure in localStorage
    createEmptyCollection(collection.name);

    // Send message to parent to update collections and close modal
    window.parent.postMessage({
        type: 'newCollection',
        collection: collection
    }, '*');
}

/**
 * Creates an empty collection structure in localStorage
 * @param {string} collectionName - The name of the collection to create
 */
function createEmptyCollection(collectionName) {
    // Create an empty collection structure
    const emptyCollection = {};
    emptyCollection[collectionName] = [];
    
    // Store in localStorage (not sessionStorage, which only lives for the session)
    localStorage.setItem(`${collectionName}_items`, JSON.stringify(emptyCollection));
    
    console.log(`Created empty collection for ${collectionName} in localStorage`);
}

/**
 * Loads all collections from localStorage
 * @returns {Array} Array of collection objects
 */
function loadCollections() {
    const collections = JSON.parse(localStorage.getItem('collections')) || [];
    console.log('Loaded collections from localStorage:', collections);
    return collections;
}