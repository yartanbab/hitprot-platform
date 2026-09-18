using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.DynamicAssets.ChoiceSources;

/// <summary>
/// 16 · Bir form alanının bağlanabileceği canlı liste. Her kaynak kendi kapsamını (<see cref="Scope"/>) ve
/// gerekiyorsa bağlı olduğu üst kaynağı bildirir; seçenekler form her açıldığında yeniden çözülür.
///
/// <para>Yeni kaynak eklemek için bu arayüzü uygulayan bir sınıf yazmak yeterlidir; katalog ve form
/// düzenleyici listeyi buradan okur. 🔴 Sınıfı <c>[ExposeServices(typeof(IFormChoiceSource))]</c> ile
/// İŞARETLE: ABP varsayılan kuralı yalnız SINIF ADIYLA BİTEN arayüzü açar, <c>...ChoiceSource</c> adı
/// <c>FormChoiceSource</c> ile bitmediği için kaynak kayıt defterine hiç düşmez ve listeler sessizce boşalır.</para>
/// </summary>
public interface IFormChoiceSource
{
    /// <summary>Alan ayarında <c>source</c> olarak saklanan anahtar (<see cref="FormChoiceSources"/>).</summary>
    string Key { get; }

    FormChoiceSourceScope Scope { get; }

    /// <summary>Zincirli kaynakta üst kaynağın anahtarı; bağımsız kaynakta null.</summary>
    string? DependsOnSourceKey => null;

    /// <summary>
    /// 17 · Bu kaynağın seçeneklerinde taşıdığı, koşulda sorulabilen bayraklar
    /// (<see cref="FormChoiceFlags"/>). Boşsa bu kaynağa bağlı alan koşulda yalnız cevapla sorulur.
    /// </summary>
    IReadOnlyList<string> Flags => Array.Empty<string>();

    /// <summary>
    /// Seçenekler. <paramref name="parentValue"/> yalnız zincirli kaynakta doludur (üst alanda seçilen
    /// kaydın kimliği); üst alan seçilmemişse boş liste döner.
    /// </summary>
    Task<List<FormChoiceDto>> GetAsync(string? parentValue);

    /// <summary>Katalogdaki sayaç. Kiracı kapsamlı kaynakta anlamı yok (her firmada farklı) → null.</summary>
    Task<int?> CountAsync() => Task.FromResult<int?>(null);
}
