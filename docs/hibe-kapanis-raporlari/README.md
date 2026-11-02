# Hibe kapanış raporu şablonları

Rapor oluşturucudaki kapanış (sonuç / nihai) raporu sistem şablonlarının dayanağı. Şablonların
bölüm listesi ve sırası `ReportTemplateDataSeedContributor.BuildClosingReportDefinitions`'tadır;
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
