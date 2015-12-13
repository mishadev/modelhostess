"use strict";

var _ = require("lodash");

var Route = require("../../infrastructure/web/Route");
var ApiResponse = require("../../infrastructure/web/ApiResponse");
var Validation = require("../../infrastructure/utils/Validation");

var Command = require("../commands/Command");

module.exports = [
    new Route({
        method: "post",
        pattern: "/api/auth",
        handler: function (req, res) {
            console.dir(req.body);
            res.send("test");
        }
    }),
    new Route({
        method: "post",
        pattern: "/api/users/create",
        handler: function (req, res) {
            try {
                var user = _.pick(req.body, ["username", "password"]);
                Validation.IsTypeOf(user, "string", ["username", "password"]);

                Command("createUser", req.body);
                ApiResponse.success(res);
            }
            catch (e) {
                console.dir(e);
                ApiResponse.badRequest(res, e.toString());
            }
        }
    })
];
