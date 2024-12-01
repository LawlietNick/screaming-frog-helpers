/**
 * Retrieves details about alternate language links and the current page.
 *
 * @returns {object} An object containing:
 *   - "amount_of_languages": The number of alternate language links found.
 *   - "primary_url": The href of the first alternate link (considered the primary URL).
 *   - "primary_path": The path part of the primary URL.
 *   - "current_language": The language code of the current page based on hreflang 
 *                          (matches against the canonical link if available).
 */

function getAlternateHrefDetails() {
  // Get all the link elements with rel="alternate"
  const alternateLinks = document.querySelectorAll('link[rel="alternate"]');

  // Get the count of alternate links
  const languages_count = alternateLinks.length;

  // Get the href of the first link (if any)
  const first_alternate_href = languages_count > 0 ? alternateLinks[0].href : null;

  // Extract the page path from the first href (default URL)
  const primary_page_path = new URL(first_alternate_href).pathname; 

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

  // Return an object with the details
  return {
    "amount_of_languages": languages_count, 
    "primary_url": first_alternate_href,
    "primary_path": primary_page_path,
    "current_language": current_page_language
  };
}
