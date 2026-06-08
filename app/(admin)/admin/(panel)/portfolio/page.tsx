import Image from "next/image";
import { getPortfolioItems } from "@/actions/portfolio.actions";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const { items } = await getPortfolioItems();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Portfolio</h1>

      <div className="mt-8 rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-alt)]">
            <tr>
              <th className="px-4 py-3 text-left">Thumbnail</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Visible</th>
              <th className="px-4 py-3 text-left">Order</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: {
              _id: string;
              title: string;
              category: string;
              images: string[];
              visible: boolean;
              order: number;
            }) => (
              <tr key={item._id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">
                  {item.images[0] && (
                    <div className="relative h-12 w-12 overflow-hidden rounded">
                      <Image src={item.images[0]} alt="" fill className="object-cover" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">
                  <Badge variant={item.visible ? "success" : "default"}>
                    {item.visible ? "Yes" : "No"}
                  </Badge>
                </td>
                <td className="px-4 py-3">{item.order}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
