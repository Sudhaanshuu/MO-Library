-- ==============================================================================
-- MO-LIBRARY COMPLETE DATABASE SETUP & MIGRATION SCRIPT
-- ==============================================================================
-- Single unified SQL script to set up the entire database from scratch.
-- Fully idempotent (safe to run on fresh or existing databases).
--
-- HOW TO RUN:
-- 1. Open your Supabase Project Dashboard (https://supabase.com/dashboard)
-- 2. Go to the SQL Editor in the left sidebar
-- 3. Click "+ New query"
-- 4. Copy and paste this ENTIRE file into the editor
-- 5. Click "Run" (or press Ctrl + Enter / Cmd + Enter)
-- 6. All tables, functions, triggers, RLS policies, storage bucket,
--    and sample books/quizzes/roadmaps will be created!
-- ==============================================================================

-- ==============================================================================
-- SECTION 1: EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- SECTION 2: TABLES & CONSTRAINTS
-- ==============================================================================

-- 1. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  is_admin boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Ensure is_admin exists if table was pre-existing
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- 2. Seats Table
CREATE TABLE IF NOT EXISTS public.seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seat_number text NOT NULL,
  is_available boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Ensure seat_number unique constraint exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'seats_seat_number_key'
  ) THEN
    ALTER TABLE public.seats ADD CONSTRAINT seats_seat_number_key UNIQUE (seat_number);
  END IF;
EXCEPTION
  WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seat_id uuid REFERENCES public.seats(id) ON DELETE CASCADE NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  payment_id text,
  amount_paid numeric(10, 2),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Ensure payment columns exist if table was pre-existing
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_id text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS amount_paid numeric(10, 2);

-- 4. Books Table
CREATE TABLE IF NOT EXISTS public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  isbn text,
  is_available boolean DEFAULT true NOT NULL,
  total_copies int DEFAULT 1 NOT NULL,
  available_copies int DEFAULT 1 NOT NULL,
  book_type text DEFAULT 'physical' CHECK (book_type IN ('physical', 'ebook', 'both')),
  pdf_url text,
  cover_image_url text,
  description text,
  genre text,
  category text,
  publication_year int,
  pages int,
  language text DEFAULT 'English',
  publisher text,
  rating decimal(3,2) DEFAULT 0.0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Ensure all book columns exist if table was pre-existing
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS book_type text DEFAULT 'physical';
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS pdf_url text;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS genre text;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS publication_year int;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS pages int;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS language text DEFAULT 'English';
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS publisher text;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS rating decimal(3,2) DEFAULT 0.0;

-- 5. Community Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  book_title text,
  duration_days int,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Post Likes Table
CREATE TABLE IF NOT EXISTS public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'post_likes_post_user_unique'
  ) THEN
    ALTER TABLE public.post_likes ADD CONSTRAINT post_likes_post_user_unique UNIQUE (post_id, user_id);
  END IF;
EXCEPTION
  WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;

-- 7. Post Comments Table
CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id uuid REFERENCES public.post_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 8. Book Requests Table
CREATE TABLE IF NOT EXISTS public.book_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_name text NOT NULL,
  requester_email text NOT NULL,
  book_title text NOT NULL,
  author text NOT NULL,
  additional_info text,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 9. User Reading List Table
CREATE TABLE IF NOT EXISTS public.user_reading_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  book_id uuid REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'want_to_read' NOT NULL CHECK (status IN ('want_to_read', 'currently_reading', 'completed', 'on_hold')),
  added_at timestamptz DEFAULT now() NOT NULL,
  started_at timestamptz,
  completed_at timestamptz,
  user_rating int CHECK (user_rating >= 1 AND user_rating <= 5),
  user_notes text
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_reading_list_user_book_unique'
  ) THEN
    ALTER TABLE public.user_reading_list ADD CONSTRAINT user_reading_list_user_book_unique UNIQUE (user_id, book_id);
  END IF;
EXCEPTION
  WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;

-- 10. Reading Quiz Questions Table
CREATE TABLE IF NOT EXISTS public.reading_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  difficulty text DEFAULT 'medium' NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at timestamptz DEFAULT now() NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reading_quiz_questions_book_question_unique'
  ) THEN
    -- Remove any duplicates if they exist before adding constraint
    DELETE FROM public.reading_quiz_questions a
    USING public.reading_quiz_questions b
    WHERE a.id > b.id AND a.book_id = b.book_id AND a.question = b.question;

    ALTER TABLE public.reading_quiz_questions ADD CONSTRAINT reading_quiz_questions_book_question_unique UNIQUE (book_id, question);
  END IF;
EXCEPTION
  WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;

-- 11. User Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.user_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  book_id uuid REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  score int NOT NULL,
  total_questions int NOT NULL,
  passed boolean DEFAULT false NOT NULL,
  attempted_at timestamptz DEFAULT now() NOT NULL
);

-- 12. Learning Paths (Roadmaps) Table
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  difficulty_level text DEFAULT 'beginner' NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration_days int,
  cover_image_url text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_published boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 13. Roadmap Books Junction Table
CREATE TABLE IF NOT EXISTS public.roadmap_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id uuid REFERENCES public.learning_paths(id) ON DELETE CASCADE NOT NULL,
  book_id uuid REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  sequence_order int NOT NULL,
  is_required boolean DEFAULT true NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'roadmap_books_path_book_unique'
  ) THEN
    ALTER TABLE public.roadmap_books ADD CONSTRAINT roadmap_books_path_book_unique UNIQUE (learning_path_id, book_id);
  END IF;
EXCEPTION
  WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;

-- 14. User Roadmap Progress Table
CREATE TABLE IF NOT EXISTS public.user_roadmap_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  learning_path_id uuid REFERENCES public.learning_paths(id) ON DELETE CASCADE NOT NULL,
  current_book_id uuid REFERENCES public.books(id) ON DELETE SET NULL,
  books_completed int DEFAULT 0 NOT NULL,
  started_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz,
  last_activity_at timestamptz DEFAULT now() NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roadmap_progress_user_path_unique'
  ) THEN
    ALTER TABLE public.user_roadmap_progress ADD CONSTRAINT user_roadmap_progress_user_path_unique UNIQUE (user_id, learning_path_id);
  END IF;
