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
        
        // Get the selected emoji
        const selectedEmoji = document.querySelector('input[name="collection-emoji"]:checked').value;
        
        // Create collection object
        const collection = {
            id: Date.now().toString(),
            name: name,
            description: description,
            category: category,
            emoji: selectedEmoji, // Store the selected emoji
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

    // Create an empty collection file
    createEmptyCollectionFile(collection.name);

    // Send message to parent to update collections and close modal
    window.parent.postMessage({
        type: 'newCollection',
        collection: collection
    }, '*');
}

function createEmptyCollectionFile(collectionName) {
    // In a real app, this would create a new JSON file on the server
    // For this example, we'll simulate with sessionStorage
    
    const emptyCollection = {};
    emptyCollection[collectionName] = [];
    
    // Store in sessionStorage
    sessionStorage.setItem(`${collectionName}_items`, JSON.stringify(emptyCollection));
    
    console.log(`Created empty collection file for ${collectionName}`);
}

// Function to load collections (kept for potential future use)
function loadCollections() {
    const collections = JSON.parse(localStorage.getItem('collections')) || [];
    console.log('Loaded collections:', collections);
    return collections;
}