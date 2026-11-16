/**
 * AdminNotifications - Operator messaging / notification inbox
 *
 * Thread-based view: left panel lists threads, right panel shows messages + reply.
 */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../components/Toast";
import { useFeatureFlags } from "../../hooks/useFeatureFlags";

function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Agora";
  if (diffMins < 60) return `${diffMins} min atrás`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} h atrás`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} d atrás`;
  return date.toLocaleDateString("pt-BR");
}

export default function AdminNotifications() {
  const api = useApi();
  const toast = useToast();
  const navigate = useNavigate();
  const { isPro } = useFeatureFlags();

  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState({});
  const replyText = drafts[selectedThread?.thread_id] || "";
  const setReplyText = (text) => setDrafts((current) => ({ ...current, [selectedThread.thread_id]: text }));
  const selectionEpoch = useRef(0);
  const listEpoch = useRef(0);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(false);
  const [listError, setListError] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Compose new thread state
  const [showCompose, setShowCompose] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [composeRecipient, setComposeRecipient] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeSending, setComposeSending] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  useEffect(() => {
    fetchThreads();
    return () => { listEpoch.current += 1; };
  }, [unreadOnly]);

  useEffect(() => () => { selectionEpoch.current += 1; }, []);

  const fetchThreads = async () => {
    const epoch = ++listEpoch.current;
    try {
      setLoading(true);
      setListError(false);
      const params = new URLSearchParams();
      if (unreadOnly) params.set("unread_only", "true");
      const data = await api.get(`/api/v1/notifications?${params}`);
      if (epoch !== listEpoch.current) return;
      if (!Array.isArray(data) || data.some((thread) => !thread || Array.isArray(thread) || typeof thread.thread_id !== "string")) throw new Error("Invalid threads");
      setThreads(data);
    } catch {
      if (epoch !== listEpoch.current) return;
      setThreads([]);
      setListError(true);
      selectionEpoch.current += 1;
      setSelectedThread(null);
      setMessages([]);
    } finally {
      if (epoch === listEpoch.current) setLoading(false);
    }
  };

  const selectThread = async (thread) => {
    const epoch = ++selectionEpoch.current;
    setSelectedThread(thread);
    setMessages([]);
    setMessagesLoading(true);
    setMessagesError(false);
    try {
      const data = await api.get(`/api/v1/notifications/${thread.thread_id}`);
      if (epoch !== selectionEpoch.current) return;
      if (!Array.isArray(data) || data.some((message) => !message || Array.isArray(message) || message.thread_id !== thread.thread_id)) throw new Error("Invalid thread messages");
      setMessages(data);
      // Mark as read
      if (thread.unread_count > 0) {
        await api.post(`/api/v1/notifications/${thread.thread_id}/read`);
        fetchThreads(); // Refresh unread counts
      }
    } catch {
      if (epoch === selectionEpoch.current) {
        setMessages([]);
        setMessagesError(true);
      }
    } finally {
      if (epoch === selectionEpoch.current) setMessagesLoading(false);
    }
  };

  const openCompose = async () => {
    setShowCompose(true);
    if (customers.length === 0) {
      try {
        const data = await api.get("/api/v1/admin/customers?limit=200");
        const list = Array.isArray(data) ? data : data.items || data.customers || [];
        setCustomers(list);
      } catch {
        // Fallback: admin can type email manually
      }
    }
  };

  const handleCompose = async () => {
    if (!composeRecipient || !composeSubject.trim() || !composeBody.trim()) return;
    setComposeSending(true);
    try {
      await api.post("/api/v1/pro/portal/admin/messages/new", {
        recipient_email: composeRecipient,
        subject: composeSubject,
        body: composeBody,
      });
      toast.success("Mensagem enviada");
      setShowCompose(false);
      setComposeRecipient("");
      setComposeSubject("");
      setComposeBody("");
      setCustomerSearch("");
      fetchThreads();
    } catch (err) {
      toast.error(err?.message || "Não foi possível enviar a mensagem");
    } finally {
      setComposeSending(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const q = customerSearch.toLowerCase();
    if (!q) return true;
    return (
      (c.email || "").toLowerCase().includes(q) ||
      (c.company_name || "").toLowerCase().includes(q) ||
      (c.first_name || "").toLowerCase().includes(q) ||
      (c.last_name || "").toLowerCase().includes(q)
    );
  }).slice(0, 20);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedThread || sending || messagesLoading || messagesError) return;
    const threadId = selectedThread.thread_id;
    const sentDraft = replyText;
    const epoch = selectionEpoch.current;
    setSending(true);
    try {
      await api.post(`/api/v1/notifications/${selectedThread.thread_id}/reply`, {
        body: replyText,
      });
      setDrafts((current) => current[threadId] === sentDraft ? { ...current, [threadId]: "" } : current);
      // Refresh thread messages
      if (epoch === selectionEpoch.current) await selectThread(selectedThread);
      toast.success("Resposta enviada");
    } catch (err) {
      toast.error("Não foi possível enviar a resposta");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Mensagens</h1>
        <div className="flex items-center gap-4">
          {isPro && (
            <button
              type="button"
              onClick={openCompose}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Nova mensagem
            </button>
          )}
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="rounded bg-gray-800 border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            Apenas não lidas
          </label>
        </div>
      </div>

      {/* Compose Overlay */}
      {showCompose && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowCompose(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Nova mensagem para cliente</h2>
              <button type="button" onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Destinatário</label>
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => { setCustomerSearch(e.target.value); setComposeRecipient(""); }}
                placeholder="Busque por nome, e-mail ou empresa…"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {customerSearch && !composeRecipient && filteredCustomers.length > 0 && (
                <div className="mt-1 max-h-40 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg">
                  {filteredCustomers.map((c) => (
                    <button
                      type="button"
                      key={c.id || c.email}
                      onClick={() => { setComposeRecipient(c.email); setCustomerSearch(c.company_name ? `${c.company_name} (${c.email})` : c.email); }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <span className="font-medium">{c.company_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.email}</span>
                      {c.company_name && <span className="text-gray-500 ml-2">{c.email}</span>}
                    </button>
                  ))}
                </div>
              )}
              {composeRecipient && (
                <p className="text-xs text-green-400 mt-1">✓ {composeRecipient}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Assunto</label>
              <input
                type="text"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Acompanhamento de proposta, atualização de pedido…"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Mensagem</label>
              <textarea
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Digite sua mensagem…"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowCompose(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCompose}
                disabled={!composeRecipient || !composeSubject.trim() || !composeBody.trim() || composeSending}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {composeSending ? "Enviando…" : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 h-[calc(100%-3rem)]">
        {/* Thread List */}
        <div className="w-1/3 bg-gray-900 border border-gray-800 rounded-xl overflow-y-auto">
          {loading ? (
            <div role="status" aria-busy="true" className="p-4 text-gray-400">Carregando…</div>
          ) : listError ? (
            <div role="alert" className="p-4 text-red-400">Não foi possível carregar as notificações. <button type="button" onClick={fetchThreads} className="underline min-h-11">Tentar novamente</button></div>
          ) : threads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              Nenhuma mensagem por enquanto
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.thread_id}
                role="button"
                tabIndex={0}
                onClick={() => selectThread(thread)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") selectThread(thread); }}
                className={`w-full text-left p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                  selectedThread?.thread_id === thread.thread_id ? "bg-gray-800" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {thread.unread_count > 0 && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      <span className={`text-sm font-medium truncate ${thread.unread_count > 0 ? "text-white" : "text-gray-300"}`}>
                        {thread.thread_subject || "Sem assunto"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {thread.last_message_preview}
                    </p>
                  </div>
                  <div className="flex flex-col items-end ml-2 flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(thread.last_message_at)}
                    </span>
                    {thread.sales_order_id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/orders/${thread.sales_order_id}`);
                        }}
                        className="text-[10px] text-blue-400 hover:text-blue-300 mt-1"
                      >
                        Ver pedido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl flex flex-col">
          {!selectedThread ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Selecione uma conversa para ver as mensagens
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-800">
                <h2 className="font-semibold text-white">
                  {selectedThread.thread_subject || "Sem assunto"}
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedThread.message_count} {selectedThread.message_count === 1 ? "mensagem" : "mensagens"}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? <p role="status" aria-busy="true">Carregando mensagens…</p>
                  : messagesError ? <div role="alert">Conversa indisponível. Verifique seu acesso. <button type="button" onClick={() => selectThread(selectedThread)} className="underline min-h-11">Tentar novamente</button></div>
                  : messages.length === 0 ? <p role="status">Nenhuma mensagem nesta conversa.</p> : null}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.sender_type === "admin"
                        ? "bg-blue-900/30 border border-blue-500/20 ml-8"
                        : "bg-gray-800 border border-gray-700 mr-8"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-400">
                        {msg.sender_name || (msg.sender_type === "admin" ? "Equipe" : "Cliente")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(msg.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-white whitespace-pre-wrap">{msg.body}</p>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex gap-2">
                  <textarea
                    aria-label="Rascunho de resposta"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Digite uma resposta…"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                  />
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim() || sending || messagesLoading || messagesError}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed self-end"
                  >
                    {sending ? "..." : "Enviar"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