EXCEPTION
  WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;

-- ==============================================================================
-- SECTION 3: PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id ON public.post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON public.books(author);
CREATE INDEX IF NOT EXISTS idx_books_genre ON public.books(genre);
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category);
CREATE INDEX IF NOT EXISTS idx_books_book_type ON public.books(book_type);
CREATE INDEX IF NOT EXISTS idx_books_rating ON public.books(rating DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_seat_time ON public.bookings(seat_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_active ON public.bookings(seat_id, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_id ON public.bookings(payment_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_list_user_id ON public.user_reading_list(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_list_status ON public.user_reading_list(status);
CREATE INDEX IF NOT EXISTS idx_reading_quiz_book_id ON public.reading_quiz_questions(book_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON public.user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_category ON public.learning_paths(category);
CREATE INDEX IF NOT EXISTS idx_roadmap_books_path_id ON public.roadmap_books(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_books_sequence ON public.roadmap_books(learning_path_id, sequence_order);
CREATE INDEX IF NOT EXISTS idx_user_roadmap_progress_user_id ON public.user_roadmap_progress(user_id);

-- ==============================================================================
-- SECTION 4: FUNCTIONS & TRIGGERS
-- ==============================================================================

-- 1. Helper function: check if caller is an admin (Security Definer avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 2. Trigger function: Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, is_admin)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    false
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name);
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Double Booking Prevention Functions
CREATE OR REPLACE FUNCTION public.check_booking_conflict(
  p_seat_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz,
  p_booking_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.bookings
    WHERE seat_id = p_seat_id
      AND (p_booking_id IS NULL OR id != p_booking_id)
      AND (
        (p_start_time >= start_time AND p_start_time < end_time)
        OR (p_end_time > start_time AND p_end_time <= end_time)
        OR (p_start_time <= start_time AND p_end_time >= end_time)
      )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_booking_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.seats WHERE id = NEW.seat_id) THEN
    RAISE EXCEPTION 'Seat does not exist';
  END IF;

  IF NEW.start_time >= NEW.end_time THEN
    RAISE EXCEPTION 'Booking end time must be after start time';
  END IF;

  IF NEW.start_time < (NOW() - INTERVAL '1 minute') THEN
    RAISE EXCEPTION 'Cannot book a seat in the past';
  END IF;

  IF check_booking_conflict(NEW.seat_id, NEW.start_time, NEW.end_time, NEW.id) THEN
    RAISE EXCEPTION 'This seat is already booked for the selected time period. Please choose a different seat or time.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_validate_booking_insert ON public.bookings;
CREATE TRIGGER trigger_validate_booking_insert
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_booking_before_insert();

CREATE OR REPLACE FUNCTION public.validate_booking_before_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.seats WHERE id = NEW.seat_id) THEN
    RAISE EXCEPTION 'Seat does not exist';
  END IF;

  IF NEW.start_time >= NEW.end_time THEN
    RAISE EXCEPTION 'Booking end time must be after start time';
  END IF;

  IF check_booking_conflict(NEW.seat_id, NEW.start_time, NEW.end_time, NEW.id) THEN
    RAISE EXCEPTION 'This seat is already booked for the selected time period. Please choose a different seat or time.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_validate_booking_update ON public.bookings;
CREATE TRIGGER trigger_validate_booking_update
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_booking_before_update();

CREATE OR REPLACE FUNCTION public.get_available_seats(
  p_start_time timestamptz,
  p_end_time timestamptz
)
RETURNS TABLE(
  seat_id uuid,
  seat_number text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.seat_number
  FROM public.seats s
  WHERE NOT check_booking_conflict(s.id, p_start_time, p_end_time)
  ORDER BY s.seat_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_seat_available(
  p_seat_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN NOT check_booking_conflict(p_seat_id, p_start_time, p_end_time);
END;
$$;

-- 4. Book Rating Sync Trigger
CREATE OR REPLACE FUNCTION public.update_book_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.books
  SET rating = (
    SELECT COALESCE(AVG(user_rating), 0)
    FROM public.user_reading_list
    WHERE book_id = NEW.book_id AND user_rating IS NOT NULL
  )
  WHERE id = NEW.book_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_book_rating ON public.user_reading_list;
CREATE TRIGGER trigger_update_book_rating
  AFTER INSERT OR UPDATE OF user_rating ON public.user_reading_list
  FOR EACH ROW
  EXECUTE FUNCTION public.update_book_rating();

-- 5. Roadmap Progress Tracking Trigger
CREATE OR REPLACE FUNCTION public.update_roadmap_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  path_id uuid;
BEGIN
  IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
    FOR path_id IN 
      SELECT learning_path_id 
      FROM public.roadmap_books 
      WHERE book_id = NEW.book_id
    LOOP
      UPDATE public.user_roadmap_progress
      SET 
        books_completed = books_completed + 1,
        last_activity_at = now()
      WHERE user_id = NEW.user_id
        AND learning_path_id = path_id;
    END LOOP;
  ELSIF OLD IS NOT NULL AND OLD.status = 'completed' AND NEW.status != 'completed' THEN
    FOR path_id IN 
      SELECT learning_path_id 
      FROM public.roadmap_books 
      WHERE book_id = NEW.book_id
    LOOP
      UPDATE public.user_roadmap_progress
      SET 
        books_completed = GREATEST(0, books_completed - 1),
        last_activity_at = now()
      WHERE user_id = NEW.user_id
        AND learning_path_id = path_id;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_roadmap_progress ON public.user_reading_list;
CREATE TRIGGER trigger_update_roadmap_progress
  AFTER INSERT OR UPDATE OF status ON public.user_reading_list
  FOR EACH ROW
  EXECUTE FUNCTION public.update_roadmap_progress();

-- 6. Helper: Recalculate Roadmap Progress
CREATE OR REPLACE FUNCTION public.recalculate_roadmap_progress(p_user_id uuid, p_learning_path_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  completed_count int;
BEGIN
  SELECT COUNT(*)
  INTO completed_count
  FROM public.user_reading_list url
  INNER JOIN public.roadmap_books rb ON rb.book_id = url.book_id
  WHERE url.user_id = p_user_id
    AND url.status = 'completed'
    AND rb.learning_path_id = p_learning_path_id;
  
  UPDATE public.user_roadmap_progress
  SET 
    books_completed = completed_count,
    last_activity_at = now()
  WHERE user_id = p_user_id
    AND learning_path_id = p_learning_path_id;
END;
$$;

-- ==============================================================================
-- SECTION 5: ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reading_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roadmap_progress ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- 2. Seats Policies
DROP POLICY IF EXISTS "Anyone can view seats" ON public.seats;
CREATE POLICY "Anyone can view seats"
  ON public.seats FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage seats" ON public.seats;
CREATE POLICY "Admins can manage seats"
  ON public.seats FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Bookings Policies
DROP POLICY IF EXISTS "Authenticated users can view bookings" ON public.bookings;
CREATE POLICY "Authenticated users can view bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;
CREATE POLICY "Users can create own bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;
CREATE POLICY "Users can delete own bookings"
  ON public.bookings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- 4. Books Policies
DROP POLICY IF EXISTS "Anyone can view books" ON public.books;
CREATE POLICY "Anyone can view books"
  ON public.books FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Only admins can manage books" ON public.books;
CREATE POLICY "Only admins can manage books"
  ON public.books FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Community Posts Policies
DROP POLICY IF EXISTS "Anyone can view community posts" ON public.community_posts;
CREATE POLICY "Anyone can view community posts"
  ON public.community_posts FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can create community posts" ON public.community_posts;
CREATE POLICY "Users can create community posts"
  ON public.community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON public.community_posts;
CREATE POLICY "Users can update own posts"
  ON public.community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own posts" ON public.community_posts;
CREATE POLICY "Users can delete own posts"
  ON public.community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- 6. Post Likes Policies
DROP POLICY IF EXISTS "Anyone can view likes" ON public.post_likes;
CREATE POLICY "Anyone can view likes"
  ON public.post_likes FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can like posts" ON public.post_likes;
CREATE POLICY "Users can like posts"
  ON public.post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike posts" ON public.post_likes;
CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. Post Comments Policies
DROP POLICY IF EXISTS "Anyone can view comments" ON public.post_comments;
CREATE POLICY "Anyone can view comments"
  ON public.post_comments FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.post_comments;
CREATE POLICY "Users can create comments"
  ON public.post_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON public.post_comments;
CREATE POLICY "Users can update own comments"
  ON public.post_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own comments" ON public.post_comments;
CREATE POLICY "Users can delete own comments"
  ON public.post_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- 8. Book Requests Policies
DROP POLICY IF EXISTS "Anyone can view book requests" ON public.book_requests;
CREATE POLICY "Anyone can view book requests"
  ON public.book_requests FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can create book requests" ON public.book_requests;
CREATE POLICY "Anyone can create book requests"
  ON public.book_requests FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can manage book requests" ON public.book_requests;
CREATE POLICY "Only admins can manage book requests"
  ON public.book_requests FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 9. User Reading List Policies
DROP POLICY IF EXISTS "Users can view own reading list" ON public.user_reading_list;
CREATE POLICY "Users can view own reading list"
  ON public.user_reading_list FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own reading list" ON public.user_reading_list;
CREATE POLICY "Users can insert own reading list"
  ON public.user_reading_list FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reading list" ON public.user_reading_list;
CREATE POLICY "Users can update own reading list"
  ON public.user_reading_list FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reading list" ON public.user_reading_list;
CREATE POLICY "Users can delete own reading list"
  ON public.user_reading_list FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 10. Reading Quiz Questions Policies
DROP POLICY IF EXISTS "Anyone can view quiz questions" ON public.reading_quiz_questions;
CREATE POLICY "Anyone can view quiz questions"
  ON public.reading_quiz_questions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Only admins can manage quiz questions" ON public.reading_quiz_questions;
CREATE POLICY "Only admins can manage quiz questions"
  ON public.reading_quiz_questions FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11. User Quiz Attempts Policies
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON public.user_quiz_attempts;
CREATE POLICY "Users can view own quiz attempts"
  ON public.user_quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON public.user_quiz_attempts;
CREATE POLICY "Users can insert own quiz attempts"
  ON public.user_quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 12. Learning Paths Policies
DROP POLICY IF EXISTS "Anyone can view published learning paths" ON public.learning_paths;
CREATE POLICY "Anyone can view published learning paths"
  ON public.learning_paths FOR SELECT
  TO authenticated
  USING (is_published = true OR created_by = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage learning paths" ON public.learning_paths;
CREATE POLICY "Admins can manage learning paths"
  ON public.learning_paths FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 13. Roadmap Books Policies
DROP POLICY IF EXISTS "Anyone can view roadmap books" ON public.roadmap_books;
CREATE POLICY "Anyone can view roadmap books"
  ON public.roadmap_books FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage roadmap books" ON public.roadmap_books;
CREATE POLICY "Admins can manage roadmap books"
  ON public.roadmap_books FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 14. User Roadmap Progress Policies
DROP POLICY IF EXISTS "Users can view own roadmap progress" ON public.user_roadmap_progress;
CREATE POLICY "Users can view own roadmap progress"
  ON public.user_roadmap_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can manage own roadmap progress" ON public.user_roadmap_progress;
CREATE POLICY "Users can manage own roadmap progress"
  ON public.user_roadmap_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- ==============================================================================
-- SECTION 6: SUPABASE STORAGE BUCKET (Avatars)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;
CREATE POLICY "Public avatar access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatar" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can update avatar" ON storage.objects;
CREATE POLICY "Users can update avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can delete avatar" ON storage.objects;
CREATE POLICY "Users can delete avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars');

-- ==============================================================================
-- SECTION 7: INITIAL SEED DATA
-- ==============================================================================

-- 1. Insert 30 initial seats
DO $$
BEGIN
  FOR i IN 1..30 LOOP
    INSERT INTO public.seats (seat_number, is_available)
    VALUES ('Seat ' || i, true)
    ON CONFLICT (seat_number) DO NOTHING;
  END LOOP;
END $$;


-- 2. Learning Paths
-- ============================================

INSERT INTO learning_paths (id, title, description, category, difficulty_level, estimated_duration_days, is_published)
VALUES 
(
  'c34b63f1-9c4b-4a36-a27a-45c0fd2704ff',
  'Backend Development Mastery',
  'Master backend development from fundamentals to advanced concepts. Learn server-side programming, databases, APIs, and scalable architecture.',
  'Backend Development',
  'intermediate',
  120,
  true
),
(
  'a1bf7e69-f3c1-4950-8968-77b0ba634e54',
  'Modern Frontend Development',
  'Become a frontend expert with modern frameworks, responsive design, and best practices. Build beautiful, performant user interfaces.',
  'Frontend Development',
  'beginner',
  90,
  true
),
(
  '0a554a2a-f0ff-448a-bf4d-b1727190e478',
  'Full Stack Web Development',
  'Complete full stack journey covering both frontend and backend. Build end-to-end web applications with modern technologies.',
  'Full Stack Development',
  'advanced',
  180,
  true
),
(
  '60e7dbb5-f31b-40f8-808a-ada517ef2ca2',
  'DevOps & Cloud Engineering',
  'Learn deployment, CI/CD, containerization, and cloud platforms. Master the tools that power modern software delivery.',
  'DevOps',
  'intermediate',
  100,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Verify learning paths were created


-- ============================================
-- BACKEND DEVELOPMENT BOOKS
-- ============================================

-- Book 1: Node.js Fundamentals
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Node.js Design Patterns',
  'Mario Casciaro',
  'Programming',
  'Backend Development',
  'Master Node.js development with proven patterns and best practices. Learn asynchronous programming, streams, and scalable architecture.',
  'both',
  526,
  'English',
  2020,
  4.5
) ON CONFLICT (id) DO NOTHING;

-- Book 2: Database Design
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '11111111-1111-1111-1111-111111111112',
  'Database Design and Implementation',
  'Edward Sciore',
  'Programming',
  'Database',
  'Comprehensive guide to database design, SQL, NoSQL, and data modeling. Learn to build efficient and scalable database systems.',
  'both',
  450,
  'English',
  2021,
  4.3
) ON CONFLICT (id) DO NOTHING;

-- Book 3: RESTful API Design
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '11111111-1111-1111-1111-111111111113',
  'RESTful Web API Design with Node.js',
  'Valentin Bojinov',
  'Programming',
  'API Development',
  'Learn to design and build RESTful APIs with Node.js. Master authentication, security, and API best practices.',
  'both',
  380,
  'English',
  2022,
  4.4
) ON CONFLICT (id) DO NOTHING;

-- Book 4: Microservices Architecture
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '11111111-1111-1111-1111-111111111114',
  'Building Microservices',
  'Sam Newman',
  'Programming',
  'Architecture',
  'Advanced guide to microservices architecture, distributed systems, and scalable backend design.',
  'both',
  615,
  'English',
  2021,
  4.6
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FRONTEND DEVELOPMENT BOOKS
-- ============================================

-- Book 1: HTML & CSS Fundamentals
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '22222222-2222-2222-2222-222222222221',
  'HTML and CSS: Design and Build Websites',
  'Jon Duckett',
  'Programming',
  'Frontend Development',
  'Beautiful introduction to HTML5 and CSS3. Learn semantic markup, responsive design, and modern web standards.',
  'both',
  490,
  'English',
  2021,
  4.7
) ON CONFLICT (id) DO NOTHING;

-- Book 2: JavaScript Mastery
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'JavaScript: The Definitive Guide',
  'David Flanagan',
  'Programming',
  'JavaScript',
  'Complete guide to JavaScript. Master ES6+, async programming, DOM manipulation, and modern JavaScript patterns.',
  'both',
  706,
  'English',
  2020,
  4.5
) ON CONFLICT (id) DO NOTHING;

-- Book 3: React Development
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '22222222-2222-2222-2222-222222222223',
  'Learning React: Modern Patterns for Developing React Apps',
  'Alex Banks & Eve Porcello',
  'Programming',
  'React',
  'Learn React from the ground up. Master hooks, state management, routing, and building production-ready applications.',
  'both',
  310,
  'English',
  2022,
  4.6
) ON CONFLICT (id) DO NOTHING;

-- Book 4: Advanced Frontend
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '22222222-2222-2222-2222-222222222224',
  'Web Performance in Action',
  'Jeremy Wagner',
  'Programming',
  'Performance',
  'Advanced frontend optimization. Learn performance testing, accessibility, and building fast, efficient web applications.',
  'both',
  376,
  'English',
  2021,
  4.4
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FULL STACK DEVELOPMENT BOOKS
-- ============================================

-- Book 1: Full Stack Foundations
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '33333333-3333-3333-3333-333333333331',
  'Full Stack JavaScript Development',
  'Eric Bush',
  'Programming',
  'Full Stack',
  'Complete guide to full stack development with JavaScript. Learn both frontend and backend with modern tools.',
  'both',
  420,
  'English',
  2021,
  4.5
) ON CONFLICT (id) DO NOTHING;

-- Book 2: MERN Stack
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '33333333-3333-3333-3333-333333333332',
  'Pro MERN Stack: Full Stack Web App Development',
  'Vasan Subramanian',
  'Programming',
  'Full Stack',
  'Build complete web applications with MongoDB, Express, React, and Node.js. Master the MERN stack.',
  'both',
  550,
  'English',
  2022,
  4.6
) ON CONFLICT (id) DO NOTHING;

-- Book 3: Authentication & Security
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Web Security for Developers',
  'Malcolm McDonald',
  'Programming',
  'Security',
  'Essential security practices for full stack developers. Learn authentication, authorization, and protecting web applications.',
  'both',
  390,
  'English',
  2021,
  4.5
) ON CONFLICT (id) DO NOTHING;

-- Book 4: Testing & Deployment
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '33333333-3333-3333-3333-333333333334',
  'Testing JavaScript Applications',
  'Lucas da Costa',
  'Programming',
  'Testing',
  'Comprehensive guide to testing full stack applications. Learn unit testing, integration testing, and E2E testing.',
  'both',
  465,
  'English',
  2022,
  4.4
) ON CONFLICT (id) DO NOTHING;

