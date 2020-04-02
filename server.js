const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json())
const onInboundCall = (req, res) => {
    const ncco = [
        {
            action: 'talk',
            text:'Hi. Please select one option. 1 for listening to an audio file.'
                + ' 2 to hear the current time and date or 3 to transfer to different number',
            bargeIn: true
        },
        {
          action: 'input',
          eventUrl: [`${req.protocol}://${req.get('host')}/webhooks/dtmf`],
          maxDigits: 1
        }
      ]
      res.json(ncco);
};

const onGetDtmf = (req, res) => {
    const dtmf = req.body.dtmf;
    switch (dtmf){
        case '1':
            ncco = [
                {
                    action: 'stream',
                    streamUrl: ["https://vonage-cert.s3.eu-central-1.amazonaws.com/bluePill.mp3"]
                }
            ];
            res.json(ncco);
            break;
        case '2':
            ncco = [
                {
                    action: 'talk',
                    text: 'The current date and time is ' + new Date(Date.now()).toLocaleString()
                }
            ];
            res.json(ncco);
            break;
        case '3':
            ncco = [
                {
                    action: 'talk',
                    text: 'we are now connecting you to an agent who will be able to help you'
                },
                {
                    action: 'connect',
                    timeout: 10,
                    from: '447700900000',
                    endpoint: [
                        {
                          type: "phone",
                          number: "12014250556"
                        }
                    ]
                }
            ];
            res.json(ncco);
            break;
        default:
            ncco = [
                {
                    action: 'talk',
                    text: 'I\'m sorry I didn\'t understand what you entered please try again'
                },
                {
                  action: 'input',
                  eventUrl: [`${req.protocol}://${req.get('host')}/webhooks/dtmf`],
                  maxDigits: 1
                }
            ];
            res.json(ncco);
            break;
    }
};

app.get('/webhooks/answer', onInboundCall);
app.post('/webhooks/dtmf', onGetDtmf);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'));