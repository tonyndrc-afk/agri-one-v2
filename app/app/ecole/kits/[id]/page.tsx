import { AppShell } from "../../../../components/AppShell";
import { ProductView } from "../../../../components/views/ProductView";
import { getProducts } from "../../../../catalog";

export function generateStaticParams() {
  // Prerender every product slug for this persona at build time.
  return getProducts().map((p) => ({ id: p.slug }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppShell persona="ecole" active="Kits & produits">
      <ProductView persona="ecole" slug={id} />
    </AppShell>
  );
}