-- Book 5: GraphQL
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '33333333-3333-3333-3333-333333333335',
  'Learning GraphQL',
  'Eve Porcello & Alex Banks',
  'Programming',
  'API Development',
  'Modern API development with GraphQL. Learn to build flexible, efficient APIs for full stack applications.',
  'both',
  340,
  'English',
  2021,
  4.5
) ON CONFLICT (id) DO NOTHING;

-- Book 6: Advanced Full Stack
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '33333333-3333-3333-3333-333333333336',
  'Architecting Modern Web Applications',
  'Dino Esposito',
  'Programming',
  'Architecture',
  'Advanced full stack architecture patterns. Learn to design scalable, maintainable web applications.',
  'both',
  520,
  'English',
  2022,
  4.6
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DEVOPS & CLOUD BOOKS
-- ============================================

-- Book 1: Docker & Containers
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '44444444-4444-4444-4444-444444444441',
  'Docker Deep Dive',
  'Nigel Poulton',
  'Programming',
  'DevOps',
  'Master Docker and containerization. Learn to build, ship, and run applications in containers.',
  'both',
  380,
  'English',
  2021,
  4.7
) ON CONFLICT (id) DO NOTHING;

-- Book 2: Kubernetes
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '44444444-4444-4444-4444-444444444442',
  'Kubernetes in Action',
  'Marko Luksa',
  'Programming',
  'DevOps',
  'Complete guide to Kubernetes. Learn container orchestration, deployment, and managing cloud-native applications.',
  'both',
  624,
  'English',
  2021,
  4.6
) ON CONFLICT (id) DO NOTHING;

