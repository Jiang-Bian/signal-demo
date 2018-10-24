// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {BrowserWindow} = require('electron').remote
  let win = new BrowserWindow({width: 800, height: 600})
  win.loadURL('https://github.com')
