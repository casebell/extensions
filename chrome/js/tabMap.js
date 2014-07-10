function TabMap() {
	var masterSlaveMap = [];

	//Private function
	//check whether the value is 'undefined' and if it is - throw exception
	function verifyUndefined(value, errMsg) {
		if (typeof(value) == 'undefined') {
			throw errMsg;
		}
	}

	//Public function
	//Add master value slave in the masterSlaveMap on position master
	//throw exception if master or slave are undefined
	function add(master, slave) {
		verifyUndefined(master, "Master is undefined");
		verifyUndefined(slave, "Slave is undefined");

		masterSlaveMap[master] = slave;
	}

	//Public function
	//Delete element on position master from masterSlaveMap array
	//throw exception if master is undefined
	function deleteByMaster(master) {
		verifyUndefined(master, "Master is undefined");

		masterSlaveMap.splice(master, 1);
	}

	//Public function
	//Delete element on position master which is determined by its slave value
	//throw exception if slave is undefined
	function deleteBySlave(slave) {
		verifyUndefined(slave, "Slave is undefined");

		var master = getMaster(slave);
		if (master !== -1) {
			masterSlaveMap.splice(master, 1);
		}
	}

	//Public function
	//Get element on position master from masterSlaveMap
	//throw exception if master is undefined
	function getSlave(master) {
		verifyUndefined(master, "Master is undefined");

		var slave;
		slave = masterSlaveMap[master];

		if (typeof(slave) == 'undefined') {
			slave = -1;
		}

		return slave;
	}

	function getMaster(slave) {
		verifyUndefined(slave, "Slave is undefined");

		for (var idx = 0; idx < masterSlaveMap.length; idx++) {
			if (masterSlaveMap[idx] === slave) {
				return idx;
			}
		}

		return -1;
	}

	function getLength() {
		return masterSlaveMap.length;
	}

	//methods
	this.deleteBySlave = deleteBySlave;
	this.deleteByMaster = deleteByMaster;
	this.getLength = getLength;
	this.add = add;
	this.getSlave = getSlave;
	this.getMaster = getMaster;

	return this;
}