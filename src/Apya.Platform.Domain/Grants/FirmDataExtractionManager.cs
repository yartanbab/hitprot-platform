using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// Belgeden okunan önerilerin kuralları: hangi parametreler sorulur, yapay zekânın yanıtından
/// hangi öneriler kabul edilir, onaylanan öneri kurum verisine nasıl yazılır.
/// </summary>
public class FirmDataExtractionManager : DomainService
{
    private static readonly Regex Whitespace = new(@"\s+", RegexOptions.Compiled);

    /// <summary>Alıntının sayfada aranan baş kısmı: model uzun alıntıyı sonda kısaltabilir.</summary>
    private const int ExcerptProbeLength = 60;

    private readonly FirmParameterManager _parameterManager;
    private readonly IRepository<FirmParameterDefinition, Guid> _definitionRepository;

    public FirmDataExtractionManager(
        FirmParameterManager parameterManager,
        IRepository<FirmParameterDefinition, Guid> definitionRepository)
    {
        _parameterManager = parameterManager;
        _definitionRepository = definitionRepository;
    }

    /// <summary>
    /// Belgeden sorulabilecek parametreler: canlı, değeri burada yaşayan (sistem değil), belgeden
    /// okunmasına izin verilen ve kurumun türüne uyan tanımlar. Türü bilinmeyen kurumdan gizlenmez.
    /// </summary>
    public static List<FirmParameterDefinition> SelectCandidates(
        IEnumerable<FirmParameterDefinition> definitions, OrganizationType? organizationType)
        => definitions
            .Where(d => d.IsActive && !d.IsSystem && d.AllowedSources.HasFlag(FirmParameterSource.BelgeAi))
            .Where(d => organizationType == null || d.AppliesTo(organizationType.Value))
            .OrderBy(d => d.Group).ThenBy(d => d.Order).ThenBy(d => d.Name)
            .ToList();

    /// <summary>
    /// Yapay zekânın yanıtını önerilere çevirip okumayı bitirir. Yanıta güvenilmez: aday listesinde
    /// olmayan parametre, tanımın kuralına uymayan değer (tip, sınır, seçenek) sessizce atılır;
    /// parametre başına tek öneri (en emin olan) kalır. Sayfa, alıntının geçtiği sayfayla düzeltilir.
    /// </summary>
    public void Complete(
        FirmDataExtraction extraction,
        IReadOnlyList<FirmParameterDefinition> candidates,
        IReadOnlyList<FirmDocumentPage> pages,
        IEnumerable<FirmDataProposal> proposals,
        int? pageCount,
        bool isTruncated)
    {
        var byCode = candidates.ToDictionary(d => d.Code, StringComparer.OrdinalIgnoreCase);
        var suggestions = new List<FirmDataSuggestion>();

        foreach (var group in proposals
                     .Where(p => !string.IsNullOrWhiteSpace(p.Code) && byCode.ContainsKey(p.Code.Trim()))
                     .GroupBy(p => byCode[p.Code.Trim()]))
        {
            foreach (var proposal in group.OrderByDescending(p => p.Confidence))
            {
                var raw = Normalize(group.Key, proposal.RawValue);
                if (raw == null)
                {
                    continue;
                }

                suggestions.Add(new FirmDataSuggestion(
                    GuidGenerator.Create(), extraction.Id, group.Key.Id, raw, proposal.Confidence,
                    ResolvePage(pages, proposal, pageCount), proposal.Excerpt));
                break;
            }
        }

        extraction.Complete(suggestions, pageCount, isTruncated);
    }

