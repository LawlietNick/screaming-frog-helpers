function getHreflangUrl(langCode) {
  const linkElement = document.querySelector(`link[rel="alternate"][hreflang="${langCode}"]`);

  if (linkElement) {
    return linkElement.getAttribute('href');
  } else {
    return null;
  }
}


return seoSpider.data(getHreflangUrl("fi"));
