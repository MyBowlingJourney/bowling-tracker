// Searching the bowler directory, without handing over the directory.
//
// The three profile searches (friends, team roster, coach) all did
// .ilike("display_name", `%${term}%`) with the term typed straight in.
// In SQL LIKE, % and _ are wildcards: typing a single "%" matches every
// bowler on the service, and "_" walks the alphabet a character at a
// time. Profiles are readable by any signed-in user by design -- it is a
// directory people search by name -- but a directory you can search is
// not a directory you should be able to download.
//
// Escaping makes a typed % mean a literal %, which is also the more
// honest behaviour: someone searching for "50%" wants that, not
// everybody.

// Postgres LIKE uses backslash as the escape character by default, so
// the backslash itself has to be escaped first.
export function escapeLikeTerm(term) {
  return String(term ?? "").replace(/[\\%_]/g, ch => `\\${ch}`);
}

// The shortest term worth sending. Two characters already narrows a
// directory a long way, and one character is closer to "list everyone"
// than to a search.
export const MIN_SEARCH_LENGTH = 2;

// The pattern for a contains-search, or null when the term is too short
// or is nothing but wildcards. Null means "do not search", which the
// callers already handle as an empty result.
export function profileSearchPattern(term) {
  const clean = String(term ?? "").trim();
  if (clean.length < MIN_SEARCH_LENGTH) return null;
  const escaped = escapeLikeTerm(clean);
  return `%${escaped}%`;
}
