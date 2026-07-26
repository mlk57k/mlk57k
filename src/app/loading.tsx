import { AppLogo } from "@/components/ui/logo";

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="animate-pulse">
        <AppLogo size="md" />
      </div>
    </div>
  );
}
