import P2POrderPage from "./View";
import { orders } from "@/data/mock/p2p";

// Static export (GitHub Pages) needs every path known at build time.
export function generateStaticParams() {
  return [...orders.map((o) => ({ id: o.id })), { id: "new" }];
}

export default function Page() {
  return <P2POrderPage />;
}
