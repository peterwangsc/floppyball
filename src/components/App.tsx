import FloppyBall from "@/components/FloppyBall";
import { SupabaseProvider } from "@/context/SupabaseProvider";

function App() {
  return (
    <SupabaseProvider>
      <FloppyBall />
    </SupabaseProvider>
  );
}

export default App;
