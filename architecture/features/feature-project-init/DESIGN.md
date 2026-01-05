# Project Structure Initialization - Feature Design

**Status**: 🔄 IN_PROGRESS  
**Module**: fdd-cli

---

## A. Feature Context

### Overview

Project Structure Initialization: Implement `fdd init` command to generate FDD-compliant directory structure, create template files (DESIGN.md, FEATURES.md), and return ProjectStructure result.

### Purpose

Implement `fdd init` command to generate FDD-compliant directory structure, create template files (DESIGN.md, FEATURES.md), and return ProjectStructure result. This command automates project scaffolding so AI agents and developers don't need to manually create the FDD directory hierarchy.

### Actors

- **AI Agent**: Runs `fdd init` as part of workflow 01 (init-project), consumes structured output
- **Developer**: Uses `fdd init` to bootstrap new FDD projects manually
- **Architect**: Verifies generated structure meets FDD standards

### References

**MANDATORY Reading**:
- Overall Design: `@/architecture/DESIGN.md`
- FEATURES.md: `@/architecture/features/FEATURES.md`

**Dependencies**:
- feature-init (IMPLEMENTED)

---

## B. Actor Flows

### Flow: Initialize Project Structure {#flow-init-structure}

**Actor**: AI Agent / Developer

**Brief**: User/agent runs `fdd init`, system creates `architecture/`, `architecture/features/`, generates DESIGN.md template, returns success with created paths

**Steps** (FDL):

1. Actor invokes `fdd init [project-path]`
2. System starts initialization process
3. **IF** project-path is empty:
   1. Set project-path to current working directory
4. **IF** directory at project-path contains "architecture/":
   1. **IF** --force flag is NOT set:
      1. **RETURN** ValidationResult with error "FDD structure already exists (use --force to overwrite)"
5. Check if project-path is writable
6. **IF** NOT writable:
   1. **RETURN** ValidationResult with error "Permission denied: cannot write to path"
7. Create directory at project-path/architecture/
8. Create directory at project-path/architecture/features/
9. Load DESIGN.md template from embedded templates resource
10. Generate DESIGN.md at project-path/architecture/DESIGN.md
11. Load FEATURES.md template from embedded templates resource
12. Generate FEATURES.md at project-path/architecture/features/FEATURES.md
13. Validate created structure:
    1. Check architecture/ exists
    2. Check architecture/features/ exists
    3. Verify DESIGN.md is valid markdown with sections A, B, C
    4. Verify FEATURES.md has correct manifest format
14. **IF** validation passes:
    1. **RETURN** ProjectStructure with success: true, paths: [list of created paths]
15. **ELSE**:
    1. **RETURN** ProjectStructure with success: false, errors: [validation issues]

**Success Scenario**:
- All directories created successfully
- Template files written with valid content
- ProjectStructure returned with paths array and success status

**Error Scenarios**:
- Target directory already contains FDD structure (non-empty `architecture/`)
- Insufficient permissions to create directories
- Template files fail validation after creation

---

### Flow: Validate Generated Structure

**Actor**: System (internal validation)

**Brief**: System verifies all required directories exist, templates are valid, returns ProjectStructure result with status

**Steps** (FDL):

1. Check if directory at architecturePath exists
2. **IF** NOT exists:
   1. Add issue "Missing architecture/ directory"
3. Check if directory at architecturePath/features/ exists
4. **IF** NOT exists:
   1. Add issue "Missing architecture/features/ directory"
5. Read DESIGN.md from architecturePath/DESIGN.md
6. **IF** file does not exist:
   1. Add issue "Missing DESIGN.md file"
7. **ELSE**:
   1. Validate DESIGN.md contains section "## A."
   2. Validate DESIGN.md contains section "## B."
   3. Validate DESIGN.md contains section "## C."
   4. **IF** any section missing:
      1. Add issue "DESIGN.md missing required sections"
8. Read FEATURES.md from architecturePath/features/FEATURES.md
9. **IF** file does not exist:
   1. Add issue "Missing FEATURES.md file"
