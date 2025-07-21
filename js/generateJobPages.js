const fs = require('fs');
const path = require('path');

// Path to jobs.json and output folder
const JOBS_PATH = path.join(__dirname, 'js', 'jobs.json');
const OUTPUT_DIR = path.join(__dirname, 'jobs');

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
  
  <!-- Social Media Meta Tags -->
  <meta property="og:title" content="${job.title} | Careers at Nexus" />
  <meta property="og:description" content="${job.summary}" />
  <meta property="og:image" content="../images/jobs/${job.slug}-preview.png" />
  <meta property="og:url" content="https://www.nexuseng.org/jobs/${job.slug}.html" />
  
  <!-- Changed to relative path -->
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="icon" href="../images/logo.png" type="image/png" />
  <style>
    .job-details.container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      line-height: 1.6;
    }
    .job-details h1 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }
    .job-details h2 {
      color: #2c3e50;
      margin-top: 2rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;
    }
    .job-details ul {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }
    .job-details li {
      margin-bottom: 0.5rem;
    }
    .job-details strong {
      color: #2c3e50;
    }
    .apply-cta {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
  </style>
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
    
    <h2>Why This Role Matters</h2>
    <p>${job.whyItMatters}</p>
    
    <h2>Your Mission</h2>
    <p>${job.responsibilities}</p>
    
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
    
    <div class="apply-cta">
      <a href="${job.applicationLink}" target="_blank" rel="noopener noreferrer" class="btn-primary" aria-label="Apply for ${job.title} position">
        Apply Now
      </a>
      <p class="small-text">Application deadline: ${job.deadline}</p>
    </div>
  </section>
  
  <div id="global-footer"></div>
  
  <!-- Changed to relative path -->
  <script src="../js/header-footer-loader.js" defer></script>
</body>
</html>`;
}

// Main execution logic
function main() {
  const now = new Date();
  const jobs = JSON.parse(fs.readFileSync(JOBS_PATH, 'utf-8'));

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const activeSlugs = [];

  jobs.forEach(job => {
    const deadline = formatDate(job.deadline);
    if (now > deadline) {
      console.log(`⏩ Skipping expired job: ${job.title}`);
      return;
    }

    const slug = job.slug || 'job-' + job.title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    activeSlugs.push(slug);

    const outFile = path.join(OUTPUT_DIR, `${slug}.html`);
    const html = createJobHtml({ ...job, slug });
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