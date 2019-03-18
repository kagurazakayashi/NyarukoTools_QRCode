const {app, BrowserWindow, Menu, shell, dialog, ipcMain} = require('electron');
app.disableHardwareAcceleration();
const path = require('path');
const url = require('url');

let win;
let menu;
let winShow;
let winColor;
var showcolor = [0,"#000000","#EFEFF0","#FFFFFF"];
var firstload = true;
const devmode = false;
var lvlmenu;
var config = [0,"L","Byte","UTF-8"];
var qrtext = "";
function createLvlnum() {
    lvlmenu = [{
        label: '自动',
        accelerator: 'CmdOrCtrl+P',
        type: 'checkbox',
        checked: (config[0] == 0),
        click: (item,focusedWindow) => {
            selectLvlnum(0);
        }
    },{
        type: 'separator'
    }]
    for (let i = 1; i <= 40; i++) {
        let lvlmenucell = {
            label: i + ' 个区块',
            type: 'checkbox',
            checked: (config[0] == i),
            click: (item,focusedWindow) => {
                selectLvlnum(i);
            }
        };
        lvlmenu.push(lvlmenucell);
    }
}
function selectLvlnum(i) {
    config[0] = i;
    reloadMenu();
}
function reloadMenu() {
    mkmenu();
    win.setMenu(menu);
    Menu.setApplicationMenu(menu);
    winShow.webContents.send('updateqrconf',config);
    // winShow.webContents.send('updateqrtext',qrtext);
}
function createQR() {
    
}
function close() {
    console.log("close");
}
function mkmenu() {
    createLvlnum();
    const version = app.getVersion();
    let menutmp = [{
        label: '文件',
        submenu: [,{
            type: 'separator'
        },{
            label: '从剪贴板创建',
            accelerator: 'CmdOrCtrl+Alt+V',
            click: () => {
                //filedialog(true);
            }
        },{
            label: '导出二维码',
            accelerator: 'CmdOrCtrl+S',
            click: () => {
                // filedialog(false);
            }
        },{
            label: '一键生成导出',
            accelerator: 'CmdOrCtrl+Shift+S',
            click: () => {
                // filedialog(false);
            }
        },{
            type: 'separator'
        },{
            label: '导入设置',
            accelerator: 'CmdOrCtrl+Alt+O',
            click: () => {
                filedialog(true);
            }
        },{
            label: '导出设置',
            accelerator: 'CmdOrCtrl+Alt+S',
            click: () => {
                filedialog(false);
            }
        },{
            type: 'separator'
        },{
            label: '退出',
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
                app.quit();
            }
        }]
    },{
        label: '编辑',
        submenu: [{
            label: '撤销',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
        },{
            label: '重做',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo'
        },{
            type: 'separator'
        },{
            label: '剪切',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
        },{
            label: '复制',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
        },{
            label: '粘贴',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
        },{
            label: '全选',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
        }]
    },{
        label: '颜色',
        submenu: [{
            type: 'separator'
        },{
            label: '前景色',
            accelerator: 'CmdOrCtrl+F',
            click: (item,focusedWindow) => {
                // config[1] = "L";
                // reloadMenu();
            }
        },{
            label: '背景色',
            accelerator: 'CmdOrCtrl+B',
            click: (item,focusedWindow) => {
                // config[1] = "L";
                // reloadMenu();
            }
        }]
    },{
        label: '容量',
        submenu: lvlmenu
    },{
        label: '容错',
        submenu: [{
            type: 'separator'
        },{
            label: '7%',
            accelerator: 'CmdOrCtrl+1',
            type: 'checkbox',
            checked: (config[1] == "L"),
            click: (item,focusedWindow) => {
                config[1] = "L";
                reloadMenu();
            }
        },{
            label: '15%',
            accelerator: 'CmdOrCtrl+2',
            type: 'checkbox',
            checked: (config[1] == "M"),
            click: (item,focusedWindow) => {
                config[1] = "M";
                reloadMenu();
            }
        },{
            label: '25%',
            accelerator: 'CmdOrCtrl+3',
            type: 'checkbox',
            checked: (config[1] == "Q"),
            click: (item,focusedWindow) => {
                config[1] = "Q";
                reloadMenu();
            }
        },{
            label: '30%',
            accelerator: 'CmdOrCtrl+4',
            type: 'checkbox',
            checked: (config[1] == "H"),
            click: (item,focusedWindow) => {
                config[1] = "H";
                reloadMenu();
            }
        }]
    },{
        label: '格式',
        submenu: [{
            label: '阿拉伯数字',
            accelerator: 'CmdOrCtrl+N',
            type: 'checkbox',
            checked: (config[2] == "Numeric"),
            click: (item,focusedWindow) => {
                config[2] = "Numeric";
                reloadMenu();
            }
        },{
            label: '英文字母（包括数字）',
            accelerator: 'CmdOrCtrl+G',
            type: 'checkbox',
            checked: (config[2] == "Alphanumeric"),
            click: (item,focusedWindow) => {
                config[2] = "Alphanumeric";
                reloadMenu();
            }
        },{
            label: '字节码（通用，推荐）',
            accelerator: 'CmdOrCtrl+B',
            type: 'checkbox',
            checked: (config[2] == "Byte"),
            click: (item,focusedWindow) => {
                config[2] = "Byte";
                reloadMenu();
            }
        },{
            label: '汉字',
            accelerator: 'CmdOrCtrl+K',
            type: 'checkbox',
            checked: (config[2] == "Kanji"),
            click: (item,focusedWindow) => {
                config[2] = "Kanji";
                reloadMenu();
            }
        }]
    },{
        label: '编码',
        submenu: [{
            label: '无（英文字母和数字）',
            accelerator: 'CmdOrCtrl+D',
            type: 'checkbox',
            checked: (config[3] == "default"),
            click: (item,focusedWindow) => {
                config[3] = "default";
                reloadMenu();
            }
        },{
            label: 'SJIS（日语）',
            accelerator: 'CmdOrCtrl+J',
            type: 'checkbox',
            checked: (config[3] == "SJIS"),
            click: (item,focusedWindow) => {
                config[3] = "SJIS";
                reloadMenu();
            }
        },{
            label: 'UTF-8（任意语系，推荐）',
            accelerator: 'CmdOrCtrl+U',
            type: 'checkbox',
            checked: (config[3] == "UTF-8"),
            click: (item,focusedWindow) => {
                config[3] = "UTF-8";
                reloadMenu();
            }
        }]
    },{
        label: '帮助',
        submenu: [{
            label: '调试工具',
            enabled: false
        },{
            label: '关闭子窗口',
            accelerator: 'CmdOrCtrl+Alt+Q',
            click: (item,focusedWindow) => {
                if (focusedWindow) {
                    if (focusedWindow.id === 1) {
                        BrowserWindow.getAllWindows().forEach(win => {
                            if (win.id > 1) win.close();
                        })
                    }
                }
            }
        },{
            label: '重新载入资源',
            accelerator: 'CmdOrCtrl+Alt+R',
            click: (item,focusedWindow) => {
                if (focusedWindow) {
                    focusedWindow.reload();
                }
            }
        },{
            label: '开发者工具',
            click: (item,focusedWindow) => {
                if (focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        },{
            type: 'separator'
        },{
            label: '版本 '+version,
            enabled: false
        },{
            label: '主页',
            accelerator: 'F1',
            click: () => {
                shell.openExternal('https://github.com/kagurazakayashi/NyarukoTools_Timer');
            }
        },{
            label: '关于',
            click: function (item,focusedWindow) {
                if (focusedWindow) {
                    const options = {
                        type: 'info',
                        title: '关于',
                        buttons: ['继续'],
                        message: '二维码生成工具，版本 '+version+'，神楽坂雅詩'
                    }
                    dialog.showMessageBox(focusedWindow,options,function(){});
                }
            }
        }]
    }]
    menu = Menu.buildFromTemplate(menutmp);
    Menu.setApplicationMenu(menu);
}
function createWindow () {
    mkmenu();
    win = new BrowserWindow({
        width: 640, 
        height: 480,
        title: '计时器',
        backgroundColor: '#FFF',
        backgroundThrottling: false,
        webPreferences:{
            nodeIntegration: true
        }
    })
    win.setMenu(menu);
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    if (devmode) win.webContents.openDevTools();
    win.webContents.on('did-finish-load', () => {
        if (firstload) {
            firstload = false;
            win.reload();
        } else {
            win.webContents.send('didFinishLoad',firstload);
        }
    });
    win.on('closed', () => {
        BrowserWindow.getAllWindows().forEach(win => {
            win.close();
        });
        win = null;
        app.quit();
    })
}
function createWindowShow() {
    // if (winShow) {
    //     winShow.webContents.send('winshowinit', showdata);
    //     return;
    // }
    winShow = new BrowserWindow({
        width: 300, 
        height: 300,
        backgroundColor: "#FFF",
        title: '二维码',
        backgroundThrottling: false,
        webPreferences:{
            nodeIntegration: true
        }
    });
    winShow.setMenu(null);
    winShow.loadURL(url.format({
        pathname: path.join(__dirname, 'show.html'),
        protocol: 'file:',
        slashes: true
    }));
    if (devmode) winShow.webContents.openDevTools();
    winShow.webContents.on('did-finish-load', () => {
        // winShow.webContents.send('changeShowColor', showcolor);
        // win.webContents.send('changeShowColor', showcolor);
    });
    winShow.on('closed', () => {
        ipcMain.removeAllListeners('closeWinShow');
        winShow = null;
        app.quit();
    });
    ipcMain.on('closeWinShow', (event, arg) => {
        winShow.close();
    });
}
function createWindowColor(nowcolor) {
    winColor = new BrowserWindow({
        width: 580, 
        height: 350,
        backgroundColor: '#efefef',
        title: '选择颜色',
        parent: win,
        modal: true,
        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        webPreferences:{
            resizable: false,
            nodeIntegration: true
        }
    });
    winColor.setMenu(null);
    winColor.loadURL(url.format({
        pathname: path.join(__dirname, 'color.html'),
        protocol: 'file:',
        slashes: true
    }));
    if (devmode) winColor.webContents.openDevTools();
    winColor.webContents.on('did-finish-load', () => {
        winColor.webContents.send('wincolorinit', nowcolor);
    });
    winColor.on('closed', () => {
        ipcMain.removeAllListeners('closeWinColor');
        winColor = null;
    });
    ipcMain.on('closeWinColor', (event, arg) => {
        if (arg[0] == 1) {
            showcolor[showcolor[0]] = arg[1];
            if (winShow) {
                winShow.webContents.send('changeShowColor', showcolor);
                win.webContents.send('changeShowColor', showcolor);
            }
        }
        winColor.close();
    });
}
function filedialog(isopen) {
    if (isopen) {
        dialog.showOpenDialog({
            properties: ['openFile']
        }, (files) => {
            if (files) {
                win.webContents.send('filedialogfb', [1,files]);
            }
        });
    } else {
        const options = {
            title: '导出配置',
            filters: [
                { name: '配置文件', extensions: ['json'] }
            ]
        }
        dialog.showSaveDialog(options, (filename) => {
            win.webContents.send('filedialogfb', [2,filename]);
        });
    }
}
//监听
ipcMain.on('msgboxWin', (event, arg) => {
    dialog.showMessageBox(win,arg[0],function(index){
        win.webContents.send('informationDialogSelection', [1,index,arg[1]]);
    });
});
ipcMain.on('openInfoMsgBox', (event, arg) => {
    dialog.showMessageBox(win,arg);
});
ipcMain.on('updateShowColor', (event, arg) => {
    showcolor = arg;
});
ipcMain.on('updateqrtextM', (event, arg) => {
    qrtext = arg;
    winShow.webContents.send('updateqrtext',arg);
});
app.on('ready', () => {
    createWindow();
    createWindowShow();
});
app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin') {
        app.quit();
    // }
});

app.on('activate', () => {
if (win === null) {
    createWindow();
}
});
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';