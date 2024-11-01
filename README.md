# Incit Auth Frontend

Aplikasi autentikasi frontend yang dibangun menggunakan React, TypeScript, dan Vite dengan berbagai fitur modern.

## Teknologi yang Digunakan

- **React 18.2.0** - Library JavaScript untuk membangun antarmuka pengguna
- **TypeScript 4.9.5** - Superset JavaScript dengan penambahan tipe data statis
- **Vite** - Build tool yang cepat untuk pengembangan modern
- **React Router DOM 6.10.0** - Routing library untuk React
- **Axios** - HTTP Client untuk melakukan request API
- **TailwindCSS** - Framework CSS utility-first
- **js-cookie** - Library untuk mengelola cookie browser

## Struktur Folder 

```
incit-auth-fe/
├── public/
├── src/
│ ├── components/ # Komponen React
│ ├── context/ # React Context
│ ├── services/ # Service layer untuk API
│ ├── types/ # TypeScript type definitions
│ ├── utils/ # Utility functions
│ ├── App.tsx # Root component
│ └── main.tsx # Entry point
├── .env # Environment variables
├── .env.example # Environment variables example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Cara Kerja Komponen Utama

### Context API
- `AuthContext` mengelola state autentikasi global
- Menyediakan informasi user dan token ke seluruh aplikasi
- Menghandle login, logout, dan pembaruan status autentikasi

### React Router DOM
- Implementasi routing menggunakan `BrowserRouter`
- Protected routes untuk halaman yang membutuhkan autentikasi
- Redirect handling untuk autentikasi

### API Integration
- Menggunakan Axios untuk HTTP requests
- Base URL dikonfigurasi melalui environment variable
- Interceptors untuk handling token dan error responses

### Tailwind CSS
- Styling menggunakan utility classes
- Responsive design
- Custom theme configuration di `tailwind.config.js`

## Instalasi dan Setup

1. Clone repository

# SSH (please make sure you have ssh key in your github account)
```bash
git clone git@github.com:n0tavaliduser/incit-auth-fe.git
cd incit-auth-fe
```

# HTTPS
```bash
git clone https://github.com/n0tavaliduser/incit-auth-fe.git
cd incit-auth-fe
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan konfigurasi yang sesuai:

```
VITE_API_URL=http://localhost:3001
VITE_PORT=3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

## Environment Variables

| Variable              | Description                  |
|----------------------|------------------------------|
| VITE_API_URL         | Backend API URL             |
| VITE_PORT            | Frontend development port    |
| VITE_GOOGLE_CLIENT_ID| Google OAuth client ID      |
| VITE_FACEBOOK_APP_ID | Facebook OAuth app ID       |

4. Jalankan aplikasi dalam mode development

```bash
npm run dev
```

### Deployment
Aplikasi dikonfigurasi untuk deployment di Vercel dengan konfigurasi di `vercel.json` yang mencakup:
- URL rewriting untuk SPA
- CORS headers
- API proxy settings

## Development Guidelines

### Penamaan File
- Komponen: PascalCase (e.g., `LoginForm.tsx`)
- Utilities: camelCase (e.g., `api.ts`)
- Types: PascalCase untuk interface/type (e.g., `auth.ts`)

## Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build aplikasi untuk production
- `npm run preview` - Preview build production

## Catatan Penting

- Pastikan backend API sudah running sebelum menjalankan frontend
- Konfigurasi OAuth credentials dengan benar di Google Cloud Console dan Facebook Developers
- Perhatikan CORS settings di environment production
