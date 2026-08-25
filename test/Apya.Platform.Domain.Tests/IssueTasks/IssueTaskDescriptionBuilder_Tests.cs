using System;
using Apya.Platform.Feedbacks;
using Apya.Platform.IssueTasks;
using Apya.Platform.Telemetry;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.IssueTasks;

/// <summary>
/// Görev açıklaması kaynağın teşhis bağlamını TAŞIR: kaynak kayıt saklama süresiyle
/// silinse bile görev tek başına okunabilir kalmalı. Ayrıca metin kullanıcı girdisi
/// ve hata mesajı içerir — kaçırılmazsa görev açıklaması işaretlemeyi yorumlar.
/// </summary>
public class IssueTaskDescriptionBuilder_Tests
{
    private static Feedback CreateFeedback(string subject = "Kaydet çalışmıyor", string body = "Butona basınca hata")
    {
        return new Feedback(
            Guid.NewGuid(),
            tenantId: Guid.NewGuid(),
            FeedbackType.Bug,
            subject,
            body)
        {
            FeedbackNumber = "FB-2026-000123",
            PageUrl = "/Projects/Edit/17",
            ModuleCode = "Projects",
            DetailsJson = "{\"expected\":\"Kayıt oluşmalı\",\"actual\":\"500 hatası\"}"
        };
    }

    [Fact]
    public void Geri_bildirim_aciklamasi_numara_govde_ve_baglami_tasir()
    {
        var html = IssueTaskDescriptionBuilder.ForFeedback(CreateFeedback(), "KAYMEK", note: null);

        html.ShouldContain("FB-2026-000123");
        html.ShouldContain("Butona basınca hata");
        html.ShouldContain("KAYMEK");
        html.ShouldContain("/Projects/Edit/17");

        // Türe özel alanlar Türkçe etiketleriyle girer (panelle aynı sözlük).
        html.ShouldContain("Beklenen sonuç");
        html.ShouldContain("500 hatası");
    }

    [Fact]
    public void Kullanici_girdisindeki_isaretleme_kacirilir()
    {
        var feedback = CreateFeedback(subject: "XSS", body: "<script>alert(1)</script>");

        var html = IssueTaskDescriptionBuilder.ForFeedback(feedback, "Host", note: null);

        html.ShouldNotContain("<script>");
        html.ShouldContain("&lt;script&gt;");
    }

    [Fact]
    public void Yonetici_notu_aciklamanin_basina_konur()
    {
        var html = IssueTaskDescriptionBuilder.ForFeedback(CreateFeedback(), "Host", note: "Acil bakılsın");

        html.ShouldStartWith("<p>Acil bakılsın</p>");
    }

    [Fact]
    public void Istemci_hatasi_aciklamasi_yigin_izini_ve_olusum_sayisini_tasir()
    {
        var error = new ClientError(
            Guid.NewGuid(),
            tenantId: null,
            fingerprint: "abc123",
            ClientErrorSource.JsError,
            "Cannot read properties of undefined",
            new DateTime(2026, 8, 20, 10, 0, 0, DateTimeKind.Utc))
        {
            StackTrace = "at foo (bar.js:12)",
            PageUrl = "/Tasks"
        };
        error.RegisterOccurrence(new DateTime(2026, 8, 24, 10, 0, 0, DateTimeKind.Utc), null, "/Tasks", null);

        var html = IssueTaskDescriptionBuilder.ForClientError(error, "Host", note: null);

        html.ShouldContain("Cannot read properties of undefined");
        html.ShouldContain("at foo (bar.js:12)");
        html.ShouldContain("2 oluşum");
        html.ShouldContain("abc123");
    }

    [Fact]
    public void Sunucu_hatasi_aciklamasi_audit_logun_gecici_oldugunu_soyler()
    {
        var signal = new ServerErrorSignal
        {
            Url = "/api/app/project",
            ExceptionText = "Volo.Abp.BusinessException: Proje bulunamadı",
            ExceptionType = "Volo.Abp.BusinessException",
            HttpMethod = "POST",
            HttpStatusCode = 500,
            OccurrenceCount = 12,
            FirstSeenAt = new DateTime(2026, 8, 18, 9, 0, 0, DateTimeKind.Utc),
            LastSeenAt = new DateTime(2026, 8, 24, 9, 0, 0, DateTimeKind.Utc),
            TenantName = "KAYMEK"
        };

        var html = IssueTaskDescriptionBuilder.ForServerError(signal, note: null);

        html.ShouldContain("/api/app/project");
        html.ShouldContain("Proje bulunamadı");
        html.ShouldContain("12 oluşum");

        // Kaynak silinince görevin yetim kalmadığını okuyan bilsin.
        html.ShouldContain("saklama süresiyle temizlenir");
    }

    [Fact]
    public void Bozuk_details_json_aciklamayi_dusurmez()
    {
        var feedback = CreateFeedback();
        feedback.DetailsJson = "{bozuk json";

        var html = IssueTaskDescriptionBuilder.ForFeedback(feedback, "Host", note: null);

        html.ShouldContain("FB-2026-000123");
    }
}
