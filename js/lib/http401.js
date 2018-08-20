'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (_ref) {
	var publicCancelLoginUri = _ref.publicCancelLoginUri,
	    res = _ref.res;

	var text = 'Unauthorized (401)';
	res.status(401);
	res.append('WWW-Authenticate', 'Basic Realm="Pls cancel this dialog if you forgot your password."');
	res.format({
		'text/html': function textHtml() {
			return res.send('<!DOCTYPE html>\n<html><body>\n\t' + text + '\n\t<script>document.location.href=\'' + publicCancelLoginUri + '\'</script>\n</body></html>');
		},
		'application/json': function applicationJson() {
			return res.send({ status: { code: 'ERROR', text: text }, publicCancelLoginUri: publicCancelLoginUri });
		},
		default: function _default() {
			return res.send(text + '; see ' + publicCancelLoginUri);
		}
	});
};