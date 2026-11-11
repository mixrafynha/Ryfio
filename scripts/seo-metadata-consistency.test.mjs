import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("public SEO JSON-LD uses the www canonical host", async () => {
  const customProducts = await read("app/_custom-products/ProductLandingPage.tsx");
  const blog = await read("app/blog/_components.tsx");
  const sitemap = await read("app/sitemap.ts");

  assert.match(customProducts, /const SITE_URL = "https:\/\/www\.ryfio\.com"/);
  assert.match(blog, /https:\/\/www\.ryfio\.com\/favicon\.ico/);
  assert.match(blog, /mainEntityOfPage: `https:\/\/www\.ryfio\.com\/blog/);
  assert.match(sitemap, /const SITE_URL = "https:\/\/www\.ryfio\.com"/);
  assert.doesNotMatch(customProducts, /https:\/\/ryfio\.com/);
  assert.doesNotMatch(blog, /https:\/\/ryfio\.com/);
});

test("product structured data does not infer availability from local stock", async () => {
  const product = await read("app/products/[id]/page.tsx");

  assert.match(product, /priceCurrency: currency/);
  assert.match(product, /price: amount\.toFixed\(2\)/);
  assert.doesNotMatch(product, /availability: `https:\/\/schema\.org/);
});
