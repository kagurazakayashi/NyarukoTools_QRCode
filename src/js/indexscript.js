const {ipcRenderer,remote,clipboard} = require('electron');

// document.write(create_qrcode("text", 0, "L", "Byte", "UTF-8"));

const fs = require('fs');
//[[timei,mode,fromTimestamp,toTimestamp,title,display]]
var configdata = new Array();
var showcolor = [0,"#000000","#EFEFF0","#FFFFFF"];
var showalert = true;
let configFile = remote.app.getPath('userData') + "/setting.json";
//C:\Users\yashi\AppData\Roaming\nyarukotimer\setting.json
let qrstr = document.getElementById('qrstr');
qrstr.addEventListener('input',function () {
    ipcRenderer.send('updateqrtextM',qrstr.value);
});
function settingLoad(file=configFile,saveto=null) {
    fs.readFile(file, 'utf8', function (err, filedata) {
        if (err) {
            if (err.code != "ENOENT") {
                const options = {
                    type: "error",
                    title: "读取应用程序设置没有成功",
                    message: err.message,
                    buttons: ['关闭']
                }
                console.log(err.code + "|" + err.message);
                ipcRenderer.send('openInfoMsgBox',options);
            }
        } else if (saveto == null) {
            let settingarr = JSON.parse(filedata);
            if (settingarr[0] != "nyarukotools_timer_1") {
                const options = {
                    type: "error",
                    title: "配置文件版本不匹配",
                    message: "这个配置文件是由其他软件或本软件的不兼容版本创建的，无法导入。",
                    buttons: ['取消导入']
                }
                ipcRenderer.send('openInfoMsgBox',options);
                return false;
            }
            showcolor = settingarr[1];
            configdata = settingarr[2];
            ipcRenderer.send('updateShowColor',showcolor);
            // createallcell();
            return true;
        } else {
            settingSave(saveto,filedata);
        }
    });
    return false;
}
function settingLoadFrom(file) {
    settingLoad(file,configFile);
    settingLoad(file);
}
function settingSave(file=configFile,loaddata=null) {
    let filedata = loaddata ? loaddata : JSON.stringify(["nyarukotools_timer_1",showcolor,configdata]);
    fs.writeFile(file, filedata, function (err) {
        if (err) {
            const options = {
                type: "error",
                title: "写入应用程序设置没有成功",
                message: err.message,
                buttons: ['关闭']
            }
            console.log(err.code + "|" + err.message);
            ipcRenderer.send('openInfoMsgBox',options);
        } else {
            return true;
        }
    });
    return false;
}
function settingSaveTo(file) {
    settingLoad(configFile,file);
}
ipcRenderer.on('didFinishLoad', (event, arg) => {
    settingLoad();
    $("body").css("display","block");
    let clipboardtext = clipboard.readText();
    if (clipboardtext && clipboardtext != "") {
        qrstr.value = clipboardtext;
        ipcRenderer.send('updateqrtextM',qrstr.value);
    } else {
        ipcRenderer.send('updateqrtextM','');
    }
});
ipcRenderer.on('indexmenu', (event, arg) => {
    switch (arg) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            break;
        default:
            break;
    }
});
ipcRenderer.on('informationDialogSelection', (event, arg) => {
    if (arg[0] == 1 && arg[1] == 1) {
        cbtnDelete(arg[2]);
    }
});
ipcRenderer.on('changeShowColor', (event, arg) => {
    showcolor = arg;
});
ipcRenderer.on('filedialogfb', (event, arg) => {
    if (arg[0] == 1) {
        settingLoadFrom(arg[1][0]);
    } else if (arg[0] == 2) {
        settingSaveTo(arg[1]);
    }
});
function overalert(taski,title,message) {
    if (showalert) {
        const options = {
            type: "warning",
            title: title,
            buttons: ['返回','删除此计时器'],
            message: message
        }
        ipcRenderer.send('msgboxWin',[options,taski]);
    }
}
function cbtnShow(timerid) {
    showing = timerid;
    ipcRenderer.send('openWinShow',configdata[timerid]);
}