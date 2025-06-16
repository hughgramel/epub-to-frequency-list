import JSZip from 'jszip';

/**
 * Parses an EPUB file using JSZip and extracts all its text content.
 * @param file The EPUB file object from the input.
 * @returns A Promise that resolves with the full text of the book.
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

  let allText = '';

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
      allText += textContent + '\n\n';
    }
  }

  return allText;
};

