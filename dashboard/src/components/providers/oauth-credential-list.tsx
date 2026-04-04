"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OwnerBadge, type CurrentUserLike } from "@/components/providers/api-key-section";
import { useTranslation } from "@/lib/i18n-client";

interface OAuthAccountWithOwnership {
  id: string;
  accountName: string;
  accountEmail: string | null;
  provider: string;
  ownerUsername: string | null;
  ownerUserId: string | null;
  isOwn: boolean;
  status: "active" | "error" | "disabled" | string;
  statusMessage: string | null;
  unavailable: boolean;
  proxyUrl: string | null;
}

interface OAuthCredentialListProps {
  accounts: OAuthAccountWithOwnership[];
  loading: boolean;
  currentUser: CurrentUserLike | null;
  togglingAccountId: string | null;
  claimingAccountName: string | null;
  onToggle: (accountId: string, currentlyDisabled: boolean) => void;
  onDelete: (accountId: string) => void;
  onClaim: (accountName: string) => void;
  onUpdateProxyUrl: (accountName: string, proxyUrl: string) => Promise<boolean>;
}

function parseStatusMessage(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error?.message) return parsed.error.message;
    if (typeof parsed?.message === "string") return parsed.message;
    return raw;
  } catch {
    return raw;
  }
}

function OAuthStatusBadge({
  status,
  statusMessage,
  unavailable,
}: {
  status: string;
  statusMessage: string | null;
  unavailable: boolean;
}) {
  const { t } = useTranslation();
  const message = parseStatusMessage(statusMessage);

  if (status === "active" && !unavailable) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400" title={t("oauth.tokenValid")}>
        <span className="size-1.5 rounded-full bg-emerald-400" />
        Active
      </span>
    );
  }

  if (status === "error" || unavailable) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-medium text-red-400"
        title={message || "Account has an error"}
      >
        <span className="size-1.5 rounded-full bg-red-400" />
        {message
          ? message.length > 40 ? `${message.slice(0, 40)}…` : message
          : "Error"}
      </span>
    );
  }

  if (status === "disabled") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 px-2 py-0.5 text-[10px] font-medium text-slate-400" title="Account is disabled">
        <span className="size-1.5 rounded-full bg-slate-400" />
        Disabled
      </span>
    );
  }

  return null;
}

function ProxyUrlBadge({ proxyUrl }: { proxyUrl: string | null }) {
  if (!proxyUrl) return null;
  // Mask credentials in the display: http://user:pass@host:port → http://***@host:port
  let masked = proxyUrl;
  try {
    const url = new URL(proxyUrl);
    if (url.username || url.password) {
      masked = `${url.protocol}//***@${url.host}`;
    }
  } catch {
    // If URL parsing fails, just show the raw value truncated
    masked = proxyUrl.length > 30 ? `${proxyUrl.slice(0, 30)}…` : proxyUrl;
  }
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-medium text-violet-400"
      title={`Proxy: ${masked}`}
    >
      <svg className="size-2.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5A5.5 5.5 0 0 1 2.5 8 5.5 5.5 0 0 1 8 2.5zM7 5v3.5l3 1.5.5-1L8 7.75V5H7z"/></svg>
      {masked}
    </span>
  );
}

