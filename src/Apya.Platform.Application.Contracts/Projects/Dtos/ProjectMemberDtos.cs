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