-- Book 3: CI/CD Pipelines
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '44444444-4444-4444-4444-444444444443',
  'Continuous Delivery with Docker and Jenkins',
  'Rafal Leszko',
  'Programming',
  'DevOps',
  'Build automated CI/CD pipelines. Learn continuous integration, deployment, and DevOps best practices.',
  'both',
  340,
  'English',
  2022,
  4.5
) ON CONFLICT (id) DO NOTHING;

-- Book 4: Cloud Platforms
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Cloud Native DevOps with Kubernetes',
  'John Arundel & Justin Domingus',
  'Programming',
  'Cloud Computing',
  'Deploy and manage applications on cloud platforms. Learn AWS, Azure, GCP, and cloud-native architecture.',
  'both',
  450,
  'English',
  2021,
  4.6
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ADD BOOKS TO ROADMAPS
-- ============================================

-- Backend Development Roadmap
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
('c34b63f1-9c4b-4a36-a27a-45c0fd2704ff', '11111111-1111-1111-1111-111111111111', 1, true, 'Start with Node.js fundamentals and design patterns'),
('c34b63f1-9c4b-4a36-a27a-45c0fd2704ff', '11111111-1111-1111-1111-111111111112', 2, true, 'Master database design and SQL/NoSQL'),
('c34b63f1-9c4b-4a36-a27a-45c0fd2704ff', '11111111-1111-1111-1111-111111111113', 3, true, 'Learn RESTful API design and implementation'),
('c34b63f1-9c4b-4a36-a27a-45c0fd2704ff', '11111111-1111-1111-1111-111111111114', 4, false, 'Advanced: Microservices and distributed systems')
ON CONFLICT (learning_path_id, book_id) DO NOTHING;

