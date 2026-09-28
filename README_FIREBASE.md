# Firebase Architecture & Setup Guide

This project contains a production-ready, modular Firebase backend foundation for **Anandh Jain Pujari — Jain Heritage & Cultural Platform**.

## Architecture Overview

```
Admin CMS (Protected Routes)
    ↓
Authentication (Firebase Email/Password)
    ↓
Firestore Database (Attribute-Based Access Control)
    ↓
Firebase Storage (Categorized media buckets)
    ↓
Public Website (Offline/Development Fallback with Static Data)
```

---

## 1. Firebase Web Configuration

The application uses Vite environment variables to initialize Firebase. **No fake credentials or hardcoded keys are present in the codebase.**

When Firebase environment variables are omitted or incomplete:
- The public website continues working smoothly using curated local fallback data (including the complete *"Avalpoondurai Jain Temple — A Spiritual Legacy"* research article).
- The Admin dashboard displays a **"Firebase connection required"** status indicator with instructions on linking the project.

### Where to enter environment variables

Create a `.env` file in the project root or configure environment secrets in your deployment dashboard with the following keys:

```bash
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef..."
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX" # Optional
```

> **Security Note:** Never include Google Cloud service-account private keys or server secrets in the client-facing frontend.

---

## 2. Setting Up Firebase Services in the Firebase Console

### A. Authentication
1. Navigate to **Firebase Console** -> **Build** -> **Authentication**.
2. Click **Get Started** and enable **Email/Password** sign-in provider.
3. In the **Users** tab, create your initial administrative account (e.g., `admin@yourdomain.com`).

### B. Cloud Firestore
1. Navigate to **Build** -> **Firestore Database**.
2. Create database in **Production mode** (rules are provided in `firestore.rules`).
3. Select your preferred Cloud region (e.g., `asia-south1` or `asia-east1`).
4. To grant superadmin privileges, create a document in the `users` collection with the user's Auth UID as the document ID:
   - Collection: `users`
   - Document ID: `<Auth UID>`
   - Fields:
     ```json
     {
       "email": "admin@yourdomain.com",
       "displayName": "Anandh Jain Pujari",
       "role": "superadmin",
       "createdAt": "2026-09-20T00:00:00.000Z",
       "updatedAt": "2026-09-20T00:00:00.000Z"
     }
     ```

### C. Firebase Storage
1. Navigate to **Build** -> **Storage**.
2. Enable Cloud Storage and apply the rules in `storage.rules`.
3. The storage structure supports the following folders:
   - `blog/`
   - `temples/`
   - `heritage/`
   - `photography/`
   - `projects/`
   - `about/`
   - `hero/`

---

## 3. Firestore Collections Schema

The database schema is strictly documented in `firebase-blueprint.json`:

| Collection | Purpose | Public Access | Admin Access |
|---|---|---|---|
| `users` | User profiles and RBAC | Restricted to owner/superadmin | Full (superadmin) |
| `blogPosts` | Cultural and temple research articles | Published articles only | Create, Update, Delete |
| `temples` | Historical Jain temple archives | Published archives only | Create, Update, Delete |
| `heritage` | Kongu Nadu & Tamil Jain history | Published archives only | Create, Update, Delete |
| `photography` | Curated field photography records | Published photos only | Create, Update, Delete |
| `projects` | Creative and preservation projects | Published projects only | Create, Update, Delete |
| `pages` | Custom static content pages | Published pages only | Create, Update, Delete |
| `categories` | Categorization taxonomies | Read-only | Full |
| `heroSettings` | Dynamic Hero configuration | Read-only (fallback active) | Update |
| `siteSettings` | Global site metadata & contacts | Read-only | Update |
| `seoSettings` | Default SEO parameters & meta | Read-only | Update |

---

## 4. Deploying Security Rules

Deploy using the Firebase CLI:

```bash
# Login to Firebase
firebase login

# Initialize project if needed
firebase use your-project-id

# Deploy Firestore and Storage rules
firebase deploy --only firestore:rules,storage
```

---

## 5. Admin Routing

- **Admin Login:** `/admin/login`
- **Admin Dashboard:** `/admin`
- **Protected Admin Sections:**
  - `/admin/blog`
  - `/admin/temples`
  - `/admin/heritage`
  - `/admin/photography`
  - `/admin/projects`
  - `/admin/pages`
  - `/admin/hero`
  - `/admin/media`
  - `/admin/settings`

Unauthenticated users are automatically redirected to `/admin/login`.
