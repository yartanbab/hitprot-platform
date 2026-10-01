import { j as e, r, b as be } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { e as H, B as k, I as we } from "./Dialog-Bky2XNdc.js";
import { S as D } from "./SkeletonShape-BzeBQ1R3.js";
import { E as $ } from "./EmptyState-D5m5kdmR.js";
import { E as ae, O as Se, D as Ne, P as Pe } from "./ProcessRibbon-BtZ1ri4F.js";
import { a as te, g as ze, b as De, c as Re, d as u, e as W, f as F, r as Te, h as G, i as Ce, j as Ie, k as Be, l as Ee, s as Ae, m as Le, n as $e, o as We } from "./api-DE9auhlW.js";
import { M as Fe } from "./ModalPortal-8QCz-DZi.js";
const Ge = {
  1: "Zorunlu kalem",
  2: "Süresi dolmuş belge",
  3: "Eksik meta",
  4: "Gizli alan",
  5: "Boş paket"
};
function qe({ result: t, loading: n, busy: v, onGenerate: x, onClose: b }) {
  var y;
  const o = (t == null ? void 0 : t.canGenerate) === !0;
  return /* @__PURE__ */ e.jsx(Fe, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: b, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-pop-in apya-doc-dialog",
      style: { maxWidth: 560 },
      onClick: (d) => d.stopPropagation(),
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
                background: o ? "rgba(52,211,153,.14)" : "rgba(248,113,113,.12)",
                color: o ? "var(--apya-positive-500)" : "var(--apya-negative-500)"
              },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa fa-${o ? "circle-check" : "triangle-exclamation"}` })
            }
          ),
          /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 14, fontWeight: 600 }, children: "Üretim öncesi kontrol" }),
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: n ? "Kontrol ediliyor…" : o ? "Paket üretilebilir." : `${(t == null ? void 0 : t.blockingCount) ?? 0} kalem üretimi engelliyor.` })
          ] })
        ] }),
        n ? /* @__PURE__ */ e.jsx(D, { rows: 4 }) : (((y = t == null ? void 0 : t.issues) == null ? void 0 : y.length) ?? 0) === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12.5, color: "var(--apya-text-secondary)" }, children: "Engelleyen veya uyarı gerektiren bir durum bulunmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", style: { maxHeight: 320, overflowY: "auto" }, children: t.issues.map((d, M) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "d-flex align-items-start gap-2",
            style: {
              padding: "8px 10px",
              borderRadius: 10,
              background: d.isBlocking ? "rgba(248,113,113,.08)" : "var(--apya-surface-sunken)"
            },
            children: [
              /* @__PURE__ */ e.jsx(H, { variant: d.isBlocking ? "negative" : "warning", size: "sm", children: d.isBlocking ? "Bloke" : "Uyarı" }),
              /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
                /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12.5 }, children: d.message }),
                /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: Ge[d.kind] || "—" })
              ] })
            ]
          },
          M
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end mt-4", children: [
          /* @__PURE__ */ e.jsx(k, { variant: "outline", size: "sm", onClick: b, children: "Kapat" }),
          /* @__PURE__ */ e.jsx(
            k,
            {
              variant: "primary",
              size: "sm",
              disabled: !o || n,
              isLoading: v,
              title: o ? void 0 : "Bloke kalemler giderilmeden üretilemez",
              onClick: x,
              children: "Paketi üret"
            }
          )
        ] })
      ]
    }
  ) }) });
}
const se = (...t) => t.filter(Boolean).join(" "), z = {
  date: (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(t)) : "—",
  size: (t) => t ? t < 1024 * 1024 ? (t / 1024).toFixed(0) + " KB" : (t / (1024 * 1024)).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " MB" : "—"
}, ie = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Üretildi", chip: "apya-chip-positive" },
  3: { text: "Gönderildi", chip: "apya-chip-accent" }
}, q = { Pdf: 1, Zip: 2, Excel: 4 };
function He({ message: t, onDone: n }) {
  return r.useEffect(() => {
    const v = setTimeout(n, 3200);
    return () => clearTimeout(v);
  }, [n]), /* @__PURE__ */ e.jsx("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: t }) });
}
const Me = (t, n) => String(t ?? "").toLowerCase() === String(n ?? "").toLowerCase();
function Ke() {
  const t = r.useMemo(() => new URLSearchParams(window.location.search), []), [n, v] = r.useState(t.get("projectId")), [x, b] = r.useState(
    !t.get("projectId") && !!t.get("packageId")
  ), o = r.useRef(t.get("packageId")), [y, d] = r.useState([]), [M, ne] = r.useState([]), [K, le] = r.useState([]), [w, S] = r.useState(!0), [R, T] = r.useState(null), [s, g] = r.useState(null), [h, c] = r.useState(!1), [oe, ce] = r.useState(null), [de, O] = r.useState(!1), [me, N] = r.useState(!1), [pe, ue] = r.useState(""), [U, Y] = r.useState([]), [Z, C] = r.useState([]), [_, Q] = r.useState(null), j = te("Platform.Documents.GenerateReports"), I = te("Platform.Documents.ShareExternally"), f = r.useCallback(async () => {
    if (!n) {
      S(!1);
      return;
    }
    S(!0);
    try {
      const [a, i, l] = await Promise.all([
        ze(n),
        De(),
        Re(n)
      ]);
      d(a ?? []), ne(i ?? []), le(l ?? []);
    } catch (a) {
      u("error", "Teslim paketleri yüklenemedi."), console.error("[Deliveries] load", a);
    } finally {
      S(!1);
    }
  }, [n]);
  r.useEffect(() => {
    f();
  }, [f]), r.useEffect(() => {
    x && (async () => {
      try {
        const a = await W(o.current);
        S(!0), v(a.projectId);
        const i = new URLSearchParams(window.location.search);
        i.set("projectId", a.projectId), window.history.replaceState(null, "", `${window.location.pathname}?${i}`);
      } catch (a) {
        o.current = null, console.error("[Deliveries] resolve project", a);
      } finally {
        b(!1);
      }
    })();
  }, [x]);
  const m = r.useRef(0), B = async (a) => {
    const i = ++m.current;
    T(a), g(null), E("");
    try {
      const [l, P] = await Promise.all([W(a), I ? G(a) : Promise.resolve([])]);
      if (i !== m.current) return;
      g(l), C(P ?? []);
    } catch (l) {
      if (i !== m.current) return;
      T(null), u("error", "Paket açılamadı."), console.error("[Deliveries] openPackage", l);
    }
  };
  r.useEffect(() => {
    if (w || x || !o.current) return;
    const a = y.find((i) => Me(i.id, o.current));
    o.current = null, a && B(a.id);
  }, [w, x, y]);
  const J = async () => {
    const a = window.prompt("Paket adı:");
    if (a) {
      c(!0);
      try {
        const i = await Ee({
          projectId: n,
          name: a,
          formats: q.Pdf | q.Zip | q.Excel
        });
        await f(), await B(i.id);
      } catch (i) {
        u("error", "Paket oluşturulamadı."), console.error("[Deliveries] create", i);
      } finally {
        c(!1);
      }
    }
  }, ye = async (a) => {
    c(!0);
    try {
      await Be(a), R === a && (T(null), g(null)), await f();
    } catch {
      u("error", "Paket silinemedi.");
    } finally {
      c(!1);
    }
  }, V = r.useRef(0), X = r.useRef(null), E = (a) => {
    ue(a);
    const i = ++V.current;
    if (clearTimeout(X.current), !a.trim()) {
      Y([]);
      return;
    }
    X.current = setTimeout(async () => {
      try {
        const l = await Ae(n, a.trim());
        i === V.current && Y(l.items ?? []);
      } catch (l) {
        console.error("[Deliveries] search", l);
      }
    }, 300);
  }, he = async (a) => {
    const i = m.current;
    c(!0);
    try {
      const l = await Le(s.id, [a]);
      i === m.current && (g(l), E("")), await f();
    } catch {
      u("error", "Ek eklenemedi.");
    } finally {
      c(!1);
    }
  }, xe = async (a) => {
    const i = m.current;
    c(!0);
    try {
      const l = await $e(a);
      i === m.current && g(l), await f();
    } catch {
      u("error", "Ek çıkarılamadı.");
    } finally {
      c(!1);
    }
  }, fe = async () => {
    N(!0), O(!0);
    try {
      ce(await Ce(s.id));
    } catch {
      u("error", "Kontrol çalıştırılamadı."), N(!1);
    } finally {
      O(!1);
    }
  }, ge = async () => {
    const a = m.current;
    c(!0);
    try {
      const i = await We(s.id);
      N(!1), Q(`Paket üretildi — sürüm v${i.version}.`);
      const l = await W(s.id);
      a === m.current && g(l), await f();
    } catch (i) {
      u("error", "Paket üretilemedi — engelleyen kalemler olabilir."), console.error("[Deliveries] generate", i);
    } finally {
      c(!1);
    }
  }, je = async () => {
    const a = Number(window.prompt("Kaç gün geçerli olsun?", "14"));
    if (!a || a < 1) return;
    const i = window.confirm("İndirmeye izin verilsin mi? (İptal = yalnız görüntüleme)"), l = window.prompt("Filigran metni (boş bırakılabilir):") || null;
    c(!0);
    try {
      const P = await Ie({
        targetType: 1,
        targetId: s.id,
        lifetimeDays: a,
        allowDownload: i,
        watermark: l
      });
      C(await G(s.id)), window.prompt("Bağlantı (yalnız şimdi gösterilir, kopyalayın):", window.location.origin + P.url);
    } catch {
      u("error", "Bağlantı oluşturulamadı.");
    } finally {
      c(!1);
    }
  }, A = (s == null ? void 0 : s.status) === 1, ke = s ? `${window.abp.appPath}Documents/Deliveries?handler=DownloadPackage&packageId=${s.id}` : null, ee = s ? [
    j && {
      key: "generate",
      label: A ? "Paketi üret" : "Yeniden üret",
      icon: "fa-gears",
      disabled: h,
      onSelect: fe
    },
    s.hasOutput && { key: "download", label: "Çıktıyı indir", icon: "fa-download", href: ke },
    I && s.hasOutput && {
      key: "share",
      label: "Paylaşım bağlantısı oluştur",
      icon: "fa-share-nodes",
      disabled: h,
      onSelect: je
    },
    j && A && {
      key: "delete",
      label: "Paketi sil",
      icon: "fa-trash",
      className: "is-danger",
      disabled: h,
      onSelect: () => ye(s.id)
    }
  ].filter(Boolean) : [], p = ee.find((a) => a.key === (A ? "generate" : "download")) ?? null, ve = ee.filter((a) => a !== p), L = (a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      Ne,
      {
        title: "Teslimler & arşiv",
        description: "Paket kurucu, üretim öncesi kontrol ve rapor sürümleri",
        menuItems: [
          j && n && {
            key: "new",
            label: "Yeni paket",
            icon: "fa-plus",
            disabled: h,
            onSelect: J
          }
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(Pe, { active: "deliver", projectId: n }),
    a
  ] });
  return L(x ? /* @__PURE__ */ e.jsx(D, { rows: 6 }) : n ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-shell is-wide", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", style: { maxHeight: "none" }, children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Paketler" }),
        w ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(D, { rows: 4 }) }) : y.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz paket yok." }) : y.map((a) => {
          const i = ie[a.status] || ie[1];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => B(a.id),
              className: se("apya-md-item", R === a.id && "selected"),
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
                /* @__PURE__ */ e.jsx("span", { className: se("apya-chip", i.chip), children: i.text })
              ]
            },
            a.id
          );
        }),
        /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Sürüm arşivi" }),
        K.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] px-2 pb-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz üretim yapılmadı." }) : K.map((a) => /* @__PURE__ */ e.jsxs(
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
              /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 10.5 }, children: z.size(a.outputSize) })
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
              s.generatedAt && ` · ${z.date(s.generatedAt)} üretildi`
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            p && (p.href ? /* @__PURE__ */ e.jsx(k, { asChild: !0, size: "sm", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: `fa ${p.icon}` }), children: /* @__PURE__ */ e.jsx("a", { href: p.href, children: p.label }) }) : /* @__PURE__ */ e.jsx(k, { variant: "primary", size: "sm", disabled: p.disabled, onClick: p.onSelect, children: p.label })),
            /* @__PURE__ */ e.jsx(Se, { size: "sm", label: "Paket eylemleri", items: ve })
          ] })
        ] }),
        s.status !== 1 && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock" }),
          " Üretilmiş paket düzenlenemez — içerik değişirse denetim izi anlamsızlaşır."
        ] }),
        s.status === 1 && j && /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx(
            we,
            {
              size: "sm",
              placeholder: "Ek eklemek için belge ara",
              leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
              value: pe,
              onChange: (a) => E(a.target.value)
            }
          ),
          U.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-2 d-flex flex-column gap-1", children: U.slice(0, 8).map((a) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "apya-md-item",
              style: { borderRadius: 8 },
              onClick: () => he(a.id),
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
            /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: z.size(a.fileSize) }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-end", children: [
              a.expiryDate && new Date(a.expiryDate) <= /* @__PURE__ */ new Date() && /* @__PURE__ */ e.jsx(H, { variant: "negative", size: "sm", children: "Süresi dolmuş" }),
              s.status === 1 && j && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: h, onClick: () => xe(a.id), children: "Çıkar" })
            ] })
          ] }, a.id)) })
        ] }),
        I && Z.length > 0 && /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Paylaşım bağlantıları" }),
          Z.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", style: { gridTemplateColumns: "110px minmax(0,1fr) 120px 90px" }, children: [
            /* @__PURE__ */ e.jsx(H, { variant: a.isActive ? "positive" : "neutral", size: "sm", children: a.isActive ? "Aktif" : a.revokedAt ? "İptal" : "Süresi doldu" }),
            /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11.5 }, children: [
              a.allowDownload ? "İndirme açık" : "Yalnız görüntüleme",
              a.watermark && ` · ${a.watermark}`
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11 }, children: [
              z.date(a.expiresAt),
              " · ",
              a.accessCount,
              " erişim"
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-end", children: a.isActive && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: h, onClick: async () => {
              await Te(a.id), C(await G(s.id));
            }, children: "İptal et" }) })
          ] }, a.id))
        ] })
      ] }) : R ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(D, { rows: 3 }) }) : !w && y.length === 0 ? /* @__PURE__ */ e.jsx(
        $,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box" }),
          title: "Henüz paket yok",
          description: "Paket, rapor derleyicide seçtiğiniz şablonla ya da buradan boş olarak oluşturulur.",
          action: j && /* @__PURE__ */ e.jsx(
            ae,
            {
              primary: /* @__PURE__ */ e.jsx(k, { leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }), disabled: h, onClick: J, children: "Yeni paket" }),
              link: { label: "veya rapor derleyiciden başla", href: `${F()}Documents/ReportBuilder?projectId=${n}` }
            }
          )
        }
      ) : /* @__PURE__ */ e.jsx(
        $,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box" }),
          title: "Bir paket seçin",
          description: "Ekleri sıralayın, kontrolü çalıştırın ve paketi üretin."
        }
      ) })
    ] }),
    me && /* @__PURE__ */ e.jsx(
      qe,
      {
        result: oe,
        loading: de,
        busy: h,
        onGenerate: ge,
        onClose: () => N(!1)
      }
    ),
    _ && /* @__PURE__ */ e.jsx(He, { message: _, onDone: () => Q(null) })
  ] }) : /* @__PURE__ */ e.jsx(
    $,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box-open" }),
      title: "Proje bağlamı gerekiyor",
      description: "Bu sayfa Dokümanlar'daki bir proje bağlamından açılır (?projectId=...).",
      action: /* @__PURE__ */ e.jsx(
        ae,
        {
          primary: /* @__PURE__ */ e.jsx(k, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${F()}Documents/ReportBuilder`, children: "Rapor derleyiciye git" }) }),
          link: { label: "veya Projelere git", href: `${F()}Projects` }
        }
      )
    }
  ));
}
const re = document.getElementById("deliveries-island");
re && be(re).render(/* @__PURE__ */ e.jsx(Ke, {}));
