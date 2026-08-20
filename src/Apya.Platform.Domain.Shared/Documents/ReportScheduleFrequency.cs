namespace Apya.Platform.Documents;

/// <summary>
/// Zamanlanmış rapor üretiminin sıklığı.
///
/// Serbest cron İFADESİ bilinçli olarak yok: kurum raporları haftalık/aylık/
/// üç aylık ritimde üretiliyor ve cron, kullanıcının yanlış kurup sessizce
/// hiç çalışmayan bir zamanlama bırakmasına çok elverişli.
/// </summary>
public enum ReportScheduleFrequency
{
    Weekly = 1,
    Monthly = 2,
    Quarterly = 3
}
