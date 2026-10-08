import { buildLandingMetadata, ProductLandingPage } from "../_custom-products/ProductLandingPage";
import { customProductPages } from "../_custom-products/data";

const page = customProductPages.hoodies;

export const metadata = buildLandingMetadata(page);

export default function CustomHoodiesPage() {
  return <ProductLandingPage page={page} />;
}
