/**
 * Extracts the publish date from ld+json or meta tags.
 *
 * @returns {string|null} The publish date in YYYY-MM-DD format, or null if not found.
 */
function extractPublishDate() {
    let publishDate = null;

    // Check for ld+json with publish date
    const ldJsonScripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of ldJsonScripts) {
        try {
            const json = JSON.parse(script.textContent);
            if (json.datePublished) {
                publishDate = formatDate(json.datePublished);
                return publishDate;
            }
        } catch (e) {
            console.error('Error parsing ld+json:', e);
        }
    }

    // Check for meta tag with article:published_time
    const metaTag = document.querySelector('meta[property="article:published_time"]');
    if (metaTag && metaTag.content) {
        publishDate = formatDate(metaTag.content);
        return publishDate;
    }

    return null;
}

/**
 * Helper function to format a date string to YYYY-MM-DD.
 *
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extracts the date part in YYYY-MM-DD format
}

// Execute the function and return the result for Screaming Frog
return seoSpider.data(extractPublishDate());
