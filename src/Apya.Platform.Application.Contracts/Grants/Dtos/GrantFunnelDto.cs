using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 18c · Bir çağrının dönüşüm hunisi, son <see cref="Days"/> günde oluşan kayıtlarla. Her aşama kendi kaydının
/// oluşturulma tarihine göre sayılır; aşamalar birbirinin alt kümesi değildir (pargetto talebi ile platform
/// ilgisi farklı kanaldan gelir), bu yüzden oranlar yaklaşık okunur.
/// </summary>
public class GrantFunnelDto
{
    public Guid CallId { get; set; }
    public string CallLabel { get; set; } = null!;
    public int Days { get; set; }

    /// <summary>pargetto.com herkese açık detay görüntülenmesi.</summary>
    public int PublicViews { get; set; }

    /// <summary>Platformda kiracıların detay görüntülenmesi.</summary>
    public int TenantViews { get; set; }

    /// <summary>pargetto uygunluk testini tamamlayıp iletişim bırakan talepler.</summary>
    public int Tests { get; set; }

    /// <summary>Platformda "İlgileniyorum" talepleri (geri çekilenler dahil).</summary>
    public int Interests { get; set; }

    /// <summary>Randevu tercihi bırakılan ya da randevu verilen talepler + danışmanın üstlendiği ilgi talepleri.</summary>
    public int Meetings { get; set; }

    /// <summary>Açılan başvuru süreçleri.</summary>
    public int Applications { get; set; }

    /// <summary>Onaylanan (onay ya da ödeme aşamasındaki) başvurular.</summary>
    public int Approved { get; set; }
}

/// <summary>Huni ekranındaki çağrı seçimi: host kataloğundaki çağrılar.</summary>
public class GrantFunnelCallDto
{
    public Guid Id { get; set; }
    public string Label { get; set; } = null!;
    public GrantCallStatus Status { get; set; }
}
