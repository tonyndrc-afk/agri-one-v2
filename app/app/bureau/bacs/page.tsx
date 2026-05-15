import { AppShell } from "../../../components/AppShell";
import { BacsView } from "../../../components/views/BacsView";

export default function Page() {
  return (
    <AppShell persona="bureau" active="Mes bacs">
      <BacsView persona="bureau" />
    </AppShell>
  );
}
