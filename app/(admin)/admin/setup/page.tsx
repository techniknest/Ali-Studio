import { SetupWizard } from "@/components/admin/SetupWizard";

export default function SetupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
      <div className="w-full max-w-xl rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8">
        <h1 className="font-display text-3xl text-center text-[var(--accent)]">
          Welcome to Ali Studio
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
          Let&apos;s configure your platform
        </p>
        <div className="mt-8">
          <SetupWizard />
        </div>
      </div>
    </div>
  );
}
