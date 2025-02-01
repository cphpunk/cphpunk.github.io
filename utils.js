/*
* Normalizes a string by converting to lowercase, removing special characters (★ and *),
* and trimming whitespace. This helps with string comparison by removing common
* differences that don't affect the actual meaning.
*/
export function normalizeString(str) {
  return str.toLowerCase().replace(/[★*]/g, '').trim();
}

/*
* Calculates the Levenshtein distance between two strings - the minimum number of
* single-character edits required to change one string into another.
* Uses dynamic programming with a matrix to track the minimum operations needed.
* Operations allowed: insertion, deletion, substitution
*/
export function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill().map(() =>
    Array(str1.length + 1).fill(0)
  );

  // Initialize first row and column
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  // Fill in the rest of the matrix
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i-1] === str2[j-1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j-1][i] + 1,     // deletion
        matrix[j][i-1] + 1,     // insertion
        matrix[j-1][i-1] + cost // substitution
      );
    }
  }
  return matrix[str2.length][str1.length];
}

/*
* Returns a similarity score between 0 and 1 for two strings,
* where 1 means identical and 0 means completely different.
* Uses Levenshtein distance normalized by the length of the longer string.
*/
export function getSimilarity(str1, str2) {
  const maxLength = Math.max(str1.length, str2.length);
  const distance = levenshteinDistance(str1, str2);
  return 1 - (distance / maxLength);
}

/**
 * Checks if two strings are considered duplicates by verifying they share a common substring
 * longer than a specified minimum length. The comparison is case-insensitive and optimized
 * to efficiently check substrings using a Set for O(1) lookups.
 * 
 * @param {string} strA - First input string to compare
 * @param {string} strB - Second input string to compare
 * @param {number} MIN - Minimum threshold length for common substrings (function checks for MIN + 1)
 * @returns {boolean} True if a common substring of length > MIN exists, false otherwise
 * 
 * Algorithm Logic:
 * 1. Normalization: Convert both strings to lowercase for case-insensitive comparison
 * 2. Edge Case Handling: Immediately return false if either string is too short
 * 3. Optimization: Generate substrings from the shorter string to minimize Set size
 * 4. Set Lookup: Store all target-length substrings from shorter string in a Set
 * 5. Verification: Check all target-length substrings from longer string against the Set
 */
export function shareSubstringOfMinimumLength(strA, strB, MIN) {
  const targetLength = MIN + 1;
  if (strA.length < targetLength || strB.length < targetLength) {
      return false;
  }

  const lowerA = strA.toLowerCase();
  const lowerB = strB.toLowerCase();

  // Determine shorter and longer strings to optimize Set memory usage
  let shorter, longer;
  if (lowerA.length <= lowerB.length) {
      shorter = lowerA;
      longer = lowerB;
  } else {
      shorter = lowerB;
      longer = lowerA;
  }

  // Generate all possible target-length substrings from shorter string
  const substringSet = new Set();
  const maxStartShorter = shorter.length - targetLength;
  for (let i = 0; i <= maxStartShorter; i++) {
      const sub = shorter.substring(i, i + targetLength);
      substringSet.add(sub);
  }

  // Check all target-length substrings from longer string against the Set
  const maxStartLonger = longer.length - targetLength;
  for (let i = 0; i <= maxStartLonger; i++) {
      const sub = longer.substring(i, i + targetLength);
      if (substringSet.has(sub)) {
          return true;
      }
  }

  return false;
}