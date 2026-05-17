using System;
using Volo.Abp;

namespace Apya.Platform.Ai;

public class AiProviderException : BusinessException
{
    public AiProviderException(string code, string? message = null, Exception? innerException = null)
        : base(code, message, innerException: innerException)
    {
    }
}
