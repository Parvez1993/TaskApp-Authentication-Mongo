const mongoose = require('mongoose')

// Create a schema with the timestamps option
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true  // This is the correct place for the timestamps option
})

// Then create the model using the schema
const Task = mongoose.model('Task', taskSchema)

module.exports = Task