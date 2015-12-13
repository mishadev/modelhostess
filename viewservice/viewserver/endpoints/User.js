"use strict";

var Route = require("../../infrastructure/web/Route");
var ViewGateway = require("../../infrastructure/storage/ViewGateway");

module.exports = [
    new Route({
        method: "get",
        pattern: "/api/user/exists/:username",
        handler: function (req, res) {
            ViewGateway.userExists({username: req.params("username")}, function(data) {
                console.dir(data);
                res.send(data);
            });
        }
    })
];
