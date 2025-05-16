// server.js
const connectDB = require('./config/db');


const { app, server } = require('./app');


require('dotenv').config();


const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
