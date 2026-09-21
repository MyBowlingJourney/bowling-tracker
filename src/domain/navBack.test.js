import { describe, it, expect } from 'vitest';
import { backAction } from './navBack.js';

describe('backAction', () => {
  it('closes an open tour before anything else', () => {
    expect(backAction({ activeTour: 'look', view: 'badges', parentView: 'journey' })).toEqual({ type: 'closeTour' });
  });
  it('follows the header arrow tree', () => {
    expect(backAction({ view: 'badges', parentView: 'journey' })).toEqual({ type: 'view', view: 'journey' });
    expect(backAction({ view: 'subscribe', parentView: 'settings' })).toEqual({ type: 'view', view: 'settings' });
  });
  it('a tab with no parent goes Home', () => {
    expect(backAction({ view: 'history' })).toEqual({ type: 'view', view: 'home' });
  });
  it('Home leaves the app', () => {
    expect(backAction({ view: 'home' })).toEqual({ type: 'exit' });
    expect(backAction()).toEqual({ type: 'exit' });
  });
});
