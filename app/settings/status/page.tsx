import { redirect } from "next/navigation";

export default function StatusSettingPage() {
  redirect("/settings#visibility");
}
