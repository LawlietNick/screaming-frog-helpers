# Screaming Frog Helpers

This repository contains a collection of helpful JavaScript code snippets to be used with Screaming Frog's custom extraction feature. These scripts can help you extract valuable data from websites that Screaming Frog doesn't natively capture.

## Available Scripts

### WordPress Post Type Detection

* **Filename:** `wordpress-post-type.js`
* **Description:** This script analyzes the classes applied to the `<body>` tag of a WordPress page and returns a human-readable string representing the post type (e.g., "home," "blog post," "product page," "category archive"). It handles various WordPress page types, including custom post types, WooCommerce pages, and archive pages.

**How to use:**

1. Copy the code from `wordpress-post-type.js`.
2. In Screaming Frog, go to "Configuration" -> "Custom" -> "Custom JavaScript"
3. Click "Add"
4. Click "JS" -icon on the right
6. Paste the code into the code editor.
7. Test it with a single url using the JavaScript Tester on the right
8. Add Snippet to User Library for the later use. You can name the snippet "Wordpress Post Type"
9. CLick OK

**Supported Post Types:**

* Home page
* Blog home page
* Internal search results
* Privacy policy page
* WooCommerce pages (order received, account, checkout, cart, product archive, product page)
* Single pages (posts, pages, attachments, custom post types)
* Archive pages (category, author, tag, date, taxonomy)

**Important Notes:**

* The code might need adjustments depending on your WordPress theme and any plugins you're using.
* Always test the code thoroughly on your WordPress site to ensure it's working correctly.

## Contributing

Feel free to contribute to this repository by:

* Adding new helper scripts for different use cases.
* Improving existing scripts.
* Reporting issues or suggesting enhancements.
* Submitting pull requests.

Any contributions are welcome!

## License
GPL-3.0
