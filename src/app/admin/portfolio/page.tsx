import { getAllPortfolioContent } from "@/actions/portfolio";
import PortfolioEditor from "@/components/admin/PortfolioEditor";

export default async function PortfolioAdminPage() {
  const contents = await getAllPortfolioContent();
  const contentMap = Object.fromEntries(contents.map((c) => [c.section, c.content]));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Yönetimi</h1>
        <p className="text-gray-500 text-sm mt-1">
          Ana sayfanızın içeriğini buradan düzenleyebilirsiniz.
        </p>
      </div>
      <PortfolioEditor initialContent={contentMap} />
    </div>
  );
}
