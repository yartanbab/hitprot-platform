using System;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;

namespace Apya.Platform.Grants;

/// <summary>
/// Erasmus+ gençlik alanı programlarını (KA152/153/154/210/220) HOST kataloğuna kurar.
/// Demo verisi değildir; <see cref="PlatformTestDataSeedContributor"/>'ın aksine bir
/// yapılandırma bayrağına bağlı değildir — gerçek çağrı kataloğudur.
///
/// <para>🔴 HOST-ONLY: katalog <c>TenantId=null</c> ile yaşar. Yeni kiracı açılışında ABP bu
/// tohumlayıcıyı kiracı bağlamında da çağırır; guard olmasaydı her kiracıya kendi kopyası
/// yazılırdı.</para>
///
/// <para>Yeniden çalıştırılabilir: program sabit Id'siyle, çağrı da (program, dönem) çiftiyle
/// aranır. Var olan kayda DOKUNULMAZ — host ekranda düzenlediyse tohumlama onu geri almaz.
/// Yeni bir başvuru dönemi eklemek için ilgili programın <c>Calls</c> dizisine satır ekle.</para>
/// </summary>
public class ErasmusYouthCatalogDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private const string Issuer = "Erasmus+ (Ulusal Ajans)";

    /// <summary>
    /// Program tavanı Avro cinsinden ve çoğunda tek bir üst limit yok (götürü hibe kademeleri).
    /// <c>MaxAmount</c> kolonu NOT NULL olduğu için 0 yazılır — kodun "tavan belirtilmemiş"
    /// sentinel'i budur: <see cref="GrantMatchManager"/>, <c>MaxAmount &gt; 0</c> değilse bütçe
    /// boyutunu skora hiç katmaz. Kademeler açıklama metnine yazılır.
    /// </summary>
    private const decimal NoCeiling = 0m;

    /// <summary>
    /// Etiketlerinin yarısını tutturan firma eşiği geçer. Eşiğin altında kalan çağrı kiracıya
    /// yine listelenir ("Diğer Açık Çağrılar"), yalnız "Size Önerilen" bloğuna girmez.
    /// </summary>
    private const double DefaultMinMatchScore = 40.0;

    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepository;
    private readonly IGuidGenerator _guidGenerator;

    public ErasmusYouthCatalogDataSeedContributor(
        IRepository<Grant, Guid> grantRepository,
        IRepository<GrantCall, Guid> callRepository,
        IRepository<GrantCriteriaTag, Guid> criteriaRepository,
        IGuidGenerator guidGenerator)
    {
        _grantRepository = grantRepository;
        _callRepository = callRepository;
        _criteriaRepository = criteriaRepository;
        _guidGenerator = guidGenerator;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return; // katalog host'ta yaşar
        }

        foreach (var program in Programs)
        {
            var grant = await _grantRepository.FindAsync(program.Id);
            if (grant == null)
            {
                grant = new Grant(program.Id, program.Name, Issuer, NoCeiling, DefaultMinMatchScore)
                {
                    Description = program.Description,
                    EligibleCompanySizes = 0 // her tüzel kişilik başvurabilir — ölçek kısıtı yok
                };
                await _grantRepository.InsertAsync(grant, autoSave: true);

                foreach (var sector in program.Sectors)
                {
                    await _criteriaRepository.InsertAsync(
                        new GrantCriteriaTag(_guidGenerator.Create(), grant.Id, GrantCriteriaKind.Sektor, sector),
                        autoSave: true);
                }

                foreach (var keyword in program.Keywords)
                {
                    await _criteriaRepository.InsertAsync(
                        new GrantCriteriaTag(_guidGenerator.Create(), grant.Id, GrantCriteriaKind.AnahtarKelime, keyword),
                        autoSave: true);
                }
            }

            foreach (var callSeed in program.Calls)
            {
                var existing = await _callRepository.FindAsync(
                    c => c.GrantId == program.Id && c.Period == callSeed.Period);
                if (existing != null)
                {
                    continue;
                }

                var call = new GrantCall(_guidGenerator.Create(), program.Id, callSeed.Period, callSeed.Status);
                call.SetSchedule(openDate: null, deadline: callSeed.Deadline);
                call.Reference = program.Code;
                await _callRepository.InsertAsync(call, autoSave: true);
            }
        }
    }

    /// <summary>
    /// Postgres kolonu <c>timestamp with time zone</c>; Kind=Utc olmayan DateTime Npgsql'de yazılamaz.
    /// </summary>
    private static DateTime Deadline(int year, int month, int day)
        => new(year, month, day, 23, 59, 0, DateTimeKind.Utc);

    private sealed record CallSeed(string Period, GrantCallStatus Status, DateTime? Deadline);

    private sealed record ProgramSeed(
        Guid Id,
        string Code,
        string Name,
        string Description,
        string[] Sectors,
        string[] Keywords,
        CallSeed[] Calls);

    private static readonly ProgramSeed[] Programs =
    {
        new(
            Guid.Parse("e7a51520-0000-4000-8000-000000000152"),
            "KA152-YOU",
            "KA152 - Gençlik Değişimleri",
            "Farklı ülkelerden genç gruplarının ortak bir tema etrafında bir araya gelerek kültürlerarası " +
            "öğrenme gerçekleştirdiği, yaygın öğrenme temelli kısa süreli projelerdir.\n\n" +
            "Hedef kitle: genellikle 13-30 yaş arası gençler ve projeye rehberlik eden gençlik liderleri.\n\n" +
            "Kimler başvurabilir: program ülkesinde tüzel kişiliğe sahip kurum/kuruluşlar (dernek, vakıf, " +
            "okul, belediye vb.) ile kayıtlı resmi veya resmi olmayan genç grupları.\n\n" +
            "Bütçe: proje türü, katılımcı sayısı ve seyahat mesafelerine göre değişir; götürü usulü hibe " +
            "(lump-sum) veya faaliyet kalemlerine göre belirlenen tavan bütçeler uygulanır. Güncel götürü " +
            "hibe miktarları her yıl Erasmus+ Program Rehberinde yayımlanır.",
            new[] { "gençlik", "eğitim", "sivil toplum" },
            new[] { "erasmus+", "gençlik değişimi", "kültürlerarası öğrenme", "yaygın öğrenme" },
            new[]
            {
                new CallSeed("2026/1", GrantCallStatus.Kapandi, Deadline(2026, 2, 12)),
                new CallSeed("2026/2", GrantCallStatus.Acik, Deadline(2026, 10, 1))
            }),

        new(
            Guid.Parse("e7a51520-0000-4000-8000-000000000153"),
            "KA153-YOU",
            "KA153 - Gençlik Çalışanlarının Hareketliliği",
            "Gençlik çalışanlarının mesleki gelişimini, yaygın eğitim yöntemlerinde yetkinlik kazanmalarını, " +
            "uluslararası iyi uygulama paylaşımını ve ağ kurmayı destekleyen projelerdir.\n\n" +
            "Hedef kitle: gençlik alanında resmi ya da gayriresmi faaliyet gösteren gençlik çalışanları, " +
            "liderler ve eğitmenler.\n\n" +
            "Kimler başvurabilir: gençlik alanında aktif kurum ve kuruluşlar, dernekler, vakıflar ve sivil " +
            "toplum örgütleri.\n\n" +
            "Bütçe: katılımcı sayısı, faaliyet süresi ve gidilen ülkeye ait seyahat/yaşam masrafı " +
            "kalemlerine göre hesaplanan üst limitler geçerlidir; rehberdeki birim maliyet/götürü usul " +
            "esas alınır.",
            new[] { "gençlik", "eğitim", "sivil toplum" },
            new[] { "erasmus+", "gençlik çalışanı", "hareketlilik", "mesleki gelişim", "yaygın eğitim" },
            new[]
            {
                new CallSeed("2026/1", GrantCallStatus.Kapandi, Deadline(2026, 2, 12)),
                new CallSeed("2026/2", GrantCallStatus.Acik, Deadline(2026, 10, 1))
            }),

        new(
            Guid.Parse("e7a51520-0000-4000-8000-000000000154"),
            "KA154-YOU",
            "KA154 - Gençlik Katılımı",
            "Gençlerin demokratik hayata katılımını teşvik eden, karar alma mekanizmalarıyla etkileşimlerini " +
            "artıran; yerel, ulusal veya uluslararası düzeyde proje geliştirmelerine olanak tanıyan " +
            "girişimlerdir.\n\n" +
            "Hedef kitle: 13-30 yaş aralığındaki gençler ve gençlik sektörü paydaşları.\n\n" +
            "Kimler başvurabilir: sivil toplum kuruluşları, gençlik dernekleri, kâr amacı gütmeyen " +
            "kuruluşlar ve kamu kurumları.\n\n" +
            "Bütçe: projenin kapsamına (yerel ya da uluslararası oluşuna) göre değişen sabit götürü hibe " +
            "(lump-sum) seçenekleri uygulanır — küçük ölçekli projeler için alt kademe, geniş kapsamlı " +
            "projeler için üst limit bütçeleri.",
            new[] { "gençlik", "sivil toplum", "kamu" },
            new[] { "erasmus+", "gençlik katılımı", "demokratik katılım", "savunuculuk" },
            new[]
            {
                new CallSeed("2026/1", GrantCallStatus.Kapandi, Deadline(2026, 2, 12)),
                new CallSeed("2026/2", GrantCallStatus.Acik, Deadline(2026, 10, 1))
            }),

        new(
            Guid.Parse("e7a51520-0000-4000-8000-000000000210"),
            "KA210-YOU",
            "KA210 - Gençlik Alanında Küçük Ölçekli Ortaklıklar",
            "Gençlik alanına yeni giren kuruluşların erişimini kolaylaştırmak, küçük ölçekli ve yerel " +
            "düzeydeki projelere imkân tanımak suretiyle işbirliği ağları kurmayı hedefleyen sadeleştirilmiş " +
            "hibe programıdır.\n\n" +
            "Hedef kitle: gençlik çalışanları, yerel düzeydeki genç grupları ve küçük ölçekli sivil toplum " +
            "kuruluşları.\n\n" +
            "Kimler başvurabilir: gençlik alanında faaliyet gösteren her türden resmi veya gayriresmi kurum, " +
            "kuruluş ve dernekler.\n\n" +
            "Bütçe: proje başına 30.000 Avro veya 60.000 Avro sabit götürü hibe (lump-sum) seçenekleri.",
            new[] { "gençlik", "sivil toplum" },
            new[] { "erasmus+", "küçük ölçekli ortaklık", "yerel işbirliği", "kapasite geliştirme" },
            new[]
            {
                new CallSeed("2026/1", GrantCallStatus.Kapandi, Deadline(2026, 3, 5)),
                // 2027 takvimi Ulusal Ajans tarafından açıklanmadı — tarih girilince "Açık"a çekilir.
                new CallSeed("2027/1", GrantCallStatus.Planlandi, null)
            }),

        new(
            Guid.Parse("e7a51520-0000-4000-8000-000000000220"),
            "KA220-YOU",
            "KA220 - Gençlik Alanında İşbirliği Ortaklıkları",
            "Gençlik alanında kaliteyi artırmak; yenilikçi uygulamaların geliştirilmesi, transfer edilmesi " +
            "veya hayata geçirilmesi amacıyla ulusal ve uluslararası ortaklıklarla yürütülen kapsamlı " +
            "projelerdir.\n\n" +
            "Hedef kitle: gençlik politikası üreticileri, sivil toplum kuruluşları, araştırma kurumları, " +
            "yerel/bölgesel otoriteler ve gençlik alanındaki tüm paydaşlar.\n\n" +
            "Kimler başvurabilir: program ülkelerinde kurulmuş her türlü kamu veya özel kurum/kuruluş.\n\n" +
            "Bütçe: projenin süresi ve kapsamına göre 120.000, 250.000 veya 400.000 Avro götürü usulü " +
            "(lump-sum) üst limit alternatifleri.",
            new[] { "gençlik", "eğitim", "sivil toplum", "kamu" },
            new[] { "erasmus+", "işbirliği ortaklığı", "yenilikçi uygulama", "kurumsal kapasite" },
            new[]
            {
                new CallSeed("2026/1", GrantCallStatus.Kapandi, Deadline(2026, 3, 5)),
                new CallSeed("2027/1", GrantCallStatus.Planlandi, null)
            })
    };
}
