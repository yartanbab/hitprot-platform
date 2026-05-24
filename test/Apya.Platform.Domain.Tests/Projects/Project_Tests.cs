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

        project.Category.ShouldBe(ProjectCategory.Other);
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
            category: ProjectCategory.GrantProject);

        project.CustomerId.ShouldBe(customerId);
        project.Category.ShouldBe(ProjectCategory.GrantProject);
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
            category: ProjectCategory.Event);

        project.Category.ShouldBe(ProjectCategory.Event);
        project.GrantId.ShouldBeNull();
        project.CustomerId.ShouldBe(customerId);
    }
}
