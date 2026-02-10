using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Projects.Dtos;

public class CreateTaskDto
{
    [Required]
    public Guid ProjectId { get; set; } // Hangi projeye ait?

    [Required]
    public string Title { get; set; } = string.Empty; // <-- Eşittir string.Empty eklendi

    public string Description { get; set; } = string.Empty; // <-- Buraya da eklendi

    public int Status { get; set; } = 0; // 0: Bekliyor, 1: Devam Ediyor, 2: Bitti
}