function mainApp() {

	// create a popup window of newCollection.html when the user clicks on the new collection button
	let newCollectionButton = document.getElementById('new-collection-button');
	newCollectionButton.addEventListener('click', () => {
		window.open('newCollection.html', 'Add a new colection', 'width=400, height=400, popup=true');
	});

	// create a popup window of addItem.html when the user clicks on the add item button
	let addItemButton = document.getElementById('add-item-button');
	addItemButton.addEventListener('click', () => {
		window.open('newItem.html', 'Add a new item', 'width=400, height=600, popup=true');
	});

	loadCollections();
}

function loadCollections() {
	const noCollections = document.getElementById('no-collections');

	fetch('testCollections.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
	})
	.then(jsonData => {
		const collectionsDisplay = document.getElementById('collections');
		const collections = jsonData['collections'].reduce((accumulator, currentVal) => {
            const container = document.createElement('div');
			const link = document.createElement('a');
			link.href = 'collection.html';
			link.classList.add('collection-link');
			container.classList.add('display-collection');
            const collectionText = document.createTextNode(currentVal.name);
			link.appendChild(collectionText);
            container.appendChild(link);
            accumulator.appendChild(container);
            return accumulator;
        }, document.createElement('div'));
        collectionsDisplay.appendChild(collections);
		noCollections.style.display = 'none';
	})
	.catch(error => {
		console.log("error loading collections: " + error);
	});
}

mainApp();