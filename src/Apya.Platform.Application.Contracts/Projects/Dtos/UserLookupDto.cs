using System;

namespace Apya.Platform.Projects.Dtos;

public class UserLookupDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;

    // Ekranda "Ahmet Yılmaz (ahmet123)" şeklinde göstermek için yardımcı özellik
    public string DisplayName => $"{Name} {Surname} ({UserName})";
}