# Project Specification: Teachers Gallery

## Overview

The **Teachers Gallery** is a web application designed to allow teachers to showcase their professional profiles and expertise. It serves as a public gallery where visitors can browse a list of teachers, view individual teacher profiles, and search for teachers by name or subject. Teachers can sign up, log in, and manage their own profiles, while administrators have elevated privileges to oversee and manage all teacher profiles. The application leverages Next.js for the frontend and Supabase for the backend, including database management, authentication, and file storage.

The project is currently unfinished, and this specification outlines the requirements to complete it, assuming a basic structure exists in the repository. It includes detailed features, database schemas, security policies, user flows, and technical considerations.

---

## Technology Stack

- **Frontend**: Next.js (React framework)
- **Backend**: Supabase (PostgreSQL database, authentication, and storage)
- **Styling**: CSS Modules or Tailwind CSS (to be determined based on existing code or preference)
- **Deployment**: Vercel (recommended for Next.js applications)

---

## Database Schema

The application relies on Supabase for its backend, utilizing its authentication system and PostgreSQL database. Below is the proposed schema:

### Tables

1. **`teachers` Table**
   - **Description**: Stores teacher profile data linked to user accounts.
   - **Fields**:
     - `id` (uuid, primary key): Unique identifier for each teacher profile.
     - `user_id` (uuid, foreign key to `auth.users.id`): Links the teacher profile to a Supabase auth user.
     - `name` (text): Teacher’s full name.
     - `bio` (text): A brief biography or description of the teacher.
     - `subjects` (text): Subjects taught by the teacher (e.g., "Mathematics, Physics" or stored as a JSON array if preferred).
     - `experience` (text): Years of experience or a description of teaching background.
     - `profile_picture` (text): URL to the teacher’s profile picture stored in Supabase Storage.
     - `created_at` (timestamp): Date and time of profile creation.
     - `updated_at` (timestamp): Date and time of last profile update.

2. **`users` Table (Managed by Supabase Auth)**
   - **Description**: Automatically created by Supabase for authentication, with custom metadata for roles.
   - **Fields**:
     - `id` (uuid): Unique user identifier.
     - `email` (text): User’s email address.
     - `password` (hashed): User’s password (managed by Supabase).
     - `role` (text, e.g., `'teacher'`, `'admin'`): Custom field stored in `user_metadata` to define user roles.

   **Note**: The `role` field is not part of the default `auth.users` table. It can be added via `user_metadata` during sign-up or managed in a separate `profiles` table if more flexibility is needed. For simplicity, this spec assumes it’s in `user_metadata`.

---

## Row-Level Security (RLS) Policies

Supabase uses RLS to enforce data access control at the database level. The following policies are defined for the `teachers` table:

- **SELECT**: Enabled for all (public)
  - Policy: `true`
  - Purpose: Allows anyone to view teacher profiles, aligning with the public gallery concept.
- **INSERT**: Enabled for authenticated users
  - Policy: `auth.uid() is not null`
  - Purpose: Allows logged-in users to create their own teacher profiles.
- **UPDATE**: Enabled if the user owns the profile or is an admin
  - Policy: `(user_id = auth.uid()) OR (auth.user_metadata->>'role' = 'admin')`
  - Purpose: Restricts updates to the profile owner or administrators.
- **DELETE**: Enabled for admins only
  - Policy: `auth.user_metadata->>'role' = 'admin'`
  - Purpose: Limits deletion rights to administrators.

**Implementation Note**: These policies must be configured in the Supabase dashboard or via SQL scripts in the repository (e.g., `supabase/migrations/`).

---

## Features and Pages

The application is divided into public, user-specific, and admin-specific features, implemented as Next.js pages.

### 1. Public Pages

- **Home Page (`/`)**  
  - **Path**: `/`  
  - **Description**: The landing page displaying a list of teachers.  
  - **Features**:  
    - Displays a grid or list of teachers with `name`, `subjects`, and `profile_picture`.  
    - Includes a search bar to query teachers by name or subjects.  
    - Optional: Filter dropdown or checkboxes for subjects.  
    - Pagination or infinite scrolling for large datasets.  
  - **Data Fetching**: Uses `getServerSideProps` to fetch teachers from Supabase.

