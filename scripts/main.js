document.addEventListener('DOMContentLoaded', function() {
    // Setup new collection button to show modal
    const newCollectionButton = document.getElementById('new-collection-button');
    const modalContainer = document.getElementById('modal-container');
    const modalClose = document.querySelector('.close-modal');
    const modalIframe = document.getElementById('modal-iframe');

    if (newCollectionButton && modalContainer && modalClose && modalIframe) {
        // Open modal when new collection button is clicked
        newCollectionButton.addEventListener('click', function() {
            // Set the iframe source to the new collection page
            modalIframe.src = 'newCollection.html';
            
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

    // Load existing collections
    loadCollections();
    
    // Update the side navigation with recent collections
    updateSideNav();

    // Listen for messages from the collection form
    window.addEventListener('message', function(event) {
        // Handle new collection creation
        if (event.data && event.data.type === 'newCollection') {
            const newCollection = event.data.collection;
            
            // Close the modal
            const modalContainer = document.getElementById('modal-container');
            if (modalContainer) {
                modalContainer.style.display = 'none';
            }
            
            // Reload collections to update the display
            loadCollections();
            
            // Update the side navigation
            updateSideNav();
        } else if (event.data === 'closeModal') {
            // Close the modal if requested
            const modalContainer = document.getElementById('modal-container');
            if (modalContainer) {
                modalContainer.style.display = 'none';
            }
        }
    }, false);
});

function loadCollections() {
    const collectionsDisplay = document.getElementById('collections');
    const noCollections = document.getElementById('no-collections');

    // Clear existing collections
    if (collectionsDisplay) {
        collectionsDisplay.innerHTML = '';
    }

    // Retrieve collections from local storage
    const collections = JSON.parse(localStorage.getItem('collections')) || [];

    if (collections.length > 0) {
        // Create a container for collections
        const collectionsContainer = document.createElement('div');

        // Populate collections
        collections.forEach(collection => {
            const container = document.createElement('div');
            const link = document.createElement('a');
            
            link.href = `collection.html?collection=${collection.name.toLowerCase()}`;
            link.classList.add('collection-link');
            container.classList.add('display-collection');
            
            // Add emoji if available, or use a default
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'collection-emoji';
            emojiSpan.textContent = collection.emoji || '📁';
            
            // Add emoji and collection name
            link.appendChild(emojiSpan);
            link.appendChild(document.createTextNode(collection.name));
            container.appendChild(link);
            
            collectionsContainer.appendChild(container);
        });

        // Add collections to display
        if (collectionsDisplay) {
            collectionsDisplay.appendChild(collectionsContainer);
        }

        // Hide 'no collections' message
        if (noCollections) {
            noCollections.style.display = 'none';
        }
    } else {
        // Show 'no collections' message
        if (noCollections) {
            noCollections.style.display = 'block';
        }
    }
}

// New function to update the side navigation with recent collections
function updateSideNav() {
    const recentCollectionsDiv = document.querySelector('.recent-collections');
    if (!recentCollectionsDiv) return;
    
    // Clear existing links except the heading
    const heading = recentCollectionsDiv.querySelector('h3');
    recentCollectionsDiv.innerHTML = '';
    if (heading) {
        recentCollectionsDiv.appendChild(heading);
    }
    
    // Get collections sorted by last accessed
    const collections = JSON.parse(localStorage.getItem('collections')) || [];
    const recentCollections = collections
        .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
        .slice(0, 4); // Get only the 4 most recent
    
    // Add links with emojis
    recentCollections.forEach(collection => {
        const link = document.createElement('a');
        link.href = `collection.html?collection=${collection.name.toLowerCase()}`;
        link.classList.add('side-nav');
        
        // Add emoji if available, or use a default
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'nav-emoji';
        emojiSpan.textContent = collection.emoji || '📁';
        
        link.appendChild(emojiSpan);
        link.appendChild(document.createTextNode(collection.name));
        
        recentCollectionsDiv.appendChild(link);
    });
}