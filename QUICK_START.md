# Quick Start - Populate Sample Data

## ✅ Ready-to-Run Script

I've created a complete script using your actual book IDs!

### Step 1: Run the Population Script

In Supabase SQL Editor, copy and paste the entire contents of:
```
supabase/migrations/populate_with_real_books.sql
```

Click "Run" and it will:
- ✅ Create 4 learning paths (Backend, Frontend, Full Stack, DevOps)
- ✅ Add 4-6 books to each path
- ✅ Create 20 quiz questions (5 questions for 4 different books)
- ✅ Show you a summary of what was created

### Step 2: Verify Everything Worked

Run this verification script:
```
supabase/migrations/verify_sample_data.sql
```

This will show you:
- All learning paths created
- Books in each path
- Quiz questions created
- Summary statistics

### Step 3: Test in Your App

1. **Login as Admin**
   - Go to Admin Dashboard
   - Click "Learning Paths" tab → You should see 4 paths
   - Click "Quizzes" tab → You should see questions for 4 books

2. **Test as User**
   - Go to "Learning Paths" page
   - You should see 4 published paths
   - Click "Start Path" on any path
   - Click on a book to view it
   - Mark it as "Completed"
   - Click "Take Quiz" to test the quiz

## 📚 What Was Created

### 4 Learning Paths:

1. **Backend Development Mastery** (Intermediate, 120 days)
   - 4 books (3 required, 1 optional)
   - Covers server-side programming, databases, APIs

2. **Modern Frontend Development** (Beginner, 90 days)
   - 4 books (3 required, 1 optional)
   - Covers HTML/CSS, JavaScript, frameworks

3. **Full Stack Web Development** (Advanced, 180 days)
   - 6 books (4 required, 2 optional)
   - Complete frontend + backend journey

4. **DevOps & Cloud Engineering** (Intermediate, 100 days)
   - 4 books (3 required, 1 optional)
   - Covers deployment, containers, CI/CD

### 20 Quiz Questions:

- **Book 1** (Backend): 5 questions about HTTP, REST, middleware
- **Book 2** (Database): 5 questions about SQL, NoSQL, normalization
- **Book 5** (HTML/CSS): 5 questions about HTML, CSS, Flexbox
- **Book 6** (JavaScript): 5 questions about variables, DOM, Promises

## 🎯 Book IDs Used

The script uses these book IDs from your database:

**Backend Path:**
- ff0cea23-da62-429c-a5ea-515d1cfe806b
- ca3a121a-0d9d-4cd6-bc71-8db9194e40c1
- ed1602ac-8bab-44de-a9f2-679c98130cce
- 0d30d209-096d-472f-bcd1-868be53ca533

**Frontend Path:**
- 53ee34cd-d2f5-4e3b-bb66-a3450e9a41b6
- ac129d95-20ca-4a3a-9a11-8b3b3ca16f1e
- 9a13b91f-2d35-4a2c-b7e5-7add0596d556
- 69c950a2-d599-41bf-a479-e19bc6ec2b69

**Full Stack Path:**
- 7e4c2302-1b7a-45d6-84ed-4d870cd0cbaa
- 54b2b0ac-b534-4d4c-aa4b-f0c911e9bfe8
- d0753d75-7457-4798-91ed-2b9682d911a8
- f198fded-2505-444e-8e6e-780e31c83ade
- ed325015-eaff-4ee9-961c-351b1a7485fa
- 9db7191c-9990-474c-be67-7efb184bb506

**DevOps Path:**
- d6540187-9878-4a84-830b-d4e9637d531d
- be423428-8c32-47fc-899f-2e8077c4246c
- cb83a4af-63fd-4446-9eb7-fa1a0459883e
- c0cacfcd-0163-43cf-ad8f-e021e90b1602

## 🔧 Troubleshooting

### Script fails with "book not found"
- One of the book IDs might have been deleted
- Check which book ID is causing the issue
- Replace it with another book ID from your list

### No paths showing in app
- Make sure you ran the migration successfully
- Check that `is_published = true` in learning_paths table
- Verify RLS policies are applied

### Quiz not showing
- Make sure you marked the book as "Completed"
- Check that quiz questions exist for that book
- Verify you're logged in

## 🎉 Success!

If everything worked, you should now have:
- ✅ 4 complete learning paths
- ✅ 18 books organized in paths
- ✅ 20 quiz questions ready to use
- ✅ Fully functional quiz and roadmap system

## 📝 Next Steps

1. **Add More Quizzes**
   - Use Admin UI → Quizzes tab
   - Select any book
   - Add 5-10 questions

2. **Customize Paths**
   - Use Admin UI → Learning Paths tab
   - Edit path descriptions
   - Reorder books
   - Add/remove books

3. **Future: LLM Integration**
   - Use `llm_quiz_generator.py` script
   - Add OpenAI/Claude API key
   - Auto-generate quizzes and paths

Enjoy your fully-featured library management system! 🚀
