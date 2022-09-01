
const { s3Handler } = require('../lib/s3Handler')
const { createJpegThumb, createPngThumb } = require('./compressors')

//Core image processing package
const sharp = require('sharp')

const BUCKET = process.env.BUCKET;
const PREFIX = process.env.PREFIX_PATH_DEV

class ResizerHandler {
    constructor() { }

    async _process(event) {
        const { size, image } = event.pathParameters
        return await this.resize(size, image)
    }

    async resize(size, path) {
        try {
            // let sizeArray;
            // if (size) sizeArray = size.split('x')
            // const width = parseInt(sizeArray[0])
            // const height = parseInt(sizeArray[1])
            const Key = PREFIX + '/' + path

            const newKey = Key.replace('input/images', 'test')
            const Bucket = BUCKET
            // const streamResize = sharp()
            //     .resize(width, height)
            //     .toFormat('png')

            const readStream = await s3Handler.readStream({ Bucket, Key })
            const { data, info } = await this.select_compressor(readStream)
            await this.printSizeDetail('compressed _', info)

            const payload = await s3Handler.writeStream({ Bucket: Bucket, Key: newKey, Body: data })

            // console.log(payload)
            return payload.Location;
        } catch (error) {
            throw new Error(error)
        }
    }

    async printSizeDetail(type = 'default', blob) {
        console.log(type + 'image metadata  --->>>>>', blob);
        console.log(`${type} ` + 'image size ==>> ' + (blob.size / (1000 * 1000)).toFixed(3) + ' MB')
    }

    async select_compressor(blob, quality = 70) {
        const meta = await sharp(blob).metadata()
        this.printSizeDetail('original', meta)

        switch (meta.format) {
            case 'jpeg':
                return createJpegThumb(blob, quality)
            case 'png':
                return createPngThumb(blob, quality)
            default:
                throw new Error('Compressor not set for encoding : ' + meta.format)
        }
    }
}

const resizeHandler = new ResizerHandler()

module.exports = { resizeHandler }