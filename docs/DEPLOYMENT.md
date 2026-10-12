# SAMUHIA website — from zero to live on Firebase Hosting

Every command below is for **Windows Command Prompt (CMD)**. macOS/Linux users can run the same commands in a terminal (only the folder-changing and file-copy commands differ; they are noted).

Total time: about 20 minutes the first time.

---

## Part 1 — Install the tools (one time only)

Open **CMD** (press `Win`, type `cmd`, Enter).

```cmd
winget install OpenJS.NodeJS.LTS
winget install Git.Git
```

**Close CMD and open a new one** (so the tools are found), then confirm:

```cmd
node -v
npm -v
git --version
```

`node -v` must show **v18.11 or higher** (v22 LTS recommended).
No `winget`? Download Node LTS from https://nodejs.org and Git from https://git-scm.com instead.

Install the Firebase CLI:

```cmd
npm install -g firebase-tools
firebase --version
```

---

## Part 2 — Unpack the project

Put `samuhia-website.zip` in `C:\Projects` (create the folder if needed), then:

```cmd
mkdir C:\Projects
cd C:\Projects
tar -xf samuhia-website.zip
cd samuhia-website
```

(`tar` is built into Windows 10/11. Or right-click the zip → *Extract All*.)

Install the project's one dev dependency (`sharp`, used only to regenerate icons):

```cmd
npm install
```

---

## Part 3 — Build and preview locally

```cmd
npm run build
```

You should see `Built 24 pages` and `All SEO and link checks passed.`

Start the live-reload dev server (rebuilds automatically when you edit anything in `src`):

```cmd
npm run dev
```

Open **http://localhost:5001**. Press `Ctrl + C` to stop.

To preview exactly what Firebase will serve, including its headers:

```cmd
npm run build
npm run emulate
```

