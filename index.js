//Available in nodejs
var NodeWebcam = require('node-webcam');
const say = require('say')

process.env.GOOGLE_APPLICATION_CREDENTIALS = '/home/pi/camCapture/client.json'

const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient()

const camCaptureOptions = {
  //Picture related
  width: 1920,
  height: 1080,
  quality: 100,
  delay: 0,
  output: 'jpeg',
  device: false,
  callbackReturn: "buffer",
  verbose: false
};

const speak = txt => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      say.speak(`${txt}.`, 'Good news', 1, (err) => resolve())
      init = false
    }, 200)
  })
}

const runProcess = async () => {
  speak('Taking picture.')
  try {
    NodeWebcam.capture("test_picture", camCaptureOptions, async (err, data) => {
      await speak('Picture taken.')
      if (err) return console.error(err)
      // let [text] = await client.textDetection(data)
      const [result] = await client.labelDetection(data)
      const labels = result.labelAnnotations;
      for (let i = 0; i < labels.length; i++) {
        await speak(labels[i].description)
      }
    });
  }
  catch (ex) {
    speak('Error')
  }
}

;
(async() => {
  runProcess()
  setInterval(() => {
    runProcess()
  }, 20000)
})()