- **Teacher Profile Page (`/teachers/[id]`)**
  - **Path**: `/teachers/[id]` (dynamic route)  
  - **Description**: Displays detailed information about a specific teacher.  
  - **Features**:  
    - Shows `name`, `bio`, `subjects`, `experience`, and `profile_picture`.  
    - Conditional "Edit" button: Visible if the logged-in user’s `user_id` matches the profile’s `user_id` or if the user’s `role` is `'admin'`.  
  - **Data Fetching**: Uses `getServerSideProps` to fetch the teacher by `id`.

### 2. Authentication Pages

- **Login Page (`/login`)**
  - **Path**: `/login`  
  - **Description**: Allows users to log in.  
  - **Features**:  
    - Form with `email` and `password` fields.  
    - "Sign Up" link redirecting to `/signup`.  
    - Error messages for invalid credentials.  
  - **Implementation**: Uses Supabase Auth’s `signInWithPassword`.

- **Sign Up Page (`/signup`)**
  - **Path**: `/signup`  
  - **Description**: Allows new users to create an account.  
  - **Features**:  
    - Form with `email` and `password` fields.  
    - Sets `role` as `'teacher'` in `user_metadata` by default (admins assigned manually or via a separate process).  
    - Redirects to `/profile` after successful sign-up.  
  - **Implementation**: Uses Supabase Auth’s `signUp`.

### 3. Teacher-Specific Pages

- **Profile Page (`/profile`)**
  - **Path**: `/profile`  
  - **Description**: Displays the logged-in user’s teacher profile or prompts profile creation.  
  - **Features**:  
    - If a teacher profile exists (checked via `user_id`), displays it like `/teachers/[id]`.  
    - If no profile exists, shows a form to create one with fields: `name`, `bio`, `subjects`, `experience`, and `profile_picture` upload.  
    - "Edit Profile" link or button if profile exists.  
  - **Data Fetching**: Checks Supabase for a `teachers` record matching `auth.uid()`.

- **Edit Profile Page (`/profile/edit`)**
  - **Path**: `/profile/edit`  
  - **Description**: Allows teachers to update their profile.  
  - **Features**:  
    - Pre-filled form with current `name`, `bio`, `subjects`, `experience`, and `profile_picture`.  
    - File input for uploading a new profile picture.  
    - Save button submits changes to Supabase.  
  - **Implementation**: Updates the `teachers` table and uploads images to Supabase Storage.

### 4. Admin-Specific Pages

- **Admin Dashboard (`/admin`)**
  - **Path**: `/admin`  
  - **Description**: A management interface for administrators.  
  - **Features**:  
    - Lists all teachers with options to edit or delete each profile.  
    - Optional: User management (e.g., promote users to admin).  
    - Protected route: Accessible only if `role = 'admin'`.  
  - **Data Fetching**: Fetches all teachers from Supabase, with server-side role verification.

---

## Components

Reusable React components to streamline development:

- **`TeacherCard`**  
  - Displays a teacher’s `name`, `subjects`, and `profile_picture` in a card layout.  
  - Used on the home page and admin dashboard.

- **`TeacherProfile`**  
  - Renders full teacher details (`name`, `bio`, `subjects`, `experience`, `profile_picture`).  
  - Used on `/teachers/[id]` and `/profile`.

- **`SearchBar`**  
  - Input field for searching teachers by name or subjects.  
  - Triggers client-side filtering or server-side queries.

- **`FilterDropdown`** (Optional)  
  - Dropdown or checkbox list for filtering by subjects.

- **`AuthForm`**  
  - Reusable form for login and sign-up pages, with `email` and `password` inputs.

- **`ProfileForm`**  
  - Form for creating or editing teacher profiles, including file upload for `profile_picture`.

