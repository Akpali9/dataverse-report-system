# Quick Start Guide

## Immediate Access

After deployment, use these credentials to access the system:

```
Username: admin
Password: Admin@123
```

Go to: `https://your-domain.com/auth/login`

## First Steps (In Order)

### Step 1: Create Default Admin
```bash
# Call this endpoint after deployment
POST https://your-domain.com/api/setup/create-default-admin

# Or with curl:
curl -X POST https://your-domain.com/api/setup/create-default-admin
```

### Step 2: Login as Admin
1. Go to login page
2. Enter username: `admin`
3. Enter password: `Admin@123`
4. Click Login

### Step 3: Register Instructors
1. Share instructor registration link: `https://your-domain.com/auth/admin-register`
2. Instructors fill in email, username, full name, password
3. They're ready to use the system

### Step 4: Create Students
Each instructor can create student accounts:
1. Login to admin dashboard
2. Go to "Manage Students"
3. Click "+ Add Student"
4. Fill in email, username, full name, school, default password
5. Share credentials with student

### Step 5: Students Login
1. Go to login page
2. Enter username provided by instructor
3. Enter password provided by instructor
4. Start using the system

## URLs

| Page | URL |
|------|-----|
| Home | `/` |
| Login | `/auth/login` |
| Instructor Register | `/auth/admin-register` |
| Student Dashboard | `/dashboard/student` |
| Admin Dashboard | `/dashboard/admin` |
| Manage Students | `/dashboard/admin/students` |

## Key Features by Role

### Admin/Instructor Can:
✅ Create and manage assignments  
✅ Create and manage exams  
✅ Post announcements  
✅ Grade submissions  
✅ Reset student passwords  
✅ View student performance  
✅ Create student accounts  
✅ Chat with students  

### Students Can:
✅ Edit their profile  
✅ Submit assignments  
✅ Take exams  
✅ View announcements  
✅ View grades and feedback  
✅ Chat with instructors  

## Default Passwords

When creating a student, instructors set the default password.  
Recommended: `Password123!` or similar

Students should change their password after first login.

## Troubleshooting

**Can't login?**
- Check username and password
- Make sure account exists (admins create student accounts)

**Need to reset password?**
- Admin goes to Manage Students
- Finds student and clicks "Reset Pwd"
- Student uses new default password

**Forgot admin password?**
- Reset at database level or use forgot password link

## Common Tasks

### Create a Student Account
1. Login as instructor
2. Go to Manage Students
3. Click "+ Add Student"
4. Fill in details and set password
5. Click "Create Student Account"
6. Share username and password with student

### Post an Announcement
1. Go to Admin Dashboard
2. Click "Announcements"
3. Write title and content
4. Click "Post"
5. Visible to all students

### Create an Assignment
1. Go to Admin Dashboard
2. Click "Assignments"
3. Enter title, description, due date
4. Click "Create"
5. Students can submit after seeing it

### Grade a Submission
1. Go to Admin Dashboard
2. Click "Submissions" or "Assignments"
3. Find student submission
4. Enter marks and feedback
5. Click "Submit Grade"
6. Student receives notification

## Important Notes

⚠️ **Students cannot register themselves** - Only instructors can create accounts  
⚠️ **Username-based login** - Not email-based  
⚠️ **Default admin** - Created via setup endpoint  
⚠️ **Instructor self-registration** - Available via admin-register page  

## Support Resources

📖 Full Setup: See `SETUP_GUIDE.md`  
🔐 Auth Details: See `AUTH_SETUP.md`  
📋 Features: See `PROJECT_SUMMARY.md`  
🔄 Changes: See `AUTHENTICATION_CHANGES.md`  

---

**Ready to go!** Start with Step 1 above.
