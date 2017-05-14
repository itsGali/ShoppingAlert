function Logger() {
	
//	this.addLogsButton = function() {
//		$("<a/>", {
//			class: "ui-btn",
//			text: "Logs"
//		})
//		.attr("href", "#logsPage")
//		.appendTo("#logsButton");
//	};
	
	this.log = function(type, message, level = 0) {
		var time = $("<td/>", {
			text: type
		});
		var date = new Date();
		var type = $("<td/>", {
			text: date.toString()
		});
		var message = $("<td/>", {
			text: message
		});
		$("<tr/>", {
			class: "log leve_l" + level
		})
		.append(time)
		.append(type)
		.append(message)
		.appendTo("#logsTable tbody");
	};
	
}