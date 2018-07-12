import {deactivateUser, addLoginFailed, addLoginFailedReset} from '@pubcore/auth-user'
import http401 from '../lib/http401'

export default ({db, res, req, options}) => {
	var {publicDeactivatedUri, changePasswordUri,
		publicCancelLoginUri} = options
	return {
		noCredentials: () => http401({publicCancelLoginUri, res}),
		notFound: () => http401({publicCancelLoginUri, res}),
		isDeactivated: () => res.redirect(publicDeactivatedUri),
		toDeactivate: ({username}) => deactivateUser({db, username}).then(
			() => res.redirect(publicDeactivatedUri)
		),
		loginExpired: () => http401({publicCancelLoginUri, res}),
		invalidPassword: ({username}) => addLoginFailed({db, username}).then(
			() => http401({publicCancelLoginUri, res})
		),
		authenticated: user => {
			var {login_failed_count, username} = user
			if(login_failed_count > 0){
				return addLoginFailedReset({db, username}).then(usr => usr)
			}else{
				return user
			}
		},
		oldPwUsed: user => user,
		passwordExpired: () =>
			req.path !== changePasswordUri && res.redirect(changePasswordUri)
	}
}
