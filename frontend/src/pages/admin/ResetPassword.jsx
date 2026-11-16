/**
 * ResetPassword - Complete password reset with token
 *
 * Allows users to set a new password using a reset token.
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../config/api";
import { useToast } from "../../components/Toast";

const resetStatusMessages = new Map([
  ["invalid", "Código de redefinição inválido ou expirado"],
  ["pending", "Sua solicitação aguarda aprovação da administração"],
  ["denied", "Sua solicitação de redefinição de senha foi recusada"],
  ["completed", "Este link de redefinição já foi usado"],
  ["expired", "Este link de redefinição expirou"],
  ["unknown", "Não foi possível identificar a situação da solicitação"],
]);

const resetErrorMessages = new Map([
  ["Invalid reset token", "Código de redefinição inválido"],
  ["Reset token has expired. Please request a new password reset.", "O link expirou. Solicite uma nova redefinição de senha."],
  ["User not found", "Usuário não encontrado"],
]);

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [canReset, setCanReset] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    checkTokenStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const checkTokenStatus = async () => {
    if (!token) {
      setCanReset(false);
      setStatusMessage("Código de redefinição inválido");
      setChecking(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/v1/auth/password-reset/status/${token}`
      );
      const data = await res.json();

      if (res.ok && data.can_reset) {
        setCanReset(true);
        setStatusMessage("Agora você pode redefinir sua senha");
      } else {
        setCanReset(false);
        setStatusMessage(
          resetStatusMessages.get(data.status) ||
            (typeof data.message === "string" && data.message) ||
            "Código de redefinição inválido ou expirado"
        );
      }
    } catch {
      setCanReset(false);
      setStatusMessage("Não foi possível verificar o código de redefinição");
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/v1/auth/password-reset/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            new_password: password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Senha redefinida com sucesso. Entre com sua nova senha.");
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      } else {
        const detail = typeof data.detail === "string" ? data.detail : "";
        const requestStatus = detail.match(/^Cannot reset password\. Request status: (.+)$/)?.[1];
        toast.error(
          resetErrorMessages.get(detail) ||
            resetStatusMessages.get(requestStatus) ||
            detail ||
            "Não foi possível redefinir a senha"
        );
      }
    } catch {
      toast.error("Falha de conexão. Verifique sua rede e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-full max-w-md">
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 mx-auto mb-4" style={{ borderBottom: '2px solid var(--primary)' }}></div>
              <p style={{ color: 'var(--text-secondary)' }}>Verificando código de redefinição…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!canReset) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent"
            >
              FilaOps
            </Link>
          </div>

          {/* Error Message */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
                <svg
                  className="h-6 w-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Não foi possível redefinir a senha
              </h2>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{statusMessage}</p>
              <Link
                to="/forgot-password"
                className="inline-block px-6 py-2 rounded-lg transition-all"
                style={{ background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', color: 'white' }}
              >
                Solicitar novo link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent"
          >
            FilaOps
          </Link>
          <h1 className="text-xl mt-4" style={{ color: 'var(--text-primary)' }}>Redefinir senha</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Digite sua nova senha</p>
        </div>

        {/* Form */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Nova senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--primary)'
                }}
                placeholder="No mínimo 8 caracteres"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Confirme a senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--primary)'
                }}
                placeholder="Digite a senha novamente"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
                color: 'white'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Redefinindo…
                </span>
              ) : (
                "Redefinir senha"
              )}
            </button>

            <div className="text-center">
              <Link
                to="/admin/login"
                className="text-sm transition-colors"
                style={{ color: 'var(--primary)' }}
              >
                Voltar ao acesso
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
