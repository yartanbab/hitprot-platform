using Volo.Abp;

namespace Apya.Platform.Projects.Rules;

public static class ProjectBusinessRules
{
    public static void CheckName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new BusinessException("Project:NameEmpty");
        }
    }

    public static void CheckCode(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            throw new BusinessException("Project:CodeEmpty");
        }
    }
}
