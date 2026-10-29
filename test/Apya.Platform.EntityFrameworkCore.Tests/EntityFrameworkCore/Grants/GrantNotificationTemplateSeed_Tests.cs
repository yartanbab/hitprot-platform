using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Localization;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Bildirim şablonları sunucunun dilinden bağımsız olarak Türkçe kurulur. Eski tohumlama
/// İngilizce Windows'ta İngilizce yazmıştı: host'un dokunmadığı İngilizce varsayılan Türkçeye
/// çevrilir, host'un düzenlediği metin korunur.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantNotificationTemplateSeed_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const string EnglishSubject = "New call is live: {çağrı_adı}";
    private const string EnglishBody =
        "A new call that may suit {firma_adı} has been published: {çağrı_adı}. Deadline {son_tarih} — {kalan_gün} days left.";
    private const string TurkishSubject = "Yeni çağrı yayında: {çağrı_adı}";

    private readonly GrantNotificationTemplateDataSeedContributor _seed;
    private readonly IRepository<GrantNotificationTemplate, Guid> _repository;

    public GrantNotificationTemplateSeed_Tests()
    {
        _seed = GetRequiredService<GrantNotificationTemplateDataSeedContributor>();
        _repository = GetRequiredService<IRepository<GrantNotificationTemplate, Guid>>();
    }

    private Task<GrantNotificationTemplate> GetAsync(GrantNotificationTrigger trigger)
        => WithUnitOfWorkAsync(() => _repository.GetAsync(t => t.Trigger == trigger));

    private async Task SetTextAsync(GrantNotificationTrigger trigger, string subject, string body)
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var template = await _repository.GetAsync(t => t.Trigger == trigger);
            template.SetText(subject, body);
            await _repository.UpdateAsync(template, autoSave: true);
        });
    }

    private Task SeedInEnglishAsync()
        => WithUnitOfWorkAsync(async () =>
        {
            using (CultureHelper.Use("en"))
            {
                await _seed.SeedAsync(new DataSeedContext());
            }
        });

    [Fact]
    public async Task Ingilizce_varsayilanda_duran_sablon_Turkceye_cevrilir()
    {
        await SetTextAsync(GrantNotificationTrigger.CallPublished, EnglishSubject, EnglishBody);

        await SeedInEnglishAsync();

        (await GetAsync(GrantNotificationTrigger.CallPublished)).Subject.ShouldBe(TurkishSubject);
    }

    [Fact]
    public async Task Hostun_duzenledigi_metin_korunur()
    {
        await SetTextAsync(GrantNotificationTrigger.CallPublished, "Host'un konusu", EnglishBody);

        await SeedInEnglishAsync();

        var template = await GetAsync(GrantNotificationTrigger.CallPublished);
        template.Subject.ShouldBe("Host'un konusu");
        template.Body.ShouldBe(EnglishBody, "gövde tek başına İngilizce diye düzenlenmiş şablon ezilmez");
    }

    [Fact]
    public async Task Eksik_sablon_sunucu_dili_Ingilizce_olsa_da_Turkce_kurulur()
    {
        await WithUnitOfWorkAsync(() => _repository.DeleteAsync(
            t => t.Trigger == GrantNotificationTrigger.CallPublished, autoSave: true));

        await SeedInEnglishAsync();

        (await GetAsync(GrantNotificationTrigger.CallPublished)).Subject.ShouldBe(TurkishSubject);
    }
}
