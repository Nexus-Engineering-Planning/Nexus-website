const fs = require('fs');
const path = require('path');

// Path to jobs.json and output folder
const JOBS_PATH = path.join(__dirname, 'jobs.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'jobs');

// Convert WAT to ISO-compliant timezone
function formatDate(dateStr) {
  return new Date(dateStr.replace(/WAT/i, '+01:00'));
}

// Template for individual job HTML
function createJobHtml(job) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${job.title} | Careers at Nexus</title>
  <meta name="description" content="${job.summary}" />
  <link rel="stylesheet" href="/css/style.css" />
</head>
<body>
  <div id="global-header"></div>
  <section class="job-details container">
    <h1>${job.title}</h1>
    <p><strong>Company:</strong> ${job.company}</p>
    <p><strong>Location:</strong> ${job.location}</p>
    <p><strong>Type:</strong> ${job.type}</p>
    <p><strong>Start Date:</strong> ${job.startDate}</p>
    <p><strong>Application Deadline:</strong> ${job.deadline}</p>
    <p>${job.summary}</p>
    <h2>Why This Role Matters</h2><p>${job.whyItMatters}</p>
    <h2>Your Mission</h2><p>${job.responsibilities}</p>
    <h2>Stack</h2>
    <ul>
      ${Object.entries(job.stack).map(([key, val]) =>
        `<li><strong>${key}:</strong> ${val.join(', ')}</li>`).join('')}
    </ul>
    <h2>Requirements</h2>
    <ul>${job.requirements.map(r => `<li>${r}</li>`).join('')}</ul>
    <h2>Bonus</h2>
    <ul>${job.bonuses.map(b => `<li>${b}</li>`).join('')}</ul>
    <h2>Terms</h2>
    <ul>${job.terms.map(t => `<li>${t}</li>`).join('')}</ul>
    <p><strong>Apply:</strong> <a href="${job.applicationLink}" target="_blank">${job.applicationLink}</a></p>
  </section>
  <div id="global-footer"></div>
  <script src="/js/header-footer-loader.js" defer></script>
</body>
</html>`;
}

// Main execution logic
function main() {
  const now = new Date();
  const jobs = JSON.parse(fs.readFileSync(JOBS_PATH, 'utf-8'));

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const activeSlugs = [];

  jobs.forEach(job => {
    const deadline = formatDate(job.deadline);
    if (now > deadline) {
      console.log(`⏩ Skipping expired job: ${job.title}`);
      return;
    }

    const slug = job.slug || 'job-' + job.title.toLowerCase().replace(/\s+/g, '-');
    activeSlugs.push(slug);

    const outFile = path.join(OUTPUT_DIR, `${slug}.html`);
    const html = createJobHtml(job);
    fs.writeFileSync(outFile, html);
    console.log(`✅ Generated: ${outFile}`);
  });

  // Delete any orphaned files (expired job pages)
  const existingFiles = fs.readdirSync(OUTPUT_DIR);
  existingFiles.forEach(file => {
    if (!file.endsWith('.html')) return;
    const slug = file.replace(/\.html$/, '');
    if (!activeSlugs.includes(slug)) {
      const toDelete = path.join(OUTPUT_DIR, file);
      fs.unlinkSync(toDelete);
      console.log(`🗑️ Deleted expired file: ${toDelete}`);
    }
  });
}

// Execute
main();
