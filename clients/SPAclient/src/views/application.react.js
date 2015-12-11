"use strict";

var React = require("react");

var Command = require("../core/Command");
var Symbols = require("../core/Symbols");
var Query = require("../core/Query");
var Component = require("../core/Component");

var UserInfoStore = require("../stores/UserInfoStore");

var Application = Component.Create(UserInfoStore, {
    getState: function() {
        return {
            UserInfo: UserInfoStore.get()
        };
    },

    componentDidUpdate: function() {
        if (!UserInfoStore.has()) {
            Query(Symbols.UserInfo);
        }
    },

    signIn: function() {
        var username = this.refs.username.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;

        Command(Symbols.AuthenticateUser, username, password);
    },

    singUp: function() {
        var username = this.refs.username.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;

        Command(Symbols.CreateUser, username, password);
    },

    render: function() {
        return (<div>
            <div>{this.state.UserInfo}</div>
            <div>
                login: <input id="username" ref="username" maxLength="255" name="username" type="text" />
            </div>
            <div>
                password: <input id="password" ref="password" name="password" type="password" />
            </div>
            <div>
                <button onClick={this.signIn}>Sign In</button>
            </div>
            <div>
                <button onClick={this.singUp}>Sing Up</button>
            </div>
        </div>);
    }
});

module.exports = Application;
