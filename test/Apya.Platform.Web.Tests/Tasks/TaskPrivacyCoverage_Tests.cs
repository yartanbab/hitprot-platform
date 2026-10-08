using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// SÖZLEŞME: görev deposunu DOĞRUDAN okuyan her dosya, gizli görev kuralı (APYA-22) hakkında
/// bilinçli bir karar taşır — ya kuralı uygular ya da aşağıdaki listede GEREKÇESİYLE muaftır.
///
/// <para>Kural (<c>TaskPrivacyQueryFilter</c>: gizli görevi yalnız oluşturan, atanan ve ekip
/// yöneticisi görür; bürünme oturumu hiç görmez) uzun süre yalnız <c>TaskAppService</c>'te
/// yaşadı. Görevi depodan okuyan on üç yer — proje detayı, Genel Bakış, proje bütçesi, belge
/// kapsamı, uyum, dış paylaşım ağacı, AI aracı, form seçenek listesi, şablona kopyalama… — onu
/// hiç çağırmıyordu ve hiçbir test bunu göremiyordu: derleyici için hepsi geçerli sorguydu.</para>
///
/// <para>Bu test bir TUZAK TELİDİR, kanıt değil: dosyanın kuraldan SÖZ ETTİĞİNİ ölçer, her
/// sorgusunda uyguladığını değil (onu yüzeylerin kendi testleri ölçer). Amacı, görev okuyan yeni
/// bir dosya eklendiğinde kararın sessizce atlanmasını engellemek.</para>
/// </summary>
public class TaskPrivacyCoverage_Tests
{
    private static readonly string[] Roots =
    {
        "src/Apya.Platform.Application",
        "src/Apya.Platform.Ai.Application",
        "src/Apya.Platform.Web",
        "src/Apya.Platform.HttpApi",
    };

    private static readonly Regex UsesTaskRepository = new(
        @"I(ReadOnly)?Repository<\s*(Apya\.Platform\.Tasks\.)?TaskItem\b|ITaskItemRepository\b",
        RegexOptions.Compiled);

    private static readonly Regex MentionsRule = new(
        @"TaskPrivacyQueryFilter|\bIsPrivate\b|EnsureTaskAccessAllowedAsync|EnsureTaskPrivacyAllowedAsync",
        RegexOptions.Compiled);

    /// <summary>
    /// Kuralı uygulamadan görev okuyan dosyalar ve NEDEN güvenli oldukları. Buraya satır eklemek
    /// bir karardır: gerekçe "görev başlığı / içeriği çağırana dönmüyor" ya da "çağıran zaten
    /// yalnız kendi görevini okuyor" olmalı.
    /// </summary>
    private static readonly Dictionary<string, string> Exempt = new(StringComparer.OrdinalIgnoreCase)
    {
        ["src/Apya.Platform.Ai.Application/AiTaskGeneratorAppService.cs"] =
            "Yalnız görev OLUŞTURUR; var olan görevi okumaz.",
        ["src/Apya.Platform.Application/Tasks/DraftApprovedEventHandler.cs"] =
            "Yalnız görev OLUŞTURUR; var olan görevi okumaz.",
        ["src/Apya.Platform.Application/Grants/GrantApplicationConversionAppService.cs"] =
            "Yalnız görev OLUŞTURUR; var olan görevi okumaz.",
        ["src/Apya.Platform.Application/Agentic/AiAssistantAppService.cs"] =
            "Depoyu yalnız TasksPlugin'e verir; kuralı eklenti uygular.",
        ["src/Apya.Platform.Application/Calendars/CalendarAppService.cs"] =
            "Depodan yalnız hesabın SAHİBİNE atanmış görevleri okur (dış takvim eşitlemesi); öteki yollar ITaskAppService'ten geçer.",
        ["src/Apya.Platform.Application/Incomes/IncomeEntryAppService.cs"] =
            "Görevden yalnız proje kimliğini türetir; başlık/içerik dönmez.",
        ["src/Apya.Platform.Application/IssueTasks/IssueTaskAppService.cs"] =
            "Yalnız host bağlamında çalışır (EnsureHostContext).",
        ["src/Apya.Platform.Application/Storage/IUploadedFileAccessChecker.cs"] =
            "Görevden yalnız kiracı kimliğini okur; dosya adı tahmin edilemez ve yalnız korunan uçlardan öğrenilir.",
        ["src/Apya.Platform.Application/Dashboard/DashboardStatisticsProvider.cs"] =
            "Yalnız sayı/toplam üretir; görev başlığı dönmez.",
        ["src/Apya.Platform.Application/Documents/ProjectTimelineAppService.cs"] =
            "Yalnız kapasite toplamı üretir; görev başlığı dönmez.",
        ["src/Apya.Platform.Application/Projects/ProjectMemberAppService.cs"] =
            "Yalnız kişi başına açık görev SAYISI ve atanan kimlikleri; görev başlığı dönmez.",
        ["src/Apya.Platform.Application/Reports/ReportAppService.cs"] =
            "Yalnız proje başına görev sayıları; görev başlığı dönmez.",
    };

