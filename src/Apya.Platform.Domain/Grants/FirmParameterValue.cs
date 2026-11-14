using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>Yazılmak istenen değer. Tanımın tipine karşılık gelen alan doldurulur, diğerleri yok sayılır.</summary>
public sealed record FirmParameterInput(
    string? Text = null,
    decimal? Number = null,
    DateTime? Date = null,
    bool? Bool = null,
    IReadOnlyList<string>? Choices = null);

/// <summary>Değerin kökeni: nereden geldiği, doğrulanıp doğrulanmadığı ve belgeden geldiyse yeri.</summary>
public sealed record FirmParameterOrigin(
    FirmParameterSource Source,
    bool Verified = false,
    int? Confidence = null,
    Guid? DocumentFileId = null,
    int? Page = null,
    string? Excerpt = null)
{
    /// <summary>Kullanıcının elle girdiği, doğrulanmamış beyan.</summary>
    public static FirmParameterOrigin UserEntry { get; } = new(FirmParameterSource.Kullanici);
}

/// <summary>
/// Bir kurumun tek bir parametreye verdiği değer ve o değerin kökeni.
///
/// <para>🔴 EKSİK ile SIFIR ayrıdır: satır YOKSA bilgi bilinmiyordur; satır varsa değer
/// gerçekten girilmiştir ve 0 da, "hayır" da geçerli birer değerdir. Bu yüzden boş değerle
/// satır yazılamaz (<see cref="Set"/> reddeder) ve "bilmiyorum"a dönmek satırı silmektir
/// (<see cref="FirmParameterManager.ClearValueAsync"/>). Aynı sebeple yumuşak silme yoktur:
/// silinmiş bir satır "bilinmiyor" ile aynı anlama gelirdi.</para>
/// </summary>
public class FirmParameterValue : AuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid DefinitionId { get; private set; }

    public string? ValueText { get; private set; }
    public decimal? ValueNumber { get; private set; }
    public DateTime? ValueDate { get; private set; }
    public bool? ValueBool { get; private set; }

    public FirmParameterSource Source { get; private set; }

    public FirmParameterVerification Verification { get; private set; }

    /// <summary>Belgeden okunan değerde güven yüzdesi (0-100); diğer kaynaklarda null.</summary>
    public int? Confidence { get; private set; }

    /// <summary>Değerin okunduğu belge (Belge Merkezi). Belge silinse de değer kalır; bu yüzden FK yok.</summary>
    public Guid? SourceDocumentFileId { get; private set; }

    public int? SourcePage { get; private set; }

    public string? SourceExcerpt { get; private set; }

    /// <summary>
    /// Değerin girildiği ya da "hâlâ güncel" diye teyit edildiği son an. Güncellik bundan
    /// hesaplanır; denetim alanındaki son değişiklik zamanı teyidi göstermez.
    /// </summary>
    public DateTime ConfirmedAt { get; private set; }

    protected FirmParameterValue() { }

    public FirmParameterValue(
        Guid id,
        Guid? tenantId,
        FirmParameterDefinition definition,
        FirmParameterInput input,
        FirmParameterOrigin origin,
        DateTime now) : base(id)
    {
        TenantId = tenantId;
        DefinitionId = definition.Id;
        Set(definition, input, origin, now);
    }

    /// <summary>Değeri tanımın kurallarına göre doğrular ve kökeniyle birlikte yazar.</summary>
    public void Set(FirmParameterDefinition definition, FirmParameterInput input, FirmParameterOrigin origin, DateTime now)
    {
        if (definition.Id != DefinitionId)
        {
            throw new ArgumentException("Değer başka bir tanıma ait.", nameof(definition));
        }
        if (definition.IsSystem)
        {
            throw Error(PlatformDomainErrorCodes.FirmParameterSystemReadOnly, definition);
        }
        if (!definition.IsActive)
        {
            throw Error(PlatformDomainErrorCodes.FirmParameterInactive, definition);
        }
        if (!definition.AllowedSources.HasFlag(origin.Source))
        {
            throw Error(PlatformDomainErrorCodes.FirmParameterSourceNotAllowed, definition);
        }

        // Önce doğrula, sonra değiştir: yarım yazılmış satır kalmasın.
        string? text = null;
        decimal? number = null;
        DateTime? date = null;
        bool? flag = null;

        switch (definition.DataType)
        {
            case FirmParameterDataType.Text:
                text = RequireText(definition, input.Text, definition.MaxLength ?? FirmParameterConsts.MaxTextLength);
                break;
            case FirmParameterDataType.LongText:
                text = RequireText(definition, input.Text, definition.MaxLength ?? FirmParameterConsts.MaxLongTextLength);
                break;
            case FirmParameterDataType.Number:
            case FirmParameterDataType.Money:
                number = RequireNumber(definition, input.Number, definition.MinNumber, definition.MaxNumber);
                break;
            case FirmParameterDataType.Percent:
                number = RequireNumber(definition, input.Number, definition.MinNumber ?? 0m, definition.MaxNumber ?? 100m);
                break;
            case FirmParameterDataType.Date:
                date = (input.Date ?? throw Error(PlatformDomainErrorCodes.FirmParameterValueRequired, definition)).Date;
                break;
            case FirmParameterDataType.Boolean:
                flag = input.Bool ?? throw Error(PlatformDomainErrorCodes.FirmParameterValueRequired, definition);
                break;
            case FirmParameterDataType.Select:
                text = RequireOption(definition, input.Text);
                break;
            case FirmParameterDataType.MultiSelect:
                text = RequireChoices(definition, input.Choices);
                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(definition), definition.DataType, null);
        }

        ValueText = text;
        ValueNumber = number;
        ValueDate = date;
        ValueBool = flag;

        Source = origin.Source;
        Verification = origin.Verified ? FirmParameterVerification.Dogrulandi : FirmParameterVerification.Dogrulanmadi;
        Confidence = origin.Confidence.HasValue ? Math.Clamp(origin.Confidence.Value, 0, 100) : null;
        SourceDocumentFileId = origin.DocumentFileId;
        SourcePage = origin.Page is > 0 ? origin.Page : null;
        SourceExcerpt = Truncate(origin.Excerpt, FirmParameterConsts.MaxSourceExcerptLength);
        ConfirmedAt = now;
    }

    /// <summary>Değer değişmeden "hâlâ güncel" teyidi: yalnız güncellik saati ilerler.</summary>
    public void Confirm(DateTime now) => ConfirmedAt = now;

    /// <summary>MultiSelect değerinin seçimleri; diğer tiplerde boş liste.</summary>
    public IReadOnlyList<string> GetChoices(FirmParameterDefinition definition)
        => definition.DataType == FirmParameterDataType.MultiSelect
            ? FirmParameterJson.Read(ValueText)
            : Array.Empty<string>();

    /// <summary>Tanım bir geçerlilik süresi koymuşsa ve son teyit o süreyi aşmışsa değer güncel değildir.</summary>
    public bool IsStale(FirmParameterDefinition definition, DateTime today)
        => definition.ValidityMonths is { } months && ConfirmedAt.Date.AddMonths(months) < today.Date;

    /// <summary>
    /// Güvenilirlik saklanmaz, okunurken türetilir: güncellik zamanla değiştiği için saklanan
    /// bir seviye kendiliğinden bayatlardı. Süresi dolan değer kaynağı ne olursa olsun düşüktür.
    /// </summary>
    public FirmParameterReliability ReliabilityAt(FirmParameterDefinition definition, DateTime today)
    {
        if (IsStale(definition, today))
        {
            return FirmParameterReliability.Dusuk;
        }
        if (Verification == FirmParameterVerification.Dogrulandi)
        {
            return FirmParameterReliability.Yuksek;
        }
        return Source switch
        {
            FirmParameterSource.Sistem or FirmParameterSource.Hesaplama => FirmParameterReliability.Yuksek,
            FirmParameterSource.BelgeAi => (Confidence ?? 0) >= FirmParameterConsts.HighConfidenceThreshold
                ? FirmParameterReliability.Orta
                : FirmParameterReliability.Dusuk,
            _ => FirmParameterReliability.Orta
        };
    }

    private static string RequireText(FirmParameterDefinition definition, string? value, int maxLength)
    {
        var text = value?.Trim();
        if (string.IsNullOrEmpty(text))
        {
            throw Error(PlatformDomainErrorCodes.FirmParameterValueRequired, definition);
        }
        if (text.Length > maxLength)
        {
            throw Error(PlatformDomainErrorCodes.FirmParameterValueTooLong, definition).WithData("MaxLength", maxLength);
        }
        return text;
    }

    private static decimal RequireNumber(FirmParameterDefinition definition, decimal? value, decimal? min, decimal? max)
    {
        var number = value ?? throw Error(PlatformDomainErrorCodes.FirmParameterValueRequired, definition);
        if (number < min)
        {
            throw Error(PlatformDomainErrorCodes.FirmParameterValueBelowMin, definition).WithData("Min", min!.Value);
        }
        if (number > max)
        {
            throw Error(PlatformDomainErrorCodes.FirmParameterValueAboveMax, definition).WithData("Max", max!.Value);
        }
        return number;
    }

    private static string RequireOption(FirmParameterDefinition definition, string? value)
    {
        var option = value?.Trim();
        if (string.IsNullOrEmpty(option))
        {
            throw Error(PlatformDomainErrorCodes.FirmParameterValueRequired, definition);
        }
        if (!definition.GetOptions().Contains(option, StringComparer.Ordinal))
        {
            throw Error(PlatformDomainErrorCodes.FirmParameterOptionNotAllowed, definition).WithData("Value", option);
        }
        return option;
    }

    private static string RequireChoices(FirmParameterDefinition definition, IReadOnlyList<string>? values)
    {
        var choices = (values ?? Array.Empty<string>())
            .Where(v => !string.IsNullOrWhiteSpace(v))
            .Select(v => v.Trim())
            .Distinct(StringComparer.Ordinal)
            .ToList();
        if (choices.Count == 0)
        {
            throw Error(PlatformDomainErrorCodes.FirmParameterValueRequired, definition);
        }
        var options = definition.GetOptions();
        var unknown = choices.FirstOrDefault(c => !options.Contains(c, StringComparer.Ordinal));
        if (unknown != null)
        {
            throw Error(PlatformDomainErrorCodes.FirmParameterOptionNotAllowed, definition).WithData("Value", unknown);
        }
        var json = FirmParameterJson.Write(choices);
        if (json.Length > FirmParameterConsts.MaxLongTextLength)
        {
            throw Error(PlatformDomainErrorCodes.FirmParameterValueTooLong, definition)
                .WithData("MaxLength", FirmParameterConsts.MaxLongTextLength);
        }
        return json;
    }

    private static string? Truncate(string? value, int maxLength)
    {
        var text = value?.Trim();
        if (string.IsNullOrEmpty(text))
        {
            return null;
        }
        return text.Length > maxLength ? text[..maxLength] : text;
    }

    private static BusinessException Error(string code, FirmParameterDefinition definition)
        => new BusinessException(code).WithData("Name", definition.Name);
}
