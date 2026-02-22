import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (session?.user?.role !== "super_admin") redirect("/admin");

  return <SettingsClient />;
}
