const express = require('express');
const StudentL = require('jsonwebtoken');
const router = express.Router();
const Leave = require('../models/LeaveJ.js');
const Student = require('../models/StudentsJ.js');


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try{
        const student = await StudentL.findOne({ email });
        if(!student || student.password !== password ) {
            return res.status(401).json({ message: 'Invalid email or password'});
        }

        const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET, { expiresIn:'1h'});
        res.json({ token, studentId: student._id });
    } catch (err) {
        res.status(500).json({ message : 'Server error', error: err});
    }
});

router.post('/applyLeave', async (req, res) => {
    // console.log('Request received:', req.body);
    const {studentId, leaveType, fromDate, fromTime, toDate, toTime, reason} = req.body;

    if( !studentId||!leaveType || !fromDate || !fromTime || !toDate || !toTime || !reason) {
        return res.status(400).json({ message: 'All field are required'});
    }
    try {
        const newLeave = new Leave({
            studentId,
            leaveType,
            fromDate,
            fromTime,
            toDate,
            toTime,
            reason,
            status: 'pending' //Initail status
        });
        await newLeave.save();
        res.status(201).json({ message: 'Leave applied successfully!'});
        } catch (err) {
            console.error('Error applying leave:', err);
            res.status(500).json({message: 'Error applying leave', error: err});
    }   
});

router.get('/getLeave/:studentId', async (req, res) => {
    const { studentId } = req.params; // Use req.query for GET requests

    if (!studentId) {
        return res.status(400).json({ message: 'You must be logged in' });
    }

    try {
        const leaveRecords = await Leave.find({ studentId });

        if (!leaveRecords.length) {
            return res.status(404).json({ message: 'No leave records found' });
        }

        res.status(200).json({ pending: leaveRecords.filter(l => l.status === 'Pending'), 
                               approved: leaveRecords.filter(l => l.status === 'Approved') });

    } catch (err) {
        console.error('Error Getting leave:', err);
        res.status(500).json({ message: 'Error getting leave', error: err.message });
    }
});


router.post('/addStudent', async(req, res) => {
    const { email, studentId, name } = req.body;

    try{
        const existingStudent = await Student.findOne({ email });
        if(existingStudent) {
            return res.status(400).json({ message: "Student with this email already exist", student: existingStudent});
        }

        const newStudent = new Student({ email, studentId, name });
        // const newStudent = new Student.findOne({ email, studentId, name });
        await newStudent.save();
        res.status(201).json({ message : 'Student added successfully!', student: newStudent});
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Error adding student:', error});
    }
});
router.post('/getStudentsId', async (req,res) =>{
    const {email} = req.body;

    try {
        const student = await Student.findOne({ email });
        if(!student) {
            return res.status(404).json({ message: 'User not found'});
    }

    res.status(200).json({studentId: student.studentId });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student ID', error:err});
    }
});

// router.post('/addStudent', async (req, res) => {
//     const { email, studentId, name } = req.body;

//     try {

//         const existingStudent = await Student.findOne({ email });
//         if(existingStudent) {
//             return res.status(400).json({ message: 'Student with this mail id already exist', student: existingStudent});
//         }

//         const newStudent = new Student({
//             email,
//             studentId,
//             name
//         });

//         await newStudent.save();
//         res.status(201).json({ message: 'Student added successfully!', student: newStudent });
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding student', error });
//     }
// });

// router.get('/leaveSummary/:studentId', async (req, res) => {

//     const studentId = req.params.studentId;

//     try {
//         const pendingLeaves = await Leave.find({ studentId, status: 'pending' });
//         const approvedLeaves = await Leave.find({ studentId, status: 'approved' });
//         // const leaveSummary = await Leave.find({studentId});

//         res.status(200).json({ pending: pendingLeaves, approved: approvedLeaves });
//         // res.status(200).json({summary: leaveSummary});
//     } catch (err) {
//         res.status(500).json({message: 'Error fetching leave summary', error:err});
//     }
// });

router.post('/approvalLeave', async (req, res) => {
    const {leaveId, status} = req.body;
    // const {leaveId, status } = req.body;
    

    try {
        const leave = await Leave.findByIdAndUpdate(leaveId, { status }, {new:true});

        if (!leave) {
            return res.status(404).json({message: 'Leave request not found'});
        }

        res.status(200).json({message: 'Leave status updated!', leave});
    } catch (err) {
        res.status(500).json({message: 'Error updating leave status',error:err});
    }
});

module.exports = router;