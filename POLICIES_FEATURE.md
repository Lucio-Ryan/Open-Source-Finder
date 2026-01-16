# Site Policies Feature

This feature allows administrators to manage legal policies (Privacy Policy, Terms of Service, and Refund Policy) through a WYSIWYG editor.

## Components Created

### Database Schema (MongoDB)
- **Model**: `Policy` in `src/lib/mongodb/models.ts`
- Fields: type, title, content, updated_by, created_at, updated_at

### Public Pages
- `/privacy` - Privacy Policy page
- `/terms` - Terms of Service page
- `/refund` - Refund Policy page

### Admin Interface
- `/admin/policies` - WYSIWYG editor for managing all policies
  - TipTap rich text editor with formatting toolbar
  - Live preview
  - Admin-only access with role verification

### API Endpoints
- `GET /api/policies` - Fetch all policies
- `GET /api/policies/[type]` - Fetch specific policy (privacy/terms/refund)
- `PUT /api/policies` - Update policy (admin only, requires authentication)

## Setup Instructions

1. **Seed the initial policies** to MongoDB:
   ```bash
   npx tsx scripts/seed-policies.ts
   ```

2. **Access the admin editor**:
   - Log in as an admin user
   - Navigate to `/admin/policies`
   - Select a policy from the sidebar
   - Edit using the WYSIWYG editor
   - Click "Save Changes"

3. **View public policies**:
   - Visit `/privacy`, `/terms`, or `/refund`
   - Policies display with proper formatting and styling

## Features

- ✅ Rich text editing with TipTap (bold, italic, headings, lists, links)
- ✅ Live preview while editing
- ✅ Admin authentication required for updates
- ✅ Responsive dark theme design
- ✅ Last updated timestamp
- ✅ Pre-populated with comprehensive policy templates

## Technical Details

- **Editor**: TipTap with StarterKit, Link, and Placeholder extensions
- **Authentication**: JWT token from cookies, admin role verification
- **Database**: MongoDB with Mongoose ORM
- **Styling**: Tailwind CSS with prose styling for content display
