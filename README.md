# Mo-Library

Mo-Library is a futuristic, modern sci-fi themed open library platform with a stunning UI, smooth animations, and an advanced seat booking system. It provides an accessible and interactive library experience.

## Features

### 1. **Sci-Fi Inspired UI**
- Modern and futuristic design
- Purple, black, and pink gradient theme
- Smooth animations for an engaging user experience

### 2. **Seat Booking System**
- Users can select and book a seat similar to apps like BookMyShow or RedBus.
- Three time slot options:
  - Next 2 hours
  - Next 4 hours
  - Custom start and end time
- Displays booked and available seats in real time
- Reserved seats are clearly marked

### 3. **Essential Library Features**
- A dynamic landing page with at least 5-6 must-have library features to enhance user experience
- Search functionality for books/resources (if applicable)
- User-friendly navigation

### 4. **User Authentication System**
- Login and Signup functionality
- 'Forgot Password' feature for easy account recovery
- Secure authentication using Supabase

### 5. **Animated Icons**
- Smooth and visually engaging icons for better UI/UX

## Tech Stack
- **Frontend:** React.js with Tailwind CSS for styling
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Hosting:** Vercel 

## Setup Instructions

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/sudhaanshuu/mo-library.git
   cd mo-library
   ```
2. **Install Dependencies:**
   ```sh
   npm install
   ```
3. **Setup Environment Variables:**
   - Create a `.env` file in the root directory.
   - Add the Supabase API key and URL:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Run the Development Server:**
   ```sh
   npm run dev
   ```


## Contributions
We welcome contributions! Feel free to open issues or submit pull requests.

## License
This project is open-source and available under the MIT License.

---

**Made with 💜 for the future of libraries!** 🚀
