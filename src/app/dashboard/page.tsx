import { headers } from "next/headers";
import { redirect } from "next/navigation";

import SignOutButton from "@/app/dashboard/components/sign-out-button";
import { auth } from "@/lib/auth";

async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authentication");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h1>{session?.user?.name}</h1>
      <h1>{session?.user?.email}</h1>
      <SignOutButton />
    </div>
  );
}

export default DashboardPage;
