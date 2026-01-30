# Update Sponsored Alternatives (n8n, Postiz, AppFlowy)

This guide will help you update the database to set n8n, Postiz, and AppFlowy as sponsored listings with their respective logos and screenshots.

## Step 1: Save Images

Save the attached images from the chat to these locations:

### n8n
1. **Logo** (pink icon with connected nodes):
   - Save to: `public/assets/logos/n8n-logo.png`

2. **Screenshot** (workflow interface with Typeform, Google Sheets, Slack, Email):
   - Save to: `public/assets/screenshots/n8n-workflow.png`

### Postiz
1. **Logo** (white 'p' on purple background):
   - Save to: `public/assets/logos/postiz-logo.png`

2. **Screenshot** (calendar interface showing social media posts):
   - Save to: `public/assets/screenshots/postiz-calendar.png`

### AppFlowy
1. **Logo** (colorful petal icon - purple, cyan, pink, yellow):
   - Save to: `public/assets/logos/appflowy-logo.png`

2. **Screenshot** (project management interface - Mobile App Launch):
   - Save to: `public/assets/screenshots/appflowy-project.png`

## Step 2: Run the Update Script

After saving all images, run the database update script:

```bash
npm run update-sponsored
```

Or directly with tsx:

```bash
npx tsx scripts/update-sponsored-alternatives.ts
```

## What the Script Does

The script will update the database for n8n, Postiz, and AppFlowy with:

- ✅ `submission_plan`: Changed to `'sponsor'`
- ✅ `icon_url`: Set to the respective logo path
- ✅ `screenshots`: Array with the screenshot path
- ✅ `sponsor_featured_until`: Set to 7 days from now
- ✅ `sponsor_priority_until`: Set to 7 days from now
- ✅ `sponsor_paid_at`: Set to current date/time
- ✅ `sponsor_payment_id`: Generated unique payment ID
- ✅ `newsletter_included`: Set to `true`
- ✅ `approved`: Set to `true`
- ✅ `status`: Set to `'approved'`

## Verification

After running the script, you can verify the changes by:

1. Checking the homepage for the featured/sponsored listings
2. Visiting the individual alternative pages to see the logos and screenshots
3. Checking your database to confirm the fields were updated

## Troubleshooting

If the script fails:

1. Make sure MongoDB connection string is set in `.env.local`:
   ```
   MONGODB_URI=your-mongodb-connection-string
   ```

2. Ensure the alternatives exist in the database with slugs: `n8n`, `postiz`, `appflowy`

3. Check that the image paths are correct and accessible

## Notes

- The sponsored status will last for 7 days from when you run the script
- After 7 days, you'll need to run the script again or manually extend the dates
- Images should be optimized for web (PNG format, reasonable file size)
