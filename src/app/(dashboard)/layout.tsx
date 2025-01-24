import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center space-x-4">
            <span className="font-heading text-lg font-semibold text-foreground">
              Sendr
            </span>
          </div>

          {/* Center Navigation */}
          <div className="mx-auto flex space-x-1">
            <Button variant="ghost" size="sm" className="text-foreground-secondary hover:text-foreground">
              Chat
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground-secondary hover:text-foreground">
              Markets
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground-secondary hover:text-foreground">
              History
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground-secondary hover:text-foreground">
              Analytics
            </Button>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm text-foreground-secondary">
              {session.user.email}
            </span>
            <Button variant="ghost" size="sm" className="text-foreground-secondary hover:text-foreground">
              Settings
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-14">
        {children}
      </main>
    </div>
  );
}
