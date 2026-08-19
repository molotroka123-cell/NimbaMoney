import { redirect } from "next/navigation";

export default function SellPage() {
  redirect("/p2p?side=sell");
}
