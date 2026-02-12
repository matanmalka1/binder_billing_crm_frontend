#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:8000/api/v1}"
ADVISOR_EMAIL="${ADVISOR_EMAIL:-}"
ADVISOR_PASSWORD="${ADVISOR_PASSWORD:-}"
SECRETARY_EMAIL="${SECRETARY_EMAIL:-}"
SECRETARY_PASSWORD="${SECRETARY_PASSWORD:-}"
TEST_CLIENT_ID="${TEST_CLIENT_ID:-}"

if [[ -z "$ADVISOR_EMAIL" || -z "$ADVISOR_PASSWORD" || -z "$SECRETARY_EMAIL" || -z "$SECRETARY_PASSWORD" ]]; then
  echo "Missing credentials. Set ADVISOR_EMAIL, ADVISOR_PASSWORD, SECRETARY_EMAIL, SECRETARY_PASSWORD"
  exit 1
fi

request_json() {
  local method="$1"
  local url="$2"
  local token="${3:-}"
  local body="${4:-}"

  if [[ -n "$token" ]]; then
    if [[ -n "$body" ]]; then
      curl -sS -X "$method" "$url" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "$body"
    else
      curl -sS -X "$method" "$url" -H "Authorization: Bearer $token"
    fi
  else
    if [[ -n "$body" ]]; then
      curl -sS -X "$method" "$url" -H "Content-Type: application/json" -d "$body"
    else
      curl -sS -X "$method" "$url"
    fi
  fi
}

request_code() {
  local method="$1"
  local url="$2"
  local token="${3:-}"
  local body="${4:-}"

  if [[ -n "$token" ]]; then
    if [[ -n "$body" ]]; then
      curl -sS -o /tmp/codex_smoke_body.json -w "%{http_code}" -X "$method" "$url" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "$body"
    else
      curl -sS -o /tmp/codex_smoke_body.json -w "%{http_code}" -X "$method" "$url" \
        -H "Authorization: Bearer $token"
    fi
  else
    if [[ -n "$body" ]]; then
      curl -sS -o /tmp/codex_smoke_body.json -w "%{http_code}" -X "$method" "$url" \
        -H "Content-Type: application/json" \
        -d "$body"
    else
      curl -sS -o /tmp/codex_smoke_body.json -w "%{http_code}" -X "$method" "$url"
    fi
  fi
}

expect_code() {
  local method="$1"
  local path="$2"
  local token="$3"
  local expected="$4"
  local body="${5:-}"

  local code
  code="$(request_code "$method" "$API_BASE_URL$path" "$token" "$body")"

  if [[ "$code" != "$expected" ]]; then
    echo "FAIL $method $path expected=$expected got=$code"
    echo "Response body:"
    cat /tmp/codex_smoke_body.json
    exit 1
  fi

  echo "PASS $method $path -> $code"
}

extract_token() {
  python3 - <<'PY'
import json,sys
try:
  payload=json.load(sys.stdin)
except Exception:
  print("")
  raise SystemExit(0)
print(payload.get("token", ""))
PY
}

login() {
  local email="$1"
  local password="$2"
  local response
  response="$(request_json "POST" "$API_BASE_URL/auth/login" "" "{\"email\":\"$email\",\"password\":\"$password\"}")"
  local token
  token="$(printf "%s" "$response" | extract_token)"
  if [[ -z "$token" ]]; then
    echo "Login failed for $email"
    echo "$response"
    exit 1
  fi
  echo "$token"
}

echo "Logging in advisor..."
ADVISOR_TOKEN="$(login "$ADVISOR_EMAIL" "$ADVISOR_PASSWORD")"
echo "Logging in secretary..."
SECRETARY_TOKEN="$(login "$SECRETARY_EMAIL" "$SECRETARY_PASSWORD")"

echo "Checking dashboard role behavior..."
expect_code "GET" "/dashboard/overview" "$ADVISOR_TOKEN" "200"
expect_code "GET" "/dashboard/overview" "$SECRETARY_TOKEN" "403"
expect_code "GET" "/dashboard/summary" "$SECRETARY_TOKEN" "200"
expect_code "GET" "/dashboard/attention" "$SECRETARY_TOKEN" "200"

echo "Checking core read endpoints..."
expect_code "GET" "/clients?page=1&page_size=20" "$ADVISOR_TOKEN" "200"
expect_code "GET" "/binders" "$ADVISOR_TOKEN" "200"
expect_code "GET" "/search?page=1&page_size=20" "$ADVISOR_TOKEN" "200"

if [[ -n "$TEST_CLIENT_ID" ]]; then
  expect_code "GET" "/clients/$TEST_CLIENT_ID/timeline?page=1&page_size=50" "$ADVISOR_TOKEN" "200"
else
  echo "SKIP timeline/documents by client (TEST_CLIENT_ID not set)"
fi

echo "Checking charges role behavior..."
expect_code "GET" "/charges?page=1&page_size=20" "$ADVISOR_TOKEN" "200"
expect_code "GET" "/charges?page=1&page_size=20" "$SECRETARY_TOKEN" "200"
expect_code "POST" "/charges" "$SECRETARY_TOKEN" "403" "{\"client_id\":1,\"amount\":1,\"charge_type\":\"one_time\"}"

if [[ -n "$TEST_CLIENT_ID" ]]; then
  echo "Checking documents endpoints..."
  expect_code "GET" "/documents/client/$TEST_CLIENT_ID" "$ADVISOR_TOKEN" "200"
  expect_code "GET" "/documents/client/$TEST_CLIENT_ID/signals" "$ADVISOR_TOKEN" "200"

  tmp_file="$(mktemp)"
  printf "smoke-doc" > "$tmp_file"
  upload_code="$(curl -sS -o /tmp/codex_smoke_body.json -w "%{http_code}" \
    -X POST "$API_BASE_URL/documents/upload" \
    -H "Authorization: Bearer $ADVISOR_TOKEN" \
    -F "client_id=$TEST_CLIENT_ID" \
    -F "document_type=id_copy" \
    -F "file=@$tmp_file")"
  rm -f "$tmp_file"

  if [[ "$upload_code" != "201" ]]; then
    echo "FAIL POST /documents/upload expected=201 got=$upload_code"
    cat /tmp/codex_smoke_body.json
    exit 1
  fi
  echo "PASS POST /documents/upload -> 201"
else
  echo "SKIP documents upload/list/signals (TEST_CLIENT_ID not set)"
fi

echo "Smoke API checks completed successfully."
