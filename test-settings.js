const fs = require('fs');
const mongoose = require('mongoose');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').find(l => l.startsWith('MONGODB_URI=')).split('=')[1].replace(/"/g, '');

mongoose.connect(env).then(async () => {
  const settings = await mongoose.connection.db.collection('settings').findOne({});
  console.log(settings);
  process.exit(0);
});
