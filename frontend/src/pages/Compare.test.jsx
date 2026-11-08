import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Compare from './Compare';

jest.mock('../lib/api', () => ({
  api: { post: jest.fn() },
  formatINR: (value) => String(value),
  PREVIEW_READ_ONLY: true,
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => require('react').createElement('a', { href: to, ...props }, children),
}));

jest.mock('../components/CarVisual', () => () => null);

test('private preview clearly disables write-backed AI comparison rather than promising a working verdict', () => {
  const html = renderToStaticMarkup(<Compare />);
  expect(html).toContain('AI comparisons are unavailable in this read-only preview');
  expect(html).toMatch(/data-testid="compare-submit-btn"[^>]*disabled=""/);
  expect(html).not.toContain('Claude-powered');
  expect(html).not.toContain('waiting periods, safety ratings &amp; total cost');
  expect(html).not.toContain('Side by side.</span>.');
});
