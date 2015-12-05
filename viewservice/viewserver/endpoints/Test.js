"use strict";

var Route = require('../../infrastructure/web/Route');

module.exports = [
    new Route({
        method: 'get',
        pattern: '/api/test',
        handler: function (req, res) {
            res.send('API is running');
        }
    })
];
