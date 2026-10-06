import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function NotFound() {
  return (
    <main dir="rtl" className="min-h-screen flex flex-col">

      <Header />

      <section className="flex-1 flex items-center justify-center p-6">

        <div className="qalby-card max-w-xl p-10 text-center">

          <div className="mb-5 text-6xl">
            ❤️
          </div>

          <h1 className="mb-4 text-4xl font-bold text-rose-700">
            الصفحة غير موجودة
          </h1>

          <p className="mb-6 text-gray-600">
            عذرًا، لم نتمكن من العثور على الصفحة التي تبحث عنها.
          </p>

          <a
            href="/"
            className="qalby-button inline-block"
          >
            العودة للرئيسية
          </a>

        </div>

      </section>

      <Footer />

    </main>
  );
}
