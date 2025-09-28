# JalRakshak Admin Portal

A comprehensive flood monitoring and alert system admin portal built with React, TypeScript, and modern web technologies.

## 🌟 Features

### 🔐 Security & Authentication
- **Session Management** - Auto-logout after inactivity with warning modal
- **Role-Based Access Control** - Different permission levels (Admin, Moderator, Viewer)
- **Input Validation** - Sanitized user inputs and form validation
- **Audit Logging** - Track all administrative actions

### 📱 Mobile Responsiveness
- **Responsive Sidebar** - Collapsible navigation on mobile devices
- **Touch Gestures** - Swipe navigation between tabs
- **Mobile-Optimized Charts** - Better chart display on mobile
- **Touch-Friendly Buttons** - Larger tap targets for mobile users

### ⚡ Real-time Features
- **Live Data Updates** - WebSocket connections for real-time data
- **Real-time Notifications** - Push notifications with browser support
- **Live Map Updates** - Real-time location tracking
- **Auto-refresh** - Dashboard updates automatically

### 🌍 Multi-Language Support
- **Auto-Translation System** - Support for 12 Indian languages
- **Instant Language Switching** - No page reload required
- **Language Persistence** - Remembers user's language choice
- **Comprehensive Coverage** - 100+ UI elements translated

### 🎨 UI/UX & Accessibility
- **Modern Design** - Beautiful gradient backgrounds and animations
- **Framer Motion Animations** - Smooth transitions and micro-interactions
- **Keyboard Navigation** - Full keyboard accessibility support
- **ARIA Labels** - Screen reader compatibility
- **Focus Management** - Proper focus handling for accessibility

### 📊 Dashboard Features
- **Interactive Statistics** - Real-time flood monitoring data
- **Interactive Map** - Visual flood risk assessment with animations
- **Interactive Charts** - Alert trends and data visualization
- **Recent Reports** - Latest flood reports with status tracking

### 🤖 AI Prediction System
- **Flood Risk Assessment** - AI-powered flood prediction
- **Confidence Scoring** - Prediction accuracy indicators
- **Water Level Monitoring** - Real-time water level tracking
- **Risk Level Classification** - Low, Medium, High, Critical risk levels

### 🚨 Alert Management
- **Send Alerts** - Broadcast flood warnings to users
- **Alert Statistics** - Track alert performance and reach
- **Emergency Notifications** - Critical alert broadcasting
- **Alert History** - Complete alert log and analytics

### 📋 Report Management
- **User Submissions** - Manage flood reports from citizens
- **Report Verification** - Verify and validate reports
- **Status Tracking** - Track report resolution progress
- **Image Support** - Handle report images and media

### 📝 Admin Logs
- **Activity Tracking** - Monitor all admin actions
- **System Events** - Track system-level events
- **User Actions** - Log user interactions
- **Search & Filter** - Advanced log filtering capabilities

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions

### State Management
- **React Query** - Server state management and caching
- **Custom Hooks** - Reusable state logic
- **Context API** - Global state management

### Authentication & Database
- **Supabase** - Backend-as-a-Service for authentication and database
- **Row Level Security** - Database security policies
- **Real-time Subscriptions** - Live data updates

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Vite HMR** - Hot module replacement for development

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jalrakshak-admin.git
   cd jalrakshak-admin
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_WEBSOCKET_URL=ws://localhost:8080/ws
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials
- **Email**: `admin@jalrakshak.com`
- **Password**: `admin123`

## 📁 Project Structure

```
jalrakshak-admin/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── layout/         # Layout components (Sidebar, Topbar)
│   │   │   ├── InteractiveMap.tsx
│   │   │   ├── InteractiveChart.tsx
│   │   │   ├── Notifications.tsx
│   │   │   └── AutoLanguageSelector.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── SimpleDashboard.tsx
│   │   │   ├── Prediction.tsx
│   │   │   ├── Alerts.tsx
│   │   │   ├── Reports.tsx
│   │   │   └── Logs.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useAutoTranslation.ts
│   │   │   ├── useSessionManager.ts
│   │   │   ├── useRoleBasedAccess.ts
│   │   │   ├── useTouchGestures.ts
│   │   │   └── useRealTimeNotifications.ts
│   │   ├── lib/                # External library configurations
│   │   │   └── supabase.ts
│   │   ├── utils/              # Utility functions
│   │   │   └── validation.ts
│   │   ├── SimpleApp.tsx       # Main application component
│   │   └── main.tsx           # Application entry point
│   ├── public/                 # Static assets
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## 🌍 Supported Languages

The application supports 12 Indian languages:

- **English** (en) - Default
- **Hindi** (hi) - हिन्दी
- **Bengali** (bn) - বাংলা
- **Tamil** (ta) - தமிழ்
- **Telugu** (te) - తెలుగు
- **Marathi** (mr) - मराठी
- **Gujarati** (gu) - ગુજરાતી
- **Kannada** (kn) - ಕನ್ನಡ
- **Malayalam** (ml) - മലയാളം
- **Odia** (or) - ଓଡ଼ିଆ
- **Punjabi** (pa) - ਪੰਜਾਬੀ
- **Assamese** (as) - অসমীয়া

## 🎯 Key Features in Detail

### Auto-Translation System
- **Instant Translation** - No page reload required
- **Language Persistence** - Remembers user's choice
- **Comprehensive Coverage** - 100+ UI elements translated
- **Mock Translation API** - Ready for real API integration

### Session Management
- **30-minute timeout** - Auto-logout after inactivity
- **5-minute warning** - Warning modal before logout
- **Activity tracking** - Mouse, keyboard, and scroll events
- **Session extension** - Option to extend session

### Real-time Features
- **WebSocket Integration** - Live data updates
- **Browser Notifications** - Push notification support
- **Connection Status** - Live/Offline indicators
- **Auto-reconnection** - Automatic reconnection on disconnect

### Mobile Experience
- **Collapsible Sidebar** - Space-efficient navigation
- **Touch Gestures** - Swipe between tabs
- **Responsive Design** - Works on all screen sizes
- **Touch-friendly UI** - Optimized for mobile interaction

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

### Code Quality
- **ESLint** - Code linting with React and TypeScript rules
- **Prettier** - Consistent code formatting
- **TypeScript** - Static type checking
- **Custom Hooks** - Reusable state logic

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - For providing the backend infrastructure
- **Framer Motion** - For smooth animations
- **Tailwind CSS** - For the utility-first CSS framework
- **React Query** - For server state management
- **Lucide React** - For beautiful icons

## 📞 Support

For support, email support@jalrakshak.com or create an issue in the GitHub repository.

---

**JalRakshak Admin Portal** - Protecting communities through intelligent flood monitoring and early warning systems.