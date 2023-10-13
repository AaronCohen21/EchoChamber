const { validateFile, createDbEntry, STATIC_DIR } = require('./utils');
const fs = require('fs');
const path = require('path');

const multer = require('multer');
const upload = multer({
  dest: path.resolve(`${STATIC_DIR}/tmp`),
});

const express = require('express');
const router = express.Router();

// Any uploads to this endpoint require the POST request to be in the form 'multipart/form-data'
// This the 'multer' middleware is used to parse the large file uploads, read more here:
// https://www.npmjs.com/package/multer

router.put('/', upload.single('file'), async (req, res) => {
  try {
    const validationResults = validateFile(req.file);
    if (validationResults.error) {
      res
        .status(400)
        .json({
          status: '400 - Bad Request, please upload a valid video file.',
          message: validationResults.message,
        })
        .send();
      // Delete uploaded file since it is invalid
      fs.unlinkSync(path.resolve(req.file.path));
      return;
    }

    const uuid = await createDbEntry(req.file.originalname, req.file.filename);

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
