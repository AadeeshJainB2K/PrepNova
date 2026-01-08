-- Create mock test tables with snake_case naming to match schema

CREATE TABLE IF NOT EXISTS mock_questions (
  id text PRIMARY KEY,
  exam_id text NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  subject text NOT NULL,
  topic text NOT NULL,
  question text NOT NULL,
  options text NOT NULL,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  difficulty text NOT NULL,
  question_type text NOT NULL,
  is_ai_generated boolean NOT NULL DEFAULT false,
  based_on_year integer,
  tags text,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mock_test_sessions (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  exam_id text NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  difficulty text NOT NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL DEFAULT 0,
  score numeric(5,2),
  time_spent integer,
  status text NOT NULL DEFAULT 'in_progress',
  started_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp
);

CREATE TABLE IF NOT EXISTS user_progress (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  exam_id text NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_id text NOT NULL REFERENCES mock_questions(id) ON DELETE CASCADE,
  user_answer text NOT NULL,
  is_correct boolean NOT NULL,
  time_spent integer,
  attempted_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mock_questions (
  id text PRIMARY KEY,
  exam_id text NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  subject text NOT NULL,
  topic text NOT NULL,
  question text NOT NULL,
  options text NOT NULL,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  difficulty text NOT NULL,
  question_type text NOT NULL,
  is_ai_generated boolean NOT NULL DEFAULT false,
  based_on_year integer,
  tags text,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_exam_preferences (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  exam_id text NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  target_year integer NOT NULL,
  preferred_difficulty text DEFAULT 'Medium',
  target_rank integer,
  target_college text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exam_timelines (
  id text PRIMARY KEY,
  exam_id text NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_name text NOT NULL,
  start_date timestamp,
  end_date timestamp,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS study_groups (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  exam_id text NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  created_by text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  max_members integer NOT NULL DEFAULT 10,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS study_group_members (
  id text PRIMARY KEY,
  group_id text NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  description text,
  icon_url text,
  earned_at timestamp NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mock_test_sessions_user_id ON mock_test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_questions_exam_id ON mock_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_user_exam_preferences_user_id ON user_exam_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_timelines_exam_id ON exam_timelines(exam_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_user_id ON study_group_members(user_id);
