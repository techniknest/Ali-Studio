const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const items = await db.collection('portfolios').find({}).toArray();
  console.log(JSON.stringify(items, null, 2));
  process.exit(0);
});
