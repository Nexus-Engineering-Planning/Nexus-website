# Nexus Engineering & Planning Ltd. Website

Official website for Nexus Engineering & Planning Ltd., a multidisciplinary consultancy delivering innovative and sustainable infrastructure solutions across Africa.

## 🌐 Website

Visit us at: [https://www.nexuseng.org](https://www.nexuseng.org)

## 📁 Project Structure

```
.
├── css/                    # Stylesheets
│   ├── style.css          # Main stylesheet
│   └── style.min.css      # Minified version
├── js/                     # JavaScript files
│   ├── about.js           # About page interactions
│   ├── contact.js         # Contact form validation
│   ├── header-footer-loader.js  # Dynamic header/footer loading
│   ├── generateJobPages.cjs     # Job posting generator
│   ├── jobs.json          # Job postings data
│   └── *.min.js           # Minified versions
├── images/                 # Image assets
├── jobposts/              # Generated job posting pages
├── index.html             # Homepage
├── about.html             # About page
├── services.html          # Services page
├── insights.html          # Insights/blog page
├── contact.html           # Contact page
├── careers.html           # Careers page (auto-generated)
├── header.html            # Global header template
└── footer.html            # Global footer template
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Web server (Apache, Nginx, or similar)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nexus-Engineering-Planning/Nexus-website.git
   cd Nexus-website
   ```

2. Install dependencies (for job page generation):
   ```bash
   cd js
   npm install
   ```

### Development

#### Building Job Pages

The careers page and individual job postings are automatically generated from `js/jobs.json`:

```bash
cd js
npm run build
```

This will:
- Parse job listings from `jobs.json`
- Filter out expired positions
- Generate individual job detail pages in `jobposts/`
- Update the main `careers.html` page

#### Adding a New Job Posting

1. Edit `js/jobs.json` and add your job listing:
   ```json
   {
     "title": "Job Title",
     "location": "City, Country",
     "type": "Full-Time / Part-Time / Contract",
     "deadline": "YYYY-MM-DD HH:MM:SS UTC",
     "summary": "Brief job description",
     "whyItMatters": "Why this role is important",
     "responsibilities": "Key responsibilities",
     "stack": {
       "category": ["item1", "item2"]
     },
     "requirements": ["requirement1", "requirement2"],
     "niceToHave": ["optional skill"],
     "terms": ["employment terms"],
     "applyLink": "https://application-link.com"
   }
   ```

2. Run the build script:
   ```bash
   cd js
   npm run build
   ```

## 🎨 Styling

The site uses a custom CSS framework with:
- CSS variables for consistent theming
- Responsive grid layouts
- Animation classes (fade-in, slide-in)
- Mobile-first responsive design

## 🔧 Key Features

### Dynamic Header/Footer
- Header and footer are loaded dynamically via `header-footer-loader.js`
- Centralized navigation management
- Active page highlighting

### Form Validation
- Client-side validation for contact form
- reCAPTCHA integration for spam prevention
- Improved email format checking

### Job Posting System
- Automated generation from JSON data
- Schema.org markup for SEO
- Automatic expiration handling
- Responsive job cards

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Focus management for interactive elements
- Semantic HTML structure

## 📝 Code Quality

### JavaScript Standards
- ES6+ syntax
- Proper error handling
- JSDoc comments for functions
- Defensive programming (null checks, type validation)

### HTML Standards
- Valid HTML5 markup
- Semantic elements
- Accessibility best practices
- SEO-optimized meta tags

### CSS Standards
- Mobile-first responsive design
- CSS custom properties (variables)
- Consistent naming conventions
- Organized by component sections

## 🔒 Security

- XSS prevention through HTML escaping
- reCAPTCHA for form protection
- Input validation on forms
- Secure external links (`rel="noopener noreferrer"`)

## 🌍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📞 Contact

- **Email**: support@nexuseng.org
- **Website**: https://www.nexuseng.org
- **Company**: Nexus Engineering & Planning Ltd.
- **Registration**: RC 7433243
- **Location**: Lagos, Nigeria

## 📄 License

© 2025 Nexus Engineering & Planning Ltd. All rights reserved.

This material, and other digital content on this website, may not be reproduced, published, broadcast, rewritten or redistributed in whole or in part without written permission from Nexus.

## 🤝 Contributing

This is a private repository. For inquiries about collaboration or contributions, please contact us at support@nexuseng.org.
