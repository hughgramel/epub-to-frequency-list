import JSZip from 'jszip';

// Define regular expressions as constants for performance.
const DASHES_REGEX = /[—–-]/g;
// Expanded to include brackets, parentheses, and special characters like ◆
const PUNCTUATION_REGEX = /[.,¡!¿?:;()"“”«»\[\]◆]/g;
const WHITESPACE_REGEX = /\s+/g;
// New regex to remove all numbers
const NUMBERS_REGEX = /\d+/g;


/**
 * Parses an EPUB file using JSZip and extracts all its text content, cleaning it into a list of words.
 * @param file The EPUB file object from the input.
 * @returns A Promise that resolves with a single string of cleaned, whitespace-separated words.
 */
export const getTextFromEpub = async (file: File): Promise<string> => {
  const zip = await JSZip.loadAsync(file);

  // 1. Find the path to the .opf file from container.xml
  const containerFile = zip.file('META-INF/container.xml');
  if (!containerFile) {
    throw new Error('Invalid EPUB: META-INF/container.xml not found.');
  }
  const containerText = await containerFile.async('text');
  const parser = new DOMParser();
  const containerDoc = parser.parseFromString(containerText, 'application/xml');
  const opfPath = containerDoc.querySelector('rootfile')?.getAttribute('full-path');
  if (!opfPath) {
    throw new Error('Invalid EPUB: No OPF file path found in container.xml.');
  }

  // 2. Read the .opf file to get the book's structure
  const opfFile = zip.file(opfPath);
  if (!opfFile) {
    throw new Error(`Invalid EPUB: Could not find OPF file at ${opfPath}.`);
  }
  const opfText = await opfFile.async('text');
  const opfDoc = parser.parseFromString(opfText, 'application/xml');
  
  // Create a map of manifest items (id -> href)
  const manifestItems = new Map<string, string>();
  opfDoc.querySelectorAll('manifest item').forEach(item => {
    const id = item.getAttribute('id');
    const href = item.getAttribute('href');
    if (id && href) {
        // The href is relative to the .opf file, so we need to construct the full path
        const basePath = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);
        manifestItems.set(id, basePath + href);
    }
  });

  // 3. Get the ordered list of chapters from the spine
  const spineItemRefs = Array.from(opfDoc.querySelectorAll('spine itemref')).map(item => item.getAttribute('idref'));

  let allWords: string[] = [];

  // 4. Iterate through the chapters in order and extract their text
  for (const idref of spineItemRefs) {
    if (!idref) continue;

    const path = manifestItems.get(idref);
    if (!path) continue;

    const chapterFile = zip.file(path);
    if (chapterFile) {
      const chapterHtml = await chapterFile.async('text');
      const chapterDoc = parser.parseFromString(chapterHtml, 'text/html');
      
      // Extract text from the body, which strips all HTML tags
      const textContent = chapterDoc.body?.textContent || '';

      // Clean the text content using the pre-defined regex constants
      const cleanedText = textContent
        .toLowerCase()
        .replace(DASHES_REGEX, ' ')
        .replace(PUNCTUATION_REGEX, '')
        .replace(NUMBERS_REGEX, '') // Remove numbers
        .replace(WHITESPACE_REGEX, ' ')
        .trim();
      
      // Split into words and filter out any empty strings or URLs
      const words = cleanedText.split(' ').filter(word => {
          return word.length > 0 && !word.startsWith('http');
      });
      allWords = allWords.concat(words);
    }
  }

  // Return a single string with all words separated by a space.
  return allWords.join(' ');
};
