using System;
using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.Documents;

/// <summary>Maskeleme kararı verilirken alan hakkında bilinmesi gerekenler.</summary>
public sealed record MaskableField(
    Guid FieldId,
    Guid DocumentTypeId,
    DocumentFieldVisibility DefaultVisibility);

/// <summary>
/// Alan bazlı görünürlüğün TEK karar noktası.
///
/// Aynı mantık üç yerde kullanılır: belge detayı, teslim paketi çıktısı ve
/// denetçi görünümü. Tek yerde toplanmasının sebebi tam da bu — maskelemenin
/// ekranda uygulanıp PDF'te unutulması, en kolay yapılan ve en pahalı hatadır.
///
/// Saf fonksiyon: veri erişimi yok, doğrudan test edilir.
/// </summary>
public static class DocumentFieldMasker
{
    /// <summary>
    /// Bir alanın verilen roller için etkin seviyesi.
    ///
    /// Çözümleme sırası:
    ///   1) Alan bazlı kural (en özel) — kullanıcının rollerinden EN AZ kısıtlayıcısı kazanır.
    ///   2) Yoksa tip bazlı kural (FieldId = null) — yine en az kısıtlayıcı.
    ///   3) Hiç kural yoksa alanın kendi varsayılan görünürlüğü.
    ///
    /// Roller arasında en AZ kısıtlayıcının kazanması bilinçli: roller yetki
    /// VERİR. Tersi olsaydı, kısıtlı bir rol eklemek yöneticiyi kendi verisinden
    /// kilitlerdi. Kısıtlama zincirin dikey halkalarında (alan &gt; tip &gt; varsayılan)
    /// uygulanır, roller arasında değil.
    /// </summary>
    public static DocumentFieldAccessLevel ResolveLevel(
        MaskableField field,
        IReadOnlyCollection<string> userRoles,
        IReadOnlyCollection<DocumentFieldPermission> permissions)
    {
        var applicable = permissions
            .Where(p => p.DocumentTypeId == field.DocumentTypeId)
            .Where(p => userRoles.Contains(p.RoleName, StringComparer.OrdinalIgnoreCase))
            .ToList();

        var fieldLevel = applicable
            .Where(p => p.FieldId == field.FieldId)
            .Select(p => (DocumentFieldAccessLevel?)p.Level)
            .Min();

        if (fieldLevel.HasValue)
        {
            return fieldLevel.Value;
        }

        var typeLevel = applicable
            .Where(p => p.FieldId == null)
            .Select(p => (DocumentFieldAccessLevel?)p.Level)
            .Min();

        if (typeLevel.HasValue)
        {
            return typeLevel.Value;
        }

        return FromVisibility(field.DefaultVisibility);
    }

    /// <summary>Kural yokken alanın kendi varsayılanı devreye girer.</summary>
    public static DocumentFieldAccessLevel FromVisibility(DocumentFieldVisibility visibility) => visibility switch
    {
        DocumentFieldVisibility.Everyone => DocumentFieldAccessLevel.Edit,
        DocumentFieldVisibility.Restricted => DocumentFieldAccessLevel.View,
        DocumentFieldVisibility.Confidential => DocumentFieldAccessLevel.Masked,
        _ => DocumentFieldAccessLevel.Masked,
    };

    public static bool IsVisible(DocumentFieldAccessLevel level) => level != DocumentFieldAccessLevel.Hidden;

    public static bool IsEditable(DocumentFieldAccessLevel level) => level == DocumentFieldAccessLevel.Edit;

    public static bool IsMasked(DocumentFieldAccessLevel level) => level == DocumentFieldAccessLevel.Masked;

    /// <summary>
    /// Maskeli gösterim metni. Değerin KENDİSİ değil, biçimi korunur
    /// (32.450,00 → ••.•••,••) — alanın dolu olduğu görünsün ama içeriği gitmesin.
    /// </summary>
    public static string MaskDisplay(string? original)
    {
        if (string.IsNullOrEmpty(original))
        {
            return string.Empty;
        }

        return new string(original.Select(c => char.IsLetterOrDigit(c) ? '•' : c).ToArray());
    }
}
