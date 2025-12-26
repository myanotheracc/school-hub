import { useState, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import MobileNav from "./MobileNav";
import PageTransition from "./PageTransition";
import PullToRefresh from "./PullToRefresh";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRefresh = useCallback(async () => {
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Re-navigate to current route to trigger refresh
    navigate(location.pathname, { replace: true });
    toast.success("Page refreshed");
  }, [navigate, location.pathname]);

  const mainContent = (
    <div className="p-4 lg:p-6">
      <PageTransition>
        <Outlet />
      </PageTransition>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Navigation */}
      <MobileNav open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      {/* Top Navigation */}
      <TopNav
        onMenuClick={() => setMobileMenuOpen(true)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Content */}
      <main
        className={cn(
          "pt-16 pb-20 lg:pb-6 transition-all duration-300 h-[calc(100vh-4rem)]",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {isMobile ? (
          <PullToRefresh onRefresh={handleRefresh}>
            {mainContent}
          </PullToRefresh>
        ) : (
          mainContent
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
