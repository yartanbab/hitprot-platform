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
    private readonly IRepository<FeedbackAttachment, Guid> _attachmentRepository;
    private readonly FeedbackManager _feedbackManager;

    public FeedbackAppService(
        IRepository<Feedback, Guid> feedbackRepository,
        IRepository<FeedbackAttachment, Guid> attachmentRepository,
        FeedbackManager feedbackManager)
    {
        _feedbackRepository = feedbackRepository;
        _attachmentRepository = attachmentRepository;
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
            ScreenshotFileName: input.ScreenshotFileName,
            ModuleCode: input.ModuleCode,
            ComponentCode: input.ComponentCode,
            ActionCode: input.ActionCode,
            RelatedEntityType: input.RelatedEntityType,
            RelatedEntityId: input.RelatedEntityId,
            LastClientErrorId: input.LastClientErrorId);

        var feedback = await _feedbackManager.CreateAsync(
            input.Type,
            input.Subject,
            input.Body,
            input.Rating,
            userId,
            context,
            severity: input.Severity,
            detailsJson: input.DetailsJson,
            isAnonymous: input.IsAnonymous,
            allowContact: input.AllowContact);

        if (input.Attachments is { Count: > 0 })
        {
            await _feedbackManager.AttachFilesAsync(
                feedback,
                input.Attachments.Select(a => (a.FileName, a.StoredFileName, a.ContentType, a.SizeBytes)),
                CurrentUser.UserName);
        }

        return MapToDto(feedback, commentCount: 0);
    }

    public async Task<FeedbackCommentDto> AddMyCommentAsync(Guid id, AddMyCommentDto input)
    {
        var feedback = await FindOwnedWithCommentsAsync(id);

        var comment = await _feedbackManager.AddUserCommentAsync(feedback, input.Text, CurrentUser.UserName);

        return ObjectMapper.Map<FeedbackComment, FeedbackCommentDto>(comment);
    }

    public async Task<FeedbackAttachmentFileDto> GetMyAttachmentFileAsync(Guid attachmentId)
    {
        var attachment = await _attachmentRepository.FindAsync(attachmentId);
        if (attachment is null)
        {
            throw new EntityNotFoundException(typeof(FeedbackAttachment), attachmentId);
        }

        // Sahiplik: ekin bağlı olduğu kayıt çağıranın olmalı — değilse kayıt varlığı sızmasın.
        var feedback = await _feedbackRepository.FindAsync(attachment.FeedbackId);
        if (feedback is null || feedback.CreatorId != CurrentUser.GetId())
        {
            throw new EntityNotFoundException(typeof(FeedbackAttachment), attachmentId);
        }

        return new FeedbackAttachmentFileDto
        {
            FileName = attachment.FileName,
            StoredFileName = attachment.StoredFileName,
            ContentType = attachment.ContentType
        };
    }

    public async Task<FeedbackAttachmentFileDto> GetMyScreenshotFileAsync(Guid feedbackId)
    {
        var feedback = await _feedbackRepository.FindAsync(feedbackId);
        if (feedback is null || feedback.CreatorId != CurrentUser.GetId()
            || feedback.ScreenshotFileName.IsNullOrWhiteSpace())
        {
            throw new EntityNotFoundException(typeof(Feedback), feedbackId);
        }

        return new FeedbackAttachmentFileDto
        {
            FileName = "ekran-goruntusu" + System.IO.Path.GetExtension(feedback.ScreenshotFileName),
            StoredFileName = feedback.ScreenshotFileName!,
            ContentType = null
        };
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
        var feedback = await FindOwnedWithCommentsAsync(id);

        var dto = ObjectMapper.Map<Feedback, FeedbackDetailDto>(feedback);
        dto.HasScreenshot = !feedback.ScreenshotFileName.IsNullOrWhiteSpace();
        dto.UserStatus = feedback.Status.ToUserStatus();

        // İÇ NOTLAR KULLANICIYA DÖNMEZ.
        dto.Comments = feedback.Comments
            .Where(c => !c.IsInternal)
            .OrderBy(c => c.CreationTime)
            .Select(c => ObjectMapper.Map<FeedbackComment, FeedbackCommentDto>(c))
            .ToList();

        dto.CommentCount = dto.Comments.Count;

        dto.Attachments = await GetAttachmentDtosAsync(feedback.Id);

        // Kullanıcıya teknik bağlam gösterilmez; yalnızca yönetici panelinde anlamlı.
        dto.BreadcrumbJson = null;
        dto.UserAgent = null;

        return dto;
    }

    /// <summary>Kaydı yorumlarıyla getirir; başkasına aitse EntityNotFound (varlık sızmasın).</summary>
    private async Task<Feedback> FindOwnedWithCommentsAsync(Guid id)
    {
        var userId = CurrentUser.GetId();

        var query = (await _feedbackRepository.GetQueryableAsync())
            .Where(f => f.Id == id)
            .Include(f => f.Comments);

        var feedback = await AsyncExecuter.FirstOrDefaultAsync(query);

        if (feedback is null || feedback.CreatorId != userId)
        {
            throw new EntityNotFoundException(typeof(Feedback), id);
        }

        return feedback;
    }

    private async Task<System.Collections.Generic.List<FeedbackAttachmentDto>> GetAttachmentDtosAsync(Guid feedbackId)
    {
        var query = (await _attachmentRepository.GetQueryableAsync())
            .Where(a => a.FeedbackId == feedbackId)
            .OrderBy(a => a.CreationTime);

        var items = await AsyncExecuter.ToListAsync(query);
        return items.Select(a => ObjectMapper.Map<FeedbackAttachment, FeedbackAttachmentDto>(a)).ToList();
    }

    private FeedbackDto MapToDto(Feedback feedback, int commentCount)
    {
        var dto = ObjectMapper.Map<Feedback, FeedbackDto>(feedback);
        dto.HasScreenshot = !feedback.ScreenshotFileName.IsNullOrWhiteSpace();
        dto.CommentCount = commentCount;
        // Kullanıcı tarafı iç durumu değil sadeleşmiş karşılığı görür.
        dto.UserStatus = feedback.Status.ToUserStatus();
        return dto;
    }
}
