'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (_ref) {
	var publicCancelLoginUri = _ref.publicCancelLoginUri,
	    res = _ref.res;

	var _text = 'Unauthorized (401)';
	res.status(401);
	res.append('WWW-Authenticate', 'Basic Realm="Pls cancel this dialog if you forgot your password."');
	res.format({
		'text/html': function textHtml() {
			return res.send('<html><body>' + _text + '<script>document.location.href=\'' + publicCancelLoginUri + '\'</script></body></html>');
		},
		'application/json': function applicationJson() {
			return res.send({ status: { code: 'ERROR', text: _text }, publicCancelLoginUri: publicCancelLoginUri });
		},
		text: function text() {
			return res.send(_text);
		},
		default: function _default() {
			return res.send(_text);
		}
	});
};