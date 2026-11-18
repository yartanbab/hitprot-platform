using System;
using Volo.Abp.AutoMapper;
using Volo.Abp.Mapperly;
using Volo.Abp.ObjectMapping;

namespace Apya.Platform;

/// <summary>
/// AutoMapper → Mapperly geçiş köprüsü (ABP çıkışı, Faz 1). Bir tür çifti için Mapperly eşleyicisi
/// (<see cref="MapperBase{TSource,TDestination}"/>) varsa onu, yoksa AutoMapper profilini kullanır.
/// </summary>
/// <remarks>
/// Neden gerekli: <c>MapperBase</c> sınıfları DI'a <c>IObjectMapper&lt;S,D&gt;</c> olarak DEĞİL
/// <c>IAbpMapperlyMapper&lt;S,D&gt;</c> olarak kaydolur. ABP'nin <c>DefaultObjectMapper</c>'ı özel
/// eşleyici bulamayınca uygulama genelindeki tek <see cref="IAutoObjectMappingProvider"/>'a düşer ve
/// o da AutoMapper'dır; Mapperly eşleyicileri hiç çağrılmaz. Tüm eşlemeler Mapperly'ye geçince bu
/// sınıf silinir, yerine <c>AddMapperlyObjectMapper()</c> konur.
/// </remarks>
public class MapperlyFirstAutoObjectMappingProvider : IAutoObjectMappingProvider
{
    private readonly IServiceProvider _serviceProvider;
    private readonly MapperlyAutoObjectMappingProvider _mapperly;
    private readonly AutoMapperAutoObjectMappingProvider _autoMapper;

    public MapperlyFirstAutoObjectMappingProvider(IServiceProvider serviceProvider, IMapperAccessor mapperAccessor)
    {
        _serviceProvider = serviceProvider;
        _mapperly = new MapperlyAutoObjectMappingProvider(serviceProvider);
        _autoMapper = new AutoMapperAutoObjectMappingProvider(mapperAccessor);
    }

    public TDestination Map<TSource, TDestination>(object source)
    {
        return HasMapperlyMapper<TSource, TDestination>()
            ? _mapperly.Map<TSource, TDestination>(source)
            : _autoMapper.Map<TSource, TDestination>(source);
    }

    public TDestination Map<TSource, TDestination>(TSource source, TDestination destination)
    {
        return HasMapperlyMapper<TSource, TDestination>()
            ? _mapperly.Map(source, destination)
            : _autoMapper.Map(source, destination);
    }

    // Liste eşlemesinde (List<S> → List<D>) Mapperly sağlayıcısı öğe eşleyicisini kullanır; karar da öğe türüne bakar.
    private bool HasMapperlyMapper<TSource, TDestination>()
    {
        var sourceType = typeof(TSource);
        var destinationType = typeof(TDestination);
        if (ObjectMappingHelper.IsCollectionGenericType<TSource, TDestination>(
                out var sourceElementType, out var destinationElementType, out _))
        {
            sourceType = sourceElementType;
            destinationType = destinationElementType;
        }

        var mapperType = typeof(IAbpMapperlyMapper<,>).MakeGenericType(sourceType, destinationType);
        return _serviceProvider.GetService(mapperType) != null;
    }
}
