// app.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const profileRoutes = require('./routes/profile');
const recommendationRoutes = require('./routes/recommendations')
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const app = express();

const server = http.createServer(app);
const corsOptions = {
    //origin: '*', // Allow all origins (for dev only!)
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
};

app.use(cors(corsOptions)); // Apply CORS globally

app.use(express.json());
console.log("hello");

app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.use('/api/leaderboard', leaderboardRoutes);

//app.options('*', cors(corsOptions));

// Test Route (root)

app.get('/', (req, res) => {
    console.log("Received request:", req.method, req.url, req.headers);
    console.log("hello prem");
    res.send('SkillBridge API is running!');
});




const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Your frontend URL
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Listening for Socket.IO connections
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // You can listen for specific events from the client
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.set('io', io);
// Export the app and server
module.exports = { app, server };

// module.exports = app;
