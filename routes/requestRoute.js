 const express = require('express');
const router = express.Router();

const { createRequest, getRequests, getMyRequests, acceptRequest } = require('../Controller/requestController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request', authMiddleware, createRequest);
router.get('/requests/received', authMiddleware, getRequests);
router.get("/requests/sent", authMiddleware, getMyRequests);
router.patch("/requests/:id/status", authMiddleware, acceptRequest);


module.exports = router;