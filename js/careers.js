// careers.js - External JavaScript file for careers page

async function loadJobs() {
  const container = document.getElementById('jobs-container');
  const fallback = document.getElementById('no-jobs-message');
  const errorElement = document.getElementById('jobs-error');
  const loadingElement = document.getElementById('jobs-loading');

  try {
    const res = await fetch('/js/jobs.json');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const jobs = await res.json();
    const now = new Date();
    loadingElement.style.display = 'none';

    const activeJobs = jobs.filter(job => {
      try {
        let deadlineStr = job.deadline.replace(/(WAT|GMT|UTC)/i, '').trim();
        deadlineStr = deadlineStr.replace(/(\d+)(?:st|nd|rd|th)/, '$1');
        const deadlineDate = new Date(deadlineStr);
        return !isNaN(deadlineDate.getTime()) && deadlineDate >= now;
      } catch {
        return false;
      }
    });

    if (activeJobs.length === 0) {
      fallback.style.display = 'block';
    } else {
      container.innerHTML = '';
      activeJobs.forEach(job => {
        const jobCard = renderJobCard(job);
        container.appendChild(jobCard);
      });
    }
  } catch (error) {
    console.error('Error loading jobs:', error);
    loadingElement.style.display = 'none';
    errorElement.style.display = 'block';
    errorElement.innerHTML = `
      <p>We're having trouble loading our current job openings.</p>
      <p>Please try again later or email your resume to <a href="mailto:support@nexuseng.org">support@nexuseng.org</a>.</p>
      <p><small>Error: ${error.message}</small></p>
    `;
  }
}

function renderJobCard(job) {
  const card = document.createElement('div');
  card.className = 'service-item';
  const slug = job.slug || job.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');

  card.innerHTML = `
    <div class="job-details">
      <h3><a href="/jobposts/${slug}.html">${job.title}</a></h3>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Type:</strong> ${job.type}</p>
      <p><strong>Deadline:</strong> ${job.deadline}</p>
      <p>${job.summary}</p>
      <a href="/jobposts/${slug}.html" class="btn-secondary">View Full Description</a>
    </div>
  `;

  return card;
}

function setupJobCardAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('slide-in-left');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const container = document.getElementById('jobs-container');
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) observer.observe(node);
      });
    });
  });

  mutationObserver.observe(container, { childList: true });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadJobs();
  setupJobCardAnimations();
});