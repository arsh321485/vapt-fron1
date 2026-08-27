/** Download automation scripts via API so Script-tab download_count increments. */

export function resolveVulnPluginId(vuln, extras = {}) {
  if (!vuln) return 0;
  const direct = Number(
    vuln.plugin_id || vuln.nessus_plugin_id || vuln.pluginId || vuln.vulnerability_id || 0,
  );
  if (direct > 0) return direct;

  const nestedRows = Array.isArray(vuln.rows) ? vuln.rows : [];
  for (const row of nestedRows) {
    const nestedId = Number(row?.plugin_id || row?.nessus_plugin_id || 0);
    if (nestedId > 0) return nestedId;
  }

  const name = String(vuln.vul_name || vuln.plugin_name || vuln.vulnerability || '')
    .toLowerCase()
    .trim();
  if (!name) return 0;

  const register = extras.registerRows || [];
  const row = register.find(
    (r) => String(r.vul_name || r.plugin_name || '').toLowerCase().trim() === name,
  );
  const fromRegister = Number(row?.plugin_id || row?.nessus_plugin_id || 0);
  if (fromRegister > 0) return fromRegister;

  const map = extras.automationScriptMap || {};
  const entry = Object.values(map).find(
    (e) =>
      String(e?.vulnerability || e?.vul_name || e?.plugin_name || '')
        .toLowerCase()
        .trim() === name,
  );
  return Number(entry?.plugin_id || 0);
}

export function scriptFilenameFromAutomation(data, fallback = 'automation_script.py') {
  const raw = String(data?.fix_script_name || data?.script_name || '').trim();
  if (!raw) return fallback;
  const base = raw.split(/[/\\]/).pop() || raw;
  const name = base.replace(/\s*\(.*\)\s*$/, '').trim();
  if (!name) return fallback;
  return /\.[a-z0-9]+$/i.test(name) ? name : `${name}.py`;
}

function headerValue(headers, name) {
  if (!headers) return '';
  if (typeof headers.get === 'function') {
    return headers.get(name) || headers.get(name.toLowerCase()) || '';
  }
  return headers[name] || headers[name.toLowerCase()] || '';
}

export function parseDownloadFilename(headers, fallback = 'automation_script.py') {
  const cd = String(headerValue(headers, 'content-disposition') || '');
  const star = /filename\*=UTF-8''([^;]+)/i.exec(cd);
  if (star?.[1]) {
    try {
      return decodeURIComponent(star[1].trim());
    } catch {
      /* keep looking */
    }
  }
  const quoted = /filename="([^"]+)"/i.exec(cd);
  if (quoted?.[1]) return quoted[1];
  const plain = /filename=([^;]+)/i.exec(cd);
  if (plain?.[1]) return plain[1].trim().replace(/^["']|["']$/g, '');
  return fallback;
}

export function triggerTextFileDownload(content, filename) {
  const blob = new Blob([content ?? ''], { type: 'text/x-python;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'automation_script.py';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function extractScriptPayload(content) {
  if (content == null) return '';
  if (typeof content === 'object') {
    return (
      content.content ||
      content.script ||
      content.code ||
      content.script_content ||
      content.fix_script ||
      content.file_content ||
      JSON.stringify(content, null, 2)
    );
  }
  const text = String(content);
  const trimmed = text.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object') {
        return (
          parsed.content ||
          parsed.script ||
          parsed.code ||
          parsed.script_content ||
          parsed.fix_script ||
          parsed.file_content ||
          text
        );
      }
    } catch {
      /* raw script text */
    }
  }
  return text;
}

export async function downloadAutomationScriptViaApi({
  authStore,
  pluginId,
  os,
  isUser,
  fallbackName,
}) {
  const id = Number(pluginId || 0);
  if (!(id > 0)) {
    return {
      status: false,
      counted: false,
      message: 'Script download is not available for this vulnerability',
    };
  }

  const res = isUser
    ? await authStore.downloadAutomationScript(id, os)
    : await authStore.downloadAutomationScriptAdmin(id, os);

  if (res.status && res.content != null) {
    const text = extractScriptPayload(res.content);
    const filename = parseDownloadFilename(res.headers, fallbackName || 'automation_script.py');
    triggerTextFileDownload(text, filename);
    return { status: true, counted: true };
  }

  return {
    status: false,
    counted: false,
    message: res.message || 'Download failed',
  };
}
