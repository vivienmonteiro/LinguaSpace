import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

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

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Users", href: "/admin/users" },
    { name: "Courses", href: "/admin/courses" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Teacher Applications", href: "/admin/teachers" },
  ];

  const cards = [
    { title: "Total Users", value: stats.total_users },
    { title: "Students", value: stats.total_students },
    { title: "Teachers", value: stats.total_teachers },
    { title: "Courses", value: stats.total_courses },
    { title: "Categories", value: stats.total_categories },
    { title: "Enrollments", value: stats.total_enrollments },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">
          LinguaSpace
        </h1>

        <p className="text-sm text-gray-400 mb-8">
          Administrator Panel
        </p>

        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block rounded-lg px-4 py-3 hover:bg-slate-700 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
                Admin Dashboard
            </h2>

             <p className="text-gray-500 mt-2">
                Welcome, {session.user.username}
            </p>
          </div>

         <LogoutButton />
        </header>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <p className="text-gray-500">{card.title}</p>

              <h3 className="text-3xl font-bold text-gray-800 mt-3">
                {card.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <section className="mt-10 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-5">
            Quick Access
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/admin/users"
              className="border rounded-lg p-5 hover:bg-gray-50"
            >
              <h4 className="font-semibold text-gray-800">
                Manage Users
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Manage Student, Teacher, and Admin accounts.
              </p>
            </Link>

            <Link
              href="/admin/courses"
              className="border rounded-lg p-5 hover:bg-gray-50"
            >
              <h4 className="font-semibold text-gray-800">
                Manage Courses
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                View and manage all courses.
              </p>
            </Link>

            <Link
              href="/admin/categories"
              className="border rounded-lg p-5 hover:bg-gray-50"
            >
              <h4 className="font-semibold text-gray-800">
                Manage Categories
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Manage language categories.
              </p>
            </Link>

            <Link
              href="/admin/teachers"
              className="border rounded-lg p-5 hover:bg-gray-50"
            >
              <h4 className="font-semibold text-gray-800">
                Teacher Applications
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Review teacher applications.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}