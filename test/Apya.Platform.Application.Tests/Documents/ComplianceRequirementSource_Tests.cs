using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Documents;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.Tests.Application.Documents;

/// <summary>
/// Kalemin KAYNAĞI yalnız bir etiket değil, davranış da belirliyor:
/// göreve bağlı kalem otomatik karşılanamaz. Bu kural bozulursa, aslında
/// eksik olan bir kalem tipi tutan rastgele bir belgeyle yeşile döner ve
/// kuruma eksik dosya gider.
/// </summary>
public class ComplianceRequirementSource_Tests
{
    private static readonly Guid PackageId = Guid.NewGuid();
    private static readonly Guid TypeId = Guid.NewGuid();
    private static readonly Guid TaskId = Guid.NewGuid();

    private static ComplianceRequirement Requirement(
        ComplianceRequirementSource source = ComplianceRequirementSource.InstitutionPackage,
        Guid? sourceEntityId = null)
        => new(
            Guid.NewGuid(), tenantId: null, PackageId, "Onay yazısı",
            ComplianceScope.Project, documentTypeId: TypeId, isBlocking: true, order: 0,
            source: source, sourceEntityId: sourceEntityId);

    private static readonly ComplianceScopeInstance ProjectScope = new(null, null, null, null);

    private static IReadOnlyList<ComplianceDocument> TypedDocument() => new List<ComplianceDocument>
    {
        new(Guid.NewGuid(), "Onay yazısı.pdf", TypeId, null, null),
    };

    [Fact]
    public void Varsayilan_kaynak_kurum_sablonudur()
    {
        Requirement().Source.ShouldBe(ComplianceRequirementSource.InstitutionPackage);
    }

    [Fact]
    public void Kurum_kalemi_tipi_tutan_belgeyle_otomatik_karsilanir()
    {
        var match = ComplianceCalculator.FindAutoMatch(Requirement(), ProjectScope, TypedDocument());

        match.ShouldNotBeNull();
    }

    [Fact]
    public void Klasor_semasi_kalemi_de_otomatik_karsilanir()
    {
        var requirement = Requirement(ComplianceRequirementSource.FolderSchema);

        ComplianceCalculator.FindAutoMatch(requirement, ProjectScope, TypedDocument()).ShouldNotBeNull();
    }

    /// <summary>Asıl kural: belge↔görev bağı şemada yok, o yüzden otomatik eşleşme YASAK.</summary>
    [Fact]
    public void Goreve_bagli_kalem_tipi_tutsa_bile_otomatik_karsilanmaz()
    {
        var requirement = Requirement(ComplianceRequirementSource.TaskAttachment, TaskId);

        ComplianceCalculator.FindAutoMatch(requirement, ProjectScope, TypedDocument()).ShouldBeNull();
    }

    [Fact]
    public void Goreve_bagli_kalem_elle_baglanarak_karsilanabilir()
    {
        var requirement = Requirement(ComplianceRequirementSource.TaskAttachment, TaskId);
        var documents = TypedDocument();

        var state = new ComplianceItemState(
            Guid.NewGuid(), tenantId: null, assignmentId: Guid.NewGuid(),
            requirementId: requirement.Id, workStepId: null, periodCode: null);
        state.LinkDocument(documents[0].Id);

        var evaluations = ComplianceCalculator.Evaluate(
            new[] { requirement }, Array.Empty<(Guid, string, int)>(), documents, new[] { state }, null);

        evaluations.ShouldHaveSingleItem().Status.ShouldBe(ComplianceItemStatus.Satisfied);
    }

    [Fact]
    public void Goreve_bagli_kalem_gorevsiz_kurulamaz()
    {
        var ex = Should.Throw<BusinessException>(() =>
            Requirement(ComplianceRequirementSource.TaskAttachment, sourceEntityId: null));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.ComplianceTaskSourceRequiresTask);
    }

    /// <summary>Görev kimliği yalnız göreve bağlı kaynakta anlamlı; diğerlerinde temizlenir.</summary>
    [Fact]
    public void Kaynak_gorevden_baskasina_donerse_gorev_kimligi_silinir()
    {
        var requirement = Requirement(ComplianceRequirementSource.TaskAttachment, TaskId);
        requirement.SourceEntityId.ShouldBe(TaskId);

        requirement.SetSource(ComplianceRequirementSource.FolderSchema, TaskId);

        requirement.SourceEntityId.ShouldBeNull();
    }

    [Fact]
    public void Sistem_paketi_duzenlenemez()
    {
        var system = new CompliancePackage(
            Guid.NewGuid(), tenantId: null, "KOSGEB Ar-Ge", "KOSGEB", "KOSGEB_ARGE", isSystem: true);

        var ex = Should.Throw<BusinessException>(() => system.Update("Yeni ad", "KOSGEB", null, 0));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.CompliancePackageReadOnly);
    }

    [Fact]
    public void Kiracinin_kendi_paketi_duzenlenebilir()
    {
        var own = new CompliancePackage(
            Guid.NewGuid(), tenantId: Guid.NewGuid(), "Şirket şeması", "İç politika", "SIRKET_SEMASI");

        Should.NotThrow(() => own.Update("Şirket klasör şeması", "İç politika", "açıklama", 2));
        own.Name.ShouldBe("Şirket klasör şeması");
    }
}
