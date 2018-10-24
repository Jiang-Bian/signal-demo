// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 900, height: 800 })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.toggleDevTools();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// 基于准备好的dom，初始化echarts实例
function makeGaussian(amplitude, x0, y0, sigmaX, sigmaY) {
  return function (amplitude, x0, y0, sigmaX, sigmaY, x, y) {
    var exponent = -(
      (Math.pow(x - x0, 2) / (2 * Math.pow(sigmaX, 2)))
      + (Math.pow(y - y0, 2) / (2 * Math.pow(sigmaY, 2)))
    );
    return amplitude * Math.pow(Math.E, exponent);
  }.bind(null, amplitude, x0, y0, sigmaX, sigmaY);
}
// 创建一个高斯分布函数
var gaussian = makeGaussian(50, 0, 0, 20, 20);

setInterval(() => {
  let data = [];
  for (var i = 0; i < 100; i++) {
    // x, y 随机分布
    let x = Math.random() * 100 - 50;
    let y = Math.random() * 100 - 50;
    let z = gaussian(x, y);
    data.push([x, y, z]);
  }
  mainWindow.webContents.send('data', data)
}, 1000)

