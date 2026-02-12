import { describe, expect, it } from "vitest";
import { findEndpointContract } from "./backendContract";
import {
  ADVISOR_ONLY_ACTIONS,
  TOKEN_ALIASES,
} from "../lib/actions/service.constants";
import {
  isActionAllowedForRole,
  resolveCanonicalAction,
} from "../lib/actions/service";
import type { CanonicalActionToken } from "../lib/actions/types";

const ACTION_SAMPLE_CONTEXT: Record<
  CanonicalActionToken,
  {
    binderId?: number;
    chargeId?: number;
    clientId?: number;
    payload?: Record<string, unknown>;
  }
> = {
  receive: { payload: { client_id: 1, binder_number: "B-100" } },
  ready: { binderId: 1 },
  return: { binderId: 1 },
  freeze: { clientId: 1 },
  activate: { clientId: 1 },
  mark_paid: { chargeId: 1 },
  issue_charge: { chargeId: 1 },
  cancel_charge: { chargeId: 1 },
};

describe("contract parity", () => {
  it("every canonical action endpoint is represented in backend contract", () => {
    const canonicalTokens = new Set(Object.values(TOKEN_ALIASES));

    for (const token of canonicalTokens) {
      const resolution = resolveCanonicalAction(token, ACTION_SAMPLE_CONTEXT[token]);
      expect(resolution, `Expected canonical action ${token} to resolve`).not.toBeNull();
      const endpoint = resolution!.endpoint;
      const method = resolution!.method.toUpperCase();
      expect(
        findEndpointContract(method, endpoint),
        `No contract entry for ${method} ${endpoint} (token=${token})`,
      ).not.toBeNull();
    }
  });

  it("advisor-only contract endpoints map to advisor-only action tokens", () => {
    const canonicalTokens = new Set(Object.values(TOKEN_ALIASES));

    for (const token of canonicalTokens) {
      const resolution = resolveCanonicalAction(token, ACTION_SAMPLE_CONTEXT[token]);
      expect(resolution).not.toBeNull();
      const contract = findEndpointContract(
        resolution!.method.toUpperCase(),
        resolution!.endpoint,
      );
      expect(contract).not.toBeNull();

      if (contract!.role === "advisor") {
        expect(ADVISOR_ONLY_ACTIONS.has(token)).toBe(true);
      }
    }
  });

  it("advisor-only action tokens are blocked for secretary role", () => {
    for (const token of ADVISOR_ONLY_ACTIONS) {
      expect(isActionAllowedForRole(token, "secretary")).toBe(false);
      expect(isActionAllowedForRole(token, "advisor")).toBe(true);
    }
  });
});
