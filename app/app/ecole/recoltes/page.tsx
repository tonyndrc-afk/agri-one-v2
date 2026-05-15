import { AppShell } from "../../../components/AppShell";
import { RecoltesView } from "../../../components/views/RecoltesView";

export default function Page() {
  return (
    <AppShell persona="ecole" active="Récoltes">
      <RecoltesView persona="ecole" />
    </AppShell>
  );
}
