VENIAA SHOOTS WEBSITE: HOW TO FINISH AND PUBLISH IT
====================================================

FOLDER
  index.html      All text and sections.
  css/style.css   Colours, fonts, layout, animations.
  js/main.js      Booking form and WhatsApp. Settings are at the very top.
  images/         Logo and tab icon.
  videos/         Reel videos: reel-1.mp4 to reel-6.mp4.

1. OPEN IN VS CODE
  - Install VS Code (code.visualstudio.com) and the "Live Server" extension.
  - File > Open Folder > choose this "veniaa-shoots" folder.
  - Right-click index.html > "Open with Live Server". Saved changes appear instantly.

2. RECENT WORK VIDEOS
  Each reel uses three files:
    videos/reel-N.mp4           full video with sound (opens when tapped)
    videos/reel-N-preview.mp4   8-second silent loop shown on the card
    images/reel-N.jpg           cover image shown while the video loads
  To change a reel's name, category or length label, open index.html, press Ctrl+F,
  search "REEL 1" (or 2, 3 ...) and edit the text in that card.
  To add a 7th reel, copy one whole card (from <!-- REEL ... --> to </a>) and change the
  file names. If you only have the full video, set data-preview to the same file.
  Keep each full video under about 10 MB (MP4, vertical 9:16) so the site stays fast.

3. REPLACE THE SAMPLE CONTENT
  - In index.html press Ctrl+F and search "Sample". Each result is something to replace:
    client reviews, two FAQ answers.
  - When everything is real, delete the lines that contain class="sample-note".

4. LEADS
  - WhatsApp number: js/main.js, line "whatsapp:". Already set to 919063185111.
  - Optional automatic alert: paste your CallMeBot key into "apikey:".
  - Optional Google Form record: fill the entry IDs in "entries:".

5. PUBLISH (FREE)
  - Go to app.netlify.com/drop and drag the whole veniaa-shoots folder onto the page.
  - Create a free account when asked so the site stays online.
  - Site settings > change the site name (for example veniaa-shoots.netlify.app).
  - To update later: drag the folder again in the site's Deploys tab.

6. TEST AND HAND OVER
  - Open the live link on a phone. Play a reel, tap Book your shoot, submit a test enquiry,
    and check WhatsApp opens with the details.
  - Put the link in the Instagram bio.
