using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Documents;

/// <summary>
/// Sistem belge tiplerini ve alan şemalarını seed eder.
///
/// Kayıtlar HOST seviyesinde (TenantId = null) tutulur ve tüm kiracılar tarafından
/// okunur (bkz. DocumentTypeAppService — kiracı filtresi kapatılarak okunur).
/// Böylece kiracı sayısı arttıkça aynı 6 tip N kez kopyalanmaz.
///
/// GUID'ler SABİTTİR: seeder tekrar çalıştığında mükerrer kayıt üretmez ve
/// sonraki fazlar (kural motoru, uygunluk paketleri) tiplere kararlı id ile bakabilir.
/// </summary>
public class DocumentTypeDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    /// <summary>Mali belgeler için varsayılan saklama (TTK 10 yıl). Kiracı Faz D'de değiştirebilir.</summary>
    private const int FinancialRetentionMonths = 120;

    private const string DefaultFileNamePattern = "{proje}-{tip}-{tarih}-{no}";

    private readonly IRepository<DocumentType, Guid> _typeRepository;
    private readonly IRepository<DocumentTypeField, Guid> _fieldRepository;

    public DocumentTypeDataSeedContributor(
        IRepository<DocumentType, Guid> typeRepository,
        IRepository<DocumentTypeField, Guid> fieldRepository)
    {
        _typeRepository = typeRepository;
        _fieldRepository = fieldRepository;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        // Sistem tipleri yalnızca host bağlamında yazılır; kiracı seed turlarında atlanır.
        if (context.TenantId != null)
        {
            return;
        }

        var definitions = BuildDefinitions();

        var typeIds = definitions.Select(d => d.Id).ToList();
        var existingTypeIds = (await _typeRepository.GetListAsync(t => typeIds.Contains(t.Id)))
            .Select(t => t.Id)
            .ToHashSet();

        var newTypes = definitions
            .Where(d => !existingTypeIds.Contains(d.Id))
            .Select(d => new DocumentType(
                d.Id,
                tenantId: null,
                name: d.Name,
                code: d.Code,
                icon: d.Icon,
                retentionMonths: d.RetentionMonths,
                fileNamePattern: DefaultFileNamePattern,
                isSystem: true,
                order: d.Order))
            .ToList();

        if (newTypes.Count > 0)
        {
            await _typeRepository.InsertManyAsync(newTypes, autoSave: true);
        }

        // Alanlar tip başına ayrı kontrol edilir — yeni bir alan sonradan eklenirse
        // mevcut kurulumlara da inebilsin.
        var allFieldIds = definitions.SelectMany(d => d.Fields.Select(f => f.Id)).ToList();
        var existingFieldIds = (await _fieldRepository.GetListAsync(f => allFieldIds.Contains(f.Id)))
            .Select(f => f.Id)
            .ToHashSet();

        var newFields = new List<DocumentTypeField>();
        foreach (var definition in definitions)
        {
            var order = 0;
            foreach (var field in definition.Fields)
            {
                order++;

                if (existingFieldIds.Contains(field.Id))
                {
                    continue;
                }

                newFields.Add(new DocumentTypeField(
                    field.Id,
                    tenantId: null,
                    documentTypeId: definition.Id,
                    key: field.Key,
                    label: field.Label,
                    fieldType: field.FieldType,
                    isRequired: field.IsRequired,
                    fillSource: field.FillSource,
                    visibility: field.Visibility,
                    order: order));
            }
        }

        if (newFields.Count > 0)
        {
            await _fieldRepository.InsertManyAsync(newFields, autoSave: true);
        }
    }

    private static List<TypeDefinition> BuildDefinitions() => new()
    {
        new TypeDefinition(
            new Guid("a1000000-0000-4000-8000-000000000001"), "Fatura", "INVOICE", "fa-file-invoice",
            FinancialRetentionMonths, 1,
            new List<FieldDefinition>
            {
                new(new Guid("a1010000-0000-4000-8000-000000000001"), "invoiceNo", "Fatura no", DocumentFieldType.Text, true, DocumentFieldFillSource.Ocr, DocumentFieldVisibility.Restricted),
                new(new Guid("a1010000-0000-4000-8000-000000000002"), "invoiceDate", "Fatura tarihi", DocumentFieldType.Date, true, DocumentFieldFillSource.Ocr, DocumentFieldVisibility.Everyone),
                new(new Guid("a1010000-0000-4000-8000-000000000003"), "grossAmount", "Tutar (KDV dahil)", DocumentFieldType.Money, true, DocumentFieldFillSource.Ocr, DocumentFieldVisibility.Restricted),
                new(new Guid("a1010000-0000-4000-8000-000000000004"), "supplier", "Cari / tedarikçi", DocumentFieldType.Relation, true, DocumentFieldFillSource.Ai, DocumentFieldVisibility.Everyone),
                new(new Guid("a1010000-0000-4000-8000-000000000005"), "expenseItem", "Harcama kalemi", DocumentFieldType.Relation, true, DocumentFieldFillSource.Rule, DocumentFieldVisibility.Restricted),
                new(new Guid("a1010000-0000-4000-8000-000000000006"), "projectTask", "Proje / task", DocumentFieldType.Relation, false, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Everyone),
                new(new Guid("a1010000-0000-4000-8000-000000000007"), "externalRef", "Kurum referansı", DocumentFieldType.Text, false, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Restricted),
            }),

        new TypeDefinition(
            new Guid("a1000000-0000-4000-8000-000000000002"), "Bordro", "PAYROLL", "fa-money-check-dollar",
            FinancialRetentionMonths, 2,
            new List<FieldDefinition>
            {
                new(new Guid("a1020000-0000-4000-8000-000000000001"), "period", "Dönem", DocumentFieldType.Date, true, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Restricted),
                new(new Guid("a1020000-0000-4000-8000-000000000002"), "headcount", "Personel sayısı", DocumentFieldType.Number, true, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Restricted),
                new(new Guid("a1020000-0000-4000-8000-000000000003"), "grossTotal", "Brüt toplam", DocumentFieldType.Money, true, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Confidential),
                new(new Guid("a1020000-0000-4000-8000-000000000004"), "sgkBase", "SGK matrahı", DocumentFieldType.Money, true, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Confidential),
                new(new Guid("a1020000-0000-4000-8000-000000000005"), "rndShare", "Ar-Ge payı", DocumentFieldType.Percent, true, DocumentFieldFillSource.Rule, DocumentFieldVisibility.Restricted),
            }),

        new TypeDefinition(
            new Guid("a1000000-0000-4000-8000-000000000003"), "Rapor", "REPORT", "fa-file-lines",
            null, 3,
            new List<FieldDefinition>
            {
                new(new Guid("a1030000-0000-4000-8000-000000000001"), "reportPeriod", "Rapor dönemi", DocumentFieldType.Date, true, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Everyone),
                new(new Guid("a1030000-0000-4000-8000-000000000002"), "institution", "Kurum", DocumentFieldType.Select, true, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Everyone),
                new(new Guid("a1030000-0000-4000-8000-000000000003"), "versionNote", "Sürüm notu", DocumentFieldType.Text, false, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Restricted),
                new(new Guid("a1030000-0000-4000-8000-000000000004"), "coveredTasks", "Kapsanan tasklar", DocumentFieldType.Relation, true, DocumentFieldFillSource.Ai, DocumentFieldVisibility.Everyone),
            }),

        new TypeDefinition(
            new Guid("a1000000-0000-4000-8000-000000000004"), "Sözleşme", "CONTRACT", "fa-file-signature",
            FinancialRetentionMonths, 4,
            new List<FieldDefinition>
            {
                new(new Guid("a1040000-0000-4000-8000-000000000001"), "counterparty", "Karşı taraf", DocumentFieldType.Relation, true, DocumentFieldFillSource.Ai, DocumentFieldVisibility.Restricted),
                new(new Guid("a1040000-0000-4000-8000-000000000002"), "startDate", "Başlangıç", DocumentFieldType.Date, true, DocumentFieldFillSource.Ocr, DocumentFieldVisibility.Everyone),
                new(new Guid("a1040000-0000-4000-8000-000000000003"), "endDate", "Bitiş / yenileme", DocumentFieldType.Date, true, DocumentFieldFillSource.Ocr, DocumentFieldVisibility.Everyone),
                new(new Guid("a1040000-0000-4000-8000-000000000004"), "contractValue", "Bedel", DocumentFieldType.Money, true, DocumentFieldFillSource.Ocr, DocumentFieldVisibility.Restricted),
                new(new Guid("a1040000-0000-4000-8000-000000000005"), "reminderDays", "Hatırlatma (gün)", DocumentFieldType.Number, false, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Restricted),
            }),

        new TypeDefinition(
            new Guid("a1000000-0000-4000-8000-000000000005"), "Test raporu", "TEST_REPORT", "fa-flask",
            null, 5,
            new List<FieldDefinition>
            {
                new(new Guid("a1050000-0000-4000-8000-000000000001"), "testLab", "Test kuruluşu", DocumentFieldType.Text, true, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Restricted),
                new(new Guid("a1050000-0000-4000-8000-000000000002"), "measuredAt", "Ölçüm tarihi", DocumentFieldType.Date, true, DocumentFieldFillSource.Ocr, DocumentFieldVisibility.Everyone),
                new(new Guid("a1050000-0000-4000-8000-000000000003"), "result", "Sonuç", DocumentFieldType.Select, true, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Everyone),
                new(new Guid("a1050000-0000-4000-8000-000000000004"), "relatedTask", "İlgili task", DocumentFieldType.Relation, true, DocumentFieldFillSource.Rule, DocumentFieldVisibility.Everyone),
            }),

        new TypeDefinition(
            new Guid("a1000000-0000-4000-8000-000000000006"), "Resmi yazı", "OFFICIAL_LETTER", "fa-stamp",
            null, 6,
            new List<FieldDefinition>
            {
                new(new Guid("a1060000-0000-4000-8000-000000000001"), "institution", "Kurum", DocumentFieldType.Select, true, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Everyone),
                new(new Guid("a1060000-0000-4000-8000-000000000002"), "letterDate", "Belge tarihi", DocumentFieldType.Date, true, DocumentFieldFillSource.Ocr, DocumentFieldVisibility.Everyone),
                new(new Guid("a1060000-0000-4000-8000-000000000003"), "validUntil", "Geçerlilik", DocumentFieldType.Date, true, DocumentFieldFillSource.Manual, DocumentFieldVisibility.Everyone),
            }),
    };

    private sealed record TypeDefinition(
        Guid Id,
        string Name,
        string Code,
        string Icon,
        int? RetentionMonths,
        int Order,
        List<FieldDefinition> Fields);

    private sealed record FieldDefinition(
        Guid Id,
        string Key,
        string Label,
        DocumentFieldType FieldType,
        bool IsRequired,
        DocumentFieldFillSource FillSource,
        DocumentFieldVisibility Visibility);
}
