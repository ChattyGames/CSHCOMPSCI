# Chatfield CS · Cyber · AI — program website

A static, multi-page site (plain HTML, CSS and JavaScript). No build step, no framework, nothing to install. It deploys on Vercel as-is.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: parallax hero, Chatty Arcade (playable, loads only on Press start), the three pathways, lab and AI teasers, featured student work |
| `courses.html` | 2027–28 lineup with filters, course detail pop-ups, pathway map, independent study |
| `pathways.html` | One pathway at a time, course by course: prerequisite, ACC college credit and certification prep for each stop |
| `credentials.html` | Credit & Credential Map: pick a certification and the matching courses light up |
| `lab.html` | Chatty Hackville, CyberPatriot, The User Agreement |
| `ai.html` | How the program uses AI, local AI, AI courses, the AI Symposium, family FAQ |
| `showcase.html` | Student games, projects and class materials (driven by `data/showcase.json`) |
| `join.html` | Get started: steps, FAQ, industry partners, instructor |
| `404.html` | Not-found page |

## Deploy to Vercel

**Option A: dashboard (no command line)**
1. Unzip `program-website.zip`.
2. Put the folder in a GitHub repo (github.com → New repository → "uploading an existing file" → drag the folder's contents in → Commit).
   GitHub's web upload refuses files over 25 MB, and Chatty Arcade's `showcase/chatty-arcade/index.wasm` is about 38 MB. Upload everything else in the browser, then add that one file with GitHub Desktop or `git push`, or skip GitHub and use Option B.
3. At vercel.com → Add New… → Project → Import that repo.
4. Framework Preset: **Other**. Leave Build Command and Output Directory empty. Click **Deploy**.
5. Every later commit to the repo redeploys the site automatically.

**Option B: Vercel CLI**
```
npm i -g vercel
cd program-website
vercel          # first run links the project; accept the defaults
vercel --prod   # publish to your production URL
```

`vercel.json` only sets caching. Pages keep their `.html` addresses on purpose: "clean URLs" would redirect `showcase/<game>/index.html` to a folder address without the final slash, and HTML5 game exports (Godot, Construct, Unity) then can't find their own files. Leave it off.

## Preview on your own computer

The showcase reads a JSON file, which browsers block when you double-click an HTML file. Run a tiny local server instead:
```
cd program-website
python3 -m http.server 8000      # then open http://localhost:8000
```
(`npx serve .` works too.)

## Add a student game, project or class material

Edit **one file**: `data/showcase.json`. Copy an item, change the fields, save, commit. Nothing else changes.

```json
{
  "id": "snake-remix",
  "title": "Snake Remix",
  "type": "game",
  "course": "Coding 1",
  "description": "A two-player snake game with power-ups.",
  "thumbnail": "showcase/snake-remix/thumb.png",
  "play": "showcase/snake-remix/index.html",
  "link": "",
  "credit": "Team Bit Shift",
  "date": "2027",
  "tags": ["Construct 3"],
  "featured": true
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `title`, `type`, `course` | yes | `type` is `game`, `project` or `material`. `course` becomes a filter option automatically. |
| `description` | recommended | One or two sentences. |
| `thumbnail` | recommended | A file in `showcase/…` or an `https://` image. 16:10 looks best (e.g. 640×400). |
| `play` | optional | Opens inside the site in a player window. Use a folder you added (`showcase/<name>/index.html`) or an `https://` embed URL (itch.io embed, Scratch `/embed`, Google Slides `/embed`). |
| `link` | optional | Opens in a new tab (itch.io page, GitHub, Google Drive, a guide hosted elsewhere). |
| `credit` | optional | First names or a team name only. |
| `featured` | optional | `true` puts it on the home page (first three). |
| `sample` | optional | Shows a "Sample" badge. Delete the sample items once you have real ones. |

**HTML5 game exports** (Construct 3 → Export → Web (HTML5); Godot → Export → Web; Unity → WebGL): put the exported folder in `showcase/<game-name>/`, then set `play` to `showcase/<game-name>/index.html`. `showcase/packet-dodge/` is a working example of this, and `showcase/chatty-arcade/` is a full Godot 4 export.

**Godot web exports:** export with Thread Support off (Chatty Arcade's is), so Vercel needs no special headers. Vercel already serves `.wasm` and `.pck` with the right content types. The first load is big (Chatty Arcade is about 40 MB), so say so in the card's description.

Tip: JSON is picky. Keep the quotes, and put a comma between items but not after the last one. If the showcase shows "could not load", paste the file into jsonlint.com to find the typo.

## Edit course information

All course names, taglines, tags, prerequisites, ACC college credit and certifications live in `data/courses.js`. The courses page, pathways page, pathway map, credential map and home page all read from it, so one edit updates everywhere.

ACC credit: every course with an `acc` entry shows as approved concurrent enrollment credit. CNG networking courses aren't approved yet, so none are listed; when one is, add its `acc` code to the matching course.

Prerequisites: only the ones in the lineup PDF are listed (Algebra 1 for AP CSP, Algebra II for Data Science). Add a `prereq` line to any course to show one on the pathways page.

## Chatty Arcade on the home page

The game lives in `showcase/chatty-arcade/`. The home page shows a poster (`assets/img/arcade-poster.jpg`) and only loads the 40 MB game when someone presses start. To update the game, replace that folder with a new Godot web export (Thread Support off), keeping the entry file named `index.html`.

## Placeholders to fill

Search the pages for `ph` (dashed yellow boxes on the site):

- Program email (footer, `join.html`) and meeting day/time/room for CyberPatriot (`lab.html`)
- AI Symposium date, time, place and RSVP (`ai.html`)
- Instructor name, school email, room and photo (`join.html`)
- Industry partner logos (`join.html`)
- Lab, CyberPatriot and Symposium photos (`lab.html`, `ai.html`). Put images in `assets/img/` and replace the dashed `ph-box` div with `<img src="assets/img/lab-1.jpg" alt="Describe the photo">`. No student faces without permission.

## Brand

Black ground with hot pink (`#ff2d78`), teal (`#00e5cc`) and yellow (`#ffd60a`). Teal marks Computer Science, pink marks Cybersecurity, yellow marks AI. Type: Archivo (expanded) for headings, IBM Plex Sans for text, JetBrains Mono for labels. All colors are variables at the top of `assets/css/site.css`.

The hero art is the horse from the course lineup PDF, recolored to the brand pink.

## Motion and accessibility

Parallax, the animated packets and the ticker turn off automatically for anyone who has "reduce motion" set on their device. Pages have a skip link, keyboard focus outlines, and work down to phone width.

## Student AI projects (Chatty GPT Studio)

The showcase page opens with a Chatty GPT Studio section (`showcase.html#studio`), and the home page shows a teaser with the live project count.

- Edit `data/projects.js` to add, rename or remove projects. Each project needs a lane (`investigate`, `build`, `campaign` or `play`), a title, a format, a hook, a short description and "the test".
- Set `featured: true` on one project to make it the big spotlight card. Right now that's the Jetson cybersecurity assistant.
- Set `status` to something like "Done" or "At the Symposium" when a project finishes. It shows "In progress" by default.
- Public site rules: no student names, no photos of students, nothing that identifies a student. Describe each project by what it does.

## Contact

The program email is jj.moss@jeffco.k12.co.us. It appears in the footer, on the Get started page for partners, and under Meet the instructor.
