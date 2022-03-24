const express = require('express');
const guestRoutes = require('./guest');
const moderatorRoutes = require('./moderator');
const chatRoutes = require('./chat');

const router = express.Router();

router.use('/guest', guestRoutes);
router.use('/moderator', moderatorRoutes);
router.use('/chat', chatRoutes);

module.exports = router;