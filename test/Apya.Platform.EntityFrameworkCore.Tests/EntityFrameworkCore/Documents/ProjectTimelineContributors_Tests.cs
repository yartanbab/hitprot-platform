using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Documents;

/// <summary>
/// 🔴 S4 · Raporun "Ekip katkısı" bölümünün kaynağı. Kapasite kutusu toplam saati
/// zaten gösteriyordu; eksik olan KİŞİ kırılımıydı ve bölüm bu yüzden boş basılıyordu.
///
/// <para>Kırılım toplamla aynı kayıtlardan çıkar: ikinci bir sorgu ve ikinci bir
/// "toplam" üretmemeli, yoksa rapor kendi içinde çelişir.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectTimelineContributors_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectTimelineAppService _timeline;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskTimeLog, Guid> _timeLogRepository;
    private readonly IIdentityUserRepository _userRepository;

    public ProjectTimelineContributors_Tests()
    {
        _timeline = GetRequiredService<IProjectTimelineAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _timeLogRepository = GetRequiredService<IRepository<TaskTimeLog, Guid>>();
        _userRepository = GetRequiredService<IIdentityUserRepository>();
    }

    private async Task<Guid> CreateUserAsync(string userName, string? name = null, string? surname = null)
    {
        var user = new IdentityUser(Guid.NewGuid(), userName, userName + "@apya.test");
        if (name != null) { user.Name = name; }
        if (surname != null) { user.Surname = surname; }
        await _userRepository.InsertAsync(user, autoSave: true);
        return user.Id;
    }

    private async Task LogTimeAsync(Guid taskId, Guid userId, long seconds)
    {
        var log = new TaskTimeLog(Guid.NewGuid(), taskId, userId, DateTime.Today)
        {
            SecondsSpent = seconds
        };
        await _timeLogRepository.InsertAsync(log, autoSave: true);
    }

    [Fact]
    public async Task Kisi_bazinda_saat_pay_ve_gorev_sayisi_cikariliyor()
    {
        var project = new Project(Guid.NewGuid(), null, null, "Katkı Projesi", "PRJ-C1", "açıklama");
        await _projectRepository.InsertAsync(project, autoSave: true);

        var taskA = new TaskItem(Guid.NewGuid(), "Analiz", project.Id, now: DateTime.Now);
        var taskB = new TaskItem(Guid.NewGuid(), "Kurulum", project.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(taskA, autoSave: true);
        await _taskRepository.InsertAsync(taskB, autoSave: true);

        var ayse = await CreateUserAsync("katki-ayse-" + Guid.NewGuid().ToString("N")[..6], "Ayşe", "Yılmaz");
        var veli = await CreateUserAsync("katki-veli-" + Guid.NewGuid().ToString("N")[..6]);

        // Ayşe iki ayrı görevde 6 saat, Veli tek görevde 2 saat → 8 saat, %75 / %25.
        await LogTimeAsync(taskA.Id, ayse, 4 * 3600);
        await LogTimeAsync(taskB.Id, ayse, 2 * 3600);
        await LogTimeAsync(taskA.Id, veli, 2 * 3600);

        var dto = await _timeline.GetAsync(project.Id);

        dto.Capacity.LoggedHours.ShouldBe(8m);
        dto.Capacity.Contributors.Count.ShouldBe(2);

        // En çok katkı veren başta.
        var first = dto.Capacity.Contributors[0];
        first.UserName.ShouldBe("Ayşe Yılmaz", "ad+soyad varsa kullanıcı adı değil o gösterilir");
        first.LoggedHours.ShouldBe(6m);
        first.SharePercent.ShouldBe(75);
        first.TaskCount.ShouldBe(2, "farklı görev sayısı");
        first.LoggedPersonDays.ShouldBe(0.8m, 0.05m);

        var second = dto.Capacity.Contributors[1];
        second.LoggedHours.ShouldBe(2m);
        second.SharePercent.ShouldBe(25);
        second.TaskCount.ShouldBe(1);

        // 🔴 Kırılımın toplamı kapasitedeki toplamla TUTMALI; rapor iki rakam gösteriyor.
        dto.Capacity.Contributors.Sum(c => c.LoggedHours).ShouldBe(dto.Capacity.LoggedHours);
    }

    [Fact]
    public async Task Zaman_kaydi_yoksa_katki_listesi_bos()
    {
        var project = new Project(Guid.NewGuid(), null, null, "Kayıtsız Proje", "PRJ-C2", "açıklama");
        await _projectRepository.InsertAsync(project, autoSave: true);
        await _taskRepository.InsertAsync(
            new TaskItem(Guid.NewGuid(), "Kayıtsız görev", project.Id, now: DateTime.Now), autoSave: true);

        var dto = await _timeline.GetAsync(project.Id);

        dto.Capacity.LoggedHours.ShouldBe(0m);
        dto.Capacity.Contributors.ShouldBeEmpty();
    }

    /// <summary>
    /// Kullanıcı kaydı çözülemezse satır DÜŞMEZ: saat projede harcanmıştır ve
    /// kırılımın toplamı toplamla tutmalı. Düşerse rapor sessizce eksik gösterir.
    /// </summary>
    [Fact]
    public async Task Adi_cozulemeyen_kullanicinin_saati_kayboluyor_degil_etiketleniyor()
    {
        var project = new Project(Guid.NewGuid(), null, null, "Ayrılan Projesi", "PRJ-C3", "açıklama");
        await _projectRepository.InsertAsync(project, autoSave: true);
        var task = new TaskItem(Guid.NewGuid(), "Devralınan iş", project.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);

        await LogTimeAsync(task.Id, Guid.NewGuid(), 3 * 3600);

        var dto = await _timeline.GetAsync(project.Id);

        dto.Capacity.Contributors.Count.ShouldBe(1);
        dto.Capacity.Contributors[0].LoggedHours.ShouldBe(3m);
        dto.Capacity.Contributors[0].UserName.ShouldNotBeNullOrWhiteSpace();
        dto.Capacity.Contributors.Sum(c => c.LoggedHours).ShouldBe(dto.Capacity.LoggedHours);
    }
}
