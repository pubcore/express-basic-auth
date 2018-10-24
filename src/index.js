import basicAuth from 'basic-auth'
import getUser, {comparePassword} from '@pubcore/knex-auth'
import authenticate from '@pubcore/authentication'
import gofer from './gofer/authenticateGofer'

const authenticateOptions = { //all time values in [ms]
	maxTimeWithoutActivity: 1000 * 60 * 60 * 24 * 180,
	maxLoginAttempts:5,
	maxLoginAttemptsTimeWindow:1000 * 60 * 60 * 24,
}

const httpOptions = {
	changePasswordUri:'/login/pwChange',
	publicDeactivatedUri:'/login/deactivated',
	publicCancelLoginUri:'/login/canceled',
}

export default ({db, options}) => (...args) => {
	var [req, res, next] = args,
		{name, pass} = basicAuth(req) || {}

	return authenticate({
		username:name,
		password:pass,
		gofer:gofer({
			db, req, res, options:{...httpOptions, ...options}
		}),
		carrier: {
			getOptions: () => Promise.resolve({...authenticateOptions, ...options}),
			getUser:({username}) => getUser(db, {username})
		},
		lib:{comparePassword}
	}).then(user => {
		if(user){
			var {username, email, first_name, last_name, last_login, oldPwUsed} = user
			req.user = {
				username, email, first_name, last_name, last_login, oldPwUsed
			}
		}
		next()
	}).catch(next)
}
