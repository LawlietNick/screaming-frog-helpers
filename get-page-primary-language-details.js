/**
 * Retrieves details about alternate language links and the current page.
 *
 * @returns {Promise<array>} A Promise that resolves to an array of values:
 *      - [0]: first_alternate_href
 *      - [1]: primary_page_path
 *      - [2]: current_page_language
 *      - [3]: languages_count
 *      - [4]: primary_first_folder
 */

function getAlternateHrefDetails() {
  return new Promise((resolve, reject) => {
    try {
      if (typeof document === 'undefined' || typeof window === 'undefined') {
        return reject(new Error('Not running in a browser environment'));
      }

      const alternateLinks = document.querySelectorAll('link[rel="alternate"]');
      const languages_count = alternateLinks.length;

      if (languages_count === 0) {
        return resolve([null, null, null, 0, null]);
      }

      const first_alternate_href = alternateLinks[0]?.href || null;
      let primary_page_path = null;
      let primary_first_folder = null;

      try {
        if (first_alternate_href) {
          const url = new URL(first_alternate_href);
          primary_page_path = url.pathname;
          primary_first_folder = primary_page_path.split('/').filter(Boolean)[0] || null;
        }
      } catch (urlError) {
        console.error('Invalid URL:', urlError);
      }

      const canonicalLink = document.querySelector('link[rel="canonical"]');
      const canonicalHref = canonicalLink ? canonicalLink.href : null;

      let current_page_language = null;
      const normalizeUrl = (url) => url?.replace(/\/$/, '').toLowerCase();

      for (const link of alternateLinks) {
        if (normalizeUrl(link.href) === normalizeUrl(canonicalHref || window.location.href)) {
          current_page_language = link.hreflang;
          break;
        }
      }

      current_page_language = current_page_language || "not-detected";

      resolve([
        first_alternate_href,
        primary_page_path,
        current_page_language,
        languages_count,
        primary_first_folder
      ]);

    } catch (error) {
      reject(error);
    }
  });
}

// Execute request and handle results
return getAlternateHrefDetails()
  .then(data => seoSpider.data(data))
  .catch(error => seoSpider.error(error));
