// main.js

// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu
} = require('electron')
const path = require('path')
const log = require('electron-log')
const {autoUpdater} = require("electron-updater")

// Disable security warnings
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true

//------------------------------------------------------------------------------
// Application
//------------------------------------------------------------------------------
log.info('App starting...')

if (!app.requestSingleInstanceLock()) {
  log.info('App already running. Exiting...')
  app.quit()
  return
}

app.commandLine.appendSwitch('ignore-gpu-blacklist') // old
app.commandLine.appendSwitch('ignore-gpu-blocklist') // new

//------------------------------------------------------------------------------
// Define menu
//
//------------------------------------------------------------------------------
// let template = []
// if (process.platform === 'darwin') {
//   // OS X
//   const name = app.getName()
//   template.unshift({
//     label: name,
//     submenu: [
//       {
//         label: 'About ' + name,
//         role: 'about'
//       },
//       {
//         label: 'Quit',
//         accelerator: 'Command+Q',
//         click() { app.quit() }
//       },
//     ]
//   })
// }

//------------------------------------------------------------------------------
// Main window
//
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
//------------------------------------------------------------------------------
let theWindow

function createWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Masque World Class Casino',
    width: 1200,
    height: 675,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname,'preload.js')
    }
  })
  mainWindow.setContentSize(1200,675)
  //mainWindow.webContents.openDevTools()
  mainWindow.loadURL(`file://${__dirname}/index.html#${app.getVersion()}`)
  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Create menu bar
  const menu = null //Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Create window
  theWindow = createWindow()

  theWindow.on('closed', () => {
      theWindow = null
  }) 
/*
  app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (0 === BrowserWindow.getAllWindows().length) createWindow()
  })
*/
})

app.on('second-instance', (event, commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (theWindow) {
    if (theWindow.isMinimized()) {
        theWindow.restore()
    }
    theWindow.focus()
  }
})

app.on('window-all-closed', () => {
  /*if ('darwin' !== process.platform) */{
    app.quit()
  }
})

//------------------------------------------------------------------------------
// Inter-process communication
//
// This illustrates how to send a message to the renderer page. It's currently
// implemented to listen for a message from the page and then send the same
// information back to the page.
//------------------------------------------------------------------------------
ipcMain.on('toMain', (event, args) => {
  // Send back to renderer process
  showStatus(args)
})

function showStatus(text) {
  log.info(text)
  if (theWindow) {
    theWindow.webContents.send('fromMain', text)
  }
}

//------------------------------------------------------------------------------
// Auto updates
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//------------------------------------------------------------------------------

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify()
})

autoUpdater.on('checking-for-update', () => {
  showStatus('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  showStatus('Update available.')
})

autoUpdater.on('update-not-available', (info) => {
  showStatus('Update not available.')
  if (theWindow) {
    theWindow.loadURL('https://www.masque.com/worldclasscasino')
  }
})

autoUpdater.on('error', (err) => {
  showStatus('Error in auto-updater. ' + err)
  if (theWindow) {
    theWindow.loadURL('https://www.masque.com/worldclasscasino')
  }
})

autoUpdater.on('download-progress', (info) => {
  const message = "Download speed: " + Math.round(info.bytesPerSecond)
                + ', Downloaded ' + Math.round(info.percent) + '%'
                + ' (' + info.transferred + "/" + info.total + ')'
  showStatus(message)
})

autoUpdater.on('update-downloaded', (info) => {
  showStatus('Update downloaded')
  autoUpdater.quitAndInstall()
})
