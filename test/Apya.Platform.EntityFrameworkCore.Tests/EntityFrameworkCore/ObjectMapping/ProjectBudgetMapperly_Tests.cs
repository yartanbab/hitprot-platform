using System;
using System.Linq;
using System.Reflection;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Shouldly;
using Volo.Abp.Mapperly;
using Volo.Abp.ObjectMapping;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.ObjectMapping;

/// <summary>
/// SÖZLEŞME: bütçenin beş eşlemesi Mapperly'den gelir ve eski AutoMapper davranışını korur.
/// Aynı adlı üyeler kopyalanır, servisin doldurduğu üyeler eşlemede boş kalır (var olan DTO'da
/// korunur), iç içe kesinti ve revizyon satırları da aynı yok sayma kurallarından geçer.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectBudgetMapperly_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid ProjectId = Guid.NewGuid();
    private static readonly Guid TenantId = Guid.NewGuid();

    private readonly IObjectMapper _objectMapper;

    public ProjectBudgetMapperly_Tests()
    {
        _objectMapper = GetRequiredService<IObjectMapper>();
    }

    [Theory]
    [InlineData(typeof(ProjectBudgetLine), typeof(ProjectBudgetLineDto))]
    [InlineData(typeof(TrancheDeduction), typeof(TrancheDeductionDto))]
    [InlineData(typeof(FundingTranche), typeof(FundingTrancheDto))]
    [InlineData(typeof(BudgetRevisionLine), typeof(BudgetRevisionLineDto))]
    [InlineData(typeof(BudgetRevision), typeof(BudgetRevisionDto))]
    public void Esleme_Mapperlyde_tanimli(Type source, Type destination)
    {
        ServiceProvider.GetService(typeof(IAbpMapperlyMapper<,>).MakeGenericType(source, destination))
            .ShouldNotBeNull($"{source.Name} -> {destination.Name} için Mapperly eşleyicisi yok");
    }

    [Fact]
    public void Butce_kalemi_alanlari_tasinir_servis_alanlari_bos_kalir()
    {
        var line = NewLine();

        var dto = _objectMapper.Map<ProjectBudgetLine, ProjectBudgetLineDto>(line);

        dto.Id.ShouldBe(line.Id);
        dto.ProjectId.ShouldBe(ProjectId);
        dto.Code.ShouldBe("2.1");
        dto.Name.ShouldBe("Personel");
        dto.Justification.ShouldBe("Gerekçe");
        dto.Order.ShouldBe(7);
        dto.PlannedAmount.ShouldBe(1000m);
        dto.ApprovedAmount.ShouldBe(800m);
        dto.TransferLimitPercent.ShouldBe(15m);
        dto.ParentId.ShouldBe(line.ParentId);
        dto.GrantAmount.ShouldBe(300m);

        dto.SpentAmount.ShouldBe(0m);
        dto.IncomeAmount.ShouldBe(0m);
        dto.LinkedRecordCount.ShouldBe(0);
        dto.Depth.ShouldBe(0);
        dto.HasChildren.ShouldBeFalse();
        dto.GrantShare.ShouldBeNull();
        dto.TotalPlannedAmount.ShouldBe(0m);
        dto.TotalApprovedAmount.ShouldBe(0m);
        dto.TotalSpentAmount.ShouldBe(0m);
        dto.TotalGrantShare.ShouldBeNull();
    }

    [Fact]
    public void Var_olan_kalem_DTOsunda_servis_alanlari_korunur()
    {
        var dto = new ProjectBudgetLineDto
        {
            SpentAmount = 1m,
            IncomeAmount = 2m,
            LinkedRecordCount = 3,
            Depth = 4,
            HasChildren = true,
            GrantShare = 5m,
            TotalPlannedAmount = 6m,
            TotalApprovedAmount = 7m,
            TotalSpentAmount = 8m,
            TotalGrantShare = 9m,
        };

        _objectMapper.Map(NewLine(), dto);

        dto.Name.ShouldBe("Personel");
        dto.SpentAmount.ShouldBe(1m);
        dto.IncomeAmount.ShouldBe(2m);
        dto.LinkedRecordCount.ShouldBe(3);
        dto.Depth.ShouldBe(4);
        dto.HasChildren.ShouldBeTrue();
        dto.GrantShare.ShouldBe(5m);
        dto.TotalPlannedAmount.ShouldBe(6m);
        dto.TotalApprovedAmount.ShouldBe(7m);
        dto.TotalSpentAmount.ShouldBe(8m);
        dto.TotalGrantShare.ShouldBe(9m);
    }

    [Fact]
    public void Kesinti_alanlari_tasinir_revizyon_numarasi_bos_kalir()
    {
        var revisionId = Guid.NewGuid();
        var deduction = NewTranche().Deductions.First();
        deduction.MarkAppliedToBudget(revisionId);

        var dto = _objectMapper.Map<TrancheDeduction, TrancheDeductionDto>(deduction);

        dto.Id.ShouldBe(deduction.Id);
        dto.TrancheId.ShouldBe(deduction.TrancheId);
        dto.Amount.ShouldBe(100m);
        dto.Reason.ShouldBe("Eksik belge");
        dto.DeductionDate.ShouldBe(new DateTime(2026, 3, 1));
        dto.Resolution.ShouldBe(DeductionResolution.AppliedToBudget);
        dto.BudgetRevisionId.ShouldBe(revisionId);
        dto.BudgetRevisionNo.ShouldBeNull();

        var existing = new TrancheDeductionDto { BudgetRevisionNo = 4 };
        _objectMapper.Map(deduction, existing);
        existing.Amount.ShouldBe(100m);
        existing.BudgetRevisionNo.ShouldBe(4);
    }

    [Fact]
    public void Dilim_hesaplanan_tutarlari_ve_ic_ice_kesintileri_tasir()
    {
        var tranche = NewTranche();
        tranche.Deductions.First().MarkAppliedToBudget(Guid.NewGuid());

        var dto = _objectMapper.Map<FundingTranche, FundingTrancheDto>(tranche);

        dto.Id.ShouldBe(tranche.Id);
        dto.ProjectId.ShouldBe(ProjectId);
        dto.SequenceNo.ShouldBe(2);
        dto.Title.ShouldBe("İkinci dilim");
        dto.PlannedDate.ShouldBe(new DateTime(2026, 2, 1));
        dto.PlannedAmount.ShouldBe(1000m);
        dto.ReceivedAmount.ShouldBe(400m);
        dto.ReceivedDate.ShouldBe(new DateTime(2026, 4, 1));
        dto.Status.ShouldBe(tranche.Status);
        dto.IncomeEntryId.ShouldBe(tranche.IncomeEntryId);
        dto.Note.ShouldBe("Not");
        dto.DeductionTotal.ShouldBe(150m);
        dto.ExpectedAmount.ShouldBe(850m);
        dto.OutstandingAmount.ShouldBe(450m);

        dto.Deductions.Select(x => x.Id).ShouldBe(tranche.Deductions.Select(x => x.Id));
        dto.Deductions.Select(x => x.Amount).ShouldBe(new[] { 100m, 50m });
        dto.Deductions.ShouldAllBe(x => x.BudgetRevisionNo == null);
    }

    [Fact]
    public void Var_olan_dilim_DTOsunda_kesintiler_birikmez()
    {
        var tranche = NewTranche();
        var dto = new FundingTrancheDto();
        dto.Deductions.Add(new TrancheDeductionDto { Id = Guid.NewGuid(), Amount = 999m });

        _objectMapper.Map(tranche, dto);

        dto.Deductions.Select(x => x.Id).ShouldBe(tranche.Deductions.Select(x => x.Id));
    }

    [Fact]
    public void Revizyon_net_farki_ve_ic_ice_satirlari_tasir()
    {
        var revision = NewRevision();
        var firstLine = revision.Lines.First();

        var dto = _objectMapper.Map<BudgetRevision, BudgetRevisionDto>(revision);

        dto.Id.ShouldBe(revision.Id);
        dto.ProjectId.ShouldBe(ProjectId);
        dto.RevisionNo.ShouldBe(3);
        dto.Reason.ShouldBe("Kesinti");
        dto.EffectiveDate.ShouldBe(new DateTime(2026, 5, 1));
        dto.TotalApprovedAmount.ShouldBe(900m);
        dto.NetDelta.ShouldBe(-10m);

        dto.Lines.Count.ShouldBe(2);
        dto.Lines[0].Id.ShouldBe(firstLine.Id);
        dto.Lines[0].BudgetLineId.ShouldBe(firstLine.BudgetLineId);
        dto.Lines[0].PreviousAmount.ShouldBe(100m);
        dto.Lines[0].NewAmount.ShouldBe(80m);
        dto.Lines[0].Delta.ShouldBe(-20m);
        dto.Lines.ShouldAllBe(x => x.BudgetLineName == string.Empty);
    }

    [Fact]
    public void Var_olan_revizyon_DTOsunda_satirlar_birikmez()
    {
        var revision = NewRevision();
        var dto = new BudgetRevisionDto();
        dto.Lines.Add(new BudgetRevisionLineDto { Id = Guid.NewGuid(), BudgetLineName = "Eski" });

        _objectMapper.Map(revision, dto);

        dto.Lines.Select(x => x.Id).ShouldBe(revision.Lines.Select(x => x.Id));
    }

    [Fact]
    public void Revizyon_satiri_kalem_adini_bos_birakir_var_olani_korur()
    {
        var line = NewRevision().Lines.First();

        _objectMapper.Map<BudgetRevisionLine, BudgetRevisionLineDto>(line).BudgetLineName.ShouldBe(string.Empty);

        var existing = new BudgetRevisionLineDto { BudgetLineName = "Personel" };
        _objectMapper.Map(line, existing);
        existing.BudgetLineName.ShouldBe("Personel");
        existing.NewAmount.ShouldBe(80m);
    }

    private static ProjectBudgetLine NewLine()
    {
        var line = new ProjectBudgetLine(Guid.NewGuid(), TenantId, ProjectId, "2.1", "Personel", 1000m, 800m, 7, 15m);
        line.SetJustification("Gerekçe");
        line.SetGrantAmount(300m);
        line.LinkToGrantLine(Guid.NewGuid());
        Invoke(line, "SetParent", (Guid?)Guid.NewGuid());
        return line;
    }

    private static FundingTranche NewTranche()
    {
        var tranche = new FundingTranche(
            Guid.NewGuid(), TenantId, ProjectId, 2, 1000m, new DateTime(2026, 2, 1), "İkinci dilim", "Not");
        tranche.AddDeduction(Guid.NewGuid(), 100m, "Eksik belge", new DateTime(2026, 3, 1));
        tranche.AddDeduction(Guid.NewGuid(), 50m, "Geç teslim", new DateTime(2026, 3, 2));
        tranche.RegisterCollection(400m, new DateTime(2026, 4, 1), Guid.NewGuid());
        return tranche;
    }

    private static BudgetRevision NewRevision()
    {
        var revision = new BudgetRevision(Guid.NewGuid(), TenantId, ProjectId, 3, "Kesinti", new DateTime(2026, 5, 1));
        Invoke(revision, "AddLine", Guid.NewGuid(), Guid.NewGuid(), 100m, 80m);
        Invoke(revision, "AddLine", Guid.NewGuid(), Guid.NewGuid(), 50m, 60m);
        Invoke(revision, "SealTotal", 900m);
        return revision;
    }

    // AddLine/SealTotal/SetParent internal: yalnız ProjectBudgetManager çağırır.
    private static void Invoke(object target, string method, params object?[] arguments)
    {
        target.GetType().GetMethod(method, BindingFlags.Instance | BindingFlags.NonPublic)!.Invoke(target, arguments);
    }
}
