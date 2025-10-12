# Mpilo Mobile - Healthcare Platform

A comprehensive healthcare platform split into three independent applications for better scalability and security.

## 🏗️ Architecture

This project is divided into three separate applications that can be hosted independently:

### 1. **Patient Website** (`/patient-website`)

- **Purpose**: Public-facing website and patient dashboard
- **Users**: Patients and general public
- **Features**:
  - Public website (Home, Services, About, etc.)
  - Patient registration and login
  - Patient dashboard
  - Contact and information pages

### 2. **Admin Dashboard** (`/admin-dashboard`)

- **Purpose**: Administrative control panel
- **Users**: System administrators
- **Features**:
  - User management (patients and doctors)
  - System administration
  - Records management
  - Analytics and reporting

### 3. **Doctor Dashboard** (`/doctor-dashboard`)

- **Purpose**: Medical professional interface
- **Users**: Healthcare practitioners
- **Features**:
  - Patient management
  - Appointment scheduling
  - Medical records
  - Triage system
  - Communication tools

## 🚀 Quick Start

Each application can be run independently:

### Patient Website

```bash
cd patient-website
npm install
npm run dev
# Runs on http://localhost:5173
```

### Admin Dashboard

```bash
cd admin-dashboard
npm install
npm run dev
# Runs on http://localhost:5174 (or next available port)
```

### Doctor Dashboard

```bash
cd doctor-dashboard
npm install
npm run dev
# Runs on http://localhost:5175 (or next available port)
```

## 🔧 Technology Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React
- **State Management**: React Query (TanStack Query)
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Routing**: React Router v7

## 📁 Project Structure

```bash
MpiloMobile-web/
├── patient-website/         # Patient-facing application
│   ├── src/
│   │   ├── components/      # Patient-specific components
│   │   ├── pages/           # Public pages + UserDashboard
│   │   └── ...
│   └── package.json
├── admin-dashboard/         # Admin application
│   ├── src/
│   │   ├── components/      # Admin-specific components
│   │   ├── pages/           # Admin pages only
│   │   └── ...
│   └── package.json
├── doctor-dashboard/        # Doctor application
│   ├── src/
│   │   ├── components/      # Doctor-specific components
│   │   └── ...
│   └── package.json
└── README.md
```

## 🔐 Security Features

- **Separate Authentication**: Each app has its own login system
- **Role-based Access**: Different user types access different applications
- **Secure Routing**: Protected routes for authenticated users
- **Environment Variables**: Secure configuration management

## 🌐 Deployment

Each application can be deployed independently to different domains or subdomains:

- **Patient Website**: `https://mpilo.com` or `https://patient.mpilo.com`
- **Admin Dashboard**: `https://admin.mpilo.com`
- **Doctor Dashboard**: `https://doctor.mpilo.com`

### Deployment Options

- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Environment Setup

Create `.env` files in each application directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📝 Features by Application

### Patient Website

- ✅ Public website pages
- ✅ Patient registration/login
- ✅ Patient dashboard
- ✅ Contact forms
- ✅ Gallery and information pages

### Admin Dashboard

- ✅ Admin authentication
- ✅ User management
- ✅ System administration
- ✅ Records management
- ✅ Analytics dashboard

### Doctor Dashboard

- ✅ Doctor authentication
- ✅ Patient management
- ✅ Appointment scheduling
- ✅ Medical records
- ✅ Triage system
- ✅ Communication tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
