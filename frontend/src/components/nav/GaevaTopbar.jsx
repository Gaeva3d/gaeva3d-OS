import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Moon, Sun, Bell, ChevronDown, LogOut } from 'lucide-react';
import SecurityBadge from '../SecurityBadge';
import { gaevaLabel } from './gaevaNavigation';
import '../../styles/gaeva-topbar.css';

/** Shell navigation only; results come from the same permission-filtered menu. */
export default function GaevaTopbar({ groups, user, version, aiSettings, appearance, onToggleAppearance, onLogout, isPro, isAdmin, buyerPortalUrl, portalLinkLoading, onOpenPortalAdmin }) {
  const [query, setQuery] = useState('');
  const [panel, setPanel] = useState(null);
  const searchDialog = useRef(null);
  const searchInput = useRef(null);
  const header = useRef(null);
  const profileButton = useRef(null);
  const notificationsButton = useRef(null);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Usuário';
  const initials = [user?.first_name?.[0], user?.last_name?.[0]].filter(Boolean).join('') || 'U';
  const roles = { admin: 'Administração', operator: 'Operação', customer: 'Cliente' };
  const role = roles[user?.account_type] || user?.account_type || 'Conta';
  const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const pages = groups.flatMap((group) => group.items);
  const { pathname } = useLocation();
  const currentPage = [...pages].sort((a, b) => b.path.length - a.path.length)
    .find((page) => pathname === page.path || (page.path !== '/admin' && pathname.startsWith(`${page.path}/`)));
  const results = pages.filter((item) => normalize(`${gaevaLabel(item.label)} ${item.label}`).includes(normalize(query)));
  const openSearch = useCallback(() => {
    setPanel(null);
    setQuery('');
    if (!searchDialog.current?.open) searchDialog.current?.showModal();
    searchInput.current?.focus();
  }, []);
  useEffect(() => {
    const keydown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
      }
      if (event.key === 'Escape' && panel) {
        setPanel(null);
        (panel === 'account' ? profileButton : notificationsButton).current?.focus();
      }
    };
    const outside = (event) => {
      if (!header.current?.contains(event.target)) setPanel(null);
    };
    document.addEventListener('keydown', keydown);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('pointerdown', outside);
    };
  }, [panel, openSearch]);
  return (
    <header ref={header} className="gaeva-topbar gaeva-topbar-v2 sticky top-0 z-30">
      <div className="gaeva-workspace-crumb"><span>GAEVA OS</span><span aria-hidden="true">/</span><strong>{currentPage ? gaevaLabel(currentPage.label) : 'Área de trabalho'}</strong></div>
      <div className="gaeva-header-tools">
        <button type="button" className="gaeva-page-search" aria-label="Buscar páginas" onClick={openSearch}><Search size={16} /><span>Buscar páginas...</span><kbd>Ctrl K</kbd></button>
        <button type="button" className="gaeva-icon-control" aria-label={appearance === 'dark' ? 'Usar aparência clara' : 'Usar aparência escura'} onClick={onToggleAppearance}>{appearance === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button>
        <div className="gaeva-popover-anchor">
          <button ref={notificationsButton} type="button" className="gaeva-icon-control" aria-label="Notificações" aria-expanded={panel === 'notifications'} aria-controls="gaeva-notifications" onClick={() => setPanel(panel === 'notifications' ? null : 'notifications')}><Bell size={19} /></button>
          {panel === 'notifications' && <section id="gaeva-notifications" className="gaeva-header-popover" aria-label="Notificações"><strong>Notificações</strong><p>A central de notificações ainda não está integrada.</p><small>Consulte as pendências no painel inicial e nos módulos.</small></section>}
        </div>
        <div className="gaeva-popover-anchor">
          <button ref={profileButton} type="button" className="gaeva-profile-control" aria-label="Menu da conta" aria-expanded={panel === 'account'} aria-controls="gaeva-account" onClick={() => setPanel(panel === 'account' ? null : 'account')}><span className="gaeva-profile-avatar">{initials}</span><span className="gaeva-profile-name">{fullName}<small>{role}</small></span><ChevronDown size={14} /></button>
          {panel === 'account' && <section id="gaeva-account" className="gaeva-header-popover gaeva-account-popover" aria-label="Conta">
            <div className="gaeva-account-heading"><strong>{fullName}</strong><small>{role}</small></div>
            {isAdmin && <Link to="/admin/settings" onClick={() => setPanel(null)}>Configurações</Link>}
            {isPro && isAdmin && <button type="button" onClick={onOpenPortalAdmin} disabled={portalLinkLoading}>{portalLinkLoading ? 'Abrindo…' : 'Administração do portal'}</button>}
            {isPro && isAdmin && buyerPortalUrl && <a href={buyerPortalUrl} target="_blank" rel="noopener noreferrer">Portal do comprador</a>}
            <button type="button" onClick={onToggleAppearance}>Alternar aparência</button>
            <div className="gaeva-account-system"><small>Versão {version}</small><SecurityBadge aiProvider={aiSettings?.ai_provider} externalBlocked={aiSettings?.external_ai_blocked} /></div>
            <button type="button" onClick={onLogout}><LogOut size={16} />Sair</button>
          </section>}
        </div>
      </div>
      <dialog ref={searchDialog} className="gaeva-search-dialog" aria-label="Buscar páginas" onClick={(event) => { if (event.target === searchDialog.current) searchDialog.current.close(); }}>
        <div className="gaeva-search-heading"><Search size={18} /><input ref={searchInput} value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Nome da página" placeholder="Buscar páginas..." /><button type="button" aria-label="Fechar busca" onClick={() => searchDialog.current.close()}>Esc</button></div>
        <div className="gaeva-search-results">{results.length ? results.map((item) => <Link key={item.path} to={item.path} onClick={() => searchDialog.current.close()}><item.icon /><span>{gaevaLabel(item.label)}</span></Link>) : <p>Nenhuma página encontrada.</p>}</div>
      </dialog>
    </header>
  );
}
