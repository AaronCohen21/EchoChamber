module.exports = row => {
  return {
    uuid: row.id,
    fileName: row.media_name,
    title: row.title,
    description: row.description,
    releaseDate: !row.release_date ? null : new Date(row.release_date),
    // TODO: possibly make this return a link to another endpoint returning the image in a non-base64 encoded way
    thumbnail: row.thumbnail,
  };
};