-- Frontend Development Roadmap
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
('a1bf7e69-f3c1-4950-8968-77b0ba634e54', '22222222-2222-2222-2222-222222222221', 1, true, 'Master HTML5 and CSS3 fundamentals'),
('a1bf7e69-f3c1-4950-8968-77b0ba634e54', '22222222-2222-2222-2222-222222222222', 2, true, 'Learn modern JavaScript and ES6+'),
('a1bf7e69-f3c1-4950-8968-77b0ba634e54', '22222222-2222-2222-2222-222222222223', 3, true, 'Build applications with React'),
('a1bf7e69-f3c1-4950-8968-77b0ba634e54', '22222222-2222-2222-2222-222222222224', 4, false, 'Advanced: Performance and optimization')
ON CONFLICT (learning_path_id, book_id) DO NOTHING;

-- Full Stack Development Roadmap
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
('0a554a2a-f0ff-448a-bf4d-b1727190e478', '33333333-3333-3333-3333-333333333331', 1, true, 'Full stack JavaScript foundations'),
('0a554a2a-f0ff-448a-bf4d-b1727190e478', '33333333-3333-3333-3333-333333333332', 2, true, 'Build with MERN stack'),
('0a554a2a-f0ff-448a-bf4d-b1727190e478', '33333333-3333-3333-3333-333333333333', 3, true, 'Security and authentication'),
('0a554a2a-f0ff-448a-bf4d-b1727190e478', '33333333-3333-3333-3333-333333333334', 4, true, 'Testing strategies'),
('0a554a2a-f0ff-448a-bf4d-b1727190e478', '33333333-3333-3333-3333-333333333335', 5, false, 'Modern APIs with GraphQL'),
('0a554a2a-f0ff-448a-bf4d-b1727190e478', '33333333-3333-3333-3333-333333333336', 6, false, 'Advanced architecture patterns')
ON CONFLICT (learning_path_id, book_id) DO NOTHING;

-- DevOps & Cloud Roadmap
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
('60e7dbb5-f31b-40f8-808a-ada517ef2ca2', '44444444-4444-4444-4444-444444444441', 1, true, 'Master Docker and containerization'),
('60e7dbb5-f31b-40f8-808a-ada517ef2ca2', '44444444-4444-4444-4444-444444444442', 2, true, 'Learn Kubernetes orchestration'),
('60e7dbb5-f31b-40f8-808a-ada517ef2ca2', '44444444-4444-4444-4444-444444444443', 3, true, 'Build CI/CD pipelines'),
('60e7dbb5-f31b-40f8-808a-ada517ef2ca2', '44444444-4444-4444-4444-444444444444', 4, false, 'Cloud platforms and deployment')
ON CONFLICT (learning_path_id, book_id) DO NOTHING;

