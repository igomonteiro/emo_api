import mongoose from 'mongoose';
const uri = 'mongodb+srv://igobrm:e1EbgzZfRMjcABLm@emonitoring.pg57j.mongodb.net/emonitoring?retryWrites=true&w=majority';
class Database {
  constructor() {
    this.initMongo();
  }

  initMongo() {
    try {
      mongoose.connect(
        uri,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        },
        () => console.log("Mongoose is connected")
      );
    } catch(e) {
      console.log("Mongoose could not connect");
    }
  }
}

export default new Database();