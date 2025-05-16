from flask import Flask, request, jsonify
from run_code import run_python_code

app = Flask(__name__)

@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.get_json()
    code = data.get('code')
    input_data = data.get('input', '')
    expected_output = data.get('expectedOutput', '').strip()

    result = run_python_code(code, input_data)

    actual_output = result['output'].strip()
    error = result['error']

    passed = actual_output == expected_output and not result['timeout'] and not error

    return jsonify({
        'passed': passed,
        'actualOutput': actual_output,
        'error': error
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
