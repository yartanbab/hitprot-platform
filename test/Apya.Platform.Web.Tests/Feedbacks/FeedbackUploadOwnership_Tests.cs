using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks.Dtos;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Security.Claims;
using Xunit;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Geri bildirime yalnız ÇAĞIRANIN yüklediği, henüz kullanılmamış dosya iliştirilebilir (ürün kararı,
/// 2026-10-13).
///
/// <para>Gönderim saklanan dosya adını istekten alıyordu ve hiçbir şeyi doğrulamıyordu: başkasının
/// dosyasının adını öğrenen biri onu kendi geri bildirimine iliştirip indirebiliyordu.</para>
/// </summary>
public class FeedbackUploadOwnership_Tests : PlatformWebTestBase
{
    /// <summary>
    /// Takip numarası veritabanı sayacından üretilir (nextval); test veritabanında (SQLite) o
    /// işlev yok. Ölçülen şey ek sahipliği olduğu için sayaç sahtesiyle değiştirilir.
    /// </summary>
    private sealed class CountingNumberGenerator : IFeedbackNumberGenerator
    {
        private int _next;
        public Task<string> NextAsync()
            => Task.FromResult("FB-TEST-" + System.Threading.Interlocked.Increment(ref _next).ToString("D6"));
    }

    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        services.Replace(ServiceDescriptor.Singleton<IFeedbackNumberGenerator>(new CountingNumberGenerator()));
    }

    private readonly IFeedbackAppService _feedback;
    private readonly IRepository<FeedbackAttachment, Guid> _attachmentRepository;
    private readonly IRepository<FeedbackUpload, Guid> _uploadRepository;
    private readonly ICurrentPrincipalAccessor _principalAccessor;

    public FeedbackUploadOwnership_Tests()
    {
        _feedback = GetRequiredService<IFeedbackAppService>();
        _attachmentRepository = GetRequiredService<IRepository<FeedbackAttachment, Guid>>();
        _uploadRepository = GetRequiredService<IRepository<FeedbackUpload, Guid>>();
        _principalAccessor = GetRequiredService<ICurrentPrincipalAccessor>();
    }

    private IDisposable As(Guid userId) => _principalAccessor.Change(
        new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, userId.ToString()),
            new Claim(AbpClaimTypes.UserName, "gb-" + userId.ToString("N")[..6])
        }, "Test")));

    private static string NewStoredName() => Guid.NewGuid().ToString("N") + ".png";

    private static CreateFeedbackDto Input(string? attachment = null, string? screenshot = null) => new()
    {
        Subject = "Ek sahipliği",
        Body = "Yükleme kaydı testi.",
        ScreenshotFileName = screenshot,
        Attachments = attachment == null
            ? new List<CreateFeedbackAttachmentDto>()
            : new List<CreateFeedbackAttachmentDto>
            {
                new() { FileName = "ekran.png", StoredFileName = attachment, ContentType = "image/png", SizeBytes = 10 }
            }
    };

    [Fact]
    public async Task Kendi_yukledigi_dosyayi_iliştirir_ve_yukleme_kullanilmis_sayilir()
    {
        var name = NewStoredName();
        using (As(Guid.NewGuid()))
        {
            await _feedback.RegisterUploadAsync(name);

            var dto = await _feedback.SubmitAsync(Input(attachment: name));

            (await _attachmentRepository.GetListAsync(a => a.FeedbackId == dto.Id))
                .Single().StoredFileName.ShouldBe(name);
            (await _uploadRepository.GetListAsync(u => u.StoredFileName == name))
                .Single().ClaimedByFeedbackId.ShouldBe(dto.Id);
        }
    }

    [Fact]
    public async Task Baskasinin_yukledigi_dosya_iliştirilemez()
    {
        var name = NewStoredName();
        using (As(Guid.NewGuid()))
        {
            await _feedback.RegisterUploadAsync(name);
        }

        using (As(Guid.NewGuid()))
        {
            (await Should.ThrowAsync<BusinessException>(() => _feedback.SubmitAsync(Input(attachment: name))))
                .Code.ShouldBe(PlatformDomainErrorCodes.FeedbackUploadNotFound);
            (await Should.ThrowAsync<BusinessException>(() => _feedback.SubmitAsync(Input(screenshot: name))))
                .Code.ShouldBe(PlatformDomainErrorCodes.FeedbackUploadNotFound);
        }

        (await _attachmentRepository.GetListAsync(a => a.StoredFileName == name)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Hic_yuklenmemis_ad_iliştirilemez()
    {
        using (As(Guid.NewGuid()))
        {
            await Should.ThrowAsync<BusinessException>(() => _feedback.SubmitAsync(Input(attachment: NewStoredName())));
        }
    }

    /// <summary>Aynı yükleme ikinci bir geri bildirimde yeniden kullanılamaz.</summary>
    [Fact]
    public async Task Kullanilmis_yukleme_ikinci_kez_iliştirilemez()
    {
        var name = NewStoredName();
        using (As(Guid.NewGuid()))
        {
            await _feedback.RegisterUploadAsync(name);
            await _feedback.SubmitAsync(Input(screenshot: name));

            await Should.ThrowAsync<BusinessException>(() => _feedback.SubmitAsync(Input(screenshot: name)));
        }
    }

    /// <summary>Karşı yön: eksiz geri bildirim etkilenmez.</summary>
    [Fact]
    public async Task Eksiz_geri_bildirim_gonderilir()
    {
        using (As(Guid.NewGuid()))
        {
            (await _feedback.SubmitAsync(Input())).Id.ShouldNotBe(Guid.Empty);
        }
    }
}
