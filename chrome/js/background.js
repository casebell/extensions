//Tag of the background script
var TAG = 'BGS';

//Name of the content script which should be able to comunicate with this background script
var CONTENTSCRIPT = 'C_S';

//Mapping between master and coresponding slave tab
var masterSlaveMap = new TabMap();

//Mapping between the slave tab and its current message
var slaveCurrentMessageMap = [];

//Tab status map - possible values: loading or complete
var tabStatus = [];

var settings = {};

//Validate correctnes of the message
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

//Verify correctness of the 'url'
function verifyUrl(url) {
    return true;
}

//Open new browser tab and load address defined in 'url'
function openUrl(msg, masterTabId) {

    //Extract the url from the received message
    var url = msg.action;

    //Verify that the 'url' is correct
    if (verifyUrl(url)) {

        //Create new tab and load the 'url'
        chrome.tabs.create({
            url: url
        }, function(tab) {
            masterSlaveMap.add(masterTabId, tab.id, msg.tcid);
            slaveCurrentMessageMap[tab.id] = msg;
        });
    }
}

function waitUntilReady(msg, masterTabId) {

    slaveCurrentMessageMap[tab.id] = msg;
}

//This listener is used to determine when the slave tab is completely loaded
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    if (typeof(changeInfo.status) !== 'undefined') {
        var message = slaveCurrentMessageMap[tabId];
        tabStatus[tabId] = changeInfo.status;
        logger.log(tabId + ": " + changeInfo.status);

        //Check whether master tab with particular slave id exists
        if (masterSlaveMap.getMasterBySlave(tabId) !== -1 &&
            typeof(message) !== 'undefined') {
            //Check whether the slave is loaded completely
            if (changeInfo.status === 'complete') {
                switch (message.command) {
                    case 'open':
                        {
                            setTimeout(function() {
                                //Send back the open message
                                sendMessage(slaveCurrentMessageMap[tabId], tabId);
                                slaveCurrentMessageMap.splice(tabId, 1);
                            }, settings.delayBeforeExecution);
                        }
                        break;

                    case 'waitBrowserReady':
                        {
                            sendMessage(slaveCurrentMessageMap[tabId], masterSlaveMap.getMasterById(tabId));
                            slaveCurrentMessageMap.splice(tabId, 1);
                        }
                        break;

                    default:
                        {
                            sendMessage(slaveCurrentMessageMap[tabId], tabId);
                            slaveCurrentMessageMap.splice(tabId, 1);
                        }
                }
            }
        }
    }
});

//Inject 'code' in the chrome tab with predefined 'tabId'
function injectCode(masterTabId, msg) {

    var slaveTabId = masterSlaveMap.getSlaveById(msg.tcid);

    if (slaveTabId === -1) {
        logger.log('slaveTabId is undefined');
        return;
    }

    sendMessage(msg, slaveTabId);
}

function waitBrowserReady(masterTabId, msg) {

    var slaveTabId = masterSlaveMap.getSlaveById(msg.tcid);

    if (slaveTabId === -1) {
        logger.log('slaveTabId is undefined');
        return;
    }

    slaveCurrentMessageMap[slaveTabId] = msg;
}

//Listen messages from content script
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    if (validateRxMsg(msg)) {

        if (sender &&
            sender.tab &&
            sender.tab.id) {

            var senderTabId = sender.tab.id;

            new Message(msg, TAG).parse(senderTabId + ' BGS INCOME');

            if (msg.isMaster === true) {
                var slaveTabId = masterSlaveMap.getSlaveById(msg.tcid);

                switch (msg.command) {
                    case 'open':
                        {
                            settings = msg.settings;
                            openUrl(msg, senderTabId);
                        }
                        break;

                    case 'end':
                        {
                            if (settings.closeOnComplete) {
                                chrome.tabs.remove(slaveTabId, function() {
                                    chrome.tabs.update(senderTabId, {
                                        selected: true
                                    });
                                });
                            }

                            //Remove master ide from the status queue
                            tabStatus.splice(senderTabId, 1);

                            //Remove slave tab from the status queue
                            tabStatus.splice(slaveTabId, 1);

                            sendMessage(msg, senderTabId);
                        }
                        break;

                    case 'waitBrowserReady':
                        {
                            waitBrowserReady(senderTabId, msg);
                        }
                        break;

                    default:
                        {
                            switch (msg.action) {

                                default: {
                                    injectCode(senderTabId, msg);
                                }
                                break;
                            }
                        }
                        break;
                }
            } else {
                var masterTabId = masterSlaveMap.getMasterById(msg.tcid);
                
                if(masterTabId == -1)
                {
                    logger.log('##### Sender id ' + senderTabId);
                }

                sendMessage(msg, masterTabId);
            }
        }
    }
});

//Send message to Content Script
function sendMessage(message, tab) {
    logger.log('Send to ' + tab);
    var _message = new Message(message, TAG).data(CONTENTSCRIPT);
    chrome.tabs.sendMessage(tab, _message);
}