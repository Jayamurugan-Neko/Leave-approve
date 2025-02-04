const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    studentId: {type: String, required: true},
    leaveType: {type: String, required: true},
    fromDate: {type: String, required: true},
    fromTime: {type: String, required: true},
    toDate: {type: String, required: true},
    toTime: {type: String, required: true},
    reason: {type: String, required: true},
    status: {type: String, default: 'Pending'},
    appliedDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Leave', LeaveSchema);