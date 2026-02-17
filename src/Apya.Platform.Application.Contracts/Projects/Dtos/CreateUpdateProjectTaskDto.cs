using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Projects.Dtos;

public class CreateUpdateProjectTaskDto
{
    public Guid ProjectId { get; set; }

    [Required]
    [StringLength(128)]
    public string Title { get; set; } = default!;

    // ... (Mevcut StartDate, Priority, vb. alanların altına ekleyin)

    [StringLength(500)]
    public string? InitialComment { get; set; } // Görev açılırken eklenecek ilk yorum

    [StringLength(1000)]
    public string? SubTasksText { get; set; } // Alt görevleri alt alta yazarak alacağız

    public string? Description { get; set; }

    // Hata veren eksik alanları buraya ekliyoruz:
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }

    public int Priority { get; set; } // Enum ise int olarak tutulabilir

    public int Status { get; set; }

    public Guid? AssigneeId { get; set; }
}