import { buildLandingMetadata, ProductLandingPage } from "../_custom-products/ProductLandingPage";
import { customProductPages } from "../_custom-products/data";

const page = customProductPages.mugs;

export const metadata = buildLandingMetadata(page);

export default function CustomMugsPage() {
  return <ProductLandingPage page={page} />;
}