- **`Navbar`**  
  - Navigation bar with links:  
    - Home (`/`)  
    - Profile (`/profile`, if logged in)  
    - Admin (`/admin`, if `role = 'admin'`)  
    - Login/Sign Up (if not logged in) or Logout (if logged in).

---

## Functionality

- **Authentication**:  
  - Implemented with Supabase Auth for sign-up, login, and logout.  
  - Session management via Supabase’s auth helpers for Next.js.

- **Data Fetching**:  
  - Uses the Supabase client in `getServerSideProps` for server-side rendering.  
  - Optional: Use `useSWR` or React Query for client-side fetching if dynamic updates are needed.

- **Image Upload**:  
  - Profile pictures uploaded to Supabase Storage.  
  - Stored URLs saved in the `teachers.profile_picture` field.

- **Form Validation**:  
  - Client-side: Validate required fields and file types/sizes.  
  - Server-side: Verify data before insertion/update in Supabase.

- **Error Handling**:  
  - Display user-friendly error messages (e.g., "Invalid login credentials").  
  - Log errors for debugging.

- **Loading States**:  
  - Show spinners or placeholders while fetching data or uploading images.

---

## Styling

- **Approach**: Use CSS Modules (if already in the repo) or Tailwind CSS for rapid development.  
- **Requirements**:  
  - Responsive design: Works on desktop, tablet, and mobile.  
  - Visually appealing: Consistent color scheme, typography, and layout (e.g., cards for teachers).  
  - Image optimization: Ensure profile pictures display correctly with proper aspect ratios.

---

## Deployment

- **Platform**: Vercel (ideal for Next.js).  
- **Configuration**:  
  - Set environment variables in Vercel:  
    - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.  
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key.  
    - `SUPABASE_SERVICE_ROLE_KEY`: Service role key (for server-side operations, kept secret).  
  - Connect the GitHub repository for automatic deployments.

---

## Additional Requirements

- **Search Functionality**:  
  - Implement server-side search in Supabase using `ilike` for name/subjects or client-side filtering.  
- **Authorization**:  
  - Enforce RLS and validate user roles on the server side for sensitive operations (e.g., `/admin`).  
- **Image Handling**:  
  - Support common image formats (JPEG, PNG); limit file size (e.g., 5MB).  
- **Performance**:  
  - Optimize queries (e.g., limit rows fetched on the home page).  
  - Use Next.js static generation or incremental static regeneration where applicable.  
- **Testing**:  
  - Unit tests for components (e.g., `TeacherCard`, `ProfileForm`).  
  - Integration tests for user flows (sign-up → profile creation, login → edit profile).  
  - Use Jest and React Testing Library or similar.

---

## User Flows

1. **Visitor**:  
   - Visits `/` → sees teacher list → searches or filters → clicks a teacher → views `/teachers/[id]`.  

2. **Teacher**:  
   - Goes to `/signup` → creates account → redirects to `/profile` → fills out profile form → saves profile.  
   - Later: Logs in at `/login` → goes to `/profile` → clicks "Edit" → updates profile at `/profile/edit`.  

3. **Admin**:  
   - Logs in at `/login` → goes to `/admin` → views all teachers → edits or deletes profiles as needed.

---

## Deliverables

- **Deployed Application**: Fully functional Teachers Gallery on Vercel.  
- **Source Code**: Clean, documented code in the GitHub repository.  
- **Database Setup**: Supabase project with tables and RLS policies configured.  
- **Documentation**: Updated README with setup instructions, environment variables, and deployment steps.

---

## Assumptions and Notes

- The existing code provides a basic Next.js structure with some pages (e.g., `index.js`, `teachers/[id].js`) and a Supabase client setup (e.g., `lib/supabase.js`).  
- Features like profile editing, admin dashboard, and search are incomplete and need implementation.  
- Admin users are manually assigned (e.g., via Supabase dashboard) unless a user management UI is added.  
- The focus is on simplicity and core functionality, with optional enhancements (e.g., filters, reviews) left for future iterations.
