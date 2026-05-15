import { AppShell } from "../../../components/AppShell";
import { BacsView } from "../../../components/views/BacsView";

export default function Page() {
  return (
    <AppShell persona="restaurant" active="Mes bacs">
      <BacsView persona="restaurant" />
    </AppShell>
  );
}
