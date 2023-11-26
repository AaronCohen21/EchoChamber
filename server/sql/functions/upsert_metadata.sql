CREATE OR REPLACE FUNCTION upsert(mid uuid, tmbnl text, ttl varchar(255), dsc varchar, rdate date)
RETURNS uuid AS $$
DECLARE 
	new_meta_id uuid := uuid_generate_v4 ();	
	meta_id uuid := (SELECT metadata_id FROM media WHERE id = mid);
BEGIN

IF meta_id IS NOT NULL THEN
  UPDATE metadata SET
    thumbnail = COALESCE(tmbnl, thumbnail),
    title = COALESCE(ttl, title),
    description = COALESCE(dsc, description),
    release_date = COALESCE(rdate, release_date)
  WHERE id = meta_id;
 
  RETURN meta_id;
ELSE
  INSERT INTO metadata
  VALUES (new_meta_id, tmbnl, ttl, dsc, rdate);
 
  UPDATE media SET metadata_id = new_meta_id WHERE media.id = mid;
 
  RETURN new_meta_id;
END IF;

END;
$$ LANGUAGE plpgsql;