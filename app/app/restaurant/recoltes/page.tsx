import { AppShell } from "../../../components/AppShell";
import { RecoltesView } from "../../../components/views/RecoltesView";

export default function Page() {
  return (
    <AppShell persona="restaurant" active="Récoltes">
      <RecoltesView persona="restaurant" />
    </AppShell>
  );
}
