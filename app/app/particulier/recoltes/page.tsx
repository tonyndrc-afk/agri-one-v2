import { AppShell } from "../../../components/AppShell";
import { RecoltesView } from "../../../components/views/RecoltesView";

export default function Page() {
  return (
    <AppShell persona="particulier" active="Récoltes">
      <RecoltesView persona="particulier" />
    </AppShell>
  );
}
