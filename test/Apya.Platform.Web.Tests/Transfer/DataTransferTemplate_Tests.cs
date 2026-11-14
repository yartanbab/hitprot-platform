using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.DataTransfers;
using Apya.Platform.DataTransfers.Dtos;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Transfer;

/// <summary>
/// Aktarım şablonları uçtan uca: dışa aktarma şablonu sütun setini, sırasını, başlıklarını ve biçimi
/// belirler; içe aktarma şablonu dosyadaki başlıkları modülün alanlarına eşler (alan eşleştirme).
/// Şablon sürümlenir; host şablonunu kiracı görür ama değiştiremez, kiracının şablonu kendisinindir.
/// </summary>
public class DataTransferTemplate_Tests : PlatformWebTestBase
{
    private const string Module = "exchange-rates";
    private const string Modal = "/ExchangeRates/ImportModal";

    private readonly string _code = Guid.NewGuid().ToString("N")[..6];

    private IDataTransferTemplateAppService Templates => GetRequiredService<IDataTransferTemplateAppService>();

    private static string Text(byte[] bytes) => Encoding.UTF8.GetString(bytes).TrimStart('﻿');

    /// <summary>Modülün standart sütun başlıkları (şablonun anahtarları): şablonsuz CSV'nin ilk satırı.</summary>
    private async Task<string[]> StandardHeadersAsync(string url)
        => Text(await (await GetResponseAsync(url)).Content.ReadAsByteArrayAsync()).Split("\r\n")[0]
            .Split(';').Select(h => h.Replace(" *", "")).ToArray();

