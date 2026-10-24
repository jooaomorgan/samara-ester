const SITE_URL = (process.env.PUBLIC_SITE_URL || "https://cherry-vibes.netlify.app").replace(/\/+$/, "");
const API_URL = (process.env.STORE_API_URL || process.env.REACT_APP_API_URL || "").trim().replace(/\/+$/, "").replace(/\/api$/, "");

function xmlEscape(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[char]);
}

function safeSlug(value) {
  const slug = String(value || "");
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : "";
}

async function fetchRows(path) {
  if (!API_URL) return [];
  const response = await fetch(API_URL + "/api/store/" + path, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error("Store API returned " + response.status);
  const rows = await response.json();
  return Array.isArray(rows) ? rows : [];
}

function urlElement(path) {
  return "  <url><loc>" + xmlEscape(SITE_URL + path) + "</loc></url>";
}

exports.handler = async function sitemap() {
  let categories = [];
  let products = [];
  try {
    [categories, products] = await Promise.all([
      fetchRows("categories"),
      fetchRows("products?limit=200"),
    ]);
  } catch (error) {
    console.warn("Sitemap is using static URLs because the store API is unavailable:", error.message);
  }

  const urls = new Set(["/"]);
  for (const category of categories) {
    const slug = safeSlug(category.slug);
    if (slug) urls.add("/" + slug);
  }
  for (const product of products) {
    const slug = safeSlug(product.slug);
    if (slug) urls.add("/produto/" + slug);
  }

  const body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" +
    Array.from(urls).map(urlElement).join("\n") + "\n</urlset>\n";
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
      "X-Content-Type-Options": "nosniff",
    },
    body,
  };
};
