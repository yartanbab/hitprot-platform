using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Customers;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using AutoMapper;
using AutoMapper.Internal;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Mapperly;
using Volo.Abp.ObjectMapping;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.ObjectMapping;

/// <summary>
/// SÖZLEŞME: finans kümesinin 12 eşlemesi AutoMapper'dan değil Mapperly'den gelir ve eski
/// AutoMapper davranışını korur — aynı adlı her üye kopyalanır; giriş DTO'su var olan varlığa
/// eşlenirken kimlik, kiracı, denetim alanları, eşzamanlılık damgası, ek özellikler ve DTO'da
/// karşılığı olmayan her alan olduğu gibi kalır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FinanceMapperly_Tests : PlatformEntityFrameworkCoreTestBase
{
    // Varlık, DTO, giriş DTO'su ve DTO'da olup varlıkta olmayan (servisin doldurduğu) alanlar.
    private static readonly Dictionary<string, (Type Entity, Type Dto, Type Input, string[] DtoOnly)> Pairs = new()
    {
        ["Customer"] = (typeof(Customer), typeof(CustomerDto), typeof(CreateUpdateCustomerDto), new[] { "Balance" }),
        ["CashAccount"] = (typeof(CashAccount), typeof(CashAccountDto), typeof(CreateUpdateCashAccountDto), Array.Empty<string>()),
        ["ExchangeRate"] = (typeof(ExchangeRate), typeof(ExchangeRateDto), typeof(CreateUpdateExchangeRateDto), Array.Empty<string>()),
        ["CashMovement"] = (typeof(CashMovement), typeof(CashMovementDto), typeof(CreateUpdateCashMovementDto), new[] { "CashAccountName" }),
        ["Expense"] = (typeof(Expense), typeof(ExpenseDto), typeof(CreateUpdateExpenseDto), new[] { "CashAccountName", "Documents" }),
        ["IncomeEntry"] = (typeof(IncomeEntry), typeof(IncomeEntryDto), typeof(CreateUpdateIncomeEntryDto), new[] { "CashAccountName", "Documents" }),
    };

    public static TheoryData<string> PairNames => new(Pairs.Keys);

    private static readonly string[] AuditMembers =
    {
        "Id", "TenantId", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId",
        "IsDeleted", "DeleterId", "DeletionTime", "ConcurrencyStamp",
    };

    private readonly IObjectMapper _objectMapper;

    public FinanceMapperly_Tests()
    {
        _objectMapper = GetRequiredService<IObjectMapper>();
    }

    [Fact]
    public void Genel_esleme_saglayicisi_once_Mapperlye_bakar()
    {
        GetRequiredService<IAutoObjectMappingProvider>().ShouldBeOfType<MapperlyFirstAutoObjectMappingProvider>();
    }

    [Theory]
    [MemberData(nameof(PairNames))]
    public void Esleme_AutoMapperda_degil_Mapperlyde_tanimli(string pair)
    {
        var (entity, dto, input, _) = Pairs[pair];
        var autoMapperPairs = GetRequiredService<IConfigurationProvider>().Internal().GetAllTypeMaps()
            .Select(x => (x.SourceType, x.DestinationType))
            .ToList();

        foreach (var (source, destination) in new[] { (entity, dto), (input, entity) })
        {
            autoMapperPairs.ShouldNotContain((source, destination));
            ServiceProvider.GetService(typeof(IAbpMapperlyMapper<,>).MakeGenericType(source, destination))
                .ShouldNotBeNull($"{source.Name} -> {destination.Name} için Mapperly eşleyicisi yok");
        }
    }

    [Theory]
    [MemberData(nameof(PairNames))]
    public void Varliktan_DTOya_butun_alanlar_tasinir(string pair)
    {
        var (entityType, dtoType, _, dtoOnly) = Pairs[pair];
        var entity = Fill(NewEntity(entityType), seed: 1);

        var dto = Map(new[] { entityType, dtoType }, entity);

        var compared = 0;
        foreach (var dtoProperty in SimpleProperties(dtoType).Where(x => !dtoOnly.Contains(x.Name)))
        {
            var entityProperty = entityType.GetProperty(dtoProperty.Name);
            entityProperty.ShouldNotBeNull($"{dtoType.Name}.{dtoProperty.Name} varlıkta yok");
            dtoProperty.GetValue(dto).ShouldBe(entityProperty.GetValue(entity), $"{dtoType.Name}.{dtoProperty.Name}");
            compared++;
        }

        compared.ShouldBeGreaterThan(AuditMembers.Length); // denetim alanları + en az bir iş alanı
        foreach (var name in dtoOnly)
        {
            var property = dtoType.GetProperty(name)!;
            var value = property.GetValue(dto);
            if (value is IList list)
            {
                list.Count.ShouldBe(0, $"{dtoType.Name}.{name}"); // Documents: servis doldurur
            }
            else
            {
                value.ShouldBe(DefaultOf(property.PropertyType), $"{dtoType.Name}.{name}");
            }
        }
    }

    [Theory]
    [MemberData(nameof(PairNames))]
    public void Liste_eslemesi_de_Mapperlyden_gelir(string pair)
    {
        var (entityType, dtoType, _, _) = Pairs[pair];
        var entity = Fill(NewEntity(entityType), seed: 1);
        var source = (IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(entityType))!;
        source.Add(entity);

        var result = (IList)Map(new[] { source.GetType(), typeof(List<>).MakeGenericType(dtoType) }, source);

        result.Count.ShouldBe(1);
        dtoType.GetProperty("Id")!.GetValue(result[0]).ShouldBe(entityType.GetProperty("Id")!.GetValue(entity));
    }

    [Theory]
    [MemberData(nameof(PairNames))]
    public void Giris_DTOsu_var_olan_varliga_eslenince_kimlik_kiraci_ve_denetim_alanlari_degismez(string pair)
    {
        var (entityType, _, inputType, _) = Pairs[pair];
        var entity = Fill(NewEntity(entityType), seed: 1);
        ((IHasExtraProperties)entity).ExtraProperties["Ek"] = "korunur";
        var before = Snapshot(entity);
        var input = Fill(Activator.CreateInstance(inputType)!, seed: 2);

        var returned = Map(new[] { inputType, entityType }, input, entity);

        returned.ShouldBeSameAs(entity);
        var inputNames = SimpleProperties(inputType).Select(x => x.Name).ToHashSet();
        AuditMembers.Where(inputNames.Contains).ShouldBeEmpty(); // girişte kimlik/denetim alanı yok
        foreach (var inputProperty in SimpleProperties(inputType))
        {
            entityType.GetProperty(inputProperty.Name)!.GetValue(entity)
                .ShouldBe(inputProperty.GetValue(input), $"{entityType.Name}.{inputProperty.Name} girişten gelmeli");
        }

        foreach (var (name, value) in before.Where(x => !inputNames.Contains(x.Key)))
        {
            entityType.GetProperty(name)!.GetValue(entity).ShouldBe(value, $"{entityType.Name}.{name} değişmemeli");
        }

        ((IHasExtraProperties)entity).ExtraProperties["Ek"].ShouldBe("korunur");
    }

    [Theory]
    [MemberData(nameof(PairNames))]
    public void Giris_DTOsundan_yeni_varlik_kimliksiz_ve_kiracisiz_kurulur(string pair)
    {
        var (entityType, _, inputType, _) = Pairs[pair];
        var input = Fill(Activator.CreateInstance(inputType)!, seed: 2);

        var entity = Map(new[] { inputType, entityType }, input);

        entity.ShouldBeOfType(entityType);
        foreach (var inputProperty in SimpleProperties(inputType))
        {
            entityType.GetProperty(inputProperty.Name)!.GetValue(entity)
                .ShouldBe(inputProperty.GetValue(input), $"{entityType.Name}.{inputProperty.Name}");
        }

        entityType.GetProperty("Id")!.GetValue(entity).ShouldBe(Guid.Empty);  // CrudAppService atar
        entityType.GetProperty("TenantId")!.GetValue(entity).ShouldBeNull();   // CrudAppService atar
        entityType.GetProperty("CreatorId")!.GetValue(entity).ShouldBeNull();
        ((IHasExtraProperties)entity).ExtraProperties.ShouldNotBeNull();       // korumalı kurucu çalıştı
        entityType.GetProperty("ConcurrencyStamp")!.GetValue(entity).ShouldNotBeNull();
    }

    /// <summary>Uygulama servislerinin kullandığı yol: <see cref="IObjectMapper"/>.Map&lt;S,D&gt;(...).</summary>
    private object Map(Type[] typeArguments, params object[] arguments)
    {
        var method = typeof(IObjectMapper).GetMethods()
            .Single(x => x.Name == nameof(IObjectMapper.Map) && x.IsGenericMethodDefinition
                         && x.GetParameters().Length == arguments.Length);
        return method.MakeGenericMethod(typeArguments).Invoke(_objectMapper, arguments)!;
    }

    private static object NewEntity(Type type) => Activator.CreateInstance(type, nonPublic: true)!;

    private static IEnumerable<PropertyInfo> SimpleProperties(Type type)
        => type.GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .Where(x => x.GetIndexParameters().Length == 0 && x.GetSetMethod(nonPublic: true) != null
                        && IsSimple(x.PropertyType));

    private static bool IsSimple(Type type)
    {
        type = Nullable.GetUnderlyingType(type) ?? type;
        return type.IsEnum || type == typeof(string) || type == typeof(Guid) || type == typeof(decimal)
               || type == typeof(DateTime) || type == typeof(bool) || type == typeof(int);
    }

    /// <summary>Her basit alana tohuma göre değişen, varsayılan olmayan bir değer yazar (korumalı setter'lar dahil).</summary>
    private static object Fill(object target, int seed)
    {
        foreach (var property in SimpleProperties(target.GetType()))
        {
            property.GetSetMethod(nonPublic: true)!.Invoke(target, new[] { Sample(property, seed) });
        }

        return target;
    }

    private static object Sample(PropertyInfo property, int seed)
    {
        var type = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;
        if (type.IsEnum)
        {
            var values = Enum.GetValues(type);
            return values.GetValue(seed % values.Length)!;
        }

        if (type == typeof(string)) return $"{property.Name}-{seed}";
        if (type == typeof(Guid)) return new Guid(seed, (short)property.Name.Length, 0, new byte[8]);
        if (type == typeof(decimal)) return seed + property.Name.Length / 100m;
        if (type == typeof(DateTime)) return new DateTime(2026, 1, 1).AddDays(seed * 10 + property.Name.Length);
        if (type == typeof(bool)) return seed % 2 == 0;
        return seed * 100 + property.Name.Length;
    }

    private static Dictionary<string, object?> Snapshot(object target)
        => SimpleProperties(target.GetType()).ToDictionary(x => x.Name, x => x.GetValue(target));

    private static object? DefaultOf(Type type) => type.IsValueType ? Activator.CreateInstance(type) : null;
}
