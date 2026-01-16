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
        return {
            source: 'hreflang_fallback',
            url: link.href,
            path: url.pathname,
            title: null,
            language: lang,
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
// --- MAIN CONTROLLER AND FORMATTER ---
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

    // 2. Format the object into the desired string.
    if (resultObject) {
        const orderedKeys = ['source', 'url', 'path', 'title', 'language', 'translations'];
        const valuesArray = orderedKeys.map(key => resultObject[key] || '');
        const commaSeparatedValues = valuesArray.join(',');
        const finalString = `[commaSeparatedValues]`;

        // 3. Return the final string to Screaming Frog in a single column named 'data'.
        return seoSpider.data(valuesArray);
    }

    return seoSpider.data('Data not found'); // Return empty if no data was found

} catch (error) {
    return seoSpider.error(`Extraction failed: ${error.message}`);
}
