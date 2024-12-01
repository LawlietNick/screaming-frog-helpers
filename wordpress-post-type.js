// Identifies the WordPress post type of a page based on its body classes.
// This script is designed to be used with Screaming Frog's Custom Javascript Extraction 
// feature to determine the post type of each page crawled.

function getWordPressPostType() {
  const bodyClasses = document.body.classList;
  let postType = ""; 

  // Front Page / Blog / Search / Privacy Policy
  if (bodyClasses.contains('home')) {
    postType = "home"; 
  } else if (bodyClasses.contains('blog')) {
    postType = "blog home"; 
  } else if (bodyClasses.contains('search')) {
    postType = "internal search results";
  } else if (bodyClasses.contains('privacy-policy')) {
    postType = "privacy policy page";
  } 

  // WooCommerce 
  else if (bodyClasses.contains('woocommerce-page')) {
    if (bodyClasses.contains('woocommerce-order-received')) {
      postType = "order received page";
    } else if (bodyClasses.contains('woocommerce-account')) {
      postType = "account page";
    } else if (bodyClasses.contains('woocommerce-checkout')) {
      postType = "checkout page";
    } else if (bodyClasses.contains('woocommerce-cart')) {
      postType = "cart page";
    } else if (bodyClasses.contains('post-type-archive-product')) {
      postType = "product archive"; 
    } else if (bodyClasses.contains('single-product')) {
      postType = "product page";
    }
  } 

  // Single Pages (Posts, Pages, Attachments, Custom Post Types)
  else if (bodyClasses.contains('single')) {
    if (bodyClasses.contains('single-attachment')) {
      postType = "attachment";
    } else if (bodyClasses.contains('single-page')) {
      postType = "page";
    } else if (bodyClasses.contains('single-post')) {
      postType = "post";
    } else { 
      const customPostTypeRegex = /single-([^ ]+)/;
      let match = customPostTypeRegex.exec(document.body.className);
        if (match && match[1]) {
          postType = match[1];
        }
      }
  } 

  // Archive Pages
  else if (bodyClasses.contains('archive')) {
    if (bodyClasses.contains('category')) {
      postType = "category page";
    } else if (bodyClasses.contains('author')) {
      postType = "author page";
    } else if (bodyClasses.contains('tag')) {
      postType = "tag archive";
    } else if (bodyClasses.contains('date')) {
      postType = "date archive";
    } else if (bodyClasses.contains('tax')) { 
      postType = "taxonomy archive";
    } else { 
        const customArchievePostTypeRegex = /post-type-archive-([^ ]+)/;
        let match = customArchievePostTypeRegex.exec(document.body.className);
        if (match && match[1]) {
            postType = match[1] + ' archive';;
        }
      }
  }
  // Page
  else if (Array.from(bodyClasses).some(cls => cls.startsWith('page-id-'))) { 
    postType = "page";
  }

  // Fallback
  else if (!postType) {
    postType = Array.from(bodyClasses).join(' '); 
  }

  return postType;
}

return seoSpider.data(getWordPressPostType());
