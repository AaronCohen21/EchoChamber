const { validateMedia, addMedia, STATIC_DIR } = require('./utils');
const fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
  dest: path.resolve(`${STATIC_DIR}/tmp`),
});

// Any uploads to this endpoint require the POST request to be in the form 'multipart/form-data'
// This the 'multer' middleware is used to parse the large file uploads, read more here:
// https://www.npmjs.com/package/multer

router.put('/', upload.single('file'), async (req, res) => {
  try {
    const validationResults = validateMedia(req.file);
    if (!validationResults) {
      res.status(400).send('Please upload a valid video file');
      // Delete uploaded file since it is invalid
      fs.unlinkSync(path.resolve(req.file.path));
      return;
    }

    const uuid = await addMedia(req.file.originalname, req.file.filename);

    // Move temp file to STATIC_DIR/video and assign original filename prepended with hash
    fs.renameSync(
      path.resolve(req.file.path),
      path.resolve(
        `${STATIC_DIR}/video/${req.file.filename}${req.file.originalname}`
      )
    );

    res.status(201).send(uuid);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
