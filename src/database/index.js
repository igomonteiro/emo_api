import mongoose from 'mongoose';

class Database {
  constructor() {
    this.initMongo();
  }

  initMongo() {
    try {
      mongoose.connect(
        process.env.DB_CONNECT_URL,
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