    private static List<string> TaskRepositoryUsers() =>
        WebSourceFiles.Under(".cs", Roots)
            .Where(f => UsesTaskRepository.IsMatch(File.ReadAllText(f)))
            .Select(WebSourceFiles.Relative)
            .OrderBy(f => f, StringComparer.Ordinal)
            .ToList();

    [Fact]
    public void Gorev_deposunu_okuyan_her_dosya_gizlilik_kuralini_uygular_ya_da_gerekcesiyle_muaftir()
    {
        var root = WebSourceFiles.RepoRoot();

        var undecided = TaskRepositoryUsers()
            .Where(f => !Exempt.ContainsKey(f))
            .Where(f => !MentionsRule.IsMatch(File.ReadAllText(Path.Combine(root, f))))
            .ToList();

        undecided.ShouldBeEmpty(
            "Bu dosyalar görev deposunu doğrudan okuyor ama gizli görev kuralından (APYA-22) hiç söz etmiyor. " +
            "Görev başlığı ya da içeriği çağırana dönüyorsa TaskPrivacyQueryFilter'ı uygulayın (ya da görevi " +
            "ITaskAppService'ten okuyun); dönmüyorsa dosyayı gerekçesiyle muafiyet listesine ekleyin.");
    }

    /// <summary>
    /// Muafiyet listesi bayatlamaz: silinen ya da görev deposunu artık kullanmayan dosya listede
    /// kalırsa, aynı ada sonradan gelen bir dosya denetimsiz muaf olurdu.
    /// </summary>
    [Fact]
    public void Muafiyet_listesindeki_her_dosya_hala_gorev_deposunu_kullaniyor()
    {
        var users = TaskRepositoryUsers().ToHashSet(StringComparer.OrdinalIgnoreCase);

        Exempt.Keys.Where(f => !users.Contains(f)).ShouldBeEmpty(
            "Bu dosyalar muafiyet listesinde ama artık görev deposunu kullanmıyor (ya da yok): listeden çıkarın.");
    }

    /// <summary>
    /// Kuralı uygulayan dosya ayrıca muaf sayılmaz: iki listede birden duran dosya, kural kaldırılsa
    /// bile testi yeşil bırakırdı.
    /// </summary>
    [Fact]
    public void Kurali_uygulayan_dosya_muafiyet_listesinde_durmaz()
    {
        var root = WebSourceFiles.RepoRoot();

        Exempt.Keys
            .Where(f => File.Exists(Path.Combine(root, f)))
            .Where(f => MentionsRule.IsMatch(File.ReadAllText(Path.Combine(root, f))))
            .ShouldBeEmpty("Bu dosyalar kuraldan söz ediyor; muafiyet listesinden çıkarın.");
    }

    /// <summary>Tarayıcının kendisi çalışıyor mu: kuralın evi olan servis bulunmalı.</summary>
    [Fact]
    public void Tarama_gorev_servisini_buluyor()
    {
        TaskRepositoryUsers().ShouldContain("src/Apya.Platform.Application/Tasks/TaskShareAppService.cs");
        TaskRepositoryUsers().Count.ShouldBeGreaterThan(Exempt.Count);
    }
}
