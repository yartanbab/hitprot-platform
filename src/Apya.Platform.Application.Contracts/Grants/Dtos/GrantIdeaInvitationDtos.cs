using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>19b · "Kime": tek firma, süzülmüş grup ya da tümü.</summary>
public class GrantIdeaInvitationAudienceInput
{
    public GrantIdeaInvitationAudience Audience { get; set; }

    /// <summary>Tek firma seçiminde firma.</summary>
    public Guid? TenantId { get; set; }

    /// <summary>Süzülmüş grupta ölçek (CompanySize bayrakları); boş ya da 0 = ölçek koşulu yok.</summary>
    public int? Sizes { get; set; }

    /// <summary>Süzülmüş grupta yalnız havuzda bekleyen fikri olmayan firmalar.</summary>
    public bool OnlyWithoutPoolIdea { get; set; }
}

public class SendGrantIdeaInvitationInput : GrantIdeaInvitationAudienceInput
{
    /// <summary>Boş = çağrıdan bağımsız (yanıt Fikir Havuzu'na) · dolu = bu açık çağrı için (yanıt Talepler'e).</summary>
    public Guid? GrantCallId { get; set; }

    [Required(ErrorMessage = "Davet mesajını yazın.")]
    [StringLength(GrantIdeaInvitationConsts.MaxMessageLength, ErrorMessage = "Davet mesajı en fazla 1000 karakter olabilir.")]
    public string Message { get; set; } = string.Empty;

    public bool SendEmail { get; set; }

    /// <summary>null = hatırlatma yok.</summary>
    [Range(GrantIdeaInvitationConsts.MinRemindAfterDays, GrantIdeaInvitationConsts.MaxRemindAfterDays, ErrorMessage = "Hatırlatma 1 ile 60 gün arasında olmalı.")]
    public int? RemindAfterDays { get; set; }
}

/// <summary>"Önizle": firmanın göreceği bildirim, şablonla işlenmiş hâliyle.</summary>
public class PreviewGrantIdeaInvitationInput
{
    public Guid? GrantCallId { get; set; }

    public string? Message { get; set; }
}

public class GrantIdeaInvitationPreviewDto
{
    /// <summary>false = host "Fikir daveti" şablonunu kapatmış; davet kaydı açılır ama bildirim gitmez.</summary>
    public bool TemplateEnabled { get; set; }

    public string Subject { get; set; } = string.Empty;

    public string Body { get; set; } = string.Empty;
}

/// <summary>Davet penceresinin seçenekleri.</summary>
public class GrantIdeaInvitationOptionsDto
{
    public List<GrantRequestOptionDto> Firms { get; set; } = new();

    /// <summary>Yalnız açık (yayında, son tarihi geçmemiş) çağrılar.</summary>
    public List<GrantRequestOptionDto> Calls { get; set; } = new();
}

public class GrantIdeaInvitationSendResultDto
{
    public Guid InvitationId { get; set; }

    public int RecipientCount { get; set; }
}

/// <summary>Fikir Havuzu'ndaki "Son davet" satırı.</summary>
public class GrantIdeaInvitationSummaryDto
{
    public Guid Id { get; set; }

    public DateTime SentAt { get; set; }

    /// <summary>Çağrı davetinde program adı; havuz davetinde null.</summary>
    public string? GrantName { get; set; }

    public int RecipientCount { get; set; }

    /// <summary>Davetten sonra fikir paylaşan (ya da çağrıya ilgi bildiren) firma sayısı.</summary>
    public int RespondedCount { get; set; }

    public DateTime? RemindAt { get; set; }

    public int RemindedCount { get; set; }
}

/// <summary>19b · Kiracı: kendisine gelen davet (formun üstündeki not).</summary>
public class MyGrantIdeaInvitationDto
{
    public Guid Id { get; set; }

    public DateTime SentAt { get; set; }

    public string Message { get; set; } = string.Empty;

    public Guid? GrantCallId { get; set; }

    public string? GrantName { get; set; }
}
