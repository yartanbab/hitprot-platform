using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Grants;

/// <summary>
/// Kurum parametresinin TANIMI: kurum hakkında tutulabilecek bir bilginin adı, tipi,
/// doğrulama kuralı, geçerlilik süresi ve hibe eşleştirmesindeki rolü. Yeni parametre
/// eklemek veri eklemektir, kod değişikliği gerektirmez.
///
/// <para>Katalog HOST'a aittir ve bilerek <c>IMultiTenant</c> DEĞİLDİR: her kurum aynı
/// tanımı okur, kiracı süzgecini kapatmaya gerek kalmaz. Kuruma ait olan değerdir
/// (<see cref="FirmParameterValue"/>).</para>
///
/// <para><see cref="SystemKey"/> dolu tanımların değeri bu altyapıda saklanmaz; platformun
/// mevcut alanında yaşar (bkz. <see cref="FirmParameterSystemKey"/>).</para>
/// </summary>
public class FirmParameterDefinition : FullAuditedAggregateRoot<Guid>
{
    /// <summary>Makine anahtarı. Canlı tanımlar arasında benzersiz; oluşturulduktan sonra değişmez.</summary>
    public string Code { get; private set; } = null!;

    public string Name { get; private set; } = null!;

    /// <summary>Bilginin neden istendiği; eksik veri uyarısında kuruma gösterilir.</summary>
    public string? Description { get; private set; }

    /// <summary>Oluşturulduktan sonra DEĞİŞMEZ: girilmiş değerler bu tipe göre saklanmıştır.</summary>
    public FirmParameterDataType DataType { get; private set; }

    public FirmParameterGroup Group { get; set; }

    public FirmParameterRequirement Requirement { get; set; }

    public FirmParameterAudience Audience { get; set; }

    /// <summary>Değerin hangi kaynaklardan dolabileceği (bit maskesi).</summary>
    public FirmParameterSource AllowedSources { get; set; }

    /// <summary>Değerin kaç ay güncel sayılacağı. null = süresiz.</summary>
    public int? ValidityMonths { get; private set; }

    public decimal? MinNumber { get; private set; }
    public decimal? MaxNumber { get; private set; }
    public int? MaxLength { get; private set; }

    /// <summary>Select / MultiSelect seçenekleri (JSON dizi). Diğer tiplerde null.</summary>
    public string? OptionsJson { get; private set; }

    public FirmParameterMatchUsage MatchUsage { get; private set; }

    /// <summary>
    /// Eşleştirmedeki rol her değiştiğinde artar. Eşleştirme sonucunu etkileyen bir
    /// değişikliğin hangi sürümde yapıldığı böyle izlenir.
    /// </summary>
    public int Version { get; private set; } = 1;

    /// <summary>Kullanımdan kaldırılan tanım: girilmiş değerler durur, yenisi girilemez.</summary>
    public bool IsActive { get; set; } = true;

    public int Order { get; set; }

    public FirmParameterSystemKey? SystemKey { get; private set; }

    public bool IsSystem => SystemKey.HasValue;

    protected FirmParameterDefinition() { }

    public FirmParameterDefinition(
        Guid id,
        string code,
        string name,
        FirmParameterDataType dataType,
        FirmParameterGroup group,
        FirmParameterSystemKey? systemKey = null) : base(id)
    {
        Code = NormalizeCode(code);
        DataType = dataType;
        Group = group;
        SystemKey = systemKey;
        AllowedSources = FirmParameterSource.Kullanici;
        SetText(name, null);
    }

    public void SetText(string name, string? description)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), FirmParameterConsts.MaxNameLength).Trim();
        Description = string.IsNullOrWhiteSpace(description)
            ? null
            : Check.Length(description.Trim(), nameof(description), FirmParameterConsts.MaxDescriptionLength);
    }

    /// <summary>null = süresiz. Sıfır ya da negatif ay anlamsızdır.</summary>
    public void SetValidity(int? months)
    {
        if (months is <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(months));
        }
        ValidityMonths = months;
    }

    /// <summary>Sayı tipleri (Number, Money, Percent) için alt ve üst sınır.</summary>
    public void SetNumberRange(decimal? min, decimal? max)
    {
        if (min > max)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmParameterRangeInverted);
        }
        MinNumber = min;
        MaxNumber = max;
    }

    /// <summary>Metin tipleri için üst sınır; kolon sınırını aşamaz.</summary>
    public void SetMaxLength(int? maxLength)
    {
        if (maxLength is <= 0 or > FirmParameterConsts.MaxLongTextLength)
        {
            throw new ArgumentOutOfRangeException(nameof(maxLength));
        }
        MaxLength = maxLength;
    }

    /// <summary>Select / MultiSelect seçenekleri. Boş ve yinelenen seçenek elenir; hiç kalmazsa reddedilir.</summary>
    public void SetOptions(IEnumerable<string> options)
    {
        var cleaned = options
            .Where(o => !string.IsNullOrWhiteSpace(o))
            .Select(o => o.Trim())
            .Distinct(StringComparer.Ordinal)
            .ToList();
        if (cleaned.Count == 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmParameterOptionsRequired);
        }
        OptionsJson = Check.Length(
            FirmParameterJson.Write(cleaned), nameof(options), FirmParameterConsts.MaxOptionsJsonLength);
    }

    public IReadOnlyList<string> GetOptions() => FirmParameterJson.Read(OptionsJson);

    public void SetMatchUsage(FirmParameterMatchUsage usage)
    {
        if (MatchUsage == usage)
        {
            return;
        }
        MatchUsage = usage;
        Version++;
    }

    /// <summary>Parametre bu kurum türü için anlamlı mı? Anlamsızsa "eksik" de sayılmaz.</summary>
    public bool AppliesTo(OrganizationType type) => Audience switch
    {
        FirmParameterAudience.YalnizSirket => !type.IsNgo(),
        FirmParameterAudience.YalnizStk => type.IsNgo(),
        _ => true
    };

    /// <summary>
    /// Kod küçük ASCII harf, rakam ve alt çizgiden oluşur, harfle başlar. Türkçe harf
    /// bilerek reddedilir: <c>ToLowerInvariant</c> büyük 'İ'yi küçültmez ve aynı kod iki
    /// ayrı anahtar gibi görünürdü.
    /// </summary>
    private static string NormalizeCode(string code)
    {
        var value = (code ?? string.Empty).Trim();
        var valid = value.Length is > 0 and <= FirmParameterConsts.MaxCodeLength
                    && value[0] is >= 'a' and <= 'z'
                    && value.All(c => c is (>= 'a' and <= 'z') or (>= '0' and <= '9') or '_');
        if (!valid)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmParameterCodeInvalid);
        }
        return value;
    }
}
