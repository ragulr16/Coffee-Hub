import { QuickLogForm } from "@/components/logging/quick-log-form";

export default function NewLogPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">New Coffee Log</h1>
      <QuickLogForm />
    </div>
  );
}
