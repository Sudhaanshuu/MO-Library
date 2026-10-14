# Mo-Library 📚

Mo-Library is a futuristic, modern sci-fi themed digital library platform with a stunning UI, smooth animations, and comprehensive library management features. It reimagines the traditional library experience with cutting-edge technology.

## ✨ Features

### 🎨 Modern UI/UX
- Futuristic sci-fi inspired design with purple, black, and pink gradients
- Smooth animations powered by Framer Motion
- Responsive design for all devices
- Dark mode optimized interface
- Glass morphism effects and neon shadows

### 💺 Advanced Seat Booking System
- Interactive seat selection (similar to BookMyShow/RedBus)
- Real-time seat availability tracking
- Flexible booking options:
  - Quick slots: 2 hours or 4 hours
  - Custom time range selection
- Visual seat status indicators (Available, Booked, Your Booking)
- Integrated Razorpay payment gateway (₹5/hour)
- Booking management from user dashboard
- Cancel bookings up to 1 hour before start time

### 📖 Book Management
- Comprehensive book catalog with search and filters
- Book details with cover images, descriptions, and metadata
- Support for physical books, e-books, and both
- ISBN tracking and categorization
- Genre and category filtering
- Availability status tracking
- PDF viewer for digital books

### 📚 Personal Reading Experience
- My Reading list with status tracking:
  - Want to Read
  - Currently Reading
  - Completed
  - On Hold
- Personal book ratings (1-5 stars)
- Reading notes and reflections
- Reading statistics dashboard
- Progress tracking with visual indicators
- Started and completed date tracking

### 🗺️ Learning Roadmaps
- Curated learning paths with structured book recommendations
- Difficulty levels: Beginner, Intermediate, Advanced
- Category-based organization
- Progress tracking for each roadmap
- Estimated duration for completion
- Visual progress indicators
- Start and continue learning paths

### 👥 Community Features
- Community feed for book discussions
- Post creation with book titles and reading duration
- Like and comment system
- Nested replies support
- Book request system
- Share reading experiences

### 👤 User Management
- Secure authentication (Login/Signup)
- Password recovery system
- User profiles with avatars
- Personal dashboard with:
  - Booking history
  - Reading statistics
  - Quick actions
- Profile customization

### 🔐 Admin Panel
- Comprehensive booking management
- Revenue tracking and analytics
- Export bookings to CSV
- Book collection management:
  - Add/Edit/Delete books
  - Manage inventory
  - Track availability
- User management
- Filter and search capabilities

### 💳 Payment Integration
- Razorpay payment gateway
- Secure payment processing
- Automatic booking confirmation
- Payment history tracking

### 📱 Additional Features
- About Us page
- Contact Us form
- Pricing plans (Hourly, Daily, Weekly, Monthly, Annual)
- Privacy Policy
- Terms & Conditions
- Refund Policy
- Responsive navigation
- Footer with quick links

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Router DOM** for navigation
- **React Hot Toast** for notifications

### Backend
- **Supabase** (PostgreSQL database)
- **Supabase Auth** for authentication
- **Supabase Storage** for file uploads
- **Row Level Security (RLS)** for data protection

### Payment
- **Razorpay** payment gateway integration

### Deployment
- **Vercel** for hosting

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Razorpay account (for payment features)

### 1. Clone the Repository
```bash
git clone https://github.com/sudhaanshuu/mo-library.git
cd mo-library
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Database Setup (One-Click Migration)
Set up the entire database in one step:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. In the left sidebar, click **SQL Editor** -> **+ New query**
3. Open [`supabase/complete_database.sql`](supabase/complete_database.sql) (or `supabase/schema.sql`)
4. Copy the entire content and paste it into the SQL Editor
5. Click **Run** (or press `Ctrl+Enter`)

That's it! All 14 tables, performance indexes, RLS security policies, triggers, double-booking prevention, avatar storage bucket, and sample books/quizzes/roadmaps are automatically created.

### 5. Setup an Admin Account
To grant an account full administrator access (manage books, quizzes, learning paths, view all bookings, etc.):

1. **Create an account** via the web app (`/signup`) or in Supabase Auth (**Authentication -> Users -> Add User**)
2. Open the **SQL Editor** in Supabase and run:
   ```sql
   UPDATE public.profiles
   SET is_admin = true
   WHERE email = 'your-email@example.com';
   ```
3. **Verify the change**:
   ```sql
   SELECT id, email, full_name, is_admin FROM public.profiles WHERE is_admin = true;
   ```
4. Log into the app with that email and password, then navigate to `/admin`!

### 6. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 7. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
mo-library/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ScrollToTop.tsx
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── SeatBooking.tsx
│   │   ├── BookSearch.tsx
│   │   ├── BookDetails.tsx
│   │   ├── MyReading.tsx
│   │   ├── LearningPaths.tsx
│   │   ├── Community.tsx
│   │   ├── Admin.tsx
│   │   └── ...
│   ├── lib/             # Utility libraries
│   │   ├── supabase.ts
│   │   └── razorpay.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── supabase/
│   ├── complete_database.sql # Consolidated single-run database setup script
│   ├── schema.sql            # Master schema file
│   └── migrations/           # Versioned migrations & archive
├── public/              # Static assets
└── package.json
```

## 🗄️ Database Schema

### Main Tables
- **profiles** - User profile information
- **seats** - Library seat information
- **bookings** - Seat booking records
- **books** - Book catalog
- **user_reading_list** - Personal reading lists
- **learning_paths** - Curated learning roadmaps
- **roadmap_books** - Books in learning paths
- **user_roadmap_progress** - User progress tracking
- **community_posts** - Community feed posts
- **post_comments** - Comments on posts
- **post_likes** - Post likes

## 🚀 Key Features Implementation

### Seat Booking Flow
1. User selects date and time
2. Visual seat map shows availability
3. User selects desired seat
4. Payment via Razorpay
5. Booking confirmation
6. Dashboard management

### Reading List Management
1. Browse book catalog
2. Add books to reading list
3. Update reading status
4. Rate and review books
5. Track reading progress
6. Add personal notes

### Learning Paths
1. Browse curated roadmaps
2. Start a learning path
3. Track progress through books
4. Complete books in sequence
5. View completion statistics

## 🎨 Design System

### Colors
- Primary: Purple (#8b5cf6)
- Secondary: Pink (#ec4899)
- Background: Dark (#0a0a0a)
- Accent: Gradient combinations

### Typography
- Font Family: System fonts with fallbacks
- Responsive sizing
- Clear hierarchy

### Components
- Glass morphism effects
- Neon shadows
- Smooth transitions
- Hover states

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- Secure authentication flow
- Protected API routes
- Input validation
- XSS protection
- CSRF protection

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop layouts
- Touch-friendly interfaces

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is open-source and available under the MIT License.

## 👥 Authors

- **Sudhanshu** - Initial work

## 🙏 Acknowledgments

- Supabase for the backend infrastructure
- Razorpay for payment processing
- Framer Motion for animations
- Tailwind CSS for styling
- The open-source community

## 📞 Support

For support, email support@mo-library.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered book recommendations
- [ ] Social features expansion
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Integration with external book APIs

---

**Made with 💜 for the future of libraries!** 🚀

*Reimagining the library experience, one feature at a time.*
