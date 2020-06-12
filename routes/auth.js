const express = require('express')
const passport = require('passport')
const boom = require('@hapi/boom')
const jwt = require('jsonwebtoken')
const ApiKeyService = require('../services/apiKeys')
const UserService = require('../services/users')
const { config } = require('../config')
const validationHandler = require('../utils/middleware/validationHandler')
const { createUserSchema } = require('../utils/schemas/users')
require('../utils/auth/strategies/basic')

function authApi(app){
  const router = express.Router()
  app.use('/api/auth', router)

  const apiKeyService = new ApiKeyService()
  const userService = new UserService()

  router.post('/sign-in', async (req,res,next) => {
    const { apiKeyToken } = req.body
    if(!apiKeyToken){
      next(boom.unauthorized("apiKeyToken is required"))
    }
    passport.authenticate('basic', (error, user) => {
      try {
        if(error || !user){
          next(boom.unauthorized())
        }
        req.login(user, {session:false}, async error => {
          if(error){
            next(error)
          }

          const apiKey = await apiKeyService.getApiKey({token: apiKeyToken})
          if(!apiKeyToken){
            next(boom.unauthorized())
          }
          const {_id: id, name, email} = user
          const payload = {
            sub: id, name, email, scopes: apiKey.scopes
          }
          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '15m'
          })

          return res.status(200).json({token, user: {id,name,email}})
        })
      } catch (error) {
        next(error)
      }
    })(req,res,next)
  })

  router.post('/sign-up',validationHandler(createUserSchema), async (req,res,next) => {
    const {body: user} = req
    try {
      const createUserId = await userService.createUser(user)
      res.status(201).json({
        data: createUserId,
        message: 'User created'
      })
    } catch (error) {
      next(error)
    }
  })
}

module.exports = authApi