# China Study Abroad Prep Guide

This project is a static, interactive resource guide for students preparing for a two-week study abroad course in China.

## Included in MVP

- Pre-departure overview and action milestones
- Visa and document guidance section
- Interactive packing checklist with local persistence
- Basic Mandarin phrase cards
- Emergency resource section
- Download links to source documents

## Project Structure

- `index.html`: Main guide page
- `styles.css`: Site styling and responsive layout
- `script.js`: Checklist + phrase-card interactivity
- `data/packing-checklist.json`: Checklist categories and items
- `data/phrases.json`: Phrase card content
- `404.html`: GitHub Pages not-found page
- `China Packing List.docx`: Uploaded source document
- `ItineraryOnly (1).pdf`: Uploaded source document

## Run Locally

Use any static server extension/tool in VS Code. For quick preview, open `index.html` directly in a browser.

## Publish to GitHub Pages (Main Branch)

1. Create a GitHub repository and connect it as remote:
   - `git init`
   - `git add .`
   - `git commit -m "Initial interactive prep guide"`
   - `git branch -M main`
   - `git remote add origin https://github.com/<your-username>/<repo-name>.git`
   - `git push -u origin main`
2. In GitHub repository settings:
   - Go to **Settings > Pages**
   - Under **Build and deployment**, choose **Deploy from a branch**
   - Select branch `main`, folder `/ (root)`
3. Wait 1-3 minutes, then open:
   - `https://<your-username>.github.io/<repo-name>/`

## Next Content Task

Replace placeholder policy language in the Visa and Emergency sections with verified details from your university program office and uploaded sources.
