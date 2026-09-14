import { j as e, r, b as je } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { e as $, B as f, I as ke } from "./Dialog-Bky2XNdc.js";
import { S as W } from "./SkeletonShape-BzeBQ1R3.js";
import { E as B } from "./EmptyState-D5m5kdmR.js";
import { E as V, O as ve, D as be, P as we } from "./ProcessRibbon-BtZ1ri4F.js";
import { a as X, g as Se, b as Ne, c as Pe, d as m, e as T, f as E, r as ze, h as A, i as De, j as Re, k as Ce, l as Ie, s as Be, m as Te, n as Ee, o as Ae } from "./api-DE9auhlW.js";
import { M as Le } from "./ModalPortal-8QCz-DZi.js";
const $e = {
  1: "Zorunlu kalem",
  2: "Süresi dolmuş belge",
  3: "Eksik meta",
  4: "Gizli alan",
  5: "Boş paket"
};
function We({ result: t, loading: n, busy: g, onGenerate: h, onClose: v }) {
  var p;
  const l = (t == null ? void 0 : t.canGenerate) === !0;
  return /* @__PURE__ */ e.jsx(Le, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: v, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-pop-in apya-doc-dialog",
      style: { maxWidth: 560 },
      onClick: (c) => c.stopPropagation(),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Üretim öncesi kontrol",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start gap-3 mb-3", children: [
          /* @__PURE__ */ e.jsx(
            "div",
            {
              className: "d-grid place-items-center flex-shrink-0",
              style: {
                width: 36,
                height: 36,
                borderRadius: 12,
                background: l ? "rgba(52,211,153,.14)" : "rgba(248,113,113,.12)",
                color: l ? "var(--apya-positive-500)" : "var(--apya-negative-500)"
              },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa fa-${l ? "circle-check" : "triangle-exclamation"}` })
            }
          ),
          /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 14, fontWeight: 600 }, children: "Üretim öncesi kontrol" }),
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: n ? "Kontrol ediliyor…" : l ? "Paket üretilebilir." : `${(t == null ? void 0 : t.blockingCount) ?? 0} kalem üretimi engelliyor.` })
          ] })
        ] }),
        n ? /* @__PURE__ */ e.jsx(W, { rows: 4 }) : (((p = t == null ? void 0 : t.issues) == null ? void 0 : p.length) ?? 0) === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12.5, color: "var(--apya-text-secondary)" }, children: "Engelleyen veya uyarı gerektiren bir durum bulunmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", style: { maxHeight: 320, overflowY: "auto" }, children: t.issues.map((c, F) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "d-flex align-items-start gap-2",
            style: {
              padding: "8px 10px",
              borderRadius: 10,
              background: c.isBlocking ? "rgba(248,113,113,.08)" : "var(--apya-surface-sunken)"
            },
            children: [
              /* @__PURE__ */ e.jsx($, { variant: c.isBlocking ? "negative" : "warning", size: "sm", children: c.isBlocking ? "Bloke" : "Uyarı" }),
              /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
                /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12.5 }, children: c.message }),
                /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: $e[c.kind] || "—" })
              ] })
            ]
          },
          F
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end mt-4", children: [
          /* @__PURE__ */ e.jsx(f, { variant: "outline", size: "sm", onClick: v, children: "Kapat" }),
          /* @__PURE__ */ e.jsx(
            f,
            {
              variant: "primary",
              size: "sm",
              disabled: !l || n,
              isLoading: g,
              title: l ? void 0 : "Bloke kalemler giderilmeden üretilemez",
              onClick: h,
              children: "Paketi üret"
            }
          )
        ] })
      ]
    }
  ) }) });
}
const ee = (...t) => t.filter(Boolean).join(" "), N = {
  date: (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(t)) : "—",
  size: (t) => t ? t < 1024 * 1024 ? (t / 1024).toFixed(0) + " KB" : (t / (1024 * 1024)).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " MB" : "—"
}, ae = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Üretildi", chip: "apya-chip-positive" },
  3: { text: "Gönderildi", chip: "apya-chip-accent" }
}, L = { Pdf: 1, Zip: 2, Excel: 4 };
function Fe({ message: t, onDone: n }) {
  return r.useEffect(() => {
    const g = setTimeout(n, 3200);
    return () => clearTimeout(g);
  }, [n]), /* @__PURE__ */ e.jsx("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: t }) });
}
const Ge = (t, n) => String(t ?? "").toLowerCase() === String(n ?? "").toLowerCase();
function He() {
  const t = r.useMemo(() => new URLSearchParams(window.location.search), []), [n, g] = r.useState(t.get("projectId")), [h, v] = r.useState(
    !t.get("projectId") && !!t.get("packageId")
  ), l = r.useRef(t.get("packageId")), [p, c] = r.useState([]), [F, se] = r.useState([]), [G, ie] = r.useState([]), [b, w] = r.useState(!0), [H, M] = r.useState(null), [s, j] = r.useState(null), [y, o] = r.useState(!1), [re, ne] = r.useState(null), [le, K] = r.useState(!1), [oe, S] = r.useState(!1), [ce, O] = r.useState(""), [U, P] = r.useState([]), [Y, z] = r.useState([]), [Z, _] = r.useState(null), u = X("Platform.Documents.GenerateReports"), D = X("Platform.Documents.ShareExternally"), x = r.useCallback(async () => {
    if (!n) {
      w(!1);
      return;
    }
    w(!0);
    try {
      const [a, i, k] = await Promise.all([
        Se(n),
        Ne(),
        Pe(n)
      ]);
      c(a ?? []), se(i ?? []), ie(k ?? []);
    } catch (a) {
      m("error", "Teslim paketleri yüklenemedi."), console.error("[Deliveries] load", a);
    } finally {
      w(!1);
    }
  }, [n]);
  r.useEffect(() => {
    x();
  }, [x]), r.useEffect(() => {
    h && (async () => {
      try {
        const a = await T(l.current);
        w(!0), g(a.projectId);
        const i = new URLSearchParams(window.location.search);
        i.set("projectId", a.projectId), window.history.replaceState(null, "", `${window.location.pathname}?${i}`);
      } catch (a) {
        l.current = null, console.error("[Deliveries] resolve project", a);
      } finally {
        v(!1);
      }
    })();
  }, [h]);
  const R = async (a) => {
    M(a);
    try {
      const [i, k] = await Promise.all([T(a), D ? A(a) : Promise.resolve([])]);
      j(i), z(k ?? []);
    } catch (i) {
      m("error", "Paket açılamadı."), console.error("[Deliveries] openPackage", i);
    }
  };
  r.useEffect(() => {
    if (b || h || !l.current) return;
    const a = p.find((i) => Ge(i.id, l.current));
    l.current = null, a && R(a.id);
  }, [b, h, p]);
  const Q = async () => {
    const a = window.prompt("Paket adı:");
    if (a) {
      o(!0);
      try {
        const i = await Ie({
          projectId: n,
          name: a,
          formats: L.Pdf | L.Zip | L.Excel
        });
        await x(), await R(i.id);
      } catch (i) {
        m("error", "Paket oluşturulamadı."), console.error("[Deliveries] create", i);
      } finally {
        o(!1);
      }
    }
  }, de = async (a) => {
    o(!0);
    try {
      await Ce(a), H === a && (M(null), j(null)), await x();
    } catch {
      m("error", "Paket silinemedi.");
    } finally {
      o(!1);
    }
  }, me = async (a) => {
    if (O(a), !a.trim()) {
      P([]);
      return;
    }
    try {
      const i = await Be(n, a.trim());
      P(i.items ?? []);
    } catch (i) {
      console.error("[Deliveries] search", i);
    }
  }, pe = async (a) => {
    o(!0);
    try {
      j(await Te(s.id, [a])), O(""), P([]), await x();
    } catch {
      m("error", "Ek eklenemedi.");
    } finally {
      o(!1);
    }
  }, ye = async (a) => {
    o(!0);
    try {
      j(await Ee(a)), await x();
    } catch {
      m("error", "Ek çıkarılamadı.");
    } finally {
      o(!1);
    }
  }, he = async () => {
    S(!0), K(!0);
    try {
      ne(await De(s.id));
    } catch {
      m("error", "Kontrol çalıştırılamadı."), S(!1);
    } finally {
      K(!1);
    }
  }, xe = async () => {
    o(!0);
    try {
      const a = await Ae(s.id);
      S(!1), _(`Paket üretildi — sürüm v${a.version}.`), j(await T(s.id)), await x();
    } catch (a) {
      m("error", "Paket üretilemedi — engelleyen kalemler olabilir."), console.error("[Deliveries] generate", a);
    } finally {
      o(!1);
    }
  }, ue = async () => {
    const a = Number(window.prompt("Kaç gün geçerli olsun?", "14"));
    if (!a || a < 1) return;
    const i = window.confirm("İndirmeye izin verilsin mi? (İptal = yalnız görüntüleme)"), k = window.prompt("Filigran metni (boş bırakılabilir):") || null;
    o(!0);
    try {
      const J = await Re({
        targetType: 1,
        targetId: s.id,
        lifetimeDays: a,
        allowDownload: i,
        watermark: k
      });
      z(await A(s.id)), window.prompt("Bağlantı (yalnız şimdi gösterilir, kopyalayın):", window.location.origin + J.url);
    } catch {
      m("error", "Bağlantı oluşturulamadı.");
    } finally {
      o(!1);
    }
  }, C = (s == null ? void 0 : s.status) === 1, fe = s ? `${window.abp.appPath}Documents/Deliveries?handler=DownloadPackage&packageId=${s.id}` : null, q = s ? [
    u && {
      key: "generate",
      label: C ? "Paketi üret" : "Yeniden üret",
      icon: "fa-gears",
      disabled: y,
      onSelect: he
    },
    s.hasOutput && { key: "download", label: "Çıktıyı indir", icon: "fa-download", href: fe },
    D && s.hasOutput && {
      key: "share",
      label: "Paylaşım bağlantısı oluştur",
      icon: "fa-share-nodes",
      disabled: y,
      onSelect: ue
    },
    u && C && {
      key: "delete",
      label: "Paketi sil",
      icon: "fa-trash",
      className: "is-danger",
      disabled: y,
      onSelect: () => de(s.id)
    }
  ].filter(Boolean) : [], d = q.find((a) => a.key === (C ? "generate" : "download")) ?? null, ge = q.filter((a) => a !== d), I = (a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      be,
      {
        title: "Teslimler & arşiv",
        description: "Paket kurucu, üretim öncesi kontrol ve rapor sürümleri",
        menuItems: [
          u && n && {
            key: "new",
            label: "Yeni paket",
            icon: "fa-plus",
            disabled: y,
            onSelect: Q
          }
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(we, { active: "deliver", projectId: n }),
    a
  ] });
  return I(h ? /* @__PURE__ */ e.jsx(W, { rows: 6 }) : n ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-shell is-wide", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", style: { maxHeight: "none" }, children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Paketler" }),
        b ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(W, { rows: 4 }) }) : p.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz paket yok." }) : p.map((a) => {
          const i = ae[a.status] || ae[1];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => R(a.id),
              className: ee("apya-md-item", H === a.id && "selected"),
              style: { borderRadius: 8, height: "auto", paddingTop: 6, paddingBottom: 6 },
              children: [
                /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
                  /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: a.name }),
                  /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                    a.itemCount,
                    " ek",
                    a.periodCode ? ` · ${a.periodCode}` : ""
                  ] })
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: ee("apya-chip", i.chip), children: i.text })
              ]
            },
            a.id
          );
        }),
        /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Sürüm arşivi" }),
        G.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] px-2 pb-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz üretim yapılmadı." }) : G.map((a) => /* @__PURE__ */ e.jsxs(
          "a",
          {
            href: a.downloadUrl,
            className: "apya-md-item",
            style: { borderRadius: 8, textDecoration: "none" },
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-arrow-down", style: { fontSize: 11, color: "var(--apya-text-tertiary)" } }),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-md-item-title", children: [
                "v",
                a.version,
                " · ",
                a.reportTemplateName || "Rapor"
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 10.5 }, children: N.size(a.outputSize) })
            ]
          },
          a.id
        ))
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: s ? /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: s.name }),
            /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
              s.reportTemplateName || "Şablon seçilmedi",
              s.periodCode && ` · ${s.periodCode}`,
              s.generatedAt && ` · ${N.date(s.generatedAt)} üretildi`
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            d && (d.href ? /* @__PURE__ */ e.jsx(f, { asChild: !0, size: "sm", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: `fa ${d.icon}` }), children: /* @__PURE__ */ e.jsx("a", { href: d.href, children: d.label }) }) : /* @__PURE__ */ e.jsx(f, { variant: "primary", size: "sm", disabled: d.disabled, onClick: d.onSelect, children: d.label })),
            /* @__PURE__ */ e.jsx(ve, { size: "sm", label: "Paket eylemleri", items: ge })
          ] })
        ] }),
        s.status !== 1 && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock" }),
          " Üretilmiş paket düzenlenemez — içerik değişirse denetim izi anlamsızlaşır."
        ] }),
        s.status === 1 && u && /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx(
            ke,
            {
              size: "sm",
              placeholder: "Ek eklemek için belge ara",
              leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
              value: ce,
              onChange: (a) => me(a.target.value)
            }
          ),
          U.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-2 d-flex flex-column gap-1", children: U.slice(0, 8).map((a) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "apya-md-item",
              style: { borderRadius: 8 },
              onClick: () => pe(a.id),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", style: { fontSize: 10, color: "var(--apya-accent-500)" } }),
                /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: a.displayName }),
                /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side", style: { fontSize: 10.5 }, children: a.documentTypeName || "—" })
              ]
            },
            a.id
          )) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mb-2", children: [
            "Ekler (",
            s.items.length,
            ")"
          ] }),
          s.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Pakette henüz ek yok — boş paket üretilemez." }) : /* @__PURE__ */ e.jsx("div", { children: s.items.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "70px minmax(0,1fr) 110px 90px" }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, fontWeight: 600 }, children: a.annexNumber }),
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: a.documentFileName }),
            /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: N.size(a.fileSize) }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-end", children: [
              a.expiryDate && new Date(a.expiryDate) <= /* @__PURE__ */ new Date() && /* @__PURE__ */ e.jsx($, { variant: "negative", size: "sm", children: "Süresi dolmuş" }),
              s.status === 1 && u && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: y, onClick: () => ye(a.id), children: "Çıkar" })
            ] })
          ] }, a.id)) })
        ] }),
        D && Y.length > 0 && /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Paylaşım bağlantıları" }),
          Y.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", style: { gridTemplateColumns: "110px minmax(0,1fr) 120px 90px" }, children: [
            /* @__PURE__ */ e.jsx($, { variant: a.isActive ? "positive" : "neutral", size: "sm", children: a.isActive ? "Aktif" : a.revokedAt ? "İptal" : "Süresi doldu" }),
            /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11.5 }, children: [
              a.allowDownload ? "İndirme açık" : "Yalnız görüntüleme",
              a.watermark && ` · ${a.watermark}`
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11 }, children: [
              N.date(a.expiresAt),
              " · ",
              a.accessCount,
              " erişim"
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-end", children: a.isActive && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: y, onClick: async () => {
              await ze(a.id), z(await A(s.id));
            }, children: "İptal et" }) })
          ] }, a.id))
        ] })
      ] }) : !b && p.length === 0 ? /* @__PURE__ */ e.jsx(
        B,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box" }),
          title: "Henüz paket yok",
          description: "Paket, rapor derleyicide seçtiğiniz şablonla ya da buradan boş olarak oluşturulur.",
          action: u && /* @__PURE__ */ e.jsx(
            V,
            {
              primary: /* @__PURE__ */ e.jsx(f, { leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }), disabled: y, onClick: Q, children: "Yeni paket" }),
              link: { label: "veya rapor derleyiciden başla", href: `${E()}Documents/ReportBuilder?projectId=${n}` }
            }
          )
        }
      ) : /* @__PURE__ */ e.jsx(
        B,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box" }),
          title: "Bir paket seçin",
          description: "Ekleri sıralayın, kontrolü çalıştırın ve paketi üretin."
        }
      ) })
    ] }),
    oe && /* @__PURE__ */ e.jsx(
      We,
      {
        result: re,
        loading: le,
        busy: y,
        onGenerate: xe,
        onClose: () => S(!1)
      }
    ),
    Z && /* @__PURE__ */ e.jsx(Fe, { message: Z, onDone: () => _(null) })
  ] }) : /* @__PURE__ */ e.jsx(
    B,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box-open" }),
      title: "Proje bağlamı gerekiyor",
      description: "Bu sayfa Dokümanlar'daki bir proje bağlamından açılır (?projectId=...).",
      action: /* @__PURE__ */ e.jsx(
        V,
        {
          primary: /* @__PURE__ */ e.jsx(f, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${E()}Documents/ReportBuilder`, children: "Rapor derleyiciye git" }) }),
          link: { label: "veya Projelere git", href: `${E()}Projects` }
        }
      )
    }
  ));
}
const te = document.getElementById("deliveries-island");
te && je(te).render(/* @__PURE__ */ e.jsx(He, {}));
