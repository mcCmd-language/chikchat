const { app, BrowserWindow } = require('electron');

function createWindow () {  // 브라우저 창을 생성
  let win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })

  //브라우저창이 읽어 올 파일 위치
  win.loadFile('../html/index.html');
}

app.on('ready', createWindow);