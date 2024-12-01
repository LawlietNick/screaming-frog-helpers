// This function retrieves the 'data-cbid' attribute value from the Cookiebot script element.
// If the Cookiebot script is not found, it returns a message indicating that.
function getCookiebotCbid() {
  // Get the Cookiebot script element
  const cookiebotScript = document.getElementById('Cookiebot');

  // Check if the script element exists
  if (cookiebotScript) {
    // Get the data-cbid attribute value
    const cbid = cookiebotScript.getAttribute('data-cbid');
    return cbid;
  } else {
    // Cookiebot script not found
    return "No cookiebot ID found"; 
  }
}

return seoSpider.data(getCookiebotCbid());
