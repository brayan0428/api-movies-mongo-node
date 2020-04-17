const express = require('express');
const MoviesService = require('../services/movies');
const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require('../utils/schemas/movies');

const joi = require('@hapi/joi');

const validationHandler = require('../utils/middleware/validationHandler');

function moviesApi(app) {
  const router = express.Router();
  const moviesService = new MoviesService();
  app.use('/api/movies', router);

  router.get('/', async (req, res, next) => {
    try {
      const { tags } = req.query;
      const movies = await moviesService.getMovies(tags);
      res.status(200).json({
        data: movies,
        message: 'Movies listed',
      });
    } catch (error) {
      next(error);
    }
  });

  router.get(
    '/:movieId',
    validationHandler(joi.object({ movieId: movieIdSchema }), 'params'),
    async (req, res, next) => {
      try {
        const { movieId } = req.params;
        const movie = await moviesService.getMovie(movieId);
        res.status(200).json({
          data: movie,
          message: 'Movie retrieved',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/',
    validationHandler(createMovieSchema),
    async (req, res, next) => {
      const { body: movie } = req;
      try {
        const createdMovieId = await moviesService.createMovie(movie);
        res.status(201).json({
          data: createdMovieId,
          message: 'Movie created',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    '/:movieId',
    validationHandler(joi.object({ movieId: movieIdSchema }), 'params'),
    validationHandler(updateMovieSchema),
    async (req, res, next) => {
      const { movieId } = req.params;
      const movie = req.body;
      try {
        const movieUpdatedId = await moviesService.updateMovie(movie, movieId);
        res.status(200).json({
          data: movieUpdatedId,
          message: 'Movie updated',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    '/:movieId',
    validationHandler(joi.object({ movieId: movieIdSchema }), 'params'),
    async (req, res, next) => {
      const { movieId } = req.params;
      try {
        const movieDeletedId = await moviesService.deleteMovie(movieId);
        res.status(200).json({
          data: movieDeletedId,
          message: 'Movie deleted',
        });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = moviesApi;
