# Student-Admin Portal Setup Guide

## Overview

This is a comprehensive student-admin web application built with Next.js 16, Supabase, and Vercel Blob storage. It allows admins to manage students, create assignments and exams, track submissions, and communicate with students.

## Features

### Student Features
- ✅ User authentication (login/signup)
- ✅ Profile management (full name, school, GitHub link)
- ✅ View assignments and due dates
- ✅ Submit assignment files
- ✅ View grades and feedback
- ✅ Read announcements
- ✅ Real-time chat with admin (coming soon)
- ✅ View exam schedules (coming soon)
- ✅ Take exams (coming soon)

### Admin Features
- ✅ User authentication (admin signup)
- ✅ Student management dashboard
- ✅ Reset student passwords
- ✅ Create and manage assignments
- ✅ Create and manage exams
- ✅ Track assignment submissions
- ✅ Grade submissions with feedback
- ✅ Post announcements
- ✅ View student performance reports (coming soon)
- ✅ Real-time chat with students (coming soon)
- ✅ Print performance reports (coming soon)

## Technology Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (session-based)
- **File Storage**: Vercel Blob
- **Real-time Chat**: Coming soon (WebSocket)

## Database Schema

### Core Tables

1. **users** - Extended user profiles
   - Stores: username, full_name, school_name, github_link, is_admin, profile info

2. **assignments** - Assignment metadata
   - Stores: title, description, due_date, created by admin_id

3. **submissions** - Student assignment submissions
   - Stores: assignment_id, student_id, file_url, marks, feedback, status

4. **exams** - Exam metadata
   - Stores: title, description, duration, total_marks, scheduled_at

5. **exam_questions** - Questions within exams
   - Stores: question_text, type (multiple_choice, short_answer, essay), marks, options, correct_answer

6. **exam_attempts** - Student exam attempts
   - Stores: exam_id, student_id, started_at, submitted_at, total_marks

7. **exam_answers** - Student answers to exam questions
   - Stores: exam_attempt_id, question_id, answer_text, marks_awarded

8. **announcements** - Admin announcements
   - Stores: title, content, created by admin_id

9. **chat_messages** - Messages between students and admins
   - Stores: sender_id, receiver_id, message, is_read, created_at

