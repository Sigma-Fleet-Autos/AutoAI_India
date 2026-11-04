import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ExperienceHome from './ExperienceHome';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => require('react').createElement('a', { href: to, ...props }, children),
}));

function markup() {
  return renderToStaticMarkup(<ExperienceHome />);
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

  it('uses five approved India-market vehicle photo identities', () => {
    const html = markup();
    const approved = [
      'photo-1668248835473-c2f28c752663',
      'photo-1652946950814-25f52bb0ebfc',
      'photo-1723306975792-f5a053a59dd3',
      'photo-1623994518372-2211dc3afb29',
      'photo-1650029380425-7fbfbd9b2b68',
    ];
    const photoIds = [...html.matchAll(/images\\.unsplash\\.com\\/(photo-\\d{13}-[a-f0-9]+)/g)].map((match) => match[1]);
    expect(photoIds).toEqual(approved);
    expect(html).toContain('Mahindra Thar');
    expect(html).toContain('BMW 2 Series Gran Coupé');
    expect(html).toContain('Hyundai i20');
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
