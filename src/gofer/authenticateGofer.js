import {deactivateUser, addLoginFailed, resetLoginFailedCount,
	updateLastLogin} from '@pubcore/knex-auth'
import http401 from '../lib/http401'
import cookie from 'cookie'

export default ({db, res, req, options}) => {
	var {publicDeactivatedUri, changePasswordUri, publicCancelLoginUri} = options

	return {
		noCredentials: () => http401({publicCancelLoginUri, res}),
		notFound: () => http401({publicCancelLoginUri, res}),
		isDeactivated: () =>
			req.path !== publicDeactivatedUri && res.redirect(publicDeactivatedUri),
		toDeactivate: ({username}) => deactivateUser(db, {username}).then(
			() => res.redirect(publicDeactivatedUri)
		),
		invalidPassword: ({username}) => addLoginFailed(db, {username}).then(
			() => http401({publicCancelLoginUri, res})
		),
		authenticated: (user, isTimeToUpdate) => {
			var {login_failed_count, username} = user
			return Promise.resolve(
				login_failed_count > 0 && resetLoginFailedCount(db, {username})
			).then(
				() => isTimeToUpdate && updateLastLogin(db, {username})
			).then(() => user)
		},
		oldPwUsed: user => (user.oldPwUsed = true) && user,
		passwordExpired: () => {
			res.setHeader(
				'Set-Cookie',
				cookie.serialize('back-uri', String(req.originalUrl), {
					httpOnly: true, path:'/', secure:true
				}))
			req.path !== changePasswordUri && res.redirect(changePasswordUri)
		}
	}
}
