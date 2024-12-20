// Counts the unique words within the <main> tag of an HTML document.
// This is helpful for analyzing the vocabulary and content within the main 
// content area of a web page. Useful for tasks like content analysis, 
// keyword research, and readability assessment.

function uniqueWordsInMainContent() {
  try {
    const mainContent = document.querySelector('main[role="main"]');

    if (!mainContent) {
      return 'Main element not found!'; 
    }

    const elements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, span, p, a');
    const words = new Set();

    elements.forEach(element => {
      let text = element.textContent.trim().toLowerCase();

      // Remove punctuation (optional):
      text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"]/g, ""); 

      const normalizedText = text.replace(/\s+/g, ' ');

      normalizedText.split(' ').forEach(word => {
        if (word) {
          words.add(word);
        }
      });
    });

    return words.size; 

  } catch (error) {
    return error;
  }
}

return seoSpider.data(uniqueWordsInMainContent());
