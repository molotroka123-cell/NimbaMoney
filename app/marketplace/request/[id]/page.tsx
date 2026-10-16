import RequestStatusPage from "./View";
import { requests } from "@/data/mock/requests";

// Static export (GitHub Pages) needs every path known at build time.
export function generateStaticParams() {
  return [...requests.map((r) => ({ id: r.id })), { id: "new" }];
}

export default function Page() {
  return <RequestStatusPage />;
}
