# Mpilo Mobile - Doctor Dashboard

This is the doctor dashboard for Mpilo Mobile healthcare platform.

## Features

- **Doctor Authentication**: Secure doctor login
- **Patient Management**: View and manage patient information
- **Appointments**: Schedule and manage appointments
- **Medical Records**: Create and manage patient records
- **Triage System**: Handle patient triage
- **Messages**: Communication with patients and staff

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the doctor-dashboard directory:
   ```bash
   cd doctor-dashboard
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

- `/` - Doctor login
- `/login` - Doctor login
- `/forgot-password` - Password reset
- `/dashboard` - Doctor dashboard
- `/dashboard/appointments` - Appointments management
- `/dashboard/patients` - Patient management
- `/dashboard/records` - Medical records
- `/dashboard/triage` - Triage system
- `/dashboard/messages` - Messages
- `/dashboard/settings` - Settings
- `/dashboard/profile` - Profile

## Environment Variables

Make sure to set up your Supabase environment variables in a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
