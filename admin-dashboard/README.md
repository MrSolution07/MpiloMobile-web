# Mpilo Mobile - Admin Dashboard

This is the admin dashboard for Mpilo Mobile healthcare platform management.

## Features

- **Admin Authentication**: Secure admin login
- **User Management**: Manage patients and doctors
- **Records Management**: Handle medical records
- **System Administration**: Complete admin controls
- **Analytics Dashboard**: System insights and reports

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the admin-dashboard directory:
   ```bash
   cd admin-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Deployment

This application can be deployed to any static hosting service like:
- Vercel
- Netlify
- AWS S3 + CloudFront

## Routes

- `/` - Admin login
- `/login` - Admin login
- `/forgot-password` - Password reset
- `/admin` - Admin dashboard
- `/admin/patients` - Patient management
- `/admin/doctors` - Doctor management
- `/admin/records` - Records management
- `/admin/adminmessages` - Messages
- `/admin/adminsettings` - Settings
- `/admin/adminprofile` - Profile

## Security

This dashboard should only be accessible to authorized administrators. Ensure proper authentication and authorization are in place before deployment.

## Environment Variables

Make sure to set up your Supabase environment variables in a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
