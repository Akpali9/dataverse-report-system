import { createClient } from '@/lib/supabase/server'

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Get current user profile from database
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * Check if current user is admin
 */
export async function isUserAdmin() {
  const profile = await getCurrentUserProfile()
  return profile?.is_admin ?? false
}

/**
 * Get all students (admin only)
 */
export async function getAllStudents() {
  const supabase = await createClient()
  const { data: students } = await supabase
    .from('users')
    .select('*')
    .eq('is_admin', false)
    .order('created_at', { ascending: false })

  return students || []
}

/**
 * Get student by ID (admin only)
 */
export async function getStudentById(studentId: string) {
  const supabase = await createClient()
  const { data: student } = await supabase
    .from('users')
    .select('*')
    .eq('id', studentId)
    .eq('is_admin', false)
    .single()

  return student
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

/**
 * Reset user password to default (admin only)
 */
export async function resetUserPassword(userId: string, newPassword: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  })

  return { data, error }
}

/**
 * Get all assignments (created by specific admin)
 */
export async function getAdminAssignments(adminId: string) {
  const supabase = await createClient()
  const { data: assignments } = await supabase
    .from('assignments')
    .select('*')
    .eq('admin_id', adminId)
    .order('created_at', { ascending: false })

  return assignments || []
}

/**
 * Get all assignments for student view
 */
export async function getStudentAssignments() {
  const supabase = await createClient()
  const { data: assignments } = await supabase
    .from('assignments')
    .select('*')
    .order('due_date', { ascending: true })

  return assignments || []
}

/**
 * Get assignment submissions for admin
 */
export async function getAssignmentSubmissions(assignmentId: string) {
  const supabase = await createClient()
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*, users(full_name, username)')
    .eq('assignment_id', assignmentId)
    .order('submission_date', { ascending: false })

  return submissions || []
}

/**
 * Get student submission for specific assignment
 */
export async function getStudentSubmission(
  assignmentId: string,
  studentId: string
) {
  const supabase = await createClient()
  const { data: submission } = await supabase
    .from('submissions')
    .select('*')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .single()

  return submission
}

/**
 * Get all exams by admin
 */
export async function getAdminExams(adminId: string) {
  const supabase = await createClient()
  const { data: exams } = await supabase
    .from('exams')
    .select('*')
    .eq('admin_id', adminId)
    .order('scheduled_at', { ascending: true })

  return exams || []
}

/**
 * Get exam questions
 */
export async function getExamQuestions(examId: string) {
  const supabase = await createClient()
  const { data: questions } = await supabase
    .from('exam_questions')
    .select('*')
    .eq('exam_id', examId)
    .order('display_order', { ascending: true })

  return questions || []
}

/**
 * Get exam attempts for admin view
 */
export async function getExamAttempts(examId: string) {
  const supabase = await createClient()
  const { data: attempts } = await supabase
    .from('exam_attempts')
    .select('*, users(full_name, username)')
    .eq('exam_id', examId)
    .order('started_at', { ascending: false })

  return attempts || []
}

/**
 * Get student exam attempt
 */
export async function getStudentExamAttempt(examId: string, studentId: string) {
  const supabase = await createClient()
  const { data: attempt } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('exam_id', examId)
    .eq('student_id', studentId)
    .single()

  return attempt
}

/**
 * Get announcements
 */
export async function getAnnouncements(limit = 50) {
  const supabase = await createClient()
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*, users(full_name)')
    .order('created_at', { ascending: false })
    .limit(limit)

  return announcements || []
}

/**
 * Get student performance
 */
export async function getStudentPerformance(studentId: string) {
  const supabase = await createClient()
  const { data: performance } = await supabase
    .from('performance_logs')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  return performance || []
}

/**
 * Get chat messages between user and another user
 */
export async function getChatMessages(userId: string, otherUserId: string) {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('*')
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
    )
    .order('created_at', { ascending: true })

  return messages || []
}

/**
 * Get all unique conversations for a user
 */
export async function getUserConversations(userId: string) {
  const supabase = await createClient()
  
  // Get all messages where user is sender or receiver
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('sender_id, receiver_id')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (!messages) return []

  // Get unique user IDs from conversations
  const userIds = new Set<string>()
  messages.forEach((msg: any) => {
    if (msg.sender_id !== userId) userIds.add(msg.sender_id)
    if (msg.receiver_id !== userId) userIds.add(msg.receiver_id)
  })

  // Fetch user profiles
  const userIdsArray = Array.from(userIds)
  if (userIdsArray.length === 0) return []

  const { data: users } = await supabase
    .from('users')
    .select('*')
    .in('id', userIdsArray)

  return users || []
}
