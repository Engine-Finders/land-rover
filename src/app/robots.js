export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://landroverengine.uk/sitemap.xml",
    host: "https://landroverengine.uk",
  };
}
