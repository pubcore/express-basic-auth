'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _authentication = require('@pubcore/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _authUser = require('@pubcore/auth-user');

var _authenticateGofer = require('../gofer/authenticateGofer');

var _authenticateGofer2 = _interopRequireDefault(_authenticateGofer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function (_ref) {
	var username = _ref.username,
	    password = _ref.password,
	    getUser = _ref.getUser,
	    getOptions = _ref.getOptions,
	    rest = _objectWithoutProperties(_ref, ['username', 'password', 'getUser', 'getOptions']);

	return (0, _authentication2.default)({
		username: username,
		password: password,
		gofer: (0, _authenticateGofer2.default)(rest),
		carrier: { getUser: getUser, getOptions: getOptions },
		lib: { comparePassword: _authUser.comparePassword }
	});
};