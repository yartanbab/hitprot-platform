using System;
using System.Collections.Generic;
using Apya.Platform.Documents;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Documents;

/// <summary>
/// Maskeleme bir güvenlik sınırıdır: aynı karar ekranda, teslim paketi PDF'inde
/// ve denetçi görünümünde birebir aynı çıkmak zorunda. Bu testler tek karar
/// noktasının davranışını sabitler.
/// </summary>
public class DocumentFieldMasker_Tests
{
    private static readonly Guid TypeId = Guid.NewGuid();
    private static readonly Guid FieldId = Guid.NewGuid();
    private static readonly Guid OtherFieldId = Guid.NewGuid();

    private static MaskableField Field(DocumentFieldVisibility visibility = DocumentFieldVisibility.Everyone)
        => new(FieldId, TypeId, visibility);

    private static DocumentFieldPermission Perm(
        string role, DocumentFieldAccessLevel level, Guid? fieldId = null, Guid? typeId = null)
        => new(Guid.NewGuid(), null, typeId ?? TypeId, fieldId, role, level);

    private static string[] Roles(params string[] roles) => roles;

    /* ─── Varsayılanlar ──────────────────────────────────────────────── */

    [Fact]
    public void Kural_yoksa_alanin_kendi_gorunurlugu_gecerlidir()
    {
        var none = Array.Empty<DocumentFieldPermission>();

        DocumentFieldMasker.ResolveLevel(Field(DocumentFieldVisibility.Everyone), Roles("ik"), none)
            .ShouldBe(DocumentFieldAccessLevel.Edit);
        DocumentFieldMasker.ResolveLevel(Field(DocumentFieldVisibility.Restricted), Roles("ik"), none)
            .ShouldBe(DocumentFieldAccessLevel.View);
        DocumentFieldMasker.ResolveLevel(Field(DocumentFieldVisibility.Confidential), Roles("ik"), none)
            .ShouldBe(DocumentFieldAccessLevel.Masked);
    }

    /* ─── Çözümleme sırası ───────────────────────────────────────────── */

    [Fact]
    public void Alan_bazli_kural_tip_bazli_kurali_ezer()
    {
        var permissions = new[]
        {
            Perm("finans", DocumentFieldAccessLevel.Hidden),                 // tip geneli
            Perm("finans", DocumentFieldAccessLevel.View, fieldId: FieldId), // bu alan
        };

        DocumentFieldMasker.ResolveLevel(Field(), Roles("finans"), permissions)
            .ShouldBe(DocumentFieldAccessLevel.View);
    }

    [Fact]
    public void Tip_bazli_kural_alan_kurali_yokken_uygulanir()
    {
        var permissions = new[] { Perm("denetci", DocumentFieldAccessLevel.Masked) };

        DocumentFieldMasker.ResolveLevel(Field(), Roles("denetci"), permissions)
            .ShouldBe(DocumentFieldAccessLevel.Masked);
    }

    [Fact]
    public void Baska_tipin_kurali_uygulanmaz()
    {
        var permissions = new[] { Perm("finans", DocumentFieldAccessLevel.Hidden, typeId: Guid.NewGuid()) };

        DocumentFieldMasker.ResolveLevel(Field(DocumentFieldVisibility.Everyone), Roles("finans"), permissions)
            .ShouldBe(DocumentFieldAccessLevel.Edit);
    }

    [Fact]
    public void Baska_alanin_kurali_uygulanmaz()
    {
        var permissions = new[] { Perm("finans", DocumentFieldAccessLevel.Hidden, fieldId: OtherFieldId) };

        DocumentFieldMasker.ResolveLevel(Field(DocumentFieldVisibility.Everyone), Roles("finans"), permissions)
            .ShouldBe(DocumentFieldAccessLevel.Edit);
    }

    [Fact]
    public void Kullanicinin_sahip_olmadigi_rolun_kurali_uygulanmaz()
    {
        var permissions = new[] { Perm("ik", DocumentFieldAccessLevel.Hidden, fieldId: FieldId) };

        DocumentFieldMasker.ResolveLevel(Field(DocumentFieldVisibility.Everyone), Roles("finans"), permissions)
            .ShouldBe(DocumentFieldAccessLevel.Edit);
    }

    /* ─── Çoklu rol ──────────────────────────────────────────────────── */

    [Fact]
    public void Roller_arasinda_en_az_kisitlayici_kazanir()
    {
        // Roller yetki VERİR. Tersi olsaydı kısıtlı bir rol eklemek yöneticiyi
        // kendi verisinden kilitlerdi.
        var permissions = new[]
        {
            Perm("denetci", DocumentFieldAccessLevel.Masked, fieldId: FieldId),
            Perm("admin", DocumentFieldAccessLevel.Edit, fieldId: FieldId),
        };

        DocumentFieldMasker.ResolveLevel(Field(), Roles("denetci", "admin"), permissions)
            .ShouldBe(DocumentFieldAccessLevel.Edit);
    }

    [Fact]
    public void Rol_adi_buyuk_kucuk_harf_ayirmaz()
    {
        var permissions = new[] { Perm("Finans", DocumentFieldAccessLevel.Masked, fieldId: FieldId) };

        DocumentFieldMasker.ResolveLevel(Field(), Roles("finans"), permissions)
            .ShouldBe(DocumentFieldAccessLevel.Masked);
    }

    /* ─── Yardımcılar ────────────────────────────────────────────────── */

    [Theory]
    [InlineData(DocumentFieldAccessLevel.Edit, true, true, false)]
    [InlineData(DocumentFieldAccessLevel.View, true, false, false)]
    [InlineData(DocumentFieldAccessLevel.Masked, true, false, true)]
    [InlineData(DocumentFieldAccessLevel.Hidden, false, false, false)]
    public void Seviye_yardimcilari_tutarli(
        DocumentFieldAccessLevel level, bool visible, bool editable, bool masked)
    {
        DocumentFieldMasker.IsVisible(level).ShouldBe(visible);
        DocumentFieldMasker.IsEditable(level).ShouldBe(editable);
        DocumentFieldMasker.IsMasked(level).ShouldBe(masked);
    }

    [Fact]
    public void Maskeleme_bicimi_korur_icerigi_gizler()
    {
        // Alanın dolu olduğu görünmeli, değeri gitmemeli.
        DocumentFieldMasker.MaskDisplay("32.450,00").ShouldBe("••.•••,••");
        DocumentFieldMasker.MaskDisplay("SF-2026-2451").ShouldBe("••-••••-••••");
        DocumentFieldMasker.MaskDisplay(null).ShouldBe(string.Empty);
        DocumentFieldMasker.MaskDisplay("").ShouldBe(string.Empty);
    }
}
