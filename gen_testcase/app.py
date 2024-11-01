from flask import Flask, request, send_file, render_template, jsonify
import os
import random
import string
import json
import subprocess
import time
import psutil
import glob

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Previous generator functions remain the same...

@app.route('/list-test-cases')
def list_test_cases():
    """List all available .in files in the uploads directory."""
    test_cases = glob.glob(os.path.join(UPLOAD_FOLDER, '*.in'))
    return jsonify([os.path.basename(f) for f in test_cases])

@app.route('/compile-and-run', methods=['POST'])
def compile_and_run():
    try:
        # Get files from request
        if 'cpp_file' not in request.files or 'test_case_file' not in request.form:
            return jsonify({'success': False, 'error': 'Missing required files'})

        cpp_file = request.files['cpp_file']
        test_case_file = request.form['test_case_file']
        optimize = request.form.get('optimize', 'false').lower() == 'true'

        # Save C++ file
        cpp_filename = os.path.join(UPLOAD_FOLDER, 'solution.cpp')
        cpp_file.save(cpp_filename)

        # Prepare compilation command
        executable = os.path.join(UPLOAD_FOLDER, 'solution')
        compile_cmd = ['g++', cpp_filename, '-o', executable]
        if optimize:
            compile_cmd.insert(1, '-O2')

        # Compile
        try:
            subprocess.run(compile_cmd, check=True, capture_output=True, text=True)
        except subprocess.CalledProcessError as e:
            return jsonify({
                'success': False,
                'error': f'Compilation error:\n{e.stderr}'
            })

        # Prepare input and output files
        input_file = os.path.join(UPLOAD_FOLDER, test_case_file)
        output_file = os.path.join(UPLOAD_FOLDER, test_case_file.replace('.in', '.sol'))

        # Run the program and measure time and memory
        start_time = time.time()
        with open(input_file, 'r') as fin, open(output_file, 'w') as fout:
            process = subprocess.Popen(
                [executable],
                stdin=fin,
                stdout=fout,
                stderr=subprocess.PIPE
            )
            
            # Monitor memory usage
            max_memory = 0
            while process.poll() is None:
                try:
                    proc = psutil.Process(process.pid)
                    memory_info = proc.memory_info()
                    max_memory = max(max_memory, memory_info.rss / 1024 / 1024)  # Convert to MB
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    break
                time.sleep(0.1)

        end_time = time.time()
        execution_time = end_time - start_time

        # Check if execution was successful
        if process.returncode != 0:
            stderr_output = process.stderr.read().decode() if process.stderr else "No error message available"
            return jsonify({
                'success': False,
                'error': f'Runtime error:\n{stderr_output}'
            })

        return jsonify({
            'success': True,
            'execution_time': f'{execution_time:.3f}',
            'memory_usage': f'{max_memory:.2f}',
            'sol_file': os.path.basename(output_file)
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

# Previous routes remain the same...

if __name__ == '__main__':
    app.run(debug=True)

    