Open the URL it prints (normally http://localhost:5000).

---

## Part 4 — Create the Firebase project

### 4a. Log in

```cmd
firebase login
```

A browser window opens. Sign in with the Google account that will own the site.

### 4b. Create the project

Pick a globally unique project ID (lowercase letters, numbers, hyphens), for example `samuhia-website`:

```cmd
firebase projects:create samuhia-website --display-name "SAMUHIA"
```

If it says the ID is taken, try `samuhia-ke-site` or similar. (You can also create it at https://console.firebase.google.com → *Add project*, and skip Google Analytics.)

### 4c. Point the project at it

```cmd
firebase use --add
```

Choose your project, give it the alias `default`. This updates `.firebaserc`.
Or edit `.firebaserc` by hand and replace `your-firebase-project-id`:

```cmd
notepad .firebaserc
```

### 4d. Enable Hosting

Hosting is enabled automatically on first deploy. `firebase.json` is already configured, so **do not run `firebase init`** (it would overwrite the security headers and clean-URL settings).

---

## Part 5 — Set your real domain before the first deploy

The site defaults to `https://samuhia.co.ke`. If your domain is different, change it once in `src\content\site.json`:

```cmd
notepad src\content\site.json
```

Edit `"url"`, then save. This value drives every canonical URL, the sitemap, Open Graph tags, JSON-LD, `robots.txt` and `llms.txt`.

Recommended: also fill in these fields in the same file before launch:

| Field | Why |
|---|---|
| `social` | e.g. `[{ "name": "LinkedIn", "url": "https://linkedin.com/company/..." }]` — adds `sameAs` links that help search engines and AI assistants confirm your identity |
| `verification.google` | The token from Google Search Console (Part 8) |

And in `src\content\founder.json`: add `"image": "/assets/founder.jpg"` (put the photo in `src\assets\`) plus your LinkedIn/GitHub in `links`.

---

## Part 6 — Test on a temporary preview URL (safe, not indexed)

```cmd
npm run deploy:preview
```

This builds with `noindex`, uploads to a temporary channel that expires in 7 days, and prints a URL such as `https://samuhia-website--preview-xxxx.web.app`. Click through it on your phone and desktop.

---

## Part 7 — Deploy to live

```cmd
npm run deploy
```

This runs the full validation (`npm run check`, which stops on any broken link, missing `<h1>`, duplicate title or invalid JSON-LD) and then `firebase deploy --only hosting`.

Your site is live at `https://YOUR-PROJECT-ID.web.app` and `https://YOUR-PROJECT-ID.firebaseapp.com`.

> The live URL will serve pages whose canonical URL is your custom domain. That is correct. Do the domain step next so the two agree.

### Connect your custom domain

1. Open https://console.firebase.google.com → your project → **Hosting** → **Add custom domain**.
2. Enter `samuhia.co.ke` and follow the wizard. It shows DNS records (an `A` record pair or a `TXT` verification record).
3. Add those records at your domain registrar's DNS page (for `.co.ke`, that is your registrar or KENIC-accredited registrar).
4. Add the `www` version in the same wizard and choose **Redirect** to `samuhia.co.ke`, so there is one canonical hostname.
5. Wait for the status to become *Connected*. SSL is issued automatically (minutes to a few hours).

Check DNS from CMD:

```cmd
nslookup samuhia.co.ke
nslookup -type=TXT samuhia.co.ke
```

---

## Part 8 — Get found: search engines and AI assistants

### Google Search Console

1. Go to https://search.google.com/search-console → **Add property** → *URL prefix* → `https://samuhia.co.ke/`.
2. Choose **HTML tag** verification and copy the `content` token only.
3. Paste it into `src\content\site.json` under `verification.google`, then redeploy:

```cmd
npm run deploy
```

4. Click **Verify** in Search Console.
5. **Sitemaps** → submit `sitemap.xml`.
6. **URL Inspection** → paste your home URL → **Request indexing**. Repeat for `/products/` and each product page.

### Bing Webmaster Tools (also feeds ChatGPT search, Copilot and DuckDuckGo)

1. https://www.bing.com/webmasters → sign in → **Import from Google Search Console** (fastest), or add the site and paste the token into `verification.bing`.
2. Submit `https://samuhia.co.ke/sitemap.xml`.

### Verify the LLM-facing files are live

```cmd
curl -I https://samuhia.co.ke/llms.txt
curl https://samuhia.co.ke/llms.txt
curl -I https://samuhia.co.ke/products/plot-yangu/index.md
curl https://samuhia.co.ke/robots.txt
curl https://samuhia.co.ke/sitemap.xml
```

Expect `200`, `Content-Type: text/plain` for `.txt` and `text/markdown` for `.md`.

### Validate structured data

- https://search.google.com/test/rich-results — paste your home page and a product page URL.
- https://validator.schema.org — paste the same URLs.

### Check speed and accessibility

- https://pagespeed.web.dev — test the home page (mobile).

---

## Part 9 — Everyday workflow

### Change text, prices, FAQs, features

All copy is in JSON files under `src\content`. No code needed.

| To change | Edit |
|---|---|
| Company details, nav, footer, phone/email, social | `src\content\site.json` |
| Home page copy and home FAQ | `src\content\home.json` |
| A product (features, plans, prices, FAQ, related) | `src\content\products\<slug>.json` |
| Solutions | `src\content\solutions.json` |
| About / Founder / Security | `about.json`, `founder.json`, `security.json` |
| Page titles and meta descriptions for inner pages | `src\content\pages.json` |

```cmd
notepad src\content\products\plot-yangu.json
npm run dev
```

Then publish:

```cmd
npm run deploy
```

### Add a new product

1. Copy an existing file: `copy src\content\products\mychama.json src\content\products\newproduct.json`
2. Edit it (`slug`, `name`, `order`, `color`, plans, FAQs …).
3. Add its logo files to `src\assets\brand\` named `<slug>-icon.svg`, `<slug>-symbol.svg`, `<slug>-lockup.svg`, `<slug>-lockup-reversed.svg` and add an entry for it in `src\assets\brand\brand.json`.
4. Add a `solution` entry in `solutions.json` if relevant.
5. `npm run check`, then `npm run deploy`. The page, sitemap entry, `llms.txt` line, JSON-LD and Markdown twin are all generated for you.

### Change a logo

Replace the SVGs in `src\assets\brand\`, then regenerate favicon, app icons and the social image:

```cmd
npm run icons
npm run build
```

### Publish the placeholder pages

`resources`, `privacy` and `terms` ship with `"draft": true` in `src\content\pages.json`, which sets `noindex` and keeps them out of the sitemap. Once you have real content, remove that line (or set it to `false`).

### Roll back a bad release

Firebase Console → **Hosting** → **Release history** → ⋮ on a previous release → **Rollback**. Every deploy is kept, so rollback is instant.

---

## Part 10 (optional) — Automatic deploys from GitHub

Create an empty repo on GitHub, then in the project folder:

```cmd
git init
git add .
git commit -m "Initial SAMUHIA website"
git branch -M main
git remote add origin https://github.com/YOUR-ORG/samuhia-website.git
git push -u origin main
```

Let Firebase set up the secrets and workflow files for you:

```cmd
firebase init hosting:github
```

Answer: your repo `YOUR-ORG/samuhia-website`; **no** to "set up a build script"; live branch `main`. If it offers to overwrite the two files in `.github\workflows`, answer **no** to keep the versions provided here (they run the strict validation and use `noindex` previews), and just replace `your-firebase-project-id` inside them with your real project ID.

From then on: every pull request gets a preview URL, and every merge to `main` deploys to live.

---

## Part 11 (optional) — Contact form with a real backend

Out of the box the form opens the visitor's email app (no server needed). To receive messages directly:

1. Create a form endpoint (Formspree, Getform, Basin, or your own Cloud Function).
2. Put its URL in `src\content\site.json` → `contact.formEndpoint`.
3. Allow it in `firebase.json`: add the endpoint's origin to `connect-src` and `form-action` in the `Content-Security-Policy` header, e.g. `connect-src 'self' https://formspree.io`.
4. `npm run deploy`.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `'firebase' is not recognized` | Close and reopen CMD. If it persists: `npm config get prefix`, and add that folder to your PATH. |
| `Error: Failed to get Firebase project` | Run `firebase use --add` or fix `.firebaserc`. |
| `Error: HTTP Error: 403` / permission | `firebase logout` then `firebase login` with the account that owns the project. |
| Build says `broken link` | It names the page and link. Fix the `href` in the content JSON. |
| Fonts look different locally | They load from Google Fonts; you need internet. |
| Changes don't show after deploy | Hard refresh (`Ctrl + F5`). HTML is cached for 5 minutes; CSS/JS filenames change automatically on every edit. |
| Preview shows "noindex" | Correct: previews and `npm run dev` use `--noindex`. `npm run build` / `npm run deploy` do not. |

## Command cheat-sheet

```cmd
npm install          install dev dependency (once)
npm run dev          build + live-reload server on :5001
npm run build        production build into /public
npm run check        build + fail on any SEO/link error
npm run emulate      serve /public with real Firebase Hosting rules
npm run icons        regenerate favicon / app icons / social image
npm run deploy:preview   7-day noindex preview URL
npm run deploy       validate + publish to live
firebase login       sign in
firebase use --add   link this folder to a Firebase project
```
