using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace Apya.Platform.Incomes;

/* AutoMapper'dan taşındı (ABP çıkışı, Faz 1 finans kümesi). Davranış eski CreateMap ile aynı:
   aynı adlı üyeler kopyalanır, karşılığı olmayan hedef üyeler olduğu gibi kalır. */

[Mapper]
public partial class IncomeEntryToIncomeEntryDtoMapper : MapperBase<IncomeEntry, IncomeEntryDto>
{
    [MapperIgnoreSource(nameof(IncomeEntry.ExtraProperties))]
    [MapperIgnoreSource(nameof(IncomeEntry.ConcurrencyStamp))]
    [MapperIgnoreTarget(nameof(IncomeEntryDto.CashAccountName))]
    [MapperIgnoreTarget(nameof(IncomeEntryDto.Documents))]
    [NamedMapping("IncomeEntryToIncomeEntryDto")]
    public override partial IncomeEntryDto Map(IncomeEntry source);

    [IncludeMappingConfiguration("IncomeEntryToIncomeEntryDto")]
    public override partial void Map(IncomeEntry source, IncomeEntryDto destination);
}

/* Varlığın korumalı parametresiz kurucusu kullanılır (AutoMapper da onu kullanıyordu).
   Kimlik, kiracı, denetim alanları ve eşzamanlılık damgası girişten YAZILMAZ: onları
   CrudAppService ve ABP doldurur; güncellemede var olan değerler korunur. */
[Mapper(IncludedConstructors = MemberVisibility.All)]
public partial class CreateUpdateIncomeEntryDtoToIncomeEntryMapper : MapperBase<CreateUpdateIncomeEntryDto, IncomeEntry>
{
    [MapperIgnoreTarget(nameof(IncomeEntry.TenantId))]
    [MapperIgnoreTarget(nameof(IncomeEntry.CreationTime))]
    [MapperIgnoreTarget(nameof(IncomeEntry.CreatorId))]
    [MapperIgnoreTarget(nameof(IncomeEntry.LastModificationTime))]
    [MapperIgnoreTarget(nameof(IncomeEntry.LastModifierId))]
    [MapperIgnoreTarget(nameof(IncomeEntry.IsDeleted))]
    [MapperIgnoreTarget(nameof(IncomeEntry.DeleterId))]
    [MapperIgnoreTarget(nameof(IncomeEntry.DeletionTime))]
    [MapperIgnoreTarget(nameof(IncomeEntry.ConcurrencyStamp))]
    [MapperIgnoreTarget(nameof(IncomeEntry.BookAmount))]
    [MapperIgnoreTarget(nameof(IncomeEntry.BookRate))]
    [MapperIgnoreTarget(nameof(IncomeEntry.DonorAmount))]
    [MapperIgnoreTarget(nameof(IncomeEntry.DonorRate))]
    [MapperIgnoreTarget(nameof(IncomeEntry.RateLocked))]
    [NamedMapping("CreateUpdateIncomeEntryDtoToIncomeEntry")]
    public override partial IncomeEntry Map(CreateUpdateIncomeEntryDto source);

    [IncludeMappingConfiguration("CreateUpdateIncomeEntryDtoToIncomeEntry")]
    public override partial void Map(CreateUpdateIncomeEntryDto source, IncomeEntry destination);
}
