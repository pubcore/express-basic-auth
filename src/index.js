import basicAuth from 'basic-auth'
import getUser from '@pubcore/auth-user'
import authenticate from '@pubcore/authentication'
import {comparePassword} from '@pubcore/auth-user'
import gofer from './gofer/authenticateGofer'

const authenticateOptions = { //all time values in [ms]
	maxTimeWithoutActivity: 1000 * 60 * 60 * 24 * 180,
	maxTimeWithout401: 1000 * 60 * 60 * 6,
	maxLoginAttempts:5,
	maxLoginAttemptsTimeWindow:1000 * 60 * 60 * 24,
}

const httpOptions = {
	publicDeactivatedUri:'/login/deactivated',
	changePasswordUri:'/login/pwChange',
	publicCancelLoginUri:'/login/canceled',
	publicInternalServerErrorUri:'/unexpected/error'
}

export default ({db, getOptions}) => (...args) => {
	var [req, res, next] = args,
		{name, pass} = basicAuth(req) || {}

	return getOptions().then(options => authenticate({
		username:name,
		password:pass,
		gofer:gofer({
			db, req, res, options:{...httpOptions, ...(options || {})}
		}),
		carrier: {
			getOptions: () => Promise.resolve({...authenticateOptions, ...(options||{})}),
			getUser:({username}) => getUser({db, username})
		},
		lib:{comparePassword}
	})).catch(err => next(err))
}
