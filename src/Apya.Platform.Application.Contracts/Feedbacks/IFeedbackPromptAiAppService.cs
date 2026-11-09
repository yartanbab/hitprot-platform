using System;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Geri bildirimden üretilen geliştirme prompt'una yapay zekâ ön analizi ekler.
/// Uygulaması AI modülündedir (çekirdek AI modülüne bağımlı değildir).
/// <para>
/// Metin değil kayıt kimliği alır: servis otomatik API'ye açık olduğundan modele
/// gidecek veriyi kendisi, beyaz listeyle kurar — genel amaçlı model ucu olmaz.
/// </para>
/// </summary>
public interface IFeedbackPromptAiAppService : IApplicationService
{
    Task<FeedbackPromptAnalysisDto> AnalyzeAsync(Guid id, bool includeInternalNotes);
}
