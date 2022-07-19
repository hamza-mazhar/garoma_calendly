const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  server: {
    PORT: process.env.PORT || 3000
  }
};

