# syntax=docker/dockerfile:1

# =====================================================================
#  BUILD AŞAMASI — .NET 10 SDK + Node.js + ABP CLI
#  (wwwroot/libs gitignore'da olduğu için client kütüphaneleri burada üretilir)
# =====================================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Node.js 20 (LeptonX/chart.js client-lib kurulumu için) + Yarn + ABP CLI
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g yarn \
    && dotnet tool install -g Volo.Abp.Cli \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
ENV PATH="$PATH:/root/.dotnet/tools"

# Kaynağı kopyala ve restore et.
# (Not: ileride katman cache'i için önce sadece *.csproj kopyalanıp restore edilebilir;
#  şimdilik sadelik için tüm src kopyalanıyor.)
COPY Apya.Platform.slnx common.props ./
COPY src/ ./src/
RUN dotnet restore Apya.Platform.slnx

# Client-side kütüphaneler: abp.resourcemapping.js'e göre wwwroot/libs'i doldurur
RUN cd src/Apya.Platform.Web && abp install-libs

# Publish — Web ve DbMigrator ayrı çıktı dizinlerine
RUN dotnet publish src/Apya.Platform.Web/Apya.Platform.Web.csproj \
        -c Release -o /app/web --no-restore \
    && dotnet publish src/Apya.Platform.DbMigrator/Apya.Platform.DbMigrator.csproj \
        -c Release -o /app/migrator --no-restore

# =====================================================================
#  WEB RUNTIME
# =====================================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS web
WORKDIR /app

# QuestPDF (fatura PDF üretimi) Linux'ta fontconfig + font ister; yoksa PDF render patlar.
# curl → compose healthcheck'i (/health/live) için.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libfontconfig1 fonts-dejavu curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Reverse proxy (Caddy) arkasında: HTTP dinle, X-Forwarded-Proto'ya güven.
ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_FORWARDEDHEADERS_ENABLED=true \
    DOTNET_RUNNING_IN_CONTAINER=true

COPY --from=build /app/web ./
EXPOSE 8080
ENTRYPOINT ["dotnet", "Apya.Platform.Web.dll"]

# =====================================================================
#  DB MIGRATOR (tek seferlik: migration uygular + seed eder, sonra çıkar)
# =====================================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS migrator
WORKDIR /app
ENV DOTNET_ENVIRONMENT=Production \
    DOTNET_RUNNING_IN_CONTAINER=true
COPY --from=build /app/migrator ./
ENTRYPOINT ["dotnet", "Apya.Platform.DbMigrator.dll"]
