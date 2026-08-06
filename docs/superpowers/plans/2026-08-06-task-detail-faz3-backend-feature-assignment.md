# Görev Detay F3 — Backend: TaskFeatureAssignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the backend persistence for "which non-core features are attached to which task"
— a `TaskFeatureAssignment` entity + migration + 3 `ITaskAppService` methods
(`GetFeatureAssignmentsAsync`/`AddFeatureAsync`/`RemoveFeatureAsync`). This is the backend half
of F3 (navbar + `TaskFeatureRegistry` + "+" menu); the frontend half is a separate plan,
written after this one is implemented and reviewed, since the frontend registry/picker need
the final method signatures to build against.

**Architecture:** Mirrors the existing `TaskTagAssignment` entity byte-for-byte (same minimal
shape: bare `Entity<Guid>`, no audit fields, no `IMultiTenant` — tenant/privacy safety comes
entirely from routing every method through the already-existing `EnsureTaskAccessAllowedAsync`
guard, exactly like every other task-scoped sub-resource in this codebase). No new DTO/
AutoMapper profile needed — feature codes are plain strings, methods return `List<string>`.

**Tech Stack:** ABP Framework / .NET 10, EF Core (Npgsql/Postgres), xUnit + Shouldly (existing
`PlatformEntityFrameworkCoreTestBase` real-DB test host). No new package.

## Global Constraints

