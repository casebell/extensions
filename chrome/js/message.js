//Content script constant
var CONTENTSCRIPT = 'C_S';

//IDE constant
var IDE = 'IDE';

//Background script constant
var BACKGROUNDSCRIPT = 'BGS';

//Used to add in the log as a sender when pass message into browser console
var _whoami = "";

//Define message structure
function Message(msg, whoami) {
    //Verify that the message is valid object and has command and action
    verify(msg);

    //Save the sender identification
    _whoami = whoami;

    var _message = msg;

    // //Set attributes
    // this.command = msg.command;
    // this.action = msg.action;
    // this.text = msg.text;
    // this.isMaster = msg.isMaster;
    // this.tcid = msg.tcid;

    //Verify message structure and content
    function verify(obj) {
        //Check whether the nessage is valid object
        if (typeof(obj) == 'undefined') {
            throw 'Object is undefined'
        } else {
            //Check whether message has valid command attribute
            if (typeof(obj.command) == 'undefined') {
                throw 'Command is undefined'
            }

            //Check whether message has valid action attribute
            if (typeof(obj.action) == 'undefined') {
                throw 'Action is undefined'
            }
        }
    }

    //Get message attributes
    //TO: destination of the message
    function data(to) {
        _message.to = to;

        parse();

        return _message;
    }

    //Parse all message attributes into browser console
    function parse(comment) {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var ms = d.getMilliseconds();

        //Message information container
        var messageInfo = h + ":" + m + ":" + s + ":" + ms + " ";
        if (typeof(comment) !== 'undefined') {
            messageInfo += " | " + comment + " |  ";
        }

        messageInfo += _whoami + " ";

        //Iterate over message attributes
        for (var key in _message) {

            //Get message attribute
            var value = _message[key];

            //Agg message attribute name and its value
            messageInfo += "| " + key + ": " + value + "  ";
        }

        //Log message attributes into browser console
        logger.log(messageInfo);
    }

    //Expose methods
    this.data = data;
    this.parse = parse;

    return this;
}