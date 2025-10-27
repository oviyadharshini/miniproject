/*
  # Create Diagnosis History Table

  1. New Tables
    - `diagnosis_history`
      - `id` (uuid, primary key) - Unique identifier for each diagnosis
      - `created_at` (timestamptz) - Timestamp of when diagnosis was performed
      - `symptoms` (text) - User-provided symptoms description
      - `disease` (text) - Predicted disease name
      - `confidence` (integer) - Confidence percentage (0-100)
      - `image_url` (text, optional) - URL to stored image if needed for future reference
      - `session_id` (text) - Browser session identifier for tracking user's diagnosis history

  2. Security
    - Enable RLS on `diagnosis_history` table
    - Add policy allowing anyone to insert their own diagnosis records
    - Add policy allowing users to read their own diagnosis history based on session_id
    - This enables functionality without requiring authentication

  3. Indexes
    - Add index on session_id for faster query performance
    - Add index on created_at for chronological ordering

  4. Notes
    - Table stores diagnosis history for tracking and reference
    - Uses session_id instead of user_id to work without authentication
    - Confidence stored as integer (percentage)
*/

CREATE TABLE IF NOT EXISTS diagnosis_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  symptoms text NOT NULL,
  disease text NOT NULL,
  confidence integer NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  image_url text,
  session_id text NOT NULL
);

ALTER TABLE diagnosis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert diagnosis records"
  ON diagnosis_history
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read own diagnosis history"
  ON diagnosis_history
  FOR SELECT
  TO anon
  USING (session_id = current_setting('request.headers', true)::json->>'x-session-id');

CREATE INDEX IF NOT EXISTS idx_diagnosis_history_session_id 
  ON diagnosis_history(session_id);

CREATE INDEX IF NOT EXISTS idx_diagnosis_history_created_at 
  ON diagnosis_history(created_at DESC);
