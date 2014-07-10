describe("TabMap", function() {
  var tabMap;

  beforeEach(function() {
    tabMap = new TabMap();
    tabMap.add(1,2);
    tabMap.add(3,4);
    tabMap.add(10,11);
  });

  it("should be able to handle undefined master in add map", function() {
    var value;
    expect(function(){ tabMap.add(value,3); }).toThrow("Master is undefined");
  });

  it("should be able to handle undefined slave in add map", function() {
    var value;
    expect(function(){ tabMap.add(3,value ); }).toThrow("Slave is undefined");
  });

  it("should be able to handle undefined master in deleteByMaster", function() {
    var value;
    expect(function(){ tabMap.deleteByMaster(value); }).toThrow("Master is undefined");
  });

  it("should be able to handle undefined slave in deleteBySlave", function() {
    var value;
    expect(function(){ tabMap.deleteBySlave(value); }).toThrow("Slave is undefined");
  });

  it("should be able to handle undefined master in getSlave", function() {
    var value;
    expect(function(){ tabMap.getSlave(value); }).toThrow("Master is undefined");
  });

  it("should be able to handle undefined slave in getMaster", function() {
    var value;
    expect(function(){ tabMap.getMaster(value); }).toThrow("Slave is undefined");
  });

  it("should be able to add map", function() {
    tabMap.add(50,6);
    expect(tabMap.getSlave(50)).toEqual(6);
    expect(tabMap.getLength()).toEqual(51);
  });

  it("should be able to get slave", function() {
    var slave = tabMap.getSlave(1);
    expect(slave).toEqual(2);
  });

  it("should be able to get master", function() {
    var master = tabMap.getMaster(11);
    expect(master).toEqual(10);
  });

  it("should return -1 if there is no matching master", function() {
    var master = tabMap.getMaster(20);
    expect(master).toEqual(-1);
  });

  it("should return -1 if there is no matching slave", function() {
    var slave = tabMap.getSlave(20);
    expect(slave).toEqual(-1);
  });

  it("should be able to delete map by master id", function() {
    expect(tabMap.getSlave(3)).toEqual(4);
    tabMap.deleteByMaster(3);
    expect(tabMap.getSlave(3)).toEqual(-1);
  });

  it("should be able to delete map by slave id", function() {
    expect(tabMap.getMaster(11)).toEqual(10);
    tabMap.deleteBySlave(11);
    expect(tabMap.getMaster(11)).toEqual(-1);
  });
});