import { NAMESPACE_PATH } from "@/constants/app";
import { redirect } from "next/navigation";

export default function RootPage() {
  if (!NAMESPACE_PATH) {
    throw new Error("NEXT_PUBLIC_NAMESPACE is not set");
  }
  redirect(NAMESPACE_PATH);
}
