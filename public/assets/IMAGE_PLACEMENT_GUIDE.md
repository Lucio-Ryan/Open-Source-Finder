# Image Placement Guide for Sponsored Alternatives

Please save the attached images from the chat to the following locations:

## n8n
- **Logo**: Save the n8n logo (pink icon with connected nodes) as:
  - `public/assets/logos/n8n-logo.png`
  
- **Screenshot**: Save the n8n workflow screenshot (showing Typeform, Google Sheets, Slack, Email workflow) as:
  - `public/assets/screenshots/n8n-workflow.png`

## Postiz
- **Logo**: Save the Postiz logo (white 'p' on purple background) as:
  - `public/assets/logos/postiz-logo.png`
  
- **Screenshot**: Save the Postiz calendar screenshot (showing social media calendar interface) as:
  - `public/assets/screenshots/postiz-calendar.png`

## AppFlowy
- **Logo**: Save the AppFlowy logo (colorful petal icon with purple, cyan, pink, yellow) as:
  - `public/assets/logos/appflowy-logo.png`
  
- **Screenshot**: Save the AppFlowy project management screenshot (showing Mobile App Launch project) as:
  - `public/assets/screenshots/appflowy-project.png`

---

## After saving the images:

Run the database update script:
```bash
npm run ts-node scripts/update-sponsored-alternatives.ts
```

Or with tsx:
```bash
npx tsx scripts/update-sponsored-alternatives.ts
```
