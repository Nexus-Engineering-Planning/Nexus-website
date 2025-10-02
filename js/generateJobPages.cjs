const fs = require('fs');
const path = require('path');

// Paths
const JOBS_PATH = path.join(__dirname, '..', 'js', 'jobs.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'jobposts');
const CAREERS_PATH = path.join(__dirname, '..', 'careers.html');

/**
 * Escapes HTML characters to prevent XSS attacks
 * @param {string} unsafe - The string to escape
 * @returns {string} The escaped string
 */
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generates a URL-friendly slug from a title
 * @param {string} title - The title to convert
 * @returns {string} The URL-friendly slug
 */
function generateSlug(title) {
  if (!title) return '';
  return title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Parses and normalizes deadline strings into Date objects
 * Handles various timezone formats (WAT, EST, UTC)
 * @param {string} dateStr - The date string to parse
 * @returns {Date} Parsed date or epoch if invalid
 */
function formatDate(dateStr) {
  if (!dateStr) return new Date(0); // Return epoch if no date
  
  try {
    // Handle various date formats
    const normalizedDateStr = dateStr
      .replace(/WAT/i, '+01:00')    // West Africa Time
      .replace(/EST/i, '-05:00')    // Eastern Standard Time
      .replace(/\s*UTC\s*/i, '+00:00'); // UTC
    
    return new Date(normalizedDateStr);
  } catch (e) {
    console.error(`Invalid date format: ${dateStr}`);
    return new Date(0); // Return epoch as fallback
  }
}

/**
 * Converts deadline string to ISO format for schema.org markup
 * @param {string} deadlineStr - The deadline string to convert
 * @returns {string} ISO 8601 formatted date string
 */
function getValidThroughDate(deadlineStr) {
  const date = formatDate(deadlineStr);
  // Fallback to 30 days from now if parsing fails
  return isNaN(date.getTime()) ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : date.toISOString();
}

// Function to generate job detail HTML with all guards and schema.org markup
function createJobHtml(job) {
  const title = escapeHtml(job.title || 'Job Opportunity');
  const company = escapeHtml(job.company || 'Nexus Engineering & Planning Ltd.');
  const location = escapeHtml(job.location || 'Remote');
  const type = escapeHtml(job.type || 'Full-time');
  const startDate = escapeHtml(job.startDate || 'To be determined');
  const deadline = escapeHtml(job.deadline || 'Open until filled');
  const summary = escapeHtml(job.summary || 'Exciting opportunity at our company');
  const whyItMatters = escapeHtml(job.whyItMatters || 'This role contributes to our mission of...');
  const responsibilities = escapeHtml(job.responsibilities || 'Key responsibilities will include...');
  const applicationLink = escapeHtml(job.applicationLink || 'mailto:support@nexuseng.org');
  
  // Handle optional arrays with fallbacks
  const stackItems = (job.stack || {});
  const requirements = job.requirements || ['Relevant experience in the field'];
  const bonuses = job.bonuses || [];
  const terms = job.terms || ['Competitive compensation package'];
  
  const slug = job.slug || generateSlug(job.title);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Careers at Nexus</title>
  <meta name="description" content="${summary}" />
  
  <!-- Open Graph / Social Media -->
  <meta property="og:title" content="${title} | Careers at Nexus" />
  <meta property="og:description" content="${summary}" />
  <meta property="og:url" content="https://www.nexuseng.org/jobposts/${slug}.html" />
  <meta property="og:type" content="website" />
  
  <!-- Schema.org markup for Google -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": "${title}",
      "description": "${summary}",
      "datePosted": "${new Date().toISOString()}",
      "validThrough": "${getValidThroughDate(job.deadline)}",
      "employmentType": "${type}",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "${company}",
        "sameAs": "https://www.nexuseng.org"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "${location}"
        }
      },
      "applicantLocationRequirements": {
        "@type": "Country",
        "name": "Nigeria"
      }
    }
  </script>
  
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="icon" href="../images/logo.png" type="image/png" />
</head>
<body>
  <div id="global-header"></div>
  <section class="job-details container">
    <h1>${title}</h1>
    ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
    <p><strong>Location:</strong> ${location}</p>
    <p><strong>Type:</strong> ${type}</p>
    <p><strong>Start Date:</strong> ${startDate}</p>
    <p><strong>Application Deadline:</strong> ${deadline}</p>
    <p>${summary}</p>
    
    <h2>Why This Role Matters</h2>
    <p>${whyItMatters}</p>
    
    <h2>Your Mission</h2>
    <p>${responsibilities}</p>
    
    ${Object.keys(stackItems).length > 0 ? `
    <h2>Stack</h2>
    <ul>${Object.entries(stackItems).map(([k, v]) => 
      `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(Array.isArray(v) ? v.join(', ') : v)}</li>`
    ).join('')}</ul>
    ` : ''}
    
    <h2>Requirements</h2>
    <ul>${requirements.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
    
    ${bonuses.length > 0 ? `
    <h2>Bonus</h2>
    <ul>${bonuses.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
    ` : ''}
    
    <h2>Terms</h2>
    <ul>${terms.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
    
    <div class="apply-cta">
      <a href="${applicationLink}" target="_blank" rel="noopener noreferrer" class="btn-primary">Apply Now</a>
      <p class="small-text">Application deadline: ${deadline}</p>
    </div>
  </section>
  <div id="global-footer"></div>
  <script src="../js/header-footer-loader.js" defer></script>
</body>
</html>`;
}

// Function to generate the full careers.html listing with improved guards
function generateCareersHTML(activeJobs) {
  const jobCards = activeJobs.length > 0 
    ? activeJobs.map(job => {
        const slug = job.slug || generateSlug(job.title);
        const title = escapeHtml(job.title || 'Job Opportunity');
        const location = escapeHtml(job.location || 'Remote');
        const type = escapeHtml(job.type || 'Full-time');
        const deadline = escapeHtml(job.deadline || 'Open until filled');
        const summary = escapeHtml(job.summary || 'Exciting opportunity at our company');
        
        return `
          <div class="service-item slide-in-left" itemscope itemtype="https://schema.org/JobPosting">
            <div class="job-details">
              <h3 itemprop="title"><a href="/jobposts/${slug}.html">${title}</a></h3>
              <p><strong>Location:</strong> <span itemprop="jobLocation">${location}</span></p>
              <p><strong>Type:</strong> <span itemprop="employmentType">${type}</span></p>
              <p><strong>Deadline:</strong> <span itemprop="validThrough">${deadline}</span></p>
              <p itemprop="description">${summary}</p>
              <a href="/jobposts/${slug}.html" class="btn-secondary">View Full Description</a>
            </div>
          </div>`;
      }).join('')
    : '<p>No open roles right now. Email your CV to <a href="mailto:support@nexuseng.org">support@nexuseng.org</a>.</p>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Careers | Nexus Engineering & Planning Ltd.</title>
  <meta name="description" content="Explore job openings at Nexus Engineering & Planning Ltd." />
  <meta name="keywords" content="careers, Nexus Engineering, planning jobs, Africa infrastructure, sustainability" />
  
  <!-- Schema.org markup -->
  <!-- Canonical URL -->
  <link rel="canonical" href="https://www.nexuseng.org/careers.html" />

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Careers at Nexus Engineering",
      "description": "Current job openings at Nexus Engineering & Planning Ltd.",
      "publisher": {
        "@type": "Organization",
        "name": "Nexus Engineering & Planning Ltd.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.nexuseng.org/images/logo.png"
        }
      }
    }
  </script>
  
  <link rel="stylesheet" href="/css/style.min.css" />
  <link rel="icon" href="/images/logo.png" type="image/png" />
</head>
<body>
  <div id="global-header"></div>
  <section class="hero fade-in">
    <div class="container hero-container">
      <h1>Join Our Team</h1>
      <p>Be part of Africa's next generation of urban transformation experts.</p>
    </div>
  </section>
  <section class="services fade-in">
    <div class="container services-container">
      <h2 class="section-title">Current Openings</h2>
      <div id="jobs-container" class="services-grid">
        ${jobCards}
      </div>
    </div>
  </section>
  <section class="about fade-in">
    <div class="container about-container">
      <div class="about-text">
        <h2>Why Work With Us?</h2>
        <p>At Nexus, we value innovation, collaboration, and impact. We offer flexible work arrangements, opportunities for leadership, and a chance to shape communities for the better.</p>
        <ul>
          <li>Meaningful work in African cities</li>
          <li>Remote-friendly culture</li>
          <li>Learning & growth opportunities</li>
          <li>Competitive compensation packages</li>
          <li>Diverse and inclusive workplace</li>
        </ul>
        <p>Don't see a role that fits? We welcome general applications. Email your resume to <a href="mailto:support@nexuseng.org">support@nexuseng.org</a>.</p>
      </div>
      <div class="about-image">
        <img src="/images/logo.png" alt="Nexus Engineering Logo" loading="lazy" />
      </div>
    </div>
  </section>
  <section class="contact fade-in">
    <div class="container contact-container">
      <h2>Ready to Make an Impact?</h2>
      <p>We're excited to learn more about you.</p>
      <a href="/contact.html" class="btn-primary">Start Your Application</a>
    </div>
  </section>
  <div id="global-footer"></div>
  <script src="/js/header-footer-loader.min.js" defer></script>
</body>
</html>`;
}

// Main function with error handling
function main() {
  try {
    const now = new Date();
    let jobs = [];
    
    try {
      const jobsData = fs.readFileSync(JOBS_PATH, 'utf-8');
      jobs = JSON.parse(jobsData);
      if (!Array.isArray(jobs)) {
        throw new Error('Jobs data is not an array');
      }
    } catch (e) {
      console.error(`Error reading jobs file: ${e.message}`);
      process.exit(1);
    }

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      try {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      } catch (e) {
        console.error(`Error creating output directory: ${e.message}`);
        process.exit(1);
      }
    }

    const activeSlugs = [];
    const activeJobs = [];

    jobs.forEach(job => {
      try {
        const deadline = formatDate(job.deadline);
        if (now > deadline) {
          console.log(`⏩ Skipping expired job: ${job.title || 'Untitled Job'}`);
          return;
        }

        const slug = job.slug || generateSlug(job.title);
        activeSlugs.push(slug);
        activeJobs.push({ ...job, slug });

        const html = createJobHtml({ ...job, slug });
        const outFile = path.join(OUTPUT_DIR, `${slug}.html`);
        
        try {
          fs.writeFileSync(outFile, html);
          console.log(`✅ Generated: ${outFile}`);
        } catch (e) {
          console.error(`Error writing file ${outFile}: ${e.message}`);
        }
      } catch (e) {
        console.error(`Error processing job ${job.title || 'Untitled Job'}: ${e.message}`);
      }
    });

    // Remove orphaned expired jobposts
    try {
      const existingFiles = fs.readdirSync(OUTPUT_DIR);
      existingFiles.forEach(file => {
        if (!file.endsWith('.html')) return;
        const slug = file.replace(/\.html$/, '');
        if (!activeSlugs.includes(slug)) {
          try {
            fs.unlinkSync(path.join(OUTPUT_DIR, file));
            console.log(`🗑️ Deleted expired file: ${file}`);
          } catch (e) {
            console.error(`Error deleting file ${file}: ${e.message}`);
          }
        }
      });
    } catch (e) {
      console.error(`Error cleaning up expired jobs: ${e.message}`);
    }

    // Generate careers.html
    try {
      const careersHTML = generateCareersHTML(activeJobs);
      fs.writeFileSync(CAREERS_PATH, careersHTML);
      console.log(`📄 Updated: careers.html`);
    } catch (e) {
      console.error(`Error generating careers page: ${e.message}`);
    }

  } catch (e) {
    console.error(`Unexpected error: ${e.message}`);
    process.exit(1);
  }
}

main();