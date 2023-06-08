import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { exec, execSync } from 'node:child_process'
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

ipcMain.on('convert', async (event, base64File: string, fileName: string) => { 
  // console.log('ipcMain: Got convert event', arg);
  // convert arg, which is a base64 string, to a File object
  // const file = new File([arg], 'input.mp3', { type: 'audio/mp3' });
  // const file = readFileSync(arg);
  // console.log(file)
  // console.log('temp dir',);
  console.log("filename", fileName)
  const filePath = path.join(app.getPath('temp'), fileName);
  fs.writeFileSync(filePath, Buffer.from(base64File, 'base64'));
  const outDir = path.join(app.getPath('temp'), "demucs");
  console.log('tmp path', app.getPath("temp"))
  fs.mkdir(path.join(app.getPath('temp'), "demucs"), (err) => { 
    if (err) {
      // return console.error(err);
      // if error is EEXIST do not throw error
      if (err.code !== 'EEXIST') throw err;

    }
    console.log('Directory created successfully!');
  });

  console.log("calling demucs")
  const demucsRes = exec(`demucs --two-stems=vocals ${filePath} --out ${outDir}`);

  event.sender.send('convert-reply', "fsuif");
})

ipcMain.on("read-temp-dir", (event) => {
  console.log("temp path", app.getPath('temp'))
  const outDir = path.join(app.getPath('temp'), "demucs");
  console.log("reading temp dir", fs.readdirSync(outDir));
  event.sender.send('read-temp-dir-reply', fs.readdirSync(outDir))
});
