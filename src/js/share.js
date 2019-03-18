let qrcode = require('qrcode-generator');
function create_qrcode(text="", typeNumber=0, errorCorrectionLevel="L", mode="Byte", mb="UTF-8", imageFormat=0, cellSize=4, margin=0, xscalable=true) {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs[mb];
    var qr = qrcode(typeNumber || 4, errorCorrectionLevel || 'M');
    qr.addData(text, mode);
    qr.make();
    switch (imageFormat) {
        case 1:
            return qr.createImgTag();
        case 2:
            return qr.createTableTag();
        default:
            return qr.createSvgTag({cellSize: cellSize, margin: margin, xscalable: xscalable});
    }
}