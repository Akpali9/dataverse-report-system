-- ============================================================
-- STUDENT-ADMIN PORTAL DATABASE SETUP
-- ============================================================

-- Create trigger function to create user profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    username,
    full_name,
    is_admin,
    school_name,
    github_link
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'username', new.email),
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((new.raw_user_meta_data ->> 'is_admin')::boolean, false),
    COALESCE(new.raw_user_meta_data ->> 'school_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'github_link', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- USERS TABLE RLS
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all user profiles" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ASSIGNMENTS TABLE RLS
CREATE POLICY "Admins can create assignments" ON public.assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Everyone can view assignments" ON public.assignments
  FOR SELECT USING (true);

CREATE POLICY "Admins can update their own assignments" ON public.assignments
  FOR UPDATE USING (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete their own assignments" ON public.assignments
  FOR DELETE USING (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

-- SUBMISSIONS TABLE RLS
CREATE POLICY "Students can submit their own work" ON public.submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can view their own submissions" ON public.submissions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admins can view all submissions" ON public.submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Students can update their own submissions" ON public.submissions
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "Admins can mark submissions" ON public.submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

-- EXAMS TABLE RLS
CREATE POLICY "Admins can create exams" ON public.exams
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Everyone can view exams" ON public.exams
  FOR SELECT USING (true);

CREATE POLICY "Admins can update their own exams" ON public.exams
  FOR UPDATE USING (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

-- EXAM QUESTIONS RLS
CREATE POLICY "Everyone can view exam questions" ON public.exam_questions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage exam questions" ON public.exam_questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

-- EXAM ATTEMPTS RLS
CREATE POLICY "Students can start exam attempts" ON public.exam_attempts
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can view their own attempts" ON public.exam_attempts
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admins can view all attempts" ON public.exam_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Students can update their own attempts" ON public.exam_attempts
  FOR UPDATE USING (student_id = auth.uid());

-- EXAM ANSWERS RLS
CREATE POLICY "Students can submit their answers" ON public.exam_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exam_attempts
      WHERE id = exam_attempt_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own answers" ON public.exam_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.exam_attempts
      WHERE id = exam_attempt_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all answers" ON public.exam_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ANNOUNCEMENTS TABLE RLS
CREATE POLICY "Admins can create announcements" ON public.announcements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Everyone can view announcements" ON public.announcements
  FOR SELECT USING (true);

CREATE POLICY "Admins can update their own announcements" ON public.announcements
  FOR UPDATE USING (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

-- CHAT MESSAGES TABLE RLS
CREATE POLICY "Users can insert messages they send" ON public.chat_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can view messages they sent or received" ON public.chat_messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can update messages they sent" ON public.chat_messages
  FOR UPDATE USING (sender_id = auth.uid());

-- PERFORMANCE LOGS TABLE RLS
CREATE POLICY "Students can view their own performance" ON public.performance_logs
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admins can view all performance logs" ON public.performance_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Auto-insert performance logs" ON public.performance_logs
  FOR INSERT WITH CHECK (true);
