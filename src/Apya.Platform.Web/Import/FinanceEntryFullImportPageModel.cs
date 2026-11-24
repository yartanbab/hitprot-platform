using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Tasks;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Web.Import;

/// <summary>
/// Gider ve gelir aktarımı. Kimliksiz satır her yüklemede yeni kayıt açtığı için aynı dosya iki kez
/// yüklenince kasa iki kez işlenirdi: kiracıda başlığı, günü, tutarı, para birimi ve kasası aynı olan
/// yeni satır, veritabanında ya da dosyada tekrar ediyorsa reddedilir.
/// </summary>
public abstract class FinanceEntryFullImportPageModel<TCategory>
    : FinanceFullImportPageModel<FinanceEntry<TCategory>, FinanceEntry<TCategory>>
    where TCategory : struct, Enum
{
    /// <summary>(kiracı, gün) → o günün kayıt imzaları (veritabanı + bu dosya).</summary>
    private readonly Dictionary<(Guid Tenant, DateTime Day), HashSet<(string Title, decimal Amount, string Currency, Guid? Account)>> _seen = [];

    protected FinanceEntryFullImportPageModel(ITaskAppService taskAppService, IProjectBudgetAppService budgetAppService,
        ITenantRepository tenantRepository)
        : base(taskAppService, budgetAppService, tenantRepository)
    {
    }

    /// <summary>Geçerli kiracının kayıtları; gün verilirse yalnız o günün.</summary>
    protected abstract Task<IReadOnlyList<FinanceEntry<TCategory>>> GetEntriesAsync(DateTime? day);

    protected sealed override Task<IReadOnlyList<FinanceEntry<TCategory>>> GetRecordsAsync() => GetEntriesAsync(null);

    protected static DateTime? EndOfDay(DateTime? day) => day?.AddDays(1).AddTicks(-1);

    private protected override async Task ValidateNewAsync(ImportRow row, FinanceEntry<TCategory> input,
        FinanceTenantScope<FinanceEntry<TCategory>> scope)
    {
        if (row.Errors.Count > 0)
        {
            return;
        }

        // Çıktı 10.000 kayıtta kesilir: karşılaştırma kapsamdaki listeden değil, günün kayıtlarından yapılır.
        var tenantId = scope.Context.TenantId;
        var key = (tenantId ?? Guid.Empty, input.Date.Date);
        if (!_seen.TryGetValue(key, out var seen))
        {
            using (CurrentTenant.Change(tenantId))
            {
                seen = (await GetEntriesAsync(input.Date.Date)).Select(Signature).ToHashSet();
            }

            _seen[key] = seen;
        }

        if (!seen.Add(Signature(input)))
        {
            row.Errors.Add(L["Import:Error:FinanceDuplicate"]);
        }
    }

    private static (string Title, decimal Amount, string Currency, Guid? Account) Signature(FinanceEntry<TCategory> entry)
        => (ExcelImport.Normalize(entry.Title), entry.Amount, entry.Currency.ToUpperInvariant(), entry.CashAccountId);
}
