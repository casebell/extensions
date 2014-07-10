//Content script constant
var TAG = 'C_S';

//Internal flag which determine 
var _isMaster = false;

var msgQueue = new MessageQueue();

var errorOccurred = false;

var settings = {};

function validateRxMsg(message) {

    var res = false;

    if (message &&
        message.to &&
        message.to === TAG &&
        message.command) {
        res = true;
    }

    return res;
}

function sendMessageToIde(msg) {

    _message = new Message(msg, TAG).data("IDE");
    window.postMessage(_message, "*");
}

function sendMessageToBgs(message) {

    var _message;

    if (_isMaster) {
        //Get current message from the queue
        if (msgQueue.getLength() > 0) {
            _message = msgQueue.get().data(BACKGROUNDSCRIPT);
        } else {
            return;
        }
    } else {
        _message = new Message(message, TAG).data(BACKGROUNDSCRIPT);
        _message.isMaster = false;
    }

    _message.error = errorOccurred;

    setTimeout(function() {
        //Send message
        chrome.runtime.sendMessage(_message);
    }, settings.delayBeforeCommandExecution);
}

function setExtensionSign() {
    if (typeof(chrome.runtime.getManifest) == 'function') {
        var manifest = chrome.runtime.getManifest();
        $('#qaagent-ide').text(manifest.version);
    } else {
        $('#qaagent-ide').text('INSTALLED');
    }
}

//On Load
$(document).ready(function() {

    setExtensionSign();

    //Register event listener for commands from the master web page
    window.addEventListener("message", function(event) {

        // Accept only messages from page
        if (event.source != window) {
            return;
        }

        //Get messgae
        var msg = event.data;

        //Validate the message from IDE
        if (validateRxMsg(msg)) {

            msg.isMaster = _isMaster = true;

            var message = new Message(msg, TAG);
            message.parse('C_S MATSER INCOME');
            msgQueue.add(message);

            switch (msg.command) {
                case 'end':
                    {
                        sendMessageToBgs();
                    }
                    break;

                default:
                    {

                    }
                    break;
            }
        }

    }, false);


    //Listen for messages from background script
    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

        if (validateRxMsg(msg)) {
            if (_isMaster) {

                //When the slave content script determine that trehe is error
                //it should not be overwritten by master content script
                if (typeof(msg.error) !== 'undefined' && errorOccurred !== true) {
                    errorOccurred = msg.error;
                }

                //Send the status of current message to the IDE
                sendMessageToIde(msg);

                //Send next message for execution to the bacground script
                sendMessageToBgs();

                if (msg.command === 'end') {
                    errorOccurred = false;
                }
            } else {

                settings = msg.settings;

                switch (msg.command) {
                    case 'open':
                    case 'end':
                        {
                            sendMessageToBgs(msg);
                        }
                        break;

                    default:
                        {
                            //Try to get selector of the element we will interact with
                            var control = getControl(msg.action);

                            //if the statement is not a element selector, just execute it
                            if (typeof(control) === 'undefined') {

                                tryCatchAssure(msg.action);
                            } else {
                                //Wait for the element
                                $.waitForElement(control, settings.elementSearchTimeOut, settings.annotate).done(function(element) {

                                    try {
                                        //scroll to element
                                        $('html, body').animate({
                                            scrollTop: $(control).offset().top - 100
                                        }, 500);
                                    } catch (err) {}


                                    msg.action = assureStatementEnd(msg.action);

                                    var actionOnly = getActionOnly(msg.action);

                                    if (typeof(actionOnly) !== 'undefined') {
                                        //the action is one of the predefined
                                        if (isCustomAction(actionOnly)) {
                                            msg.action = formatCustomAction(msg.action);
                                            msg.action = tryCatchCustomActionAssure(msg.action);
                                            eval(msg.action)
                                        } else {
                                            //the action is one of jQuery actions
                                            msg.action = tryCatchAssure(msg.action);
                                            eval(msg.action)
                                        }
                                    } else {
                                        //the action can't be determine but it will be executed
                                        msg.action = tryCatchAssure(msg.action);
                                        eval(msg.action)
                                    }

                                }).fail(function() {
                                    // element does not exist before threshold time limit
                                    errorOccurred = true;
                                    sendMessageToBgs(msg);
                                });
                            }
                        }
                        break;
                }
            }
        }
    });
});

function formatCustomAction(action) {
    return (action + ".done(function(){\
        sendMessageToBgs(msg);\
    })\
    .fail(function(text) {\
        errorOccurred = true;\
        msg.text = text;\
        sendMessageToBgs(msg);\
    });");
}

function tryCatchCustomActionAssure(action) {
    return (
        "try\
          {" + action + "}\
        catch(err)\
          {\
            errorOccurred = true;\
            sendMessageToBgs(msg);\
          }"
    );
}

function tryCatchAssure(action) {
    return (
        "try\
          {" + action + ";sendMessageToBgs(msg);\
          }\
        catch(err)\
          {\
            errorOccurred = true;\
            sendMessageToBgs(msg);\
          }"
    );
}

function isCustomAction(actionOnly) {
    if (typeof(actionOnly) !== 'undefined') {
        return (actionOnly === 'isVisible' ||
            actionOnly === 'hasValue' ||
            actionOnly === 'verifyAttribute');

    }

    return false;
}

function getActionOnly(entireAction) {
    var action;

    if (entireAction.substring(0, 3) === "$('" ||
        entireAction.substring(0, 3) === '$("') {
        var beginingPattern = ').';
        var begining = entireAction.indexOf(beginingPattern) + beginingPattern.length;
        var end = entireAction.indexOf('(', begining);

        action = entireAction.substring(begining, end);
    }

    return action;
}

function getControl(action) {
    var control;
    var begining = 3;

    if (action.substring(0, begining) === "$('" ||
        action.substring(0, begining) === '$("') {

        var end = action.indexOf(').') - 1;

        control = action.substring(begining, end);
    }

    return control;
}

function assureStatementEnd(statement) {
    if (typeof(statement) !== 'undefined') {
        var endWith = statement.substring(statement.length - 1, statement.length);
        if (endWith === ';') {
            statement = statement.substring(0, statement.length - 1);
        }
    }

    return statement;

}