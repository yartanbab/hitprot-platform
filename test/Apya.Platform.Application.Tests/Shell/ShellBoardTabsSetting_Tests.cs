using System;
using System.Collections.Generic;
using Apya.Platform.Shell;
using Apya.Platform.Shell.Dtos;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Shell;

/// <summary>
/// Shell.BoardTabs ayarının saklama biçimi (birleşik sekme sistemi: scope'lu
/// sözlük). Buradaki iki kural yanlışsa hata sessizdir ve kullanıcı sekmelerini
/// kaybeder: (1) eski düz-dizi değer "tasks" scope'u sayılmalı — sayılmazsa
/// mevcut kullanıcıların düzeni ilk açılışta varsayılana döner; (2) çıktı
/// camelCase olmalı — değeri C# yazıyor ama sayfaya ham basılıp JavaScript
/// okuyor, PascalCase'te istemci "kind" alanını göremez.
/// </summary>
public class ShellBoardTabsSetting_Tests
{
    private static ShellBoardTabDto Tab(string kind, string? refValue = null, string? title = null)
        => new() { Kind = kind, Ref = refValue ?? string.Empty, Title = title ?? string.Empty };

    /* ─── Geri uyum: eski düz dizi ───────────────────────────────────── */

    [Fact]
    public void Eski_duz_dizi_deger_tasks_scope_u_sayilir()
    {
        const string legacy = """[{"kind":"list"},{"kind":"project","ref":"guid","title":"Apya Web"}]""";

        var scopes = ShellBoardTabsSetting.Parse(legacy);

        scopes.Keys.ShouldBe(new[] { ShellBoardTabsSetting.TasksScope });
        scopes[ShellBoardTabsSetting.TasksScope].Count.ShouldBe(2);
        scopes[ShellBoardTabsSetting.TasksScope][1].Title.ShouldBe("Apya Web");
    }

    [Fact]
    public void Eski_deger_tasks_scope_u_olarak_aynen_geri_okunur()
    {
        const string legacy = """[{"kind":"list"},{"kind":"kanban"}]""";

        var json = ShellBoardTabsSetting.ExtractScopeJson(legacy, ShellBoardTabsSetting.TasksScope);

        json.ShouldContain("\"kind\":\"list\"");
        json.ShouldContain("\"kind\":\"kanban\"");
    }

    /* ─── Scope sözlüğü ──────────────────────────────────────────────── */

    [Fact]
    public void Sozluk_yazilip_geri_okunur_ve_diger_scope_lara_karismaz()
    {
        var projectScope = ShellBoardTabsSetting.ProjectScope(Guid.NewGuid());
        var scopes = new Dictionary<string, List<ShellBoardTabDto>>(StringComparer.Ordinal)
        {
            [ShellBoardTabsSetting.TasksScope] = new() { Tab("list"), Tab("gantt") },
            [projectScope] = new() { Tab("list"), Tab("kanban"), Tab("finance") },
            [ShellBoardTabsSetting.TaskDetailScope] = new() { Tab("checklist"), Tab("gantt") }
        };

        var raw = ShellBoardTabsSetting.Serialize(scopes);
        var back = ShellBoardTabsSetting.Parse(raw);

        back.Keys.Count.ShouldBe(3);
        back[projectScope][2].Kind.ShouldBe("finance");
        back[ShellBoardTabsSetting.TaskDetailScope][0].Kind.ShouldBe("checklist");
    }

    /// <summary>Değeri JavaScript okuyor: alan adları camelCase basılmak zorunda.</summary>
    [Fact]
    public void Cikti_camelCase_tir()
    {
        var scopes = new Dictionary<string, List<ShellBoardTabDto>>(StringComparer.Ordinal)
        {
            [ShellBoardTabsSetting.TasksScope] = new() { Tab("project", "guid", "Apya Web") }
        };

        var json = ShellBoardTabsSetting.ExtractScopeJson(
            ShellBoardTabsSetting.Serialize(scopes), ShellBoardTabsSetting.TasksScope);

        // Shouldly'nin Contain'i varsayılanda harf duyarsız — camelCase iddiası
        // ancak Case.Sensitive ile gerçekten kanıtlanır.
        json.ShouldContain("\"kind\":", Case.Sensitive);
        json.ShouldContain("\"ref\":", Case.Sensitive);
        json.ShouldContain("\"title\":", Case.Sensitive);
        json.ShouldNotContain("\"Kind\":", Case.Sensitive);
    }

    /* ─── Boş / bozuk değerler ───────────────────────────────────────── */

    /// <summary>BOŞ scope "kullanıcı hiç dokunmadı" demek: istemci varsayılanı kurar.</summary>
    [Fact]
    public void Hic_yazilmamis_scope_bos_string_doner()
    {
        var raw = ShellBoardTabsSetting.Serialize(new Dictionary<string, List<ShellBoardTabDto>>
        {
            [ShellBoardTabsSetting.TasksScope] = new() { Tab("list") }
        });

        ShellBoardTabsSetting.ExtractScopeJson(raw, ShellBoardTabsSetting.TaskDetailScope)
            .ShouldBe(string.Empty);
        ShellBoardTabsSetting.ExtractScopeJson(null, ShellBoardTabsSetting.TasksScope)
            .ShouldBe(string.Empty);
    }

    /// <summary>Bozuk değer kullanıcıya hata olarak sıçramaz — düzen varsayılana döner.</summary>
    [Fact]
    public void Bozuk_JSON_bos_sozluk_doner()
    {
        ShellBoardTabsSetting.Parse("{bozuk").ShouldBeEmpty();
        ShellBoardTabsSetting.ExtractScopeJson("{bozuk", ShellBoardTabsSetting.TasksScope)
            .ShouldBe(string.Empty);
    }

    [Fact]
    public void Proje_scope_anahtari_guid_ile_kurulur()
    {
        var id = Guid.Parse("6d1a2b3c-0000-0000-0000-000000000001");
        ShellBoardTabsSetting.ProjectScope(id).ShouldBe("project:" + id);
    }
}
