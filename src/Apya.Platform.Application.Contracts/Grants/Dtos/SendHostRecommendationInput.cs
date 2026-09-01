using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 1c · Toplu gönderim. Kanal seçimi kapalıysa o kanaldan hiçbir şey gitmez;
/// öneri kaydı yine oluşur (kiracı feed'inde görünür).
/// </summary>
public class SendHostRecommendationInput
{
    public Guid GrantCallId { get; set; }

    public List<Guid> TenantIds { get; set; } = new();

    /// <summary>Bildirim/e-posta gövdesi olur. Boşsa standart metin kullanılır.</summary>
    [StringLength(256, ErrorMessage = "Not en fazla {1} karakter olabilir.")]
    public string? Note { get; set; }

    /// <summary>Öneriyi yürütecek danışman (host kullanıcısı).</summary>
    public Guid? AssignedUserId { get; set; }

    public bool SendNotification { get; set; } = true;
    public bool SendEmail { get; set; } = true;
}
