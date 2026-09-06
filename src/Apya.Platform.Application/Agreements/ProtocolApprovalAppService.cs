using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Agreements.Dtos;
using Apya.Platform.Consents;
using Apya.Platform.Consents.Dtos;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.Tenants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Timing;

namespace Apya.Platform.Agreements;

/// <summary>
/// Protokol onayı ve hesap açılışı. Oturumsuzdur; yetkiyi kayıt talebindeki tek kullanımlık
/// davet jetonu verir.
///
/// <para><c>RemoteService(false)</c> — IP/UA yalnız Web sınırında güvenilir yakalanır ve
/// protokolün 9. maddesine göre delilin parçasıdır.</para>
/// </summary>
[RemoteService(false)]
[AllowAnonymous]
public class ProtocolApprovalAppService : PlatformAppService, IProtocolApprovalAppService
{
    private readonly IRepository<RegistrationRequest, Guid> _requestRepository;
    private readonly IRepository<ServiceAgreement, Guid> _agreementRepository;
    private readonly ServiceAgreementManager _agreementManager;
    private readonly ProtocolRenderer _renderer;
    private readonly TenantProvisioner _provisioner;
    private readonly IConsentAppService _consentAppService;
    private readonly IClock _clock;

    public ProtocolApprovalAppService(
        IRepository<RegistrationRequest, Guid> requestRepository,
        IRepository<ServiceAgreement, Guid> agreementRepository,
        ServiceAgreementManager agreementManager,
        ProtocolRenderer renderer,
        TenantProvisioner provisioner,
        IConsentAppService consentAppService,
        IClock clock)
    {
        _requestRepository = requestRepository;
        _agreementRepository = agreementRepository;
        _agreementManager = agreementManager;
        _renderer = renderer;
        _provisioner = provisioner;
        _consentAppService = consentAppService;
        _clock = clock;
    }

    public async Task<ProtocolInviteDto> GetByTokenAsync(string token)
    {
        var request = await FindByTokenAsync(token);
        var plan = request.EffectivePlan;

        return new ProtocolInviteDto
        {
            RegistrationRequestId = request.Id,
            CompanyName = request.CompanyName,
            FullName = request.FullName,
            AuthorizedTitle = request.AuthorizedTitle,
            Email = request.Email,
            Plan = plan,
            PlanName = SalesPlanCatalog.DisplayName(plan),
            Amount = request.OfferedAmount,
            PreviewHtml = _renderer.RenderPreview(
                request,
                plan,
                request.OfferedAmount,
                ServiceAgreementConsts.DefaultSuccessFeePercent,
                _clock.Now),
            ExpiresAt = request.InviteExpiresAt,
            RequiresSecondTenant = SalesPlanCatalog.RequiresSecondTenant(plan)
        };
    }

    public async Task<ProtocolApprovalResultDto> ApproveAsync(ApproveProtocolInput input)
    {
        if (!input.AcceptAgreement || !input.AcceptKvkk)
        {
            throw new BusinessException(PlatformDomainErrorCodes.AgreementConsentRequired);
        }

        var request = await FindByTokenAsync(input.Token);
        var plan = request.EffectivePlan;

        // Yeniden deneme yolu: sözleşme yazılmış ama kurulum düşmüşse İKİNCİ bir sözleşme
        // üretmeyiz — aynı onayın iki hukuki kaydı olmamalı.
        var agreement = await _agreementRepository.FirstOrDefaultAsync(
            a => a.RegistrationRequestId == request.Id);

        if (agreement == null)
        {
            var approvedAt = _clock.Now;

            // Numara, metin ve özet birbirine bağlı: numara metnin içinde geçtiği için
            // önce üretilir, sonra metin doldurulup hash'lenir.
            var (html, hash) = _renderer.RenderApproved(
                request,
                await PeekNextNumberAsync(approvedAt),
                plan,
                request.OfferedAmount,
                ServiceAgreementConsts.DefaultSuccessFeePercent,
                approvedAt,
                input.IpAddress);

            agreement = await _agreementManager.ApproveAsync(
                request.Id,
                html,
                hash,
                plan,
                request.OfferedAmount,
                ServiceAgreementConsts.DefaultSuccessFeePercent,
                request.FullName,
                request.AuthorizedTitle,
                request.Email,
                input.IpAddress,
                input.UserAgent);

            await RecordConsentsAsync(request, input);
        }

        // Ad bir ÖNERİDİR: benzersizleştirme kurulumun kendi UoW'unda yapılır, yoksa
        // buradaki okuma az önce açılmış bir kiracıyı göremez (bkz. TenantProvisioner).
        var provisioned = await _provisioner.ProvisionAsync(new CreateTenantExtendedDto
        {
            Name = request.CompanyName,
            AdminEmailAddress = request.Email,
            AdminPassword = input.Password,
            PackageCode = SalesPlanCatalog.ToPackageCode(plan),
            SubscriptionPeriod = SubscriptionPeriod.Annual, // Protokol Madde 8: 1 yıl
            CompanyType = request.CompanyType,
            TaxNumber = request.TaxNumber,
            TaxOffice = request.TaxOffice ?? string.Empty,
            CorporateEmail = request.CorporateEmail ?? request.Email,
            Address = request.Address,
            LegalRepresentativeName = request.FullName,
            LegalRepresentativePhone = request.Phone,
            OperationalContactName = request.OperationalContactName ?? string.Empty,
            OperationalContactPhone = request.OperationalContactPhone ?? string.Empty
        },
        resolveUniqueName: true);

        agreement.LinkTenant(provisioned.TenantId);
        await _agreementRepository.UpdateAsync(agreement, autoSave: true);

        request.CompleteWithTenant(provisioned.TenantId, _clock.Now);
        await _requestRepository.UpdateAsync(request, autoSave: true);

        return new ProtocolApprovalResultDto
        {
            AgreementId = agreement.Id,
            AgreementNumber = agreement.Number,
            ContentHash = agreement.ContentHash,
            TenantName = provisioned.TenantName,
            AdminEmail = request.Email
        };
    }

