namespace Apya.Platform.Documents;

public static class RuleConsts
{
    public const int MaxRuleNameLength = 128;
    public const int MaxDescriptionLength = 300;
    public const int MaxCompareValueLength = 200;
    public const int MaxActionPayloadLength = 400;

    /// <summary>Bir kuralda en fazla koşul/eylem — kuru çalıştırmayı öngörülebilir tutar.</summary>
    public const int MaxConditions = 10;
    public const int MaxActions = 5;

    /// <summary>Tek çalıştırmada dokunulabilecek en fazla belge — kaza eseri toplu değişiklik koruması.</summary>
    public const int MaxAffectedPerRun = 500;

    public const int MaxRoleNameLength = 64;
}
