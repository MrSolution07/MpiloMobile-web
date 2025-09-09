# Mpilo Mobile - Patient Website

This is the patient-facing website and dashboard for Mpilo Mobile healthcare platform.

## Features

- **Public Website**: Home, Services, About, Clients, Gallery, Contact
- **Patient Dashboard**: User dashboard for patients to manage their health information
- **Patient Authentication**: Login and registration for patients
- **Responsive Design**: Mobile-first design for all devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the patient-website directory:
   ```bash
   cd patient-website
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
- GitHub Pages

## Routes

- `/` - Home page
- `/services` - Services page
- `/about` - About page
- `/clients` - Clients page
- `/gallery` - Gallery page
- `/contact` - Contact page
- `/login` - Patient login
- `/register` - Patient registration
- `/forgot-password` - Password reset
- `/Userdashboard` - Patient dashboard

## Environment Variables

Make sure to set up your Supabase environment variables in a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
