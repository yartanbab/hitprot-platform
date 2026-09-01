namespace Apya.Platform.Grants;

/// <summary>1a · Bir kaynak tarama koşusunun sonucu.</summary>
public enum GrantScrapeRunStatus
{
    Basarili = 0,
    Hatali = 1,

    /// <summary>Kazıyıcı bağlı değil ya da kaynağın adresi tanımsız — koşu hiç yapılmadı.</summary>
    Atlandi = 2
}
