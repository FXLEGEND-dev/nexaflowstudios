# How To Run The Levarech Website

This website is built as a simple static site. That means you do not need npm, React, Next.js, or any install step.

## Option 1: Open It Directly

1. Open this workspace in VS Code.
2. Open the `website` folder.
3. Double-click `index.html`.
4. It should open in your browser.

## Option 2: Double-Click The Starter File

This is the easiest local server option on this computer.

1. Open the `website` folder in File Explorer.
2. Double-click `start-website.bat`.
3. A terminal window will open.
4. Keep that terminal window open.
5. Go to:

```text
http://localhost:5500
```

To stop the website server, click the terminal window and press `Ctrl+C`.

## Option 3: Use VS Code Live Server

This is the best beginner-friendly option.

1. Open VS Code.
2. Install the extension called **Live Server** by Ritwick Dey.
3. Open `website/index.html`.
4. Right-click inside the file.
5. Click **Open with Live Server**.

The website will open in your browser and update when files change.

## What Each File Does

- `index.html` - the page content and layout
- `styles.css` - the design, colors, spacing, and mobile responsiveness
- `script.js` - the mobile menu, header behavior, and contact form email action

## Important Beginner Note

The contact form currently opens an email to:

```text
shekinahleope24@gmail.com
```

When you have your real email, open `script.js` and replace that email address.

Look for this section:

```js
const businessConfig = {
  contactEmail: "shekinahleope24@gmail.com",
  whatsappNumber: "27680771654",
  whatsappDisplay: "+27 68 077 1654",
};
```

Change only the email address inside the quotes.

## Recommended Next Step

After you preview the site, ask Codex to:

```text
Make the Levarech site ready to publish
```

That can include a real domain email, stronger SEO text, contact details, and hosting guidance.
