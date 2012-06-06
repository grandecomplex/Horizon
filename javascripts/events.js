/*

Horizon - a mobile web app view management framework
Author - Alex Grande

*/

window.h = window.h || {};

h.events = (function() {
    // use some open source event system
    var events = {
        eventMap: {},
        fire: function (eventName, data) {
            if (typeof this.eventMap[eventName] === "function") {
                this.eventMap[eventName](data);
            }
        },
        subscribe: function (eventName, fn, replace) {
            if (typeof this.eventMap[eventName] === "undefined" || replace) {
                this.eventMap[eventName] = fn;
            } else {
                var oldFunction = this.eventMap[eventName];
                this.eventMap[eventName] = function (data) {
                    if(typeof data !== "undefined") {
                        oldFunction(data);
                        fn(data);
                    } else {
                        oldFunction();
                        fn();
                    }
                };
            }
        }
    }
    
    return events;
})();