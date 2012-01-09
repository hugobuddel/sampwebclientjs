/*jslint node: true */

(function () {
    "use strict";
    var xmlrpc, samp;

    xmlrpc = require('xmlrpc');

    samp = function () {

        // Information about the client.
        // TODO: A 'window'-independent way to get the icon url.
        //var baseUrl = window.location.href.toString().replace(new RegExp("[^/]*$"), "");
        this.metadata = {
            "samp.name": "Sample SAMP client",
            "samp.description": "My first SAMP web application",
            //"samp.icon.url": baseUrl + "clientIcon.gif",
            "author.name": "Hugo Buddelmeijer"
        };

        // A flag to indicate whether new messages should be requested
        // from the server.
        this.do_callbacks = true;

        // A stub demo message handler.
        this.handler_echo = function (senderId, mtype, params) {
            var xx;
            xx = "ECHO" + " " + senderId + " " + mtype + " " + params;
            console.log(xx);
        };

        // MTypes that the client accepts.
        // TODO: Implement support for the MType options map.
        this.subscriptions = {
            "samp.app.ping": this.handler_echo
        };

        // Internal counter for send messages. Used to link responses to
        // the right message.
        this.counterMsgTag = 0;

        // General message dispatcher.
        this.handleMessages = function (messages) {
            var i,  message, methodName, senderId, mtype, params, handler, response, messageId, responderId;
            console.log("Number of messages: " + messages.length);
            // Can this be done without a for loop?
            for (i = 0; i < messages.length; i += 1) {
                message = messages[i];
                console.log(message);
                methodName = message["samp.methodName"];
                switch (methodName) {
                case "receiveCall":
                    senderId = message["samp.params"][0];
                    messageId = message["samp.params"][1];
                    mtype = message["samp.params"][2]["samp.mtype"];
                    params = message["samp.params"][2]["samp.params"];
                    handler = this.subscriptions[mtype];
                    response = handler(senderId, mtype, params);
                    this.reply(messageId, response);
                    break;
                case "receiveResponse":
                    responderId = message["samp.params"][0];
                    messageId = message["samp.params"][1];
                    mtype = message["samp.params"][1]["samp.mtype"];
                    // TODO: do something with result
                    break;
                case "receiveNotification":
                    senderId = message["samp.params"][0];
                    mtype = message["samp.params"][1]["samp.mtype"];
                    params = message["samp.params"][1]["samp.params"];
                    handler = this.subscriptions[mtype];
                    response = handler(senderId, mtype, params);
                    break;
                }
            }
            // TODO: Could this cause problems with recursion depth?
            this.callback();
        };

        this.callback = function () {
            console.log("Doing a callback.");
            if (this.do_callbacks) {
                var handlerfunction = this.handleMessages.bind(this);
                this.xmlRpcServer.methodCall(
                    'samp.webhub.pullCallbacks',
                    [this.secret, "10"],
                    function (error, value) {
                        if (error !== null) {
                            // TODO: Proper error handling.
                            console.log("Error in callback:" + error);
                            this.callback();
                        } else {
                            handlerfunction(value);
                        }
                    }.bind(this)
                );
            }
        };

        this.connect = function () {

            this.xmlRpcServer = xmlrpc.createClient({
                host: 'localhost',
                port: 21012,
                path: '/'
            });

            this.xmlRpcServer.methodCall(
                'samp.webhub.register',
                [{"samp.name": this.metadata["samp.name"]}],
                function (error, value) {
                    // TODO: Error handling.
                    this.hubinfo = value;
                    this.secret = this.hubinfo["samp.private-key"];
                    this.declareMetadata();
                    this.allowReverseCallbacks();
                }.bind(this)
            );

        };

        this.declareMetadata = function () {
            this.xmlRpcServer.methodCall(
                'samp.webhub.registerMetadata',
                [this.secret, this.metadata],
                function (error, value) {}
            );
        };

        this.allowReverseCallbacks = function () {
            this.xmlRpcServer.methodCall(
                'samp.webhub.allowReverseCallbacks',
                [this.secret, "1"],
                function (error, value) {
                    this.declareSubscriptions();
                }.bind(this)
            );
        };

        this.declareSubscriptions = function () {
            var mtype, tempsubscriptions = {};
            for (mtype in this.subscriptions) {
                if (this.subscriptions.hasOwnProperty(mtype)) {
                    tempsubscriptions[mtype] = {};
                }
            }
            console.log("declaring subscriptions");
            this.xmlRpcServer.methodCall(
                'samp.webhub.declareSubscriptions',
                [this.secret, tempsubscriptions],
                function (error, value) {
                    this.callback();
                }.bind(this)
            );
        };

        this.disconnect = function () {
            this.do_callbacks = false;
            this.xmlRpcServer.methodCall(
                'samp.webhub.unregister',
                [this.secret],
                function (error, value) {}
            );
        };

        this.callall = function (message) {
            this.counterMsgTag += 1;
            // TODO: store messages etc.
            this.xmlRpcServer.samp_webhub_callAll(
                this.secret,
                this.counterMsgTag,
                message
            );
        };

        this.reply = function (messageId, response) {
            this.xmlRpcServer.samp_webhub_callAll(
                this.secret,
                messageId,
                response
            );
        };
    };
    module.exports = samp;
}());

// TODO: Do something below, or rely on pakmanager?
//var exports = exports || {};
//exports.samp = samp;
