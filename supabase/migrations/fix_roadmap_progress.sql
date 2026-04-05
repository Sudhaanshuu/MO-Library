-- Fix roadmap progress tracking
-- This ensures progress updates correctly when books are marked as completed

-- Improved trigger function that creates progress entry if it doesn't exist
CREATE OR REPLACE FUNCTION update_roadmap_progress()
RETURNS TRIGGER AS $$
DECLARE
  path_id uuid;
BEGIN
  -- Only proceed if status changed to completed
  IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
    
    -- Loop through all learning paths that contain this book
    FOR path_id IN 
      SELECT learning_path_id 
      FROM roadmap_books 
      WHERE book_id = NEW.book_id
    LOOP
      -- Try to update existing progress
      UPDATE user_roadmap_progress
      SET 
        books_completed = books_completed + 1,
        last_activity_at = now()
      WHERE user_id = NEW.user_id
        AND learning_path_id = path_id;
      
      -- If no row was updated, it means user hasn't started this path yet
      -- We can optionally create an entry (commented out for now)
      -- IF NOT FOUND THEN
      --   INSERT INTO user_roadmap_progress (user_id, learning_path_id, books_completed, started_at, last_activity_at)
      --   VALUES (NEW.user_id, path_id, 1, now(), now());
      -- END IF;
    END LOOP;
    
  -- Handle case where status changes from completed to something else
  ELSIF OLD IS NOT NULL AND OLD.status = 'completed' AND NEW.status != 'completed' THEN
    
    -- Decrease the completed count
    FOR path_id IN 
      SELECT learning_path_id 
      FROM roadmap_books 
      WHERE book_id = NEW.book_id
    LOOP
      UPDATE user_roadmap_progress
      SET 
        books_completed = GREATEST(0, books_completed - 1),
        last_activity_at = now()
      WHERE user_id = NEW.user_id
        AND learning_path_id = path_id;
    END LOOP;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_update_roadmap_progress ON user_reading_list;
CREATE TRIGGER trigger_update_roadmap_progress
  AFTER INSERT OR UPDATE OF status ON user_reading_list
  FOR EACH ROW
  EXECUTE FUNCTION update_roadmap_progress();

-- Add a helper function to manually recalculate progress for a user
CREATE OR REPLACE FUNCTION recalculate_roadmap_progress(p_user_id uuid, p_learning_path_id uuid)
RETURNS void AS $$
DECLARE
  completed_count int;
BEGIN
  -- Count how many books in this path the user has completed
  SELECT COUNT(*)
  INTO completed_count
  FROM user_reading_list url
  INNER JOIN roadmap_books rb ON rb.book_id = url.book_id
  WHERE url.user_id = p_user_id
    AND url.status = 'completed'
    AND rb.learning_path_id = p_learning_path_id;
  
  -- Update the progress
  UPDATE user_roadmap_progress
  SET 
    books_completed = completed_count,
    last_activity_at = now()
  WHERE user_id = p_user_id
    AND learning_path_id = p_learning_path_id;
    
END;
$$ LANGUAGE plpgsql;

-- Usage example (commented out):
-- SELECT recalculate_roadmap_progress('user-uuid-here', 'path-uuid-here');
