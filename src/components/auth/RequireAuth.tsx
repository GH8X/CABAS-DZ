import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "@/lib/store";

/**
 * Protects the admin dashboard. Signed-out visitors are sent to /auth with the
 * requested path preserved in `returnTo`, so signing in lands them right back
 * where they were headed instead of the public landing page.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { session } = useStore();
  const location = useLocation();

  if (!session) {
    const target = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/auth?returnTo=${encodeURIComponent(target)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}
