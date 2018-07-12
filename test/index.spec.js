import chai, {expect} from 'chai'
import login from '../src/index'
import chaiHttp from 'chai-http'
import express from 'express'
import {createTestDb} from '@pubcore/auth-user'
import defaultMap from './userDefaultMap'

chai.use(chaiHttp)
const app = express(),
	options = {
		publicDeactivatedUri:'/login/deactivated',
		changePasswordUri:'/login/pwchange',
		publicCancelLoginUri:'/login/canceled',
		maxTimeWithoutActivity: 1000 * 60 * 60 * 24 * 180,//[msec]
		maxTimeWithout401: 1000 * 60 * 60 * 6,//[msec]
		maxLoginAttempts:1,
		maxLoginAttemptsTimeWindow:1000 * 60 * 60 * 24,//[msec]
	},
	getOptions = () => Promise.resolve(options),
	db = createTestDb({table:'ac_user', rows:defaultMap(), beforeEach, after}),
	error = err => {throw err}
	
app.use('/', login({db, getOptions}))

describe('http authentication service', () => {
	it('exports API', () => {
		expect(login).not.to.be.undefined
	})

	it('serves "Unauthorized" with canel URI on request without credentials', () => {
		return chai.request(app).get('/').send().then(
			res => {
				expect(res).to.have.status(401)
				expect(res.text).to.contain(options.publicCancelLoginUri)
			},
			error
		)
	})
	it('serves ok if username and password is ok', () => {
		return chai.request(app).get('/').auth('eve', 'test').send().then(
			res => expect(res).to.have.status(200), error
		)
	})
})
