require('dotenv').config()
const Nexmo = require('nexmo')

const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  applicationId: process.env.APPLICATION_ID,
  privateKey: process.env.PRIVATE_KEY
})

nexmo.dispatch.create("failover", [
    {
      "from": { "type": "sms", "number": process.env.FROM_NUMBER },
      "to": { "type": "sms", "number": process.env.TO_NUMBER },
      "message": {
        "content": {
          "type": "text",
          "text": "Hi, your package will be delivered tomorrow"
        }
      },
      "failover":{
        "expiry_time": 180,
        "condition_status": "delivered"
      }
    },
    {
      "from": {"type": "mms", "number": process.env.FROM_NUMBER},
      "to": { "type": "mms", "number": process.env.TO_NUMBER},
      "message": {
        "content": {
          "type": "image",
          "image": { "url": "https://vonage-cert.s3.eu-central-1.amazonaws.com/package.jpg" }
        }
      }
    },
    (err, data) => { console.log(data.dispatch_uuid); }
  ])