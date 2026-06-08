const https = require('https');

const url = 'https://res.cloudinary.com/dmjmttayt/image/upload/v1780644668/ali_studio/about/image.png';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  process.exit(0);
}).on('error', (e) => {
  console.error(e);
  process.exit(1);
});