    /// <summary>
    /// Öneriyi onaylar ve kurum verisine yazar (varsa mevcut değerin üzerine). Düzenlenmeden
    /// onaylanan değerin kaynağı "belgeden okundu"dur, güveniyle ve "doğrulandı" olarak; düzenlenen değer
    /// kurumun kendi beyanıdır. İkisinde de belge, sayfa ve alıntı kanıt olarak saklanır.
    /// </summary>
    public async Task<FirmParameterValue> AcceptAsync(
        FirmDataExtraction extraction, Guid suggestionId, string? editedRawValue, Guid? userId)
    {
        var suggestion = extraction.GetSuggestion(suggestionId);
        if (suggestion.Status != FirmDataSuggestionStatus.Beklemede)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmDataSuggestionAlreadyDecided);
        }

        var definition = await _definitionRepository.GetAsync(suggestion.DefinitionId);
        var edited = editedRawValue != null && Normalize(definition, editedRawValue) != suggestion.RawValue;
        var raw = edited ? editedRawValue : suggestion.RawValue;
        var input = FirmParameterRawValue.Parse(definition, raw)
                    ?? throw new BusinessException(PlatformDomainErrorCodes.FirmParameterValueRequired).WithData("Name", definition.Name);

        var source = edited && definition.AllowedSources.HasFlag(FirmParameterSource.Kullanici)
            ? FirmParameterSource.Kullanici
            : FirmParameterSource.BelgeAi;
        // Düzenlenmeden onaylanan okuma "doğrulandı"dır: kurum belgedeki değeri gördü ve kabul etti.
        // Aksi halde Kurumsal Veriler onaylanmış değerin yanında "Doğrulanmadı" gösterirdi.
        var origin = new FirmParameterOrigin(
            source,
            Verified: source == FirmParameterSource.BelgeAi,
            Confidence: source == FirmParameterSource.BelgeAi ? suggestion.Confidence : null,
            DocumentFileId: extraction.DocumentFileId,
            Page: suggestion.Page,
            Excerpt: suggestion.Excerpt);

        var value = await _parameterManager.SetValueAsync(definition.Id, input, origin);
        suggestion.Accept(FirmParameterRawValue.Format(definition, value) ?? raw!, edited, userId, Clock.Now);
        return value;
    }

    public void Reject(FirmDataExtraction extraction, Guid suggestionId, Guid? userId)
        => extraction.GetSuggestion(suggestionId).Reject(userId, Clock.Now);

    /// <summary>Değeri tanımın kurallarıyla sınar ve saklanacak biçimine çevirir; uymuyorsa null.</summary>
    private string? Normalize(FirmParameterDefinition definition, string? raw)
    {
        try
        {
            var input = FirmParameterRawValue.Parse(definition, raw);
            if (input == null)
            {
                return null;
            }
            var probe = new FirmParameterValue(Guid.Empty, null, definition, input, new FirmParameterOrigin(FirmParameterSource.BelgeAi), Clock.Now);
            return FirmParameterRawValue.Format(definition, probe);
        }
        catch (BusinessException)
        {
            return null;
        }
    }

    /// <summary>
    /// Alıntının geçtiği sayfa; bulunamazsa modelin söylediği sayfa (belgenin sınırları içindeyse).
    /// Model sayfa numarasını sıkça kaydırır; kanıt yanlış sayfayı göstermesin.
    /// </summary>
    private static int? ResolvePage(IReadOnlyList<FirmDocumentPage> pages, FirmDataProposal proposal, int? pageCount)
    {
        // Word belgesinde sayfa yok: modelin uydurduğu numara saklanmaz.
        if (pages.All(p => p.Number == null))
        {
            return null;
        }

        var probe = Flatten(proposal.Excerpt);
        if (probe.Length > 0)
        {
            if (probe.Length > ExcerptProbeLength)
            {
                probe = probe[..ExcerptProbeLength];
            }
            var hit = pages.FirstOrDefault(p => p.Number != null && Flatten(p.Text).Contains(probe, StringComparison.OrdinalIgnoreCase));
            if (hit != null)
            {
                return hit.Number;
            }
        }

        return proposal.Page is > 0 && (pageCount == null || proposal.Page <= pageCount) ? proposal.Page : null;
    }

    private static string Flatten(string? text)
        => string.IsNullOrWhiteSpace(text) ? string.Empty : Whitespace.Replace(text, " ").Trim();
}
