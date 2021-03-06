function initializeNumberList() {
	
	var options = new ContactFindOptions();
	options.multiple = true;
	options.hasPhoneNumber = true;
	var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers];
	navigator.contacts.find(fields, loadContactsSuccess, loadContactsError, options);
	
}

function loadContactsError() {
	
	logger.log('contactList', 'contact list error');
	
}

function loadContactsSuccess(contacts) {
	
	logger.log('contactList', 'contact list success');
	logger.log('contactList', JSON.stringify(contacts[0].id));
	logger.log('contactList', JSON.stringify(contacts[0].displayName));
	logger.log('contactList', JSON.stringify(contacts[0].phoneNumbers));
	
	contacts.sort(function (a, b) {
		if (a.displayName < b.displayName) {
			return -1;
		}
		if (a.displayName > b.displayName) {
			return 1;
		}
		if (a.displayName == b.displayName) {
			return 0;
		}
	});
	
	createProductsListDrawNumberList(contacts);
	
}

function findSingleListSourceContact(number) {
	
	logger.log('contactList', 'try find number ' + number);
	
	try {
		var options = new ContactFindOptions();
		options.filter   = number;
		options.multiple = true;
		options.hasPhoneNumber = true;
		var fields = [navigator.contacts.fieldType.phoneNumbers];
		navigator.contacts.find(fields, findContactsSuccess, findContactsError, options);
	} catch (error) {
		logger.log('contactList', 'search number error');
	}
	
	logger.log('contactList', 'try find number end');
}

function findContactsSuccess(contacts) {
	
	logger.log('contactList', 'find contact success');
	if (contacts.length = 1) {
		logger.log('contactList', 'try set number by ' + contacts[0].displayName);
		$("#receivedListSource .value").text(contacts[0].displayName);
	}
	
}

function findContactsError(error) {
	
	logger.log('contactList', 'find contact error');
	
}