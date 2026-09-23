import { describe, it, expect } from 'vitest';
import { escapeLikeTerm, profileSearchPattern, MIN_SEARCH_LENGTH } from './profileSearch.js';

describe('escapeLikeTerm', () => {
  it('escapes the LIKE wildcards', () => {
    expect(escapeLikeTerm('%')).toBe('\\%');
    expect(escapeLikeTerm('_')).toBe('\\_');
    expect(escapeLikeTerm('a%b_c')).toBe('a\\%b\\_c');
  });

  it('escapes the escape character itself', () => {
    expect(escapeLikeTerm('a\\b')).toBe('a\\\\b');
  });

  it('leaves ordinary names alone', () => {
    expect(escapeLikeTerm("Ryan O'Dell")).toBe("Ryan O'Dell");
    expect(escapeLikeTerm('Zack')).toBe('Zack');
  });

  it('survives junk', () => {
    expect(escapeLikeTerm(null)).toBe('');
    expect(escapeLikeTerm(undefined)).toBe('');
    expect(escapeLikeTerm(42)).toBe('42');
  });
});

describe('profileSearchPattern', () => {
  it('wraps a real term for a contains search', () => {
    expect(profileSearchPattern('ryan')).toBe('%ryan%');
    expect(profileSearchPattern('  ryan  ')).toBe('%ryan%');
  });

  it('refuses a term that is too short to be a search', () => {
    expect(profileSearchPattern('r')).toBeNull();
    expect(profileSearchPattern('')).toBeNull();
    expect(profileSearchPattern('   ')).toBeNull();
    expect(MIN_SEARCH_LENGTH).toBe(2);
  });

  it('cannot be used to list the whole directory', () => {
    // A bare wildcard is too short to search at all...
    expect(profileSearchPattern('%')).toBeNull();
    // ...and a longer one matches the characters themselves, not everyone.
    expect(profileSearchPattern('%%')).toBe('%\\%\\%%');
    expect(profileSearchPattern('__')).toBe('%\\_\\_%');
    expect(profileSearchPattern('a%')).toBe('%a\\%%');
  });
});
