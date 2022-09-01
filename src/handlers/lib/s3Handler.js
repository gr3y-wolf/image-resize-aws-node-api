const AWS = require('aws-sdk')

AWS.config.region = 'us-east-1'
const S3 = new AWS.S3()

class S3Handler {
    constructor() { }

    async readStream({ Bucket, Key }) {
        try {
            const get_obj = await S3.getObject({ Bucket, Key }).promise()
            console.log(get_obj)
            return get_obj.Body
        } catch (error) {
            console.log('cant fetch file from S3..')
            console.log(error)
            throw new Error(error)
        }
    }

    async writeStream({ Bucket, Key, Body }) {
        try {
            const params = { Bucket, Key, Body, Tagging: `compressed=true` }
            return S3.upload(params).promise()
        } catch (error) {
            console.log('file write to s3 error')
            console.log(error)
            throw new Error(error)
        }
    }
}

const s3Handler = new S3Handler()

module.exports = { s3Handler }