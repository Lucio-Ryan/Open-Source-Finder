# OPEN_SRC.ME

A directory platform for discovering open source alternatives to popular proprietary software. Built with Next.js, MongoDB, and optimized for Vercel deployment.

![OPEN_SRC.ME](https://via.placeholder.com/1200x630/0d0d0d/3ecf8e?text=OPEN_SRC.ME)

## Features

- 🔍 **Search & Discovery** - Quickly find open source alternatives to any proprietary tool
- 📂 **Browse by Category** - Explore organized categories like project management, communication, design
- 🏷️ **Filter by Tags** - Narrow down by features like self-hosted, privacy-focused, AI-powered
- 💻 **Tech Stack View** - Find tools by programming language and technology
- 📊 **Health Scores** - Evaluate projects using GitHub metrics and activity
- 🌐 **Self-Hosted Section** - Dedicated view for self-hostable solutions
- ✉️ **Newsletter** - Stay updated on new open source alternatives
- 📝 **Community Submissions** - Submit new projects that get automatically added after approval

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jose + bcryptjs)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/opensrcme.git
cd opensrcme
```

2. Install dependencies:
```bash
npm install
```

3. Set up MongoDB:
   - **Option A (Local):** Install MongoDB locally and start the service
   - **Option B (Atlas):** Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas) and get your connection string

4. Configure environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your MongoDB credentials:
```
MONGODB_URI=mongodb://localhost:27017/opensrcme
JWT_SECRET=your-super-secret-jwt-key
```

For MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The MongoDB database includes the following collections:

- **users** - User accounts with authentication
- **alternatives** - Open source software entries
- **categories** - Software categories (Project Management, Communication, etc.)
- **techstacks** - Programming languages and frameworks
- **tags** - Feature tags (Self-Hosted, Privacy-Focused, etc.)
- **proprietarysoftwares** - Proprietary software that alternatives replace
- **votes** - User votes on alternatives
- **discussions** - Discussion threads on alternatives
- **discussionvotes** - User votes on discussions
- **creatornotifications** - Notifications for project creators
- **advertisements** - Ad placements
- **sessions** - User authentication sessions

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (submit, search, etc.)
│   ├── alternatives/       # Alternatives listing and details
│   ├── alternatives-to/    # Alternatives to specific software
│   ├── categories/         # Category pages
│   ├── tags/               # Tag-based filtering
│   ├── tech-stacks/        # Tech stack filtering
│   ├── self-hosted/        # Self-hosted alternatives
│   ├── search/             # Search functionality
│   ├── submit/             # Project submission form
│   ├── about/              # About page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── layout/             # Header, Footer
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── mongodb/            # MongoDB connection, models, and queries
│   └── auth/               # Authentication context and utilities
├── types/
│   └── index.ts            # TypeScript interfaces
```

## Deployment

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and configure the build

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/opensrcme)

### Environment Variables

No environment variables are required for basic functionality. For production, you may want to add:

- `NEXT_PUBLIC_SITE_URL` - Your production URL
- Database connection strings (if adding a backend)

## Customization

### Adding New Alternatives

Edit `src/data/alternatives.ts` to add new entries:

```typescript
{
  id: 'unique-id',
  name: 'Project Name',
  slug: 'project-name',
  description: 'Short description',
  website: 'https://example.com',
  github: 'https://github.com/owner/repo',
  stars: 10000,
  categories: ['category-slug'],
  tags: ['self-hosted', 'privacy-focused'],
  alternativeTo: ['proprietary-software-slug'],
  isSelfHosted: true,
  healthScore: 90,
  pricing: 'open-source',
  createdAt: '2024-01-01',
}
```

### Adding New Categories

Add to the `categories` array in `src/data/alternatives.ts`:

```typescript
{
  id: 'unique-id',
  name: 'Category Name',
  slug: 'category-slug',
  description: 'Description',
  icon: 'IconName', // From lucide-react
  count: 0,
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [OpenAlternative.co](https://openalternative.co)
- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide](https://lucide.dev)
