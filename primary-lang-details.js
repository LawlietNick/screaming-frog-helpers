/**
 * The language to prioritize when searching for alternate links.
 * Change this value to your desired language code (e.g., 'en', 'de', 'sv').
 */
const PREFERRED_LANGUAGE = 'fi';

/**
 * Retrieves details about alternate language links, the current page, and the page title.
 * It prioritizes a specified language version for the primary path details.
 * If no alternate links are found, it falls back to using details from the canonical URL.
 *
 * @param {string} [preferredLang='fi'] - The language code to prioritize.
 * @returns {Promise<array>} A Promise that resolves to an array of values:
 *           - [0]: href (prioritizing preferred language, then first alternate, then canonical)
 *           - [1]: page_path (from the corresponding href)
 *           - [2]: current_page_language
 *           - [3]: languages_count
 *           - [4]: first_folder (from the corresponding href)
 *           - [5]: page_title
 */
function getAlternateHrefDetails(preferredLang = 'fi') {
  return new Promise((resolve, reject) => {
    try {
      if (typeof document === 'undefined' || typeof window === 'undefined') {
        return reject(new Error('Not running in a browser environment'));
      }

      const page_title = document.title || "";
      const alternateLinks = document.querySelectorAll('link[rel="alternate"]');
      const languages_count = alternateLinks.length;
      
      let href_to_use = null;
      let primary_page_path = null;
      let primary_first_folder = null;
      let current_page_language = "";

      const canonicalLink = document.querySelector('link[rel="canonical"]');
      const canonicalHref = canonicalLink ? canonicalLink.href : window.location.href;

      if (languages_count === 0) {
        // NEW: Fallback logic using canonical URL when no alternate links exist
        href_to_use = canonicalHref;
        current_page_language = document.documentElement.lang || "not-detected";
      } else {
        // Prioritize the preferred language
        for (const link of alternateLinks) {
          if (link.hreflang === preferredLang) {
            href_to_use = link.href;
            break;
          }
        }

        // If preferred not found, use the first alternate link
        if (!href_to_use) {
          href_to_use = alternateLinks[0]?.href || null;
        }

        // Determine current page language from hreflang attributes
        const normalizeUrl = (url) => url?.replace(/\/$/, '').toLowerCase();
        const normalizedCanonical = normalizeUrl(canonicalLink ? canonicalLink.href : window.location.href);
        for (const link of alternateLinks) {
          if (normalizeUrl(link.href) === normalizedCanonical) {
            current_page_language = link.hreflang;
            break;
          }
        }
      }

      // If language still not found, fallback to HTML lang attribute
      if (!current_page_language) {
          current_page_language = document.documentElement.lang || "not-detected";
      }

      // Process the determined URL to extract path and folder
      if (href_to_use) {
        try {
            const url = new URL(href_to_use);
            primary_page_path = url.pathname;
            primary_first_folder = url.pathname.split('/').filter(Boolean)[0] || "";
        } catch (urlError) {
          console.error('Invalid URL:', urlError);
        }
      }

      resolve([
        href_to_use,
        primary_page_path,
        current_page_language,
        languages_count,
        primary_first_folder,
        page_title
      ]);

    } catch (error) {
      reject(error);
    }
  });
}

// Execute the function with the configured preferred language
return getAlternateHrefDetails(PREFERRED_LANGUAGE)
    .then(data => seoSpider.data(data))
    .catch(error => seoSpider.error(error));
