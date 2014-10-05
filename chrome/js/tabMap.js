function TabMap() {
	var masterSlaveMap = [];

	var SLAVE = 1;
	var MASTER = 0;

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
	function add(master, slave, id) {
		verifyUndefined(master, "Master is undefined");
		verifyUndefined(slave, "Slave is undefined");
		verifyUndefined(id, "Id is undefined");

		masterSlaveMap[id] = [master, slave];
	}

	//Public function
	//Delete element on position id from masterSlaveMap array
	//throw exception if id is undefined
	function deleteById(id) {

		verifyUndefined(id, "Id is undefined");

		masterSlaveMap.splice(id, 1);
	}

	//Public function
	//Delete element on position master which is determined by its slave value
	//throw exception if slave is undefined
	function deleteBySlave(slave) {
		verifyUndefined(slave, "Slave is undefined");

		var id = getIdBySlave(slave);

		if (id !== -1) {
			masterSlaveMap.splice(id, 1);
		}
	}

	function getIdBySlave(slave){

		verifyUndefined(slave, "Slave is undefined");

		var id = -1;

		for(idx=0; idx < masterSlaveMap.length; idx++)
		{
			if(typeof(masterSlaveMap[idx]) !== 'undefined' &&
				masterSlaveMap[idx][SLAVE] === slave)
			{
				id = idx;
				break;
			}
		}

		return id;
	}

	//Public function
	//Get element on position master from masterSlaveMap
	//throw exception if master is undefined
	function getSlaveById(id) {

		verifyUndefined(id, "Id is undefined");

		var map = masterSlaveMap[id];

		var slave = -1;

		if(typeof(map) !== 'undefined')
		{
			slave = map[SLAVE];
		}

		return slave;
	}

	function getMasterById(id) {

		verifyUndefined(id, "Id is undefined");

		var map = masterSlaveMap[id];

		var master = -1;

		if(typeof(map) !== 'undefined')
		{
			master = map[MASTER];
		}

		return master;
	}

	function getMasterBySlave(slave) {

		verifyUndefined(slave, "Slave is undefined");

		var master = -1;

		var id = getIdBySlave(slave);

		if (id !== -1) {
			master = getMasterById(id);
		}

		return master;
	}

	function getLength() {
		return masterSlaveMap.length;
	}

	//methods
	this.deleteBySlave = deleteBySlave;
	this.deleteById = deleteById;
	this.getLength = getLength;
	this.add = add;
	this.getSlaveById = getSlaveById;
	this.getMasterById = getMasterById;
	this.getMasterBySlave = getMasterBySlave;

	return this;
}