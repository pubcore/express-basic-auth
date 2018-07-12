export default ({publicCancelLoginUri, res}) => {
	var text = 'Unauthorized (401)'
	res.status(401)
	res.append(
		'WWW-Authenticate',
		'Basic Realm="Pls cancel this dialog if you forgot your password."'
	)
	res.format({
		'text/html': () => res.send(
			`<html><body>${text}<script>document.location.href='${publicCancelLoginUri}'</script></body></html>`
		),
		'application/json': () => res.send({status:{code:'ERROR', text}, publicCancelLoginUri}),
		text: () => res.send(text),
		default: () => res.send(text)
	})
}
