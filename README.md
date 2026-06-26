# EaseRA 💚

A gentle daily companion for living with **rheumatoid arthritis (RA)**.

- **Log your pain** each day on a simple 1–5 scale and watch the trend over time.
- **Map where it hurts** by tapping joints on a body diagram.
- **Get therapy suggestions** that adapt to your pain level and which joints are flagged.
- **Adjust your exoskeleton** with a live 3D model — waist-strap tightness, assist power, and walking/running mode (modeled on a Hypershell-style hip exoskeleton).
- **Ask the AI assistant** questions about RA, flares, and using the suit.

> ⚠️ **Not medical advice.** EaseRA offers general, supportive information only. It is not a substitute for your rheumatologist or physical therapist, and the exoskeleton concept it controls is a comfort/mobility aid, not a certified medical device. Always check with your care team before changing your routine.

---

## What you need (all free)

1. A [GitHub](https://github.com) account
2. A [Vercel](https://vercel.com) account (sign in with GitHub — easiest)
3. An [Anthropic API key](https://console.anthropic.com) for the chat assistant

---

## Get your website live in ~5 minutes

### Step 1 — Put the code on GitHub
1. Create a new repository on GitHub (e.g. `easera`). Leave it empty.
2. Upload this whole folder to it. Two ways:
   - **Easiest (no terminal):** on your new repo page click **“uploading an existing file”** and drag in everything from this folder.
   - **With Git:**
     ```bash
     cd easera
     git init
     git add .
     git commit -m "EaseRA initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR-USERNAME/easera.git
     git push -u origin main
     ```

### Step 2 — Import into Vercel
1. Go to [vercel.com/new](https://vercel.com/new).
2. Click **Import** next to your `easera` repository.
3. Vercel auto-detects Vite — you don’t need to change the build settings.

### Step 3 — Add your API key (this powers the chat)
Still on the Vercel import screen (or later under **Settings → Environment Variables**):
1. Add a variable named **`ANTHROPIC_API_KEY`**
2. Paste your Anthropic key as the value
3. Save.

### Step 4 — Deploy
Click **Deploy**. After about a minute Vercel gives you your public URL, like:

```
https://easera.vercel.app
```

That’s your live website. Open it on your phone and add it to your home screen. 🎉

> If you added the API key *after* the first deploy, go to the **Deployments** tab and click **Redeploy** once so the key takes effect.

---

## Run it on your own computer (optional)

```bash
npm install
cp .env.example .env      # then paste your real key into .env
npm run dev
```

Open the address it prints (usually http://localhost:5173).

> Note: the chat assistant talks to a serverless function in `/api`. When running locally with `npm run dev`, install the Vercel CLI and use `vercel dev` instead of `npm run dev` if you want the chat to work locally too. The rest of the app (logging, body map, therapies, 3D suit) works fully with plain `npm run dev`.

---

## How it’s built

```
easera/
├── api/
│   └── chat.js          ← serverless backend; holds your API key, calls Claude
├── src/
│   ├── App.jsx          ← the whole app (UI, 3D suit, logic)
│   ├── main.jsx         ← React entry point
│   └── index.css        ← base styles
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

- **Frontend:** React + Vite, three.js (3D exoskeleton), Recharts (pain trend), lucide-react (icons).
- **Backend:** one serverless function that forwards chat messages to the Anthropic API so your key is never exposed in the browser.
- **Your data** (pain logs, flagged joints, suit settings) is stored privately in your own browser via `localStorage` — nothing is uploaded to a server.

## Customizing
- Change colors in the `:root` block near the top of `src/App.jsx`.
- Edit therapy suggestions in the `recommend()` function in `src/App.jsx`.
- Adjust the assistant’s tone in the `sys` prompt inside `App.jsx`, or the model in `api/chat.js`.

---

Made with care for Nikki. Be gentle with yourself today. 💛