-- 3. Seed Reading Quiz Questions
-- Step 4: Add quizzes for each programming book
-- Each book gets 5 relevant quiz questions

-- ============================================
-- BACKEND BOOK 1: Node.js Design Patterns
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('11111111-1111-1111-1111-111111111111', 'What is the main advantage of the callback pattern in Node.js?', 
 'Synchronous execution', 'Handling asynchronous operations', 'Better memory management', 'Faster code execution', 
 'B', 'easy'),
 
('11111111-1111-1111-1111-111111111111', 'Which pattern is commonly used to avoid callback hell in Node.js?', 
 'Singleton pattern', 'Factory pattern', 'Promise pattern', 'Observer pattern', 
 'C', 'medium'),
 
('11111111-1111-1111-1111-111111111111', 'What does the Event Emitter pattern allow in Node.js?', 
 'Database connections', 'Publishing and subscribing to events', 'File system access', 'HTTP requests', 
 'B', 'medium'),
 
('11111111-1111-1111-1111-111111111111', 'What is the purpose of streams in Node.js?', 
 'To handle large data efficiently', 'To create databases', 'To manage user sessions', 'To compile code', 
 'A', 'medium'),
 
('11111111-1111-1111-1111-111111111111', 'Which module pattern helps in organizing Node.js code?', 
 'Global variables', 'CommonJS modules', 'Inline scripts', 'HTML templates', 
 'B', 'easy')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- BACKEND BOOK 2: Database Design
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('11111111-1111-1111-1111-111111111112', 'What is the primary purpose of database normalization?', 
 'Increase data redundancy', 'Reduce data redundancy and improve integrity', 'Make queries slower', 'Add more tables', 
 'B', 'medium'),
 
('11111111-1111-1111-1111-111111111112', 'What does ACID stand for in database transactions?', 
 'Atomicity, Consistency, Isolation, Durability', 'Access, Control, Integration, Data', 'Automatic, Consistent, Indexed, Distributed', 'All, Create, Insert, Delete', 
 'A', 'medium'),
 
('11111111-1111-1111-1111-111111111112', 'Which type of relationship connects two tables where one record relates to many?', 
 'One-to-One', 'One-to-Many', 'Many-to-Many', 'None-to-None', 
 'B', 'easy'),
 
('11111111-1111-1111-1111-111111111112', 'What is an index in a database?', 
 'A backup file', 'A data structure that improves query speed', 'A type of table', 'A user permission', 
 'B', 'easy'),
 
('11111111-1111-1111-1111-111111111112', 'What is the main difference between SQL and NoSQL databases?', 
 'SQL is newer', 'SQL uses structured schemas, NoSQL is more flexible', 'NoSQL is always faster', 'SQL cannot scale', 
 'B', 'medium')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- BACKEND BOOK 3: RESTful API Design
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('11111111-1111-1111-1111-111111111113', 'What does REST stand for?', 
 'Remote Execution Service Technology', 'Representational State Transfer', 'Rapid Execution State Transfer', 'Resource Execution System Transfer', 
 'B', 'easy'),
 
('11111111-1111-1111-1111-111111111113', 'Which HTTP method is used to update a resource in REST?', 
 'GET', 'POST', 'PUT or PATCH', 'DELETE', 
 'C', 'easy'),
 
('11111111-1111-1111-1111-111111111113', 'What is the recommended way to version a REST API?', 
 'Never version APIs', 'Include version in URL or headers', 'Use different domains', 'Change port numbers', 
 'B', 'medium'),
 
('11111111-1111-1111-1111-111111111113', 'What is JWT commonly used for in REST APIs?', 
 'Database queries', 'Authentication and authorization', 'File uploads', 'Email sending', 
 'B', 'medium'),
 
('11111111-1111-1111-1111-111111111113', 'What HTTP status code indicates a successful resource creation?', 
 '200 OK', '201 Created', '204 No Content', '301 Moved Permanently', 
 'B', 'easy')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- BACKEND BOOK 4: Microservices
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('11111111-1111-1111-1111-111111111114', 'What is the main benefit of microservices architecture?', 
 'Single deployment', 'Independent scaling and deployment of services', 'Simpler codebase', 'Fewer servers needed', 
 'B', 'medium'),
 
('11111111-1111-1111-1111-111111111114', 'How do microservices typically communicate?', 
 'Shared database', 'HTTP/REST or message queues', 'Direct function calls', 'Shared memory', 
 'B', 'medium'),
 
('11111111-1111-1111-1111-111111111114', 'What is service discovery in microservices?', 
 'Finding bugs in services', 'Automatically locating service instances', 'Creating new services', 'Deleting old services', 
 'B', 'hard'),
 
('11111111-1111-1111-1111-111111111114', 'What pattern helps handle failures in microservices?', 
 'Singleton pattern', 'Circuit breaker pattern', 'Factory pattern', 'Observer pattern', 
 'B', 'hard'),
 
('11111111-1111-1111-1111-111111111114', 'What is API Gateway in microservices?', 
 'A database', 'A single entry point for client requests', 'A testing tool', 'A deployment server', 
 'B', 'medium')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- FRONTEND BOOK 1: HTML & CSS
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('22222222-2222-2222-2222-222222222221', 'What does HTML stand for?', 
 'Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 
 'A', 'easy'),
 
('22222222-2222-2222-2222-222222222221', 'Which CSS property is used for responsive design?', 
 'font-size', 'media queries', 'color', 'border', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222221', 'What is the purpose of semantic HTML?', 
 'Make pages colorful', 'Provide meaning to content structure', 'Speed up loading', 'Reduce file size', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222221', 'Which CSS layout is best for responsive grids?', 
 'Tables', 'Floats', 'CSS Grid or Flexbox', 'Inline styles', 
 'C', 'medium'),
 
('22222222-2222-2222-2222-222222222221', 'What is the box model in CSS?', 
 'A 3D rendering technique', 'Content, padding, border, and margin', 'A JavaScript framework', 'A database structure', 
 'B', 'easy')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- FRONTEND BOOK 2: JavaScript
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('22222222-2222-2222-2222-222222222222', 'What is the difference between let and const?', 
 'No difference', 'let can be reassigned, const cannot', 'const is faster', 'let is for numbers only', 
 'B', 'easy'),
 
