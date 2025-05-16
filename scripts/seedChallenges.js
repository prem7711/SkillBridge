const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Replace with your admin JWT token
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIxNzRmZjg3NDEwZGRiZTk4NTUwM2MiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDcwMjM2MzMsImV4cCI6MTc0NzYyODQzM30.mAsjK0mHjPaT4F0pIocCo4jgLH8fNEyAtxd4DG0lb64'; // Replace this with a valid admin token

// Correct the file path to the challenges.json file
const challengesFilePath = path.join(__dirname, '..', 'data', 'challenges.json');  // Adjusted path

// Read challenges data from the 'data/challenges.json' file
const challenges = JSON.parse(fs.readFileSync(challengesFilePath, 'utf8'));

// Function to seed challenges to the backend
const seedChallenges = async () => {
    for (const challenge of challenges) {
        try {
            const response = await axios.post('http://localhost:5001/api/challenges', challenge, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });
            console.log(`Challenge added: ${response.data.title}`);
        } catch (error) {
            console.error(`Error adding challenge: ${error.response ? error.response.data : error.message}`);
        }
    }
};

// Start the seeding process
seedChallenges();
