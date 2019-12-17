const server = require('./api/server');
require('dotenv').config();

const port = process.nextTick.PORT || 5000;
server.listen(port, () => {
  console.log(`\n=== Server listening on port ${port} ===\n`);
});
