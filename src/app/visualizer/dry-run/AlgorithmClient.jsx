import Footer from "@/app/components/footer";
import DryRunClient from "./DryRunClient";
import { CollaborationProvider } from "@/app/components/ui/CollaborationProvider";
import LiveCursors from "@/app/visualizer/components/LiveCursors";
import CollaborationToolbar from "@/app/visualizer/components/CollaborationToolbar";

export default function DryRunPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#101216] dark:text-slate-100">
      <CollaborationProvider>
        <LiveCursors />
        <div className="pt-8">
          <CollaborationToolbar />
        </div>
        <DryRunClient />
      </CollaborationProvider>
      <Footer />
    </div>
  );
}

