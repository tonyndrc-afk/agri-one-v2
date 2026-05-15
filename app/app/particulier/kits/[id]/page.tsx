import { AppShell } from "../../../../components/AppShell";
import { ProductView } from "../../../../components/views/ProductView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppShell persona="particulier" active="Kits & produits">
      <ProductView persona="particulier" slug={id} />
    </AppShell>
  );
}
