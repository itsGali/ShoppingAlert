function Product() {
	this.name = '';
	this.quantity = '';
	this.priority = 1; //0: low, 1: normal; 2: important; 3: necessary
	this.comment = '';
	this.status = 0; //0: none; 1: bought; 2: unavailable;
	
	this.createFromSendVersion = function(productSend) {
		this.name = productSend.n;
		this.quantity = productSend.q;
		this.priority = productSend.p;
		this.comment = productSend.c;
	}
}