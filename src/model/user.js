const mongoose = require("mongoose");

const user = mongoose.model(
    "user",
    new mongoose.Schema({
        name: {
            type: String,
            requerid: true
        },
        edv: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        sector: {
            type: String,
            required: true
        },
        admIsTrue: {
            type: Boolean,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    })
);

module.exports = user;