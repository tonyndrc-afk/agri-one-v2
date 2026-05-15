import { AppShell } from "../../../components/AppShell";
import { RecoltesView } from "../../../components/views/RecoltesView";

export default function Page() {
  return (
    <AppShell persona="bureau" active="Récoltes">
      <RecoltesView persona="bureau" />
    </AppShell>
  );
}
