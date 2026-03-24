using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.AiTasks;
using Apya.Platform.Application.AiTasks;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Controllers;

[Authorize]
[Route("api/ai-task-generator")]
public class AiTaskGeneratorController : AbpController
{
    private readonly AiTaskGeneratorAppService _aiTaskService;

    public AiTaskGeneratorController(AiTaskGeneratorAppService aiTaskService)
    {
        _aiTaskService = aiTaskService;
    }

    [HttpPost("parse")]
    public async Task<DocumentParseResultDto> ParseDocumentAsync([FromQuery] Guid projectId, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new Volo.Abp.UserFriendlyException("Lutfen bir PDF dosyasi yukleyin.");
        }

        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        var bytes = ms.ToArray();

        return await _aiTaskService.ParseDocumentFromBytesAsync(projectId, bytes, file.FileName);
    }

    [HttpPost("create-tasks")]
    public async Task<int> CreateTasksAsync([FromBody] CreateTasksFromAiInput input)
    {
        return await _aiTaskService.CreateTasksFromSuggestionsAsync(input);
    }
}
