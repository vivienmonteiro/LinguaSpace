
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminDashboardPage() {
  const session = await getSession();

  // Memeriksa login
  if (!session.user) {
    redirect("/login");
  }

  // Memeriksa role admin
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Mengambil statistik dari database
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students,
      (SELECT COUNT(*) FROM users WHERE role = 'teacher') AS total_teachers,
      (SELECT COUNT(*) FROM courses) AS total_courses,
      (SELECT COUNT(*) FROM categories) AS total_categories,
      (SELECT COUNT(*) FROM enrollments) AS total_enrollments
  `);

  const stats = result.rows[0];

  // Menu sidebar
  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "🏠" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Courses", href: "/admin/courses", icon: "📚" },
    { name: "Categories", href: "/admin/categories", icon: "🌎" },
    {
      name: "Teacher Applications",
      href: "/admin/teachers",
      icon: "📝",
    },
  ];

  // Data statistik
  const cards = [
    {
      title: "Total Users",
      value: stats.total_users,
      icon: "👥",
      color: "from-violet-500 to-purple-500",
      iconBg: "bg-violet-100",
      description: "All registered accounts",
    },
    {
      title: "Students",
      value: stats.total_students,
      icon: "🎓",
      color: "from-purple-500 to-fuchsia-400",
      iconBg: "bg-purple-100",
      description: "Registered students",
    },
    {
      title: "Teachers",
      value: stats.total_teachers,
      icon: "👩🏻‍🏫",
      color: "from-indigo-500 to-violet-500",
      iconBg: "bg-indigo-100",
      description: "Registered teachers",
    },
    {
      title: "Total Courses",
      value: stats.total_courses,
      icon: "📚",
      color: "from-fuchsia-500 to-purple-500",
      iconBg: "bg-fuchsia-100",
      description: "Available language courses",
    },
    {
      title: "Categories",
      value: stats.total_categories,
      icon: "🌎",
      color: "from-violet-600 to-indigo-500",
      iconBg: "bg-indigo-100",
      description: "Language categories",
    },
    {
      title: "Enrollments",
      value: stats.total_enrollments,
      icon: "📋",
      color: "from-purple-600 to-violet-500",
      iconBg: "bg-purple-100",
      description: "Total course enrollments",
    },
  ];

  // Quick access
  const quickAccess = [
    {
      title: "Manage Users",
      description:
        "Manage Student, Teacher, and Admin accounts.",
      href: "/admin/users",
      icon: "👥",
      label: "User Management",
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Manage Courses",
      description:
        "View and manage all language courses.",
      href: "/admin/courses",
      icon: "📚",
      label: "Course Management",
      color: "from-indigo-500 to-violet-600",
    },
    {
      title: "Manage Categories",
      description:
        "Organize and manage language categories.",
      href: "/admin/categories",
      icon: "🌎",
      label: "Category Management",
      color: "from-purple-500 to-fuchsia-500",
    },
    {
      title: "Teacher Applications",
      description:
        "Review and manage teacher applications.",
      href: "/admin/teachers",
      icon: "📝",
      label: "Application Management",
      color: "from-fuchsia-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6ff] md:flex">

      {/* SIDEBAR */}
      <aside className="z-30 w-full border-b border-purple-100 bg-white md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:border-b-0 md:border-r">

        {/* LOGO */}
        <div className="border-b border-purple-100 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-2xl shadow-md shadow-purple-200">
              🪐
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#25245b]">
                LinguaSpace
              </h1>
              <p className="mt-1 text-xs font-semibold text-violet-500">
                Administrator Panel
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="px-4 pt-6">
          <p className="mb-4 px-3 text-xs font-extrabold uppercase tracking-widest text-violet-400">
            Main Menu
          </p>

          <nav className="flex gap-2 overflow-x-auto pb-3 md:flex-col md:overflow-visible">
            {menu.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex shrink-0 items-center gap-3 rounded-xl px-4 py-3.5 transition duration-200 ${
                  index === 0
                    ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md shadow-purple-200"
                    : "text-[#393779] hover:bg-purple-50 hover:text-violet-700"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xl ${
                    index === 0
                      ? "bg-white/20"
                      : "bg-purple-50 group-hover:bg-purple-100"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="text-sm font-extrabold">
                  {item.name}
                </span>

                {index === 0 && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* SIDEBAR BOTTOM */}
        <div className="mt-auto hidden p-5 md:block">
          <div className="rounded-2xl bg-gradient-to-br from-[#f0eaff] via-[#f5f1ff] to-[#e9e5ff] p-4">
            <div className="mb-2 text-2xl">💜</div>

            <p className="text-sm font-extrabold text-[#393779]">
              LinguaSpace
            </p>

            <p className="mt-1 text-xs font-medium leading-5 text-violet-500">
              Empowering everyone to learn a new language.
            </p>

            <div className="mt-4 border-t border-purple-200 pt-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:ml-64 md:px-8 md:py-8 lg:px-10">

        {/* HEADER */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2">
              <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-extrabold tracking-wide text-violet-700">
                ADMIN PANEL
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-[#25245b] md:text-3xl">
              Admin Dashboard
            </h2>

            <p className="mt-2 text-sm font-medium text-gray-500">
              Welcome back, {session.user.username}! 👋
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xl text-white">
              👤
            </div>

            <div>
              <p className="text-sm font-extrabold text-[#25245b]">
                {session.user.username}
              </p>
              <p className="text-xs font-semibold text-violet-500">
                Administrator
              </p>
            </div>
          </div>
        </header>

        {/* WELCOME BANNER */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#f0eaff] via-[#f5f1ff] to-[#e9e5ff] p-6 shadow-sm md:p-9">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-violet-700 shadow-sm">
              ✨ Administrator Overview
            </div>

            <h3 className="text-2xl font-extrabold leading-tight text-[#393779] md:text-4xl">
              Welcome to LinguaSpace!
            </h3>

            <p className="mt-3 text-sm font-medium leading-7 text-[#7772A5] md:text-base">
              Manage your language learning platform with ease.
              Monitor users, organize courses, manage categories,
              and review teacher applications all in one place.
            </p>

            <Link
              href="/admin/users"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-purple-800"
            >
              Manage Users
              <span>→</span>
            </Link>
          </div>

          <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-purple-200/50" />
          <div className="pointer-events-none absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-violet-200/50" />

          <div className="pointer-events-none absolute right-8 top-8 text-7xl opacity-30 md:right-20 md:text-8xl">
            🌐
          </div>

          <div className="pointer-events-none absolute bottom-5 right-32 text-4xl opacity-30 md:right-52 md:text-5xl">
            ✨
          </div>
        </section>

        {/* STATISTICS */}
        <section className="mb-10">
          <div className="mb-5">
            <h3 className="text-xl font-extrabold text-[#25245b]">
              Platform Overview
            </h3>

            <p className="mt-1 text-sm font-medium text-gray-500">
              Summary of LinguaSpace platform activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.title}
                className="group overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100"
              >
                <div
                  className={`h-1.5 bg-gradient-to-r ${card.color}`}
                />

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#7772A5]">
                        {card.title}
                      </p>

                      <h3 className="mt-3 text-3xl font-extrabold text-[#25245b]">
                        {card.value}
                      </h3>

                      <p className="mt-2 text-xs font-medium text-gray-400">
                        {card.description}
                      </p>
                    </div>

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg} text-2xl transition duration-300 group-hover:scale-110`}
                    >
                      {card.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* QUICK ACCESS */}
        <section className="mb-8">
          <div className="mb-5">
            <h3 className="text-xl font-extrabold text-[#25245b]">
              Quick Access
            </h3>

            <p className="mt-1 text-sm font-medium text-gray-500">
              Quickly access your administration tools.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {quickAccess.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-2xl text-white shadow-md transition duration-300 group-hover:scale-110`}
                  >
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-violet-500">
                      {item.label}
                    </span>

                    <h4 className="mt-2 text-lg font-extrabold text-[#25245b] transition group-hover:text-violet-700">
                      {item.title}
                    </h4>

                    <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                      {item.description}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-violet-600">
                      Open Page
                      <span className="transition group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </div>

                <div className="pointer-events-none absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-purple-50 transition group-hover:bg-purple-100" />
              </Link>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-purple-100 py-6 text-center">
          <p className="text-xs font-medium text-gray-400">
            © 2026 LinguaSpace. Empowering Language Learning. 💜
          </p>
        </footer>
      </main>
    </div>
  );
}
