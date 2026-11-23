using System;
using System.Threading;

namespace Apya.Platform.Notifications;

/// <summary>
/// Sistem yöneticisinin toplu yüklemesi sırasında bildirim üretilmez: tek dosya kişi başına onlarca
/// uyarı doğurabilir (ürün kararı 2026-11-23). Kapsam akış boyunca geçerlidir; olaylar iş birimi
/// tamamlanırken yayınlandığı için kaydın tamamını sarmalıdır. Zorunlu türler bundan etkilenmez.
/// </summary>
public static class NotificationSuppression
{
    private static readonly AsyncLocal<bool> Active = new();

    public static bool IsActive => Active.Value;

    public static IDisposable Begin()
    {
        var previous = Active.Value;
        Active.Value = true;
        return new Scope(previous);
    }

    private sealed class Scope(bool previous) : IDisposable
    {
        public void Dispose() => Active.Value = previous;
    }
}
