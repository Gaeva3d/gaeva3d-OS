# Catálogo por ação — campos exatos

PROPOSTO. Todos os exemplos são fictícios. A schema de cada variante no JSON é normativa para chaves/tipos/required/extra rejection; sem null implícito. Os locators ACT-* são únicos e estáveis.

## ACT-AssignProfile

**AssignProfile** — users.policy.manage; target user_policy.

Payload permitido e required: {"type": "object", "properties": {"profile_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["profile_id"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "effective_changed": {"type": "boolean"}, "revocation_state": {"type": "string", "enum": ["NOT_REQUIRED", "REVOKING", "CONFIRMED"]}}, "required": ["subject_id", "policy_version", "effective_changed", "revocation_state"], "additionalProperties": false}.

Validação semântica: profile predefined/current; assigning profile never changes admin account type; existing user creation binds profile before activation.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: PROFILE_UNKNOWN, PERMISSION_UNKNOWN, LAST_ADMIN, SELF_ESCALATION, DOMAIN_INVARIANT, DRAIN_PENDING.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "AssignProfile",
  "operation_id": "fictional-op-1",
  "target": {
    "kind": "user_policy",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "profile_id": "fictional-profile"
  }
}
```

## ACT-SetIndividualAllow

**SetIndividualAllow** — users.policy.manage; target user_policy.

Payload permitido e required: {"type": "object", "properties": {"permission": {"type": "object", "properties": {"module_id": {"type": "string", "minLength": 1, "maxLength": 128}, "action_id": {"type": "string", "minLength": 1, "maxLength": 128}, "record_scope_id": {"type": "string", "minLength": 1, "maxLength": 128}, "field_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 1, "uniqueItems": true}}, "required": ["module_id", "action_id"], "additionalProperties": false}}, "required": ["permission"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "effective_changed": {"type": "boolean"}, "revocation_state": {"type": "string", "enum": ["NOT_REQUIRED", "REVOKING", "CONFIRMED"]}}, "required": ["subject_id", "policy_version", "effective_changed", "revocation_state"], "additionalProperties": false}.

Validação semântica: permission and optional record/field IDs exist in current catalog and tenant; cannot bypass deny/domain/admin-only extras; no self escalation.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: PROFILE_UNKNOWN, PERMISSION_UNKNOWN, LAST_ADMIN, SELF_ESCALATION, DOMAIN_INVARIANT, DRAIN_PENDING.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "SetIndividualAllow",
  "operation_id": "fictional-op-2",
  "target": {
    "kind": "user_policy",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "permission": {
      "module_id": "fictional-module",
      "action_id": "fictional-consult"
    }
  }
}
```

## ACT-SetIndividualDeny

**SetIndividualDeny** — users.policy.manage; target user_policy.

Payload permitido e required: {"type": "object", "properties": {"permission": {"type": "object", "properties": {"module_id": {"type": "string", "minLength": 1, "maxLength": 128}, "action_id": {"type": "string", "minLength": 1, "maxLength": 128}, "record_scope_id": {"type": "string", "minLength": 1, "maxLength": 128}, "field_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 1, "uniqueItems": true}}, "required": ["module_id", "action_id"], "additionalProperties": false}}, "required": ["permission"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "effective_changed": {"type": "boolean"}, "revocation_state": {"type": "string", "enum": ["NOT_REQUIRED", "REVOKING", "CONFIRMED"]}}, "required": ["subject_id", "policy_version", "effective_changed", "revocation_state"], "additionalProperties": false}.

Validação semântica: deny dominates profile/allow; reducing access requires all PSC drain AP5.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: PROFILE_UNKNOWN, PERMISSION_UNKNOWN, LAST_ADMIN, SELF_ESCALATION, DOMAIN_INVARIANT, DRAIN_PENDING.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "SetIndividualDeny",
  "operation_id": "fictional-op-3",
  "target": {
    "kind": "user_policy",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "permission": {
      "module_id": "fictional-module",
      "action_id": "fictional-export"
    }
  }
}
```

## ACT-ResetIndividualOverride

**ResetIndividualOverride** — users.policy.manage; target user_policy.

Payload permitido e required: {"type": "object", "properties": {"permission": {"type": "object", "properties": {"module_id": {"type": "string", "minLength": 1, "maxLength": 128}, "action_id": {"type": "string", "minLength": 1, "maxLength": 128}, "record_scope_id": {"type": "string", "minLength": 1, "maxLength": 128}, "field_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 1, "uniqueItems": true}}, "required": ["module_id", "action_id"], "additionalProperties": false}, "remove": {"type": "string", "enum": ["ALLOW", "DENY", "BOTH"]}}, "required": ["permission", "remove"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "effective_changed": {"type": "boolean"}, "revocation_state": {"type": "string", "enum": ["NOT_REQUIRED", "REVOKING", "CONFIRMED"]}}, "required": ["subject_id", "policy_version", "effective_changed", "revocation_state"], "additionalProperties": false}.

Validação semântica: removal recomputes effective access; removing deny can grant and needs grant authority.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: PROFILE_UNKNOWN, PERMISSION_UNKNOWN, LAST_ADMIN, SELF_ESCALATION, DOMAIN_INVARIANT, DRAIN_PENDING.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ResetIndividualOverride",
  "operation_id": "fictional-op-4",
  "target": {
    "kind": "user_policy",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "permission": {
      "module_id": "fictional-module",
      "action_id": "fictional-edit"
    },
    "remove": "BOTH"
  }
}
```

## ACT-ActivateUser

**ActivateUser** — users.policy.manage; target user_policy.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "effective_changed": {"type": "boolean"}, "revocation_state": {"type": "string", "enum": ["NOT_REQUIRED", "REVOKING", "CONFIRMED"]}}, "required": ["subject_id", "policy_version", "effective_changed", "revocation_state"], "additionalProperties": false}.

Validação semântica: cannot revive previous sessions; grants valid only after current protected policy projection.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: PROFILE_UNKNOWN, PERMISSION_UNKNOWN, LAST_ADMIN, SELF_ESCALATION, DOMAIN_INVARIANT, DRAIN_PENDING.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ActivateUser",
  "operation_id": "fictional-op-5",
  "target": {
    "kind": "user_policy",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {}
}
```

## ACT-DeactivateUser

**DeactivateUser** — users.policy.manage; target user_policy.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "effective_changed": {"type": "boolean"}, "revocation_state": {"type": "string", "enum": ["NOT_REQUIRED", "REVOKING", "CONFIRMED"]}}, "required": ["subject_id", "policy_version", "effective_changed", "revocation_state"], "additionalProperties": false}.

Validação semântica: preserve authorship; AP5 denies new admissions and waits ALL PSC; serialize last admin set.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: PROFILE_UNKNOWN, PERMISSION_UNKNOWN, LAST_ADMIN, SELF_ESCALATION, DOMAIN_INVARIANT, DRAIN_PENDING.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "DeactivateUser",
  "operation_id": "fictional-op-6",
  "target": {
    "kind": "user_policy",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {}
}
```

## ACT-DelegateApproval

**DelegateApproval** — approvals.delegate; target approval_authority.

Payload permitido e required: {"type": "object", "properties": {"delegate_user_id": {"type": "string", "minLength": 1, "maxLength": 128}, "scopes": {"type": "array", "items": {"type": "string", "enum": ["RETENTION_POLICY", "RECOVERY_TOLERANCE"]}, "minItems": 1, "uniqueItems": true}, "valid_from_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}, "valid_until_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["delegate_user_id", "scopes", "valid_from_utc"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"delegation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "authority_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["delegation_id", "authority_version"], "additionalProperties": false}.

Validação semântica: grantor designated current authority with explicit delegation power for each scope; delegate active same tenant, no self elevation; until>from if present; omission means no scheduled expiry, never bypass revocation.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: APPROVAL_AUTHORITY_REQUIRED, DELEGATION_INVALID.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "DelegateApproval",
  "operation_id": "fictional-op-7",
  "target": {
    "kind": "approval_authority",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "delegate_user_id": "fictional-delegate",
    "scopes": [
      "RETENTION_POLICY"
    ],
    "valid_from_utc": "2030-01-01T00:00:00Z"
  }
}
```

## ACT-RevokeApprovalDelegation

**RevokeApprovalDelegation** — approvals.delegate; target approval_delegation.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"delegation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "authority_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "revocation_state": {"type": "string", "enum": ["REVOKING", "CONFIRMED"]}}, "required": ["delegation_id", "authority_version", "revocation_state"], "additionalProperties": false}.

Validação semântica: revoked approval power fenced before confirmed; history remains.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: APPROVAL_AUTHORITY_REQUIRED, DRAIN_PENDING.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "RevokeApprovalDelegation",
  "operation_id": "fictional-op-8",
  "target": {
    "kind": "approval_delegation",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {}
}
```

## ACT-GetPermissionCatalog

**GetPermissionCatalog** — users.policy.read; target permission_catalog.

Payload permitido e required: {"type": "object", "properties": {"page": {"type": "object", "properties": {"page_size": {"type": "integer", "minimum": 1, "maximum": 200}, "cursor": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["page_size"], "additionalProperties": false}}, "required": ["page"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"items": {"type": "array", "items": {"type": "object", "properties": {"module_id": {"type": "string", "minLength": 1, "maxLength": 128}, "action_id": {"type": "string", "minLength": 1, "maxLength": 128}, "field_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "admin_only": {"type": "boolean"}, "domain_enforced": {"type": "boolean"}}, "required": ["module_id", "action_id", "field_ids", "admin_only", "domain_enforced"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "next_cursor": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["items"], "additionalProperties": false}.

Validação semântica: cursor bound tenant/query/head; no arbitrary module IDs imply new permissions.
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: .

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "GetPermissionCatalog",
  "operation_id": "fictional-op-9",
  "target": {
    "kind": "permission_catalog",
    "id": "fictional-target"
  },
  "payload": {
    "page": {
      "page_size": 20
    }
  }
}
```

## ACT-ListProfiles

**ListProfiles** — users.policy.read; target profile_catalog.

Payload permitido e required: {"type": "object", "properties": {"page": {"type": "object", "properties": {"page_size": {"type": "integer", "minimum": 1, "maximum": 200}, "cursor": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["page_size"], "additionalProperties": false}}, "required": ["page"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"items": {"type": "array", "items": {"type": "object", "properties": {"profile_id": {"type": "string", "minLength": 1, "maxLength": 128}, "label": {"type": "string", "minLength": 1, "maxLength": 1024}, "version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["profile_id", "label", "version"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "next_cursor": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["items"], "additionalProperties": false}.

Validação semântica: .
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: .

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ListProfiles",
  "operation_id": "fictional-op-10",
  "target": {
    "kind": "profile_catalog",
    "id": "fictional-target"
  },
  "payload": {
    "page": {
      "page_size": 20
    }
  }
}
```

## ACT-GetUserPermissions

**GetUserPermissions** — users.policy.read; target user_policy.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "profile_id": {"type": "string", "minLength": 1, "maxLength": 128}, "inherited": {"type": "array", "items": {"type": "object", "properties": {"module_id": {"type": "string", "minLength": 1, "maxLength": 128}, "action_id": {"type": "string", "minLength": 1, "maxLength": 128}, "record_scope_id": {"type": "string", "minLength": 1, "maxLength": 128}, "field_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 1, "uniqueItems": true}}, "required": ["module_id", "action_id"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "individual_allow": {"type": "array", "items": {"type": "object", "properties": {"module_id": {"type": "string", "minLength": 1, "maxLength": 128}, "action_id": {"type": "string", "minLength": 1, "maxLength": 128}, "record_scope_id": {"type": "string", "minLength": 1, "maxLength": 128}, "field_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 1, "uniqueItems": true}}, "required": ["module_id", "action_id"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "individual_deny": {"type": "array", "items": {"type": "object", "properties": {"module_id": {"type": "string", "minLength": 1, "maxLength": 128}, "action_id": {"type": "string", "minLength": 1, "maxLength": 128}, "record_scope_id": {"type": "string", "minLength": 1, "maxLength": 128}, "field_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 1, "uniqueItems": true}}, "required": ["module_id", "action_id"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "effective": {"type": "array", "items": {"type": "object", "properties": {"module_id": {"type": "string", "minLength": 1, "maxLength": 128}, "action_id": {"type": "string", "minLength": 1, "maxLength": 128}, "record_scope_id": {"type": "string", "minLength": 1, "maxLength": 128}, "field_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 1, "uniqueItems": true}}, "required": ["module_id", "action_id"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "approval_scopes": {"type": "array", "items": {"type": "string", "enum": ["RETENTION_POLICY", "RECOVERY_TOLERANCE"]}, "minItems": 0, "uniqueItems": true}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "active": {"type": "boolean"}}, "required": ["subject_id", "profile_id", "inherited", "individual_allow", "individual_deny", "effective", "approval_scopes", "policy_version", "active"], "additionalProperties": false}.

Validação semântica: field projection authorized, approvals distinct; effective excludes domain-prohibited actions.
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: .

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "GetUserPermissions",
  "operation_id": "fictional-op-11",
  "target": {
    "kind": "user_policy",
    "id": "fictional-target"
  },
  "payload": {}
}
```

## ACT-ListPolicyAudit

**ListPolicyAudit** — users.policy.audit; target policy_audit.

Payload permitido e required: {"type": "object", "properties": {"page": {"type": "object", "properties": {"page_size": {"type": "integer", "minimum": 1, "maximum": 200}, "cursor": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["page_size"], "additionalProperties": false}, "subject_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["page"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"items": {"type": "array", "items": {"type": "object", "properties": {"event_id": {"type": "string", "minLength": 1, "maxLength": 128}, "actor_id": {"type": "string", "minLength": 1, "maxLength": 128}, "subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "action": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "occurred_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["event_id", "actor_id", "subject_id", "action", "policy_version", "occurred_utc"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "next_cursor": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["items"], "additionalProperties": false}.

Validação semântica: .
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: .

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ListPolicyAudit",
  "operation_id": "fictional-op-12",
  "target": {
    "kind": "policy_audit",
    "id": "fictional-target"
  },
  "payload": {
    "page": {
      "page_size": 20
    }
  }
}
```

## ACT-ConfigureSchedule

**ConfigureSchedule** — backups.configure; target backup_config.

Payload permitido e required: {"type": "object", "properties": {"enabled": {"type": "boolean"}, "timezone": {"type": "string", "minLength": 1, "maxLength": 128}, "schedule": {"oneOf": [{"type": "object", "properties": {"frequency": {"const": "DAILY"}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "WEEKLY"}, "weekdays": {"type": "array", "items": {"type": "integer", "minimum": 1, "maximum": 7}, "minItems": 1, "uniqueItems": true}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "weekdays", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "MONTHLY"}, "day_of_month": {"type": "integer", "minimum": 1, "maximum": 31}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}, "missing_day": {"const": "SKIP_AND_REPORT"}}, "required": ["frequency", "day_of_month", "local_time", "missing_day"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "INTERVAL"}, "interval_seconds": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "anchor_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["frequency", "interval_seconds", "anchor_utc"], "additionalProperties": false}]}, "dst_overlap": {"type": "string", "enum": ["FIRST", "SECOND"]}, "dst_gap": {"const": "SKIP_AND_REPORT"}}, "required": ["enabled", "timezone", "schedule", "dst_overlap", "dst_gap"], "additionalProperties": false}.

Resultado PROTECTED: {"oneOf": [{"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "stored_schedule": {"type": "object", "properties": {"schema_version": {"const": 1}, "state": {"const": "CONFIGURED_DISABLED"}, "enabled": {"const": false}, "timezone": {"type": "string", "minLength": 1, "maxLength": 128}, "schedule": {"oneOf": [{"type": "object", "properties": {"frequency": {"const": "DAILY"}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "WEEKLY"}, "weekdays": {"type": "array", "items": {"type": "integer", "minimum": 1, "maximum": 7}, "minItems": 1, "uniqueItems": true}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "weekdays", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "MONTHLY"}, "day_of_month": {"type": "integer", "minimum": 1, "maximum": 31}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}, "missing_day": {"const": "SKIP_AND_REPORT"}}, "required": ["frequency", "day_of_month", "local_time", "missing_day"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "INTERVAL"}, "interval_seconds": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "anchor_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["frequency", "interval_seconds", "anchor_utc"], "additionalProperties": false}]}, "dst_overlap": {"type": "string", "enum": ["FIRST", "SECOND"]}, "dst_gap": {"const": "SKIP_AND_REPORT"}}, "required": ["schema_version", "state", "enabled", "timezone", "schedule", "dst_overlap", "dst_gap"], "additionalProperties": false}}, "required": ["config_version", "stored_schedule"], "additionalProperties": false}, {"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "stored_schedule": {"type": "object", "properties": {"schema_version": {"const": 1}, "state": {"const": "ENABLED"}, "enabled": {"const": true}, "timezone": {"type": "string", "minLength": 1, "maxLength": 128}, "schedule": {"oneOf": [{"type": "object", "properties": {"frequency": {"const": "DAILY"}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "WEEKLY"}, "weekdays": {"type": "array", "items": {"type": "integer", "minimum": 1, "maximum": 7}, "minItems": 1, "uniqueItems": true}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "weekdays", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "MONTHLY"}, "day_of_month": {"type": "integer", "minimum": 1, "maximum": 31}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}, "missing_day": {"const": "SKIP_AND_REPORT"}}, "required": ["frequency", "day_of_month", "local_time", "missing_day"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "INTERVAL"}, "interval_seconds": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "anchor_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["frequency", "interval_seconds", "anchor_utc"], "additionalProperties": false}]}, "dst_overlap": {"type": "string", "enum": ["FIRST", "SECOND"]}, "dst_gap": {"const": "SKIP_AND_REPORT"}}, "required": ["schema_version", "state", "enabled", "timezone", "schedule", "dst_overlap", "dst_gap"], "additionalProperties": false}, "next_occurrence_id": {"type": "string", "minLength": 1, "maxLength": 128}, "next_due_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["config_version", "stored_schedule"], "additionalProperties": false}]}.

Validação semântica: timezone must resolve IANA in versioned server tzdb; HH:mm not UTC; weekday ISO1..7; monthly missing day skipped/reported; interval anchor UTC; unique logical slot regardless overlap; no business frequency default.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: INVALID_TIMEZONE, TZDATA_UNAVAILABLE, SCHEDULE_INVALID, OCCURRENCE_UNREPRESENTABLE, FIELD_READ_DENIED.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ConfigureSchedule",
  "operation_id": "fictional-op-13",
  "target": {
    "kind": "backup_config",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "enabled": true,
    "timezone": "America/Sao_Paulo",
    "schedule": {
      "frequency": "DAILY",
      "local_time": "03:15"
    },
    "dst_overlap": "FIRST",
    "dst_gap": "SKIP_AND_REPORT"
  }
}
```

## ACT-ApproveRetentionChange

**ApproveRetentionChange** — approvals.retention.approve; target backup_config.

Payload permitido e required: {"type": "object", "properties": {"counts": {"type": "object", "properties": {"daily_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "monthly_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}}, "required": ["daily_count", "monthly_count"], "additionalProperties": false}}, "required": ["counts"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"approval_ref": {"type": "string", "minLength": 1, "maxLength": 128}, "approved_config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "approved_counts": {"type": "object", "properties": {"daily_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "monthly_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}}, "required": ["daily_count", "monthly_count"], "additionalProperties": false}}, "required": ["approval_ref", "approved_config_version", "approved_counts"], "additionalProperties": false}.

Validação semântica: current designated/delegated production authority; bind exact target version and counts; this does not approve runtime execution.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: APPROVAL_AUTHORITY_REQUIRED.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ApproveRetentionChange",
  "operation_id": "fictional-op-14",
  "target": {
    "kind": "backup_config",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "counts": {
      "daily_count": 30,
      "monthly_count": 12
    }
  }
}
```

## ACT-ConfigureRetention

**ConfigureRetention** — backups.configure; target backup_config.

Payload permitido e required: {"type": "object", "properties": {"counts": {"type": "object", "properties": {"daily_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "monthly_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}}, "required": ["daily_count", "monthly_count"], "additionalProperties": false}, "approval_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["counts", "approval_ref"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "counts": {"type": "object", "properties": {"daily_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "monthly_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}}, "required": ["daily_count", "monthly_count"], "additionalProperties": false}, "cleanup_mode": {"type": "string", "enum": ["NORMAL", "SUSPENDED"]}}, "required": ["config_version", "counts", "cleanup_mode"], "additionalProperties": false}.

Validação semântica: approval covers exact counts/target/version/current tenant; predefined installation default30/12; positive integer counts configurable, no silent defaults on edit; dual-class RP2 unchanged.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: APPROVAL_AUTHORITY_REQUIRED, APPROVAL_MISMATCH, RETENTION_INVALID.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ConfigureRetention",
  "operation_id": "fictional-op-15",
  "target": {
    "kind": "backup_config",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "counts": {
      "daily_count": 30,
      "monthly_count": 12
    },
    "approval_ref": "fictional-approval"
  }
}
```

## ACT-ConfigureDestination

**ConfigureDestination** — backups.integrations.configure; target backup_config.

Payload permitido e required: {"type": "object", "properties": {"provider_link_id": {"type": "string", "minLength": 1, "maxLength": 128}, "folder_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["provider_link_id", "folder_id"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "destination_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["config_version", "destination_ref"], "additionalProperties": false}.

Validação semântica: server resolves link->authorized Google subject/app/drive namespace; verifies folder capability/current scope, rejects cross-tenant IDs and non-folder; no client account/OAuth secrets; preserves previous points.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: PROVIDER_LINK_INVALID, DESTINATION_INVALID, PROVIDER_UNAVAILABLE.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ConfigureDestination",
  "operation_id": "fictional-op-16",
  "target": {
    "kind": "backup_config",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "provider_link_id": "fictional-provider-link",
    "folder_id": "fictional-drive-folder"
  }
}
```

## ACT-RunManualBackup

**RunManualBackup** — backups.execute; target backup_config.

Payload permitido e required: {"type": "object", "properties": {"classification": {"type": "string", "enum": ["DAILY", "MONTHLY", "BOTH", "UNCLASSIFIED"]}}, "required": ["classification"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"job_id": {"type": "string", "minLength": 1, "maxLength": 128}, "job_state": {"type": "string", "enum": ["QUEUED", "EXPORTING", "ENCRYPTING", "UPLOADING", "VERIFYING", "UPLOAD_VERIFIED", "SET_SEALED", "FAILED", "UNKNOWN"]}, "point_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["job_id", "job_state"], "additionalProperties": false}.

Validação semântica: explicit classification RP2, manual operation never fulfills schedule slot implicitly; server generates point/occurrence/job/UTC and immutable folder+file IDs.
Persistência: protected job+occurrence ledger then staged export/cipher/upload/verify C5; failed/unknown suspends cleanup; no RESTORE_VERIFIED from upload.
Reasons adicionais: DESTINATION_INVALID, PROVIDER_LINK_INVALID, BACKUP_UNAVAILABLE.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "RunManualBackup",
  "operation_id": "fictional-op-17",
  "target": {
    "kind": "backup_config",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "classification": "UNCLASSIFIED"
  }
}
```

## ACT-GetBackupConfiguration

**GetBackupConfiguration** — backups.read; target backup_config.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"oneOf": [{"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "stored_schedule": {"type": "object", "properties": {"schema_version": {"const": 1}, "state": {"const": "UNCONFIGURED"}}, "required": ["schema_version", "state"], "additionalProperties": false}, "counts": {"type": "object", "properties": {"daily_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "monthly_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}}, "required": ["daily_count", "monthly_count"], "additionalProperties": false}, "destination_ref": {"type": "string", "minLength": 1, "maxLength": 128}, "provider_link_state": {"type": "string", "enum": ["UNLINKED", "LINKED", "AUTH_REQUIRED", "DISCONNECTING"]}, "cleanup_mode": {"type": "string", "enum": ["NORMAL", "SUSPENDED"]}}, "required": ["config_version", "stored_schedule", "counts", "provider_link_state", "cleanup_mode"], "additionalProperties": false}, {"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "stored_schedule": {"type": "object", "properties": {"schema_version": {"const": 1}, "state": {"const": "CONFIGURED_DISABLED"}, "enabled": {"const": false}, "timezone": {"type": "string", "minLength": 1, "maxLength": 128}, "schedule": {"oneOf": [{"type": "object", "properties": {"frequency": {"const": "DAILY"}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "WEEKLY"}, "weekdays": {"type": "array", "items": {"type": "integer", "minimum": 1, "maximum": 7}, "minItems": 1, "uniqueItems": true}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "weekdays", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "MONTHLY"}, "day_of_month": {"type": "integer", "minimum": 1, "maximum": 31}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}, "missing_day": {"const": "SKIP_AND_REPORT"}}, "required": ["frequency", "day_of_month", "local_time", "missing_day"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "INTERVAL"}, "interval_seconds": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "anchor_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["frequency", "interval_seconds", "anchor_utc"], "additionalProperties": false}]}, "dst_overlap": {"type": "string", "enum": ["FIRST", "SECOND"]}, "dst_gap": {"const": "SKIP_AND_REPORT"}}, "required": ["schema_version", "state", "enabled", "timezone", "schedule", "dst_overlap", "dst_gap"], "additionalProperties": false}, "counts": {"type": "object", "properties": {"daily_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "monthly_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}}, "required": ["daily_count", "monthly_count"], "additionalProperties": false}, "destination_ref": {"type": "string", "minLength": 1, "maxLength": 128}, "provider_link_state": {"type": "string", "enum": ["UNLINKED", "LINKED", "AUTH_REQUIRED", "DISCONNECTING"]}, "cleanup_mode": {"type": "string", "enum": ["NORMAL", "SUSPENDED"]}}, "required": ["config_version", "stored_schedule", "counts", "provider_link_state", "cleanup_mode"], "additionalProperties": false}, {"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "stored_schedule": {"type": "object", "properties": {"schema_version": {"const": 1}, "state": {"const": "ENABLED"}, "enabled": {"const": true}, "timezone": {"type": "string", "minLength": 1, "maxLength": 128}, "schedule": {"oneOf": [{"type": "object", "properties": {"frequency": {"const": "DAILY"}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "WEEKLY"}, "weekdays": {"type": "array", "items": {"type": "integer", "minimum": 1, "maximum": 7}, "minItems": 1, "uniqueItems": true}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "weekdays", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "MONTHLY"}, "day_of_month": {"type": "integer", "minimum": 1, "maximum": 31}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}, "missing_day": {"const": "SKIP_AND_REPORT"}}, "required": ["frequency", "day_of_month", "local_time", "missing_day"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "INTERVAL"}, "interval_seconds": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "anchor_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["frequency", "interval_seconds", "anchor_utc"], "additionalProperties": false}]}, "dst_overlap": {"type": "string", "enum": ["FIRST", "SECOND"]}, "dst_gap": {"const": "SKIP_AND_REPORT"}}, "required": ["schema_version", "state", "enabled", "timezone", "schedule", "dst_overlap", "dst_gap"], "additionalProperties": false}, "counts": {"type": "object", "properties": {"daily_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "monthly_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}}, "required": ["daily_count", "monthly_count"], "additionalProperties": false}, "destination_ref": {"type": "string", "minLength": 1, "maxLength": 128}, "provider_link_state": {"type": "string", "enum": ["UNLINKED", "LINKED", "AUTH_REQUIRED", "DISCONNECTING"]}, "cleanup_mode": {"type": "string", "enum": ["NORMAL", "SUSPENDED"]}, "next_occurrence_id": {"type": "string", "minLength": 1, "maxLength": 128}, "next_due_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["config_version", "stored_schedule", "counts", "provider_link_state", "cleanup_mode"], "additionalProperties": false}]}.

Validação semântica: .
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: FIELD_READ_DENIED.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "GetBackupConfiguration",
  "operation_id": "fictional-op-18",
  "target": {
    "kind": "backup_config",
    "id": "fictional-target"
  },
  "payload": {}
}
```

## ACT-ListBackupHistory

**ListBackupHistory** — backups.read; target backup_history.

Payload permitido e required: {"type": "object", "properties": {"page": {"type": "object", "properties": {"page_size": {"type": "integer", "minimum": 1, "maximum": 200}, "cursor": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["page_size"], "additionalProperties": false}, "status": {"type": "string", "enum": ["FAILED", "UNKNOWN", "UPLOAD_VERIFIED", "SET_SEALED", "RESTORE_VERIFIED", "DELETED"]}, "from_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}, "until_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["page"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"items": {"type": "array", "items": {"type": "object", "properties": {"point_id": {"type": "string", "minLength": 1, "maxLength": 128}, "classification": {"type": "string", "enum": ["DAILY", "MONTHLY", "BOTH", "UNCLASSIFIED"]}, "state": {"type": "string", "enum": ["UPLOAD_VERIFIED", "SET_SEALED", "RESTORE_VERIFIED", "INVALID", "DELETE_ADMITTED", "PARTIAL_UNKNOWN", "DELETED"]}, "created_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}, "component_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "failure_code": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["point_id", "classification", "state", "created_utc", "component_ids"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "next_cursor": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["items"], "additionalProperties": false}.

Validação semântica: from<=until; exclusive until; cursor binds filter/tenant; stable snapshot no private rows beyond current access.
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: .

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ListBackupHistory",
  "operation_id": "fictional-op-19",
  "target": {
    "kind": "backup_history",
    "id": "fictional-target"
  },
  "payload": {
    "page": {
      "page_size": 20
    }
  }
}
```

## ACT-GetBackupPoint

**GetBackupPoint** — backups.read; target backup_point.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"point_id": {"type": "string", "minLength": 1, "maxLength": 128}, "classification": {"type": "string", "enum": ["DAILY", "MONTHLY", "BOTH", "UNCLASSIFIED"]}, "state": {"type": "string", "enum": ["UPLOAD_VERIFIED", "SET_SEALED", "RESTORE_VERIFIED", "INVALID", "DELETE_ADMITTED", "PARTIAL_UNKNOWN", "DELETED"]}, "created_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}, "component_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "failure_code": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["point_id", "classification", "state", "created_utc", "component_ids"], "additionalProperties": false}.

Validação semântica: .
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: .

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "GetBackupPoint",
  "operation_id": "fictional-op-20",
  "target": {
    "kind": "backup_point",
    "id": "fictional-target"
  },
  "payload": {}
}
```

## ACT-GetBackupJob

**GetBackupJob** — backups.read; target backup_job.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"job_id": {"type": "string", "minLength": 1, "maxLength": 128}, "job_state": {"type": "string", "enum": ["QUEUED", "EXPORTING", "ENCRYPTING", "UPLOADING", "VERIFYING", "UPLOAD_VERIFIED", "SET_SEALED", "FAILED", "UNKNOWN"]}, "point_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["job_id", "job_state"], "additionalProperties": false}.

Validação semântica: .
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: .

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "GetBackupJob",
  "operation_id": "fictional-op-21",
  "target": {
    "kind": "backup_job",
    "id": "fictional-target"
  },
  "payload": {}
}
```

## ACT-BeginProviderLink

**BeginProviderLink** — backups.integrations.configure; target backup_integration.

Payload permitido e required: {"type": "object", "properties": {"purpose": {"type": "string", "enum": ["CONNECT", "RECONNECT"]}, "return_route_id": {"type": "string", "enum": ["BACKUP_SETTINGS"]}}, "required": ["purpose", "return_route_id"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"provider_link_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["AWAITING_PROVIDER", "LINKED", "CANCELLED", "EXPIRED", "AUTH_REQUIRED", "DISCONNECTING", "UNLINKED"]}, "flow_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["provider_link_id", "state"], "additionalProperties": false}.

Validação semântica: Google only; backend generates one-time state and allowlisted exact redirect, nonce/session binding/expiry; reconnect binds existing target and checks same authorized account; browser authorization URL delivered through separate short-lived navigation response, not persisted domain payload.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: PROVIDER_UNAVAILABLE, PROVIDER_LINK_INVALID.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "BeginProviderLink",
  "operation_id": "fictional-op-22",
  "target": {
    "kind": "backup_integration",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "purpose": "CONNECT",
    "return_route_id": "BACKUP_SETTINGS"
  }
}
```

## ACT-CancelProviderLink

**CancelProviderLink** — backups.integrations.configure; target provider_flow.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"provider_link_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["AWAITING_PROVIDER", "LINKED", "CANCELLED", "EXPIRED", "AUTH_REQUIRED", "DISCONNECTING", "UNLINKED"]}, "flow_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["provider_link_id", "state"], "additionalProperties": false}.

Validação semântica: one-time flow terminal; does not disconnect existing valid link; callback after cancel denied.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: FLOW_EXPIRED.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "CancelProviderLink",
  "operation_id": "fictional-op-23",
  "target": {
    "kind": "provider_flow",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {}
}
```

## ACT-CompleteProviderLink

**CompleteProviderLink** — internal.oauth.callback; target provider_flow.

Payload permitido e required: {"type": "object", "properties": {"callback_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["callback_ref"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"provider_link_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["AWAITING_PROVIDER", "LINKED", "CANCELLED", "EXPIRED", "AUTH_REQUIRED", "DISCONNECTING", "UNLINKED"]}, "flow_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["provider_link_id", "state"], "additionalProperties": false}.

Validação semântica: INTERNAL ONLY; callback_ref server-owned consumed secure callback record; code/state validated on secure HTTP boundary never ordinary command fields; actor/session/tenant/redirect/state and current permission rechecked; no browser caller may mint reference.
Persistência: AEP flow idempotency and audit; token reference only inside DDE credential boundary; no access/refresh token in catalog/result/log.
Reasons adicionais: STATE_INVALID, FLOW_EXPIRED, CALLBACK_REPLAY, PROVIDER_LINK_INVALID.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "CompleteProviderLink",
  "operation_id": "fictional-op-24",
  "target": {
    "kind": "provider_flow",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "callback_ref": "fictional-consumed-callback"
  }
}
```

## ACT-GetProviderLink

**GetProviderLink** — backups.integrations.read; target backup_integration.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"provider_link_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["AWAITING_PROVIDER", "LINKED", "CANCELLED", "EXPIRED", "AUTH_REQUIRED", "DISCONNECTING", "UNLINKED"]}, "flow_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["provider_link_id", "state"], "additionalProperties": false}.

Validação semântica: .
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: .

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "GetProviderLink",
  "operation_id": "fictional-op-25",
  "target": {
    "kind": "backup_integration",
    "id": "fictional-target"
  },
  "payload": {}
}
```

## ACT-DisconnectProvider

**DisconnectProvider** — backups.integrations.configure; target backup_integration.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"provider_link_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["AWAITING_PROVIDER", "LINKED", "CANCELLED", "EXPIRED", "AUTH_REQUIRED", "DISCONNECTING", "UNLINKED"]}, "flow_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["provider_link_id", "state"], "additionalProperties": false}.

Validação semântica: disable jobs/new DDE admissions, fence/drain credential use; revoke Google grant through credential boundary; unknown does not claim remote revoke or cancel prior DELETE; do not delete backup files.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: PROVIDER_UNAVAILABLE, PROVIDER_RESULT_UNKNOWN, DRAIN_PENDING.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "DisconnectProvider",
  "operation_id": "fictional-op-26",
  "target": {
    "kind": "backup_integration",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {}
}
```

## ACT-PreviewCleanup

**PreviewCleanup** — backups.cleanup.read; target backup_config.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"plan_id": {"type": "string", "minLength": 1, "maxLength": 128}, "plan_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "eligible_point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "protected_point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "blocker_codes": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["plan_id", "plan_version", "eligible_point_ids", "protected_point_ids", "blocker_codes"], "additionalProperties": false}.

Validação semântica: server computes now/timezone/generations/current RP2, no client fileIDs/eligibility flags; preview not admission.
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: .

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "PreviewCleanup",
  "operation_id": "fictional-op-27",
  "target": {
    "kind": "backup_config",
    "id": "fictional-target"
  },
  "payload": {}
}
```

## ACT-RequestCleanup

**RequestCleanup** — backups.cleanup.execute; target cleanup_plan.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"task_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["PENDING", "PREPARED", "DELETE_ADMITTED", "INFLIGHT", "DELETE_UNKNOWN", "PARTIAL_UNKNOWN", "PARTIAL_FAILED", "DELETE_FAILED", "CLEANUP_SUCCEEDED", "SUSPENDED", "ABSENT_RECONCILED"]}, "point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "component_results": {"type": "array", "items": {"type": "object", "properties": {"component_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["PENDING", "INFLIGHT", "UNKNOWN", "DELETE_SUCCEEDED", "FAILED", "ABSENT_RECONCILED"]}}, "required": ["component_id", "state"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "preservation_status": {"type": "string", "enum": ["UNASSESSED", "HOLD_REQUESTED", "ACTIVE_CONFIRMED", "NOT_GUARANTEED"]}, "blocker_codes": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["task_id", "state", "point_ids", "component_results", "preservation_status", "blocker_codes"], "additionalProperties": false}.

Validação semântica: target id+expected_version selects server plan; AEP revalidates RP2/RP3 each file; DDE exact catalog fileId once per attempt; never folder.
Persistência: RP3 protected task+survivor reserve+admission/attempt/outcome, no new delete protocol.
Reasons adicionais: PLAN_STALE, HOLD_BLOCKED, BACKUP_HEALTH_BLOCKED, LAST_VALID, DEPENDENCY_REQUIRED, KEY_REQUIRED, FENCE_UNPROVEN.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "RequestCleanup",
  "operation_id": "fictional-op-28",
  "target": {
    "kind": "cleanup_plan",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {}
}
```

## ACT-RequestHold

**RequestHold** — backups.holds.manage; target recovery_family.

Payload permitido e required: {"type": "object", "properties": {"point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 1, "uniqueItems": true}, "reason": {"type": "string", "minLength": 1, "maxLength": 1024}}, "required": ["point_ids", "reason"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"hold_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["HOLD_REQUESTED", "HOLD_ACTIVE_CONFIRMED", "PRESERVATION_NOT_GUARANTEED", "RELEASED"]}, "active_point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "unguaranteed_point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "blocker_codes": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["hold_id", "state", "active_point_ids", "unguaranteed_point_ids", "blocker_codes"], "additionalProperties": false}.

Validação semântica: AEP derives full closure and checks all attempts; late hold returns NOT_GUARANTEED with explicit scope, not ACTIVE; point IDs same tenant/family.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: DELETE_ALREADY_ADMITTED, DEPENDENCY_REQUIRED, OBJECT_UNVERIFIED.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "RequestHold",
  "operation_id": "fictional-op-29",
  "target": {
    "kind": "recovery_family",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "point_ids": [
      "fictional-point"
    ],
    "reason": "Exemplo fictício de preservação"
  }
}
```

## ACT-ReleaseHold

**ReleaseHold** — backups.holds.release; target backup_hold.

Payload permitido e required: {"type": "object", "properties": {"reason": {"type": "string", "minLength": 1, "maxLength": 1024}}, "required": ["reason"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"hold_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["HOLD_REQUESTED", "HOLD_ACTIVE_CONFIRMED", "PRESERVATION_NOT_GUARANTEED", "RELEASED"]}, "active_point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "unguaranteed_point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "blocker_codes": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["hold_id", "state", "active_point_ids", "unguaranteed_point_ids", "blocker_codes"], "additionalProperties": false}.

Validação semântica: only authorized owner of operational hold/current authority; legal/domain holds cannot be released through this operational interface; re-evaluate references before future delete.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: DOMAIN_INVARIANT, APPROVAL_AUTHORITY_REQUIRED.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ReleaseHold",
  "operation_id": "fictional-op-30",
  "target": {
    "kind": "backup_hold",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "reason": "Exemplo fictício de liberação"
  }
}
```

## ACT-GetHold

**GetHold** — backups.read; target backup_hold.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"hold_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["HOLD_REQUESTED", "HOLD_ACTIVE_CONFIRMED", "PRESERVATION_NOT_GUARANTEED", "RELEASED"]}, "active_point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "unguaranteed_point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "blocker_codes": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["hold_id", "state", "active_point_ids", "unguaranteed_point_ids", "blocker_codes"], "additionalProperties": false}.

Validação semântica: .
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: .

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "GetHold",
  "operation_id": "fictional-op-31",
  "target": {
    "kind": "backup_hold",
    "id": "fictional-target"
  },
  "payload": {}
}
```

## ACT-GetCleanup

**GetCleanup** — backups.read; target cleanup_task.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"task_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["PENDING", "PREPARED", "DELETE_ADMITTED", "INFLIGHT", "DELETE_UNKNOWN", "PARTIAL_UNKNOWN", "PARTIAL_FAILED", "DELETE_FAILED", "CLEANUP_SUCCEEDED", "SUSPENDED", "ABSENT_RECONCILED"]}, "point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "component_results": {"type": "array", "items": {"type": "object", "properties": {"component_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["PENDING", "INFLIGHT", "UNKNOWN", "DELETE_SUCCEEDED", "FAILED", "ABSENT_RECONCILED"]}}, "required": ["component_id", "state"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "preservation_status": {"type": "string", "enum": ["UNASSESSED", "HOLD_REQUESTED", "ACTIVE_CONFIRMED", "NOT_GUARANTEED"]}, "blocker_codes": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["task_id", "state", "point_ids", "component_results", "preservation_status", "blocker_codes"], "additionalProperties": false}.

Validação semântica: .
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: .

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "GetCleanup",
  "operation_id": "fictional-op-32",
  "target": {
    "kind": "cleanup_task",
    "id": "fictional-target"
  },
  "payload": {}
}
```

## ACT-ReconcileCleanup

**ReconcileCleanup** — backups.cleanup.reconcile; target cleanup_task.

Payload permitido e required: {"type": "object", "properties": {}, "required": [], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"task_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["PENDING", "PREPARED", "DELETE_ADMITTED", "INFLIGHT", "DELETE_UNKNOWN", "PARTIAL_UNKNOWN", "PARTIAL_FAILED", "DELETE_FAILED", "CLEANUP_SUCCEEDED", "SUSPENDED", "ABSENT_RECONCILED"]}, "point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "component_results": {"type": "array", "items": {"type": "object", "properties": {"component_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["PENDING", "INFLIGHT", "UNKNOWN", "DELETE_SUCCEEDED", "FAILED", "ABSENT_RECONCILED"]}}, "required": ["component_id", "state"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "preservation_status": {"type": "string", "enum": ["UNASSESSED", "HOLD_REQUESTED", "ACTIVE_CONFIRMED", "NOT_GUARANTEED"]}, "blocker_codes": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["task_id", "state", "point_ids", "component_results", "preservation_status", "blocker_codes"], "additionalProperties": false}.

Validação semântica: read-only provider evidence initially, no implicit DELETE; GET200 not terminal prior request;404 ambiguous; substitutes require separate RunManualBackup new point and hold.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: PROVIDER_RESULT_UNKNOWN, PROVIDER_LINK_INVALID, FENCE_UNPROVEN.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ReconcileCleanup",
  "operation_id": "fictional-op-33",
  "target": {
    "kind": "cleanup_task",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {}
}
```

## ACT-SuspendCleanup

**SuspendCleanup** — backups.cleanup.manage; target backup_config.

Payload permitido e required: {"type": "object", "properties": {"reason": {"type": "string", "minLength": 1, "maxLength": 1024}}, "required": ["reason"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "cleanup_mode": {"const": "SUSPENDED"}}, "required": ["config_version", "cleanup_mode"], "additionalProperties": false}.

Validação semântica: suspend closes new admissions, not remote cancel; resume rechecks ALL blockers and fresh head, no stale permit.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: BACKUP_HEALTH_BLOCKED, PROVIDER_RESULT_UNKNOWN, FENCE_UNPROVEN.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "SuspendCleanup",
  "operation_id": "fictional-op-34",
  "target": {
    "kind": "backup_config",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "reason": "Exemplo fictício de controle"
  }
}
```

## ACT-ResumeCleanup

**ResumeCleanup** — backups.cleanup.manage; target backup_config.

Payload permitido e required: {"type": "object", "properties": {"reason": {"type": "string", "minLength": 1, "maxLength": 1024}}, "required": ["reason"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "cleanup_mode": {"const": "NORMAL"}}, "required": ["config_version", "cleanup_mode"], "additionalProperties": false}.

Validação semântica: suspend closes new admissions, not remote cancel; resume rechecks ALL blockers and fresh head, no stale permit.
Persistência: AEP CAS+idempotency+audit; protected projection AP3/AP5.
Reasons adicionais: BACKUP_HEALTH_BLOCKED, PROVIDER_RESULT_UNKNOWN, FENCE_UNPROVEN.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ResumeCleanup",
  "operation_id": "fictional-op-35",
  "target": {
    "kind": "backup_config",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "reason": "Exemplo fictício de controle"
  }
}
```

## ACT-ListDestinationFolders

**ListDestinationFolders** — backups.integrations.read; target backup_integration.

Payload permitido e required: {"type": "object", "properties": {"page": {"type": "object", "properties": {"page_size": {"type": "integer", "minimum": 1, "maximum": 200}, "cursor": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["page_size"], "additionalProperties": false}, "parent_folder_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["page"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"items": {"type": "array", "items": {"type": "object", "properties": {"folder_id": {"type": "string", "minLength": 1, "maxLength": 128}, "label": {"type": "string", "minLength": 1, "maxLength": 1024}, "can_create": {"type": "boolean"}, "can_delete_owned": {"type": "boolean"}}, "required": ["folder_id", "label", "can_create", "can_delete_owned"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "next_cursor": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["items"], "additionalProperties": false}.

Validação semântica: only existing approved OAuth scope; inaccessible existing folder not grounds to enlarge scope; no arbitrary account ID.
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: PROVIDER_LINK_INVALID, PROVIDER_UNAVAILABLE.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ListDestinationFolders",
  "operation_id": "fictional-op-36",
  "target": {
    "kind": "backup_integration",
    "id": "fictional-target"
  },
  "payload": {
    "page": {
      "page_size": 20
    }
  }
}
```

## ACT-ListApprovalDelegations

**ListApprovalDelegations** — users.policy.read; target approval_authority.

Payload permitido e required: {"type": "object", "properties": {"page": {"type": "object", "properties": {"page_size": {"type": "integer", "minimum": 1, "maximum": 200}, "cursor": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["page_size"], "additionalProperties": false}}, "required": ["page"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"items": {"type": "array", "items": {"type": "object", "properties": {"delegation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "delegate_user_id": {"type": "string", "minLength": 1, "maxLength": 128}, "scopes": {"type": "array", "items": {"type": "string", "enum": ["RETENTION_POLICY", "RECOVERY_TOLERANCE"]}, "minItems": 1, "uniqueItems": true}, "valid_from_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}, "valid_until_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}, "active": {"type": "boolean"}}, "required": ["delegation_id", "delegate_user_id", "scopes", "valid_from_utc", "active"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "next_cursor": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["items"], "additionalProperties": false}.

Validação semântica: .
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: .

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "ListApprovalDelegations",
  "operation_id": "fictional-op-37",
  "target": {
    "kind": "approval_authority",
    "id": "fictional-target"
  },
  "payload": {
    "page": {
      "page_size": 20
    }
  }
}
```

## ACT-RunScheduledBackup

**RunScheduledBackup** — internal.backup.scheduler; target backup_config.

Payload permitido e required: {"type": "object", "properties": {"occurrence_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["occurrence_ref"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"job_id": {"type": "string", "minLength": 1, "maxLength": 128}, "job_state": {"type": "string", "enum": ["QUEUED", "EXPORTING", "ENCRYPTING", "UPLOADING", "VERIFYING", "UPLOAD_VERIFIED", "SET_SEALED", "FAILED", "UNKNOWN"]}, "point_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["job_id", "job_state"], "additionalProperties": false}.

Validação semântica: INTERNAL ONLY; server-owned occurrence record binds schedule version, logical local slot/fold and derived UTC; identity permission server-derived; unique occurrence survives restart; no browser may mint occurrence_ref.
Persistência: protected occurrence+job ledger atomic, same occurrence returns same job; no skipped/failed slot fabricated.
Reasons adicionais: OCCURRENCE_INVALID, STALE_VERSION, DESTINATION_INVALID.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "RunScheduledBackup",
  "operation_id": "fictional-op-38",
  "target": {
    "kind": "backup_config",
    "id": "fictional-target",
    "expected_version": 4
  },
  "payload": {
    "occurrence_ref": "fictional-server-occurrence"
  }
}
```

## ACT-GetOutcome

**GetOutcome** — operation.read_authorized; target operation.

Payload permitido e required: {"type": "object", "properties": {"original_action": {"type": "string", "enum": ["AssignProfile", "SetIndividualAllow", "SetIndividualDeny", "ResetIndividualOverride", "ActivateUser", "DeactivateUser", "DelegateApproval", "RevokeApprovalDelegation", "ConfigureSchedule", "ApproveRetentionChange", "ConfigureRetention", "ConfigureDestination", "RunManualBackup", "BeginProviderLink", "CancelProviderLink", "CompleteProviderLink", "DisconnectProvider", "RequestCleanup", "RequestHold", "ReleaseHold", "ReconcileCleanup", "SuspendCleanup", "ResumeCleanup", "RunScheduledBackup"]}, "original_digest": {"type": "string", "pattern": "^[0-9a-f]{64}$"}}, "required": ["original_action", "original_digest"], "additionalProperties": false}.

Resultado PROTECTED: {"type": "object", "properties": {"original_response": {"oneOf": [{"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "AssignProfile"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "PROFILE_UNKNOWN", "PERMISSION_UNKNOWN", "LAST_ADMIN", "SELF_ESCALATION"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "AssignProfile"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "AssignProfile"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "AssignProfile"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "AssignProfile"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "AssignProfile"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "effective_changed": {"type": "boolean"}, "revocation_state": {"type": "string", "enum": ["NOT_REQUIRED", "REVOKING", "CONFIRMED"]}}, "required": ["subject_id", "policy_version", "effective_changed", "revocation_state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SetIndividualAllow"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "PROFILE_UNKNOWN", "PERMISSION_UNKNOWN", "LAST_ADMIN", "SELF_ESCALATION"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SetIndividualAllow"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SetIndividualAllow"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SetIndividualAllow"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SetIndividualAllow"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SetIndividualAllow"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "effective_changed": {"type": "boolean"}, "revocation_state": {"type": "string", "enum": ["NOT_REQUIRED", "REVOKING", "CONFIRMED"]}}, "required": ["subject_id", "policy_version", "effective_changed", "revocation_state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SetIndividualDeny"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "PROFILE_UNKNOWN", "PERMISSION_UNKNOWN", "LAST_ADMIN", "SELF_ESCALATION"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SetIndividualDeny"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SetIndividualDeny"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SetIndividualDeny"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SetIndividualDeny"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SetIndividualDeny"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "effective_changed": {"type": "boolean"}, "revocation_state": {"type": "string", "enum": ["NOT_REQUIRED", "REVOKING", "CONFIRMED"]}}, "required": ["subject_id", "policy_version", "effective_changed", "revocation_state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ResetIndividualOverride"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "PROFILE_UNKNOWN", "PERMISSION_UNKNOWN", "LAST_ADMIN", "SELF_ESCALATION"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ResetIndividualOverride"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ResetIndividualOverride"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ResetIndividualOverride"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ResetIndividualOverride"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ResetIndividualOverride"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "effective_changed": {"type": "boolean"}, "revocation_state": {"type": "string", "enum": ["NOT_REQUIRED", "REVOKING", "CONFIRMED"]}}, "required": ["subject_id", "policy_version", "effective_changed", "revocation_state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ActivateUser"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "PROFILE_UNKNOWN", "PERMISSION_UNKNOWN", "LAST_ADMIN", "SELF_ESCALATION"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ActivateUser"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ActivateUser"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ActivateUser"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ActivateUser"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ActivateUser"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "effective_changed": {"type": "boolean"}, "revocation_state": {"type": "string", "enum": ["NOT_REQUIRED", "REVOKING", "CONFIRMED"]}}, "required": ["subject_id", "policy_version", "effective_changed", "revocation_state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DeactivateUser"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "PROFILE_UNKNOWN", "PERMISSION_UNKNOWN", "LAST_ADMIN", "SELF_ESCALATION"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DeactivateUser"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DeactivateUser"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DeactivateUser"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DeactivateUser"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DeactivateUser"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"subject_id": {"type": "string", "minLength": 1, "maxLength": 128}, "policy_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "effective_changed": {"type": "boolean"}, "revocation_state": {"type": "string", "enum": ["NOT_REQUIRED", "REVOKING", "CONFIRMED"]}}, "required": ["subject_id", "policy_version", "effective_changed", "revocation_state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DelegateApproval"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "APPROVAL_AUTHORITY_REQUIRED", "DELEGATION_INVALID"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DelegateApproval"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DelegateApproval"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DelegateApproval"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DelegateApproval"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DelegateApproval"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"delegation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "authority_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["delegation_id", "authority_version"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RevokeApprovalDelegation"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "APPROVAL_AUTHORITY_REQUIRED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RevokeApprovalDelegation"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RevokeApprovalDelegation"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RevokeApprovalDelegation"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RevokeApprovalDelegation"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RevokeApprovalDelegation"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"delegation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "authority_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "revocation_state": {"type": "string", "enum": ["REVOKING", "CONFIRMED"]}}, "required": ["delegation_id", "authority_version", "revocation_state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureSchedule"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "INVALID_TIMEZONE", "SCHEDULE_INVALID", "OCCURRENCE_UNREPRESENTABLE", "FIELD_READ_DENIED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureSchedule"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureSchedule"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureSchedule"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureSchedule"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureSchedule"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"oneOf": [{"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "stored_schedule": {"type": "object", "properties": {"schema_version": {"const": 1}, "state": {"const": "CONFIGURED_DISABLED"}, "enabled": {"const": false}, "timezone": {"type": "string", "minLength": 1, "maxLength": 128}, "schedule": {"oneOf": [{"type": "object", "properties": {"frequency": {"const": "DAILY"}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "WEEKLY"}, "weekdays": {"type": "array", "items": {"type": "integer", "minimum": 1, "maximum": 7}, "minItems": 1, "uniqueItems": true}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "weekdays", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "MONTHLY"}, "day_of_month": {"type": "integer", "minimum": 1, "maximum": 31}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}, "missing_day": {"const": "SKIP_AND_REPORT"}}, "required": ["frequency", "day_of_month", "local_time", "missing_day"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "INTERVAL"}, "interval_seconds": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "anchor_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["frequency", "interval_seconds", "anchor_utc"], "additionalProperties": false}]}, "dst_overlap": {"type": "string", "enum": ["FIRST", "SECOND"]}, "dst_gap": {"const": "SKIP_AND_REPORT"}}, "required": ["schema_version", "state", "enabled", "timezone", "schedule", "dst_overlap", "dst_gap"], "additionalProperties": false}}, "required": ["config_version", "stored_schedule"], "additionalProperties": false}, {"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "stored_schedule": {"type": "object", "properties": {"schema_version": {"const": 1}, "state": {"const": "ENABLED"}, "enabled": {"const": true}, "timezone": {"type": "string", "minLength": 1, "maxLength": 128}, "schedule": {"oneOf": [{"type": "object", "properties": {"frequency": {"const": "DAILY"}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "WEEKLY"}, "weekdays": {"type": "array", "items": {"type": "integer", "minimum": 1, "maximum": 7}, "minItems": 1, "uniqueItems": true}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}}, "required": ["frequency", "weekdays", "local_time"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "MONTHLY"}, "day_of_month": {"type": "integer", "minimum": 1, "maximum": 31}, "local_time": {"type": "string", "pattern": "^([01]\\d|2[0-3]):[0-5]\\d$"}, "missing_day": {"const": "SKIP_AND_REPORT"}}, "required": ["frequency", "day_of_month", "local_time", "missing_day"], "additionalProperties": false}, {"type": "object", "properties": {"frequency": {"const": "INTERVAL"}, "interval_seconds": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "anchor_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["frequency", "interval_seconds", "anchor_utc"], "additionalProperties": false}]}, "dst_overlap": {"type": "string", "enum": ["FIRST", "SECOND"]}, "dst_gap": {"const": "SKIP_AND_REPORT"}}, "required": ["schema_version", "state", "enabled", "timezone", "schedule", "dst_overlap", "dst_gap"], "additionalProperties": false}, "next_occurrence_id": {"type": "string", "minLength": 1, "maxLength": 128}, "next_due_utc": {"type": "string", "format": "date-time", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"}}, "required": ["config_version", "stored_schedule"], "additionalProperties": false}]}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ApproveRetentionChange"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "APPROVAL_AUTHORITY_REQUIRED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ApproveRetentionChange"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ApproveRetentionChange"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ApproveRetentionChange"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ApproveRetentionChange"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ApproveRetentionChange"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"approval_ref": {"type": "string", "minLength": 1, "maxLength": 128}, "approved_config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "approved_counts": {"type": "object", "properties": {"daily_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "monthly_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}}, "required": ["daily_count", "monthly_count"], "additionalProperties": false}}, "required": ["approval_ref", "approved_config_version", "approved_counts"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureRetention"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "APPROVAL_AUTHORITY_REQUIRED", "APPROVAL_MISMATCH", "RETENTION_INVALID"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureRetention"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureRetention"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureRetention"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureRetention"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureRetention"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "counts": {"type": "object", "properties": {"daily_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}, "monthly_count": {"type": "integer", "minimum": 1, "maximum": 9007199254740991}}, "required": ["daily_count", "monthly_count"], "additionalProperties": false}, "cleanup_mode": {"type": "string", "enum": ["NORMAL", "SUSPENDED"]}}, "required": ["config_version", "counts", "cleanup_mode"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureDestination"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "PROVIDER_LINK_INVALID", "DESTINATION_INVALID"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureDestination"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureDestination"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureDestination"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureDestination"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ConfigureDestination"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "destination_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["config_version", "destination_ref"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunManualBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "DESTINATION_INVALID", "PROVIDER_LINK_INVALID", "BACKUP_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunManualBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunManualBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunManualBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunManualBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunManualBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"job_id": {"type": "string", "minLength": 1, "maxLength": 128}, "job_state": {"type": "string", "enum": ["QUEUED", "EXPORTING", "ENCRYPTING", "UPLOADING", "VERIFYING", "UPLOAD_VERIFIED", "SET_SEALED", "FAILED", "UNKNOWN"]}, "point_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["job_id", "job_state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunManualBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "ACCEPTED_JOB"}, "reason_code": {"type": "string", "enum": ["JOB_ACCEPTED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "job_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "job_id"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "BeginProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "PROVIDER_LINK_INVALID"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "BeginProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "BeginProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "BeginProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "BeginProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "BeginProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"provider_link_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["AWAITING_PROVIDER", "LINKED", "CANCELLED", "EXPIRED", "AUTH_REQUIRED", "DISCONNECTING", "UNLINKED"]}, "flow_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["provider_link_id", "state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "CancelProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "FLOW_EXPIRED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "CancelProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "CancelProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "CancelProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "CancelProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "CancelProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"provider_link_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["AWAITING_PROVIDER", "LINKED", "CANCELLED", "EXPIRED", "AUTH_REQUIRED", "DISCONNECTING", "UNLINKED"]}, "flow_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["provider_link_id", "state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "CompleteProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "STATE_INVALID", "FLOW_EXPIRED", "CALLBACK_REPLAY", "PROVIDER_LINK_INVALID"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "CompleteProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "CompleteProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "CompleteProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "CompleteProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "CompleteProviderLink"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"provider_link_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["AWAITING_PROVIDER", "LINKED", "CANCELLED", "EXPIRED", "AUTH_REQUIRED", "DISCONNECTING", "UNLINKED"]}, "flow_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["provider_link_id", "state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DisconnectProvider"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DisconnectProvider"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DisconnectProvider"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DisconnectProvider"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DisconnectProvider"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "DisconnectProvider"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"provider_link_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["AWAITING_PROVIDER", "LINKED", "CANCELLED", "EXPIRED", "AUTH_REQUIRED", "DISCONNECTING", "UNLINKED"]}, "flow_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["provider_link_id", "state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "PLAN_STALE", "HOLD_BLOCKED", "BACKUP_HEALTH_BLOCKED", "LAST_VALID", "DEPENDENCY_REQUIRED", "KEY_REQUIRED", "FENCE_UNPROVEN"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"task_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["PENDING", "PREPARED", "DELETE_ADMITTED", "INFLIGHT", "DELETE_UNKNOWN", "PARTIAL_UNKNOWN", "PARTIAL_FAILED", "DELETE_FAILED", "CLEANUP_SUCCEEDED", "SUSPENDED", "ABSENT_RECONCILED"]}, "point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "component_results": {"type": "array", "items": {"type": "object", "properties": {"component_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["PENDING", "INFLIGHT", "UNKNOWN", "DELETE_SUCCEEDED", "FAILED", "ABSENT_RECONCILED"]}}, "required": ["component_id", "state"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "preservation_status": {"type": "string", "enum": ["UNASSESSED", "HOLD_REQUESTED", "ACTIVE_CONFIRMED", "NOT_GUARANTEED"]}, "blocker_codes": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["task_id", "state", "point_ids", "component_results", "preservation_status", "blocker_codes"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "ACCEPTED_JOB"}, "reason_code": {"type": "string", "enum": ["JOB_ACCEPTED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "job_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "job_id"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestHold"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "DELETE_ALREADY_ADMITTED", "DEPENDENCY_REQUIRED", "OBJECT_UNVERIFIED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestHold"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestHold"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestHold"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestHold"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RequestHold"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"hold_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["HOLD_REQUESTED", "HOLD_ACTIVE_CONFIRMED", "PRESERVATION_NOT_GUARANTEED", "RELEASED"]}, "active_point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "unguaranteed_point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "blocker_codes": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["hold_id", "state", "active_point_ids", "unguaranteed_point_ids", "blocker_codes"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReleaseHold"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "APPROVAL_AUTHORITY_REQUIRED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReleaseHold"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReleaseHold"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReleaseHold"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReleaseHold"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReleaseHold"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"hold_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["HOLD_REQUESTED", "HOLD_ACTIVE_CONFIRMED", "PRESERVATION_NOT_GUARANTEED", "RELEASED"]}, "active_point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "unguaranteed_point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "blocker_codes": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["hold_id", "state", "active_point_ids", "unguaranteed_point_ids", "blocker_codes"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReconcileCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "PROVIDER_LINK_INVALID", "FENCE_UNPROVEN"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReconcileCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReconcileCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReconcileCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReconcileCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReconcileCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"task_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["PENDING", "PREPARED", "DELETE_ADMITTED", "INFLIGHT", "DELETE_UNKNOWN", "PARTIAL_UNKNOWN", "PARTIAL_FAILED", "DELETE_FAILED", "CLEANUP_SUCCEEDED", "SUSPENDED", "ABSENT_RECONCILED"]}, "point_ids": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "component_results": {"type": "array", "items": {"type": "object", "properties": {"component_id": {"type": "string", "minLength": 1, "maxLength": 128}, "state": {"type": "string", "enum": ["PENDING", "INFLIGHT", "UNKNOWN", "DELETE_SUCCEEDED", "FAILED", "ABSENT_RECONCILED"]}}, "required": ["component_id", "state"], "additionalProperties": false}, "minItems": 0, "uniqueItems": true}, "preservation_status": {"type": "string", "enum": ["UNASSESSED", "HOLD_REQUESTED", "ACTIVE_CONFIRMED", "NOT_GUARANTEED"]}, "blocker_codes": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["task_id", "state", "point_ids", "component_results", "preservation_status", "blocker_codes"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ReconcileCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "ACCEPTED_JOB"}, "reason_code": {"type": "string", "enum": ["JOB_ACCEPTED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "job_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "job_id"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SuspendCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "BACKUP_HEALTH_BLOCKED", "FENCE_UNPROVEN"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SuspendCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SuspendCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SuspendCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SuspendCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "SuspendCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "cleanup_mode": {"const": "SUSPENDED"}}, "required": ["config_version", "cleanup_mode"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ResumeCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "BACKUP_HEALTH_BLOCKED", "FENCE_UNPROVEN"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ResumeCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ResumeCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ResumeCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ResumeCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "ResumeCleanup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"config_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "cleanup_mode": {"const": "NORMAL"}}, "required": ["config_version", "cleanup_mode"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}]}, {"oneOf": [{"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunScheduledBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "REJECTED"}, "reason_code": {"type": "string", "enum": ["VALIDATION_FAILED", "EXTRA_FIELD", "FORGED_CONTEXT", "NOT_AUTHORIZED", "TARGET_NOT_ACCESSIBLE", "DOMAIN_INVARIANT", "OCCURRENCE_INVALID", "DESTINATION_INVALID"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunScheduledBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "CONFLICT"}, "reason_code": {"type": "string", "enum": ["STALE_VERSION", "ID_PAYLOAD_MISMATCH"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "current_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunScheduledBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PENDING"}, "reason_code": {"type": "string", "enum": ["PROTECTION_PENDING", "DRAIN_PENDING", "PROVIDER_PENDING"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunScheduledBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNKNOWN"}, "reason_code": {"type": "string", "enum": ["COMMIT_UNKNOWN", "PROVIDER_RESULT_UNKNOWN", "OPERATION_UNRESOLVED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "pending_ref": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "pending_ref"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunScheduledBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "UNAVAILABLE"}, "reason_code": {"type": "string", "enum": ["AUTHORITY_UNAVAILABLE", "PROVIDER_UNAVAILABLE", "TZDATA_UNAVAILABLE"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunScheduledBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "PROTECTED"}, "reason_code": {"type": "string", "enum": ["OK"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "result": {"type": "object", "properties": {"job_id": {"type": "string", "minLength": 1, "maxLength": 128}, "job_state": {"type": "string", "enum": ["QUEUED", "EXPORTING", "ENCRYPTING", "UPLOADING", "VERIFYING", "UPLOAD_VERIFIED", "SET_SEALED", "FAILED", "UNKNOWN"]}, "point_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["job_id", "job_state"], "additionalProperties": false}, "result_version": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}, "current_authority_head": {"type": "object", "properties": {"authority_id": {"type": "string", "minLength": 1, "maxLength": 128}, "incarnation": {"type": "string", "minLength": 1, "maxLength": 128}, "generation": {"type": "integer", "minimum": 0, "maximum": 9007199254740991}}, "required": ["authority_id", "incarnation", "generation"], "additionalProperties": false}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "result", "result_version", "current_authority_head"], "additionalProperties": false}, {"type": "object", "properties": {"envelope_version": {"const": 1}, "action": {"const": "RunScheduledBackup"}, "operation_id": {"type": "string", "minLength": 1, "maxLength": 128}, "status": {"const": "ACCEPTED_JOB"}, "reason_code": {"type": "string", "enum": ["JOB_ACCEPTED"]}, "retry_kind": {"type": "string", "enum": ["QUERY", "RECONCILE", "NEW_ADMISSION", "NONE"]}, "allowed_actions": {"type": "array", "items": {"type": "string", "minLength": 1, "maxLength": 128}, "minItems": 0, "uniqueItems": true}, "job_id": {"type": "string", "minLength": 1, "maxLength": 128}}, "required": ["envelope_version", "action", "operation_id", "status", "reason_code", "retry_kind", "allowed_actions", "job_id"], "additionalProperties": false}]}]}}, "required": ["original_response"], "additionalProperties": false}.

Validação semântica: target.id original operation_id; fresh authorized read of same tenant/resource; no absence inference; original_response returns the typed original result under current authorization only, never raw token.
Persistência: no domain mutation; audit authorized query; fresh head.
Reasons adicionais: OPERATION_UNRESOLVED, DIGEST_MISMATCH.

Exemplo fictício:
```json
{
  "envelope_version": 1,
  "action": "GetOutcome",
  "operation_id": "fictional-op-39",
  "target": {
    "kind": "operation",
    "id": "fictional-target"
  },
  "payload": {
    "original_action": "AssignProfile",
    "original_digest": "0000000000000000000000000000000000000000000000000000000000000000"
  }
}
```
