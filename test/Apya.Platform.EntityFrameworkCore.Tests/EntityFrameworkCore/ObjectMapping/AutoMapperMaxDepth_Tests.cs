using System;
using System.Linq;
using Apya.Platform.Tasks;
using AutoMapper;
using AutoMapper.Internal;
using Shouldly;
using Volo.Abp.ObjectMapping;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.ObjectMapping;

/// <summary>
/// SÖZLEŞME: hiçbir AutoMapper eşlemesi sınırsız derinlikte özyineleme yapamaz.
///
/// <para>CVE-2026-32933 (GHSA-rvv3-g6hj-g44x): AutoMapper iç içe geçmiş nesne grafiğini derinlik
/// sınırı olmadan eşler; yeterince derin bir grafik yığını taşırır ve süreç yakalanamaz biçimde
/// çöker. AutoMapper 14.x'e yama yok, ABP 10.0.2 de 15+'ı kaldırmaz. Bizdeki gerçek yüzey görev
/// ağacı: <c>TaskItem.SubTasks → TaskDto.SubTasks</c> kullanıcı verisiyle derinleşebilir ve görev
/// oluşturmada derinlik sınırı yoktur. <c>PlatformApplicationModule</c> bu yüzden bütün eşlemelere
/// MaxDepth koyar (ABP >= 10.2'nin <c>DefaultMaxDepth</c>'i ile aynı davranış). Derleme bu
/// ayarın işlediğini göstermez; yalnız bu testler gösterir. Bkz. Directory.Build.props.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class AutoMapperMaxDepth_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const int MaxDepth = 64;

    [Fact]
    public void Hicbir_esleme_sinirsiz_derinlikte_degildir()
    {
        var typeMaps = GetRequiredService<IConfigurationProvider>().Internal().GetAllTypeMaps();

        typeMaps.ShouldNotBeEmpty();
        typeMaps
            .Where(x => x.MaxDepth == 0 || x.MaxDepth > MaxDepth)
            .Select(x => $"{x.SourceType.Name} -> {x.DestinationType.Name}")
            .ShouldBeEmpty();
    }

    [Fact]
    public void Cok_derin_alt_gorev_zinciri_sinirda_kesilir()
    {
        var root = BuildSubTaskChain(500); // sınırsız olsa 500 düzey iner

        var dto = GetRequiredService<IObjectMapper>().Map<TaskItem, TaskDto>(root);

        NestingDepth(dto).ShouldBeLessThanOrEqualTo(MaxDepth);
        NestingDepth(dto).ShouldBeGreaterThan(3); // sığ kısım yine eşlenir
    }

    [Fact]
    public void Siradan_alt_gorev_agaci_kesilmeden_eslenir()
    {
        var root = NewTask("kök");
        foreach (var child in new[] { NewTask("a", root), NewTask("b", root) })
        {
            root.SubTasks.Add(child);
            child.SubTasks.Add(NewTask(child.Title + "1", child));
            child.SubTasks.Add(NewTask(child.Title + "2", child));
        }

        var dto = GetRequiredService<IObjectMapper>().Map<TaskItem, TaskDto>(root);

        CountNodes(dto).ShouldBe(7);
        NestingDepth(dto).ShouldBe(3);
    }

    private static TaskItem NewTask(string title, TaskItem? parent = null)
        => new(Guid.NewGuid(), title, parentTaskId: parent?.Id, now: DateTime.UtcNow);

    private static TaskItem BuildSubTaskChain(int depth)
    {
        var root = NewTask("kök");
        var current = root;
        for (var i = 1; i < depth; i++)
        {
            var child = NewTask("alt " + i, current);
            current.SubTasks.Add(child);
            current = child;
        }

        return root;
    }

    /// <summary>Tek çocuklu zincirde kök dahil kaç düzey var (kesilen yerde çocuk boş ya da null olur).</summary>
    private static int NestingDepth(TaskDto? dto)
    {
        var depth = 0;
        for (var current = dto; current != null; current = current.SubTasks?.FirstOrDefault())
        {
            depth++;
        }

        return depth;
    }

    private static int CountNodes(TaskDto dto)
        => 1 + dto.SubTasks.Sum(CountNodes);
}
