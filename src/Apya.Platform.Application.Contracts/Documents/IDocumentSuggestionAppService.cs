using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// Sınıflandırma önerileri.
///
/// Öneriler SAKLANMAZ; kural motorunun planı ile harcama eşleşme skorlarından
/// her okumada üretilir. Otomatik uygulama YOKTUR — 100 puanlık bir öneri bile
/// kullanıcı onayı ister; otomatik davranmak isteyen kullanıcı kuralı açar.
/// </summary>
public interface IDocumentSuggestionAppService : IApplicationService
{
    /// <summary>Onay bekleyen öneriler; reddedilenler dışarıda bırakılır.</summary>
    Task<DocumentSuggestionSummaryDto> GetPendingAsync(Guid? projectId = null);

    /// <summary>Seçilen önerileri uygular ve uygulanan sayısını döner.</summary>
    Task<int> ApplyAsync(ApplyDocumentSuggestionsDto input);

    /// <summary>Önerileri reddeder — aynı hedef bir daha önerilmez.</summary>
    Task DismissAsync(ApplyDocumentSuggestionsDto input);
}
