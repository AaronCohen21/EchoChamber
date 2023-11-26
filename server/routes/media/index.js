const {
  validateImage,
  getMediaFromUuid,
  metadataUpsert,
  deleteMediaAndMetadata,
  countAllMedia,
  getAllMedia,
} = require('./utils');
const Pagination = require('./Pagination');
const express = require('express');
const router = express.Router();

// Get-all endpoint returning a pagination of all entries and their metadata
router.get('/', async (req, res) => {
  try {
    const { query, originalUrl } = req;
    const limit = parseInt(query.limit) || 100;
    const offset = parseInt(query.offset) || 0;

    if (isNaN(limit) || isNaN(offset) || limit < 0 || offset < 0) {
      res.status(400).send('Limit and Offset must be positive integers');
      return;
    }

    const total = await countAllMedia();
    if (!total) {
      res.status(200).send(Pagination.getEmptyPagination(originalUrl, query));
      return;
    }

    const media = await getAllMedia(limit, offset);
    res.status(200).send(new Pagination(media, total, originalUrl, query));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Upsert metadata for an entry given its uuid
router.post('/:media', async (req, res) => {
  try {
    // Instead of an image this is going to accept a base64 encoded string of an image (or blob)
    // That way we can just grab the blob from the database and render it directly no hassle
    const mediaData = await getAndValidateMediaData(req, res);
    if (!mediaData) return;

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
      mediaData.uuid,
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

// Get metadata for an entry
router.get('/:media', async (req, res) => {
  try {
    const mediaData = await getAndValidateMediaData(req, res);
    if (!mediaData) return;
    res.status(200).send(mediaData);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Delete an entry and its metadata given its uuid
router.delete('/:media', async (req, res) => {
  try {
    const mediaData = await getAndValidateMediaData(req, res);
    if (!mediaData) return;
    deleteMediaAndMetadata(mediaData.uuid);
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
    return null;
  } else if (mediaData === -1) {
    res.status(400).send(`${mediaUuid} is not a valid uuid`);
    return null;
  }
  return mediaData;
};

module.exports = router;
