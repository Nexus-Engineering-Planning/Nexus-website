import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const jobs = await getCollection('jobs');
  const sortedJobs = jobs
    .filter(job => !job.data.draft)
    .sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));

  return rss({
    title: 'Job Openings | Nexus Engineering & Planning Ltd.',
    description: 'Current job openings at Nexus Engineering & Planning Ltd.',
    site: context.site,
    items: sortedJobs.map((job) => ({
      title: job.data.title,
      pubDate: job.data.pubDate,
      description: job.data.description,
      link: `/careers/${job.slug}/`,
    })),
  });
}
