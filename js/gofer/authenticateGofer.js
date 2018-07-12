'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _authUser = require('@pubcore/auth-user');

var _http = require('../lib/http401');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var db = _ref.db,
	    res = _ref.res,
	    req = _ref.req,
	    options = _ref.options;
	var publicDeactivatedUri = options.publicDeactivatedUri,
	    changePasswordUri = options.changePasswordUri,
	    publicCancelLoginUri = options.publicCancelLoginUri;

	return {
		noCredentials: function noCredentials() {
			return (0, _http2.default)({ publicCancelLoginUri: publicCancelLoginUri, res: res });
		},
		notFound: function notFound() {
			return (0, _http2.default)({ publicCancelLoginUri: publicCancelLoginUri, res: res });
		},
		isDeactivated: function isDeactivated() {
			return res.redirect(publicDeactivatedUri);
		},
		toDeactivate: function toDeactivate(_ref2) {
			var username = _ref2.username;
			return (0, _authUser.deactivateUser)({ db: db, username: username }).then(function () {
				return res.redirect(publicDeactivatedUri);
			});
		},
		loginExpired: function loginExpired() {
			return (0, _http2.default)({ publicCancelLoginUri: publicCancelLoginUri, res: res });
		},
		invalidPassword: function invalidPassword(_ref3) {
			var username = _ref3.username;
			return (0, _authUser.addLoginFailed)({ db: db, username: username }).then(function () {
				return (0, _http2.default)({ publicCancelLoginUri: publicCancelLoginUri, res: res });
			});
		},
		authenticated: function authenticated(user) {
			var login_failed_count = user.login_failed_count,
			    username = user.username;

			if (login_failed_count > 0) {
				return (0, _authUser.addLoginFailedReset)({ db: db, username: username }).then(function (usr) {
					return usr;
				});
			} else {
				return user;
			}
		},
		oldPwUsed: function oldPwUsed(user) {
			return user;
		},
		passwordExpired: function passwordExpired() {
			return req.path !== changePasswordUri && res.redirect(changePasswordUri);
		}
	};
};