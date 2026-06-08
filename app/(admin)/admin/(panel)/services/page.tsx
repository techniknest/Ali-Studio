import { getServices } from "@/actions/services.actions";
import { ServicesManager } from "@/components/admin/ServicesManager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div className="max-w-4xl">
      <ServicesManager initialServices={services} />
    </div>
  );
}
