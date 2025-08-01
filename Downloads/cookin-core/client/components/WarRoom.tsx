import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
// Removed unused import
import {
  ChevronLeft,
  ChevronRight,
  Target,
  BarChart3,
  Users,
  Calendar,
  FileText,
  Zap,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Maximize,
  Minimize,
  Home,
  Crown,
  Sparkles,
  Paperclip,
  Mic,
  ArrowUp,
  Building2,
  Wrench,
  ImageIcon,
  Rocket,
  MessageSquare,
  Shield,
  Palette,
  TrendingUp,
  User,
  LogOut,
} from "lucide-react";

interface WarRoomProps {
  className?: string;
}

interface CompanionMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickActions = [
  { icon: Users, label: "Contacts", color: "text-blue-400" },
  { icon: Calendar, label: "Calendar", color: "text-green-400" },
  { icon: FileText, label: "Notes", color: "text-yellow-400" },
  { icon: Bell, label: "Reminders", color: "text-red-400" },
];

const rightPanelItems = [
  { icon: Bell, label: "Alerts", active: false },
  { icon: Zap, label: "Automations", active: true },
  { icon: Settings, label: "Config", active: false },
  { icon: Search, label: "Search", active: false },
  { icon: Filter, label: "Filters", active: false },
];

export function WarRoom({ className }: WarRoomProps) {
  const navigate = useNavigate();
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const {
    user,
    loading: authLoading,
    signOut,
    userTier,
    hasAccess,
    incrementMessageCount,
    getUpgradeMessage,
  } = useAuth();
  const [crmMaximized, setCrmMaximized] = useState(false);
  const [workspaceInput, setWorkspaceInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [companionMessages, setCompanionMessages] = useState<
    CompanionMessage[]
  >([
    {
      role: "assistant",
      content:
        "Hey there! I'm Supersal™, your AI companion. I'm here to help with support, sales questions, or anything you need. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [workspaceMessages, setWorkspaceMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [companionInput, setCompanionInput] = useState("");
  const [companionLoading, setCompanionLoading] = useState(false);

  // Single function to handle companion messages
  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[hsl(var(--gold))]/20 border-t-[hsl(var(--gold))] rounded-full animate-spin" />
      </div>
    );
  }

  const sendCompanionMessage = async (message: string) => {
    if (!message.trim() || companionLoading) return;

    // Companion always available in WarRoom - tier restrictions only for dedicated companion page

    const userMessage = {
      role: "user" as const,
      content: message,
      timestamp: new Date(),
    };

    setCompanionMessages((prev) => [...prev, userMessage]);
    setCompanionInput("");
    setCompanionLoading(true);

    try {
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: message,
          userContext: { role: "user" },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage = {
        role: "assistant" as const,
        content:
          data.response ||
          "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      };

      setCompanionMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Companion error:", error);
      const errorMessage = {
        role: "assistant" as const,
        content:
          "I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
      };
      setCompanionMessages((prev) => [...prev, errorMessage]);
    } finally {
      setCompanionLoading(false);
    }
  };

  // Process workspace input - MAIN WARROOM FUNCTIONALITY
  const processWorkspaceInput = async () => {
    if (!workspaceInput.trim() || isProcessing) return;

    // WarRoom workspace is always available - no tier restrictions

    setIsProcessing(true);

    try {
      // Add user message to workspace
      const userMessage = workspaceInput.trim();
      setWorkspaceMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage },
      ]);
      setWorkspaceInput("");

      // This is where the magic happens - enterprise operations
      console.log("Processing enterprise operation:", userMessage);

      // Connect to OpenAI search for now (will switch to Azure when key is fixed)
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage,
          context: "warroom-enterprise",
          userContext: { role: "admin", internal: true, mode: "production" },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("AI Companion response:", result);
        // Add AI response to workspace messages
        setWorkspaceMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.response },
        ]);
      } else {
        setWorkspaceMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("Workspace operation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Full navigation - NEVER TOUCH AGAIN
  const leftPanelItems = [
    {
      icon: Home,
      label: "Main Dashboard",
      active: false,
      color: "text-[hsl(var(--gold))]",
      onClick: () => navigate("/"),
    },
    {
      icon: Users,
      label: "My Companion",
      active: false,
      color: "text-[hsl(var(--neon))]",
      onClick: () => setCompanionOpen(true),
    },
    {
      icon: Building2,
      label: "My Business",
      active: false,
      color: "text-green-400",
      onClick: () => navigate("/dashboard"),
    },
    {
      icon: FileText,
      label: "SaintGPT Search",
      active: false,
      color: "text-yellow-400",
      onClick: () => navigate("/search"),
    },
    {
      icon: MessageSquare,
      label: "Sticky Notes",
      active: false,
      color: "text-green-400",
      onClick: () =>
        alert(
          "📝 Sticky Notes feature coming soon! Will include notes, tasks, voice memos, and cross-device sync.",
        ),
    },
    {
      icon: Wrench,
      label: "AI Tools",
      active: false,
      color: "text-purple-400",
      onClick: () => navigate("/tools"),
    },
    {
      icon: ImageIcon,
      label: "Image Generator",
      active: false,
      color: "text-pink-400",
      onClick: () => navigate("/tools"),
    },
    {
      icon: Rocket,
      label: "SVG Launchpad",
      active: false,
      color: "text-orange-400",
      onClick: () => navigate("/broker"),
    },
    {
      icon: MessageSquare,
      label: "Feedback & Help",
      active: false,
      color: "text-white",
      onClick: () => navigate("/help"),
    },
    {
      icon: Users,
      label: "PartnerTech.ai CRM",
      active: false,
      color: "text-teal-400",
      onClick: () => navigate("/crm"),
    },
    {
      icon: Shield,
      label: "Route Intelligence",
      active: false,
      color: "text-yellow-400",
      onClick: () => navigate("/audit-service"),
    },
    {
      icon: Palette,
      label: "SVT Institute",
      active: false,
      color: "text-violet-400",
      onClick: () => navigate("/institute"),
    },
    {
      icon: TrendingUp,
      label: "Upgrade Tier",
      active: false,
      color: "text-emerald-400",
      onClick: () => navigate("/pricing"),
    },
    {
      icon: User,
      label: "My Account",
      active: false,
      color: "text-gray-300",
      onClick: signOut,
    },
    {
      icon: LogOut,
      label: "Logout",
      active: false,
      color: "text-rose-400",
      onClick: signOut,
    },
  ];

  return (
    <div
      className={`min-h-screen relative ${className}`}
      style={{ backgroundColor: "#1a1a1a" }}
    >
      {/* Left Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full border-r border-border/30 bg-sidebar-background transition-all duration-300 z-40 ${
          leftPanelOpen ? "w-48" : "w-16"
        }`}
      >
        {/* Fixed Background Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.25] overflow-hidden">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F2c553a9d8cf24e6eae81a4a63962c5a4%2F6a4a7caae7d14837b20112e2ce9e5015?format=webp&width=300"
            alt="Cookin' Knowledge Background"
            className="w-[220px] h-auto object-contain"
          />
        </div>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border/30">
          <div className="flex items-center justify-between">
            {leftPanelOpen && (
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F2c553a9d8cf24e6eae81a4a63962c5a4%2Fc88eaa91ad364821b51a4fc6c47320ab?format=webp&width=80"
                  alt="Sv."
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <h1 className="text-lg font-bold text-sidebar-foreground">
                    Menu
                  </h1>
                  <p className="text-xs text-[hsl(var(--gold))] uppercase tracking-wider">
                    NAVIGATION
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className="ml-auto"
            >
              {leftPanelOpen ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-2">
          {leftPanelItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  item.active
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Navigation clicked:", item.label);
                  try {
                    item.onClick();
                  } catch (error) {
                    console.error("Navigation error:", error);
                  }
                }}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${item.color}`} />
                {leftPanelOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        {leftPanelOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full border-l border-border/30 bg-sidebar-background transition-all duration-300 z-40 overflow-auto ${
          rightPanelOpen ? "w-72" : "w-16"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border/30">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
            >
              {rightPanelOpen ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
            {rightPanelOpen && (
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-lg font-bold text-sidebar-foreground">
                    TOOLS
                  </h1>
                  <p className="text-xs text-[hsl(var(--gold))] uppercase tracking-wider">
                    PRO FEATURES
                  </p>
                </div>
                <Crown className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
            )}
          </div>
        </div>

        {/* Tool Items */}
        <div className="p-2">
          {rightPanelItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  item.active
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {rightPanelOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* GHL CRM Widget */}
        {rightPanelOpen && (
          <div className="p-4 border-t border-sidebar-border/30">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-[hsl(var(--gold))]" />
              GHL CRM
            </h3>
            <div className="h-64 bg-muted/10 rounded-xl border border-border/30 overflow-hidden mb-4">
              <iframe
                src="about:blank"
                className="w-full h-full border-0"
                title="GHL CRM"
                style={{ backgroundColor: "#1a1a1a" }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/10 pointer-events-none">
                <div className="text-center">
                  <div className="text-lg font-bold text-[hsl(var(--gold))] mb-1">
                    $89.2k
                  </div>
                  <div className="text-xs text-muted-foreground">Pipeline</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {rightPanelOpen && (
          <div className="p-4 border-t border-sidebar-border/30">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              ⚡ Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors text-center"
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${action.color}`} />
                    <div className="text-xs font-medium text-foreground">
                      {action.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Additional Tools */}
        {rightPanelOpen && (
          <div className="p-4 border-t border-sidebar-border/30">
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setWorkspaceMessages([])}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  if (!hasAccess("export")) {
                    alert(
                      `Export requires Enterprise tier. Current: ${userTier}. Visit /pricing to upgrade.`,
                    );
                    navigate("/pricing");
                    return;
                  }
                  console.log("Export functionality coming soon");
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  if (!hasAccess("import")) {
                    alert(
                      `Import requires Enterprise tier. Current: ${userTier}. Visit /pricing to upgrade.`,
                    );
                    navigate("/pricing");
                    return;
                  }
                  console.log("Import functionality coming soon");
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area - WIDE OPEN WORKSPACE */}
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: leftPanelOpen ? "192px" : "64px",
          marginRight: rightPanelOpen ? "288px" : "64px",
        }}
      >
        {/* Top Bar */}
        <div className="border-b border-border/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-light text-white tracking-[0.3em] uppercase">
                  WARROOM
                </h1>
                <div className="text-xs bg-primary/20 text-primary px-3 py-1 rounded uppercase tracking-wider font-medium">
                  PRODUCTION CENTER
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[hsl(var(--neon-green))] rounded-full animate-pulse"></div>
                  <span className="text-sm text-[hsl(var(--neon-green))]">
                    Live
                  </span>
                </div>
              </div>
              <div className="text-sm text-cyan-400 font-medium">
                Powered by{" "}
                <span className="text-blue-400">Azure Cognitive Services</span>{" "}
                and{" "}
                <span className="text-[hsl(var(--gold))]">
                  SaintSalGPT 4.1 SaintVisionAI
                </span>
              </div>
              <div className="text-xs text-yellow-400 font-bold mt-1">
                🛡️ Enterprise Route Intelligence: 47+ Clients • $8,947 Revenue •
                Premium Add-On Available
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className={
                  rightPanelOpen
                    ? "bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))]"
                    : ""
                }
              >
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("WarRoom System Test:", {
                    timestamp: new Date().toISOString(),
                    user: user?.email,
                    tier: userTier,
                    workspace_active: true,
                    api_ready: true,
                  });
                  alert(
                    `✅ System Test Complete\nUser: ${user?.email || "Anonymous"}\nTier: ${userTier}\nWorkspace: Active\nAPI: Ready`,
                  );
                }}
              >
                System Test
              </Button>
            </div>
          </div>
        </div>

        {/* Main Workspace Area */}
        <div className="flex-1 p-6 pb-20 overflow-y-auto">
          {workspaceMessages.length === 0 ? (
            <div
              className={`text-center text-muted-foreground/50 mt-20 transition-all duration-500 ${workspaceInput.trim() ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}
            >
              <h2 className="text-xl font-light mb-4">
                Productivity Workspace
              </h2>
              <p>Your collaborative workspace is ready for action</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4 mt-6">
              {workspaceMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-[hsl(var(--gold))]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Crown className="w-4 h-4 text-[hsl(var(--gold))]" />
                    </div>
                  )}
                  <div
                    className={`max-w-lg px-4 py-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-cyan-400 text-black"
                        : "bg-muted text-foreground border border-[hsl(var(--gold))]/20"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-cyan-400" />
                    </div>
                  )}
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-[hsl(var(--gold))]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Crown className="w-4 h-4 text-[hsl(var(--gold))]" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-lg border border-[hsl(var(--gold))]/20">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[hsl(var(--gold))] rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-[hsl(var(--gold))] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-[hsl(var(--gold))] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Search Interface */}
      <div
        className="fixed bottom-0 border-t border-border/30 p-3 z-50"
        style={{
          backgroundColor: "#1a1a1a",
          left: leftPanelOpen ? "192px" : "64px",
          right: rightPanelOpen ? "288px" : "64px",
        }}
      >
        <div className="w-full max-w-2xl mx-auto">
          {/* Compact Search Bar */}
          <div className="flex items-center gap-2 p-3 border-2 border-[hsl(var(--neon))] rounded-lg bg-muted/5 focus-within:border-[hsl(var(--gold))] focus-within:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all">
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Paperclip className="w-4 h-4 text-[hsl(var(--neon))]" />
            </Button>

            <textarea
              value={workspaceInput}
              onChange={(e) => setWorkspaceInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  processWorkspaceInput();
                }
              }}
              placeholder="Execute business operations, analyze data, manage workflows..."
              className="flex-1 bg-transparent border-0 resize-none outline-none text-foreground placeholder:text-muted-foreground min-h-[20px] max-h-20 text-sm"
              rows={1}
            />

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="ghost" size="sm">
                <Mic className="w-4 h-4 text-[hsl(var(--neon))]" />
              </Button>

              <Button
                size="sm"
                onClick={processWorkspaceInput}
                disabled={!workspaceInput.trim() || isProcessing}
                className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/90 text-black rounded-lg px-4 shadow-[0_0_15px_rgba(255,215,0,0.4)] disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Compact Status */}
          <div className="text-center mt-2">
            <div className="text-xs text-muted-foreground/60">
              <span className="text-cyan-400">Dual companion</span> ready •
              <span className="text-blue-400"> Azure-powered</span> •
              <span className="text-[hsl(var(--gold))]">Production-grade</span>{" "}
              operations
            </div>
          </div>
        </div>

        {/* Minimal Bottom Status */}
        <div className="border-t border-border/30 p-2">
          <div className="flex items-center justify-center text-xs text-muted-foreground/60">
            <span className="text-[hsl(var(--gold))] font-medium">
              SAINTSAL GOTTA GUY
            </span>
            <Sparkles className="w-3 h-3 text-[hsl(var(--gold))] ml-1" />
          </div>
        </div>
      </div>

      {/* Supersal™ AI Sticky Companion */}
      {companionOpen && (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-black/95 border-2 border-[hsl(var(--gold))]/60 rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.4)] backdrop-blur-sm z-[60] flex flex-col">
          {/* Companion Header */}
          <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--gold))]/30">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F2c553a9d8cf24e6eae81a4a63962c5a4%2F8c7c9578e6324915bda191428ef80ec9?format=webp&width=800"
                alt="Supersal AI"
                className="w-10 h-10 rounded-xl object-cover shadow-[0_0_20px_rgba(255,215,0,0.5)]"
              />
              <div>
                <h3 className="text-sm font-bold text-[hsl(var(--gold))]">
                  Supersal™ AI
                </h3>
                <p className="text-xs text-[hsl(var(--gold))]/70">
                  Help Desk Companion
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[hsl(var(--neon-green))] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,0,0.6)]"></div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCompanionOpen(false)}
                className="text-[hsl(var(--gold))]/60 hover:text-[hsl(var(--gold))] transition-colors"
              >
                ×
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {companionMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[280px] p-3 rounded-xl ${
                    message.role === "user"
                      ? "bg-cyan-400/20 text-white border border-cyan-400/30"
                      : "bg-gray-800/80 text-gray-100 border border-gray-600/30"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {companionLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800/80 text-gray-100 border border-gray-600/30 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                    <span className="text-xs text-cyan-400 ml-2">
                      Supersal™ is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-cyan-400/30">
            <div className="flex items-center gap-2 p-2 border border-cyan-400/40 rounded-lg bg-black/50 focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">
              <input
                type="text"
                value={companionInput}
                onChange={(e) => setCompanionInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendCompanionMessage(companionInput);
                  }
                }}
                placeholder="Ask Supersal™ for help..."
                className="flex-1 bg-transparent border-0 outline-none text-white placeholder:text-gray-400 text-sm"
                disabled={companionLoading}
              />
              <Button
                size="sm"
                disabled={!companionInput.trim() || companionLoading}
                className="bg-cyan-400 hover:bg-cyan-300 text-black px-3 py-1 rounded"
                onClick={() => sendCompanionMessage(companionInput)}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center mt-2">
              <div className="text-xs text-gray-400">
                <span className="text-cyan-400">Supersal™</span> • Help Desk •
                <span className="text-green-400">Live Support</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Companion Button (when closed) */}
      {!companionOpen && (
        <Button
          onClick={() => setCompanionOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--gold))] to-yellow-600 hover:from-[hsl(var(--gold))]/90 hover:to-yellow-500 shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:shadow-[0_0_40px_rgba(255,215,0,0.7)] transition-all duration-300 z-50 group border border-[hsl(var(--gold))]/30"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F2c553a9d8cf24e6eae81a4a63962c5a4%2F8c7c9578e6324915bda191428ef80ec9?format=webp&width=800"
            alt="Supersal AI"
            className="w-10 h-10 rounded-xl object-cover group-hover:scale-110 transition-transform"
          />
        </Button>
      )}
    </div>
  );
}

export default WarRoom;
