/**
 * Stellt sicher, dass ein String mit einem bestimmten Präfix beginnt.
 * Falls nicht, wird das Präfix hinzugefügt.
 * @param str - Der ursprüngliche String
 * @param prefix - Das Präfix, das hinzugefügt werden soll
 * @returns Der String mit dem Präfix
 */
export function ensureStartsWith(str: string, prefix: string): string {
    if (!str.startsWith(prefix)) {
      return prefix + str;
    }
    return str;
  }
  
  /**
   * Erstellt eine URL aus Basis- und Abfrageparametern.
   * @param baseUrl - Die Basis-URL
   * @param params - Ein Objekt mit Abfrageparametern
   * @returns Die vollständige URL mit Abfrageparametern
   */
  export function createUrl(baseUrl: string, params: Record<string, string | number | undefined>): string {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
    return url.toString();
  }
  