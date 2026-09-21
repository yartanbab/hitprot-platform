using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Storage;

/// <summary>
/// <c>/file/get/{fileName}</c> ucunun sahiplik kapısı (SEC-00 denetimi, bulgu SEC-05).
///
/// <para>Uç daha önce yalnız kimlik doğruluyordu: dosyanın hangi kiracıya ait olduğu hiç
/// sorulmadığı için, adı bir kez görmüş herhangi bir kullanıcı — BAŞKA BİR KİRACIDAN olsa
/// bile — dosyayı indirebiliyordu. Depolama tek düz klasör olduğundan yol üzerinden
/// izolasyon da mümkün değil; karar bu yüzden veritabanından veriliyor.</para>
///
/// <para>Kapsam bilinçli olarak dar: yalnız <c>/file/get</c> ile SUNULAN dört kaynak.
/// Belge ekleri, hibe evrakı sürümleri, teslim paketleri ve abonelik faturaları aynı
/// klasörde durur ama kendi yetkili sayfa handler'larından servis edilir — onlar bu uçtan
/// artık 404 alır, bu istenen sonuçtur.</para>
/// </summary>
public interface IUploadedFileAccessChecker
{
    /// <summary>Geçerli kullanıcı bu dosyayı okuyabilir mi?</summary>
    Task<bool> CanReadAsync(string fileName);
}

public class UploadedFileAccessChecker : IUploadedFileAccessChecker, ITransientDependency
{
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectAttachment, Guid> _projectAttachmentRepository;
    private readonly IRepository<TaskAttachment, Guid> _taskAttachmentRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter _dataFilter;
    private readonly IAsyncQueryableExecuter _asyncExecuter;

    public UploadedFileAccessChecker(
        IRepository<Grant, Guid> grantRepository,
        IRepository<Project, Guid> projectRepository,
        IRepository<ProjectAttachment, Guid> projectAttachmentRepository,
        IRepository<TaskAttachment, Guid> taskAttachmentRepository,
        IRepository<TaskItem, Guid> taskRepository,
        ICurrentTenant currentTenant,
        IDataFilter dataFilter,
        IAsyncQueryableExecuter asyncExecuter)
    {
        _grantRepository = grantRepository;
        _projectRepository = projectRepository;
        _projectAttachmentRepository = projectAttachmentRepository;
        _taskAttachmentRepository = taskAttachmentRepository;
        _taskRepository = taskRepository;
        _currentTenant = currentTenant;
        _dataFilter = dataFilter;
        _asyncExecuter = asyncExecuter;
    }

    public async Task<bool> CanReadAsync(string fileName)
    {
        var safeName = Path.GetFileName(fileName);
        if (string.IsNullOrWhiteSpace(safeName))
        {
            return false;
        }

        var currentTenantId = _currentTenant.Id;

        // Kiracı süzgeci KAPALI: açık olsaydı host katalog satırı kiracı bağlamında,
        // kiracı satırı da host bağlamında hiç görünmez ve karar veremezdik. Sahiplik
        // kararını sorgu değil aşağıdaki karşılaştırmalar veriyor.
        using (_dataFilter.Disable<IMultiTenant>())
        {
            // 1) Hibe afişi — katalog HOST verisidir (TenantId = null) ve kiracılara
            //    bilerek sunulur (öneri akışı kartlarının zemini).
            var posterOwners = await OwnersAsync(
                (await _grantRepository.GetQueryableAsync())
                    .Where(x => x.PosterFileName == safeName)
                    .Select(x => x.TenantId));

            if (posterOwners.Any(owner => owner == null))
            {
                return true;
            }

            if (Allows(posterOwners, currentTenantId))
            {
                return true;
            }

            // 2) Proje kapak görseli
            var projectOwners = await OwnersAsync(
                (await _projectRepository.GetQueryableAsync())
                    .Where(x => x.CoverImageFileName == safeName)
                    .Select(x => x.TenantId));

            if (Allows(projectOwners, currentTenantId))
            {
                return true;
            }

            // 3) Proje eki
            var attachmentOwners = await OwnersAsync(
                (await _projectAttachmentRepository.GetQueryableAsync())
                    .Where(x => x.StoredFileName == safeName)
                    .Select(x => x.TenantId));

            if (Allows(attachmentOwners, currentTenantId))
            {
                return true;
            }

            // 4) Görev eki — AppTaskAttachments'ta TenantId KOLONU YOK; kiracı yalnız
            //    göreve join ile çözülür. Şemayı değiştirmek çift migration isterdi.
            var taskAttachments = await _taskAttachmentRepository.GetQueryableAsync();
            var tasks = await _taskRepository.GetQueryableAsync();
            var taskOwners = await OwnersAsync(
                from attachment in taskAttachments
                join task in tasks on attachment.TaskId equals task.Id
                where attachment.StoredFileName == safeName
                select task.TenantId);

            return Allows(taskOwners, currentTenantId);
        }
    }

    /// <summary>
    /// Aynı fiziksel dosya birden çok satırdan referanslanabilir (görev kopyalama aynı
    /// adı yeniden kullanır), bu yüzden karar "tek satır bul" değil "en az biri açık mı".
    /// </summary>
    private static bool Allows(IReadOnlyCollection<Guid?> owners, Guid? currentTenantId)
    {
        if (owners.Count == 0)
        {
            return false;
        }

        // Host, kiracı verisine zaten erişebiliyor (bkz. ProjectAppService.GetAccessibleProjectAsync).
        return currentTenantId == null || owners.Any(owner => owner == currentTenantId);
    }

    private async Task<IReadOnlyCollection<Guid?>> OwnersAsync(IQueryable<Guid?> query)
    {
        return await _asyncExecuter.ToListAsync(query);
    }
}
