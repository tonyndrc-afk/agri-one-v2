import { AppShell } from "../../../components/AppShell";
import { KitsView } from "../../../components/views/KitsView";

export default function Page() {
  return (
    <AppShell persona="restaurant" active="Kits & produits">
      <KitsView persona="restaurant" />
    </AppShell>
  );
}
