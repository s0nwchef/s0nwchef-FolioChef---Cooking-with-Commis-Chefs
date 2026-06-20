const pty = require('node-pty');
const os = require('os');

const DEFAULT_SHELL = os.platform() === 'win32' ? 'cmd.exe' : 'bash';
const DEFAULT_COLS = 80;
const DEFAULT_ROWS = 24;

function spawnPty(command, cols = DEFAULT_COLS, rows = DEFAULT_ROWS, cwd) {
  const isWin = os.platform() === 'win32';
  const shell = DEFAULT_SHELL;
  const args = [];

  if (command) {
    if (isWin) {
      args.push('/c', command);
    } else {
      args.push('-c', command);
    }
  }

  const workDir = cwd || process.env.USERPROFILE || process.env.HOME || process.cwd();

  const ptyProcess = pty.spawn(shell, args, {
    name: 'xterm-color',
    cols,
    rows,
    cwd: workDir,
    env: process.env,
  });

  return ptyProcess;
}

function resizePty(ptyProcess, cols, rows) {
  if (ptyProcess && typeof ptyProcess.resize === 'function') {
    try {
      ptyProcess.resize(cols, rows);
    } catch (e) {
      console.error('Error resizing PTY:', e);
    }
  }
}

function killPty(ptyProcess) {
  if (ptyProcess && typeof ptyProcess.kill === 'function') {
    try {
      ptyProcess.kill();
    } catch (e) {
      console.error('Error killing PTY:', e);
    }
  }
}

module.exports = { spawnPty, resizePty, killPty };
