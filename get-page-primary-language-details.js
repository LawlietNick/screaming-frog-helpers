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
      // Get all the link elements with rel="alternate"
      const alternateLinks = document.querySelectorAll('link[rel="alternate"]');

      // Get the count of alternate links
      const languages_count = alternateLinks.length;

      // Get the href of the first link (if any)
      const first_alternate_href = languages_count > 0 ? alternateLinks[0].href : null;

      // Extract the page path from the first href (default URL)
      const primary_page_path = first_alternate_href ? new URL(first_alternate_href).pathname : null;

      // Extract the first folder from the path
      const primary_first_folder = primary_page_path
        ? primary_page_path.split('/').filter(Boolean)[0] || null
        : null;

      // Get the canonical link's href
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      const canonicalHref = canonicalLink ? canonicalLink.href : null;

      // Get the current page language (checking against canonical link)
      let current_page_language = null;

      for (let i = 0; i < alternateLinks.length; i++) {
        // Compare with canonical href if it exists, otherwise use window.location.href
        const comparisonHref = canonicalHref || window.location.href;
        if (alternateLinks[i].href === comparisonHref) {
          current_page_language = alternateLinks[i].hreflang;
          break;
        }
      }

      // Resolve the promise with an array of values
      resolve([
        first_alternate_href,
        primary_page_path,
        current_page_language,
        languages_count,
        primary_first_folder
      ]);

    } catch (error) {
      reject(error); // Reject the promise if an error occurs
    }
  });
}

// Execute request and handle results
return getAlternateHrefDetails()
  .then(data => seoSpider.data(data))
  .catch(error => seoSpider.error(error));
