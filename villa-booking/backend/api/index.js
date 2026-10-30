// Vercel serverless entrypoint. server.js exports the Express app; when
// VERCEL is set it skips app.listen (see server.js). Route order is preserved:
// express.raw on the Razorpay webhook is mounted before express.json.
const app = require('../server');

module.exports = app;
