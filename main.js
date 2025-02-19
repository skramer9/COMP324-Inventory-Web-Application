function mainApp() {
	// create a popup window of newCollection.html when the user clicks on the new collection button
	let newCollectionButton = document.getElementById('new-collection-button');
	newCollectionButton.addEventListener('click', () => {
		window.open('newCollection.html', 'Add a new colection', 'width=400, height=400, popup=true');
	});

	// create a popup window of addItem.html when the user clicks on the add item button
	let addItemButton = document.getElementById('add-item-button');
	addItemButton.addEventListener('click', () => {
		window.open('addItem.html', 'Add a new item', 'width=400, height=400, popup=true');
	});
}

mainApp();