- Entity shape (exact, copied from `TaskTagAssignment`'s pattern, `src/Apya.Platform.Domain/Tasks/TaskTagAssignment.cs`): bare `Entity<Guid>`, constructor `(Guid id, Guid taskId, string featureCode)`, no audit interfaces, no `IMultiTenant`.
- EF configuration (exact, copied from `PlatformDbContext.cs:587-592`'s `TaskTagAssignment` block): `ToTable(PlatformConsts.DbTablePrefix + "TaskFeatureAssignments", PlatformConsts.DbSchema)`, `ConfigureByConvention()`, unique index on `(TaskId, FeatureCode)`.
- Every new `ITaskAppService` method MUST call `await EnsureTaskAccessAllowedAsync(taskId);` as its first line (this is the ONLY access control for task sub-resources in this codebase — no separate `PlatformPermissions` check, matching `AddCommentAsync`/`AddAttachmentAsync`/`GetAttachmentsAsync` exactly, `src/Apya.Platform.Application/Tasks/TaskAppService.cs:502,597,641,655`). Do not invent a new permission for this.
- `GuidGenerator.Create()` (ABP `ApplicationService` base member, already available, no new injection) for new entity IDs — exact pattern at `TaskAppService.cs:231` (`new TaskTagAssignment(GuidGenerator.Create(), taskId, tag.Id)`).
- Repository injection pattern (exact, copied from `TaskAppService.cs:26-34`): constructor-injected `IRepository<TaskFeatureAssignment, Guid>`, stored as a `private readonly` field, added alongside the existing `_taskTagRepository` etc.
- Migration table name: `AppTaskFeatureAssignments` (prefix `App` + entity name — matches `AppTaskTagAssignments`, `AppTaskAttachments`, etc., all in `PlatformConsts.DbSchema`).
- `FeatureCode` max length: 64 chars (matches `Tag.Name`'s `HasMaxLength(64)` convention for short code-like strings in this module).
- Migration MUST be generated via the real `dotnet ef migrations add` CLI (never hand-write the migration `.cs`/`.Designer.cs`/model-snapshot files — this project's migrations are EF-tool-generated, and hand-editing them risks a snapshot/migration mismatch that only surfaces at `dotnet ef database update` time).
- Test host/pattern: `PlatformEntityFrameworkCoreTestBase`, `[Collection(PlatformTestConsts.CollectionDefinitionName)]`, real EF Core + Sqlite in-memory DB — exact precedent file: `test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tasks/TaskAppService_Tenant_Tests.cs`. Do NOT put new tests in `test/Apya.Platform.Application.Tests/` — that project's DI container can't resolve `ITaskAppService` (documented in the precedent file's own comment, lines 16-22: `AbpFeatureManagementDomainModule` fails without `IFeatureGroupDefinitionRecordRepository`).

---

### Task 1: `TaskFeatureAssignment` entity, EF configuration, migration

**Files:**
- Create: `src/Apya.Platform.Domain/Tasks/TaskFeatureAssignment.cs`
- Modify: `src/Apya.Platform.EntityFrameworkCore/EntityFrameworkCore/PlatformDbContext.cs`
- Create (via `dotnet ef migrations add`, not hand-written): a new file pair under `src/Apya.Platform.EntityFrameworkCore/Migrations/`

**Interfaces:**
- Consumes: nothing new.
- Produces (used by Task 2): the `TaskFeatureAssignment` type (`TaskId: Guid`, `FeatureCode: string`, constructor `(Guid id, Guid taskId, string featureCode)`), and the `DbSet<TaskFeatureAssignment> TaskFeatureAssignments` on `PlatformDbContext`, resolvable as `IRepository<TaskFeatureAssignment, Guid>` via DI (ABP's generic-repository auto-registration — no explicit `ITaskFeatureAssignmentRepository` needed, matching `TaskTagAssignment`'s precedent, which also has no dedicated repository interface).

- [ ] **Step 1: Create the entity**

```csharp
// src/Apya.Platform.Domain/Tasks/TaskFeatureAssignment.cs
using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Tasks;

/// <summary>Görev bazlı eklenmiş (core olmayan) feature — TaskTagAssignment ile aynı desen.</summary>
public class TaskFeatureAssignment : Entity<Guid>
{
    public Guid TaskId { get; set; }
    public string FeatureCode { get; set; } = string.Empty;

    public TaskFeatureAssignment() { }

    public TaskFeatureAssignment(Guid id, Guid taskId, string featureCode) : base(id)
    {
        TaskId = taskId;
        FeatureCode = featureCode;
    }
}
```

- [ ] **Step 2: Register the DbSet and EF configuration**

In `src/Apya.Platform.EntityFrameworkCore/EntityFrameworkCore/PlatformDbContext.cs`, find this
line (in the "ESKİ/DİĞER TASK MODÜLÜ TABLOLARI" block, currently around line 132):

```csharp
        public DbSet<TaskTagAssignment> TaskTagAssignments { get; set; }
```

Add immediately after it:

```csharp
        public DbSet<TaskFeatureAssignment> TaskFeatureAssignments { get; set; }
```

Then find this block (currently around line 587-592):

```csharp
            builder.Entity<TaskTagAssignment>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskTagAssignments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasIndex(x => new { x.TaskId, x.TagId }).IsUnique();
            });
```

Add immediately after it:

```csharp
            builder.Entity<TaskFeatureAssignment>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskFeatureAssignments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.FeatureCode).IsRequired().HasMaxLength(64);
                b.HasIndex(x => new { x.TaskId, x.FeatureCode }).IsUnique();
            });
```

- [ ] **Step 3: Generate the migration via the EF CLI**

Run (from `src/Apya.Platform.EntityFrameworkCore/`):

```bash
dotnet ef migrations add Add_TaskFeatureAssignment --startup-project ../Apya.Platform.Web
```

Expected: a new `<timestamp>_Add_TaskFeatureAssignment.cs` + `.Designer.cs` pair is created
under `Migrations/`, and `PlatformDbContextModelSnapshot.cs` is updated. Open the generated
migration's `Up()` method and confirm it contains a `CreateTable(name: "AppTaskFeatureAssignments", ...)`
with exactly three columns (`Id` uuid PK, `TaskId` uuid not-null, `FeatureCode`
`character varying(64)` not-null) and a `CreateIndex(..., unique: true)` on `TaskId`+`FeatureCode`
— no `ExtraProperties`/`ConcurrencyStamp`/audit columns should appear (this entity is a bare
`Entity<Guid>`, same as the migration for `AppTaskTagAssignments` in
`Migrations/20260716131815_Add_TaskTags.cs`, which you should open for comparison). If the
generated migration contains anything unexpected (extra columns, wrong table name, missing
index), stop and report — do not hand-edit the generated files to "fix" a shape mismatch,
that means Step 1 or 2 was wrong and needs correcting instead.

- [ ] **Step 4: Verify no pending model changes**

Run (same directory):

```bash
dotnet ef migrations has-pending-model-changes --startup-project ../Apya.Platform.Web
```

Expected: `No changes detected` (or equivalent "no pending changes" message). This confirms
the migration you just generated fully captures the model change — a mismatch here means the
migration is incomplete/stale.

- [ ] **Step 5: Apply the migration to the local dev database**

Run (same directory):

```bash
dotnet ef database update --startup-project ../Apya.Platform.Web
```

Expected: applies cleanly, ends with the new migration listed as applied. This requires
PostgreSQL running locally (per this repo's `scripts/dev-up.ps1` / the `ayaga-kaldir` skill)
— if the DB isn't reachable, report BLOCKED with the connection error rather than skipping
this step, since Task 2's tests need the schema to exist... actually Task 2's EF Core tests
use their own **Sqlite in-memory** test database (created fresh per test run via ABP's test
module), NOT this local Postgres dev DB — so a failure at this exact step should not block
Task 2, but DOES need to be flagged, since the real dev Postgres DB will be out of sync with
the model until it's applied. If this step fails, report DONE_WITH_CONCERNS (not BLOCKED),
noting the migration was generated and verified but not applied to the local dev DB, and
why.

- [ ] **Step 6: `dotnet build` sanity check**

Run (from repo root):

```bash
dotnet build Apya.Platform.slnx --nologo -v q
```

Expected: `0 Hata` (0 errors) — same pre-existing NU1903/CS8618-style warnings as before are
fine, do not introduce new warnings/errors.

- [ ] **Step 7: Commit**

```bash
git add src/Apya.Platform.Domain/Tasks/TaskFeatureAssignment.cs \
        src/Apya.Platform.EntityFrameworkCore/EntityFrameworkCore/PlatformDbContext.cs \
        src/Apya.Platform.EntityFrameworkCore/Migrations/
git commit -m "feat: TaskFeatureAssignment entity ve migration ekle"
```

---

### Task 2: `ITaskAppService` feature methods + backend tests

**Files:**
- Modify: `src/Apya.Platform.Application.Contracts/Tasks/ITaskAppService.cs`
- Modify: `src/Apya.Platform.Application/Tasks/TaskAppService.cs`
- Create: `test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tasks/TaskAppService_FeatureAssignment_Tests.cs`

**Interfaces:**
- Consumes: `TaskFeatureAssignment` (Task 1) — the entity type, its constructor, and its EF
  registration must already exist and build cleanly.
- Produces: nothing further downstream in this plan — the frontend plan (written after this
  one is reviewed) will consume `GetFeatureAssignmentsAsync`/`AddFeatureAsync`/
  `RemoveFeatureAsync` via the ABP dynamic JS proxy (`window.apya.platform.tasks.task
  .getFeatureAssignments(taskId)` / `.addFeature(taskId, featureCode)` /
  `.removeFeature(taskId, featureCode)` — camelCase-minus-`Async`, same convention as every
  other method already on this proxy).

- [ ] **Step 1: Add the three methods to `ITaskAppService`**

In `src/Apya.Platform.Application.Contracts/Tasks/ITaskAppService.cs`, find this line:

```csharp
        Task UpdateStatusAsync(Guid id, Apya.Platform.Tasks.TaskStatus status);
```

Add immediately after it:

```csharp

        // Feature Registry (Faz 3)
        Task<List<string>> GetFeatureAssignmentsAsync(Guid taskId);
        Task AddFeatureAsync(Guid taskId, string featureCode);
        Task RemoveFeatureAsync(Guid taskId, string featureCode);
```

- [ ] **Step 2: Add the repository field and constructor parameter**

In `src/Apya.Platform.Application/Tasks/TaskAppService.cs`, find this line (currently around
line 34):

```csharp
        private readonly IRepository<TaskTagAssignment, Guid> _taskTagRepository;
```

Add immediately after it:

```csharp
        private readonly IRepository<TaskFeatureAssignment, Guid> _featureAssignmentRepository;
```

Then find the constructor (starts around line 37 with `public TaskAppService(`). Locate its
parameter list — find the parameter matching `_taskTagRepository`'s type
(`IRepository<TaskTagAssignment, Guid> taskTagRepository`) and the corresponding assignment
line (`_taskTagRepository = taskTagRepository;`). Add a new parameter
`IRepository<TaskFeatureAssignment, Guid> featureAssignmentRepository` immediately after it in
both the parameter list and the assignment body:

```csharp
            IRepository<TaskFeatureAssignment, Guid> featureAssignmentRepository,
```

```csharp
            _featureAssignmentRepository = featureAssignmentRepository;
```

Read the actual current constructor first — match its existing formatting/parameter-ordering
style exactly (trailing commas, indentation) rather than guessing.

- [ ] **Step 3: Implement the three methods**

Find the attachment methods section (search for `// --- 7. DOSYA METODLARI ---`, ends around
line 660-670 with the closing brace of `GetAttachmentsAsync`). Add a new section immediately
after it:

```csharp

        // --- 8. FEATURE REGISTRY METODLARI (Faz 3) ---
        public async Task<List<string>> GetFeatureAssignmentsAsync(Guid taskId)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

            var assignments = await _featureAssignmentRepository.GetListAsync(x => x.TaskId == taskId);
            return assignments.Select(x => x.FeatureCode).ToList();
        }

        public async Task AddFeatureAsync(Guid taskId, string featureCode)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

            var existing = await _featureAssignmentRepository.FirstOrDefaultAsync(
                x => x.TaskId == taskId && x.FeatureCode == featureCode);
            if (existing != null)
            {
                return; // idempotent — aynı feature'ı iki kez eklemek hata vermemeli
            }

            await _featureAssignmentRepository.InsertAsync(
                new TaskFeatureAssignment(GuidGenerator.Create(), taskId, featureCode),
                autoSave: true);
        }

        public async Task RemoveFeatureAsync(Guid taskId, string featureCode)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

            var assignment = await _featureAssignmentRepository.FirstOrDefaultAsync(
                x => x.TaskId == taskId && x.FeatureCode == featureCode);
            if (assignment != null)
            {
                await _featureAssignmentRepository.DeleteAsync(assignment, autoSave: true);
            }
        }
```

(`FirstOrDefaultAsync` is a standard `Volo.Abp.Domain.Repositories` extension method on
`IRepository<T, Guid>` — already used repeatedly elsewhere in this exact file, e.g.
`_timeLogRepository.FirstOrDefaultAsync(...)` at line ~702, so no new using directive should
be needed given the file's existing imports.)

- [ ] **Step 4: Write the tests**

```csharp
// test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tasks/TaskAppService_FeatureAssignment_Tests.cs
using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_FeatureAssignment_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAppService_FeatureAssignment_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateTaskInCurrentTenantAsync()
    {
        var task = new TaskItem(
            Guid.NewGuid(), "Feature assignment test görevi",
            tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task.Id;
    }

    private async Task<Guid> CreateTaskInTenantAsync(Guid tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            var task = new TaskItem(
                Guid.NewGuid(), "Diğer tenant görevi",
                tenantId: tenantId, now: DateTime.Now);
            await _taskRepository.InsertAsync(task, autoSave: true);
            return task.Id;
        }
    }

    [Fact]
    public async Task GetFeatureAssignmentsAsync_hicbir_feature_eklenmemis_gorevde_bos_liste_doner()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();

        var result = await _taskAppService.GetFeatureAssignmentsAsync(taskId);

        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task AddFeatureAsync_eklenen_feature_GetFeatureAssignmentsAsync_ile_gorunur()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();

        await _taskAppService.AddFeatureAsync(taskId, "finance");
        var result = await _taskAppService.GetFeatureAssignmentsAsync(taskId);

        result.ShouldContain("finance");
    }

    [Fact]
    public async Task AddFeatureAsync_ayni_feature_ikinci_kez_eklenirse_hata_vermez_ve_tekrarlanmaz()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();

        await _taskAppService.AddFeatureAsync(taskId, "finance");
        await _taskAppService.AddFeatureAsync(taskId, "finance");
        var result = await _taskAppService.GetFeatureAssignmentsAsync(taskId);

        result.ShouldBe(new[] { "finance" });
    }

    [Fact]
    public async Task RemoveFeatureAsync_eklenmis_feature_kaldirilinca_listede_gorunmez()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();
        await _taskAppService.AddFeatureAsync(taskId, "finance");

        await _taskAppService.RemoveFeatureAsync(taskId, "finance");
        var result = await _taskAppService.GetFeatureAssignmentsAsync(taskId);

        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task RemoveFeatureAsync_var_olmayan_feature_icin_hata_vermez()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();

        await Should.NotThrowAsync(async () =>
            await _taskAppService.RemoveFeatureAsync(taskId, "hic-eklenmemis-feature"));
    }

    [Fact]
    public async Task GetFeatureAssignmentsAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.GetFeatureAssignmentsAsync(taskId));
    }

    [Fact]
    public async Task AddFeatureAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.AddFeatureAsync(taskId, "finance"));
    }

    [Fact]
    public async Task RemoveFeatureAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.RemoveFeatureAsync(taskId, "finance"));
    }
}
```

Before writing this file, open `test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tasks/TaskAppService_Tenant_Tests.cs`
in full and confirm the base class name, namespace, and `GetRequiredService`/constructor
patterns above match it exactly — copy its conventions, don't guess.

- [ ] **Step 5: Run the new tests**

Run (from repo root):

```bash
dotnet test test/Apya.Platform.EntityFrameworkCore.Tests --filter "FullyQualifiedName~TaskAppService_FeatureAssignment_Tests"
```

Expected: 8/8 passing.

- [ ] **Step 6: Run the full backend test suite to confirm no regression**

Run (from repo root):

```bash
dotnet test
```

Expected: all pre-existing tests still pass (per this project's test-infra baseline, currently
214/214 before this change — your new 8 tests bring it to 222/222; report the exact final
count, don't assume the baseline number is still accurate without checking).

- [ ] **Step 7: `dotnet build` sanity check**

```bash
dotnet build Apya.Platform.slnx --nologo -v q
```

Expected: `0 Hata`.

- [ ] **Step 8: Commit**

```bash
git add src/Apya.Platform.Application.Contracts/Tasks/ITaskAppService.cs \
        src/Apya.Platform.Application/Tasks/TaskAppService.cs \
        test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tasks/TaskAppService_FeatureAssignment_Tests.cs
git commit -m "feat: gorev feature ekleme/kaldirma/listeleme AppService metotlari"
```