10. **performance_logs** - Performance tracking
    - Stores: student_id, assignment_id/exam_id, marks_obtained, total_marks

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Supabase (from project settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
POSTGRES_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...

# Vercel Blob (from Vercel project settings)
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Setup

The database schema will be created via Supabase. Execute the SQL in `lib/database.sql`:

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Paste the contents of `lib/database.sql`
4. Execute

This creates:
- 10 tables with proper relationships
- Row Level Security (RLS) policies for data protection
- Trigger function for auto-creating user profiles on signup

### 3. Running the Application

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
pnpm start
```

The app will be available at `http://localhost:3000`

## User Flows

### Student Registration & Login

1. **Sign Up**: Go to `/auth/sign-up`
   - Fill in: Email, Username, Full Name, School Name
   - Optional: Check "I am an instructor/admin" if admin
   - Submit to create account

2. **Login**: Go to `/auth/login`
   - Enter email and password
   - Redirects to `/dashboard/student` for students
   - Redirects to `/dashboard/admin` for admins

3. **Profile Management**: `/dashboard/student/profile`
   - Edit full name, school, GitHub link
   - View email and username (read-only)

### Student Assignment Workflow

1. **View Assignments**: Dashboard shows pending assignments
2. **Submit Work**: Click assignment → upload file → submit
3. **Track Status**: View submission status and marks
4. **View Feedback**: After admin grades, see marks and feedback

### Admin Management

1. **Manage Students**: `/dashboard/admin/students`
   - View all students
   - Reset student passwords (sets to `Password123!`)
   - View individual student details

2. **Create Assignment**: `/dashboard/admin/assignments`
   - Add title, description, due date
   - Students can then submit work

3. **Grade Submissions**:
   - View pending submissions
   - Add marks and feedback
   - Mark as complete

4. **Manage Exams**: `/dashboard/admin/exams` (coming soon)
   - Create exams with questions
   - Set duration and total marks
   - View student attempts and scores

5. **Announcements**: `/dashboard/admin/announcements`
   - Post updates visible to all students

6. **Performance Reports**: `/dashboard/admin/performance`
   - View individual student performance
   - View all students comparison
   - Print reports

## API Routes

### Authentication
- `POST /api/auth/*` - Handled via Server Actions

### Profiles
- `PUT /api/profile/update` - Update user profile

### Submissions
- `POST /api/submissions/upload` - Upload assignment submission

### Admin
- `POST /api/admin/reset-password` - Reset student password

## Password Reset for Students

**Feature**: Admin-controlled password reset

When a student forgets their password:
1. Admin goes to Students list
2. Clicks "Reset Pwd" button next to student
3. Student's password is reset to `Password123!`
4. Admin can share this with the student
5. Student logs in and should change password

This is shown in the API endpoint: `/api/admin/reset-password`

## Real-time Features (Coming Soon)

### Chat with WebSocket
- Students can initiate chat with admins
- Admins can message students
- Real-time message delivery
- Read status indicators

## Security Features

### Row Level Security (RLS)
- Students can only access their own data
- Admins can access all data
- Database-level enforcement

### Authentication
- Supabase Auth with session cookies
- Secure password hashing
- Protected routes via middleware

### File Uploads
- Files stored in Vercel Blob (private)
- Only accessible by student and admin
- Automatic cleanup policies

## Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Import to Vercel
# Select your GitHub repo
# Add environment variables in Vercel Settings → Environment Variables
# Deploy!
```

Environment variables needed on Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `BLOB_READ_WRITE_TOKEN`

## Default Credentials

### Test Admin Account

After setup, create an admin account:
1. Go to `/auth/sign-up`
2. Enter admin email and password
3. Check "I am an instructor/admin"
4. You can now manage the portal

### Default Reset Password

When admin resets a student password, it becomes: `Password123!`

## Troubleshooting

### "Your project's URL and Key are required"

**Solution**: 
- Check that Supabase integration is connected in v0
- Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- In Vercel project settings → Environment Variables

### "Can't resolve @supabase/ssr"

**Solution**:
```bash
pnpm add @supabase/ssr
```

### Database Schema Not Created

**Solution**:
1. Go to Supabase Dashboard
2. SQL Editor → New Query
3. Copy contents of `lib/database.sql`
4. Execute the full script
5. Verify tables appear in Table Editor

### File Upload Not Working

**Solution**:
- Ensure Vercel Blob is connected
- Check `BLOB_READ_WRITE_TOKEN` environment variable is set
- File size limits apply (default 100MB)

## File Structure

```
/app
  /api                 # API routes for backend operations
  /actions            # Server Actions for auth/forms
  /auth               # Authentication pages (login, signup, callback)
  /dashboard          # Protected dashboard routes
    /admin            # Admin-only pages
    /student          # Student-only pages
/components
  /admin              # Admin-specific components
  /student            # Student-specific components
  /ui                 # shadcn/ui components
/lib
  /supabase           # Supabase client/server setup
  api-utils.ts        # Database query utilities
  database.sql        # Database schema
/middleware.ts        # Session management
```

## Next Steps

1. **Complete Real-time Chat**: Add WebSocket implementation in `/dashboard/*/chat`
2. **Exam System**: Implement exam taking and auto-grading
3. **Performance Analytics**: Build detailed performance reports with charts
4. **Print Reports**: Add PDF export for performance reports
5. **Email Notifications**: Send emails for grade updates and announcements
6. **Attendance Tracking**: Track student activity and participation
7. **Mobile App**: Build React Native mobile version

## Support

For issues, check:
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Blob Docs: https://vercel.com/docs/storage/vercel-blob
