const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const { v4: uuid } = require('uuid');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const PORT = 5005;

const folderMap = {
  python: 'python',
  cpp: 'cpp',
  java: 'java',
  js: 'js'
};

const extensionMap = {
  python: 'py',
  cpp: 'cpp',
  java: 'java',
  js: 'js'
};

app.post('/evaluate', async (req, res) => {
  const { language, code, input = '', expectedOutput = '' } = req.body;

  console.log('Received request:', { language, code, input, expectedOutput });
  console.log("request has come");
  if (!folderMap[language]) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const tempId = uuid();
  const tempDir = path.join(__dirname, 'temp', tempId);
  fs.mkdirSync(tempDir, { recursive: true });

  const ext = extensionMap[language];

  const codeFileName = `code.${ext}`;
  const runFileName = `run.${ext}`;

  console.log(`Creating temp folder: ${tempDir}`);
  console.log(`Writing user code to: ${path.join(tempDir, codeFileName)}`);
  fs.writeFileSync(path.join(tempDir, codeFileName), code);
  fs.writeFileSync(path.join(tempDir, 'input.txt'), input);


  if (language === 'js') {
    const jsBaseImage = 'eval-js-base';
    const jsDockerPath = path.join(__dirname, 'js');

    // Build JS base image only once
    try {
      execSync(`docker image inspect ${jsBaseImage}`);
    } catch {
      console.log(`Building JS base image: ${jsBaseImage}`);
      execSync(`docker build -t ${jsBaseImage} ${jsDockerPath}`);
    }

    fs.copyFileSync(path.join(jsDockerPath, 'run.js'), path.join(tempDir, 'run.js'));

    const dockerRunCmd = `docker run --rm -v ${tempDir}:/app ${jsBaseImage}`;
    console.log(`Running JS container: ${dockerRunCmd}`);

    exec(dockerRunCmd, (err, stdout, stderr) => {
      fs.rmSync(tempDir, { recursive: true, force: true });

      if (err) {
        console.error('JS Docker run failed:', stderr);
        return res.status(500).json({ error: stderr });
      }

      const actualOutput = stdout.trim();
      const passed = actualOutput === expectedOutput.trim();

      console.log('Actual Output:', actualOutput);
      console.log('Expected Output:', expectedOutput);

      res.json({ passed, actualOutput, error: stderr });
    });

    return;
  }
  const langFolder = folderMap[language];
  console.log(`Copying Dockerfile from: ${path.join(__dirname, langFolder, 'Dockerfile')}`);
  console.log(`Copying run file from: ${path.join(__dirname, langFolder, runFileName)}`);
  fs.copyFileSync(path.join(__dirname, langFolder, 'Dockerfile'), path.join(tempDir, 'Dockerfile'));
  fs.copyFileSync(path.join(__dirname, langFolder, runFileName), path.join(tempDir, runFileName));

  const imageTag = `eval-${tempId}`;
  console.log(`Building Docker image with tag: ${imageTag}`);

  // Build Docker image
  exec(`docker build -t ${imageTag} ${tempDir}`, (buildErr, buildOut, buildStderr) => {
    if (buildErr) {
      console.error('Docker build failed:', buildStderr);
      fs.rmSync(tempDir, { recursive: true, force: true });
      return res.status(500).json({ error: 'Docker build failed' });
    }

    console.log('Docker build output:', buildOut);

    // Run Docker container
    console.log(`Running Docker container with image: ${imageTag}`);
    exec(`docker run --rm ${imageTag}`, (runErr, output, runStderr) => {
      // Cleanup after run
      fs.rmSync(tempDir, { recursive: true, force: true });

      if (runErr) {
        console.error('Docker run failed:', runStderr);
        return res.status(500).json({ error: runStderr });
      }

      const actualOutput = output.trim();
      const passed = actualOutput === expectedOutput.trim();

      console.log('Actual Output:', actualOutput);
      console.log('Expected Output:', expectedOutput);

      res.json({
        passed,
        actualOutput,
        error: runStderr
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`🛠️  Evaluator service listening on http://localhost:${PORT}`);
});
