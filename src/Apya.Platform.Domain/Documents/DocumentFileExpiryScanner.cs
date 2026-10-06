using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// 🔴 DOC-05 / NTF-07 · Geçerlilik tarihi yaklaşan ya da yeni dolmuş belgeleri bulur ve
/// her biri için duyurulacak olayı kurar.
///
/// <para>Tarama worker'dan AYRI: worker'ı testten elle çağırmak tuzaklı, tarama ise düz bir
/// servis olarak doğrudan ölçülebilir (proje bitiş hatırlatmasıyla aynı kalıp).</para>
///
/// <para>Tekillik BURADA sağlanmaz: aynı belge her turda yeniden döner. "Eşik başına bir
/// kez" kuralı bildirim tarafında, tekillik anahtarıyla uygulanır.</para>
/// </summary>
public class DocumentFileExpiryScanner : ITransientDependency
{
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public DocumentFileExpiryScanner(
        IRepository<DocumentFile, Guid> fileRepository,
        IRepository<ProjectMember, Guid> memberRepository,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _fileRepository = fileRepository;
        _memberRepository = memberRepository;
        _mtFilter = mtFilter;
    }

    /// <summary>Bir belgenin taraması: hangi kiracıda yayınlanacağı + olayın kendisi.</summary>
    public sealed record Result(Guid? TenantId, DocumentFileExpiryEto Event);

    public async Task<List<Result>> ScanAsync(DateTime now)
    {
        var today = now.Date;
        var from = today.AddDays(-DocumentFileExpiryReminder.ExpiredGraceDays);
        var until = today.AddDays(DocumentFileExpiryReminder.MaxThreshold + 1);

        // Belgeler kiracılara dağınık: OKUMA için filtre bilinçli kapatılır.
        using (_mtFilter.Disable())
        {
            var files = await _fileRepository.GetListAsync(
                f => f.ExpiryDate != null && f.ExpiryDate >= from && f.ExpiryDate < until);

            if (files.Count == 0)
            {
                return new List<Result>();
            }

            var projectIds = files.Where(f => f.ProjectId.HasValue).Select(f => f.ProjectId!.Value).Distinct().ToList();

            var leadsByProject = projectIds.Count == 0
                ? new Dictionary<Guid, List<Guid>>()
                : (await _memberRepository.GetListAsync(
                        m => projectIds.Contains(m.ProjectId) && m.Role == ProjectMemberRole.Lead))
                    .GroupBy(m => m.ProjectId)
                    .ToDictionary(g => g.Key, g => g.Select(m => m.UserId).ToList());

            var results = new List<Result>();

            foreach (var file in files)
            {
                var daysRemaining = DocumentFileExpiryReminder.DaysRemaining(file.ExpiryDate!.Value, now);
                var threshold = DocumentFileExpiryReminder.PickThreshold(daysRemaining);

                if (threshold == null)
                {
                    continue;
                }

                // Alıcı: belgeyi yükleyen + (belge projeye bağlıysa) proje liderleri.
                var recipients = new List<Guid>();
                if (file.CreatorId.HasValue)
                {
                    recipients.Add(file.CreatorId.Value);
                }

                if (file.ProjectId.HasValue && leadsByProject.TryGetValue(file.ProjectId.Value, out var leads))
                {
                    recipients.AddRange(leads);
                }

                results.Add(new Result(file.TenantId, new DocumentFileExpiryEto
                {
                    DocumentFileId = file.Id,
                    DocumentId = file.DocumentId,
                    DisplayName = file.DisplayName,
                    ExpiryDate = file.ExpiryDate.Value,
                    DaysRemaining = daysRemaining,
                    Threshold = threshold.Value,
                    RecipientIds = recipients.Where(id => id != Guid.Empty).Distinct().ToList(),
                }));
            }

            return results;
        }
    }
}
