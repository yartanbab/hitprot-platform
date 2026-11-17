using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace Apya.Platform.Expenses;

/* AutoMapper'dan taşındı (ABP çıkışı, Faz 1 finans kümesi). Davranış eski CreateMap ile aynı:
   aynı adlı üyeler kopyalanır, karşılığı olmayan hedef üyeler olduğu gibi kalır. */

[Mapper]
public partial class ExpenseToExpenseDtoMapper : MapperBase<Expense, ExpenseDto>
{
    [MapperIgnoreSource(nameof(Expense.ExtraProperties))]
    [MapperIgnoreSource(nameof(Expense.ConcurrencyStamp))]
    [MapperIgnoreTarget(nameof(ExpenseDto.CashAccountName))]
    [MapperIgnoreTarget(nameof(ExpenseDto.Documents))]
    [NamedMapping("ExpenseToExpenseDto")]
    public override partial ExpenseDto Map(Expense source);

    [IncludeMappingConfiguration("ExpenseToExpenseDto")]
    public override partial void Map(Expense source, ExpenseDto destination);
}

/* Varlığın korumalı parametresiz kurucusu kullanılır (AutoMapper da onu kullanıyordu).
   Kimlik, kiracı, denetim alanları ve eşzamanlılık damgası girişten YAZILMAZ: onları
   CrudAppService ve ABP doldurur; güncellemede var olan değerler korunur. */
[Mapper(IncludedConstructors = MemberVisibility.All)]
public partial class CreateUpdateExpenseDtoToExpenseMapper : MapperBase<CreateUpdateExpenseDto, Expense>
{
    [MapperIgnoreTarget(nameof(Expense.TenantId))]
    [MapperIgnoreTarget(nameof(Expense.CreationTime))]
    [MapperIgnoreTarget(nameof(Expense.CreatorId))]
    [MapperIgnoreTarget(nameof(Expense.LastModificationTime))]
    [MapperIgnoreTarget(nameof(Expense.LastModifierId))]
    [MapperIgnoreTarget(nameof(Expense.IsDeleted))]
    [MapperIgnoreTarget(nameof(Expense.DeleterId))]
    [MapperIgnoreTarget(nameof(Expense.DeletionTime))]
    [MapperIgnoreTarget(nameof(Expense.ConcurrencyStamp))]
    [MapperIgnoreTarget(nameof(Expense.BookAmount))]
    [MapperIgnoreTarget(nameof(Expense.BookRate))]
    [MapperIgnoreTarget(nameof(Expense.DonorAmount))]
    [MapperIgnoreTarget(nameof(Expense.DonorRate))]
    [MapperIgnoreTarget(nameof(Expense.RateLocked))]
    [NamedMapping("CreateUpdateExpenseDtoToExpense")]
    public override partial Expense Map(CreateUpdateExpenseDto source);

    [IncludeMappingConfiguration("CreateUpdateExpenseDtoToExpense")]
    public override partial void Map(CreateUpdateExpenseDto source, Expense destination);
}
