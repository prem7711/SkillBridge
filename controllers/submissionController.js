const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const axios = require('axios');

exports.submitCode = async (req, res) => {
    try {
        // console.log(req.body);
        const { challengeId, solutionCode, language } = req.body;
        const userId = req.user._id;
        
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

  
        console.log(req.body);

        // console.log(challenge);
        // console.log(solutionCode);
        // console.log(challenge.expectedOutput);
        const submission = new Submission({
            userId,
            challengeId,
            code: solutionCode
        });

        await submission.save();

        // console.log(userId, challengeId, code);

        const socketId = req.body.socketId;
if (!socketId) {
  console.error("Missing socketId");
}

        // Emit "Compiling..." to the frontend
        // req.app.get('io').to(socketId).emit('stage', '⏳ Compiling...');


        req.app.get('io').to(socketId).emit('evaluation-update', {
            challengeId: req.body.challengeId,
            message: '⏳ Compiling...'
        });
        

        // Call Python evaluator (running locally on port 5001)
        const response = await axios.post('http://localhost:5005/evaluate', {
            language: language,
            code: solutionCode,
            input: challenge.sampleInput,
            expectedOutput: challenge.expectedOutput
        });
        //console.log(response.data);
        req.app.get('io').to(socketId).emit('evaluation-update', {
            challengeId: req.body.challengeId,
            message: '🚀 Running...'
        });

        // console.log(language, code, input, expectedOutput);

        // Emit "Running..." to the frontend
        // req.app.get('io').to(socketId).emit('stage', '🚀 Running...');

        const { passed, actualOutput, error } = response.data;


        req.app.get('io').to(socketId).emit('evaluation-update', {
            challengeId: req.body.challengeId,
            message: '✅ Comparing output...'
        });
        

        console.log(passed, actualOutput);
        // Emit "Comparing Output..." to the frontend
       // req.app.get('io').to(socketId).emit('stage', '✅ Comparing output...');
        submission.status = passed ? 'passed' : 'failed';
        submission.resultOutput = actualOutput;
        submission.error = error || '';
        await submission.save();


        req.app.get('io').to(socketId).emit('evaluation-complete', {
            challengeId: req.body.challengeId,
            result: passed ? 'Passed ✅' : 'Failed ❌',
            output: actualOutput,
            error: error || null
        });

        res.status(200).json({ message: passed ? 'Challenge Passed' : 'Challenge Failed', submission });

        //req.app.get('io').to(socketId).emit('stage', passed ? 'Challenge Passed!' : ' Challenge Failed');

    } catch (err) {
        // console.error(err);
        console.log("error has occured");
        res.status(500).json({ message: 'Error processing submission' });
    }
};
