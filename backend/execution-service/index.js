const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const generateId = () => Math.random().toString(36).substring(2, 15);

// Language configurations
const LANGUAGES = {
    CPP: {
        extension: 'cpp',
        compile: (dir) => `g++ -O2 -std=c++17 -o ${path.join(dir, 'main')} ${path.join(dir, 'main.cpp')}`,
        run: (dir) => `${path.join(dir, 'main')}`,
        compiled: true,
    },
    JAVA: {
        extension: 'java',
        filename: 'Main.java',
        compile: (dir) => `javac ${path.join(dir, 'Main.java')}`,
        run: (dir) => `java -cp ${dir} Main`,
        compiled: true,
    },
    PYTHON: {
        extension: 'py',
        run: (dir) => `python3 ${path.join(dir, 'main.py')}`,
        compiled: false,
    },
    JAVASCRIPT: {
        extension: 'js',
        run: (dir) => `node ${path.join(dir, 'main.js')}`,
        compiled: false,
    },
    GO: {
        extension: 'go',
        compile: (dir) => `go build -o ${path.join(dir, 'main')} ${path.join(dir, 'main.go')}`,
        run: (dir) => `${path.join(dir, 'main')}`,
        compiled: true,
    },
    RUST: {
        extension: 'rs',
        compile: (dir) => `rustc -o ${path.join(dir, 'main')} ${path.join(dir, 'main.rs')}`,
        run: (dir) => `${path.join(dir, 'main')}`,
        compiled: true,
    },
};

app.post('/execute', (req, res) => {
    const { code, input, language } = req.body;
    const lang = language || 'CPP';

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    const langConfig = LANGUAGES[lang.toUpperCase()];
    if (!langConfig) {
        return res.status(400).json({
            stdout: '',
            stderr: `Unsupported language: ${lang}. Supported: ${Object.keys(LANGUAGES).join(', ')}`,
            exitCode: 1,
            timeMs: 0,
            memoryKb: 0,
        });
    }

    const id = generateId();
    const dirPath = path.join(__dirname, 'temp', id);

    // Create isolated directory for this execution
    fs.mkdirSync(dirPath, { recursive: true });

    const filename = langConfig.filename || `main.${langConfig.extension}`;
    const sourceFilePath = path.join(dirPath, filename);
    const inputFilePath = path.join(dirPath, 'input.txt');

    fs.writeFileSync(sourceFilePath, code);
    fs.writeFileSync(inputFilePath, input || '');

    const startTime = Date.now();
    const timeout = 10000; // 10 seconds

    const cleanup = () => {
        try { fs.rmSync(dirPath, { recursive: true, force: true }); } catch (e) {}
    };

    const executeCode = () => {
        const runCmd = `${langConfig.run(dirPath)} < ${inputFilePath}`;
        exec(runCmd, { timeout, maxBuffer: 1024 * 1024 * 10 }, (runError, runStdout, runStderr) => {
            const timeMs = Date.now() - startTime;
            cleanup();

            if (runError) {
                let stderr = runStderr || '';
                let exitCode = runError.code || 1;

                if (runError.killed) {
                    stderr = 'Error: Execution timed out (exceeded time limit).';
                } else if (!stderr) {
                    stderr = runError.message;
                }

                return res.json({
                    stdout: runStdout || '',
                    stderr,
                    exitCode,
                    timeMs,
                    memoryKb: 0,
                });
            }

            return res.json({
                stdout: runStdout || '',
                stderr: runStderr || '',
                exitCode: 0,
                timeMs,
                memoryKb: 0,
            });
        });
    };

    // If compiled language, compile first
    if (langConfig.compiled) {
        exec(langConfig.compile(dirPath), { timeout }, (compileError, compileStdout, compileStderr) => {
            if (compileError) {
                cleanup();
                return res.json({
                    stdout: '',
                    stderr: compileStderr || compileError.message,
                    exitCode: 1,
                    timeMs: Date.now() - startTime,
                    memoryKb: 0,
                });
            }
            executeCode();
        });
    } else {
        executeCode();
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', languages: Object.keys(LANGUAGES) });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Execution service running on port ${PORT}`);
    console.log(`Supported languages: ${Object.keys(LANGUAGES).join(', ')}`);
});
