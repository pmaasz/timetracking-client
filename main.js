const { app, BrowserWindow } = require('electron');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 700,
        height: 350
    })

    win.loadFile('index.html')
}

//open the window
app.whenReady().then(() => {
    createWindow()

    //Open a window if none are open (macOS)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

//On Windows and Linux, exiting all windows generally quits an application entirely
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});