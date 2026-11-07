import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ExperienceHome from './ExperienceHome';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => require('react').createElement('a', { href: to, ...props }, children),
}));

const markup = () => renderToStaticMarkup(<ExperienceHome />);

describe('isolated cinematic automotive experience', () => {
  it('keeps the hero headline outside the vehicle photograph', () => {
    const html = markup();
    const scene = html.indexOf('class="xp-hero-scene"');
    const dock = html.indexOf('class="xp-hero-dock"');
    const title = html.indexOf('id="xp-title"');
    expect(scene).toBeGreaterThan(-1);
    expect(dock).toBeGreaterThan(scene);
    expect(title).toBeGreaterThan(dock);
    expect(html.slice(scene, dock)).not.toContain('<h1');
  });

  it('uses five distinct editorial photographs with captions below collection images', () => {
    const html = markup();
    const images = [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((match) => match[1]);
    expect(images).toHaveLength(5);
    expect(new Set(images).size).toBe(5);
    ['SUV', 'Sedan', 'Hatchback'].forEach((name) => {
      const start = html.indexOf(`aria-label="Explore ${name} vehicles"`);
      expect(start).toBeGreaterThan(-1);
      const card = html.slice(start, html.indexOf('</a>', start));
      const photo = card.indexOf('class="xp-card-photo"');
      const label = card.indexOf('class="xp-card-meta"');
      expect(photo).toBeGreaterThan(-1);
      expect(label).toBeGreaterThan(photo);
      expect(card).toContain(`<strong>${name}</strong>`);
      expect(html).toContain(`href="/cars?segment=${name}"`);
    });
  });

  it('uses the five documented preview photo assets without inventing inventory claims', () => {
    const html = markup();
    const expected = [
      'photo-1668248835473-c2f28c752663',
      'photo-1652946950814-25f52bb0ebfc',
      'photo-1723306975792-f5a053a59dd3',
      'photo-1623994518372-2211dc3afb29',
      'photo-1650029380425-7fbfbd9b2b68',
    ];
    const ids = [...html.matchAll(/images\.unsplash\.com\/(photo-\d{13}-[a-f0-9]+)/g)].map((match) => match[1]);
    expect(ids).toEqual(expected);
    expect(html).not.toContain('₹');
  });

  it('offers three accessible campaign selections without duplicating hero images', () => {
    const html = markup();
    const buttons = [...html.matchAll(/aria-label="Show story [1-3]:/g)];
    expect(buttons).toHaveLength(3);
    expect((html.match(/aria-pressed="true"/g) || [])).toHaveLength(1);
    expect(html).toContain('aria-label="Featured automotive stories"');
    expect(html).toContain('Beyond the ordinary.');
  });

  it('provides accessible navigation, linked chapters and a single main landmark', () => {
    const html = markup();
    expect(html).toContain('aria-label="Primary navigation"');
    expect(html).toContain('aria-controls="xp-primary-menu"');
    expect(html).toContain('id="xp-philosophy-title"');
    expect(html).toContain('id="xp-feature-title"');
    expect(html).toContain('id="xp-collection-title"');
    expect(html).toContain('id="xp-finale-title"');
    expect((html.match(/<main>/g) || [])).toHaveLength(1);
    expect(html).not.toContain('cin-service-band');
  });
});
