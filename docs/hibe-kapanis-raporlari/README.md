# Hibe kapanış ve ara rapor şablonları

Rapor oluşturucudaki kurum (hibe veren) sistem şablonlarının dayanağı. Şablonların bölüm listesi ve sırası
`ReportTemplateDataSeedContributor`'dadır (`BuildClosingReportDefinitions`, `BuildInterimReportDefinitions`);
tek doğruluk kaynağı koddur, burada tekrarlanmaz.

- **Araştırma tarihi:** 2026-10-31. Kapsam: hibe kataloğundaki 82 veren kurum, 171 program.
- **Yöntem:** Her kurumun resmi kapanış raporu formatı (form, uygulama esasları, rehber, sözleşme) okundu,
  aynı iskeleti paylaşan formatlar tek şablonda birleştirildi (50 format → 23 şablon).
- **Güven:** *doğrulandı* = resmi form ya da mevzuat metni okundu · *kısmen* = kural resmi, form başlıkları eksik.
- Şablonlar **açık bölümleri resmi formun okuma sırasıyla** getirir; kapalı bölümler arkaya dizilir ve
  kullanıcı rapor oluşturucuda açabilir. Formların platformun üretemediği alanları (yayın listesi, fikri
  mülkiyet bildirimi, ticarileşme planı, katılımcı listesi vb.) ek olarak yüklenir.

## Şablonlar

