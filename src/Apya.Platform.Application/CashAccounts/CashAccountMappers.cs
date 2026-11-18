using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace Apya.Platform.CashAccounts;

/* AutoMapper'dan taşındı (ABP çıkışı, Faz 1 finans kümesi). Davranış eski CreateMap ile aynı:
   aynı adlı üyeler kopyalanır, karşılığı olmayan hedef üyeler olduğu gibi kalır. */

[Mapper]
public partial class CashAccountToCashAccountDtoMapper : MapperBase<CashAccount, CashAccountDto>
{
    [MapperIgnoreSource(nameof(CashAccount.ExtraProperties))]
    [MapperIgnoreSource(nameof(CashAccount.ConcurrencyStamp))]
    [NamedMapping("CashAccountToCashAccountDto")]
    public override partial CashAccountDto Map(CashAccount source);

    [IncludeMappingConfiguration("CashAccountToCashAccountDto")]
    public override partial void Map(CashAccount source, CashAccountDto destination);
}

/* Varlığın korumalı parametresiz kurucusu kullanılır (AutoMapper da onu kullanıyordu).
   Kimlik, kiracı, denetim alanları ve eşzamanlılık damgası girişten YAZILMAZ: onları
   CrudAppService ve ABP doldurur; güncellemede var olan değerler korunur. */
[Mapper(IncludedConstructors = MemberVisibility.All)]
public partial class CreateUpdateCashAccountDtoToCashAccountMapper : MapperBase<CreateUpdateCashAccountDto, CashAccount>
{
    [MapperIgnoreTarget(nameof(CashAccount.CreationTime))]
    [MapperIgnoreTarget(nameof(CashAccount.CreatorId))]
    [MapperIgnoreTarget(nameof(CashAccount.LastModificationTime))]
    [MapperIgnoreTarget(nameof(CashAccount.LastModifierId))]
    [MapperIgnoreTarget(nameof(CashAccount.IsDeleted))]
    [MapperIgnoreTarget(nameof(CashAccount.DeleterId))]
    [MapperIgnoreTarget(nameof(CashAccount.DeletionTime))]
    [MapperIgnoreTarget(nameof(CashAccount.ConcurrencyStamp))]
    [NamedMapping("CreateUpdateCashAccountDtoToCashAccount")]
    public override partial CashAccount Map(CreateUpdateCashAccountDto source);

    [IncludeMappingConfiguration("CreateUpdateCashAccountDtoToCashAccount")]
    public override partial void Map(CreateUpdateCashAccountDto source, CashAccount destination);
}
