using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Kullanıcı tarafı. Bilinçli olarak izin kontrolü YOK — yalnızca [Authorize].
/// Geri bildirim gönderme bir izne bağlanırsa yeni tenant'larda kapalı gelir.
/// </summary>
[Authorize]
public class FeedbackAppService : ApplicationService, IFeedbackAppService
{
    private readonly IRepository<Feedback, Guid> _feedbackRepository;
    private readonly FeedbackManager _feedbackManager;

    public FeedbackAppService(
        IRepository<Feedback, Guid> feedbackRepository,
        FeedbackManager feedbackManager)
    {
        _feedbackRepository = feedbackRepository;
        _feedbackManager = feedbackManager;
    }

    public async Task<FeedbackDto> SubmitAsync(CreateFeedbackDto input)
    {
        var userId = CurrentUser.GetId();

        var context = new FeedbackSubmissionContext(
            PageUrl: input.PageUrl,
            PageTitle: input.PageTitle,
            UserAgent: input.UserAgent,
            ScreenResolution: input.ScreenResolution,
            AppVersion: input.AppVersion,
            SubmittedByUserName: CurrentUser.UserName,
            BreadcrumbJson: input.BreadcrumbJson,
            ScreenshotFileName: input.ScreenshotFileName);

        var feedback = await _feedbackManager.CreateAsync(
            input.Type,
            input.Subject,
            input.Body,
            input.Rating,
            userId,
            context);

        return MapToDto(feedback, commentCount: 0);
    }

    public async Task<PagedResultDto<FeedbackDto>> GetMyListAsync(PagedAndSortedResultRequestDto input)
    {
        var userId = CurrentUser.GetId();

        var query = (await _feedbackRepository.GetQueryableAsync())
            .Where(f => f.CreatorId == userId);

        var totalCount = await AsyncExecuter.CountAsync(query);

        var items = await AsyncExecuter.ToListAsync(
            query.OrderByDescending(f => f.CreationTime)
                 .Skip(input.SkipCount)
                 .Take(input.MaxResultCount)
                 .Include(f => f.Comments));

        var dtos = items
            // Kullanıcıya iç notlar sayılmaz — yalnızca kendisine yazılan cevaplar.
            .Select(f => MapToDto(f, f.Comments.Count(c => !c.IsInternal)))
            .ToList();

        return new PagedResultDto<FeedbackDto>(totalCount, dtos);
    }

    public async Task<FeedbackDetailDto> GetMyAsync(Guid id)
    {
        var userId = CurrentUser.GetId();

        var query = (await _feedbackRepository.GetQueryableAsync())
            .Where(f => f.Id == id)
            .Include(f => f.Comments);

        var feedback = await AsyncExecuter.FirstOrDefaultAsync(query);

        if (feedback is null || feedback.CreatorId != userId)
        {
            // Var olmayan ve başkasına ait kayıt aynı cevabı vermeli — kayıt varlığı sızmasın.
            throw new EntityNotFoundException(typeof(Feedback), id);
        }

        var dto = ObjectMapper.Map<Feedback, FeedbackDetailDto>(feedback);
        dto.HasScreenshot = !feedback.ScreenshotFileName.IsNullOrWhiteSpace();

        // İÇ NOTLAR KULLANICIYA DÖNMEZ.
        dto.Comments = feedback.Comments
            .Where(c => !c.IsInternal)
            .OrderBy(c => c.CreationTime)
            .Select(c => ObjectMapper.Map<FeedbackComment, FeedbackCommentDto>(c))
            .ToList();

        dto.CommentCount = dto.Comments.Count;

        // Kullanıcıya teknik bağlam gösterilmez; yalnızca yönetici panelinde anlamlı.
        dto.BreadcrumbJson = null;
        dto.UserAgent = null;

        return dto;
    }

    private FeedbackDto MapToDto(Feedback feedback, int commentCount)
    {
        var dto = ObjectMapper.Map<Feedback, FeedbackDto>(feedback);
        dto.HasScreenshot = !feedback.ScreenshotFileName.IsNullOrWhiteSpace();
        dto.CommentCount = commentCount;
        return dto;
    }
}
