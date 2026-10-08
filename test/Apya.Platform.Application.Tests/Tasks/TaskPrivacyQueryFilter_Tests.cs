using System;
using System.Linq;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.Tests.Application.Tasks;

/// <summary>
/// Görev GİZLİLİK kuralının (APYA-22) kendisi. Kural tek kaynakta yaşar ve görev okuyan her
/// yüzey onu çağırır; bu yüzden kuralın dalları burada, yüzeylerin onu çağırdığı ise kendi
/// testlerinde ölçülür.
///
/// <para>Entegrasyon barındırıcısı her izne "evet" dediği için "ekip yöneticisi DEĞİL" dalı
/// orada hiç koşmaz — kuralın sıradan kullanıcıya uygulandığı tek kanıt bu dosyadır.</para>
/// </summary>
public class TaskPrivacyQueryFilter_Tests
{
    private static readonly Guid Creator = Guid.NewGuid();
    private static readonly Guid Assignee = Guid.NewGuid();
    private static readonly Guid Stranger = Guid.NewGuid();

    private static TaskItem Task(string title, bool isPrivate)
    {
        var task = new TaskItem(
            Guid.NewGuid(), title,
            assigneeId: Assignee,
            isPrivate: isPrivate,
            now: new DateTime(2026, 10, 1));

        ObjectHelper.TrySetProperty(task, x => x.CreatorId, () => Creator);
        return task;
    }

    private static string[] Visible(Guid? userId, bool isImpersonated = false, bool canManageTeam = false)
    {
        var tasks = new[] { Task("açık", isPrivate: false), Task("gizli", isPrivate: true) }.AsQueryable();

        return TaskPrivacyQueryFilter.Apply(tasks, isImpersonated, canManageTeam, userId)
            .Select(t => t.Title)
            .ToArray();
    }

    [Fact]
    public void Ilgisiz_kullanici_gizli_gorevi_gormez()
    {
        Visible(Stranger).ShouldBe(new[] { "açık" });
    }

    [Fact]
    public void Olusturan_ve_atanan_gizli_gorevi_gorur()
    {
        Visible(Creator).ShouldBe(new[] { "açık", "gizli" });
        Visible(Assignee).ShouldBe(new[] { "açık", "gizli" });
    }

    [Fact]
    public void Ekip_yoneticisi_gizli_gorevi_gorur()
    {
        Visible(Stranger, canManageTeam: true).ShouldBe(new[] { "açık", "gizli" });
    }

    /// <summary>Bürünme oturumu hiçbir koşulda görmez: ne yetki ne sahiplik kapıyı açar.</summary>
    [Fact]
    public void Burunme_oturumu_gizli_gorevi_hicbir_kosulda_gormez()
    {
        Visible(Stranger, isImpersonated: true, canManageTeam: true).ShouldBe(new[] { "açık" });
        Visible(Creator, isImpersonated: true).ShouldBe(new[] { "açık" });
        Visible(Assignee, isImpersonated: true, canManageTeam: true).ShouldBe(new[] { "açık" });
    }

    /// <summary>Kimliksiz çağrı (null kullanıcı) oluşturanı olmayan gizli görevle EŞLEŞMEMELİ.</summary>
    [Fact]
    public void Kimliksiz_cagri_sahipsiz_gizli_gorevi_gormez()
    {
        var orphan = new TaskItem(Guid.NewGuid(), "sahipsiz gizli", isPrivate: true, now: new DateTime(2026, 10, 1));

        TaskPrivacyQueryFilter.Apply(new[] { orphan }.AsQueryable(), false, false, null)
            .ShouldBeEmpty();
    }
}
