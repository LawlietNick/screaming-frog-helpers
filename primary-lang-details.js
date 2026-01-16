// =================================================================
// --- CONFIGURATION ---
// =================================================================
// Set your preferred language code here.
const PREFERRED_LANGUAGE = 'fi';


// =================================================================
// --- TIER 1: Attempt to extract from the dataLayer ---
// =================================================================
function extractFromDataLayer() {
    if (!window.dataLayer || !Array.isArray(window.dataLayer) || window.dataLayer.length === 0) {
        return null;
    }
    const combinedData = window.dataLayer.reduce((acc, obj) => (obj && typeof obj === 'object' ? {...acc, ...obj } : acc), {});
    if (combinedData.primary_url && combinedData.current_language) {
        return {
            source: 'dataLayer',
            url: combinedData.primary_url || null,
            path: combinedData.primary_path || null,
            title: combinedData.primary_title || null,
            language: combinedData.current_language || null,
            translations: combinedData.amount_of_translations || null
        };
    }
    return null;
}

// =================================================================
// --- TIER 2: Attempt to find a specific hreflang link ---
// =================================================================
function extractFromHreflang(lang) {
    const link = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
    const translationCount = document.querySelectorAll('link[rel="alternate"][hreflang]').length;
    
    if (link && link.href) {
        const url = new URL(link.href);
        let pageTitle = null;
        
        // Find the canonical URL of the page
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        const canonicalUrl = canonicalLink ? canonicalLink.href : null;
        
        // If the hreflang URL matches the canonical URL, use the current page's title.
        if (canonicalUrl && link.href === canonicalUrl) {
            pageTitle = document.title;
        }
        
        return {
            source: 'hreflang_fallback',
            url: link.href,
            path: url.pathname,
            title: null,
            language: document.documentElement.lang || null,
            translations: translationCount > 0 ? translationCount : 1
        };
    }
    return null;
}

// =================================================================
// --- TIER 3: Fallback to extracting from the current page's DOM ---
// =================================================================
function extractFromCurrentPage() {
    const translationCount = document.querySelectorAll('link[rel="alternate"][hreflang]').length;
    return {
        source: 'dom_fallback',
        url: window.location.href,
        path: window.location.pathname,
        title: document.title,
        language: document.documentElement.lang || null,
        translations: translationCount > 0 ? translationCount : 1
    };
}


// =================================================================
// --- MAIN CONTROLLER ---
// =================================================================
try {
    let resultObject = null;

    // 1. Find the data object using the fallback logic.
    resultObject = extractFromDataLayer();
    if (!resultObject) {
        resultObject = extractFromHreflang(PREFERRED_LANGUAGE);
    }
    if (!resultObject) {
        resultObject = extractFromCurrentPage();
    }

    // 3. Return the object from the successful function directly.
    // Screaming Frog will create a column for each key in the object.
    if (resultObject) {
        return seoSpider.data(resultObject);
    }

    // This case should ideally not be reached because of the fallback,
    // but return an empty object just in case.
    return seoSpider.data({});

} catch (error) {
    return seoSpider.error(`Extraction failed: ${error.message}`);
}