('22222222-2222-2222-2222-222222222222', 'What is a closure in JavaScript?', 
 'A loop structure', 'A function with access to outer scope variables', 'A CSS property', 'A database connection', 
 'B', 'hard'),
 
('22222222-2222-2222-2222-222222222222', 'What does async/await do in JavaScript?', 
 'Makes code run faster', 'Simplifies asynchronous code', 'Creates animations', 'Manages databases', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222222', 'What is the purpose of the spread operator (...)?', 
 'Multiply numbers', 'Expand arrays or objects', 'Create comments', 'Delete variables', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222222', 'What is event delegation in JavaScript?', 
 'Deleting events', 'Handling events on parent elements for child elements', 'Creating new events', 'Preventing all events', 
 'B', 'hard')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- FRONTEND BOOK 3: React
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('22222222-2222-2222-2222-222222222223', 'What is JSX in React?', 
 'A database', 'JavaScript XML syntax extension', 'A CSS framework', 'A testing library', 
 'B', 'easy'),
 
('22222222-2222-2222-2222-222222222223', 'What is the purpose of useState hook?', 
 'Fetch data', 'Manage component state', 'Style components', 'Route pages', 
 'B', 'easy'),
 
('22222222-2222-2222-2222-222222222223', 'When does useEffect run?', 
 'Never', 'After render and on dependency changes', 'Before render', 'Only once', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222223', 'What is prop drilling in React?', 
 'A debugging tool', 'Passing props through multiple component levels', 'Creating holes in components', 'Deleting props', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222223', 'What is the Virtual DOM?', 
 'A real DOM', 'A lightweight copy of the DOM for efficient updates', 'A database', 'A server', 
 'B', 'medium')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- FRONTEND BOOK 4: Performance
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('22222222-2222-2222-2222-222222222224', 'What is lazy loading?', 
 'Slow internet', 'Loading resources only when needed', 'A CSS property', 'A database technique', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222224', 'What does code splitting achieve?', 
 'Breaks the code', 'Reduces initial bundle size', 'Adds more files', 'Slows down the app', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222224', 'What is the purpose of a CDN?', 
 'Store databases', 'Deliver content from geographically closer servers', 'Write code', 'Test applications', 
 'B', 'easy'),
 
('22222222-2222-2222-2222-222222222224', 'What is tree shaking in JavaScript?', 
 'Animating trees', 'Removing unused code from bundles', 'A data structure', 'A testing method', 
 'B', 'hard'),
 
('22222222-2222-2222-2222-222222222224', 'What metric measures time to interactive?', 
 'FPS', 'TTI (Time to Interactive)', 'RAM usage', 'CPU speed', 
 'B', 'medium')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- FULLSTACK BOOK 1: Full Stack JavaScript
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('33333333-3333-3333-3333-333333333331', 'What does full stack development mean?', 
 'Only backend', 'Both frontend and backend development', 'Only databases', 'Only design', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333331', 'Which language is used throughout the full JavaScript stack?', 
 'Python', 'JavaScript', 'Java', 'C++', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333331', 'What is the role of Express.js in full stack?', 
 'Frontend framework', 'Backend web framework', 'Database', 'CSS library', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333331', 'What is middleware in Express?', 
 'A database', 'Functions that process requests before reaching routes', 'A frontend component', 'A testing tool', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333331', 'What is CORS in web development?', 
 'A database', 'Cross-Origin Resource Sharing for API access', 'A CSS framework', 'A JavaScript library', 
 'B', 'medium')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- FULLSTACK BOOK 2: MERN Stack
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('33333333-3333-3333-3333-333333333332', 'What does MERN stand for?', 
 'MySQL, Express, React, Node', 'MongoDB, Express, React, Node', 'MongoDB, Ember, Ruby, Node', 'MySQL, Express, Ruby, Node', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333332', 'What type of database is MongoDB?', 
 'SQL', 'NoSQL document database', 'Graph database', 'Key-value store', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333332', 'What is Mongoose in MERN stack?', 
 'A React library', 'MongoDB ODM (Object Data Modeling)', 'A CSS framework', 'A testing tool', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333332', 'How does React communicate with Express backend?', 
 'Direct database access', 'HTTP requests (fetch/axios)', 'Shared files', 'WebSockets only', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333332', 'What is the purpose of environment variables in MERN?', 
 'Style the app', 'Store configuration and secrets', 'Create components', 'Test the app', 
 'B', 'medium')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- FULLSTACK BOOK 3: Security
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('33333333-3333-3333-3333-333333333333', 'What is XSS (Cross-Site Scripting)?', 
 'A CSS framework', 'Injecting malicious scripts into web pages', 'A database attack', 'A server error', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333333', 'What does HTTPS provide?', 
 'Faster loading', 'Encrypted communication', 'Better SEO only', 'More storage', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333333', 'What is SQL injection?', 
 'A database feature', 'Malicious SQL code inserted into queries', 'A performance optimization', 'A testing method', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333333', 'What is the purpose of password hashing?', 
 'Make passwords longer', 'Store passwords securely', 'Speed up login', 'Reduce database size', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333333', 'What is CSRF (Cross-Site Request Forgery)?', 
 'A CSS bug', 'Unauthorized commands from a trusted user', 'A JavaScript error', 'A database issue', 
 'B', 'hard')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- FULLSTACK BOOK 4: Testing
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('33333333-3333-3333-3333-333333333334', 'What is unit testing?', 
 'Testing the entire app', 'Testing individual functions or components', 'Testing databases', 'Testing servers', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333334', 'What is the purpose of integration testing?', 
 'Test individual functions', 'Test how components work together', 'Test user interface only', 'Test databases only', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333334', 'What is Jest commonly used for?', 
 'Database management', 'JavaScript testing', 'CSS styling', 'Server deployment', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333334', 'What does TDD stand for?', 
 'Test Driven Development', 'Total Database Design', 'Technical Documentation Development', 'Time Delayed Deployment', 
 'A', 'medium'),
 
