const { resizeHandler } = require('../resizer/resizeHandler')

const BUCKET = process.env.BUCKET;
const REGION = process.env.REGION;
const PREFIX = process.env.PREFIX_PATH_DEV

const handler = async (event, context) => {
    try {
        const imagePath = await resizeHandler._process(event)
        // const URL = `http://${process.env.BUCKET}.s3-website.${process.env.REGION}.amazonaws.com`
        const URL = `https://${BUCKET}.s3.amazonaws.com/${PREFIX}`

        const final = `${URL}/${imagePath}`

        return {
            statusCode: 301,
            body: { final_location: final }
        }
    } catch (error) {
        console.log(error)
        return new Error(error)
    }
}

module.exports = { handler, BUCKET, REGION, PREFIX }