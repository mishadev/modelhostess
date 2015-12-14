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
            status: UserExistsStore.get(_.get(this.state, 'username'))
        };
    },

    componentWillMount: function(argument) {
        this._setStateDebounced = _.debounce(this.setState, 500);
    },

    componentDidUpdate: function() {
        if (this.state.username && !UserExistsStore.has(this.state.username)) {
            Query(Symbols.UserExists, this.state.username);
        }
    },

    signIn: function() {
        var password = this.refs.password.getDOMNode().value;

        Query(Symbols.GetUserToken, this.state.username, password);
    },

    singUp: function() {
        var password = this.refs.password.getDOMNode().value;

        Command(Symbols.CreateUser, this.state.username, password);
    },

    _onUsernameChange: function(ev) {
        this._setStateDebounced({ username: ev.target.value });
    },

    render: function() {
        return (<div>
            <div>
                login: <input id="username"
                    onChange={this._onUsernameChange}
                    maxLength="255"
                    name="username"
                    type="text" />
                <div>{_.get(this.state, ["status", "exists"]) && 'already exists'}</div>
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
