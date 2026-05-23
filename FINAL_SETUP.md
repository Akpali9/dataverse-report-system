# Student-Admin Portal - Final Setup Guide

## Overview
A complete student-admin portal built with Next.js 16, Supabase, and Vercel Blob.

## User Roles & Access

### Students
- **Registration**: Self-register via `/auth/sign-up`
- **Required Fields**: Username, Full Name, Password, School (optional)
- **Login**: Username + Password at `/auth/login`
- **Features**: View assignments, submit work, take exams, view grades, chat with instructor

### Instructors/Admins
- **Default Admin**: `admin` / `Admin@123` (created via setup endpoint)
- **Registration**: Self-register via `/auth/admin-register`
- **Required Fields**: Email, Username, Full Name, Password
- **Login**: Username + Password at `/auth/login`
- **Features**: Create assignments/exams, grade work, manage students, view performance reports, post announcements

## Authentication Flow

### 1. First-Time Setup
```bash
# Call this endpoint to create the default admin account
POST /api/setup/create-default-admin
```

### 2. Student Registration
- Navigate to `/auth/sign-up`
- Fill in: Username, Full Name, School (optional), Password
- Email is auto-generated (not required from student)
- Redirects to success page after signup

### 3. Instructor Registration
- Navigate to `/auth/admin-register`
- Fill in: Email, Username, Full Name, Password
- Email is required for instructor accounts
- Account created with `is_admin: true`

### 4. Login for Both
- Navigate to `/auth/login`
- Enter: Username, Password
- System finds email from username and authenticates
- Redirects to appropriate dashboard (student or admin)

## Database Schema

### Core Tables
- **users**: Student/instructor profiles (extends auth.users)
- **assignments**: Assignment tasks created by instructors
- **submissions**: Student assignment submissions with grades
- **exams**: Test/exam definitions
- **exam_questions**: Individual exam questions
- **exam_attempts**: Student exam attempts and results
- **exam_answers**: Student answers to exam questions
- **announcements**: Important messages from instructors
- **chat_messages**: Direct messages between students and instructors
- **performance_logs**: Grades and performance tracking

### Key Fields
- `users.username`: UNIQUE, required for login
- `users.is_admin`: Boolean, determines role (true = instructor)
- `submissions.marked`: Boolean, indicates if graded
- `submissions.marks`: DECIMAL(5,2), numeric grade
- `submissions.feedback`: TEXT, instructor feedback

## API Endpoints

### Student Endpoints
- `POST /api/profile/update` - Update student profile
- `POST /api/submissions/upload` - Upload assignment file

### Admin Endpoints
- `GET /api/admin/students` - List all students
- `POST /api/admin/reset-password` - Reset student password to default
- `GET /api/admin/students` - Manage students
- `POST /api/setup/create-default-admin` - Create default admin account

## Security Features

1. **Row Level Security (RLS)**: Database-level access control
2. **Role-Based Access**: Admin/Student separation
3. **Password Hashing**: Supabase handles bcrypt hashing
4. **Session Management**: HTTP-only cookies with secure tokens
5. **File Security**: Assignment files stored in private Vercel Blob storage

## Default Credentials

**Admin Account**
- Username: `admin`
- Password: `Admin@123`

*Note: Call `/api/setup/create-default-admin` to initialize this account on first deployment*

## Deployment Checklist

- [ ] Connect Supabase integration
- [ ] Add Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] Connect Vercel Blob integration (optional, for file uploads)
- [ ] Deploy to Vercel
- [ ] Call `/api/setup/create-default-admin` endpoint
- [ ] Login with admin/Admin@123
- [ ] Test student registration at `/auth/sign-up`
- [ ] Test instructor registration at `/auth/admin-register`

## Pages & Routes

### Public Pages
- `/` - Home with links to login/register
- `/auth/login` - Username/password login
- `/auth/sign-up` - Student self-registration
- `/auth/admin-register` - Instructor self-registration

### Protected Pages
- `/dashboard` - Routes to student or admin dashboard
- `/dashboard/student/*` - Student pages (assignments, exams, chat, profile)
- `/dashboard/admin/*` - Admin pages (students, assignments, exams, performance, messages)

## Troubleshooting

### Students can't login
- Verify username exists in database
- Check password is correct
- Ensure user completed registration

### Admin can't reset student password
- Verify student email in database
- Check admin is authenticated
- Ensure student account exists

### Files not uploading
- Verify Vercel Blob integration is connected
- Check file size is within limits
- Ensure proper CORS configuration

## Support
For detailed implementation guides, see:
- `AUTH_SETUP.md` - Authentication details
- `QUICK_START.md` - Quick reference
- `PROJECT_SUMMARY.md` - Full system overview
