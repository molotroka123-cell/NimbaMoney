import { redirect } from "next/navigation";

export default function BuyPage() {
  redirect("/p2p?side=buy");
}
