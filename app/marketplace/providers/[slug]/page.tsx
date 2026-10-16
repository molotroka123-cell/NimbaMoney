import ProviderProfilePage from "./View";
import { providers } from "@/data/mock/providers";

// Static export (GitHub Pages) needs every path known at build time.
export function generateStaticParams() {
  return providers.map((p) => ({ slug: p.slug }));
}

export default function Page() {
  return <ProviderProfilePage />;
}
