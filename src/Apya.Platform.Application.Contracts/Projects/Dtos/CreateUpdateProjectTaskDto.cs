using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Projects.Dtos;

public class CreateUpdateProjectTaskDto
{
    [Required]
    public Guid ProjectId { get; set; }
    [Required]
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }

    // YENİ ALANLAR
    public TaskState State { get; set; }
    public Guid? AssignedUserId { get; set; }
}