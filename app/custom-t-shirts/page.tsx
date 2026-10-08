import { buildLandingMetadata, ProductLandingPage } from "../_custom-products/ProductLandingPage";
import { customProductPages } from "../_custom-products/data";

const page = customProductPages.tshirts;

export const metadata = buildLandingMetadata(page);

export default function CustomTShirtsPage() {
  return <ProductLandingPage page={page} />;
}
