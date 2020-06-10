const express = require('express');
const UserMoviesService = require('../services/userMovies');
const { userIdSchema } = require('../utils/schemas/users');
const {
  createUserMovieSchema,
  userMovieIdSchema,
} = require('../utils/schemas/userMovies');
const validationHandler = require('../utils/middleware/validationHandler');

function UserMoviesApi(app) {
  const router = express.Router();
  app.use(router, '/api/user-movies');

  const userMoviesService = new UserMoviesService();

  router.get(
    '/',
    validationHandler(userIdSchema, 'query'),
    async (req, res, next) => {
      try {
        const userId = req.query;
        const userMovies = await userMoviesService.getUserMovies(userId);
        res.status(200).json({
          data: userMovies,
          message: 'User movies listed',
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.post(
    '/',
    validationHandler(createUserMovieSchema),
    async (req, res, next) => {
      try {
        const { body: userMovie } = req;
        const createdUserMovieId = await userMoviesService.createUserMovie(
          userMovie
        );
        res.status(201).json({
          data: createdUserMovieId,
          message: 'User movie created',
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.delete(
    '/:userMovieId',
    validationHandler({ userMovieId: userMovieIdSchema }, 'params'),
    async (req, res, next) => {
      try {
        const { userMovieId } = req.params;
        const userMovieDeleted = await userMoviesService.deleteUserMovie(
          userMovieId
        );
        res.status(200).json({
          data: userMovieDeleted,
          message: 'User movie deleted',
        });
      } catch (e) {
        next(e);
      }
    }
  );
}

module.exports = UserMoviesApi;
