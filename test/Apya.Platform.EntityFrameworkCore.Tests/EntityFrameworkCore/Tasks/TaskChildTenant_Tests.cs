using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// SEC-03 / DOC-06 · Görev yorumu ve eki kiracı sütunu taşır ve kiracıyı GÖREVDEN kopyalar.
///
/// <para>Tuzak: misafir paylaşım bağlantısı kiracı bağlamı OLMADAN çalışır. Kiracı geçerli
/// bağlamdan alınsaydı misafirin yorumu ve dosyası kiracısız doğar, kiracı süzgeci açıkken
/// ekibin gözünden kaybolurdu.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskChildTenant_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid TenantA = Guid.Parse("77770000-aaaa-4000-8000-000000000041");
    private static readonly GuestRequestContextDto NoContext = new();

    private readonly ITaskShareAppService _shareAppService;
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskComment, Guid> _commentRepository;
    private readonly IRepository<TaskAttachment, Guid> _attachmentRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public TaskChildTenant_Tests()
    {
        _shareAppService = GetRequiredService<ITaskShareAppService>();
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _commentRepository = GetRequiredService<IRepository<TaskComment, Guid>>();
        _attachmentRepository = GetRequiredService<IRepository<TaskAttachment, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _mtFilter = GetRequiredService<IDataFilter<IMultiTenant>>();
    }

    /// <summary>Kiracı A'da görev + paylaşım bağlantısı; token döner.</summary>
    private async Task<(Guid TaskId, string Token)> ShareTenantTaskAsync()
    {
        using (_currentTenant.Change(TenantA))
        {
            var task = new TaskItem(Guid.NewGuid(), "Paylaşılan görev", tenantId: TenantA, now: DateTime.Now);
            await _taskRepository.InsertAsync(task, autoSave: true);

            var link = await _shareAppService.CreateAsync(new CreateTaskShareLinkDto
            {
                TaskId = task.Id,
                RecipientName = "Misafir",
                LifetimeDays = 7,
                AllowComment = true,
                AllowUpload = true,
                AllowDownload = true
            });

            return (task.Id, link.Url.Split('/').Last());
        }
    }

    [Fact]
    public async Task Misafirin_yorumu_gorevin_kiracisini_tasir_ve_ekibe_gorunur()
    {
        var (taskId, token) = await ShareTenantTaskAsync();

        // Misafir: kiracı bağlamı YOK.
        _currentTenant.Id.ShouldBeNull();
        await _shareAppService.AddGuestCommentAsync(token, taskId, "Taslağı gönderdim", NoContext);

        using (_mtFilter.Disable())
        {
            (await _commentRepository.GetListAsync(c => c.TaskId == taskId))
                .ShouldHaveSingleItem().TenantId.ShouldBe(TenantA);
        }

        // Ekip kendi kiracı bağlamında, süzgeç AÇIKKEN görür.
        using (_currentTenant.Change(TenantA))
        {
            (await _commentRepository.GetListAsync(c => c.TaskId == taskId)).Count.ShouldBe(1);
        }
    }

    [Fact]
    public async Task Misafirin_dosyasi_gorevin_kiracisini_tasir_ve_ekibe_gorunur()
    {
        var (taskId, token) = await ShareTenantTaskAsync();

        _currentTenant.Id.ShouldBeNull();
        await _shareAppService.RegisterGuestUploadAsync(
            token, taskId, "tasarim.png", Guid.NewGuid() + ".png", 4096, NoContext);

        using (_mtFilter.Disable())
        {
            (await _attachmentRepository.GetListAsync(a => a.TaskId == taskId))
                .ShouldHaveSingleItem().TenantId.ShouldBe(TenantA);
        }

        using (_currentTenant.Change(TenantA))
        {
            (await _taskAppService.GetAttachmentsAsync(taskId)).ShouldContain(a => a.FileName == "tasarim.png");
        }
    }

    [Fact]
    public async Task Ekibin_yorumu_ve_yaniti_gorevin_kiracisini_tasir()
    {
        var (taskId, _) = await ShareTenantTaskAsync();

        using (_currentTenant.Change(TenantA))
        {
            var commentId = await _taskAppService.AddCommentAsync(taskId, "İç not");
            await _taskAppService.ReplyToCommentAsync(commentId, "Yanıt");

            var comments = await _commentRepository.GetListAsync(c => c.TaskId == taskId);
            comments.Count.ShouldBe(2);
            comments.ShouldAllBe(c => c.TenantId == TenantA);
        }
    }

    /// <summary>Başka kiracı, süzgeç açıkken bu görevin yorumlarını kimliği bilse de okuyamaz.</summary>
    [Fact]
    public async Task Baska_kiraci_gorevin_yorumlarini_depodan_okuyamaz()
    {
        var (taskId, token) = await ShareTenantTaskAsync();
        await _shareAppService.AddGuestCommentAsync(token, taskId, "Gizli kalmalı", NoContext);

        using (_currentTenant.Change(Guid.Parse("88880000-bbbb-4000-8000-000000000042")))
        {
            (await _commentRepository.GetListAsync(c => c.TaskId == taskId)).ShouldBeEmpty();
        }
    }

    /// <summary>
    /// <c>TaskAttachment</c> nesne başlatıcıyla kurulur; kiracıyı unutmak derleme hatası vermez.
    /// Üretim kodundaki her kurulum <c>TenantId</c> atamalıdır.
    /// </summary>
    [Fact]
    public void Her_gorev_eki_kurulumu_kiraciyi_atar()
    {
        var src = Path.Combine(RepoRoot(), "src");
        var offenders = Directory.EnumerateFiles(src, "*.cs", SearchOption.AllDirectories)
            .Where(f => !f.Contains(Path.DirectorySeparatorChar + "bin" + Path.DirectorySeparatorChar)
                        && !f.Contains(Path.DirectorySeparatorChar + "obj" + Path.DirectorySeparatorChar)
                        && !f.Contains(Path.DirectorySeparatorChar + "Migrations" + Path.DirectorySeparatorChar))
            .SelectMany(f => Regex.Matches(File.ReadAllText(f), @"new TaskAttachment\s*\{[^}]*\}")
                .Where(m => !m.Value.Contains("TenantId"))
                .Select(_ => Path.GetRelativePath(src, f)))
            .ToList();

        offenders.ShouldBeEmpty();
    }

    private static string RepoRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            if (Directory.Exists(Path.Combine(dir.FullName, "src", "Apya.Platform.Domain")))
            {
                return dir.FullName;
            }

            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException("Depo kökü bulunamadı.");
    }
}
