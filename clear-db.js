const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://najmalistudio_db_user:uPFUuUr7jAjKHxO5@cluster0.gt4ayun.mongodb.net/')
  .then(() => mongoose.connection.dropDatabase())
  .then(() => { console.log('DB Dropped'); process.exit(0); })
  .catch(console.error);
