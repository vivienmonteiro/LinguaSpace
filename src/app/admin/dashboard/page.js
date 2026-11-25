import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import pool from "@/lib/db";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const statsQuery = await Promise.all([
    pool.query("SELECT COUNT(*) FROM users"),
    pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'"),
    pool.query("SELECT COUNT(*) FROM users WHERE role = 'teacher'"),
    pool.query("SELECT COUNT(*) FROM courses"),
    pool.query("SELECT COUNT(*) FROM categories"),
    pool.query("SELECT COUNT(*) FROM contents"),
  ]);

  const stats = [
    {
      title: "Total Users",
      value: statsQuery[0].rows[0].count,
      icon: "👥",
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Total Students",
      value: statsQuery[1].rows[0].count,
      icon: "🎓",
      color: "from-indigo-500 to-violet-600",
    },
    {
      title: "Total Teachers",
      value: statsQuery[2].rows[0].count,
      icon: "👩‍🏫",
      color: "from-fuchsia-500 to-purple-600",
    },
    {
      title: "Total Courses",
      value: statsQuery[3].rows[0].count,
      icon: "📚",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Categories",
      value: statsQuery[4].rows[0].count,
      icon: "🌎",
      color: "from-violet-600 to-indigo-500",
    },
    {
      title: "Learning Contents",
      value: statsQuery[5].rows[0].count,
      icon: "📝",
      color: "from-purple-600 to-fuchsia-500",
    },
  ];

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "🏠" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Courses", href: "/admin/courses", icon: "📚" },
    { name: "Categories", href: "/admin/categories", icon: "🌎" },
    { name: "Contents", href: "/admin/contents", icon: "📝" },
    {
      name: "Teacher Applications",
      href: "/admin/teachers",
      icon: "🎓",
    },
  ];

  const quickAccess = [
    {
      title: "Manage Users",
      description: "Manage Student, Teacher, and Admin accounts.",
      href: "/admin/users",
      icon: "👥",
      label: "User Management",
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Manage Courses",
      description: "View and manage all language courses.",
      href: "/admin/courses",
      icon: "📚",
      label: "Course Management",
      color: "from-indigo-500 to-violet-600",
    },
    {
      title: "Manage Categories",
      description: "Organize and manage language categories.",
      href: "/admin/categories",
      icon: "🌎",
      label: "Category Management",
      color: "from-purple-500 to-fuchsia-500",
    },
    {
      title: "Manage Contents",
      description: "Add, edit, and manage learning materials for all courses.",
      href: "/admin/contents",
      icon: "📝",
      label: "Content Management",
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Teacher Applications",
      description: "Review and manage teacher applications.",
      href: "/admin/teachers",
      icon: "🎓",
      label: "Application Management",
      color: "from-fuchsia-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6ff] text-[#25245b]">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-72 shrink-0 border-r border-violet-100 bg-white p-6 shadow-sm lg:flex lg:flex-col">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-violet-700">
              LinguaSpace
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Admin Dashboard
            </p>
          </div>

          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <nav className="flex-1 space-y-2">
            {menu.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${
                  index === 0
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                    : "text-[#393779] hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 border-t border-violet-100 pt-5">
            <div className="mb-4 rounded-xl bg-violet-50 p-4">
              <p className="font-bold">{session.user.username}</p>
              <p className="mt-1 text-xs text-violet-500">Administrator</p>
            </div>
            <LogoutButton />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
          {/* HEADER */}
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-sm font-semibold text-violet-500">
                Welcome back, Admin!
              </p>
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                Dashboard Overview
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Manage your LinguaSpace platform from one place.
              </p>
            </div>

            <div className="rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-violet-100">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="font-bold text-violet-700">
                {session.user.username}
              </p>
            </div>
          </header>

          {/* WELCOME BANNER */}
          <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-7 text-white shadow-lg sm:p-9">
            <div className="max-w-2xl">
              <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold">
                ADMINISTRATION PANEL
              </span>

              <h3 className="mt-5 text-2xl font-extrabold sm:text-3xl">
                Manage Your Learning Platform
              </h3>

              <p className="mt-3 text-sm leading-6 text-violet-100 sm:text-base">
                Welcome to LinguaSpace Administration. Monitor users,
                organize courses, manage learning materials, and review
                teacher applications easily.
              </p>
            </div>
          </section>

          {/* STATISTICS */}
          <section className="mb-10">
            <div className="mb-5">
              <h3 className="text-xl font-extrabold">Platform Statistics</h3>
              <p className="mt-1 text-sm text-gray-500">
                Overview of your platform activity.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-violet-100 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">
                        {stat.title}
                      </p>
                      <p className="mt-3 text-3xl font-extrabold text-[#25245b]">
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-2xl text-white shadow-md`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* QUICK ACCESS */}
          <section>
            <div className="mb-5">
              <h3 className="text-xl font-extrabold">Quick Access</h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose a section to manage your platform.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {quickAccess.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-violet-100 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-2xl text-white shadow-md`}
                    >
                      {item.icon}
                    </div>

                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-600">
                      {item.label}
                    </span>
                  </div>

                  <h4 className="text-lg font-extrabold text-[#25245b] transition group-hover:text-violet-700">
                    {item.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-bold text-violet-600">
                    Open Management
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* MOBILE MENU */}
          <section className="mt-10 lg:hidden">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-violet-100">
              <p className="mb-4 font-bold">Account</p>
              <p className="mb-4 text-sm text-gray-500">
                Logged in as {session.user.username}
              </p>
              <LogoutButton />
            </div>
          </section>

          <footer className="mt-12 border-t border-violet-100 pt-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} LinguaSpace. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}