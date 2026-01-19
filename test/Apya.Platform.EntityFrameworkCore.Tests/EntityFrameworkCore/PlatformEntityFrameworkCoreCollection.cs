using Xunit;

namespace Apya.Platform.EntityFrameworkCore;

[CollectionDefinition(PlatformTestConsts.CollectionDefinitionName)]
public class PlatformEntityFrameworkCoreCollection : ICollectionFixture<PlatformEntityFrameworkCoreFixture>
{

}
