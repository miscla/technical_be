const router = require('express').Router();

const UserQuery = require('./controllers/users/query/domain');
const UserCommand = require('./controllers/users/command/domain');

const SalesQuery = require('./controllers/sales/query/domain');
const SalesCommand = require('./controllers/sales/command/domain');

const jwtAuth = require('../helpers/auth/jwtAuth');
const basicAuth = require('../helpers/auth/basicAuth');

// Initialize basic authentication.
// router.use(basicAuth.init());

/**
 * @modules
 * Users module.
 */
// router.get('/api/users', jwtAuth.authenticateJWT, UserQuery.getUsers);
// router.get('/api/users/:userId', basicAuth.isAuthenticated, UserQuery.getUserById);

// router.post('/api/users', basicAuth.isAuthenticated, UserCommand.createUsers);
// router.post('/api/users/login', basicAuth.isAuthenticated, UserCommand.loginUsers);

// router.put('/api/users/:userId', jwtAuth.authenticateJWT, UserCommand.updateUsers);
// router.delete('/api/users/:userId', jwtAuth.authenticateJWT, UserCommand.deleteUsers);

// router.post('/api/users/shortener', UserCommand.shortener);
// router.get('/api/users/shortener/:linkUniq', UserCommand.getShortener);
// router.get('/api/users/check-shortener/:linkUniq', UserCommand.checkShortener);

router.get('/api/sales/most-sold', SalesQuery.getSales);
router.get('/api/sales/most-sold-byCountry', SalesQuery.getMostSoldByCountry);
router.get('/api/sales/correlation', SalesQuery.getCorellation);

module.exports = router;
