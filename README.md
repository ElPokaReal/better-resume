<div align="center">
  <img src="https://i.imgur.com/33x5Gxc.png" alt="Better Resume Logo" width="500"/>
  
  <h3>Create professional resumes effortlessly</h3>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#contributing">Contributing</a>
  </p>

  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
  [![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
  
  [![Neon](https://img.shields.io/badge/Neon-Database-00e699?style=for-the-badge)](https://neon.tech/)
  [![Drizzle](https://img.shields.io/badge/Drizzle-ORM-c5f74f?style=for-the-badge)](https://orm.drizzle.team/)
  [![Better Auth](https://img.shields.io/badge/Better-Auth-ff6b6b?style=for-the-badge)](https://www.better-auth.com/)
  
  [![Netlify](https://img.shields.io/badge/Netlify-Deployed-00c7b7?style=for-the-badge&logo=netlify)](https://better-resume-gen.netlify.app)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
  
  ![GitHub stars](https://img.shields.io/github/stars/ElPokaReal/better-resume?style=for-the-badge)
  ![GitHub forks](https://img.shields.io/github/forks/ElPokaReal/better-resume?style=for-the-badge)
</div>

---

## 🌟 Features

### ✨ **Intuitive Editor**
- **Real-time preview** - See changes instantly as you type
- **Drag & drop sections** - Reorder your resume sections effortlessly
- **Rich text editing** - Format your content with ease
- **Auto-save** - Never lose your progress

### 🌍 **Multilingual Support**
- **English & Spanish** - Switch languages seamlessly
- **Localized templates** - Content adapted to each language
- **i18n ready** - Easy to add more languages

### 🎨 **Full Customization**
- **Multiple templates** - Choose from professional designs
- **Color themes** - Customize colors to match your style
- **Font options** - Select from various professional fonts
- **Section management** - Add, remove, or reorder sections

### 📱 **Responsive Design**
- **Mobile-first** - Works perfectly on all devices
- **Touch-friendly** - Optimized for touch interactions
- **Dark mode** - Easy on the eyes, day or night

### 📄 **Export Options**
- **PDF export** - High-quality PDF generation
- **Print-ready** - Optimized for printing
- **ATS-friendly** - Compatible with applicant tracking systems

### 🔐 **Secure Authentication**
- **OAuth integration** - Login with GitHub or Google
- **Session management** - Secure user sessions
- **Data privacy** - Your data is protected

### 💾 **Cloud Storage**
- **Auto-save** - Changes saved automatically
- **Multiple resumes** - Create and manage multiple versions
- **Cloud sync** - Access your resumes from anywhere

### 🎭 **Beautiful Animations**
- **GSAP powered** - Smooth, professional animations
- **Scroll effects** - Engaging scroll-triggered animations
- **Micro-interactions** - Delightful user feedback

---

## 🛠️ Tech Stack

### **Frontend**
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[GSAP](https://greensock.com/gsap/)** - Professional animations
- **[Framer Motion](https://www.framer.com/motion/)** - React animations

### **Backend & Database**
- **[Better Auth](https://www.better-auth.com/)** - Authentication
- **[Neon](https://neon.tech/)** - Serverless Postgres
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe ORM

### **UI Components**
- **[Radix UI](https://www.radix-ui.com/)** - Accessible components
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icons
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation

### **PDF Generation**
- **[@react-pdf/renderer](https://react-pdf.org/)** - PDF creation

### **Internationalization**
- **[next-intl](https://next-intl-docs.vercel.app/)** - i18n for Next.js

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js 20+** or **Bun**
- **PostgreSQL database** (Neon recommended)
- **GitHub OAuth App** (for authentication)
- **Google OAuth App** (for authentication)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/better-resume.git
   cd better-resume
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Better Auth
   BETTER_AUTH_SECRET=your-secret-key-here
   BETTER_AUTH_URL=http://localhost:3000

   # Next.js
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Database (Neon)
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require

   # GitHub OAuth
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   # or
   bun run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Setup

### **Using Neon (Recommended)**

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to your `.env.local` as `DATABASE_URL`

### **Database Commands**

```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio (Database GUI)
npm run db:studio
```

---

## 🔐 OAuth Setup

### **GitHub OAuth**

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: Better Resume
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and **Client Secret**
5. Add them to your `.env.local`

### **Google OAuth**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized origins and redirect URIs:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**
8. Add them to your `.env.local`

---

## 📦 Deployment

### **Deploy to Netlify**

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click **"Add new site"** → **"Import from GitHub"**
   - Select your repository

3. **Configure build settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

4. **Add environment variables**
   
   Add all variables from your `.env.local` to Netlify:
   - Go to **Site settings** → **Environment variables**
   - Update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` with your Netlify URL

5. **Update OAuth redirect URIs**
   
   Update GitHub and Google OAuth apps with your Netlify URL

6. **Deploy!**
   
   Netlify will automatically deploy your site

---

## 📁 Project Structure

```
better-resume/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── dashboard/     # Dashboard page
│   │   │   ├── editor/        # Resume editor
│   │   │   ├── features/      # Features page
│   │   │   └── templates/     # Templates page
│   │   ├── actions/           # Server actions
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   ├── editor/            # Editor components
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── auth.ts           # Authentication config
│   │   ├── db.ts             # Database config
│   │   └── utils.ts          # Utility functions
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── messages/                 # i18n translations
│   ├── en.json              # English
│   └── es.json              # Spanish
├── drizzle/                 # Database migrations
└── netlify.toml             # Netlify config
```

---

## 🎨 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:generate     # Generate migrations
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:studio       # Open Drizzle Studio
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - The React framework
- **[Vercel](https://vercel.com/)** - Hosting and deployment
- **[Neon](https://neon.tech/)** - Serverless Postgres
- **[Better Auth](https://www.better-auth.com/)** - Authentication
- **[GSAP](https://greensock.com/)** - Animation library
- **[Radix UI](https://www.radix-ui.com/)** - UI components

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

<div align="center">
  <p>Made with ❤️ by Samuel Aranguren</p>
  <p>
    <a href="https://elpokareal-github.io/samuel-portfolio">Portfolio</a> •
    <a href="https://better-resume.netlify.app">Demo</a> •
    <a href="https://github.com/elpokareal/better-resume/issues">Report Bug</a> •
    <a href="https://github.com/elpokareal/better-resume/issues">Request Feature</a>
  </p>
</div>
