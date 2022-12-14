import slug from 'slug'
import { NamedEntites } from './db.model'

import MetaScraper from 'metascraper'
import Author from 'metascraper-author'
import Description from 'metascraper-description'
import Image from 'metascraper-image'
import Publisher from 'metascraper-publisher'
import Title from 'metascraper-title'
import Url from 'metascraper-url'
import Date from 'metascraper-date'
import Logo from 'metascraper-logo'

import fs from 'fs'
// Remove http/https/www
export function generateSlug(url: string) {
    return slug(
        url
            .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
            .split('/')
            .slice(1)
            .join('-'),
    )
}

export function getDomainFromUrl(url: string) {
    const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
    return domain.split('/')[0]
}

export function getPath(url: string) {
    const domain = getDomainFromUrl(url)
    const slug = generateSlug(url)
    return `articles/${domain}/${slug}.html`
}

export function removeDuplicateEntities(entities: NamedEntites) {
    for (const entity in entities) {
        entities[entity] = [...new Set(entities[entity])]
    }
    return entities
}

export async function getMetadata(pathToHTML: string, url: string) {
    const metascraper = MetaScraper([Author, Description, Image, Publisher, Title, Url, Date, Logo].map((rule) => rule()))
    const html = fs.readFileSync(pathToHTML, 'utf8')
    return metascraper({ url, html })
}
