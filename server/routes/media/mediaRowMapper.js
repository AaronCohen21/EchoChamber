module.exports = row => {
  const uuid = row.id;
  return {
    uuid,
    fileName: row.media_name,
    title: row.title,
    description: row.description,
    releaseDate: !row.release_date ? null : new Date(row.release_date),
    thumbnail: `/api/v1/media/${uuid}/thumbnail`,
  };
};
