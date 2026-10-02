// Builds _site/: copies every talk folder and generates the index page.
// A talk is a root-level folder named YYYY-MM-DD-slug with an index.html inside.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT = join(ROOT, '_site')
const TALK_DIR = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const decodeEntities = (text) =>
  text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')

function meta(html, name) {
  const tag = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*>`, 'i'))?.[0]
  const content = tag?.match(/content=(?:"([^"]*)"|'([^']*)')/i)
  return decodeEntities((content?.[1] ?? content?.[2] ?? '').trim())
}

function readTalk(dir) {
  const [, year, month, day, slug] = dir.match(TALK_DIR)
  const html = readFileSync(join(ROOT, dir, 'index.html'), 'utf8')
  const title = decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1].trim() ?? '')
  return {
    dir,
    date: new Date(Date.UTC(+year, +month - 1, +day)),
    title: title || slug.replace(/-/g, ' '),
    author: meta(html, 'author'),
    description: meta(html, 'description'),
  }
}

function renderTalk({ dir, date, title, author, description }) {
  const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  const byline = [day, author].filter(Boolean).map(escapeHtml).join(' · ')
  return `      <li>
        <a href="./${dir}/">
          <span class="title">${escapeHtml(title)}</span>
          <span class="byline">${byline}</span>
          ${description ? `<span class="description">${escapeHtml(description)}</span>` : ''}
        </a>
      </li>`
}

const dirs = readdirSync(ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && TALK_DIR.test(entry.name))
  .map((entry) => entry.name)

const missingIndex = dirs.filter((dir) => !existsSync(join(ROOT, dir, 'index.html')))
if (missingIndex.length > 0) {
  console.error(`Missing index.html in: ${missingIndex.join(', ')}`)
  process.exit(1)
}

const talks = dirs.map(readTalk).sort((a, b) => b.date - a.date || a.dir.localeCompare(b.dir))

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT)
for (const { dir } of talks) cpSync(join(ROOT, dir), join(OUT, dir), { recursive: true })

const template = readFileSync(join(ROOT, 'index.template.html'), 'utf8')
writeFileSync(join(OUT, 'index.html'), template.replace('<!-- TALKS -->', talks.map(renderTalk).join('\n')))

console.log(`${talks.length} talk(s) built into _site/`)
