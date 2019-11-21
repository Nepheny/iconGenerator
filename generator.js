const chokidar = require('chokidar');
const Jimp = require('jimp');
const fs = require('fs');
const filePath = __dirname + '/outputs';
const imgName = '/icon_1024x1024.png';

const generateThumb = (source, dest, size, rounded=false) => {
    const p1 = Jimp.read(source);
    const p2 = Jimp.read(`${filePath}/mask.png`);

    Promise.all([p1, p2]).then((images) => {
        const image = images[0];
        const mask = images[1];

        rounded ? image.mask(mask, 0, 0).resize(size, size).write(filePath + dest)
            : image.resize(size, size).write(filePath + dest);
    });
}

const thumbnails = (source) => {
    // android -----
    generateThumb(source, '/android/mipmap-mdpi/ic_launcher.png', 48);
    generateThumb(source, '/android/mipmap-hdpi/ic_launcher.png', 72);
    generateThumb(source, '/android/mipmap-xhdpi/ic_launcher.png', 96);
    generateThumb(source, '/android/mipmap-xxhdpi/ic_launcher.png', 144);
    generateThumb(source, '/android/mipmap-xxxhdpi/ic_launcher.png', 192);
    // androids rounded
    generateThumb(source, '/android/mipmap-mdpi/ic_launcher_rounded.png', 48, true);
    generateThumb(source, '/android/mipmap-hdpi/ic_launcher_rounded.png', 72, true);
    generateThumb(source, '/android/mipmap-xhdpi/ic_launcher_rounded.png', 96, true);
    generateThumb(source, '/android/mipmap-xxhdpi/ic_launcher_rounded.png', 144, true);
    generateThumb(source, '/android/mipmap-xxxhdpi/ic_launcher_rounded.png', 192, true);
    
    // ios ---------
    // icons
    generateThumb(source, '/ios/ic_60x60@2.png', 120);    // iPhone
    generateThumb(source, '/ios/ic_60x60@3.png', 180);    // iPhone
    generateThumb(source, '/ios/ic_83.5x83.5@2.png', 167);// iPad Pro
    generateThumb(source, '/ios/ic_76x76@2.png', 152);    // iPad, iPad mini
    generateThumb(source, '/ios/ic_1024x1024.png', 1024); // apple store
    // spotlight Icon
    generateThumb(source, '/ios/ic_40x40@2.png', 80);     // iPhone
    generateThumb(source, '/ios/ic_40x40@3.png', 120);    // iPhone, iPad Pro, iPad, iPad mini
    // settings Icon
    generateThumb(source, '/ios/ic_29x29@3.png', 87);     // iPhone
    generateThumb(source, '/ios/ic_29x29@2.png', 58);     // iPhone, iPad Pro, iPad, iPad mini
    // notifications
    generateThumb(source, '/ios/ic_20x20@3.png', 60);     // iPhone
    generateThumb(source, '/ios/ic_20x20@2.png', 40);     // iPhone, iPad Pro, iPad, iPad mini
}

chokidar.watch(filePath + imgName).on('all', (e, path) => {
    thumbnails(path);
});

