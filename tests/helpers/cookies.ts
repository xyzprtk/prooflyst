/**
 * In-memory cookie store for testing auth flows.
 */
class TestCookieStore {
  private store = new Map<string, string>();

  get(name: string) {
    const value = this.store.get(name);
    return value ? { name, value } : undefined;
  }

  set(name: string, value: string, _opts?: unknown) {
    this.store.set(name, value);
  }

  delete(name: string) {
    this.store.delete(name);
  }

  clear() {
    this.store.clear();
  }
}

export const testCookies = new TestCookieStore();
