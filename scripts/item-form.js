document.addEventListener('DOMContentLoaded', function() {
    // Setup rating stars
    const ratingStars = document.querySelectorAll('.rating-star');
    let currentRating = 0;

    // Add event listeners to rating stars
    ratingStars.forEach((star, index) => {
        star.addEventListener('mouseover', () => {
            // Highlight stars up to hover point
            ratingStars.forEach((s, i) => {
                if (i <= index) {
                    s.textContent = '★';
                } else {
                    s.textContent = '☆';
                }
            });
        });

        star.addEventListener('mouseout', () => {
            // Restore to current rating
            ratingStars.forEach((s, i) => {
                if (i < currentRating) {
                    s.textContent = '★';
                } else {
                    s.textContent = '☆';
                }
            });
        });

        star.addEventListener('click', () => {
            // Set current rating
            currentRating = index + 1;
            
            // Update hidden input for form submission
            document.getElementById('item-rating').value = currentRating;

            // Visually update stars
            ratingStars.forEach((s, i) => {
                if (i < currentRating) {
                    s.textContent = '★';
                } else {
                    s.textContent = '☆';
                }
            });
        });
    });

    // Get form element
    const form = document.querySelector('.add-item-form');
    if (!form) return;
    
    // Add event listener for form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the collection name from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const collectionName = urlParams.get('collection');
        
        if (!collectionName) {
            alert('No collection specified. Please select a collection first.');
            return;
        }
        
        // Get form values
        const name = document.getElementById('item-name').value;
        const description = document.getElementById('item-description').value;
        const category = document.getElementById('item-category').value;
        const rating = document.getElementById('item-rating').value || 0;
        const imageInput = document.getElementById('item-image');
        
        // Create item object
        const item = {
            id: Date.now().toString(),
            name: name,
            blurb: description, // Using blurb to match existing code format
            description: description,
            category: category,
            author: category, // Using category as author for now
            year: new Date().getFullYear().toString(),
            rating: parseInt(rating), // Ensure rating is a number
            isFavorite: false
        };
        
        // Handle image upload if selected
        if (imageInput && imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                item.imageUrl = event.target.result; // Store base64 image data
                saveItem(item, collectionName);
            };
            
            reader.readAsDataURL(imageInput.files[0]); // Read image as data URL
        } else {
            // Save item without image
            saveItem(item, collectionName);
        }
    });
});

function saveItem(item, collectionName) {
    // Attempt to load the existing collection file from local storage
    let existingItems = JSON.parse(localStorage.getItem(`${collectionName}_items`)) || {};

    // Add the new item to the collection
    if (!existingItems[collectionName]) {
        existingItems[collectionName] = [];
    }

    // Add the new item to the beginning of the array instead of the end
    existingItems[collectionName].unshift(item);

    // Save updated items to local storage
    localStorage.setItem(`${collectionName}_items`, JSON.stringify(existingItems));

    // Show success message
    alert('Item added successfully!');
    
    // Send a more specific message to the parent window
    window.parent.postMessage({
        type: 'itemAdded',
        collectionName: collectionName,
        item: item
    }, '*');
}