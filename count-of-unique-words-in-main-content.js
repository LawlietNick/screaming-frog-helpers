function uniqueWordsInMainContent() {
  const mainContent = document.querySelector('main#main');

  if (!mainContent) {
    console.error('Main element not found!');
    return 0;
  }

  const elements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, span, p');
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

	return seoSpider.data(words.size);
}
