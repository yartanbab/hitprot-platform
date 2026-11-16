using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.Json;
using Volo.Abp;

namespace Apya.Platform.Grants;

/// <summary>
/// Kurum parametresi değerinin metin biçimi — belgeden okunan öneri bu biçimde saklanır ve
/// onay ekranında düzenlenir. Kültürden bağımsızdır: sayı "150000.5", tarih "2026-03-31",
/// evet/hayır "true"/"false", çoklu seçim JSON dizisi; diğer tipler metnin kendisi.
/// </summary>
public static class FirmParameterRawValue
{
    public const string DateFormat = "yyyy-MM-dd";

    /// <summary>
    /// Ham değeri tanımın tipine çevirir. Boşsa null; okunamıyorsa
    /// <see cref="PlatformDomainErrorCodes.FirmParameterValueInvalid"/>. Sınır ve seçenek
    /// denetimini <see cref="FirmParameterValue.Set"/> yapar.
    /// </summary>
    public static FirmParameterInput? Parse(FirmParameterDefinition definition, string? raw)
    {
        var text = raw?.Trim();
        if (string.IsNullOrEmpty(text))
        {
            return null;
        }

        switch (definition.DataType)
        {
            case FirmParameterDataType.Number:
            case FirmParameterDataType.Money:
            case FirmParameterDataType.Percent:
                return decimal.TryParse(text, NumberStyles.Number & ~NumberStyles.AllowThousands, CultureInfo.InvariantCulture, out var number)
                    ? new FirmParameterInput(Number: number)
                    : throw Invalid(definition);
            case FirmParameterDataType.Date:
                return DateTime.TryParseExact(text, DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
                    ? new FirmParameterInput(Date: date)
                    : throw Invalid(definition);
            case FirmParameterDataType.Boolean:
                return bool.TryParse(text, out var flag)
                    ? new FirmParameterInput(Bool: flag)
                    : throw Invalid(definition);
            case FirmParameterDataType.MultiSelect:
                IReadOnlyList<string> choices;
                try
                {
                    choices = FirmParameterJson.Read(text);
                }
                catch (JsonException)
                {
                    throw Invalid(definition);
                }
                return choices.Count == 0 ? throw Invalid(definition) : new FirmParameterInput(Choices: choices);
            default:
                return new FirmParameterInput(Text: text);
        }
    }

    public static string? Format(FirmParameterDefinition definition, FirmParameterValue value) => definition.DataType switch
    {
        FirmParameterDataType.Number or FirmParameterDataType.Money or FirmParameterDataType.Percent
            => value.ValueNumber?.ToString("0.##", CultureInfo.InvariantCulture),
        FirmParameterDataType.Date => value.ValueDate?.ToString(DateFormat, CultureInfo.InvariantCulture),
        FirmParameterDataType.Boolean => value.ValueBool?.ToString().ToLowerInvariant(),
        _ => value.ValueText
    };

    private static BusinessException Invalid(FirmParameterDefinition definition)
        => new BusinessException(PlatformDomainErrorCodes.FirmParameterValueInvalid).WithData("Name", definition.Name);
}
