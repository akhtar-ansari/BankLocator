# BankLocator.sa — Project Structure

## Folder Layout

```
BankLocator/
├── public/
│   ├── assets/
│   │   ├── announcements/          # Stories/news images (you update these)
│   │   │   ├── story-1.jpg
│   │   │   ├── story-2.jpg
│   │   │   └── ...
│   │   ├── banks/                  # Bank logos
│   │   │   ├── alrajhi.svg
│   │   │   ├── snb.svg
│   │   │   └── ...
│   │   └── banklocator.mp4         # Animated logo
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Logo + Language toggle
│   │   ├── StoriesCarousel.jsx     # News/announcements slider
│   │   ├── MapView.jsx             # Leaflet map
│   │   ├── FilterSidebar.jsx       # Bank filters, city, 24/7
│   │   ├── LocationCard.jsx        # Branch/ATM details panel
│   │   ├── ComingSoonModal.jsx     # Future features popup
│   │   ├── Footer.jsx              # Arwa contact + disclaimer
│   │   └── AboutPage.jsx           # About page content
│   ├── data/
│   │   └── announcements.json      # Stories data (you edit this)
│   ├── lib/
│   │   └── supabase.js             # Supabase client
│   ├── styles/
│   │   └── globals.css             # Tailwind + custom styles
│   ├── App.jsx                     # Main app
│   └── main.jsx                    # Entry point
├── data/
│   └── announcements.json          # Backup/reference
├── .env.example                    # Environment template
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── README.md
```

## How to Update Announcements/Stories

1. Add image to: `public/assets/announcements/story-X.jpg`
2. Edit: `src/data/announcements.json`
3. Push to GitHub
4. Vercel auto-deploys

## Supabase Tables

- `banks` — Bank master data
- `locations` — Branches, ATMs, remittance centers
- `cities` — City names (AR/EN)
- `special_hours` — Ramadan/Eid hours
- `announcement_reactions` — Like/dislike counts

## Environment Variables (Vercel)

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```
