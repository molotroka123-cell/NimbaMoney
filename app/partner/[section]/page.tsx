import PartnerSectionPage from "./View";
import { titles } from "./sections";

// Static export (GitHub Pages) needs every path known at build time.
export function generateStaticParams() {
  return Object.keys(titles).map((section) => ({ section }));
}

export default function Page() {
  return <PartnerSectionPage />;
}
