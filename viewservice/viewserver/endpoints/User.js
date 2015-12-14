"use strict";

var _ = require("lodash");

var Route = require("../../infrastructure/web/Route");
var ViewGateway = require("../../infrastructure/storage/ViewGateway");
var ApiResponse = require("../../infrastructure/web/ApiResponse");

module.exports = [
    new Route({
        method: "get",
        pattern: "/api/user/exists/:username/",
        handler: function (req, res) {
            ViewGateway.userToken(req.params.username, function(data) {
                ApiResponse.success(res, {username: req.params.username, exists: _.any(data)});
            });
        }
    }),
    new Route({
        method: "get",
        pattern: "/api/user/token/",
        handler: function (req, res) {
            ViewGateway.userToken(req.query.username, function(data) {
                ApiResponse.success(res, {username: req.params.username, token: _.any(data)});
            });
        }
    })
];
