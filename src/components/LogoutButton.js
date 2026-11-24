"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    const result = await response.json();

    if (result.success) {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
    >
      Logout
    </button>
  );
}