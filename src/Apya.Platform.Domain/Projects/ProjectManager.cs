using System;
using System.Threading.Tasks;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Projects;

public class ProjectManager : DomainService
{
    // Proje oluşturma işini yapan ana metodumuz
    public Task<Project> CreateAsync(
        Guid grantId,
        string name,
        string code,
        string description)
    {
        // Yeni projeyi oluştur
        var project = new Project(
            GuidGenerator.Create(),
            grantId,
            name,
            code,
            description
        );

        // Geri döndür (Task.FromResult asenkron metodlar için sarmalayıcıdır)
        return Task.FromResult(project);
    }
}