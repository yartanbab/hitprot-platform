using Apya.Platform.ProjectBudgets.Dtos;
using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace Apya.Platform.ProjectBudgets;

/* AutoMapper'dan taşındı (ABP çıkışı, bütçe kümesi). Davranış eski CreateMap ile aynı:
   aynı adlı üyeler kopyalanır, yok sayılan hedef üyeleri ProjectBudgetAppService doldurur.
   Yok sayılan kaynak üyelerinin (kiracı, denetim, kaynak bağı) DTO'da karşılığı yoktur. */

[Mapper]
public partial class ProjectBudgetLineToProjectBudgetLineDtoMapper : MapperBase<ProjectBudgetLine, ProjectBudgetLineDto>
{
    [MapperIgnoreSource(nameof(ProjectBudgetLine.TenantId))]
    [MapperIgnoreSource(nameof(ProjectBudgetLine.SourceGrantLineId))]
    [MapperIgnoreSource(nameof(ProjectBudgetLine.CreationTime))]
    [MapperIgnoreSource(nameof(ProjectBudgetLine.CreatorId))]
    [MapperIgnoreSource(nameof(ProjectBudgetLine.LastModificationTime))]
    [MapperIgnoreSource(nameof(ProjectBudgetLine.LastModifierId))]
    [MapperIgnoreSource(nameof(ProjectBudgetLine.IsDeleted))]
    [MapperIgnoreSource(nameof(ProjectBudgetLine.DeleterId))]
    [MapperIgnoreSource(nameof(ProjectBudgetLine.DeletionTime))]
    [MapperIgnoreSource(nameof(ProjectBudgetLine.ExtraProperties))]
    [MapperIgnoreSource(nameof(ProjectBudgetLine.ConcurrencyStamp))]
    [MapperIgnoreTarget(nameof(ProjectBudgetLineDto.SpentAmount))]
    [MapperIgnoreTarget(nameof(ProjectBudgetLineDto.IncomeAmount))]
    [MapperIgnoreTarget(nameof(ProjectBudgetLineDto.LinkedRecordCount))]
    [MapperIgnoreTarget(nameof(ProjectBudgetLineDto.Depth))]
    [MapperIgnoreTarget(nameof(ProjectBudgetLineDto.HasChildren))]
    [MapperIgnoreTarget(nameof(ProjectBudgetLineDto.GrantShare))]
    [MapperIgnoreTarget(nameof(ProjectBudgetLineDto.TotalPlannedAmount))]
    [MapperIgnoreTarget(nameof(ProjectBudgetLineDto.TotalApprovedAmount))]
    [MapperIgnoreTarget(nameof(ProjectBudgetLineDto.TotalSpentAmount))]
    [MapperIgnoreTarget(nameof(ProjectBudgetLineDto.TotalGrantShare))]
    [NamedMapping("ProjectBudgetLineToProjectBudgetLineDto")]
    public override partial ProjectBudgetLineDto Map(ProjectBudgetLine source);

    [IncludeMappingConfiguration("ProjectBudgetLineToProjectBudgetLineDto")]
    public override partial void Map(ProjectBudgetLine source, ProjectBudgetLineDto destination);
}

/* BudgetRevisionNo başka bir aggregate'ten gelir (AppService doldurur). */
[Mapper]
public partial class TrancheDeductionToTrancheDeductionDtoMapper : MapperBase<TrancheDeduction, TrancheDeductionDto>
{
    [MapperIgnoreSource(nameof(TrancheDeduction.TenantId))]
    [MapperIgnoreSource(nameof(TrancheDeduction.CreationTime))]
    [MapperIgnoreSource(nameof(TrancheDeduction.CreatorId))]
    [MapperIgnoreSource(nameof(TrancheDeduction.LastModificationTime))]
    [MapperIgnoreSource(nameof(TrancheDeduction.LastModifierId))]
    [MapperIgnoreSource(nameof(TrancheDeduction.IsDeleted))]
    [MapperIgnoreSource(nameof(TrancheDeduction.DeleterId))]
    [MapperIgnoreSource(nameof(TrancheDeduction.DeletionTime))]
    [MapperIgnoreTarget(nameof(TrancheDeductionDto.BudgetRevisionNo))]
    [NamedMapping("TrancheDeductionToTrancheDeductionDto")]
    public override partial TrancheDeductionDto Map(TrancheDeduction source);

    [IncludeMappingConfiguration("TrancheDeductionToTrancheDeductionDto")]
    public override partial void Map(TrancheDeduction source, TrancheDeductionDto destination);
}

