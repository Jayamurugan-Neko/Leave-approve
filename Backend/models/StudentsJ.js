
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    studentId: { type: String, required: true },
    name: { type: String, required: true }, 
    password: { type: String, required: true },
    
});

module.exports = mongoose.model('Student', StudentSchema);
