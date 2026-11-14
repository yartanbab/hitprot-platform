using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>Bir programın kurum parametrelerine koyduğu ölçütler ve eklenebilecek parametreler.</summary>
public class GrantParameterCriteriaDto
{
    public Guid GrantId { get; set; }
    public string GrantName { get; set; } = null!;

    /// <summary>Destek oranı %100'ün altındaysa eş finansman şartı kendiliğinden uygulanır; ekranda bilgi olarak gösterilir.</summary>
    public int? CoFinancingRatePercent { get; set; }

    public List<GrantParameterCriterionDto> Criteria { get; set; } = new();

    /// <summary>Ölçüt konabilecek parametreler: sayı, evet/hayır ve seçimli tipteki kullanıcı parametreleri.</summary>
    public List<GrantCriterionParameterDto> Parameters { get; set; } = new();
}

public class GrantParameterCriterionDto
{
    public Guid Id { get; set; }
    public Guid DefinitionId { get; set; }
    public string ParameterName { get; set; } = null!;
    public FirmParameterDataType DataType { get; set; }
    public GrantParameterOperator Operator { get; set; }

    /// <summary>Kültürden bağımsız yazım: sayı "1234.5", evet/hayır "true"/"false", seçenek olduğu gibi.</summary>
    public string Value { get; set; } = null!;

    public bool IsEliminating { get; set; }
}

public class GrantCriterionParameterDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public FirmParameterDataType DataType { get; set; }
    public List<string> Options { get; set; } = new();
}

public class AddGrantParameterCriterionDto
{
    public Guid GrantId { get; set; }
    public Guid DefinitionId { get; set; }
    public GrantParameterOperator Operator { get; set; } = GrantParameterOperator.EnAz;

    /// <summary>Kültürden bağımsız yazım; tanımın tipine göre okunur.</summary>
    public string? Value { get; set; }

    public bool IsEliminating { get; set; } = true;
}

/// <summary>Çağrı detayındaki uygunluk tablosunun parametreye bağlı satırı.</summary>
public class GrantParameterRuleCheckDto
{
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public FirmParameterDataType DataType { get; set; }
    public GrantRuleOutcome Outcome { get; set; }

    /// <summary>false: tutmasa da kurumu elemez, yalnız uyarıdır.</summary>
    public bool IsEliminating { get; set; }

    /// <summary>Kurumun değeri var ama geçerlilik süresi dolmuş.</summary>
    public bool IsStale { get; set; }

    public string? FirmValue { get; set; }

    /// <summary>null: şart programın kendi alanından türemiştir (eş finansman).</summary>
    public GrantParameterOperator? Operator { get; set; }

    public string? GrantValue { get; set; }
}
