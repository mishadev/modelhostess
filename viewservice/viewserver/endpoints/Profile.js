"use strict";

var Route = require('../../infrastructure/web/Route');
var ViewGateway = require('../../infrastructure/storage/ViewGateway');

module.exports = [
    new Route({
        method: 'get',
        pattern: '/api/profile/',
        handler: function (req, res) {
            var token = req.headers['X-User-Token'];

            ViewGateway.GetProfiles({token: token}, function(data) {
                res.send(data);
            });
        }
    })
];
