var smsPrefix = "This contact send shop list to you! Open ShopAlert App! ";

function sendMessage(number, content) {
	
	logger.log('sms', 'send to ' + number);
	logger.log('sms', 'message ' + content);
	
	try {
		
		var sendSuccess = function () {
			logger.log('sms', 'send success');
		};
		
		var sendError = function (e) {
			logger.log('sms', 'send error');
			setTimeout(function (){
				$("#popupSendListSendError").popup("open");
			}, 1000);
		};
		
		var options = {
            replaceLineBreaks: false,
            android: {
                intent: 'INTENT'
            }
        };

        sms.send(number, content, options, sendSuccess, sendError);
		
	} catch (error) {
		
		logger.log('sms', 'send catch error');
		logger.log('sms', JSON.stringify(error));
		
		setTimeout(function (){
			$("#popupSendListSendError").popup("open");
		}, 1000);
		
	}
	
}

function getMessages() {
	
	if(SMS) {
				
		logger.log('sms', 'sms enable');
		
		var filter = {
			box : 'inbox',
		};
		
		SMS.listSMS(filter, function(data) {
			logger.log('sms', 'sms get');
			
			$.each(data, function(key, sms) {
//				logger.log('sms', 'sms ' + JSON.stringify(sms));
//				logger.log('sms ', sms.address);
//				logger.log('sms ', sms.body);
				parseMessage(sms._id, sms.address, sms.body);
			});
			
		}, function(err){
			logger.log('sms', 'sms get ' + JSON.stringify(err));
		});
		
	} else {
		
		logger.log('sms', 'sms disable');
		
	}
	
}

function parseMessage(id, number, message) {
	
//	logger.log('message ', number);
//	logger.log('message ', message);
	try {
		
		var data = message.slice(smsPrefix.length);
//		logger.log('message ', data);
		var data = JSON.parse(data);
		if (data.sign == "SA#1965") {
			logger.log('message ', 'true');
			
			list = data.list;
			logger.log('message ', JSON.stringify(list));
			
			var fullProducts = [];
			var fullProductsList = new ProductsList();
			logger.log('message ', JSON.stringify(fullProductsList));
			fullProductsList.createFromSendVersion(number, list);
			logger.log('message ', JSON.stringify(fullProductsList));
			
			$.each(list.p, function(key, sendProduct) {
				var fullProduct = new Product();
				logger.log('message ', JSON.stringify(fullProduct));
				fullProduct.createFromSendVersion(sendProduct);
				logger.log('message ', JSON.stringify(fullProduct));
				fullProductsList.products.push(fullProduct);
				logger.log('message ', JSON.stringify(fullProductsList.products));
			});
			
			var receivedLists = localStorage.getItem("received_products_list");
			if (receivedLists === null) {
				logger.log('already added', 'empty storage');
				receivedListsAddList(fullProductsList);
			} else {
				logger.log('already added', 'is storage');
				var alreadyAdded = false;

				receivedLists = JSON.parse(receivedLists);
				$.each(receivedLists, function(key, tmpList) {
					logger.log('already added', 'check');
					
					logger.log('already added', tmpList.sourceNumber);
					logger.log('already added', fullProductsList.sourceNumber);
					logger.log('already added', tmpList.sendDate);
					logger.log('already added', fullProductsList.sendDate);
					if (tmpList.sourceNumber == fullProductsList.sourceNumber && tmpList.sendDate == fullProductsList.sendDate) {
						logger.log('already added', 'exist');
						alreadyAdded = true;
					}
				});
				
				if (alreadyAdded == false) {
					logger.log('already added', 'add');
					receivedListsAddList(fullProductsList);
				}

			}
			
			return true;
		}
//		logger.log('message ', 'false');
		return null;
		
	} catch(error) {
	
//		logger.log('message ', 'error');
		return null;
	
	}
	
}

function prepareDataToSend(list) {
	
	var sendProducts = [];
	var sendList = new ProductsListSend(list);
	
	$.each(list.products, function(key, product) {
		sendList.p.push(new ProductSend(product));
	});

	var message = {
		sign: "SA#1965",
		list: sendList
	}
	
	return smsPrefix+JSON.stringify(message);
	
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
	
	logger.log('sms', 'send received confirm to ' + list.sourceNumber);
	logger.log('sms', 'received confirm message ' + content);
	
	try {
		
		var sendSuccess = function () {
			logger.log('sms', 'confirm send success');
		};
		
		var sendError = function (e) {
			logger.log('sms', 'confirm send error');
			setTimeout(function (){
				$("#popupSendReceivedListError").popup("open");
			}, 1000);
		};
		
		var options = {
            replaceLineBreaks: false,
            android: {
                intent: 'INTENT'
            }
        };

        sms.send(list.sourceNumber, content, options, sendSuccess, sendError);
		
	} catch (error) {
		
		logger.log('sms', 'confirm send catch error');
		logger.log('sms', JSON.stringify(error));
		
		setTimeout(function (){
			$("#popupSendReceivedListError").popup("open");
		}, 1000);
		
	}
	
}