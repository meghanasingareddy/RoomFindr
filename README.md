# RoomFindr

RoomFindr is a responsive web application for finding and posting rental rooms.

## Tech Stack
- **Frontend:** React + Vite
- **Styling:** CSS
- **Backend:** Supabase (Auth, Database, Storage)
- **Icons:** Lucide React

## Setup Instructions

### 1. Install Dependencies
Run the following command in the project root:
```bash
npm install
```

### 2. Supabase Setup
1. Create a new project at [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `schema.sql` (located in the root of this project) and run it. This will create the necessary tables, security policies, and storage buckets.
4. Go to **Project Settings > API**.
5. Copy the `Project URL` and `anon` public key.

### 3. Environment Variables
Create a `.env` file in the root directory:
```bash
touch .env
```
Add your Supabase credentials to `.env`:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Run the Application
Start the development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## Features
- **Search & Filter:** Find rooms by location, rent, property type, and preferences.
- **Authentication:** Sign up and login to post rooms.
- **Post Rooms:** Owners can list rooms with details and images.
- **Manage Listings:** Owners can view and delete their posted rooms.
