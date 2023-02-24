import mongoose from "mongoose";

class MongoConnect {
  constructor() {
    const DB_NAME = process.env.DB_NAME;
    const DB_HOST = process.env.DB_HOST;
    const DB_PORT = process.env.DB_PORT;

    this.MONGODB_URI = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.vsdkxrp.mongodb.net/?retryWrites=true&w=majority`;
  }
  connect() {
    mongoose.connect(this.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("[MONGODB] : connected--------------------");
      })
      .catch((error) => {
        console.error(`[MONGODB] :  ${error}`);
      });
  }
}

export default MongoConnect;
