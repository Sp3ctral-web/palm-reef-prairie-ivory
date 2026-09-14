const CLASS_RE = /^[\p{L}\p{N}][\p{L}\p{N}\-]{1,11}$/u;

export function normalizeClassCode(raw: string): string {
  return raw.trim().replace(/\s+/g, "").toLocaleUpperCase("ru-RU");
}

export function isValidClassCode(raw: string): boolean {
  const code = normalizeClassCode(raw);
  return code.length >= 2 && code.length <= 12 && CLASS_RE.test(code);
}
