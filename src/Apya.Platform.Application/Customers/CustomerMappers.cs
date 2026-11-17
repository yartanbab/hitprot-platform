using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace Apya.Platform.Customers;

/* AutoMapper'dan taşındı (ABP çıkışı, Faz 1 finans kümesi). Davranış eski CreateMap ile aynı:
   aynı adlı üyeler kopyalanır, karşılığı olmayan hedef üyeler olduğu gibi kalır. */

[Mapper]
public partial class CustomerToCustomerDtoMapper : MapperBase<Customer, CustomerDto>
{
    [MapperIgnoreSource(nameof(Customer.ExtraProperties))]
    [MapperIgnoreSource(nameof(Customer.ConcurrencyStamp))]
    [MapperIgnoreTarget(nameof(CustomerDto.Balance))]
    [NamedMapping("CustomerToCustomerDto")]
    public override partial CustomerDto Map(Customer source);

    [IncludeMappingConfiguration("CustomerToCustomerDto")]
    public override partial void Map(Customer source, CustomerDto destination);
}

/* Varlığın korumalı parametresiz kurucusu kullanılır (AutoMapper da onu kullanıyordu).
   Kimlik, kiracı, denetim alanları ve eşzamanlılık damgası girişten YAZILMAZ: onları
   CrudAppService ve ABP doldurur; güncellemede var olan değerler korunur. */
[Mapper(IncludedConstructors = MemberVisibility.All)]
public partial class CreateUpdateCustomerDtoToCustomerMapper : MapperBase<CreateUpdateCustomerDto, Customer>
{
    [MapperIgnoreTarget(nameof(Customer.TenantId))]
    [MapperIgnoreTarget(nameof(Customer.CreationTime))]
    [MapperIgnoreTarget(nameof(Customer.CreatorId))]
    [MapperIgnoreTarget(nameof(Customer.LastModificationTime))]
    [MapperIgnoreTarget(nameof(Customer.LastModifierId))]
    [MapperIgnoreTarget(nameof(Customer.IsDeleted))]
    [MapperIgnoreTarget(nameof(Customer.DeleterId))]
    [MapperIgnoreTarget(nameof(Customer.DeletionTime))]
    [MapperIgnoreTarget(nameof(Customer.ConcurrencyStamp))]
    [NamedMapping("CreateUpdateCustomerDtoToCustomer")]
    public override partial Customer Map(CreateUpdateCustomerDto source);

    [IncludeMappingConfiguration("CreateUpdateCustomerDtoToCustomer")]
    public override partial void Map(CreateUpdateCustomerDto source, Customer destination);
}
