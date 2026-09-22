import { Link, useRouterState } from "@tanstack/react-router";
import {
  Boxes,
  ChartNoAxesCombined,
  Columns3,
  Factory,
  LayoutDashboard,
  KeyRound,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Printer as PrinterIcon,
  Settings,
  Users,
  UserSquare2,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PasswordForm } from "./password-form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { initials } from "@/lib/gaeva/helpers";
import { useGaeva } from "@/lib/gaeva/store";
import { ROLE_LABELS } from "@/lib/gaeva/types";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Visão geral", icon: LayoutDashboard },
  { to: "/pedidos", label: "Pedidos", icon: Boxes },
  {
    to: "/comercial/acoes",
    label: "Ações comerciais",
    icon: ChartNoAxesCombined,
    commercialOnly: true,
  },
  { to: "/pedidos/kanban", label: "Kanban de pedidos", icon: Columns3 },
  { to: "/producao", label: "Produção", icon: Factory },
  { to: "/clientes", label: "Clientes", icon: UserSquare2 },
  { to: "/impressoras", label: "Impressoras", icon: PrinterIcon },
  { to: "/equipe", label: "Equipe", icon: Users },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

const COLLAPSE_KEY = "gaeva.sidebar.collapsed";

function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* preferência indisponível */
    }
  }, []);

  const toggle = () =>
    setCollapsed((old) => {
      const next = !old;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* preferência indisponível */
      }
      return next;
    });

  return { collapsed, toggle };
}

function SidebarContent({
  collapsed,
  onNavigate,
  onToggle,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  onToggle?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { currentMember } = useGaeva();
  const visibleNav = NAV.filter(
    (item) =>
      !("commercialOnly" in item && item.commercialOnly) ||
      currentMember.role === "admin" ||
      currentMember.role === "comercial",
  );

  return (
    <TooltipProvider delayDuration={120}>
      <div className="flex h-full flex-col gap-4 border-r border-sidebar-border bg-sidebar px-2 py-4 text-sidebar-foreground">
        <div className={cn("flex items-center gap-2 px-2", collapsed && "justify-center px-0")}>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
            GA
          </div>
          {collapsed ? null : (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">GAEVA OS</p>
              <p className="truncate text-[11px] text-sidebar-foreground/55">Operação 3D</p>
            </div>
          )}
        </div>

        <nav aria-label="Navegação principal" className="flex flex-1 flex-col gap-0.5">
          {visibleNav.map(({ to, label, icon: Icon }) => {
            const active =
              to === "/"
                ? pathname === "/"
                : to === "/pedidos"
                  ? pathname.startsWith(to) && !pathname.startsWith("/pedidos/kanban")
                  : pathname.startsWith(to);

            const item = (
              <Link
                key={to}
                to={to}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                title={collapsed ? label : undefined}
                className={cn(
                  "transition-ui relative flex items-center gap-3 rounded-lg py-2 text-sm font-medium outline-none",
                  "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
                  collapsed ? "justify-center px-0" : "px-3",
                  active
                    ? "bg-sidebar-primary/45 text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "transition-ui absolute left-0 top-1/2 w-0.5 -translate-y-1/2 rounded-full bg-primary",
                    active ? "h-5 opacity-100" : "h-0 opacity-0",
                  )}
                />
                <Icon className="size-4 shrink-0" aria-hidden />
                {collapsed ? <span className="sr-only">{label}</span> : label}
              </Link>
            );

            if (!collapsed) return item;
            return (
              <Tooltip key={to}>
                <TooltipTrigger asChild>{item}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {onToggle ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            aria-pressed={collapsed}
            className={cn(
              "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed ? "justify-center px-0" : "justify-start",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <>
                <PanelLeftClose className="size-4" /> Recolher
              </>
            )}
          </Button>
        ) : null}

        {collapsed ? null : (
          <p className="px-3 text-[11px] leading-relaxed text-sidebar-foreground/40">
            Software interno GAEVA. Dados protegidos pelo Supabase.
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}

function SessionSwitcher() {
  const { currentMember, signOut } = useGaeva();
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-8">
        <AvatarFallback className="bg-secondary text-xs">
          {initials(currentMember.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="max-w-[170px] truncate text-sm font-medium">{currentMember.name}</p>
        <p className="text-xs text-muted-foreground">{ROLE_LABELS[currentMember.role]}</p>
      </div>
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Alterar minha senha"
            title="Alterar senha"
          >
            <KeyRound className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar senha</DialogTitle>
            <DialogDescription>Escolha uma nova senha para sua conta GAEVA.</DialogDescription>
          </DialogHeader>
          <PasswordForm onComplete={() => setPasswordOpen(false)} />
        </DialogContent>
      </Dialog>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Sair do sistema"
        onClick={() => void signOut()}
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  );
}

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string | undefined;
  actions?: ReactNode | undefined;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, toggle } = useSidebarCollapsed();

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 lg:block",
          collapsed ? "w-[68px]" : "w-60",
        )}
        style={{ transition: "width 160ms cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        <SidebarContent collapsed={collapsed} onToggle={toggle} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-foreground/40"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64">
            <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Abrir menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold">{title}</h1>
              {description ? (
                <p className="truncate text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">{actions}</div>
            <div className="hidden xl:block">
              <SessionSwitcher />
            </div>
          </div>
          <div className="border-t border-border px-4 py-2 xl:hidden">
            <SessionSwitcher />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
