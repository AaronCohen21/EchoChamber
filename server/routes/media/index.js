const { validateImage, getMediaFromUuid, metadataUpsert } = require('./utils');

const express = require('express');
const router = express.Router();

router.post('/:media/metadata', async (req, res) => {
  try {
    // Instead of an image this is going to accept a base64 encoded string of an image (or blob)
    // That way we can just grab the blob from the database and render it directly no hassle
    const mediaUuid = req.params.media;
    const mediaData = await getMediaFromUuid(mediaUuid);
    if (!mediaData) {
      res.status(404).send(`Media with uuid: ${mediaUuid} not found`);
      return;
    } else if (mediaData === -1) {
      res.status(400).send(`${mediaUuid} is not a valid uuid`);
      return;
    }

    const { thumbnail, title, description, releaseDate } = req.body;
    const thumbnailBuffer = thumbnail ? Buffer.from(thumbnail, 'base64') : null;

    const validationResults = thumbnail
      ? await validateImage(thumbnailBuffer)
      : true;
    if (!validationResults) {
      res.status(400).send('Please upload a valid image');
      return;
    }

    const releaseDateObj = new Date(releaseDate);
    if (releaseDate && isNaN(releaseDateObj)) {
      res.status(400).send('Invalid date');
      return;
    }

    // Everything has been validated and is good to go
    const metadataId = await metadataUpsert(
      mediaUuid,
      thumbnail,
      title,
      description,
      releaseDateObj
    );

    res.status(201).send(metadataId);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.get('/:media/metadata', async (req, res) => {
  try {
    const mediaUuid = req.params.media;
    const mediaData = await getMediaFromUuid(mediaUuid);
    if (!mediaData) {
      res.status(404).send(`Media with uuid: ${mediaUuid} not found`);
      return;
    } else if (mediaData === -1) {
      res.status(400).send(`${mediaUuid} is not a valid uuid`);
      return;
    }

    res.status(200).send(mediaData);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
