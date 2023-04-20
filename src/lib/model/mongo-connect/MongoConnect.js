import mongoose from 'mongoose';

class MongoConnect {
  constructor() {
    const DB_NAME = process.env.DB_NAME;
    const DB_HOST = process.env.DB_HOST;
    const DB_PORT = process.env.DB_PORT;

    this.MONGODB_URI = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.vsdkxrp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
    this.MONGODB_URI_LOCAL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/cmi_scheduler_system`;
  }
  connect() {
    mongoose
      .connect(this.MONGODB_URI_LOCAL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('[MONGODB] : connected--------------------');
      })
      .catch((error) => {
        console.error(`[MONGODB] :  ${error}`);
      })
      .catch((error) => {
        console.log(`Mongoose are failed to connect ${error}`);
      });
  }
}

export default MongoConnect;
