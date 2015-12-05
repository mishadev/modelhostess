"use strict";

function Handler() {
    this.handle = function handle(message, callback) {
        callback();
    }
}

module.exports = Handler;
