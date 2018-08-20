'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _basicAuth = require('basic-auth');

var _basicAuth2 = _interopRequireDefault(_basicAuth);

var _knexAuth = require('@pubcore/knex-auth');

var _knexAuth2 = _interopRequireDefault(_knexAuth);

var _authentication = require('@pubcore/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _authenticateGofer = require('./gofer/authenticateGofer');

var _authenticateGofer2 = _interopRequireDefault(_authenticateGofer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authenticateOptions = { //all time values in [ms]
	maxTimeWithoutActivity: 1000 * 60 * 60 * 24 * 180,
	maxLoginAttempts: 5,
	maxLoginAttemptsTimeWindow: 1000 * 60 * 60 * 24
};

var httpOptions = {
	changePasswordUri: '/login/pwChange',
	publicDeactivatedUri: '/login/deactivated',
	publicCancelLoginUri: '/login/canceled'
};

exports.default = function (_ref) {
	var db = _ref.db,
	    options = _ref.options;
	return function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		var req = args[0],
		    res = args[1],
		    next = args[2],
		    _ref2 = (0, _basicAuth2.default)(req) || {},
		    name = _ref2.name,
		    pass = _ref2.pass;

		return (0, _authentication2.default)({
			username: name,
			password: pass,
			gofer: (0, _authenticateGofer2.default)({
				db: db, req: req, res: res, options: _extends({}, httpOptions, options)
			}),
			carrier: {
				getOptions: function getOptions() {
					return Promise.resolve(_extends({}, authenticateOptions, options));
				},
				getUser: function getUser(_ref3) {
					var username = _ref3.username;
					return (0, _knexAuth2.default)(db, { username: username });
				}
			},
			lib: { comparePassword: _knexAuth.comparePassword }
		}).then(function (user) {
			user && (req.user = user);
			next();
		}).catch(next);
	};
};