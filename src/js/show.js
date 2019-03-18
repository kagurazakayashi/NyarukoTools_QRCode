const {ipcRenderer} = require('electron');
var config = [0,"L","Byte","UTF-8"];
var srctext = "";
let qrview = document.getElementById("qrview");
var hwratio = 0;
$(document).ready(function() {
    $("body").css("display","block");
});
$(window).resize(function() {
    let doc = $(document);
    let windowW = doc.width();
    let windowH = doc.height();
    let ncss = {"width":"5%","height":"auto"};
    var edit = false;
    if (windowW > windowH && hwratio != 1) {
        ncss = {"width":"auto","height":"5%"};
        hwratio == 1;
        edit = true;
    } else if (windowW < windowH && hwratio != 2) {
        hwratio == 2;
        edit = true;
    }
    if (edit) $("img svg table").css(ncss);
});
ipcRenderer.on('changeShowColor', (event, arg) => {
    let pagebody = $("body");
    pagebody.css("color",arg[1]);
    pagebody.css("background-color",arg[2]);
    pagebody.css("-webkit-text-stroke","1px "+arg[3]);
});
function createqrcode() {
    if (srctext.length > 1024) {
        qrview.innerHTML = '<div id="noqr">请在输入窗口输入内容。<br/><b>最多输入1024个字符。</b></div>';
    } else if (srctext.length == 0) {
        qrview.innerHTML = '<div id="noqr">请在输入窗口输入内容。</div>';
    } else {
        qrview.innerHTML = '<div id="noqr">生成失败。<br/><b>尝试改变容量和编码。</b></div>';
        let qrcodedata = create_qrcode(srctext,config[0],config[1],config[2],config[3],config[4]);
        qrview.innerHTML = qrcodedata;
    }
}
ipcRenderer.on('updateqrconf', (event, arg) => {
    config = arg;
    createqrcode();
});
ipcRenderer.on('updateqrtext', (event, arg) => {
    srctext = arg;
    createqrcode();
});