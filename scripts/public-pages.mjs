import { readFile, writeFile } from 'node:fs/promises';
import { publicPages, publicSite } from '../shared/public-pages.js';
const dist = new URL('../frontend/dist/', import.meta.url);
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export async function generatePublicPages() {
  const template = await readFile(new URL('index.html', dist), 'utf8');
  for (const [path, page] of Object.entries(publicPages)) {
    const url=publicSite+path;
    const head=`<link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:locale" content="fr_FR"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${url}"><meta name="twitter:card" content="summary">`;
    const html=template.replace(/<title>.*?<\/title>/,`<title>${page.title}</title>`).replace(/(<meta name="description" content=")[^"]*/,`$1${escape(page.description)}`).replace('</head>',head+'</head>');
    await writeFile(new URL(path==='/'?'index.html':`${path.slice(1)}.html`,dist),html);
  }
  await writeFile(new URL('sitemap.xml',dist),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(publicPages).map(path=>`<url><loc>${publicSite}${path}</loc></url>`).join('')}</urlset>`);
  await writeFile(new URL('robots.txt',dist),`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${publicSite}/sitemap.xml\n`);
}
