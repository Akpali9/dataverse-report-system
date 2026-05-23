# Authentication Setup Guide

## Overview

The Student-Admin Portal uses a custom authentication system with username/password login. This guide walks you through the setup process.

## Default Admin Account

**Username**: `admin`  
**Password**: `Admin@123`  
**Email**: `admin@dataverse.edu`

### Creating Default Admin (First Time Setup)

To create the default admin account, make a POST request to:

```bash
curl -X POST http://localhost:3000/api/setup/create-default-admin \
  -H "Content-Type: application/json"
```

Or with optional setup token (if SETUP_TOKEN is set in environment):

```bash
curl -X POST http://localhost:3000/api/setup/create-default-admin \
  -H "Content-Type: application/json" \
  -H "x-setup-token: your-setup-token"
```

## Authentication Flow

### Student Login
1. Go to `/auth/login`
2. Enter username and password
3. Credentials provided by instructor

### Instructor Registration
1. Go to `/auth/admin-register`
2. Fill in email, username, full name
3. Set password
4. Account created immediately

### Student Account Creation
1. Login as admin
2. Go to Dashboard → Manage Students
3. Click "+ Add Student"
4. Fill in: email, username, full name, school, default password
5. Student can login with provided credentials

## Key Features

✅ **No Email Registration**: Students cannot self-register  
✅ **Admin-Managed Accounts**: Admins create student accounts with default passwords  
✅ **Username-Based Login**: Simple username/password authentication  
✅ **Password Reset**: Admins can reset student passwords to default  
✅ **Instructor Self-Registration**: Instructors can register their own accounts  

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (handled via auth actions)
- `POST /auth/callback` - Auth callback handler

### Admin Operations
- `POST /api/admin/create-student` - Create new student account
- `GET /api/admin/students` - List all students
- `POST /api/admin/reset-password` - Reset student password
- `POST /api/setup/create-default-admin` - Create default admin

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

Optional:
- `SETUP_TOKEN` - Security token for admin setup endpoint

## User Types

### Admin/Instructor
- Register via `/auth/admin-register`
- Can create and manage student accounts
- Can create assignments, exams, and announcements
- Can grade submissions and track performance
- Can reset student passwords

### Student
- Accounts created by admins only
- Login with username/password
- Can submit assignments
- Can take exams
- Can view announcements
- Can chat with instructors

## Password Policy

- Default student password: `Password123!` (customizable by admin)
- Students should change password on first login
- Admins can reset passwords anytime

## Troubleshooting

### "Username not found"
- Ensure username is correct
- Contact your instructor if you don't have an account

### "Invalid password"
- Check password is correct
- Use "Reset password" if forgotten (admin can reset)

### "Student creation failed"
- Check all required fields are filled
- Ensure username doesn't already exist
- Check that default password is valid

## Database Schema

Students and admins stored in same `users` table with `is_admin` flag:
- `is_admin = false`: Student
- `is_admin = true`: Instructor/Admin

All authentication tied to Supabase `auth.users` with profile data in `public.users`.