('33333333-3333-3333-3333-333333333334', 'What is mocking in testing?', 
 'Making fun of code', 'Creating fake objects to simulate behavior', 'Deleting tests', 'Running tests slowly', 
 'B', 'medium')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- FULLSTACK BOOK 5: GraphQL
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('33333333-3333-3333-3333-333333333335', 'What is GraphQL?', 
 'A database', 'A query language for APIs', 'A CSS framework', 'A JavaScript library', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333335', 'What advantage does GraphQL have over REST?', 
 'Faster servers', 'Clients can request exactly the data they need', 'Easier to learn', 'No authentication needed', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333335', 'What is a GraphQL schema?', 
 'A database table', 'Definition of types and operations available', 'A CSS file', 'A testing framework', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333335', 'What are resolvers in GraphQL?', 
 'Database connections', 'Functions that fetch data for fields', 'CSS properties', 'Testing tools', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333335', 'What is a GraphQL mutation?', 
 'Reading data', 'Modifying data (create, update, delete)', 'Styling components', 'Testing queries', 
 'B', 'easy')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- FULLSTACK BOOK 6: Architecture
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('33333333-3333-3333-3333-333333333336', 'What is MVC architecture?', 
 'Model View Controller pattern', 'Multiple Version Control', 'Modern Visual Components', 'Managed Virtual Containers', 
 'A', 'medium'),
 
('33333333-3333-3333-3333-333333333336', 'What is the purpose of a service layer?', 
 'Style the UI', 'Separate business logic from controllers', 'Store data', 'Test the app', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333336', 'What is dependency injection?', 
 'Adding more dependencies', 'Providing dependencies from outside rather than creating them internally', 'Removing dependencies', 'Testing dependencies', 
 'B', 'hard'),
 
('33333333-3333-3333-3333-333333333336', 'What is the repository pattern?', 
 'A Git feature', 'Abstraction layer between data access and business logic', 'A CSS pattern', 'A testing pattern', 
 'B', 'hard'),
 
('33333333-3333-3333-3333-333333333336', 'What is horizontal scaling?', 
 'Making servers taller', 'Adding more servers to handle load', 'Upgrading existing servers', 'Reducing server count', 
 'B', 'medium')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- DEVOPS BOOK 1: Docker
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('44444444-4444-4444-4444-444444444441', 'What is Docker?', 
 'A database', 'A containerization platform', 'A programming language', 'A web framework', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444441', 'What is a Docker image?', 
 'A photo', 'A template for creating containers', 'A database backup', 'A CSS file', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444441', 'What is the difference between an image and a container?', 
 'No difference', 'Image is template, container is running instance', 'Container is bigger', 'Image runs faster', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444441', 'What is a Dockerfile?', 
 'A text document', 'Instructions to build a Docker image', 'A database file', 'A log file', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444441', 'What is Docker Compose used for?', 
 'Writing code', 'Defining and running multi-container applications', 'Testing images', 'Deleting containers', 
 'B', 'medium')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- DEVOPS BOOK 2: Kubernetes
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('44444444-4444-4444-4444-444444444442', 'What is Kubernetes?', 
 'A database', 'Container orchestration platform', 'A programming language', 'A web server', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444442', 'What is a Pod in Kubernetes?', 
 'A database', 'Smallest deployable unit containing one or more containers', 'A server', 'A network', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444442', 'What is a Kubernetes Service?', 
 'A container', 'An abstraction to expose applications running on Pods', 'A database', 'A file system', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444442', 'What is kubectl?', 
 'A database', 'Command-line tool for Kubernetes', 'A programming language', 'A web framework', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444442', 'What is a Deployment in Kubernetes?', 
 'A server', 'Manages desired state for Pods and ReplicaSets', 'A database', 'A network', 
 'B', 'medium')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- DEVOPS BOOK 3: CI/CD
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('44444444-4444-4444-4444-444444444443', 'What does CI/CD stand for?', 
 'Code Integration/Code Deployment', 'Continuous Integration/Continuous Deployment', 'Container Integration/Container Delivery', 'Cloud Integration/Cloud Deployment', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444443', 'What is the main benefit of CI/CD?', 
 'Slower releases', 'Automated testing and deployment', 'More manual work', 'Larger teams needed', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444443', 'What is Jenkins?', 
 'A database', 'An automation server for CI/CD', 'A programming language', 'A web framework', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444443', 'What is a pipeline in CI/CD?', 
 'A water pipe', 'Automated sequence of stages for building and deploying', 'A database connection', 'A network cable', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444443', 'What is blue-green deployment?', 
 'Colorful servers', 'Running two identical environments for zero-downtime deployment', 'A testing strategy', 'A database backup', 
 'B', 'hard')
ON CONFLICT (book_id, question) DO NOTHING;

-- ============================================
-- DEVOPS BOOK 4: Cloud Platforms
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('44444444-4444-4444-4444-444444444444', 'What is cloud computing?', 
 'Weather prediction', 'Delivering computing services over the internet', 'A database', 'A programming language', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444444', 'What does IaaS stand for?', 
 'Internet as a Service', 'Infrastructure as a Service', 'Integration as a Service', 'Installation as a Service', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444444', 'What is serverless computing?', 
 'No servers exist', 'Cloud provider manages servers, you focus on code', 'Servers are free', 'Servers are slower', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444444', 'What is auto-scaling in cloud?', 
 'Manual server management', 'Automatically adjusting resources based on demand', 'Fixed server count', 'Deleting servers', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444444', 'What is a load balancer?', 
 'A database', 'Distributes traffic across multiple servers', 'A programming tool', 'A testing framework', 
 'B', 'easy')
ON CONFLICT (book_id, question) DO NOTHING;

-- ==============================================================================
-- SECTION 8: ADMIN SETUP INSTRUCTIONS
-- ==============================================================================
-- To promote any user account to Administrator:
--
-- 1. Sign up on the app or create a user in Supabase Auth (Authentication -> Users)
-- 2. Run the query below with your registered email:
--
--    UPDATE public.profiles
--    SET is_admin = true
--    WHERE email = 'your-email@example.com';
--
-- 3. Verify admin status:
--    SELECT id, email, full_name, is_admin FROM public.profiles WHERE is_admin = true;
-- ==============================================================================
