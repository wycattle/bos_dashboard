/**
 * app/page.tsx
 * Redirects to the main dashboard
 */
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");
}
