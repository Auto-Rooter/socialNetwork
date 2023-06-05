import mongoose from "mongoose";

export default () => {
    const connect = () => {
        mongoose.connect('')
            .then(() => {
                console.log(`[+] Successfully connected to database...`);
            })
            .catch((error) => {
                console.error(`[x] Error connecting to database`, error);
                return process.exit(1);
            });
    };
    connect();
    mongoose.connection.on('[*] MongoDb disconnected, trying to reconnect...', connect);
}