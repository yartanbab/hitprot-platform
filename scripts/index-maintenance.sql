/* ============================================================================
   Apya.Platform — TEK SEFERLİK indeks bakım turu
   ----------------------------------------------------------------------------
   NEDEN GEREKLİ
   Sıralı GUID düzeltmesine (PR #352) kadar SQL Server'da kümelenmiş anahtar
   rastgele üretiliyordu: her INSERT sayfanın ortasına düşüp sayfayı bölüyordu.
   Düzeltme YENİ satırları sıralı yapar ama BİRİKEN israfı geri almaz — bu tur
   onun için. 2026-09-04 ölçümü: ortalama sayfa doluluğu %65,1 (sağlıklısı ~%95).
   Yani veri sayfalarının üçte biri hava: hem diskte hem tampon havuzunda.

   ⚠ SÜRÜM KISITI — ÖNCE BUNU OKU
   ONLINE rebuild yalnız Enterprise / Azure SQL'de vardır. Sunucu Standard ise
   REBUILD tabloyu KİLİTLER; müşteriler veri girerken çalıştırılamaz. Bu yüzden
   betiğin VARSAYILANI güvenli olandır:

     @Yontem = 'REORGANIZE'  → her zaman çevrimiçi, kilit yok, mesai içinde
                               çalıştırılabilir. Sayfaları sıkıştırır (doluluğu
                               düzeltir) ama REBUILD kadar derli toplu değil.
     @Yontem = 'REBUILD'     → tam sonuç, ama Standard'da TABLO KİLİTLENİR.
                               YALNIZ bakım penceresinde, site kapalıyken.

   Betik sürümü kendi tespit eder: Enterprise ise REBUILD'i otomatik ONLINE yapar.

   NE YAPMAZ
   Veri okumaz, yazmaz, silmez. Şema değiştirmez. Yalnız mevcut indeksleri
   yeniden düzenler. Yarıda kesilirse zarar vermez — yeniden çalıştır, eşiğin
   altına inmiş olanları atlayıp kalanlardan devam eder.

   ÇALIŞTIRMA
     sqlcmd -S <sunucu> -d <veritabani> -U <kullanici> -P <parola> -I ^
            -i index-maintenance.sql

   İşlem günlüğü (transaction log) büyür; REBUILD seçeceksen önce yedek al.
   ============================================================================ */

SET NOCOUNT ON;
SET QUOTED_IDENTIFIER ON;

/* ---------------------------------------------------------------- AYARLAR -- */

DECLARE @Yontem        varchar(12)  = 'REORGANIZE';  -- 'REORGANIZE' (güvenli) | 'REBUILD' (bakım penceresi)
DECLARE @AsgariSayfa   int          = 100;           -- bundan küçük indekse dokunma (8 KB × 100 = 800 KB)
DECLARE @AsgariBosluk  decimal(5,1) = 85.0;          -- doluluk bu yüzdenin ALTINDAysa işle
DECLARE @IstatGuncelle bit          = 1;             -- REORGANIZE istatistiği tazelemez; sonda UPDATE STATISTICS

/* ------------------------------------------------------- SÜRÜM TESPİTİ ----- */

DECLARE @Motor  int  = CAST(SERVERPROPERTY('EngineEdition') AS int);
DECLARE @Online bit  = CASE WHEN @Motor IN (3, 5, 8) THEN 1 ELSE 0 END;  -- 3=Enterprise 5=Azure DB 8=Azure MI
DECLARE @Satir  nvarchar(400);

SET @Satir = CONCAT('Sunucu: ', CAST(SERVERPROPERTY('Edition') AS nvarchar(200)),
                    '  (ONLINE rebuild: ', CASE WHEN @Online = 1 THEN 'VAR' ELSE 'YOK' END, ')');
RAISERROR('%s', 0, 1, @Satir) WITH NOWAIT;

IF @Yontem = 'REBUILD' AND @Online = 0
BEGIN
    RAISERROR(' ', 0, 1) WITH NOWAIT;
    RAISERROR('*** UYARI: Bu surum ONLINE rebuild desteklemiyor.', 0, 1) WITH NOWAIT;
    RAISERROR('*** REBUILD tablolari KILITLEYECEK. Site acikken calistirma.', 0, 1) WITH NOWAIT;
END

