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

function loadCollection() {
	//get the name of the collection that was passed into the url
	const urlParams = new URLSearchParams(window.location.search);
	const collectionName = urlParams.get('collection');
	const collectionDisplay = document.querySelector('.collections');
	const noItems = document.getElementById('no-items');

	fetch(collectionName + '.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
	})
	.then(jsonData => {
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
		noItems.style.display = 'none';
	})
	.catch(error => {
		console.log("error loading collection: " + error);
	});
}

loadCollection();