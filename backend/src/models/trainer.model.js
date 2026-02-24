const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, 
        unique: true    
    },
    trainerName: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        default: "" 
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    pkmnSeen: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pokemon' 
        }
    ],
    pkmnCatch: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pokemon' 
        }
    ]
});

const trainerModel = mongoose.model('Trainer', trainerSchema);

module.exports = trainerModel;