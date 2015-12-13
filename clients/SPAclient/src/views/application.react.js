"use strict";

var _ = require("lodash");
var React = require("react");

var Command = require("../core/Command");
var Symbols = require("../core/Symbols");
var Query = require("../core/Query");
var Component = require("../core/Component");

var UserExistsStore = require("../stores/UserExistsStore");

var Application = Component.Create(UserExistsStore, {
    getState: function() {
        return {
            exists: UserExistsStore.get(_.get(this.state, 'username'))
        };
    },

    componentDidUpdate: function() {
        if (this.state.username && !UserExistsStore.has(this.state.username)) {
            Query(Symbols.UserExists, this.state.username);
        }
    },

    signIn: function() {
        var password = this.refs.password.getDOMNode().value;

        Command(Symbols.AuthenticateUser, this.state.username, password);
    },

    singUp: function() {
        var password = this.refs.password.getDOMNode().value;

        Command(Symbols.CreateUser, this.state.username, password);
    },

    _onUsernameChange: function(ev) {
        this.setState({ username: ev.target.value });
    },

    render: function() {
        return (<div>
            <div>exists: {this.state.exists}</div>
            <div>
                login: <input id="username"
                    onChange={this._onUsernameChange}
                    maxLength="255"
                    name="username"
                    type="text" />
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
