import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import ExperienceHome from './ExperienceHome';

function markup() {
  return renderToStaticMarkup(<MemoryRouter><ExperienceHome /></MemoryRouter>);
}

describe('isolated automotive experience', () => {
  it('keeps the hero headline outside the vehicle photograph', () => {
    const html = markup();
    const imageStart = html.indexOf('class="xp-hero-photo"');
    const copyStart = html.indexOf('class="xp-hero-copy"');
    const titleStart = html.indexOf('id="xp-title"');
    expect(imageStart).toBeGreaterThan(-1);
    expect(copyStart).toBeGreaterThan(imageStart);
    expect(titleStart).toBeGreaterThan(copyStart);
    expect(html.slice(imageStart, copyStart)).not.toContain('<h1');
  });

  it('uses unique photographs and keeps category labels after the photo element', () => {
    const html = markup();
    const images = [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((match) => match[1]);
    expect(images).toHaveLength(5);
    expect(new Set(images).size).toBe(5);
    ['SUV', 'Sedan', 'Hatchback'].forEach((name) => {
      const cardStart = html.indexOf(`aria-label="Explore ${name} cars"`);
      expect(cardStart).toBeGreaterThan(-1);
      const card = html.slice(cardStart, html.indexOf('</a>', cardStart));
      expect(card.indexOf('class="xp-category-image"')).toBeLessThan(card.indexOf('class="xp-category-label"'));
      expect(card).toContain(`<strong>${name}</strong>`);
    });
  });

  it('has navigation, accessible section headings and reduced-motion-safe structure', () => {
    const html = markup();
    expect(html).toContain('aria-label="Main navigation"');
    expect(html).toContain('id="xp-intro-title"');
    expect(html).toContain('id="xp-detail-title"');
    expect(html).toContain('id="xp-collection-title"');
    expect(html).not.toContain('cin-service-band');
    expect(html).not.toContain('The True Verdict');
  });
});
