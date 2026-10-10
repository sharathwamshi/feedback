# feedback.acknowledgerfirst.com – static site

```
/                → booth page (QR codes point here)
/data            → registrations table (asks for the admin key)
config.js        → the ONE setting: SHEET_URL
assets/logo.png  → add your logo here
apps-script.gs   → free Google data store (not uploaded to your host)
CNAME            → custom domain for GitHub Pages
robots.txt       → keeps /data out of search engines
```

The site is plain HTML, CSS and JS with no server. Data is saved in a Google Sheet through a free Google Apps Script. The booth page sends each registration there, and `/data` reads it back as JSON.

## 1. Data store (10 minutes)
1. Create a Google Sheet.
2. Go to Extensions → Apps Script and paste in `apps-script.gs`.
3. Change `ADMIN_KEY` to a secret of your own. This is the password for `/data`.
4. Go to Deploy → New deployment → Web app.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click Deploy and allow the permissions.
5. Copy the URL that ends in `/exec` and paste it into `config.js` as `SHEET_URL`.

If you change the script later, go to Deploy → Manage deployments → ✏️ → Version: **New version**.

## 2. Logo
Put your logo at `assets/logo.png`, ideally with a transparent background. It appears on both pages and as the browser tab icon.

## 3. Host on feedback.acknowledgerfirst.com
Pick one option.

**Netlify (easiest)**
1. Drag this folder onto https://app.netlify.com/drop.
2. Go to Site settings → Domain management → Add `feedback.acknowledgerfirst.com`.

**GitHub Pages**
1. Push this folder to a repository.
2. Go to Settings → Pages → Deploy from branch. The `CNAME` file is already included.

Then, wherever your DNS for acknowledgerfirst.com is managed, add one record:

```
Type: CNAME    Name: feedback    Value: <your-site>.netlify.app   (or <user>.github.io)
```

HTTPS is issued automatically within a few minutes.

## 4. Test before the event
1. Open https://feedback.acknowledgerfirst.com and submit once.
2. Open https://feedback.acknowledgerfirst.com/data, enter your key, and check the row appears.

## 5. QR codes
Use `https://feedback.acknowledgerfirst.com/?src=entrance`, `?src=code2hire-standee` and so on, so the Source column shows where each visitor came from.

## /data features
- **Live view:** the table refreshes automatically every 30 seconds.
- **Summary cards:** total registrations, average rating, hot leads and demo requests.
- **Product interest:** a bar for each product.
- **Table tools:** search, a "Hot only" filter, and sorting by clicking any column header.
- **Download CSV:** exports whatever is currently shown in the table.
- **Lock:** the key is remembered only for the current browser tab. Tap **Lock** to forget it.

## Notes
- Anyone who opens `/data` without the key sees nothing. The data lives only in your Google Sheet, never in the site files.
- The `/data` page code itself is public. That's fine, because it holds no data.
- If the network drops at the venue, registrations are queued on the visitor's phone and sent when it reconnects.
