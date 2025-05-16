import subprocess
import tempfile
import os

def run_python_code(code, user_input, timeout=3):
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as tmp:
            tmp.write(code)
            tmp_path = tmp.name

        result = subprocess.run(
            ['python3', tmp_path],
            input=user_input.encode(),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=timeout
        )

        os.unlink(tmp_path)  # delete temp file

        return {
            'output': result.stdout.decode().strip(),
            'error': result.stderr.decode().strip(),
            'timeout': False
        }

    except subprocess.TimeoutExpired:
        return { 'output': '', 'error': 'Execution timed out', 'timeout': True }
    except Exception as e:
        return { 'output': '', 'error': str(e), 'timeout': False }
