import { describe, expect, it, vi, beforeEach } from "vitest";
import { resolveEntityActions, resolveStandaloneActions } from "./resolver";

const authState = { user: null as { role: "advisor" | "secretary" } | null };

vi.mock("../../store/auth.store", () => ({
  useAuthStore: {
    getState: () => authState,
  },
}));

describe("action resolver", () => {
  beforeEach(() => {
    authState.user = null;
  });

  it("uses deterministic token precedence key > action > type > item_type > operation", () => {
    const resolved = resolveStandaloneActions([
      {
        key: "ready",
        action: "return",
        type: "freeze",
        item_type: "issue_charge",
        operation: "cancel_charge",
        binder_id: 7,
      },
    ]);

    expect(resolved).toHaveLength(1);
    expect(resolved[0].token).toBe("ready");
    expect(resolved[0].endpoint).toBe("/binders/7/ready");
  });

  it("accepts explicit endpoint for unknown token", () => {
    const resolved = resolveStandaloneActions([
      {
        operation: "backend_new_action",
        endpoint: "/custom/action",
        method: "post",
      },
    ]);

    expect(resolved).toHaveLength(1);
    expect(resolved[0].endpoint).toBe("/custom/action");
    expect(resolved[0].token).toBe("backend_new_action");
  });

  it("drops unknown token when endpoint is not resolvable", () => {
    const resolved = resolveStandaloneActions([
      {
        operation: "backend_new_action",
      },
    ]);

    expect(resolved).toHaveLength(0);
  });

  it("resolves binder id by priority: action.binder_id then context binder then entity path/id", () => {
    const fromAction = resolveEntityActions([{ key: "ready", binder_id: 13 }], "/binders", 99);
    const fromContext = resolveStandaloneActions([
      { key: "ready" },
    ], "scope");
    const fromEntityPath = resolveEntityActions([{ key: "ready" }], "/binders", 21);

    expect(fromAction[0].endpoint).toBe("/binders/13/ready");
    expect(fromContext).toHaveLength(0);
    expect(fromEntityPath[0].endpoint).toBe("/binders/21/ready");
  });

  it("blocks advisor-only actions for secretary and allows advisor", () => {
    authState.user = { role: "secretary" };
    const secretary = resolveEntityActions([{ key: "mark_paid" }], "/charges", 5);

    authState.user = { role: "advisor" };
    const advisor = resolveEntityActions([{ key: "mark_paid" }], "/charges", 5);

    expect(secretary).toHaveLength(0);
    expect(advisor).toHaveLength(1);
    expect(advisor[0].endpoint).toBe("/charges/5/mark-paid");
  });

  it("keeps alias backward compatibility", () => {
    const resolved = resolveEntityActions([{ key: "pay_charge" }], "/charges", 14);

    expect(resolved).toHaveLength(1);
    expect(resolved[0].token).toBe("mark_paid");
    expect(resolved[0].endpoint).toBe("/charges/14/mark-paid");
  });
});
