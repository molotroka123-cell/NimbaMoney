import { AppShell } from "@/components/layout/AppShell";

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
