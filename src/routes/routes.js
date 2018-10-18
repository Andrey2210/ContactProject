const router = require('express').Router();
const multer = require('multer');
const requestHandler = require('./request-handler.js');

const upload = multer({
    dest: 'uploads/'
}); 

router.get('/contact', requestHandler.getContacts);
router.get('/contact/download', requestHandler.downloadContacts);
router.put('/contact', requestHandler.updateContact);
router.post('/contact', upload.single('uploadCsv'), requestHandler.insertContacts);

module.exports = router;