function ProxyUrlEditor({
  accountName,
  currentProxyUrl,
  onSave,
  onClose,
}: {
  accountName: string;
  currentProxyUrl: string | null;
  onSave: (accountName: string, proxyUrl: string) => Promise<boolean>;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState(currentProxyUrl || "");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(currentProxyUrl === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentProxyUrl !== null) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchProxyUrl = async () => {
      try {
        const res = await fetch(`/api/management/auth-files/download?name=${encodeURIComponent(accountName)}`);
        if (!res.ok) throw new Error("Failed to load file");
        const data = await res.json();
        if (mounted && data.proxy_url) {
          setValue(data.proxy_url);
        }
      } catch (err) {
        console.error("Failed to fetch proxy settings:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProxyUrl();

    return () => { mounted = false; };
  }, [accountName, currentProxyUrl]);

  const handleSave = async () => {
    // Basic URL validation if value is non-empty
    if (value.trim()) {
      try {
        const url = new URL(value.trim());
        if (!["http:", "https:", "socks5:", "socks4:"].includes(url.protocol)) {
          setError(t("oauth.protocolError"));
          return;
        }
      } catch {
        setError(t("oauth.invalidUrlFormat"));
        return;
      }
    }

    setSaving(true);
    setError(null);
    const ok = await onSave(accountName, value.trim());
    setSaving(false);
    if (ok) {
      onClose();
    } else {
      setError(t("oauth.saveFailed"));
    }
  };

  return (
    <div className="mt-2 space-y-2 rounded-md border border-slate-600/50 bg-slate-800/60 p-3">
      <label className="block text-xs font-medium text-slate-300">
        {t("oauth.proxyUrlLabel")}
      </label>
      <Input
        type="text"
        name="proxyUrl"
        value={value}
        onChange={setValue}
        placeholder={loading ? t("common.loading") + "..." : "http://user:pass@68.64.154.69:30000"}
        disabled={saving || loading}
        className="font-mono text-xs"
      />
      <p className="text-[10px] text-slate-500">
        {t("oauth.proxyUrlFormat")}
      </p>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          className="px-3 py-1 text-xs"
          disabled={saving || loading}
          onClick={handleSave}
        >
          {saving ? t("common.saving") : t("common.save")}
        </Button>
        <Button
          variant="secondary"
          className="px-3 py-1 text-xs"
          disabled={saving}
          onClick={onClose}
        >
          {t("common.cancel")}
        </Button>
      </div>
    </div>
  );
}

export type { OAuthAccountWithOwnership };

export function OAuthCredentialList({
  accounts,
  loading,
  currentUser,
  togglingAccountId,
  claimingAccountName,
  onToggle,
  onDelete,
  onClaim,
  onUpdateProxyUrl,
}: OAuthCredentialListProps) {
  const [editingProxyAccount, setEditingProxyAccount] = useState<string | null>(null);

  return (
    <>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">Connected Accounts</h3>
        <p className="mt-1 text-xs text-slate-500">Active OAuth provider connections</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center rounded-md border border-slate-700/70 bg-slate-900/25 p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 animate-spin rounded-full border-4 border-white/20 border-t-blue-500"></div>
            <p className="text-sm text-slate-400">Loading accounts...</p>
          </div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="rounded-sm border border-slate-700/70 bg-slate-900/30 p-3 text-xs text-slate-400">
          No OAuth accounts connected yet. Connect your first account below.
        </div>
      ) : (
        <div className="divide-y divide-slate-700/70 rounded-md border border-slate-700/70 bg-slate-900/25">
          {accounts.map((account) => (
            <div key={account.id} className="group p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-100">{account.provider}</span>
                    {currentUser && (
                      <OwnerBadge ownerUsername={account.ownerUsername} isOwn={account.isOwn} />
                    )}
                    <OAuthStatusBadge status={account.status} statusMessage={account.statusMessage} unavailable={account.unavailable} />
                    <ProxyUrlBadge proxyUrl={account.proxyUrl} />
                  </div>
                  {account.accountEmail && (
                    <p className="truncate text-xs text-slate-300">{account.accountEmail}</p>
                  )}
                  <p className="truncate text-xs font-mono text-slate-500">{account.accountName}</p>
                </div>
                {currentUser && (account.isOwn || currentUser.isAdmin) && (
                  <div className="flex shrink-0 items-center gap-2">
                    {currentUser.isAdmin && !account.ownerUsername && (
                      <Button
                        variant="secondary"
                        className="px-2.5 py-1 text-xs"
                        disabled={claimingAccountName === account.accountName}
                        onClick={() => onClaim(account.accountName)}
                      >
                        {claimingAccountName === account.accountName ? "..." : "Claim"}
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      className="px-2.5 py-1 text-xs"
                      onClick={() => setEditingProxyAccount(
                        editingProxyAccount === account.accountName ? null : account.accountName
                      )}
                    >
                      {account.proxyUrl ? "✏️ Proxy" : "🌐 Proxy"}
                    </Button>
                    <Button
                      variant="secondary"
                      className="px-2.5 py-1 text-xs"
                      disabled={togglingAccountId === account.id}
                      onClick={() => onToggle(account.id, account.status === "disabled")}
                    >
                      {togglingAccountId === account.id ? "..." : account.status === "disabled" ? "Enable" : "Disable"}
                    </Button>
                    <Button
                      variant="danger"
                      className="px-2.5 py-1 text-xs"
                      onClick={() => onDelete(account.id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                )}
              </div>
              {editingProxyAccount === account.accountName && (
                <ProxyUrlEditor
                  accountName={account.accountName}
                  currentProxyUrl={account.proxyUrl}
                  onSave={onUpdateProxyUrl}
                  onClose={() => setEditingProxyAccount(null)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
