using System;

namespace Apya.Platform.Tasks
{
    /// <summary>
    /// Misafirin bir formu doldurabilmesi için gereken doğrulanmış bağlam.
    ///
    /// <para>Bu nesnenin ELDE EDİLMİŞ OLMASI yetkinin kanıtıdır: üreten metot
    /// (<see cref="ITaskShareAppService.ResolveGuestFormAsync"/>) token'ı, kapsamı
    /// ve formun misafire açık olduğunu doğrulamadan geri dönmez. Çağıran ayrıca
    /// kontrol yapmaz, ama kendi işini <see cref="TenantId"/> bağlamında
    /// çalıştırmak ZORUNDADIR — anonim istekte geçerli kiracı yoktur.</para>
    /// </summary>
    public class GuestFormContextDto
    {
        /// <summary>Görevin ait olduğu kiracı. Anonim istekte CurrentTenant boştur;
        /// çağıran işlemi bu kiracıya geçirerek yürütür.</summary>
        public Guid? TenantId { get; set; }

        /// <summary>Yanıtın damgalanacağı görev.</summary>
        public Guid TaskId { get; set; }

        /// <summary>Yanıtın damgalanacağı paylaşım linki — "kim doldurdu"nun kaynağı.</summary>
        public Guid ShareLinkId { get; set; }

        /// <summary>Doğrulanmış form kimliği (slug'dan çözüldü).</summary>
        public Guid DocumentId { get; set; }
    }
}
