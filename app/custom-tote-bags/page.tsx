import { buildLandingMetadata, ProductLandingPage } from "../_custom-products/ProductLandingPage";
import { customProductPages } from "../_custom-products/data";

const page = customProductPages.totes;

export const metadata = buildLandingMetadata(page);

export default function CustomToteBagsPage() {
  return <ProductLandingPage page={page} />;
}
