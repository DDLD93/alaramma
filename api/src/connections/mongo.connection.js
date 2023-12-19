/*
written by Khalil Mohammed Shams for Lexington Technologies (c) 2021
*/
'use strict';

const mongoose = require('mongoose');
const { MONGO_URI } = require('../configs')
mongoose.set('strictQuery', true);

module.exports = async () => {
    const db = mongoose.connection;
    db
        .on('connected', () => {
            console.log('Connected to MongoDB');
        })
        .on('disconnected', () => {
            console.log('Disconected from mongoDB');
            setTimeout(async () => {
                await mongoose.connect(MONGO_URI);
            }, 5000);
        })
        .on('error', (err) => {
            console.log('MongoDB error >> ', err);
        });
    await mongoose.connect(MONGO_URI);
}