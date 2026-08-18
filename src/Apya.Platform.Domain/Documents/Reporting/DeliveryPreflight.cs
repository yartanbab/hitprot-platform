using System;
using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.Documents;

/// <summary>Preflight'ta pakete konan belgenin kontrol edilebilir özeti.</summary>
public sealed record PreflightDocument(
    Guid Id,
    string DisplayName,
    DateTime? ExpiryDate,
    int MissingRequiredFieldCount,
    bool HasConfidentialField);

/// <summary>Tek bir preflight bulgusu.</summary>
public sealed record PreflightIssue(
    PreflightIssueKind Kind,
    bool IsBlocking,
    string Message,
    Guid? DocumentFileId = null);

/// <summary>
/// Preflight sonucu. <see cref="CanGenerate"/> false ise "Paketi üret" KAPALI olmalı —
/// bloke bulgular kullanıcı tarafından geçilemez.
/// </summary>
public sealed record PreflightResult(IReadOnlyList<PreflightIssue> Issues)
{
    public bool CanGenerate => Issues.All(i => !i.IsBlocking);
    public int BlockingCount => Issues.Count(i => i.IsBlocking);
    public int WarningCount => Issues.Count(i => !i.IsBlocking);
}

/// <summary>
/// Teslim paketi üretilmeden önceki son kontrol.
///
/// Bloke EDEN (üretimi durduran) durumlar:
///   - pakette hiç kalem yok,
///   - kurum kontrol listesinde eksik + bloke işaretli kalem var,
///   - pakete süresi DOLMUŞ belge konmuş,
///   - pakete zorunlu meta alanı boş belge konmuş.
/// Yalnızca UYARAN durum:
///   - dış alıcıya giden pakette maskeli/gizli alan taşıyan belge var
///     (kullanıcı bilerek gönderebilir — maskeleme Faz D'de uygulanacak).
///
/// Saf fonksiyon: veri erişimi yok, doğrudan test edilir.
/// </summary>
public static class DeliveryPreflight
{
    public static PreflightResult Evaluate(
        IReadOnlyList<PreflightDocument> documents,
        int blockingComplianceMissingCount,
        IReadOnlyList<string> blockingComplianceTitles,
        bool isExternalRecipient,
        DateTime now)
    {
        var issues = new List<PreflightIssue>();

        if (documents.Count == 0)
        {
            issues.Add(new PreflightIssue(
                PreflightIssueKind.EmptyPackage, true, "Pakette hiç belge yok."));
        }

        if (blockingComplianceMissingCount > 0)
        {
            // Kalem adları listelenir: kullanıcı neyi yükleyeceğini görmeden düzeltemez.
            foreach (var title in blockingComplianceTitles.Take(10))
            {
                issues.Add(new PreflightIssue(
                    PreflightIssueKind.BlockingComplianceItem, true, $"Zorunlu kalem eksik: {title}"));
            }

            var remaining = blockingComplianceMissingCount - Math.Min(10, blockingComplianceTitles.Count);
            if (remaining > 0)
            {
                issues.Add(new PreflightIssue(
                    PreflightIssueKind.BlockingComplianceItem, true, $"ve {remaining} zorunlu kalem daha eksik."));
            }
        }

        foreach (var document in documents)
        {
            if (document.ExpiryDate.HasValue && document.ExpiryDate.Value <= now)
            {
                issues.Add(new PreflightIssue(
                    PreflightIssueKind.ExpiredDocument, true,
                    $"Süresi dolmuş belge: {document.DisplayName}", document.Id));
            }

            if (document.MissingRequiredFieldCount > 0)
            {
                issues.Add(new PreflightIssue(
                    PreflightIssueKind.MissingRequiredField, true,
                    $"{document.DisplayName}: {document.MissingRequiredFieldCount} zorunlu alan boş", document.Id));
            }

            if (isExternalRecipient && document.HasConfidentialField)
            {
                issues.Add(new PreflightIssue(
                    PreflightIssueKind.MaskedFieldWarning, false,
                    $"{document.DisplayName} gizli alan taşıyor — dış alıcıya gidiyor.", document.Id));
            }
        }

        return new PreflightResult(issues);
    }

    /// <summary>
    /// Ek numaralarını sıraya göre yeniden atar (EK-1…EK-n).
    /// Numara SIRADAN türetilir; kullanıcı sırayı değiştirdiğinde numaralar da kayar.
    /// </summary>
    public static void AssignAnnexNumbers(IEnumerable<DeliveryPackageItem> items)
    {
        var index = 0;
        foreach (var item in items.OrderBy(i => i.Order))
        {
            index++;
            item.SetOrder(index);
            item.AssignAnnexNumber(index);
        }
    }
}