/* ------------------------------------------------------- ADAYLARI TOPLA --- */
/* Anlık görüntü alınır: döngü sırasında DMV yeniden okunmaz (pahalı + değişken).
   ÖNCE değerleri de buradan gelir — DMV ikinci kez taranmaz. */

DECLARE @Adaylar TABLE (
    Sira     int IDENTITY(1,1) PRIMARY KEY,
    ObjId    int,
    IdxId    int,
    Sema     sysname,
    Tablo    sysname,
    Indeks   sysname,
    Sayfa    bigint,
    Doluluk  decimal(5,1)
);

INSERT INTO @Adaylar (ObjId, IdxId, Sema, Tablo, Indeks, Sayfa, Doluluk)
SELECT i.object_id, i.index_id,
       SCHEMA_NAME(o.schema_id), o.name, i.name,
       ips.page_count,
       CAST(ips.avg_page_space_used_in_percent AS decimal(5,1))
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'SAMPLED') AS ips
JOIN sys.indexes i ON i.object_id = ips.object_id AND i.index_id = ips.index_id
JOIN sys.objects o ON o.object_id = i.object_id
WHERE ips.index_level = 0
  AND ips.page_count >= @AsgariSayfa
  AND ips.avg_page_space_used_in_percent < @AsgariBosluk
  AND i.index_id > 0            -- heap değil
  AND i.is_disabled = 0
  AND i.is_hypothetical = 0
  AND i.type IN (1, 2)          -- yalnız rowstore (kümelenmiş / kümelenmemiş)
  AND o.is_ms_shipped = 0
  AND i.name IS NOT NULL
ORDER BY ips.page_count DESC;

DECLARE @Toplam int = (SELECT COUNT(*) FROM @Adaylar);

/* Yapacak iş yoksa erken çık: boş toplam satırı (NULL) basmak kafa karıştırır.
   Bu yol normaldir — bakım turu zaten yapılmışsa ya da doluluk iyiyse buraya düşer. */
IF @Toplam = 0
BEGIN
    RAISERROR(' ', 0, 1) WITH NOWAIT;
    SET @Satir = CONCAT('Islenecek indeks YOK: ', @AsgariSayfa, ' sayfadan buyuk ve dolulugu %',
                        @AsgariBosluk, ' altinda olan indeks bulunamadi. Yapilacak is yok.');
    RAISERROR('%s', 0, 1, @Satir) WITH NOWAIT;
    RETURN;
END

/* ÖNCE: yalnız işlenecek indeksler. SONRA ölçümü de AYNI kümeyi ölçer —
   yoksa sıkışıp eşiğin altına inenler "sonra" tablosundan düşer ve
   karşılaştırma yanıltıcı olur. */
RAISERROR(' ', 0, 1) WITH NOWAIT;
RAISERROR('--- ONCE (islenecek indeksler) ---', 0, 1) WITH NOWAIT;

SELECT COUNT(*)                                       AS Indeks,
       SUM(Sayfa)                                     AS ToplamSayfa,
       CAST(SUM(Sayfa) * 8.0 / 1024 AS decimal(10,1)) AS ToplamMB,
       CAST(AVG(Doluluk) AS decimal(5,1))             AS OrtDoluluk
FROM @Adaylar;

RAISERROR(' ', 0, 1) WITH NOWAIT;
SET @Satir = CONCAT('--- ', @Toplam, ' indeks islenecek (yontem: ', @Yontem, ') ---');
RAISERROR('%s', 0, 1, @Satir) WITH NOWAIT;

/* ------------------------------------------------------------- DÖNGÜ ------ */

DECLARE @i int = 1, @Basarili int = 0, @Atlanan int = 0;
DECLARE @Sema sysname, @Tablo sysname, @Indeks sysname, @Sayfa bigint, @Doluluk decimal(5,1);
DECLARE @Sql nvarchar(max);

