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
        var project = new Project(Guid.NewGuid(), null, "Tübitak Projesi", "PRJ-001", "Açıklama");

        // Act & Assert
        var ex = Assert.Throws<BusinessException>(() => project.SetBudgetInfo(-50, 0, "TRY"));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ProjectBudgetInvalid);
    }

    [Fact]
    public void SetSchedule_Should_Throw_Exception_When_EndDate_Before_StartDate()
    {
        // Arrange
        var project = new Project(Guid.NewGuid(), null, "Tübitak Projesi", "PRJ-001", "Açıklama");
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
        var project = new Project(Guid.NewGuid(), null, "Tübitak Projesi", "PRJ-001", "Açıklama");

        // Act & Assert
        var ex = Assert.Throws<BusinessException>(() => project.SetName("  "));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ProjectNameRequired);
    }
}
