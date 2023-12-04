const express= require('express')
const messagesController = require('../controllers/messages.controller')
const router = express.Router()

router.get('/' ,messagesController.messages_list)
router.get('/create' ,messagesController.message_create_get)
router.post('/create' ,messagesController.message_create_post)

module.exports = router