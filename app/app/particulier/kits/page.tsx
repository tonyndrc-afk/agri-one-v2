import { AppShell } from "../../../components/AppShell";
import { KitsView } from "../../../components/views/KitsView";

export default function Page() {
  return (
    <AppShell persona="particulier" active="Kits & produits">
      <KitsView persona="particulier" />
    </AppShell>
  );
}