| # | Şablon | Veren kurum | Dayandığı resmi formatlar | Güven | Kaynak |
|---|---|---|---|---|---|
| 1 | TÜBİTAK TEYDEB proje sonuç raporu | TÜBİTAK | TÜBİTAK 1501/1507 proje sonuç raporu (AGY350 / AGY351) (doğrulandı)<br>TÜBİTAK 1509 proje sonuç raporu (AGY353): Eureka küme, Globalstars ve Network Projects çağrılarının Türkiye tarafı (kısmen)<br>TÜBİTAK Yenilik Destek Programı proje sonuç raporu ve ticarileşme planı (1707, 1719) (kısmen) | kısmen | [1](https://www.tubitak.gov.tr/sites/default/files/21566/proje_sonuc_raporu_agy350.pdf) [2](https://tubitak.gov.tr/sites/default/files/2024-11/25.10.2024_tarihli_Baskanlik_Olur_u_1509_islenmis_hali_1.pdf) |
| 2 | TÜBİTAK ARDEB / BİDEB sonuç raporu | TÜBİTAK | TÜBİTAK 1071 sonuç raporu (ARDEB-PTS biçimi): ikili işbirliği ve Ufuk Avrupa ortaklıklarının ulusal tarafı (kısmen)<br>TÜBİTAK 2247-A/D sonuç raporu (BİDEB) (doğrulandı) | kısmen | [1](https://tubitak.gov.tr/sites/default/files/2026-03/1071_Usul_Ve_Esaslari_79_sayili_YK_Islenmis_Hali.pdf) [2](https://tubitak.gov.tr/sites/default/files/2024-04/2247ad_psr_kurallari_2023.doc) |
| 3 | TÜBİTAK 1007 proje sonu raporu | TÜBİTAK | TÜBİTAK 1007 (KAMAG) proje sonu raporu (doğrulandı) | doğrulandı | [1](https://tubitak.gov.tr/sites/default/files/2023-08/sonucraporuformu_0.doc) |
| 4 | TÜBİTAK 1831 kapanış dönem raporu | TÜBİTAK | TÜBİTAK 1831 Yeşil İnovasyon Mentörlük: tek dönem raporu ve yol haritası (doğrulandı) | doğrulandı | [1](https://tubitak.gov.tr/sites/default/files/2024-10/1831_Donem_Raporu.docx) |
| 5 | TÜBİTAK etkinlik ve fuar sonuç raporu | TÜBİTAK | TÜBİTAK 2223-B/C etkinlik düzenleme raporu ve kesin hesap (doğrulandı)<br>TÜBİTAK 4006 bilim fuarı sonuç raporu (kısmen) | kısmen | [1](https://www.tubitak.gov.tr/tr/destekler/bilimsel-etkinlik/etkinlik-duzenleme-destekleri/icerik-2223-b-yurt-ici-bilimsel-etkinlik-duzenleme-destegi) [2](https://tubitak.gov.tr/sites/default/files/2026-10/4006_Usul_Esaslar_84_YK_islenmis_hali.pdf) |
| 6 | Uluslararası ortaklık nihai raporu | Eureka · Ufuk Avrupa | Eureka uluslararası kapanış belgesi (küme Final Project Report / End of Project Report) (kısmen)<br>Ufuk Avrupa ortaklığı ulusötesi nihai rapor (Call Secretariat'e) (kısmen) | kısmen | [1](https://bscw.celticnext.eu/pub/bscw.cgi/d27756/Handbook-CELTIC-NEXT-2019.pdf) [2](https://tubitak.gov.tr/sites/default/files/2026-06/Uluslararasi_Cagri_Dokumani.pdf) |
| 7 | Innowwide final raporu | Eureka | Innowwide pazar fizibilite final raporu (doğrulandı) | doğrulandı | [1](https://www.eurekanetwork.org/programmes-and-calls/innowwide/innowwide-library/) |
| 8 | KOSGEB proje sonuç raporu | KOSGEB | KOSGEB Stratejik Ürün — Proje Sonuç Raporu (doğrulandı)<br>KOSGEB Girişimci Destek Programı — İş Geliştirme Desteği Proje Sonuç Raporu (doğrulandı) | doğrulandı | [1](https://webdosya.kosgeb.gov.tr/Content/Upload/Dosya/Stratejik%20Urun/06.09.2024/10-Stratejik_%C3%9Cr%C3%BCn_Destek_Program%C4%B1_Proje_Sonu%C3%A7_Raporu.pdf) [2](https://webdosya.kosgeb.gov.tr/Content/Upload/Dosya/Giri%C5%9Fimcilik/2024/FRM.35.00.18_(00) |
| 9 | KOSGEB TEKMER / SEGEM dönem raporu (4 / 3 ayda bir) | KOSGEB | KOSGEB TEKMER — Faaliyet Raporu (son izleme dönemi) (kapanış raporu DEĞİL) (doğrulandı)<br>KOSGEB SEGEM — Gerçekleşme Raporu (son izleme dönemi) (kapanış raporu DEĞİL) (kısmen) | kısmen | [1](https://webdosya.kosgeb.gov.tr/Content/Upload/Dosya/%C4%B0%C5%9EGEM-TEKMER/TEKMER/2024/2024.04.22/FRM.26.00.10_TEJMER_Destek_Program%C4%B1_Faaliyet_Raporu.pdf) [2](https://webdosya.kosgeb.gov.tr/Content/Upload/Dosya/SEGEM/14.05.2026/FRM.42.00.13_SEGEM_Destek_Program%C4%B1_Ger%C3%A7ekle%C5%9Fme_Raporu.pdf) |
| 10 | Yatırım tamamlama ve nihai ödeme dosyası | Sanayi ve Teknoloji Bakanlığı · TKDK | Yatırım Tamamlama Vizesi Dosyası (9903 / Teknoloji Hamlesi) (kapanış raporu DEĞİL — tamamlama müracaatı) (doğrulandı)<br>TKDK IPARD III — Ödeme Talep Paketi (ÖTP) (kapanış raporu DEĞİL — nihai ödeme talebi) (kısmen) | kısmen | [1](https://yatirimadestek.gov.tr/pdf/assets/upload/dosyalar/teblig-yatirim_tesvik_uygulamalari.pdf) [2](https://www.tkdk.gov.tr/Dokuman/ipard-iii-3-cagri-otp-hazirlama-rehberi-1473) |
| 11 | GSB ÜNİDES sonuç raporu | Gençlik ve Spor Bakanlığı | GSB ÜNİDES — Proje Sonuç Raporu (Ek-8) (doğrulandı) | doğrulandı | [1](https://genclikhizmetleri.gov.tr/wp-content/uploads/2025/02/Ek-8-UNIDES-Ogrenci-Topluluklari-Sonuc-Raporu.pdf) |
| 12 | Kalkınma ajansı nihai raporu | Kalkınma ajansları | Mali Destek Programı Nihai Raporu (KAGM PUR EK 4.1 / Sözleşme Ek IX-B) (doğrulandı)<br>Fizibilite Desteği Nihai Raporu + Fizibilite Etüdü (kısmen)<br>Alternatif Destek: Danışmanlık + Yatırım Planı Nihai Raporu (GEKA RSİ) (kısmen)<br>Faizsiz Kredi Desteği Nihai Raporu (MARKA) (tahmin) | tahmin | [1](https://istka.org.tr/Archive/Content/ce0878c684d437f5aeefaf24a748e501ddcf23dd.pdf) [2](https://oka.gov.tr/assets/upload/dosyalar/26-fzd-kd-basvuru-rehberi.pdf) |
| 13 | Kalkınma ajansı teknik destek nihai raporu | Kalkınma ajansları | Teknik Destek Nihai Raporu (danışmanlık/eğitim hizmeti raporu) (kısmen) | kısmen | [1](https://www.oran.org.tr/dokuman/2026-imalat-sanayi-teknik-destek-rehberi_son.pdf) |
| 14 | Kalkınma ajansı tur sonrası belge dosyası | Kalkınma ajansları | Alternatif Mali Destek: Tur Sonrası Belge Dosyası (ORAN Keşfet) (doğrulandı) | doğrulandı | [1](https://www.oran.org.tr/dokuman/2026-yili-alternatif-mdp-rehberi.pdf) |
| 15 | AB Funding & Tenders nihai raporu | Avrupa Komisyonu | AB Funding & Tenders — Ufuk Avrupa nihai raporu (Periodic/Final Report, HE) (doğrulandı)<br>AB Funding & Tenders — Ufuk dışı programlar nihai raporu (DEP / ERASMUS-EACEA) (doğrulandı) | doğrulandı | [1](https://ec.europa.eu/info/funding-tenders/opportunities/docs/2021-2027/digital/temp-form/report/periodic-report_dep_en.pdf) |
| 16 | Erasmus+ Ulusal Ajans nihai raporu | Türkiye Ulusal Ajansı | Erasmus+ Ulusal Ajans — KA2 İşbirliği Ortaklığı nihai yararlanıcı raporu (Beneficiary Module) (doğrulandı)<br>Erasmus+ / Avrupa Dayanışma Programı Ulusal Ajans — KA1 hareketlilik ve ESC nihai yararlanıcı raporu (doğrulandı) | doğrulandı | [1](https://ua.gov.tr/media/mqrfv4qs/oek_2020_ka229_nihai_donem_toplantisi.pdf) [2](https://wikis.ec.europa.eu/display/NAITDOC/Final+Beneficiary+Report+templates) |
| 17 | EIT nihai performans ve maliyet raporu | EIT | EIT KIC alt hibe nihai performans + maliyet raporu (KPI + deliverable + FSM) (doğrulandı)<br>EIT kısa, teslimat bazlı götürü bedel raporu (startup destekleri) (doğrulandı) | doğrulandı | [1](https://www.eiturbanmobility.eu/call-for-proposals/sme-market-expansion-open-call-2027/) [2](https://assets.eitfood.eu/files/EIT-Food-LumpSum-Subgrant-Agreement_Seedbed-Venture-Catalyst.pdf) |
| 18 | Anlatı ve mali nihai rapor | Vakıflar ve uluslararası fonlar | AB destekli STK hibesi — nihai anlatı + mali rapor (kısmen)<br>Genel vakıf/uluslararası fon nihai raporu (anlatı + makbuzlu mali rapor) (kısmen)<br>Alanı Genişlet (GoFor / Sivil Toplum için Destek Vakfı) nihai teknik ve mali raporu (kısmen)<br>Büyükelçilik küçük hibe kapanış (acquittal) raporu (kısmen)<br>Global EbA Fonu nihai anlatı + mali ve denetim raporu (kısmen)<br>CIVICUS Kriz Müdahale Fonu nihai anlatı, mali ve etki raporu (kısmen)<br>Sumitomo Vakfı proje tamamlama + mali + restorasyon raporu (kısmen) | kısmen | [1](https://rm.coe.int/g17-2b-eng-grant-agreement-for-eu-funds/16809fce40) [2](https://www.frontlinedefenders.org/en/programme/protection-grants) |
| 19 | Demokrasi fonu nihai raporu | NED · EED | Demokrasi fonu nihai anlatı + sertifikalı mali rapor (NED tipi) (doğrulandı) | doğrulandı | [1](https://www.ned.org/wp-content/uploads/2022/01/Grantee-Guide-2022-Final.pdf) |
| 20 | Kısa sonuç raporu | Küçük hibe ve hareketlilik fonları | Kısa sonuç raporu (küçük hibe / cascade) (doğrulandı)<br>Wikimedia Rapid Fund nihai raporu (doğrulandı)<br>UN Women teknik/lojistik destek faaliyet raporu (doğrulandı)<br>Hareketlilik (seyahat / araştırma konaklaması) dönüş raporu (kısmen) | kısmen | [1](https://cordis.europa.eu/programme/id/HORIZON_HORIZON-EIE-2022-SCALEUP-02-02) [2](https://meta.wikimedia.org/wiki/Grants:Programs/Wikimedia_Community_Fund/Rapid_Fund) |
| 21 | Yayın ve medya teslim raporu | Pulitzer · National Geographic · Goethe | Pulitzer Center yayın teslimi ve etki anketi (habercilik hibesi) (kısmen)<br>National Geographic Society nihai rapor + medya varlıkları (kısmen)<br>Goethe-Institut Uluslararası Ortak Yapım Fonu kapanış belgelemesi (kısmen) | kısmen | [1](https://pulitzercenter.org/grants-fellowships/grants-fellowships/pulitzer-center-crediting-requirements) [2](https://www.nationalgeographic.org/society/grants-and-investments/) |
| 22 | Teslimat bazlı kapanış raporu | Open Technology Fund | Open Technology Fund teslimat bazlı aylık rapor ve kapanış (kısmen) | kısmen | [1](https://www.opentech.fund/funds/internet-freedom-fund/) |
| 23 | Masraf ve katılım kanıt paketi | AB destek programları | Masraf ve katılım kanıt paketi (anlatı raporu yok) — isteğe bağlı şablon (doğrulandı) | doğrulandı | [1](http://ai4gov-x.eu/wp-content/uploads/2026/04/Financial-Support-Agreement-template.pdf) |

## Ara rapor şablonları

Proje sürerken verilen dönem / gelişme / periyodik / ilerleme raporları. Her ara rapor **türü** için tek
şablon vardır: dönem raporları her dönem aynı yapıdadır, tarih aralığı rapor üretilirken seçilir. Sıklık
sabitse şablon adında yazar. `*` işaretli iki şablon yeni değildir; resmi forma göre düzeltilmiştir (aşağıda).

| Kimlik | Şablon | Veren kurum | Dayandığı resmi formatlar | Adet / sıklık | Güven | Kaynak |
|---|---|---|---|---|---|---|
| 1* | KOSGEB ara rapor (3 ayda bir) | KOSGEB | Dönemsel İzleme Formu (FRM.13.00.06 / FRM.35.00.17) (doğrulandı) | 3 ayda bir; Stratejik Ürün'de en fazla 8, İş Geliştirme'de 12 dönem | doğrulandı | [1](https://webdosya.kosgeb.gov.tr/Content/Upload/Dosya/Stratejik%20Urun/06.09.2024/11-Stratejik_%C3%9Cr%C3%BCn_Destek_Program%C4%B1_D%C3%B6nemsel_%C4%B0zleme_Formu.pdf) |
| 2* | TÜBİTAK TEYDEB dönem raporu (6 ayda bir) | TÜBİTAK | TÜBİTAK 1501/1507/1509 dönem raporu (AGY320 / AGY321 / AGY323) (doğrulandı)<br>TÜBİTAK Yenilik Destek Programı dönem raporu (1707 Sipariş Ar-Ge, 1719 Eureka ulusal çağrıları) (doğrulandı)<br>TÜBİTAK 1511 (Teknoloji Hamlesi Ar-Ge aşaması) — Dönem Raporu (AGY311 / AGY341) (kısmen) | Dönemler takvim yarıyıllarıdır: 1 Ocak–30 Haziran ve 1 Temmuz–31 Aralık (her üç programın UE'sinde aynı tanım). Destek süresinin dokunduğu her yarıyıl için … | kısmen | [1](https://www.tubitak.gov.tr/sites/default/files/21566/donem_raporu_teknik_rapor_agy320.pdf) [2](https://tubitak.gov.tr/sites/default/files/2023-09/1707-donem_raporu-ornektir-web_0.pdf) |
| 201 | TÜBİTAK 1007 gelişme raporu (4–8 ayda bir) | TÜBİTAK | TÜBİTAK 1007 (KAMAG) gelişme raporu (doğrulandı) | Gelişme raporu dönemleri en az 4, en fazla 8 ay olacak şekilde, ara çıktılara, iş paketlerine ve proje aşamalarına göre sözleşmede belirlenir (md. 17). · … | doğrulandı | [1](https://www.tubitak.gov.tr/sites/default/files/2023-08/gelismeraporuformu_.doc) |
| 202 | TÜBİTAK ARDEB / BİDEB gelişme raporu | TÜBİTAK | TÜBİTAK 1071 / ARDEB-PTS gelişme raporu (ikili işbirliği ve Ufuk Avrupa ortaklıklarının ulusal tarafı) (kısmen) | Sözleşmede belirtilen tarihlerde verilir; mevzuatta sabit bir sıklık yok. ARDEB şablon örneklerinde 6 aylık (01/01–01/06) ve 12 aylık dönemler görülüyor … | kısmen | [1](https://tubitak.gov.tr/sites/default/files/2024-05/gelisme_raporu_formu_0.doc) |
| 203 | Uluslararası ortaklık ara raporu | Eureka · Ufuk Avrupa | Ufuk Avrupa ortaklığı ulusötesi ara raporu (mid-term / annual) (kısmen)<br>Eureka küme ara raporları: üç aylık rapor ve ara değerlendirme (Celtic-Next örneği) (doğrulandı) | Water4All: proje süresi 36 ay → 1 ara rapor (mid-term). Water4All "Mid-term meeting" ile eşleşir; toplantı 2029 sonbaharında planlanıyor. · CETP: 1 bilgi … | kısmen | [1](https://tubitak.gov.tr/sites/default/files/2026-06/Uluslararasi_Cagri_Dokumani.pdf) [2](https://bscw.celticnext.eu/pub/bscw.cgi/d27756/Handbook-CELTIC-NEXT-2019.pdf) |
| 204 | BiGG+ iş planı ilerleme raporu (6 ayda bir) | TÜBİTAK | BiGG+ iş planı ilerleme raporu (AGY312) (doğrulandı) | Yatırımın tamamlandığı ayı izleyen ayın ilk gününden başlayarak 36 ay, altışar aylık dönemler (takvim yarıyılı değil, yatırım tarihine göre). Toplam 6 adet … | doğrulandı | [1](https://tubitak.gov.tr/sites/default/files/2024-08/1812-is_plani_ilerleme_raporu_agy312_R1_06.08.2024.docx) |
| 205 | Kalkınma ajansı ara raporu (en fazla 3) | Kalkınma ajansları | Kalkınma ajansı ara raporu (mali destek, PUR EK 4.1 / Sözleşme Ek IX-A) (doğrulandı) | Sabit bir sayı yok. Adet ve dönemler projeye özel sözleşmede yazılır. Sözleşme şablonu: "‹….› adet ara rapor ‹…›, ‹…›, ‹…› dönemlerinde" (Özel Koşullar … | doğrulandı | [1](https://istka.org.tr/Archive/Content/ce0878c684d437f5aeefaf24a748e501ddcf23dd.pdf) |
| 206 | AB Funding & Tenders periyodik ara raporu | Avrupa Komisyonu | AB Funding & Tenders — periyodik ara rapor (RP1, RP2 … , son RP hariç) (doğrulandı) | Raporlama dönemleri (RP) hibe hazırlığında Veri Sayfası 4.2'ye tek tek yazılır; MGA sabit bir sayı vermez. Her RP sonunda bir periyodik rapor verilir. Son … | doğrulandı | [1](https://ec.europa.eu/info/funding-tenders/opportunities/docs/2021-2027/common/agr-contr/general-mga_horizon-euratom_en.pdf) |
| 207 | AB ek ön finansman raporu | Avrupa Komisyonu | 1b. AB Funding & Tenders — ek ön finansman raporu ve EIC ilerleme toplantısı (doğrulandı) | Veri Sayfasındaki RP satırlarından hangilerinin "Additional prefinancing report" türünde olduğuna bağlı (MGA şablonunda örnek: RP1 = ek ön finansman raporu, … | doğrulandı | [1](https://ec.europa.eu/info/funding-tenders/opportunities/docs/2021-2027/common/agr-contr/general-mga_horizon-euratom_en.pdf) |
| 208 | Erasmus+ Ulusal Ajans ara / ilerleme raporu | Türkiye Ulusal Ajansı | Erasmus+ Ulusal Ajans — KA2 periyodik / ilerleme raporu (Beneficiary Module) (kısmen)<br>Erasmus+ KA1 Gençlik ve Avrupa Dayanışma Programı — ara / periyodik rapor (doğrulandı) | Ödeme talepsiz periyodik/ilerleme raporu: 60.000 €'ya kadar olan projeler (KA210'un tamamı) ve 24 aya kadar süren 120.000 € / 250.000 €'luk KA220 projeleri. … | kısmen (Türkiye Ulusal Ajansı'na özgü belge okunmadı; kaynak Hollanda ulusal ajansı) | [1](https://www.erasmusplus.nl/sites/default/files/2025-09/Erasmus%2B%20tussenrapportages%20-%20korte%20handleiding%20voor%20KA2%20projectco%C3%B6rdinatoren.pdf) |
| 209 | EIT ara inceleme (6 aylık / dönem ortası) | EIT | EIT Urban Mobility — 6 aylık ara inceleme (Interim Review) (doğrulandı)<br>EIT Culture & Creativity — dönem ortası güncellemesi (Mid-Year Review) (doğrulandı) | 1–9 ay → 0 ara, nihai M1–9 · 10–15 ay → 1 ara (M1–6), nihai M7–son · 16–21 ay → 2 ara (M1–6, M7–12), nihai M13–son · 22–27 ay → 3 ara, nihai M19–son · 28–33 … | doğrulandı | [1](https://www.eiturbanmobility.eu/call-for-proposals/sme-market-expansion-open-call-2027/) |
| 210 | EIT yıllık performans ve maliyet paketi | EIT | EIT takvim yılı ara raporu — yıllık performans + maliyet paketi (doğrulandı) | EIT C&C: projenin faaliyet yürüttüğü her takvim yılı için 1 yıllık paket (yılın bir kısmında çalışılmış olsa bile zorunlu). Projenin bittiği yılın paketi … | doğrulandı | [1](https://eit-hei.eu/wp-content/uploads/2026/10/EIT-HEI-Model-Project-Agreement-template_Cohort-6_V01_Call-for-Proposals-2026.pdf) |
| 211 | Kilometre taşı ödeme raporu | Women TechEU · EIT Food | Kilometre taşı ödeme raporu (cascade / götürü bedel) (doğrulandı) | Women TechEU 2: sabit 3 rapor, 6 aylık program boyunca: Ay 1 (başlangıç raporu, 37.500 €, %50) · Ay 3 (ilerleme, 30.000 €, %40) · Ay 6 (tamamlanma ve etki, … | doğrulandı | [1](https://womentecheurope.eu/wp-content/uploads/2026/07/WomenTechEU_Guidelines_FullProposal.pdf) |
| 212 | Ara anlatı ve mali rapor | Vakıflar ve uluslararası fonlar | Avrupa Konseyi STK hibesi — ara anlatı + mali ilerleme raporu (doğrulandı)<br>Çeyreklik anlatı ve mali ara rapor (NED tipi) (doğrulandı)<br>Altı aylık ilerleme ve ara mali rapor (takvime bağlı) (kısmen)<br>Tek ara anlatı ve mali rapor (taksit koşullu) (kısmen) | Sözleşmeye bağlı. Yeni şablonlarda mali ilerleme raporu, harcama ilk taksitte alınan fonun en az %85'ine (bir şablonda %70) ulaştığında verilir ve 2. … | kısmen | [1](https://rm.coe.int/00905-9316-local-initiatives-2025-appendix-iii-grant-agreement-templat/488028ae88) [2](https://www.ned.org/wp-content/uploads/2022/01/Grantee-Guide-2022-Final.pdf) |
| 213 | Aylık ilerleme raporu | Open Technology Fund · CIVICUS | Aylık ilerleme raporu (kısmen) | Aylık, süreye bağlı. · OTF: her takvim ayının son günü. IFF sözleşmesi 12 ay → 12 aylık rapor (sonuncusunun ayrı bir final rapor olup olmadığı bulunamadı). … | kısmen | [1](https://www.opentech.fund/funds/internet-freedom-fund/) |
| 214 | Kısa dönemsel ilerleme güncellemesi | Wildlife Acoustics · MBZ | Kısa dönemsel ilerleme güncellemesi (ekipman ve tür koruma hibeleri) (kısmen) | Wildlife Acoustics Standart Ürün Hibesi: proje boyunca çeyreklik (12 aylık projede 3 çeyrek güncellemesi + bitişten 2 ay içinde final). Yalnız Kaleidoscope … | kısmen | [1](https://wildlifeacoustics.com/resources/faqs/what-is-expected-in-reports-if-im-awarded-a-grant) |

### Mevcut iki şablonun düzeltilmesi

İlk iki kurum şablonu resmi formla eksik tohumlanmıştı:

- **KOSGEB ara rapor** → Riskler (Dönemsel İzleme Formu D-Sonuç) ve Ekip katkısı (A bölümü, personel gideri) eklendi.
- **TÜBİTAK 1501 dönem raporu** → adı "TÜBİTAK TEYDEB dönem raporu (6 ayda bir)" oldu (1501, 1507, 1509, 1511,
  1707, 1719 aynı AGY32x formunu kullanır); adam-ay, bütçe, ara çıktılar, değişiklik bildirimi ve riskler
  (AGY320 2.1.1–2.3) eklendi.

Kurulu veritabanlarında düzeltme **bir kez** yapılır: şablon hâlâ eski adını taşıyorsa adı, bölüm sırası ve
açık/kapalı durumu tanıma getirilir (`ReviseLegacyTemplatesAsync`). Yeni ad işarettir; düzeltmeden sonra
host'un bu şablonlarda yaptığı değişiklikler ezilmez. Kullanıcıların kendi kopyaları etkilenmez.

### Ara rapor şablonu almayanlar

- **TEKMER / SEGEM dönem raporları**: kapanış şablonu 9 her dönemi karşılar.
- **SEGEM aylık / yıllık izleme sistemi raporu**: rapor değil, veri beslemesi.
- **Teknoloji Hamlesi yıllık proje izleme formu**: firma değil Bakanlık doldurur.
- **9903 yıllık yatırım ilerleme raporu, TURQUALITY yol haritası ilerleme formu**: resmi format bulunamadı.
- **TKDK IPARD III ara ödeme talebi**: nihai ödeme dosyası şablonuyla (10) aynı yapı.
- **Kalkınma ajansı taslak fizibilite raporu**: ara rapor değil, etüt taslağı.
- **AB sürekli raporlama**: ayrı bir rapor değil, portal modülü.
- **Erasmus for Young Entrepreneurs ilerleme notu**: isteğe bağlı, şablonu yok.

## Eklenmeyenler

- **Kültür ve Turizm Bakanlığı sinema destek faaliyet raporu** ve **Interreg NEXT MED nihai raporu**: resmi
  format bulunamadı, eşleme tahmindi. Tohumlayıcı var olan satıra dokunmadığı için yanlış bir sistem şablonu
  kurulu veritabanlarında kalırdı; format doğrulanınca eklenecek.
- **Kapanış raporu olmayan programlar** şablon almadı: krediler (KOSGEB Yapay Zekâ Kredi, KOBİ Dijital Dönüşüm),
  geri ödemeli ihracat destekleri (Ticaret Bakanlığı 5973/5986), istihdam desteği (KOSGEB İstihdamı Koruma,
  İŞKUR İşbaşı Eğitim), sermaye yatırımları (BiGG+, EIC STEP, EIT Urban Mobility startup), ödül ve vitrin
  programları (MIT Solve, Avrupa Kadın Yenilikçiler Ödülü, Selanik AGORA), bireysel katılım destekleri
  (TÜBİTAK 2224) ve ayni destekler.

## Yeni şablon eklerken

- Kimlik sırası `c1000000-0000-4000-8000-0000000001NN`; yeni şablon **sona** eklenir. Var olan bir şablonu
  silmek ya da kimliğini değiştirmek kurulu veritabanlarında yetim satır bırakır.
- Tohumlayıcı var olan şablon satırına dokunmaz: yayımlanmış bir şablonun bölümlerini değiştirmek için
  ayrı bir veri düzeltmesi gerekir.
