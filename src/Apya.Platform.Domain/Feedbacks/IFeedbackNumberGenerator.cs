using System.Threading.Tasks;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// "FB-2026-000123" biçiminde takip numarası üretir. Domain katmanı EF'e bakamadığı
/// için arayüz burada, implementasyon EntityFrameworkCore'da (PostgreSQL sequence —
/// eşzamanlı gönderimde çakışmaz, tenant'lar arası tek sayaç).
/// </summary>
public interface IFeedbackNumberGenerator
{
    Task<string> NextAsync();
}