/* DeductionTotal/ExpectedAmount varlıkta hesaplanır, adları eştiği için taşınır.
   Kesintiler UseMapper ile yukarıdaki eşleyiciden geçer: kurallar tek yerde kalır. */
[Mapper]
public partial class FundingTrancheToFundingTrancheDtoMapper : MapperBase<FundingTranche, FundingTrancheDto>
{
    [UseMapper]
    private readonly TrancheDeductionToTrancheDeductionDtoMapper _deductionMapper = new();

    [MapperIgnoreSource(nameof(FundingTranche.TenantId))]
    [MapperIgnoreSource(nameof(FundingTranche.SourceGrantTrancheId))]
    [MapperIgnoreSource(nameof(FundingTranche.CreationTime))]
    [MapperIgnoreSource(nameof(FundingTranche.CreatorId))]
    [MapperIgnoreSource(nameof(FundingTranche.LastModificationTime))]
    [MapperIgnoreSource(nameof(FundingTranche.LastModifierId))]
    [MapperIgnoreSource(nameof(FundingTranche.IsDeleted))]
    [MapperIgnoreSource(nameof(FundingTranche.DeleterId))]
    [MapperIgnoreSource(nameof(FundingTranche.DeletionTime))]
    [MapperIgnoreSource(nameof(FundingTranche.ExtraProperties))]
    [MapperIgnoreSource(nameof(FundingTranche.ConcurrencyStamp))]
    [NamedMapping("FundingTrancheToFundingTrancheDto")]
    public override partial FundingTrancheDto Map(FundingTranche source);

    [IncludeMappingConfiguration("FundingTrancheToFundingTrancheDto")]
    public override partial void Map(FundingTranche source, FundingTrancheDto destination);
}

/* BudgetLineName kalemden gelir (AppService doldurur). Delta iki tarafta da hesaplanır. */
[Mapper]
public partial class BudgetRevisionLineToBudgetRevisionLineDtoMapper : MapperBase<BudgetRevisionLine, BudgetRevisionLineDto>
{
    [MapperIgnoreSource(nameof(BudgetRevisionLine.TenantId))]
    [MapperIgnoreSource(nameof(BudgetRevisionLine.BudgetRevisionId))]
    [MapperIgnoreSource(nameof(BudgetRevisionLine.Delta))]
    [MapperIgnoreTarget(nameof(BudgetRevisionLineDto.Delta))]
    [MapperIgnoreTarget(nameof(BudgetRevisionLineDto.BudgetLineName))]
    [NamedMapping("BudgetRevisionLineToBudgetRevisionLineDto")]
    public override partial BudgetRevisionLineDto Map(BudgetRevisionLine source);

    [IncludeMappingConfiguration("BudgetRevisionLineToBudgetRevisionLineDto")]
    public override partial void Map(BudgetRevisionLine source, BudgetRevisionLineDto destination);
}

/* Satırlar UseMapper ile yukarıdaki eşleyiciden geçer: kurallar tek yerde kalır. */
[Mapper]
public partial class BudgetRevisionToBudgetRevisionDtoMapper : MapperBase<BudgetRevision, BudgetRevisionDto>
{
    [UseMapper]
    private readonly BudgetRevisionLineToBudgetRevisionLineDtoMapper _lineMapper = new();

    [MapperIgnoreSource(nameof(BudgetRevision.TenantId))]
    [MapperIgnoreSource(nameof(BudgetRevision.CreationTime))]
    [MapperIgnoreSource(nameof(BudgetRevision.CreatorId))]
    [MapperIgnoreSource(nameof(BudgetRevision.LastModificationTime))]
    [MapperIgnoreSource(nameof(BudgetRevision.LastModifierId))]
    [MapperIgnoreSource(nameof(BudgetRevision.IsDeleted))]
    [MapperIgnoreSource(nameof(BudgetRevision.DeleterId))]
    [MapperIgnoreSource(nameof(BudgetRevision.DeletionTime))]
    [MapperIgnoreSource(nameof(BudgetRevision.ExtraProperties))]
    [MapperIgnoreSource(nameof(BudgetRevision.ConcurrencyStamp))]
    [NamedMapping("BudgetRevisionToBudgetRevisionDto")]
    public override partial BudgetRevisionDto Map(BudgetRevision source);

    [IncludeMappingConfiguration("BudgetRevisionToBudgetRevisionDto")]
    public override partial void Map(BudgetRevision source, BudgetRevisionDto destination);
}