    private async Task<JsonElement> PostAsync(string url, string csv)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Modal));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']").GetAttributeValue("value", "");

        using var content = new MultipartFormDataContent();
        content.Add(new ByteArrayContent(Encoding.UTF8.GetBytes(csv)), "file", "kurlar.csv");
        content.Add(new StringContent(token), "__RequestVerificationToken");
        using var request = new HttpRequestMessage(HttpMethod.Post, url) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        response.IsSuccessStatusCode.ShouldBeTrue();
        return JsonDocument.Parse(await response.Content.ReadAsStringAsync()).RootElement.Clone();
    }

    [Fact]
    public async Task Disa_aktarma_sablonu_sutunlari_sirayi_basliklari_ve_bicimi_belirler()
    {
        var standard = await StandardHeadersAsync("/ExchangeRates?handler=Excel&format=csv");
        standard.Length.ShouldBe(5);

        // Standart: Tarih, Para birimi, Hedef, Kur, Kaynak → şablon: Kur ("Rate"), Tarih ("Day"); CSV.
        var template = await Templates.CreateAsync(new CreateDataTransferTemplateDto
        {
            ModuleKey = Module, Direction = DataTransferDirection.Export, Name = "Kısa kur " + _code,
            Format = DataTransferFileFormat.Csv,
            Columns =
            [
                new() { Key = standard[3], Header = "Rate" },
                new() { Key = standard[0], Header = "Day" },
                new() { Key = "Artık olmayan sütun", Header = "X" },
            ]
        });

        var response = await GetResponseAsync($"/ExchangeRates?handler=Excel&template={template.Id}");
        response.Content.Headers.ContentType!.MediaType.ShouldBe("text/csv");
        Text(await response.Content.ReadAsByteArrayAsync()).Split("\r\n")[0].ShouldBe("Rate;Day");

        // Adreste biçim verilirse o geçerlidir.
        (await GetResponseAsync($"/ExchangeRates?handler=Excel&format=xlsx&template={template.Id}"))
            .Content.Headers.ContentType!.MediaType.ShouldContain("spreadsheetml");

        // Geçmiş hangi şablonun hangi sürümüyle çalışıldığını yazar.
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            var runs = await GetRequiredService<IRepository<DataTransferRun, Guid>>().GetListAsync(r => r.TemplateId == template.Id);
            runs.Count.ShouldBe(2);
            runs.ShouldAllBe(r => r.TemplateVersion == 1);
        }

        // Başka modülün ucunda ve ters yönde kullanılamaz.
        // (Ret, test barındırıcısında hata sayfasına yönlendirme olarak görünür; ölçülen: dosya inmez.)
        foreach (var url in new[] { $"/Expenses?handler=Excel&template={template.Id}", $"{Modal}?handler=Template&template={template.Id}" })
        {
            var rejected = await Client.GetAsync(url);
            rejected.Content.Headers.ContentDisposition.ShouldBeNull(url);
            rejected.Content.Headers.ContentType?.MediaType.ShouldNotBe("text/csv");
        }
    }

    [Fact]
    public async Task Ice_aktarma_sablonu_dosyadaki_basliklari_alanlara_esler()
    {
        var standard = await StandardHeadersAsync(Modal + "?handler=Template&format=csv");
        standard.Length.ShouldBe(4);
        var currency = "Y" + new string(_code.Where(char.IsLetter).Concat("QW").Take(2).ToArray()).ToUpperInvariant();

        // Bankanın dosyası: İşlem Günü, Döviz, Değer. Hedef para birimi şablonda yok (boşsa TRY).
        var template = await Templates.CreateAsync(new CreateDataTransferTemplateDto
        {
            ModuleKey = Module, Direction = DataTransferDirection.Import, Name = "Banka kur dosyası " + _code,
            Format = DataTransferFileFormat.Csv,
            Columns =
            [
                new() { Key = standard[0], Header = "İşlem Günü" },
                new() { Key = standard[1], Header = "Döviz" },
                new() { Key = standard[3], Header = "Değer" },
            ]
        });

        // Şablon dosyası şablonun başlıklarıyla iner.
        var file = Text(await (await GetResponseAsync($"{Modal}?handler=Template&format=csv&template={template.Id}")).Content.ReadAsByteArrayAsync());
        file.Split("\r\n")[0].ShouldBe("İşlem Günü *;Döviz *;Değer *");

        var csv = $"Döviz;Değer;İşlem Günü\r\n{currency};41,5;05.01.2034\r\n";

        // Şablonsuz: modül bu başlıkları tanımaz.
        (await PostAsync(Modal + "?handler=Preview", csv)).GetProperty("ok").GetBoolean().ShouldBeFalse();

        // Şablonla: aynı dosya hatasız okunur ve kaydedilir.
        var preview = await PostAsync($"{Modal}?template={template.Id}&handler=Preview", csv);
        preview.GetProperty("ok").GetBoolean().ShouldBeTrue(preview.ToString());
        (await PostAsync($"{Modal}?template={template.Id}&handler=Import", csv)).GetProperty("done").GetBoolean().ShouldBeTrue();

        var saved = Text(await (await GetResponseAsync($"/ExchangeRates?handler=Excel&format=csv&fromCurrency={currency}")).Content.ReadAsByteArrayAsync());
        saved.ShouldContain($"05.01.2034;{currency};TRY;41,5");

        // Pencere şablonla açıldığında uçlarını şablonla çağırır.
        (await GetResponseAsStringAsync($"{Modal}?template={template.Id}")).ShouldContain($"template={template.Id}&amp;handler=Template");
    }

    [Fact]
    public async Task Sablon_surumlenir_onceki_surum_saklanir()
    {
        var created = await Templates.CreateAsync(new CreateDataTransferTemplateDto
        {
            ModuleKey = Module, Direction = DataTransferDirection.Export, Name = "Sürümlü " + _code,
            Columns = [new() { Key = "Tarih", Header = "Tarih" }]
        });

        var updated = await Templates.UpdateAsync(created.Id, new SaveDataTransferTemplateDto
        {
            Name = "Sürümlü " + _code + " (2)", Format = DataTransferFileFormat.Csv,
            Columns = [new() { Key = "Tarih", Header = "Gün" }, new() { Key = "Kur", Header = "" }]
        });

        updated.Version.ShouldBe(2);
        updated.Columns.Select(c => c.Header).ShouldBe(["Gün", "Kur"]);

        var versions = await Templates.GetVersionsAsync(created.Id);
        versions.Select(v => v.Version).ShouldBe([2, 1]);
        versions[1].Columns.Single().Header.ShouldBe("Tarih");
        versions[1].Format.ShouldBe(DataTransferFileFormat.Xlsx);

        // Boş ya da tekrar eden sütun seti kaydedilmez; sürüm artmaz.
        await Should.ThrowAsync<BusinessException>(() => Templates.UpdateAsync(created.Id,
            new SaveDataTransferTemplateDto { Name = "x", Columns = [] }));
        await Should.ThrowAsync<BusinessException>(() => Templates.UpdateAsync(created.Id,
            new SaveDataTransferTemplateDto { Name = "x", Columns = [new() { Key = "Tarih" }, new() { Key = "Tarih" }] }));
        (await Templates.GetAsync(created.Id)).Version.ShouldBe(2);
    }

    [Fact]
    public async Task Sistem_sablonunu_kiraci_gorur_ama_degistiremez_kiracinin_sablonu_kendisinindir()
    {
        var currentTenant = GetRequiredService<ICurrentTenant>();
        var system = await Templates.CreateAsync(new CreateDataTransferTemplateDto
        {
            ModuleKey = Module, Direction = DataTransferDirection.Export, Name = "Sistem " + _code,
            Columns = [new() { Key = "Tarih", Header = "Tarih" }]
        });
        system.IsSystem.ShouldBeTrue();

        var first = await NewTenantAsync();
        var second = await NewTenantAsync();
        Guid ownId;

        using (currentTenant.Change(first))
        {
            var visible = (await Templates.GetListAsync(new GetDataTransferTemplatesInput { ModuleKey = Module })).Items;
            var seen = visible.Single(t => t.Id == system.Id);
            seen.IsSystem.ShouldBeTrue();
            seen.IsEditable.ShouldBeFalse();

            var save = new SaveDataTransferTemplateDto { Name = "Değişti", Columns = [new() { Key = "Tarih" }] };
            (await Should.ThrowAsync<BusinessException>(() => Templates.UpdateAsync(system.Id, save)))
                .Code.ShouldBe(PlatformDomainErrorCodes.DataTransferTemplateIsSystem);
            await Should.ThrowAsync<BusinessException>(() => Templates.DeleteAsync(system.Id));

            var own = await Templates.CreateAsync(new CreateDataTransferTemplateDto
            {
                ModuleKey = Module, Direction = DataTransferDirection.Export, Name = "Kiracı " + _code,
                Columns = [new() { Key = "Tarih" }]
            });
            own.IsSystem.ShouldBeFalse();
            own.IsEditable.ShouldBeTrue();
            ownId = own.Id;
        }

        // Başka kiracı ve host bu şablonu ne listede görür ne de kimliğiyle okuyabilir.
        using (currentTenant.Change(second))
        {
            (await Templates.GetListAsync(new GetDataTransferTemplatesInput())).Items.ShouldNotContain(t => t.Id == ownId);
            await Should.ThrowAsync<EntityNotFoundException>(() => Templates.GetAsync(ownId));
            await Should.ThrowAsync<EntityNotFoundException>(() => Templates.DeleteAsync(ownId));
        }

        (await Templates.GetListAsync(new GetDataTransferTemplatesInput())).Items.ShouldNotContain(t => t.Id == ownId);
        await Should.ThrowAsync<EntityNotFoundException>(() => Templates.GetAsync(ownId));
        (await Templates.GetAsync(system.Id)).Name.ShouldBe("Sistem " + _code);
    }

    private async Task<Guid> NewTenantAsync()
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("sablon-" + Guid.NewGuid().ToString("N")[..8]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }
}
