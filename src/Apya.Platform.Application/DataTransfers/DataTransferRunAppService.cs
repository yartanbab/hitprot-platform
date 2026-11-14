using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.DataTransfers.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;

namespace Apya.Platform.DataTransfers;

/// <summary>
/// İşlem geçmişini okur. Kiracı süzgeci açık kalır: herkes yalnız kendi tarafının kayıtlarını görür.
/// </summary>
[Authorize]
public class DataTransferRunAppService : PlatformAppService, IDataTransferRunAppService
{
    private readonly IRepository<DataTransferRun, Guid> _runRepository;
    private readonly IIdentityUserRepository _userRepository;

    public DataTransferRunAppService(
        IRepository<DataTransferRun, Guid> runRepository,
        IIdentityUserRepository userRepository)
    {
        _runRepository = runRepository;
        _userRepository = userRepository;
    }

    public async Task<PagedResultDto<DataTransferRunDto>> GetListAsync(PagedResultRequestDto input)
    {
        var query = await _runRepository.GetQueryableAsync();
        var total = await AsyncExecuter.CountAsync(query);
        var runs = await AsyncExecuter.ToListAsync(query
            .OrderByDescending(r => r.CreationTime)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount));

        var creatorIds = runs.Where(r => r.CreatorId.HasValue).Select(r => r.CreatorId!.Value).Distinct().ToList();
        var names = creatorIds.Count == 0
            ? []
            : (await _userRepository.GetListByIdsAsync(creatorIds)).ToDictionary(
                u => u.Id,
                u => string.IsNullOrWhiteSpace(u.Name) ? u.UserName : $"{u.Name} {u.Surname}".Trim());

        var items = runs.Select(r =>
        {
            var dto = ObjectMapper.Map<DataTransferRun, DataTransferRunDto>(r);
            dto.CreatorName = r.CreatorId.HasValue && names.TryGetValue(r.CreatorId.Value, out var name) ? name : null;
            return dto;
        }).ToList();

        return new PagedResultDto<DataTransferRunDto>(total, items);
    }
}

/// <summary>
/// İşlem geçmişine kayıt yazar. Aktarımın kendi işleminden AYRI iş biriminde çalışır: geri alınan
/// bir içe aktarmanın kaydı da kalır. Kayıt yazılamazsa aktarım bozulmaz — hata yalnız loglanır.
/// </summary>
public class DataTransferRunRecorder : ITransientDependency
{
    private readonly IRepository<DataTransferRun, Guid> _runRepository;
    private readonly IUnitOfWorkManager _unitOfWorkManager;
    private readonly IGuidGenerator _guidGenerator;
    private readonly ICurrentTenant _currentTenant;
    private readonly ILogger<DataTransferRunRecorder> _logger;

    public DataTransferRunRecorder(
        IRepository<DataTransferRun, Guid> runRepository,
        IUnitOfWorkManager unitOfWorkManager,
        IGuidGenerator guidGenerator,
        ICurrentTenant currentTenant,
        ILogger<DataTransferRunRecorder> logger)
    {
        _runRepository = runRepository;
        _unitOfWorkManager = unitOfWorkManager;
        _guidGenerator = guidGenerator;
        _currentTenant = currentTenant;
        _logger = logger;
    }

    public async Task RecordAsync(RecordDataTransferRunDto input)
    {
        try
        {
            Check.NotNull(DataTransferModules.Find(input.ModuleKey), nameof(input.ModuleKey));

            using var uow = _unitOfWorkManager.Begin(requiresNew: true);
            await _runRepository.InsertAsync(new DataTransferRun(
                _guidGenerator.Create(), _currentTenant.Id, input.ModuleKey, input.Direction, input.Succeeded,
                input.DurationMs, input.Format, input.FileName, input.TotalRows, input.SucceededRows,
                input.FailedRows, input.Message, input.TemplateId, input.TemplateVersion));
            await uow.CompleteAsync();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Aktarım geçmişi yazılamadı: {Module} {Direction}", input.ModuleKey, input.Direction);
        }
    }
}
