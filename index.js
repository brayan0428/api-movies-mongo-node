const express = require('express');
const app = express();
const { config } = require('./config/index');
const moviesApi = require('./routes/movies');
const userMoviesApi = require('./routes/userMovies');
const authApi = require('./routes/auth')
const passport = require('passport')
require('./utils/auth/strategies/jwt')
const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./utils/middleware/errorHandlers');
const notFoundHandler = require('./utils/middleware/notFoundHandler');
const cors = require('cors');

//app.use(cors);
app.use(express.json());

authApi(app)

//Middleware JWT
app.use(passport.authenticate('jwt' ,{session:false}))
moviesApi(app);
userMoviesApi(app);

//Catch Error 404
app.use(notFoundHandler);

//Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});
