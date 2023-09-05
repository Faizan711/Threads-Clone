import mongoose from 'mongoose';

let isConnected = false;

export const connectToDb = async () => {
    mongoose.set('strictQuery', true); //to prevent unknown queries to enter

    if(!process.env.MONGODB_URL) return console.log('MONGODB URL NOT FOUND!');
    if(isConnected) return console.log('Already Connected to MONGODB');

        try {
            await mongoose.connect(process.env.MONGODB_URL);

            isConnected = true;

        } catch (error) {
            
        }
}