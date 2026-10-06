import { j as e, r as t } from "./react-vendor-D7YDiBbi.js";
import { E as G, w as N, m as Be } from "./index-DgpuJ91w.js";
import { e as Z, B as h, I as B } from "./Dialog-BdrRxZcw.js";
import { S as E } from "./SkeletonShape-Ds5M097Q.js";
import { E as oe, O as Ee, D as Le, P as $e } from "./ProcessRibbon-D9pM1s89.js";
import { a as ce, g as We, b as Fe, c as Ke, d as g, e as O, f as Y, r as Me, h as q, i as Ge, j as Oe, k as Ye, s as qe, l as He, m as Ue, n as _e, o as Ze } from "./api-DzWAfcOg.js";
import { M as he } from "./ModalPortal-CVz5ohco.js";
const Ve = {
  1: "Zorunlu kalem",
  2: "Süresi dolmuş belge",
  3: "Eksik meta",
  4: "Gizli alan",
  5: "Boş paket"
};
function Xe({ result: s, loading: l, busy: y, onGenerate: p, onClose: z }) {
  var u;
  const c = (s == null ? void 0 : s.canGenerate) === !0;
  return /* @__PURE__ */ e.jsx(he, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: z, children: /* @__PURE__ */ e.jsxs(
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
                background: c ? "rgba(52,211,153,.14)" : "rgba(248,113,113,.12)",
                color: c ? "var(--apya-positive-500)" : "var(--apya-negative-500)"
              },
              children: /* @__PURE__ */ e.jsx("i", { className: `fa fa-${c ? "circle-check" : "triangle-exclamation"}` })
            }
          ),
          /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 14, fontWeight: 600 }, children: "Üretim öncesi kontrol" }),
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: l ? "Kontrol ediliyor…" : c ? "Paket üretilebilir." : `${(s == null ? void 0 : s.blockingCount) ?? 0} kalem üretimi engelliyor.` })
          ] })
        ] }),
        l ? /* @__PURE__ */ e.jsx(E, { rows: 4 }) : (((u = s == null ? void 0 : s.issues) == null ? void 0 : u.length) ?? 0) === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12.5, color: "var(--apya-text-secondary)" }, children: "Engelleyen veya uyarı gerektiren bir durum bulunmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", style: { maxHeight: 320, overflowY: "auto" }, children: s.issues.map((d, D) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "d-flex align-items-start gap-2",
            style: {
              padding: "8px 10px",
              borderRadius: 10,
              background: d.isBlocking ? "rgba(248,113,113,.08)" : "var(--apya-surface-sunken)"
            },
            children: [
              /* @__PURE__ */ e.jsx(Z, { variant: d.isBlocking ? "negative" : "warning", size: "sm", children: d.isBlocking ? "Bloke" : "Uyarı" }),
              /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
                /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12.5 }, children: d.message }),
                /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: Ve[d.kind] || "—" })
              ] })
            ]
          },
          D
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end mt-4", children: [
          /* @__PURE__ */ e.jsx(h, { variant: "outline", size: "sm", onClick: z, children: "Kapat" }),
          /* @__PURE__ */ e.jsx(
            h,
            {
              variant: "primary",
              size: "sm",
              disabled: !c || l,
              isLoading: y,
              title: c ? void 0 : "Bloke kalemler giderilmeden üretilemez",
              onClick: p,
              children: "Paketi üret"
            }
          )
        ] })
      ]
    }
  ) }) });
}
const de = 14, H = 365, Qe = 120, me = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--apya-text-secondary)", marginBottom: 4 }, U = { fontSize: 11.5, color: "var(--apya-text-tertiary)", marginTop: 4 };
function Je({ open: s, busy: l, link: y, onClose: p, onSubmit: z }) {
  const [c, u] = t.useState(String(de)), [d, D] = t.useState(!1), [C, R] = t.useState(""), [T, j] = t.useState(null), b = t.useRef(null);
  if (t.useEffect(() => {
    s && (u(String(de)), D(!1), R(""), j(null));
  }, [s]), !s) return null;
  const S = Number(c), v = /^\d+$/.test(c.trim()) && S >= 1 && S <= H, r = (o) => {
    o.preventDefault(), !(!v || l) && z({ lifetimeDays: S, allowDownload: d, watermark: C.trim() || null });
  }, k = async () => {
    var o;
    try {
      await navigator.clipboard.writeText(y), j("copied");
    } catch {
      (o = b.current) == null || o.select(), j("failed");
    }
  };
  return /* @__PURE__ */ e.jsx(he, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: y || l ? void 0 : p, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-pop-in apya-doc-dialog",
      style: { maxWidth: 460 },
      onClick: (o) => o.stopPropagation(),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Paylaşım bağlantısı oluştur",
      children: [
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 14, fontWeight: 600 }, className: "mb-3", children: "Paylaşım bağlantısı" }),
        y ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12.5, color: "var(--apya-text-secondary)" }, className: "mb-2", children: "Bağlantı hazır. Yalnız şimdi gösterilir; bu pencere kapandıktan sonra yeniden görüntülenemez." }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 align-items-center", children: [
            /* @__PURE__ */ e.jsx(
              B,
              {
                ref: b,
                size: "sm",
                readOnly: !0,
                value: y,
                "aria-label": "Paylaşım bağlantısı",
                onFocus: (o) => o.target.select()
              }
            ),
            /* @__PURE__ */ e.jsx(h, { variant: "primary", size: "sm", onClick: k, children: "Kopyala" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { style: U, role: "status", children: [
            T === "copied" && "Kopyalandı.",
            T === "failed" && "Kopyalanamadı — bağlantı seçildi, elle kopyalayın."
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "d-flex gap-2 justify-content-end mt-4", children: /* @__PURE__ */ e.jsx(h, { variant: "outline", size: "sm", onClick: p, children: "Kapat" }) })
        ] }) : /* @__PURE__ */ e.jsxs("form", { onSubmit: r, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ e.jsx("label", { style: me, htmlFor: "share-days", children: "Geçerlilik süresi (gün)" }),
            /* @__PURE__ */ e.jsx(
              B,
              {
                id: "share-days",
                size: "sm",
                type: "number",
                min: 1,
                max: H,
                step: 1,
                autoFocus: !0,
                invalid: !v,
                value: c,
                onChange: (o) => u(o.target.value)
              }
            ),
            !v && /* @__PURE__ */ e.jsxs("div", { style: { ...U, color: "var(--apya-negative-500)" }, children: [
              "1 ile ",
              H,
              " gün arasında bir tam sayı girin."
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ e.jsxs("label", { className: "d-flex align-items-center gap-2", style: { fontSize: 12.5 }, children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: d,
                  onChange: (o) => D(o.target.checked)
                }
              ),
              "İndirmeye izin ver"
            ] }),
            /* @__PURE__ */ e.jsx("div", { style: U, children: "Kapalıyken bağlantıyı açan kişi paketi yalnız görüntüler." })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { style: me, htmlFor: "share-watermark", children: "Filigran metni (boş bırakılabilir)" }),
            /* @__PURE__ */ e.jsx(
              B,
              {
                id: "share-watermark",
                size: "sm",
                maxLength: Qe,
                value: C,
                onChange: (o) => R(o.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end mt-4", children: [
            /* @__PURE__ */ e.jsx(h, { type: "button", variant: "outline", size: "sm", disabled: l, onClick: p, children: "Vazgeç" }),
            /* @__PURE__ */ e.jsx(h, { type: "submit", variant: "primary", size: "sm", disabled: !v, isLoading: l, children: "Bağlantı oluştur" })
          ] })
        ] })
      ]
    }
  ) }) });
}
const pe = (...s) => s.filter(Boolean).join(" "), I = {
  date: (s) => s ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(s)) : "—",
  size: (s) => s ? s < 1024 * 1024 ? (s / 1024).toFixed(0) + " KB" : (s / (1024 * 1024)).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " MB" : "—"
}, ue = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Üretildi", chip: "apya-chip-positive" },
  3: { text: "Gönderildi", chip: "apya-chip-accent" }
}, _ = { Pdf: 1, Zip: 2, Excel: 4 };
function ea({ message: s, onDone: l }) {
  return t.useEffect(() => {
    const y = setTimeout(l, 3200);
    return () => clearTimeout(y);
  }, [l]), /* @__PURE__ */ e.jsx("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: s }) });
}
const aa = (s, l) => String(s ?? "").toLowerCase() === String(l ?? "").toLowerCase();
function ta() {
  const s = t.useMemo(() => new URLSearchParams(window.location.search), []), [l, y] = t.useState(s.get("projectId")), [p, z] = t.useState(
    !s.get("projectId") && !!s.get("packageId")
  ), c = t.useRef(s.get("packageId")), [u, d] = t.useState([]), [D, C] = t.useState([]), [R, T] = t.useState([]), [j, b] = t.useState(!0), [S, v] = t.useState(null), [r, k] = t.useState(null), [o, m] = t.useState(!1), [xe, fe] = t.useState(null), [ge, V] = t.useState(!1), [je, A] = t.useState(!1), [ve, ke] = t.useState(""), [X, Q] = t.useState([]), [J, L] = t.useState([]), [be, ee] = t.useState(!1), [Se, ae] = t.useState(null), [te, se] = t.useState(null), P = ce("Platform.Documents.GenerateReports"), $ = ce("Platform.Documents.ShareExternally"), w = t.useCallback(async () => {
    if (!l) {
      b(!1);
      return;
    }
    b(!0);
    try {
      const [a, i, n] = await Promise.all([
        We(l),
        Fe(),
        Ke(l)
      ]);
      d(a ?? []), C(i ?? []), T(n ?? []);
    } catch (a) {
      g("error", "Teslim paketleri yüklenemedi."), console.error("[Deliveries] load", a);
    } finally {
      b(!1);
    }
  }, [l]);
  t.useEffect(() => {
    w();
  }, [w]), t.useEffect(() => {
    p && (async () => {
      try {
        const a = await O(c.current);
        b(!0), y(a.projectId);
        const i = new URLSearchParams(window.location.search);
        i.set("projectId", a.projectId), window.history.replaceState(null, "", `${window.location.pathname}?${i}`);
      } catch (a) {
        c.current = null, console.error("[Deliveries] resolve project", a);
      } finally {
        z(!1);
      }
    })();
  }, [p]);
  const x = t.useRef(0), W = async (a) => {
    const i = ++x.current;
    v(a), k(null), F("");
    try {
      const [n, Ie] = await Promise.all([O(a), $ ? q(a) : Promise.resolve([])]);
      if (i !== x.current) return;
      k(n), L(Ie ?? []);
    } catch (n) {
      if (i !== x.current) return;
      v(null), g("error", "Paket açılamadı."), console.error("[Deliveries] openPackage", n);
    }
  };
  t.useEffect(() => {
    if (j || p || !c.current) return;
    const a = u.find((i) => aa(i.id, c.current));
    c.current = null, a && W(a.id);
  }, [j, p, u]);
  const ie = async () => {
    const a = window.prompt("Paket adı:");
    if (a) {
      m(!0);
      try {
        const i = await Ye({
          projectId: l,
          name: a,
          formats: _.Pdf | _.Zip | _.Excel
        });
        await w(), await W(i.id);
      } catch (i) {
        N(i) || g("error", "Paket oluşturulamadı."), console.error("[Deliveries] create", i);
      } finally {
        m(!1);
      }
    }
  }, we = async (a) => {
    m(!0);
    try {
      await Oe(a), S === a && (v(null), k(null)), await w();
    } catch (i) {
      N(i) || g("error", "Paket silinemedi.");
    } finally {
      m(!1);
    }
  }, re = t.useRef(0), ne = t.useRef(null), F = (a) => {
    ke(a);
    const i = ++re.current;
    if (clearTimeout(ne.current), !a.trim()) {
      Q([]);
      return;
    }
    ne.current = setTimeout(async () => {
      try {
        const n = await qe(l, a.trim());
        i === re.current && Q(n.items ?? []);
      } catch (n) {
        console.error("[Deliveries] search", n);
      }
    }, 300);
  }, Ne = async (a) => {
    const i = x.current;
    m(!0);
    try {
      const n = await He(r.id, [a]);
      i === x.current && (k(n), F("")), await w();
    } catch (n) {
      N(n) || g("error", "Ek eklenemedi.");
    } finally {
      m(!1);
    }
  }, ze = async (a) => {
    const i = x.current;
    m(!0);
    try {
      const n = await Ue(a);
      i === x.current && k(n), await w();
    } catch (n) {
      N(n) || g("error", "Ek çıkarılamadı.");
    } finally {
      m(!1);
    }
  }, Pe = async () => {
    A(!0), V(!0);
    try {
      fe(await Ge(r.id));
    } catch (a) {
      N(a) || g("error", "Kontrol çalıştırılamadı."), A(!1);
    } finally {
      V(!1);
    }
  }, De = async () => {
    const a = x.current;
    m(!0);
    try {
      const i = await _e(r.id);
      A(!1), se(`Paket üretildi — sürüm v${i.version}.`);
      const n = await O(r.id);
      a === x.current && k(n), await w();
    } catch (i) {
      N(i) || g("error", "Paket üretilemedi — engelleyen kalemler olabilir."), console.error("[Deliveries] generate", i);
    } finally {
      m(!1);
    }
  }, Re = () => {
    ae(null), ee(!0);
  }, Ce = async (a) => {
    const i = r.id;
    m(!0);
    try {
      const n = await Ze({ targetType: 1, targetId: i, ...a });
      ae(window.location.origin + n.url);
    } catch (n) {
      N(n) || g("error", "Bağlantı oluşturulamadı.");
      return;
    } finally {
      m(!1);
    }
    try {
      L(await q(i));
    } catch (n) {
      console.error("[Deliveries] share links", n);
    }
  }, K = (r == null ? void 0 : r.status) === 1, Te = r ? `${window.abp.appPath}Documents/Deliveries?handler=DownloadPackage&packageId=${r.id}` : null, le = r ? [
    P && {
      key: "generate",
      label: K ? "Paketi üret" : "Yeniden üret",
      icon: "fa-gears",
      disabled: o,
      onSelect: Pe
    },
    r.hasOutput && { key: "download", label: "Çıktıyı indir", icon: "fa-download", href: Te },
    $ && r.hasOutput && {
      key: "share",
      label: "Paylaşım bağlantısı oluştur",
      icon: "fa-share-nodes",
      disabled: o,
      onSelect: Re
    },
    P && K && {
      key: "delete",
      label: "Paketi sil",
      icon: "fa-trash",
      className: "is-danger",
      disabled: o,
      onSelect: () => we(r.id)
    }
  ].filter(Boolean) : [], f = le.find((a) => a.key === (K ? "generate" : "download")) ?? null, Ae = le.filter((a) => a !== f), M = (a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      Le,
      {
        title: "Teslimler & arşiv",
        description: "Paket kurucu, üretim öncesi kontrol ve rapor sürümleri",
        menuItems: [
          P && l && {
            key: "new",
            label: "Yeni paket",
            icon: "fa-plus",
            disabled: o,
            onSelect: ie
          }
        ]
      }
    ),
    /* @__PURE__ */ e.jsx($e, { active: "deliver", projectId: l }),
    a
  ] });
  return M(p ? /* @__PURE__ */ e.jsx(E, { rows: 6 }) : l ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-shell is-wide", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", style: { maxHeight: "none" }, children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Paketler" }),
        j ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(E, { rows: 4 }) }) : u.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz paket yok." }) : u.map((a) => {
          const i = ue[a.status] || ue[1];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => W(a.id),
              className: pe("apya-md-item", S === a.id && "selected"),
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
                /* @__PURE__ */ e.jsx("span", { className: pe("apya-chip", i.chip), children: i.text })
              ]
            },
            a.id
          );
        }),
        /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Sürüm arşivi" }),
        R.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] px-2 pb-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz üretim yapılmadı." }) : R.map((a) => /* @__PURE__ */ e.jsxs(
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
              /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 10.5 }, children: I.size(a.outputSize) })
            ]
          },
          a.id
        ))
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: r ? /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: r.name }),
            /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
              r.reportTemplateName || "Şablon seçilmedi",
              r.periodCode && ` · ${r.periodCode}`,
              r.generatedAt && ` · ${I.date(r.generatedAt)} üretildi`
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            f && (f.href ? /* @__PURE__ */ e.jsx(h, { asChild: !0, size: "sm", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: `fa ${f.icon}` }), children: /* @__PURE__ */ e.jsx("a", { href: f.href, children: f.label }) }) : /* @__PURE__ */ e.jsx(h, { variant: "primary", size: "sm", disabled: f.disabled, onClick: f.onSelect, children: f.label })),
            /* @__PURE__ */ e.jsx(Ee, { size: "sm", label: "Paket eylemleri", items: Ae })
          ] })
        ] }),
        r.status !== 1 && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock" }),
          " Üretilmiş paket düzenlenemez — içerik değişirse denetim izi anlamsızlaşır."
        ] }),
        r.status === 1 && P && /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx(
            B,
            {
              size: "sm",
              placeholder: "Ek eklemek için belge ara",
              leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
              value: ve,
              onChange: (a) => F(a.target.value)
            }
          ),
          X.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-2 d-flex flex-column gap-1", children: X.slice(0, 8).map((a) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "apya-md-item",
              style: { borderRadius: 8 },
              onClick: () => Ne(a.id),
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
            r.items.length,
            ")"
          ] }),
          r.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Pakette henüz ek yok — boş paket üretilemez." }) : /* @__PURE__ */ e.jsx("div", { children: r.items.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "70px minmax(0,1fr) 110px 90px" }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, fontWeight: 600 }, children: a.annexNumber }),
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: a.documentFileName }),
            /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: I.size(a.fileSize) }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-end", children: [
              a.expiryDate && new Date(a.expiryDate) <= /* @__PURE__ */ new Date() && /* @__PURE__ */ e.jsx(Z, { variant: "negative", size: "sm", children: "Süresi dolmuş" }),
              r.status === 1 && P && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: o, onClick: () => ze(a.id), children: "Çıkar" })
            ] })
          ] }, a.id)) })
        ] }),
        $ && J.length > 0 && /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Paylaşım bağlantıları" }),
          J.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", style: { gridTemplateColumns: "110px minmax(0,1fr) 120px 90px" }, children: [
            /* @__PURE__ */ e.jsx(Z, { variant: a.isActive ? "positive" : "neutral", size: "sm", children: a.isActive ? "Aktif" : a.revokedAt ? "İptal" : "Süresi doldu" }),
            /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11.5 }, children: [
              a.allowDownload ? "İndirme açık" : "Yalnız görüntüleme",
              a.watermark && ` · ${a.watermark}`
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11 }, children: [
              I.date(a.expiresAt),
              " · ",
              a.accessCount,
              " erişim"
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-end", children: a.isActive && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: o, onClick: async () => {
              await Me(a.id), L(await q(r.id));
            }, children: "İptal et" }) })
          ] }, a.id))
        ] })
      ] }) : S ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(E, { rows: 3 }) }) : !j && u.length === 0 ? /* @__PURE__ */ e.jsx(
        G,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box" }),
          title: "Henüz paket yok",
          description: "Paket, rapor derleyicide seçtiğiniz şablonla ya da buradan boş olarak oluşturulur.",
          action: P && /* @__PURE__ */ e.jsx(
            oe,
            {
              primary: /* @__PURE__ */ e.jsx(h, { leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }), disabled: o, onClick: ie, children: "Yeni paket" }),
              link: { label: "veya rapor derleyiciden başla", href: `${Y()}Documents/ReportBuilder?projectId=${l}` }
            }
          )
        }
      ) : /* @__PURE__ */ e.jsx(
        G,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box" }),
          title: "Bir paket seçin",
          description: "Ekleri sıralayın, kontrolü çalıştırın ve paketi üretin."
        }
      ) })
    ] }),
    je && /* @__PURE__ */ e.jsx(
      Xe,
      {
        result: xe,
        loading: ge,
        busy: o,
        onGenerate: De,
        onClose: () => A(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      Je,
      {
        open: be,
        busy: o,
        link: Se,
        onSubmit: Ce,
        onClose: () => ee(!1)
      }
    ),
    te && /* @__PURE__ */ e.jsx(ea, { message: te, onDone: () => se(null) })
  ] }) : /* @__PURE__ */ e.jsx(
    G,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box-open" }),
      title: "Proje bağlamı gerekiyor",
      description: "Bu sayfa Dokümanlar'daki bir proje bağlamından açılır (?projectId=...).",
      action: /* @__PURE__ */ e.jsx(
        oe,
        {
          primary: /* @__PURE__ */ e.jsx(h, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${Y()}Documents/ReportBuilder`, children: "Rapor derleyiciye git" }) }),
          link: { label: "veya Projelere git", href: `${Y()}Projects` }
        }
      )
    }
  ));
}
const ye = document.getElementById("deliveries-island");
ye && Be(ye, "deliveries", /* @__PURE__ */ e.jsx(ta, {}));
