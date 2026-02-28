import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-bgSoft min-h-screen">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-primary">
          Personal Finance
        </h1>

        <div className="hidden md:flex gap-6 items-center">
          <Link to="/login" className="text-gray-600 hover:text-primary">
            Sign In
          </Link>

          <Link
            to="/register"
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-24 px-8">
        <h2 className="text-5xl font-bold mb-6">
          Take Control of Your Finances
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto mb-10">
          Track spending, manage budgets, and grow investments —
          all in one smart dashboard.
        </p>

        <Link
          to="/register"
          className="bg-primary hover:bg-primaryDark text-white px-8 py-4 rounded-xl text-lg"
        >
          Start Free
        </Link>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-8 px-10 pb-24">
        {[
          "Track Transactions",
          "Smart Budgeting",
          "Investment Insights"
        ].map((feature) => (
          <div
            key={feature}
            className="bg-white p-8 rounded-xl shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-2">
              {feature}
            </h3>
            <p className="text-gray-500">
              Manage your financial life with clarity and control.
            </p>
          </div>
        ))}
      </section>

    </div>
  );
} 