10. **ELSE**:
    1. Validate FEATURES.md contains "# Features Manifest:"
    2. Validate FEATURES.md contains "## Features List"
    3. **IF** format invalid:
       1. Add issue "FEATURES.md has invalid format"
11. **IF** no issues found:
    1. **RETURN** ValidationResult with success: true
12. **ELSE**:
    1. **RETURN** ValidationResult with success: false, issues: [list of issues]

**Success Scenario**:
- All required directories present
- All template files valid
- Validation passes

**Error Scenarios**:
- Missing required directories
- Template files corrupted or incomplete

---

## C. Algorithms

### Algorithm: Generate Directory Structure {#algo-generate-dirs}

**Purpose**: Create FDD-compliant directory hierarchy

**Input**: projectPath (string), forceOverwrite (boolean)

**Output**: [DirectoryCreationResult](../../DESIGN.md#domain-model) (from Overall Design: `gts.ainetx.fdd_cli.project.directory_creation_result.v1`)

**Steps** (FDL):

1. Set basePath to projectPath
2. **IF** basePath is empty:
   1. Get current working directory from process.cwd()
   2. Set basePath to current working directory
3. Normalize basePath to absolute path
4. Set architecturePath to basePath / "architecture"
5. Set featuresPath to architecturePath / "features"
6. Check if architecturePath exists
7. **IF** architecturePath exists:
   1. **IF** forceOverwrite is false:
      1. Create error message "Architecture directory already exists at {architecturePath}"
      2. Add suggestion "Use --force flag to overwrite existing structure"
      3. **RETURN** DirectoryCreationResult with success: false, error message
   2. **ELSE**:
      1. Log warning "Overwriting existing architecture directory"
8. **TRY**:
   1. Create directory at architecturePath with recursive option enabled
   2. Verify architecturePath was created successfully
   3. Create directory at featuresPath with recursive option enabled
   4. Verify featuresPath was created successfully
   5. Create empty createdPaths array
   6. Add architecturePath to createdPaths
   7. Add featuresPath to createdPaths
   8. Create DirectoryCreationResult object:
      - Set success to true
      - Set createdPaths to createdPaths array
      - Set error to null
   9. **RETURN** DirectoryCreationResult
9. **CATCH** PermissionError:
   1. Create error message "Insufficient permissions to create directories at {basePath}"
   2. Add suggestion "Check file system permissions and try again"
   3. **RETURN** DirectoryCreationResult with success: false, error message
10. **CATCH** NoSpaceError:
    1. Create error message "No space left on device at {basePath}"
    2. Add suggestion "Free up disk space and try again"
    3. **RETURN** DirectoryCreationResult with success: false, error message
11. **CATCH** any other error:
    1. Get error message from system
    2. Create error message "Failed to create directories: {system error message}"
    3. **RETURN** DirectoryCreationResult with success: false, error message

---

### Algorithm: Generate Template Files {#algo-generate-templates}

**Purpose**: Create DESIGN.md and FEATURES.md from standard templates

**Input**: architecturePath (string), projectName (string)

**Output**: [TemplateGenerationResult](../../DESIGN.md#domain-model) (from Overall Design: `gts.ainetx.fdd_cli.project.template_generation_result.v1`)

**Steps** (FDL):

1. Load designTemplate from embedded resource "templates/DESIGN.md"
2. Load featuresTemplate from embedded resource "templates/FEATURES.md"
3. **IF** designTemplate is empty:
   1. **RETURN** error "DESIGN.md template not found in embedded resources"
4. **IF** featuresTemplate is empty:
   1. **RETURN** error "FEATURES.md template not found in embedded resources"
5. Replace all occurrences of placeholder "{{PROJECT_NAME}}" in designTemplate with projectName
6. Replace all occurrences of placeholder "{{PROJECT_NAME}}" in featuresTemplate with projectName
7. Replace placeholder "{{TIMESTAMP}}" in designTemplate with current ISO timestamp
8. Replace placeholder "{{TIMESTAMP}}" in featuresTemplate with current ISO timestamp
9. Set designPath to architecturePath / "DESIGN.md"
10. Set featuresPath to architecturePath / "features" / "FEATURES.md"
11. **TRY**:
    1. Write designTemplate content to designPath with UTF-8 encoding
    2. Verify file was written by checking file size > 0
    3. Write featuresTemplate content to featuresPath with UTF-8 encoding
    4. Verify file was written by checking file size > 0
    5. Read back designPath content for validation
    6. Check if designPath content contains section "## A. Business Context"
    7. Check if designPath content contains section "## B. Requirements & Principles"
    8. Check if designPath content contains section "## C. Technical Architecture"
    9. **IF** any required section missing from DESIGN.md:
       1. **RETURN** error "Generated DESIGN.md missing required sections"
    10. Read back featuresPath content for validation
    11. Check if featuresPath content contains "# Features Manifest:"
    12. Check if featuresPath content contains "## Features List"
    13. **IF** any required section missing from FEATURES.md:
        1. **RETURN** error "Generated FEATURES.md missing required sections"
    14. Create empty files array
    15. Add designPath to files array
    16. Add featuresPath to files array
    17. Create TemplateGenerationResult object:
        - Set success to true
        - Set files to files array
        - Set error to null
    18. **RETURN** TemplateGenerationResult
12. **CATCH** WriteError:
    1. Get error details from system
    2. Create error message "Failed to write template files: {error details}"
    3. **RETURN** TemplateGenerationResult with success: false, error message
13. **CATCH** ValidationError:
    1. Get validation error details
    2. Create error message "Template validation failed: {validation details}"
    3. **RETURN** TemplateGenerationResult with success: false, error message

---

### Algorithm: Build ProjectStructure Result {#algo-build-result}

**Purpose**: Construct ProjectStructure result object with all created paths and validation status

**Input**: createdDirectories (string[]), createdFiles (string[]), validationResult (ValidationResult)

**Output**: ProjectStructure

**Steps** (FDL):

1. Create empty allPaths array
2. **FOR EACH** directory in createdDirectories:
   1. Add directory to allPaths
   2. Log created directory path
3. **FOR EACH** file in createdFiles:
   1. Add file to allPaths
   2. Log created file path
4. **IF** validationResult.success is true:
   1. Create ProjectStructure object:
      - Set success to true
      - Set paths to allPaths array
      - Set errors to empty array
      - Set message to "FDD project structure created successfully"
   2. **RETURN** ProjectStructure
5. **ELSE**:
   1. Create ProjectStructure object:
      - Set success to false
      - Set paths to allPaths array
      - Set errors to validationResult.issues array
      - Set message to "FDD project structure created with validation errors"
   2. **RETURN** ProjectStructure

---

## D. States

N/A - This feature does not require state machine modeling.

---

## E. Technical Details

### Database Schema

**Tables/Entities**: N/A - No database required (file system operations only)

**Rationale**: This feature performs pure file system operations without persistence layer. All state is reflected in created files and directories.

---

### API Endpoints

**Endpoints** (reference Overall Design API specification): N/A - CLI command, not API

**CLI Command Specification**:

```
fdd init [project-path] [options]

Arguments:
  project-path    Target directory for FDD structure (default: current directory)
                  - Must be valid directory path (absolute or relative)
                  - Will be normalized to absolute path
                  - Parent directory must exist and be writable

Options:
  --force         Overwrite existing structure (dangerous)
                  - Default: false
                  - Skips existence check for architecture/ directory
                  - Use with caution - may delete existing content
                  
  --quiet         Suppress output messages
                  - Default: false
                  - Only outputs errors and final result
                  - Useful for scripting
                  
  --verbose       Show detailed creation steps
                  - Default: false
                  - Logs each directory creation, file write, validation step
                  - Useful for debugging
                  
  --json          Output result as JSON
                  - Default: false
                  - Outputs ProjectStructure object in JSON format
                  - Required for AI agent consumption
                  - Format matches gts.ainetx.fdd_cli.project.project_structure.v1 schema

Exit Codes:
  0    Success - structure created and validated
  1    Validation error - structure exists or validation failed
  2    Permission error - insufficient file system permissions
  3    System error - disk space, I/O error, etc.
```

**Command Implementation**:
- **Handler Location**: `src/commands/init.ts`
- **Registration**: `src/index.ts` (commander.js)
- **Dependencies**: 
  - fs-extra (directory operations)
  - path (path normalization)
  - chalk (colored output, optional)

---

### Template Structure

**DESIGN.md Template**:

Template contains 3 required sections:
- **Section A: Business Context** - Placeholder for system vision, actors, capabilities
- **Section B: Requirements & Principles** - Placeholder for use cases, business rules, design principles
- **Section C: Technical Architecture** - Placeholder for architecture style, domain model, API contracts

**Template Variables**:
- `{{PROJECT_NAME}}` - Replaced with project name (from argument or directory name)
- `{{TIMESTAMP}}` - Replaced with ISO 8601 timestamp of creation

**Template Location**: Embedded in CLI binary as string constant (not external file)

**FEATURES.md Template**:

Template contains:
- **Manifest Header**: `# Features Manifest: {{PROJECT_NAME}}`
- **Project Info**: Name, status (⏳ NOT_STARTED initially)
- **Features List**: Empty list with example format commented out

**Template Variables**:
- `{{PROJECT_NAME}}` - Project name
- `{{TIMESTAMP}}` - Creation timestamp

**Template Location**: Embedded in CLI binary as string constant

**Template Validation**:
After generation, templates are validated for:
1. Required section headings present
2. Valid markdown structure (no syntax errors)
3. File size > 100 bytes (not empty)
4. UTF-8 encoding

---

### Directory Structure Details

**Created Structure**:
```
<project-path>/
├── architecture/           # Root architecture directory
│   ├── DESIGN.md          # Overall Design document (from template)
│   └── features/          # Features directory
│       └── FEATURES.md    # Features manifest (from template)
```

**Directory Permissions**:
- Created with default umask (typically 755)
- Inherits permissions from parent directory
- Must be writable by current user

**Directory Naming Rules**:
- `architecture/` - Fixed name, not configurable
- `features/` - Fixed name, not configurable
- No special characters or spaces in project-path

---

### Path Handling

**Path Normalization**:
1. Convert relative paths to absolute using `path.resolve()`
2. Normalize separators for current OS
3. Remove trailing slashes
4. Resolve symlinks to actual paths

**Path Validation**:
1. Check parent directory exists
2. Check parent directory is writable
3. Reject paths with directory traversal (../)
4. Reject reserved system paths (/dev, /proc, /sys on Unix)
5. Reject root directory (/) 
6. Reject system directories (C:\Windows, /System on Windows/macOS)

**Security Measures**:
- Sanitize input to prevent directory traversal attacks
- Validate against whitelist of allowed characters
- Check resolved path is within expected bounds
- Prevent writes to system directories

---

### Output Formatting

**Human-Readable Format** (default):
```
✓ Created architecture/ directory
✓ Created architecture/features/ directory
✓ Generated DESIGN.md template
✓ Generated FEATURES.md template
✓ Validation passed

FDD project structure initialized successfully at:
  /path/to/project/architecture/
```

**JSON Format** (--json flag):
```json
{
  "success": true,
  "paths": [
    "/path/to/project/architecture/",
    "/path/to/project/architecture/features/",
    "/path/to/project/architecture/DESIGN.md",
    "/path/to/project/architecture/features/FEATURES.md"
  ],
  "errors": []
}
```

**Verbose Format** (--verbose flag):
Includes detailed step-by-step logging:
```
[1/7] Resolving project path: /path/to/project
[2/7] Checking for existing structure...
[3/7] Creating architecture/ directory...
[4/7] Creating features/ subdirectory...
[5/7] Loading templates from embedded resources...
[6/7] Generating DESIGN.md from template...
[7/7] Validating generated structure...
✓ All steps completed successfully
```

**Quiet Format** (--quiet flag):
Only outputs final result or errors:
```
Success
```

---

### Security

**Authorization**: File system permissions only - command respects OS-level directory access controls

**Input Validation**:
- Prevent overwriting existing FDD structure (unless --force)
- Validate target path is writable before operations
- Sanitize project-path input to prevent directory traversal
- Reject paths containing: `..`, `~`, symbolic links (unless explicitly resolved)
- Reject absolute paths to system directories
- Maximum path length: 4096 characters (Unix) / 260 characters (Windows)

**File System Safety**:
- Atomic operations where possible (create directory then validate)
- Rollback on validation failure (delete created directories)
- No partial states left on disk after errors
- Use fs.mkdirSync with recursive:true for atomic directory tree creation

**Privilege Requirements**:
- No elevated privileges required (no sudo/admin)
- Runs with current user permissions
- Fails gracefully if permissions insufficient

---

### Error Handling

**Error Categories**:

1. **EEXIST** - Structure Already Exists
   - Code: `FDD_INIT_001`
   - Message: `FDD structure already exists at {path} (use --force to overwrite)`
   - Exit Code: 1
   - Recovery: User must use --force flag or choose different directory

2. **EACCES** - Permission Denied
   - Code: `FDD_INIT_002`
   - Message: `Insufficient permissions to create directories at {path}`
   - Exit Code: 2
   - Recovery: Check file system permissions, use sudo if appropriate

3. **ENOSPC** - No Space Left
   - Code: `FDD_INIT_003`
   - Message: `No space left on device at {path}`
   - Exit Code: 3
   - Recovery: Free up disk space and retry

4. **INVALID_PATH** - Invalid Path
   - Code: `FDD_INIT_004`
   - Message: `Invalid or unsafe project path: {reason}`
   - Exit Code: 1
   - Recovery: Use valid directory path

5. **TEMPLATE_ERROR** - Template Loading Failed
   - Code: `FDD_INIT_005`
   - Message: `Failed to load embedded templates: {details}`
   - Exit Code: 3
   - Recovery: Reinstall CLI tool

6. **VALIDATION_ERROR** - Post-Generation Validation Failed
   - Code: `FDD_INIT_006`
   - Message: `Generated structure failed validation: {issues}`
   - Exit Code: 3
   - Recovery: Report bug to maintainers

**Error Format**: 

Returns ValidationResult type with issues array:
```typescript
{
  success: false,
  score: 0,
  issues: [
    {
      severity: "error",
      code: "FDD_INIT_001",
      message: "FDD structure already exists",
      location: "/path/to/project/architecture",
      fix: "Use --force flag or choose different directory"
    }
  ]
}
```

**Error Recovery**:
- Rollback created directories on validation failure
- Log errors to stderr
- Provide actionable error messages with suggested fixes
- Include error codes for programmatic handling

---

## F. Requirements

### Command Registration {#req-command-registration}

**Status**: 🔄 IN_PROGRESS

The system SHALL register an `fdd init` command in the CLI application that accepts optional project path and configuration flags.

**References**: [Section B: Initialize Project Structure](#flow-init-structure) (step 1)

**Testing Scenarios**:

**Test: Successful command registration**
1. Start with empty CLI application
2. System registers `fdd init` command
3. Verify command appears in help output
4. Verify command accepts [project-path] argument

**Test: Command help display**
1. User runs `fdd init --help`
2. Verify usage information is displayed
3. Verify all options are documented

**Acceptance Criteria**:
- Command registered in commander.js command list
- `fdd init --help` displays complete usage documentation
- Command accepts optional [project-path] positional argument

### Argument Parsing {#req-argument-parsing}

**Status**: 🔄 IN_PROGRESS

The system SHALL parse the optional `[project-path]` positional argument and apply default value when not provided.

**References**: [Section C: Generate Directory Structure](#algo-generate-dirs) (steps 1-2), [Section B: Initialize Project Structure](#flow-init-structure) (step 3)

**Testing Scenarios**:

**Test: Parse with explicit path**
1. User provides command `fdd init /my/project`
2. System parses arguments
3. Verify projectPath is set to `/my/project`

**Test: Parse with default path**
1. User provides command `fdd init` (no path argument)
2. System parses arguments
3. Verify projectPath is set to current working directory

**Acceptance Criteria**:
- Explicit path argument is correctly parsed and used
- Missing path argument defaults to current working directory
- Path validation occurs before directory creation

### Option Flags {#req-option-flags}

**Status**: 🔄 IN_PROGRESS

The system SHALL support four boolean option flags that modify command behavior (--force, --quiet, --verbose, --json).

**References**: [Section B: Initialize Project Structure](#flow-init-structure) (steps 4, 10), Section E (CLI Command specification)

**Testing Scenarios**:

**Test: Parse all option flags**
1. User provides command `fdd init --force --quiet --json`
2. System parses options
3. Verify force flag is true
4. Verify quiet flag is true
5. Verify json flag is true

**Test: Default option values**
1. User provides command `fdd init` (no flags)
2. System parses options
3. Verify all flags are false (default)

**Acceptance Criteria**:
- All four flags (--force, --quiet, --verbose, --json) are recognized
- Flag combinations work correctly (e.g., --force --json)
- Invalid flags produce error message

### Command Handler Stub {#req-handler-stub}

**Status**: 🔄 IN_PROGRESS

The system SHALL provide a stub command handler function that logs parsed arguments for verification purposes.

**References**: [Section B: Initialize Project Structure](#flow-init-structure) (steps 2-15)

**Testing Scenarios**:

**Test: Handler logs arguments**
1. User provides command `fdd init /test --force`
2. Handler is invoked
3. Verify projectPath `/test` is logged
4. Verify force option `true` is logged

**Test: Handler verification output**
1. Stub handler executes
2. Verify output confirms command registration
3. Verify output shows parsed arguments structure

**Acceptance Criteria**:
- Handler function is registered and callable
- All parsed arguments are logged for verification
- Output format is clear and human-readable

---

## G. Implementation Plan

1. **cli-command-registration** [🔄 IN_PROGRESS]
   - **Status**: Active in `openspec/changes/cli-command-registration/`
   - **Implements Requirements**: [Command Registration](#req-command-registration), [Argument Parsing](#req-argument-parsing), [Option Flags](#req-option-flags), [Command Handler Stub](#req-handler-stub)
   - **Description**: Register `fdd init` command with commander.js, parse arguments and options
   - **Tasks**: 0/15 completed
   - **Scope**:
     - Command registration in src/index.ts
     - Argument/option parsing (project-path with default)
     - Option flags (--force, --quiet, --verbose, --json)
     - Help text and usage examples
     - Stub handler for verification

2. **directory-structure-generation** [⏳ NOT_STARTED]
   - **Implements Requirements**: (infrastructure component - no direct requirements, implements [Section C: Generate Directory Structure](#algo-generate-dirs))
   - **Description**: Implement logic to create `architecture/` and `architecture/features/` directories with validation
   - **Scope**:
     - Directory creation with fs-extra
     - Validation of target path
     - Error handling for permissions/existing structure
   - **Dependencies**: cli-command-registration
   - **Effort**: Small (2-3 hours)

3. **template-file-generation** [⏳ NOT_STARTED]
   - **Implements Requirements**: (infrastructure component - no direct requirements, implements [Section C: Generate Template Files](#algo-generate-templates))
   - **Description**: Generate DESIGN.md and FEATURES.md from embedded templates
   - **Scope**:
     - Template definitions (embedded in code or separate files)
     - Template rendering with project-specific values
     - File writing with validation
   - **Dependencies**: directory-structure-generation
   - **Effort**: Medium (3-4 hours)

4. **result-formatting-validation** [⏳ NOT_STARTED]
   - **Implements Requirements**: (infrastructure component - no direct requirements, implements [Section C: Build ProjectStructure Result](#algo-build-result))
   - **Description**: Return ProjectStructure result, format output (human/JSON), validate generated structure
   - **Scope**:
     - Reference ProjectStructure type from Overall Design (gts.ainetx.fdd_cli.project.project_structure.v1)
     - JSON output formatter
     - Human-readable output formatter
     - Post-generation validation
   - **Dependencies**: template-file-generation
   - **Effort**: Small (2-3 hours)

### Success Criteria

- ✅ `fdd init --help` displays correct usage
- ⏳ Directories created with proper validation
- ⏳ Templates generated with valid content
- ⏳ ProjectStructure result returned correctly
- ⏳ Both human and JSON output formats work
- ⏳ All requirements implemented and tested
