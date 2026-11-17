using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace Apya.Platform.ExchangeRates;

/* AutoMapper'dan taşındı (ABP çıkışı, Faz 1 finans kümesi). Davranış eski CreateMap ile aynı:
   aynı adlı üyeler kopyalanır, karşılığı olmayan hedef üyeler olduğu gibi kalır. */

[Mapper]
public partial class ExchangeRateToExchangeRateDtoMapper : MapperBase<ExchangeRate, ExchangeRateDto>
{
    [MapperIgnoreSource(nameof(ExchangeRate.ExtraProperties))]
    [MapperIgnoreSource(nameof(ExchangeRate.ConcurrencyStamp))]
    [NamedMapping("ExchangeRateToExchangeRateDto")]
    public override partial ExchangeRateDto Map(ExchangeRate source);

    [IncludeMappingConfiguration("ExchangeRateToExchangeRateDto")]
    public override partial void Map(ExchangeRate source, ExchangeRateDto destination);
}

/* Varlığın korumalı parametresiz kurucusu kullanılır (AutoMapper da onu kullanıyordu).
   Kimlik, kiracı, denetim alanları ve eşzamanlılık damgası girişten YAZILMAZ: onları
   CrudAppService ve ABP doldurur; güncellemede var olan değerler korunur. */
[Mapper(IncludedConstructors = MemberVisibility.All)]
public partial class CreateUpdateExchangeRateDtoToExchangeRateMapper : MapperBase<CreateUpdateExchangeRateDto, ExchangeRate>
{
    [MapperIgnoreTarget(nameof(ExchangeRate.TenantId))]
    [MapperIgnoreTarget(nameof(ExchangeRate.CreationTime))]
    [MapperIgnoreTarget(nameof(ExchangeRate.CreatorId))]
    [MapperIgnoreTarget(nameof(ExchangeRate.LastModificationTime))]
    [MapperIgnoreTarget(nameof(ExchangeRate.LastModifierId))]
    [MapperIgnoreTarget(nameof(ExchangeRate.IsDeleted))]
    [MapperIgnoreTarget(nameof(ExchangeRate.DeleterId))]
    [MapperIgnoreTarget(nameof(ExchangeRate.DeletionTime))]
    [MapperIgnoreTarget(nameof(ExchangeRate.ConcurrencyStamp))]
    [MapperIgnoreTarget(nameof(ExchangeRate.Source))]
    [NamedMapping("CreateUpdateExchangeRateDtoToExchangeRate")]
    public override partial ExchangeRate Map(CreateUpdateExchangeRateDto source);

    [IncludeMappingConfiguration("CreateUpdateExchangeRateDtoToExchangeRate")]
    public override partial void Map(CreateUpdateExchangeRateDto source, ExchangeRate destination);
}
