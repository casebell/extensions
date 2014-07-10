function MessageQueue() {
	var messageQueue = [];

	function add(message) {
		messageQueue.push(message);
	}

	function get() {
		var message;

		if (getLength() > 0) {
			message = messageQueue[0];
			messageQueue.shift();
		}

		//	parseQueue();

		return message;
	}

	function getLength() {
		return messageQueue.length;
	}

	//methods
	this.get = get;
	this.getLength = getLength;
	this.add = add;

	return this;
}