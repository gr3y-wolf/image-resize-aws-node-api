const sharp = require('sharp');

async function createJpegThumb(blob, quality) {
    console.log('jpeg compressor called');
    const img = await sharp(blob)
        // .resize({ width: 512, height: 512 })
        .jpeg({ progressive: true, quality: quality, mozjpeg: true })
        .toBuffer({ resolveWithObject: true })
    return img
}

async function createWebpThumb(blob, quality) {
    console.log('webp compressor called');
    const img = await sharp(blob, { animated: true })
        // .resize({ width: 512, height: 512 })
        .webp({ lossless: true })
        .toBuffer()
    return img
}

async function createPngThumb(blob, quality) {
    console.log('PNG compressor called');
    const thumb = await sharp(blob)
        .png({ progressive: true, quality: quality, compressionLevel: 9, effort: 10 }).toBuffer({ resolveWithObject: true })
    return thumb;
}

module.exports = {
    createJpegThumb,
    createWebpThumb,
    createPngThumb
}