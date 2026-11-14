using System;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Bir programın bir kurum parametresine koyduğu ölçüt: "eş finansman kapasitesi en az 100.000",
/// "kamu borcu = hayır". Grant'ın child'ı; katalogla birlikte host verisidir (TenantId null).
///
/// <para>Bir parametre, host onu bir programa ölçüt olarak ekleyene kadar hiçbir kurumun
/// uygunluğunu etkilemez — kontrollü devreye alma bu kaydın kendisidir.</para>
/// </summary>
public class GrantParameterCriterion : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantId { get; private set; }
    public Guid DefinitionId { get; private set; }
    public GrantParameterOperator Operator { get; private set; }

    public decimal? ValueNumber { get; private set; }
    public string? ValueText { get; private set; }
    public bool? ValueBool { get; private set; }

    /// <summary>true: tutmayan kurum ELENİR. false: yalnız uyarı; kova değişmez.</summary>
    public bool IsEliminating { get; private set; }

    protected GrantParameterCriterion() { }

    /// <summary>
    /// Ölçütü tanımın tipine göre doğrular. Serbest metin ve tarih karşılaştırılamaz; sistem
    /// parametrelerinin şartı programın kendi alanlarında (ölçek, TRL…) durur, burada tekrarlanmaz.
    /// </summary>
    public GrantParameterCriterion(
        Guid id,
        Guid grantId,
        FirmParameterDefinition definition,
        GrantParameterOperator @operator,
        decimal? number,
        string? text,
        bool? flag,
        bool isEliminating) : base(id)
    {
        if (definition.IsSystem)
        {
            throw Error(PlatformDomainErrorCodes.GrantCriterionNotSupported, definition);
        }

        GrantId = grantId;
        DefinitionId = definition.Id;
        Operator = @operator;
        IsEliminating = isEliminating;

        switch (definition.DataType)
        {
            case FirmParameterDataType.Number:
            case FirmParameterDataType.Money:
            case FirmParameterDataType.Percent:
                if (@operator == GrantParameterOperator.Icerir)
                {
                    throw Error(PlatformDomainErrorCodes.GrantCriterionOperatorInvalid, definition);
                }
                ValueNumber = number ?? throw Error(PlatformDomainErrorCodes.GrantCriterionValueRequired, definition);
                break;

            case FirmParameterDataType.Boolean:
                if (@operator != GrantParameterOperator.Esit)
                {
                    throw Error(PlatformDomainErrorCodes.GrantCriterionOperatorInvalid, definition);
                }
                ValueBool = flag ?? throw Error(PlatformDomainErrorCodes.GrantCriterionValueRequired, definition);
                break;

            case FirmParameterDataType.Select:
            case FirmParameterDataType.MultiSelect:
                var expected = definition.DataType == FirmParameterDataType.Select
                    ? GrantParameterOperator.Esit
                    : GrantParameterOperator.Icerir;
                if (@operator != expected)
                {
                    throw Error(PlatformDomainErrorCodes.GrantCriterionOperatorInvalid, definition);
                }
                var option = text?.Trim();
                if (string.IsNullOrEmpty(option) || !definition.GetOptions().Contains(option, StringComparer.Ordinal))
                {
                    throw Error(PlatformDomainErrorCodes.GrantCriterionValueRequired, definition);
                }
                ValueText = option;
                break;

            default:
                throw Error(PlatformDomainErrorCodes.GrantCriterionNotSupported, definition);
        }
    }

    /// <summary>Kurumun değerini ölçütle karşılaştırır. Değer yoksa ya da süresi dolmuşsa ÖLÇÜLEMEZ.</summary>
    public GrantRuleOutcome Evaluate(FirmSignalParameter? value)
    {
        if (value == null || value.IsStale)
        {
            return GrantRuleOutcome.Unknown;
        }

        bool? passed = Operator switch
        {
            GrantParameterOperator.EnAz => value.Number.HasValue ? value.Number >= ValueNumber : null,
            GrantParameterOperator.EnFazla => value.Number.HasValue ? value.Number <= ValueNumber : null,
            GrantParameterOperator.Icerir => value.Choices.Contains(ValueText, StringComparer.Ordinal),
            _ => ValueNumber.HasValue ? (value.Number.HasValue ? value.Number == ValueNumber : null)
                : ValueBool.HasValue ? (value.Bool.HasValue ? value.Bool == ValueBool : null)
                : value.Text != null ? string.Equals(value.Text, ValueText, StringComparison.Ordinal) : null
        };

        return passed switch
        {
            true => GrantRuleOutcome.Passed,
            false => GrantRuleOutcome.Failed,
            _ => GrantRuleOutcome.Unknown
        };
    }

    private static BusinessException Error(string code, FirmParameterDefinition definition)
        => new BusinessException(code).WithData("Name", definition.Name);
}
