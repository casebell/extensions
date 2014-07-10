describe("MessageQueue", function() {
  var messageQueue;

  beforeEach(function() {
    messageQueue = new MessageQueue();
    messageQueue.add('message');
  });

  it("should be able to add message", function() {
    messageQueue.add('new message');
    expect(messageQueue.getLength()).toEqual(2);
  });

  it("should be able to get message", function() {
    var message = messageQueue.get();
    expect(message).not.toBe(null);
    expect(messageQueue.getLength()).toEqual(0);
  });

  it("should be able to get count of all messages", function() {
    var msgCount = messageQueue.getLength();
    expect(msgCount).toEqual(1);
  });
});