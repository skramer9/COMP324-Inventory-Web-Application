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