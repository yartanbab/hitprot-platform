using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace Apya.Platform.CashMovements;

/* AutoMapper'dan taşındı (ABP çıkışı, Faz 1 finans kümesi). Davranış eski CreateMap ile aynı:
   aynı adlı üyeler kopyalanır, karşılığı olmayan hedef üyeler olduğu gibi kalır. */

[Mapper]
public partial class CashMovementToCashMovementDtoMapper : MapperBase<CashMovement, CashMovementDto>
{
    [MapperIgnoreSource(nameof(CashMovement.ExtraProperties))]
    [MapperIgnoreSource(nameof(CashMovement.ConcurrencyStamp))]
    [MapperIgnoreSource(nameof(CashMovement.SignedAmount))]
    [MapperIgnoreTarget(nameof(CashMovementDto.CashAccountName))]
    [NamedMapping("CashMovementToCashMovementDto")]
    public override partial CashMovementDto Map(CashMovement source);

    [IncludeMappingConfiguration("CashMovementToCashMovementDto")]
    public override partial void Map(CashMovement source, CashMovementDto destination);
}

/* Varlığın korumalı parametresiz kurucusu kullanılır (AutoMapper da onu kullanıyordu).
   Kimlik, kiracı, denetim alanları ve eşzamanlılık damgası girişten YAZILMAZ: onları
   CrudAppService ve ABP doldurur; güncellemede var olan değerler korunur. */
[Mapper(IncludedConstructors = MemberVisibility.All)]
public partial class CreateUpdateCashMovementDtoToCashMovementMapper : MapperBase<CreateUpdateCashMovementDto, CashMovement>
{
    [MapperIgnoreTarget(nameof(CashMovement.TenantId))]
    [MapperIgnoreTarget(nameof(CashMovement.CreationTime))]
    [MapperIgnoreTarget(nameof(CashMovement.CreatorId))]
    [MapperIgnoreTarget(nameof(CashMovement.LastModificationTime))]
    [MapperIgnoreTarget(nameof(CashMovement.LastModifierId))]
    [MapperIgnoreTarget(nameof(CashMovement.IsDeleted))]
    [MapperIgnoreTarget(nameof(CashMovement.DeleterId))]
    [MapperIgnoreTarget(nameof(CashMovement.DeletionTime))]
    [MapperIgnoreTarget(nameof(CashMovement.ConcurrencyStamp))]
    [MapperIgnoreTarget(nameof(CashMovement.Source))]
    [MapperIgnoreTarget(nameof(CashMovement.ReferenceId))]
    [NamedMapping("CreateUpdateCashMovementDtoToCashMovement")]
    public override partial CashMovement Map(CreateUpdateCashMovementDto source);

    [IncludeMappingConfiguration("CreateUpdateCashMovementDtoToCashMovement")]
    public override partial void Map(CreateUpdateCashMovementDto source, CashMovement destination);
}
