const MongoLib = require('../lib/mongo');

class MoviesService {
  constructor() {
    this.collection = 'movies';
    this.mongoDB = new MongoLib();
  }

  async getMovies({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const movies = await this.mongoDB.getAll(this.collection, query);
    return movies || [];
  }

  async getMovie(movieId) {
    const movie = await this.mongoDB.get(this.collection, movieId);
    return movie || {};
  }

  async createMovie(movie) {
    const idCreatedMovie = await this.mongoDB.create(this.collection, movie);
    return idCreatedMovie;
  }

  async updateMovie(movie, movieId) {
    const idUpdatedMovie = await this.mongoDB.update(
      this.collection,
      movieId,
      movie
    );
    return idUpdatedMovie;
  }

  async deleteMovie(movieId) {
    const idDeletedMovie = await this.mongoDB.delete(this.collection, movieId);
    return idDeletedMovie;
  }
}

module.exports = MoviesService;
