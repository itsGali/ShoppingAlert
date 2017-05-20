function sendMessage(number, content) {
	
	logger.log('sms', 'send to ' + number);
	logger.log('sms', 'message ' + content);
	
	var hasPermissionSuccess = function (hasPermission) {
		if (hasPermission) {
			
			logger.log('sms', 'permission');
			
			var options = {
					replaceLineBreaks: false,
					android: {
						intent: 'INTENT'
				}
			};
			
			var success = function () { logger.log('sms', 'send success'); };
			var error = function (e) { logger.log('sms', 'send error'); };

			try {
				
				sms.send(number, message, options, success, error);
				
			} catch (error) {
				
				logger.log('sms', 'send catch error');
				logger.log('sms', JSON.stringify(error));
				
			}
			
		}
		else {
			logger.log('sms', 'no permission');
		}
	};
	var hasPermissionError = function (e) {
		logger.log('sms', 'has permission error');
		logger.log('sms', JSON.stringify(e));
	};
		
	sms.hasPermission(hasPermissionSuccess, hasPermissionError);
	
	return true;
}

function getMessage() {
	
	var listToAdd = new ProductsList();
	listToAdd.sourceNumber = '784 628 738';
	listToAdd.phoneNumber = '123456789';
	listToAdd.comment = 'test comment';
	listToAdd.sendDate = new Date();
	
	var product1 = new Product();
	product1.name = 'test name 1';
	product1.quantity = '1';
	product1.priority = 1;
	product1.comment = 'test comment 1';
	product1.status = 0;
	
	var product2 = new Product();
	product2.name = 'test name 2';
	product2.quantity = '2';
	product2.priority = 2;
	product2.comment = 'test comment 2';
	product2.status = 0;
	
	listToAdd.products.push(product1);
	listToAdd.products.push(product2);
	
	var message = {
		sign: "SHOPALERTMESSAGE",
		list: listToAdd
	}
	
	return JSON.stringify(message);
	
}

function parseMessage(message) {
	
	try {
		
		var data = JSON.parse(message);
		if (data.sign == "SHOPALERTMESSAGE") {
			return data.list;
		}
		return null;
		
	} catch(error) {
	
		return null;
	
	}
	
}

function prepareDataToSend(list) {
	
	var message = {
		sign: "SHOPALERTMESSAGE",
		list: list
	}
	
	return JSON.stringify(message);
	
}

function onMessageReceived() {
	
	var message = getMessage();
	var data = parseMessage(message);
	if (data != null) {
		receivedListsAddList(data);
	}
	
}

function sendConfirmMessage(listId) {
	
	var receivedLists = localStorage.getItem("received_products_list");
	receivedLists = JSON.parse(receivedLists);
	var list = receivedLists[listId];
	
	var content = 'ShopAlert - reply to list posted '+getDateString(list.sendDate)+'. List: ';
	$.each(list.products, function(index, product) {
		if (product.status == 0) {
			content = content+product.name+' not bought,';
		}
		if (product.status == 1) {
			content = content+product.name+' bought,';
		}
		if (product.status == 2) {
			content = content+product.name+' unavailable,';
		}
	});
	content = content.slice(0, -1);
	content = content+'.';
	
	return sendMessage(list.sourceNumber, content);
	
}