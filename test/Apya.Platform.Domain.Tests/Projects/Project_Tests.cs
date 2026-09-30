using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Projects;

namespace Apya.Platform.Tests.Domain.Projects;

public class Project_Tests
{
    [Fact]
    public void SetBudgetInfo_Should_Throw_Exception_When_Negative()
    {
        // Arrange
        var project = new Project(Guid.NewGuid(), null, null, "Tübitak Projesi", "PRJ-001", "Açıklama");

        // Act & Assert
        var ex = Assert.Throws<BusinessException>(() => project.SetBudgetInfo(-50, 0, "TRY"));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ProjectBudgetInvalid);
    }

    [Fact]
    public void SetSchedule_Should_Throw_Exception_When_EndDate_Before_StartDate()
    {
        // Arrange
        var project = new Project(Guid.NewGuid(), null, null, "Tübitak Projesi", "PRJ-001", "Açıklama");
        var startDate = new DateTime(2025, 1, 10);
        var endDate = new DateTime(2025, 1, 5); // Bitiş tarihi başlangıçtan önce!

        // Act & Assert
        var ex = Assert.Throws<BusinessException>(() => project.SetSchedule(startDate, endDate));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ProjectScheduleInvalid);
    }

    [Fact]
    public void SetName_Should_Throw_Exception_When_Null_Or_Whitespace()
    {
        // Arrange
        var project = new Project(Guid.NewGuid(), null, null, "Tübitak Projesi", "PRJ-001", "Açıklama");

        // Act & Assert
        var ex = Assert.Throws<BusinessException>(() => project.SetName("  "));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ProjectNameRequired);
    }

    // --- APYA-132 ---

    [Fact]
    public void Constructor_Default_Category_Should_Be_Other()
    {
        var project = new Project(Guid.NewGuid(), null, null, "Test", "PRJ", "");

        project.CategoryId.ShouldBe(ProjectCategoryConsts.SystemIds.Other);
        project.CustomerId.ShouldBeNull();
    }

    [Fact]
    public void Constructor_Should_Set_CustomerId_And_Category_When_Provided()
    {
        var customerId = Guid.NewGuid();
        var project = new Project(
            id: Guid.NewGuid(),
            tenantId: null,
            grantId: null,
            name: "TÜBİTAK 1501 Projesi",
            code: "PRJ-1501",
            description: "",
            customerId: customerId,
            categoryId: ProjectCategoryConsts.SystemIds.GrantProject);

        project.CustomerId.ShouldBe(customerId);
        project.CategoryId.ShouldBe(ProjectCategoryConsts.SystemIds.GrantProject);
    }

    [Fact]
    public void Constructor_Should_Allow_Event_Category_Without_GrantId()
    {
        var customerId = Guid.NewGuid();
        var project = new Project(
            id: Guid.NewGuid(),
            tenantId: null,
            grantId: null,
            name: "Lansman Etkinliği",
            code: "EVT-001",
            description: "",
            customerId: customerId,
            categoryId: ProjectCategoryConsts.SystemIds.Event);

        project.CategoryId.ShouldBe(ProjectCategoryConsts.SystemIds.Event);
        project.GrantId.ShouldBeNull();
        project.CustomerId.ShouldBe(customerId);
    }

    // --- PRJ-01: önce doğrula, sonra değiştir ---
    // Update ihlalde yarım değişmiş entity bırakırsa istisnayı yakalayıp formu yeniden çizen
    // Projects/Edit iş birimini tamamlar ve ihlalden önce yazılan alanlar kaydedilirdi.

    private static Project ExistingProject() => new(
        Guid.NewGuid(), null, null, "Eski Ad", "ESKI-1", "Eski açıklama",
        totalBudget: 100m,
        startDate: new DateTime(2026, 1, 1),
        endDate: new DateTime(2026, 12, 31));

    [Fact]
    public void Update_gecersiz_butcede_hic_alan_degismez()
    {
        var project = ExistingProject();
        var categoryId = project.CategoryId;

        var ex = Assert.Throws<BusinessException>(() => project.Update(
            name: "Yeni Ad", code: "YENI-1", description: "Yeni açıklama",
            grantId: null, customerId: null, categoryId: ProjectCategoryConsts.SystemIds.Event,
            totalBudget: -5m, hourlyRate: 0m, currency: "TRY",
            purpose: "Yeni amaç", targetAudience: null, activities: null,
            startDate: new DateTime(2026, 1, 1), endDate: new DateTime(2026, 12, 31)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.ProjectBudgetInvalid);
        project.Name.ShouldBe("Eski Ad");
        project.Code.ShouldBe("ESKI-1");
        project.Description.ShouldBe("Eski açıklama");
        project.CategoryId.ShouldBe(categoryId);
        project.Purpose.ShouldBeNull();
        project.TotalBudget.ShouldBe(100m);
    }

    [Fact]
    public void Update_ters_tarihte_hic_alan_degismez()
    {
        var project = ExistingProject();

        var ex = Assert.Throws<BusinessException>(() => project.Update(
            name: "Yeni Ad", code: "YENI-1", description: "Yeni açıklama",
            grantId: null, customerId: null, categoryId: project.CategoryId,
            totalBudget: 200m, hourlyRate: 0m, currency: "TRY",
            purpose: null, targetAudience: null, activities: null,
            startDate: new DateTime(2026, 9, 27), endDate: new DateTime(2026, 9, 1)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.ProjectScheduleInvalid);
        project.Name.ShouldBe("Eski Ad");
        project.Code.ShouldBe("ESKI-1");
        project.TotalBudget.ShouldBe(100m, "bütçe kontrolü geçse de tarih ihlalinde bütçe de yazılmamalı");
        project.StartDate.ShouldBe(new DateTime(2026, 1, 1));
    }
}