WHILE @i <= @Toplam
BEGIN
    SELECT @Sema = Sema, @Tablo = Tablo, @Indeks = Indeks, @Sayfa = Sayfa, @Doluluk = Doluluk
    FROM @Adaylar WHERE Sira = @i;

    SET @Sql = N'ALTER INDEX ' + QUOTENAME(@Indeks)
             + N' ON ' + QUOTENAME(@Sema) + N'.' + QUOTENAME(@Tablo)
             + CASE WHEN @Yontem = 'REBUILD'
                    THEN N' REBUILD' + CASE WHEN @Online = 1 THEN N' WITH (ONLINE = ON)' ELSE N'' END
                    ELSE N' REORGANIZE' END
             + N';';

    BEGIN TRY
        EXEC sp_executesql @Sql;
        SET @Basarili += 1;
        SET @Satir = CONCAT('(', @i, '/', @Toplam, ') OK       ', @Sema, '.', @Tablo, '.', @Indeks,
                            '  (', @Sayfa, ' sayfa, doluluk %', @Doluluk, ')');
    END TRY
    BEGIN CATCH
        SET @Atlanan += 1;
        SET @Satir = CONCAT('(', @i, '/', @Toplam, ') ATLANDI  ', @Sema, '.', @Tablo, '.', @Indeks,
                            '  -> ', ERROR_MESSAGE());
    END CATCH

    RAISERROR('%s', 0, 1, @Satir) WITH NOWAIT;
    SET @i += 1;
END

/* -------------------------------------------------- İSTATİSTİK TAZELEME --- */
/* REBUILD istatistiği tam taramayla kendisi günceller; REORGANIZE DOKUNMAZ.
   Bayat istatistik yanlış plan seçtirir — o yüzden REORGANIZE sonrası şart. */

IF @IstatGuncelle = 1 AND @Yontem = 'REORGANIZE' AND @Basarili > 0
BEGIN
    RAISERROR(' ', 0, 1) WITH NOWAIT;
    RAISERROR('--- Istatistikler guncelleniyor ---', 0, 1) WITH NOWAIT;

    DECLARE @Tablolar TABLE (Sira int IDENTITY(1,1) PRIMARY KEY, Sema sysname, Tablo sysname);
    INSERT INTO @Tablolar (Sema, Tablo)
    SELECT DISTINCT Sema, Tablo FROM @Adaylar;

    DECLARE @j int = 1, @TopT int = (SELECT COUNT(*) FROM @Tablolar);
    WHILE @j <= @TopT
    BEGIN
        SELECT @Sema = Sema, @Tablo = Tablo FROM @Tablolar WHERE Sira = @j;
        SET @Sql = N'UPDATE STATISTICS ' + QUOTENAME(@Sema) + N'.' + QUOTENAME(@Tablo) + N';';
        BEGIN TRY
            EXEC sp_executesql @Sql;
        END TRY
        BEGIN CATCH
            SET @Satir = CONCAT('  istatistik atlandi: ', @Sema, '.', @Tablo, ' -> ', ERROR_MESSAGE());
            RAISERROR('%s', 0, 1, @Satir) WITH NOWAIT;
        END CATCH
        SET @j += 1;
    END

    SET @Satir = CONCAT('  ', @TopT, ' tablo guncellendi.');
    RAISERROR('%s', 0, 1, @Satir) WITH NOWAIT;
END

/* --------------------------------------------------------- SONRA: ÖLÇÜM --- */

RAISERROR(' ', 0, 1) WITH NOWAIT;
SET @Satir = CONCAT('--- BITTI: ', @Basarili, ' islendi, ', @Atlanan, ' atlandi ---');
RAISERROR('%s', 0, 1, @Satir) WITH NOWAIT;
RAISERROR('--- SONRA (ayni indeksler) ---', 0, 1) WITH NOWAIT;

SELECT
    COUNT(*)                                                     AS Indeks,
    SUM(ips.page_count)                                          AS ToplamSayfa,
    CAST(SUM(ips.page_count) * 8.0 / 1024 AS decimal(10,1))      AS ToplamMB,
    CAST(AVG(ips.avg_page_space_used_in_percent) AS decimal(5,1)) AS OrtDoluluk
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'SAMPLED') AS ips
JOIN @Adaylar a ON a.ObjId = ips.object_id AND a.IdxId = ips.index_id
WHERE ips.index_level = 0;

/* ============================================================================
   SONUCU NASIL OKUMALI
   "OrtDoluluk" öncesine göre yükselmeli, "ToplamMB" düşmeli. REORGANIZE ile tek
   turda %95'e çıkmayabilir — normaldir; asıl kazanç REBUILD'dedir ve o da bakım
   penceresi ister. Doluluk %85'in üstüne çıktıysa iş bitmiştir.

   Bu TEK SEFERLİK bir turdur: sıralı GUID düzeltmesi canlıda olduğu için israf
   yeniden birikmez. Düzenli bakım işine gerek yok.
   ============================================================================ */
