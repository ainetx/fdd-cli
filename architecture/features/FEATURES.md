# Features Manifest: fdd-cli

**Status**: PLANNING

**Last Updated**: 2026-01-03

---

## Features List

### 1. [feature-init](feature-init/) ⏳ CRITICAL
**Purpose**: Initialize CLI project structure  
**Status**: IMPLEMENTED  
**Depends On**: None  
**Blocks**: feature-validation-core, feature-project-init  
**Scope**:
- Create Node.js project skeleton with TypeScript
- Set up build configuration (tsup)
- Establish CLI entry point structure
- Configure package.json with dependencies

---

### 2. [feature-validation-core](feature-validation-core/) ⏳ CRITICAL
**Purpose**: Core validation engine and result types  
**Status**: NOT_STARTED  
**Depends On**: feature-init  
**Blocks**: feature-adapter-validation, feature-architecture-validation, feature-feature-validation, feature-manifest-validation  
**Scope**:
- Implement ValidationResult and ValidationIssue domain types
- Create validation scoring logic
- Build issue reporting system
- Implement JSON/human-readable output formatters

---

### 3. [feature-adapter-validation](feature-adapter-validation/) ⏳ HIGH
**Purpose**: FDD adapter validation  
**Status**: NOT_STARTED  
**Depends On**: feature-validation-core  
**Blocks**: None  
**Scope**:
- Implement `fdd validate adapter` command
- Validate AGENTS.md structure
- Check for required sections and completeness
- Verify adapter status (COMPLETE/INCOMPLETE)

---

### 4. [feature-architecture-validation](feature-architecture-validation/) ⏳ HIGH
**Purpose**: Overall Design document validation  
**Status**: NOT_STARTED  
**Depends On**: feature-validation-core  
**Blocks**: None  
**Scope**:
- Implement `fdd validate architecture` command
- Validate sections A-C structure
- Check domain model and API contract definitions
- Enforce ≥90/100 scoring requirement

---

### 5. [feature-feature-validation](feature-feature-validation/) ⏳ HIGH
**Purpose**: Feature Design document validation  
**Status**: NOT_STARTED  
**Depends On**: feature-validation-core  
**Blocks**: None  
**Scope**:
- Implement `fdd validate feature` command
- Validate sections A-F completeness
- Check for type redefinitions
- Enforce 100/100 + 100% completeness requirement

---

### 6. [feature-manifest-validation](feature-manifest-validation/) ⏳ MEDIUM
**Purpose**: FEATURES.md manifest validation  
**Status**: NOT_STARTED  
**Depends On**: feature-validation-core  
**Blocks**: None  
**Scope**:
- Implement `fdd validate manifest` command
- Check manifest structure
- Detect circular dependencies
- Verify feature consistency

---

### 7. [feature-project-init](feature-project-init/) ⏳ HIGH
**Purpose**: Project structure initialization  
**Status**: NOT_STARTED  
**Depends On**: feature-init  
**Blocks**: feature-structure-generation  
**Scope**:
- Implement `fdd init` command
- Generate FDD directory structure
- Create template files
- Return ProjectStructure result

---

### 8. [feature-structure-generation](feature-structure-generation/) ⏳ MEDIUM
**Purpose**: Generate structure from design documents  
**Status**: NOT_STARTED  
**Depends On**: feature-project-init  
**Blocks**: None  
**Scope**:
- Implement `fdd generate structure` command
- Parse DESIGN.md files
- Extract structure requirements
- Create directories based on design

## Feature Dependencies

```
feature-init (1)
├─→ feature-validation-core (2)
│   ├─→ feature-adapter-validation (3)
│   ├─→ feature-architecture-validation (4)
│   ├─→ feature-feature-validation (5)
│   └─→ feature-manifest-validation (6)
└─→ feature-project-init (7)
    └─→ feature-structure-generation (8)
```

---

## Implementation Order

1. feature-init
2. feature-validation-core
3. feature-adapter-validation (parallel)
4. feature-architecture-validation (parallel)
5. feature-feature-validation (parallel)
6. feature-manifest-validation (parallel)
7. feature-project-init
8. feature-structure-generation

---

## Statistics

- **Total Features**: 8
- **Status Breakdown**:
  - ⏳ NOT_STARTED: 8
  - 🔄 IN_PROGRESS: 0
  - ✅ IMPLEMENTED: 0
