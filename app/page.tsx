import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  // This part will never be reached because of redirects
  return null;
}
