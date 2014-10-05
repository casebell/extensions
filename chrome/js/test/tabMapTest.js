describe("TabMap", function() {
  var tabMap;

  beforeEach(function() {
    tabMap = new TabMap();
    tabMap.add(1,2, 666);
    tabMap.add(3,4, 777);
    tabMap.add(10,11, 888);
  });

  it("should be able to handle undefined master in add map", function() {
    var value;
    expect(function(){ tabMap.add(value,3,123); }).toThrow("Master is undefined");
  });

  it("should be able to handle undefined slave in add map", function() {
    var value;
    expect(function(){ tabMap.add(3,value ); }).toThrow("Slave is undefined");
  });

  it("should be able to handle undefined slave in deleteBySlave", function() {
    var value;
    expect(function(){ tabMap.deleteBySlave(value); }).toThrow("Slave is undefined");
  });

  it("should be able to handle undefined master in getSlave", function() {
    var value;
    expect(function(){ tabMap.getSlaveById(value); }).toThrow("Id is undefined");
  });

  it("should be able to handle undefined slave in getMaster", function() {
    var value;
    expect(function(){ tabMap.getMasterById(value); }).toThrow("Id is undefined");
  });

  it("should be able to add map", function() {
    var tcId = 123;

    tabMap.add(50, 6, tcId);
    expect(tabMap.getMasterById(tcId)).toEqual(50);
    expect(tabMap.getSlaveById(tcId)).toEqual(6);
  });

  it("should be able to get slave by id", function() {
    var tcId = 124;

    tabMap.add(1,2, tcId);
    var slave = tabMap.getSlaveById(tcId);
    expect(slave).toEqual(2);
  });

  it("should be able to get master by id", function() {
    var tcId = 124;

    tabMap.add(1,2, tcId);
    var master = tabMap.getMasterById(tcId);
    expect(master).toEqual(1);
  });

  it("should return -1 if there is no matching master", function() {
    var tcId = 125;

    var master = tabMap.getMasterById(tcId);
    expect(master).toEqual(-1);
  });

  it("should return -1 if there is no matching slave", function() {
    var tcId = 126;

    var slave = tabMap.getSlaveById(tcId);
    expect(slave).toEqual(-1);
  });

  it("should be able to delete map by id", function() {
    var tcId = 127;

    tabMap.add(1,2, tcId);
    expect(tabMap.getSlaveById(tcId)).toEqual(2);
    tabMap.deleteById(tcId);
    expect(tabMap.getSlaveById(tcId)).toEqual(-1);
  });

  it("should be able to delete map by slave", function() {
    var tcId = 128;
    var slaveId = 345;

    tabMap.add(1, slaveId, tcId);
    expect(tabMap.getSlaveById(tcId)).toEqual(slaveId);
    tabMap.deleteBySlave(slaveId);
    expect(tabMap.getSlaveById(tcId)).toEqual(-1);
  });
});