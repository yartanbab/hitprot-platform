using Apya.Platform.Tasks;

namespace Apya.Platform.Web.Pages.Paylasim;

/// <summary>
/// <c>_Node</c> kısmi görünümünün modeli. Kısmi görünüm alt görevler için KENDİNİ çağırır;
/// <paramref name="Depth"/> yalnız girinti ve başlık boyutu içindir — kapsamın sınırı
/// sunucuda (<c>TaskShareConsts.MaxScopeDepth</c>) çizilir, burada değil.
/// </summary>
public record GuestNodeViewModel(
    GuestTaskNodeDto Node,
    GuestTaskViewDto View,
    string Token,
    int Depth);
