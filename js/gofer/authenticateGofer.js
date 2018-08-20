'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _knexAuth = require('@pubcore/knex-auth');

var _http = require('../lib/http401');

var _http2 = _interopRequireDefault(_http);

var _cookie = require('cookie');

var _cookie2 = _interopRequireDefault(_cookie);

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
			return req.path !== publicDeactivatedUri && res.redirect(publicDeactivatedUri);
		},
		toDeactivate: function toDeactivate(_ref2) {
			var username = _ref2.username;
			return (0, _knexAuth.deactivateUser)(db, { username: username }).then(function () {
				return res.redirect(publicDeactivatedUri);
			});
		},
		invalidPassword: function invalidPassword(_ref3) {
			var username = _ref3.username;
			return (0, _knexAuth.addLoginFailed)(db, { username: username }).then(function () {
				return (0, _http2.default)({ publicCancelLoginUri: publicCancelLoginUri, res: res });
			});
		},
		authenticated: function authenticated(user, isTimeToUpdate) {
			var login_failed_count = user.login_failed_count,
			    username = user.username;

			return Promise.resolve(login_failed_count > 0 && (0, _knexAuth.resetLoginFailedCount)(db, { username: username })).then(function () {
				return isTimeToUpdate && (0, _knexAuth.updateLastLogin)(db, { username: username });
			}).then(function () {
				return user;
			});
		},
		oldPwUsed: function oldPwUsed(user) {
			return (user.oldPwUsed = true) && user;
		},
		passwordExpired: function passwordExpired() {
			res.setHeader('Set-Cookie', _cookie2.default.serialize('back-uri', String(req.originalUrl), {
				httpOnly: true, path: '/', secure: true
			}));
			req.path !== changePasswordUri && res.redirect(changePasswordUri);
		}
	};
};