import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { execSync } from 'node:child_process'
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // nodeIntegration: true,
      nodeIntegrationInWorker: true,
      // contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL('http://localhost:3000/index.html');

    win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron' + (process.platform === "win32" ? ".cmd" : "")),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }
}

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

ipcMain.on('convert', async (event, arg: any) => { 
  // console.log('ipcMain: Got convert event', arg);
  // convert arg, which is a base64 string, to a File object
  // const file = new File([arg], 'input.mp3', { type: 'audio/mp3' });
  // const file = readFileSync(arg);
  // console.log(file)
  // console.log('temp dir',);
  const filePath = path.join( app.getPath('temp'), 'test.mp3');
  fs.writeFileSync(filePath, Buffer.from(arg, 'base64'));
  console.log("calling demucs")
  execSync(`demucs --two-stems=vocals ${filePath}`)
  event.sender.send('convert-reply', 'finished converting');
})