    /// <summary>
    /// Jetonu özetleyip talebi bulur ve kullanılabilirliğini denetler.
    /// <para>
    /// Arama HASH üzerinden yapılır; ham jeton veritabanında hiç bulunmaz. Kayıt yoksa
    /// "geçersiz" denir — hangi talebin var olduğu sızdırılmaz.
    /// </para>
    /// </summary>
    private async Task<RegistrationRequest> FindByTokenAsync(string token)
    {
        if (token.IsNullOrWhiteSpace())
        {
            throw new BusinessException(PlatformDomainErrorCodes.AgreementInviteInvalid);
        }

        var hash = InviteToken.Hash(token.Trim());

        var request = await _requestRepository.FirstOrDefaultAsync(r => r.InviteTokenHash == hash)
                      ?? throw new BusinessException(PlatformDomainErrorCodes.AgreementInviteInvalid);

        request.EnsureInviteUsable(_clock.Now);

        return request;
    }

    /// <summary>
    /// Metne yazılacak sözleşme numarasını önceden üretir. Numara belgenin İÇİNDE geçtiği
    /// için hash'ten önce bilinmek zorunda; kaydı açan <see cref="ServiceAgreementManager"/>
    /// aynı kuralla aynı numarayı üretir.
    /// </summary>
    private async Task<string> PeekNextNumberAsync(DateTime now)
    {
        var query = await _agreementRepository.GetQueryableAsync();
        var countThisYear = await AsyncExecuter.CountAsync(query.Where(a => a.ApprovedAt.Year == now.Year));

        return $"{ServiceAgreementConsts.NumberPrefix}{now.Year}-{(countThisYear + 1).ToString("D4", CultureInfo.InvariantCulture)}";
    }

    /// <summary>
    /// İki rıza kaydı: protokolün kabulü ve KVKK taahhüdü. Hata YUTULUR — sözleşme zaten
    /// kendi onay alanlarıyla (ad, IP, zaman damgası, hash) delili taşıyor; ikincil analiz
    /// kaydının düşmesi hesabın açılmasını engellememeli.
    /// </summary>
    private async Task RecordConsentsAsync(RegistrationRequest request, ApproveProtocolInput input)
    {
        foreach (var type in new[] { ConsentType.ServiceAgreement, ConsentType.ServiceAgreementKvkk })
        {
            try
            {
                await _consentAppService.RecordAsync(new RecordConsentInput
                {
                    Type = type,
                    Granted = true,
                    SubjectKind = ConsentSubjectKind.Anonymous,
                    SubjectId = request.Email,
                    PolicyVersion = ConsentConsts.ServiceAgreementPolicyVersion,
                    IpAddress = input.IpAddress,
                    UserAgent = input.UserAgent,
                    SourceRef = AgreementConsentSourceRef
                });
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex, "Protokol rıza kaydı yazılamadı ({Type}); sözleşme kaydedildi.", type);
            }
        }
    }


    /// <summary>Rıza kayıtlarının kaynak etiketi — panelde protokol onayları süzülebilsin.</summary>
    private const string AgreementConsentSourceRef = "account/protokol";
}
