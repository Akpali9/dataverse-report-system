# Authentication System Changes

## Summary of Updates

The authentication system has been completely revamped to use **username-based login** with **no email registration for students**. All student accounts must be created by instructors.

## Key Changes

### 1. Login System
- **Changed from**: Email + Password login
- **Changed to**: Username + Password login
- Username is now the primary identifier for users
- Login page updated with username field instead of email

### 2. Student Registration
- **Removed**: Self-service student signup (/auth/sign-up)
- **How it works now**: 
  - Admins/instructors log in
  - Navigate to "Manage Students"
  - Click "+ Add Student"
  - Fill in student details and set default password
  - Student receives username and password credentials

### 3. Instructor Registration
- **New page**: `/auth/admin-register`
- Instructors can self-register without admin approval
- Requires: Email, username, full name, password
- Account is active immediately

### 4. Default Admin Account
- **Username**: `admin`
- **Password**: `Admin@123`
- **Email**: `admin@dataverse.edu`
- Created via `/api/setup/create-default-admin` endpoint

## File Changes

### Updated Files

**Authentication Pages:**
- `/app/auth/login/page.tsx` - Changed email field to username
- `/app/auth/sign-up/page.tsx` - Now redirects to login page
- `/app/page.tsx` - Updated home page with new flow

**Authentication Actions:**
- `/app/actions/auth.ts` - New username-based login logic
- Removed email-based signup
- Added admin signup action

**Admin Features:**
- `/components/admin/students-client.tsx` - Added form to create student accounts
- `/app/dashboard/admin/students/page.tsx` - Enhanced with creation UI

**API Endpoints:**
- `/app/api/admin/create-student/route.ts` - NEW: Create student accounts
- `/app/api/admin/students/route.ts` - NEW: Get all students
- `/app/api/setup/create-default-admin/route.ts` - NEW: Setup default admin

### New Components

1. **Admin Registration Page** (`/app/auth/admin-register/page.tsx`)
   - Self-service instructor registration
   - Email, username, full name, password fields
   - Auto-creates instructor account with is_admin=true

2. **Student Creation API** (`/app/api/admin/create-student/route.ts`)
   - Creates student Supabase auth account
   - Creates user profile in database
   - Sets default password

3. **Default Admin Setup API** (`/app/api/setup/create-default-admin/route.ts`)
   - Creates initial admin account
   - Can be called at deployment time
   - Optional security token protection

## User Flows

### First-Time Setup
1. Deploy application
2. Call POST `/api/setup/create-default-admin` with optional token
3. Admin account created with username: `admin`, password: `Admin@123`

### Admin Login
1. Go to login page
2. Enter username and password
3. Access admin dashboard

### Instructor Self-Registration
1. Go to `/auth/admin-register`
2. Fill in email, username, full name, password
3. Account created immediately
4. Can login and manage students

### Student Account Creation
1. Instructor logs in
2. Goes to Manage Students
3. Clicks "+ Add Student"
4. Fills in: email, username, full name, school, default password
5. Student account created with those credentials

### Student Login
1. Instructor provides username and password
2. Student goes to login page
3. Enters username and password
4. Can submit assignments, view announcements, chat with instructor

## Password Reset Workflow

**For Students:**
1. Instructor navigates to Manage Students
2. Finds student in list
3. Clicks "Reset Pwd" button
4. Password reset to default (configured by instructor during creation)
5. Student uses new password to login

**For Instructors:**
- No self-reset; contact system admin

## Database Schema (No Changes)

The `users` table schema remains unchanged:
- Students have `is_admin = false`
- Instructors have `is_admin = true`
- All other fields same as before

## Security Notes

✅ **No email verification required** - Students can't register, admins create accounts  
✅ **Username-based login** - Simpler for classroom settings  
✅ **Admin-controlled passwords** - Ensures all students have access  
✅ **Easy password reset** - Instructors can reset anytime  
✅ **RLS policies enforced** - Students can only see their own data  

## Environment Variables

No new environment variables required. Optional:
- `SETUP_TOKEN` - Security token for admin setup endpoint (if set, required for creation)

## Testing the Changes

1. **Test Default Admin**:
   ```bash
   curl -X POST http://localhost:3000/api/setup/create-default-admin
   ```
   Then login with: username=`admin`, password=`Admin@123`

2. **Test Instructor Registration**:
   - Go to `/auth/admin-register`
   - Fill form and register
   - Login and verify access to admin dashboard

3. **Test Student Creation**:
   - Login as instructor
   - Go to Manage Students
   - Create a new student
   - Logout and login with student credentials

4. **Test Password Reset**:
   - As instructor, go to Manage Students
   - Click "Reset Pwd" on any student
   - Logout student and login with new default password

## Migration Notes

If upgrading from previous version:
- Existing user accounts still work
- Run setup endpoint to create admin if needed
- Update any student registration links to admin dashboard
- Inform students that registration is no longer available
