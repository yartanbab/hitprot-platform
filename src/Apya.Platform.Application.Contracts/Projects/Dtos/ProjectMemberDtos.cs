using System;

namespace Apya.Platform.Projects.Dtos;

/// <summary>Projedeki bir üyelik kaydı — kullanıcı bilgisi Identity'den zenginleştirilir.</summary>
public class ProjectMemberDto
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public Guid UserId { get; set; }
    public ProjectMemberRole Role { get; set; }

    /// <summary>Rolün Türkçe karşılığı — UI'da doğrudan basılır.</summary>
    public string RoleText { get; set; } = string.Empty;

    /// <summary>Identity'den okunur. Kullanıcı silinmişse boş kalabilir.</summary>
    public string UserName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? Email { get; set; }

    /// <summary>Bu üyeye atanmış, kapanmamış görev sayısı — drawer'da rozet olarak gösterilir.</summary>
    public int OpenTaskCount { get; set; }
}

public class AddProjectMemberDto
{
    public Guid ProjectId { get; set; }
    public Guid UserId { get; set; }
    public ProjectMemberRole Role { get; set; } = ProjectMemberRole.Member;
}

public class UpdateProjectMemberRoleDto
{
    public ProjectMemberRole Role { get; set; }
}

/// <summary>
/// "Görev atananlarını ekibe ekle" (backfill) sonucu. Tek seferlik geçiş aracı:
/// ProjectMember 8. adımda eklendiği için eski projelerin ekibi boş görünüyor;
/// bu işlem ekibi mevcut görev atamalarından türetir.
/// </summary>
public class ProjectMemberBackfillResultDto
{
    /// <summary>Ekibe yeni eklenen kişi sayısı.</summary>
    public int Added { get; set; }

    /// <summary>Zaten ekipte olduğu için atlanan.</summary>
    public int SkippedAlreadyMember { get; set; }

    /// <summary>
    /// Daha önce ekipten ÇIKARILMIŞ olduğu için atlanan. Bu kişiler bilerek
    /// çıkarılmış sayılır; backfill onları geri getirmez.
    /// </summary>
    public int SkippedPreviouslyRemoved { get; set; }
}
