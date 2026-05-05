# PetConnect Pakistan

A full-stack web platform for lost and found pets, adoption listings, and trusted pet services in Pakistan.

## Features

- Email and phone authentication
- Create posts with images
- Search and filter by city and post type
- Post detail pages with WhatsApp sharing
- Dashboard to edit or delete your posts
- Services directory (vets, groomers, pet shops)

## Tech Stack

- Next.js (App Router)
- Tailwind CSS
- Firebase Authentication, Firestore, and Storage

## Getting Started

1) Install dependencies:

```bash
npm install
```

2) Create a Firebase project and copy your config values.

3) Add environment variables:

```bash
cp .env.example .env.local
```

4) Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Firebase Setup

- Enable Email/Password and Phone authentication in Firebase Auth.
- Create Firestore collections: `users`, `posts`, `services`.
- Create a Firebase Storage bucket for post images.

Note: Filtering by multiple fields may require Firestore composite indexes. If you see an index error in the console, click the provided link to create the index.

## Deployment

Deploy on Vercel with the environment variables from `.env.local`.
