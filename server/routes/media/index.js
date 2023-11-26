const {
  validateImage,
  getMediaFromUuid,
  metadataUpsert,
  deleteMediaAndMetadata,
} = require('./utils');

const express = require('express');
const router = express.Router();

router.post('/:media', async (req, res) => {
  try {
    // Instead of an image this is going to accept a base64 encoded string of an image (or blob)
    // That way we can just grab the blob from the database and render it directly no hassle
    const mediaData = await getAndValidateMediaData(req, res);

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
      mediaData.id,
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

router.get('/:media', async (req, res) => {
  try {
    const mediaData = await getAndValidateMediaData(req, res);
    res.status(200).send(mediaData);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.delete('/:media', async (req, res) => {
  try {
    const mediaData = await getAndValidateMediaData(req, res);
    deleteMediaAndMetadata(mediaData.id);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

const getAndValidateMediaData = async (req, res) => {
  const mediaUuid = req.params.media;
  const mediaData = await getMediaFromUuid(mediaUuid);
  if (!mediaData) {
    res.status(404).send(`Media with uuid: ${mediaUuid} not found`);
    return;
  } else if (mediaData === -1) {
    res.status(400).send(`${mediaUuid} is not a valid uuid`);
    return;
  }
  return mediaData;
};

module.exports = router;
