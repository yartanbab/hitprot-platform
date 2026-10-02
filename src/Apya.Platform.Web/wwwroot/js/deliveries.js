import { j as e, r } from "./react-vendor-D7YDiBbi.js";
import { E as W, w as g, m as be } from "./index-DgpuJ91w.js";
import { e as M, B as v, I as Se } from "./Dialog-BdrRxZcw.js";
import { S as R } from "./SkeletonShape-Ds5M097Q.js";
import { E as te, O as Ne, D as Pe, P as ze } from "./ProcessRibbon-D9pM1s89.js";
import { a as se, g as De, b as Re, c as Ie, d as u, e as F, f as G, r as Te, h as q, i as Ce, j as Be, k as Ee, l as Ae, s as Le, m as $e, n as We, o as Fe } from "./api-DE9auhlW.js";
import { M as Ge } from "./ModalPortal-CVz5ohco.js";
const qe = {
  1: "Zorunlu kalem",
  2: "Süresi dolmuş belge",
  3: "Eksik meta",
  4: "Gizli alan",
  5: "Boş paket"
};
function He({ result: s, loading: l, busy: w, onGenerate: f, onClose: S }) {
  var y;
  const o = (s == null ? void 0 : s.canGenerate) === !0;
  return /* @__PURE__ */ e.jsx(Ge, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: S, children: /* @__PURE__ */ e.jsxs(
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
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: l ? "Kontrol ediliyor…" : o ? "Paket üretilebilir." : `${(s == null ? void 0 : s.blockingCount) ?? 0} kalem üretimi engelliyor.` })
          ] })
        ] }),
        l ? /* @__PURE__ */ e.jsx(R, { rows: 4 }) : (((y = s == null ? void 0 : s.issues) == null ? void 0 : y.length) ?? 0) === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12.5, color: "var(--apya-text-secondary)" }, children: "Engelleyen veya uyarı gerektiren bir durum bulunmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", style: { maxHeight: 320, overflowY: "auto" }, children: s.issues.map((d, K) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "d-flex align-items-start gap-2",
            style: {
              padding: "8px 10px",
              borderRadius: 10,
              background: d.isBlocking ? "rgba(248,113,113,.08)" : "var(--apya-surface-sunken)"
            },
            children: [
              /* @__PURE__ */ e.jsx(M, { variant: d.isBlocking ? "negative" : "warning", size: "sm", children: d.isBlocking ? "Bloke" : "Uyarı" }),
              /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
                /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12.5 }, children: d.message }),
                /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: qe[d.kind] || "—" })
              ] })
            ]
          },
          K
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end mt-4", children: [
          /* @__PURE__ */ e.jsx(v, { variant: "outline", size: "sm", onClick: S, children: "Kapat" }),
          /* @__PURE__ */ e.jsx(
            v,
            {
              variant: "primary",
              size: "sm",
              disabled: !o || l,
              isLoading: w,
              title: o ? void 0 : "Bloke kalemler giderilmeden üretilemez",
              onClick: f,
              children: "Paketi üret"
            }
          )
        ] })
      ]
    }
  ) }) });
}
const ie = (...s) => s.filter(Boolean).join(" "), D = {
  date: (s) => s ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(s)) : "—",
  size: (s) => s ? s < 1024 * 1024 ? (s / 1024).toFixed(0) + " KB" : (s / (1024 * 1024)).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " MB" : "—"
}, re = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Üretildi", chip: "apya-chip-positive" },
  3: { text: "Gönderildi", chip: "apya-chip-accent" }
}, H = { Pdf: 1, Zip: 2, Excel: 4 };
function Me({ message: s, onDone: l }) {
  return r.useEffect(() => {
    const w = setTimeout(l, 3200);
    return () => clearTimeout(w);
  }, [l]), /* @__PURE__ */ e.jsx("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: s }) });
}
const Ke = (s, l) => String(s ?? "").toLowerCase() === String(l ?? "").toLowerCase();
function Oe() {
  const s = r.useMemo(() => new URLSearchParams(window.location.search), []), [l, w] = r.useState(s.get("projectId")), [f, S] = r.useState(
    !s.get("projectId") && !!s.get("packageId")
  ), o = r.useRef(s.get("packageId")), [y, d] = r.useState([]), [K, le] = r.useState([]), [O, oe] = r.useState([]), [N, P] = r.useState(!0), [I, T] = r.useState(null), [i, j] = r.useState(null), [h, c] = r.useState(!1), [ce, de] = r.useState(null), [me, U] = r.useState(!1), [pe, z] = r.useState(!1), [ue, ye] = r.useState(""), [Y, Z] = r.useState([]), [_, C] = r.useState([]), [Q, J] = r.useState(null), k = se("Platform.Documents.GenerateReports"), B = se("Platform.Documents.ShareExternally"), x = r.useCallback(async () => {
    if (!l) {
      P(!1);
      return;
    }
    P(!0);
    try {
      const [a, t, n] = await Promise.all([
        De(l),
        Re(),
        Ie(l)
      ]);
      d(a ?? []), le(t ?? []), oe(n ?? []);
    } catch (a) {
      u("error", "Teslim paketleri yüklenemedi."), console.error("[Deliveries] load", a);
    } finally {
      P(!1);
    }
  }, [l]);
  r.useEffect(() => {
    x();
  }, [x]), r.useEffect(() => {
    f && (async () => {
      try {
        const a = await F(o.current);
        P(!0), w(a.projectId);
        const t = new URLSearchParams(window.location.search);
        t.set("projectId", a.projectId), window.history.replaceState(null, "", `${window.location.pathname}?${t}`);
      } catch (a) {
        o.current = null, console.error("[Deliveries] resolve project", a);
      } finally {
        S(!1);
      }
    })();
  }, [f]);
  const m = r.useRef(0), E = async (a) => {
    const t = ++m.current;
    T(a), j(null), A("");
    try {
      const [n, b] = await Promise.all([F(a), B ? q(a) : Promise.resolve([])]);
      if (t !== m.current) return;
      j(n), C(b ?? []);
    } catch (n) {
      if (t !== m.current) return;
      T(null), u("error", "Paket açılamadı."), console.error("[Deliveries] openPackage", n);
    }
  };
  r.useEffect(() => {
    if (N || f || !o.current) return;
    const a = y.find((t) => Ke(t.id, o.current));
    o.current = null, a && E(a.id);
  }, [N, f, y]);
  const V = async () => {
    const a = window.prompt("Paket adı:");
    if (a) {
      c(!0);
      try {
        const t = await Ae({
          projectId: l,
          name: a,
          formats: H.Pdf | H.Zip | H.Excel
        });
        await x(), await E(t.id);
      } catch (t) {
        g(t) || u("error", "Paket oluşturulamadı."), console.error("[Deliveries] create", t);
      } finally {
        c(!1);
      }
    }
  }, he = async (a) => {
    c(!0);
    try {
      await Ee(a), I === a && (T(null), j(null)), await x();
    } catch (t) {
      g(t) || u("error", "Paket silinemedi.");
    } finally {
      c(!1);
    }
  }, X = r.useRef(0), ee = r.useRef(null), A = (a) => {
    ye(a);
    const t = ++X.current;
    if (clearTimeout(ee.current), !a.trim()) {
      Z([]);
      return;
    }
    ee.current = setTimeout(async () => {
      try {
        const n = await Le(l, a.trim());
        t === X.current && Z(n.items ?? []);
      } catch (n) {
        console.error("[Deliveries] search", n);
      }
    }, 300);
  }, fe = async (a) => {
    const t = m.current;
    c(!0);
    try {
      const n = await $e(i.id, [a]);
      t === m.current && (j(n), A("")), await x();
    } catch (n) {
      g(n) || u("error", "Ek eklenemedi.");
    } finally {
      c(!1);
    }
  }, xe = async (a) => {
    const t = m.current;
    c(!0);
    try {
      const n = await We(a);
      t === m.current && j(n), await x();
    } catch (n) {
      g(n) || u("error", "Ek çıkarılamadı.");
    } finally {
      c(!1);
    }
  }, ge = async () => {
    z(!0), U(!0);
    try {
      de(await Ce(i.id));
    } catch (a) {
      g(a) || u("error", "Kontrol çalıştırılamadı."), z(!1);
    } finally {
      U(!1);
    }
  }, je = async () => {
    const a = m.current;
    c(!0);
    try {
      const t = await Fe(i.id);
      z(!1), J(`Paket üretildi — sürüm v${t.version}.`);
      const n = await F(i.id);
      a === m.current && j(n), await x();
    } catch (t) {
      g(t) || u("error", "Paket üretilemedi — engelleyen kalemler olabilir."), console.error("[Deliveries] generate", t);
    } finally {
      c(!1);
    }
  }, ke = async () => {
    const a = Number(window.prompt("Kaç gün geçerli olsun?", "14"));
    if (!a || a < 1) return;
    const t = window.confirm("İndirmeye izin verilsin mi? (İptal = yalnız görüntüleme)"), n = window.prompt("Filigran metni (boş bırakılabilir):") || null;
    c(!0);
    try {
      const b = await Be({
        targetType: 1,
        targetId: i.id,
        lifetimeDays: a,
        allowDownload: t,
        watermark: n
      });
      C(await q(i.id)), window.prompt("Bağlantı (yalnız şimdi gösterilir, kopyalayın):", window.location.origin + b.url);
    } catch (b) {
      g(b) || u("error", "Bağlantı oluşturulamadı.");
    } finally {
      c(!1);
    }
  }, L = (i == null ? void 0 : i.status) === 1, ve = i ? `${window.abp.appPath}Documents/Deliveries?handler=DownloadPackage&packageId=${i.id}` : null, ae = i ? [
    k && {
      key: "generate",
      label: L ? "Paketi üret" : "Yeniden üret",
      icon: "fa-gears",
      disabled: h,
      onSelect: ge
    },
    i.hasOutput && { key: "download", label: "Çıktıyı indir", icon: "fa-download", href: ve },
    B && i.hasOutput && {
      key: "share",
      label: "Paylaşım bağlantısı oluştur",
      icon: "fa-share-nodes",
      disabled: h,
      onSelect: ke
    },
    k && L && {
      key: "delete",
      label: "Paketi sil",
      icon: "fa-trash",
      className: "is-danger",
      disabled: h,
      onSelect: () => he(i.id)
    }
  ].filter(Boolean) : [], p = ae.find((a) => a.key === (L ? "generate" : "download")) ?? null, we = ae.filter((a) => a !== p), $ = (a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      Pe,
      {
        title: "Teslimler & arşiv",
        description: "Paket kurucu, üretim öncesi kontrol ve rapor sürümleri",
        menuItems: [
          k && l && {
            key: "new",
            label: "Yeni paket",
            icon: "fa-plus",
            disabled: h,
            onSelect: V
          }
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(ze, { active: "deliver", projectId: l }),
    a
  ] });
  return $(f ? /* @__PURE__ */ e.jsx(R, { rows: 6 }) : l ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-shell is-wide", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", style: { maxHeight: "none" }, children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Paketler" }),
        N ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(R, { rows: 4 }) }) : y.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz paket yok." }) : y.map((a) => {
          const t = re[a.status] || re[1];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => E(a.id),
              className: ie("apya-md-item", I === a.id && "selected"),
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
                /* @__PURE__ */ e.jsx("span", { className: ie("apya-chip", t.chip), children: t.text })
              ]
            },
            a.id
          );
        }),
        /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Sürüm arşivi" }),
        O.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] px-2 pb-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz üretim yapılmadı." }) : O.map((a) => /* @__PURE__ */ e.jsxs(
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
              /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", style: { fontSize: 10.5 }, children: D.size(a.outputSize) })
            ]
          },
          a.id
        ))
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: i ? /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: i.name }),
            /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
              i.reportTemplateName || "Şablon seçilmedi",
              i.periodCode && ` · ${i.periodCode}`,
              i.generatedAt && ` · ${D.date(i.generatedAt)} üretildi`
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            p && (p.href ? /* @__PURE__ */ e.jsx(v, { asChild: !0, size: "sm", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: `fa ${p.icon}` }), children: /* @__PURE__ */ e.jsx("a", { href: p.href, children: p.label }) }) : /* @__PURE__ */ e.jsx(v, { variant: "primary", size: "sm", disabled: p.disabled, onClick: p.onSelect, children: p.label })),
            /* @__PURE__ */ e.jsx(Ne, { size: "sm", label: "Paket eylemleri", items: we })
          ] })
        ] }),
        i.status !== 1 && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock" }),
          " Üretilmiş paket düzenlenemez — içerik değişirse denetim izi anlamsızlaşır."
        ] }),
        i.status === 1 && k && /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx(
            Se,
            {
              size: "sm",
              placeholder: "Ek eklemek için belge ara",
              leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
              value: ue,
              onChange: (a) => A(a.target.value)
            }
          ),
          Y.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-2 d-flex flex-column gap-1", children: Y.slice(0, 8).map((a) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "apya-md-item",
              style: { borderRadius: 8 },
              onClick: () => fe(a.id),
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
            i.items.length,
            ")"
          ] }),
          i.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Pakette henüz ek yok — boş paket üretilemez." }) : /* @__PURE__ */ e.jsx("div", { children: i.items.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "70px minmax(0,1fr) 110px 90px" }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 12, fontWeight: 600 }, children: a.annexNumber }),
            /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: a.documentFileName }),
            /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: D.size(a.fileSize) }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-end", children: [
              a.expiryDate && new Date(a.expiryDate) <= /* @__PURE__ */ new Date() && /* @__PURE__ */ e.jsx(M, { variant: "negative", size: "sm", children: "Süresi dolmuş" }),
              i.status === 1 && k && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: h, onClick: () => xe(a.id), children: "Çıkar" })
            ] })
          ] }, a.id)) })
        ] }),
        B && _.length > 0 && /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Paylaşım bağlantıları" }),
          _.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", style: { gridTemplateColumns: "110px minmax(0,1fr) 120px 90px" }, children: [
            /* @__PURE__ */ e.jsx(M, { variant: a.isActive ? "positive" : "neutral", size: "sm", children: a.isActive ? "Aktif" : a.revokedAt ? "İptal" : "Süresi doldu" }),
            /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11.5 }, children: [
              a.allowDownload ? "İndirme açık" : "Yalnız görüntüleme",
              a.watermark && ` · ${a.watermark}`
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11 }, children: [
              D.date(a.expiresAt),
              " · ",
              a.accessCount,
              " erişim"
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-end", children: a.isActive && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: h, onClick: async () => {
              await Te(a.id), C(await q(i.id));
            }, children: "İptal et" }) })
          ] }, a.id))
        ] })
      ] }) : I ? /* @__PURE__ */ e.jsx("div", { className: "p-3", children: /* @__PURE__ */ e.jsx(R, { rows: 3 }) }) : !N && y.length === 0 ? /* @__PURE__ */ e.jsx(
        W,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box" }),
          title: "Henüz paket yok",
          description: "Paket, rapor derleyicide seçtiğiniz şablonla ya da buradan boş olarak oluşturulur.",
          action: k && /* @__PURE__ */ e.jsx(
            te,
            {
              primary: /* @__PURE__ */ e.jsx(v, { leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }), disabled: h, onClick: V, children: "Yeni paket" }),
              link: { label: "veya rapor derleyiciden başla", href: `${G()}Documents/ReportBuilder?projectId=${l}` }
            }
          )
        }
      ) : /* @__PURE__ */ e.jsx(
        W,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box" }),
          title: "Bir paket seçin",
          description: "Ekleri sıralayın, kontrolü çalıştırın ve paketi üretin."
        }
      ) })
    ] }),
    pe && /* @__PURE__ */ e.jsx(
      He,
      {
        result: ce,
        loading: me,
        busy: h,
        onGenerate: je,
        onClose: () => z(!1)
      }
    ),
    Q && /* @__PURE__ */ e.jsx(Me, { message: Q, onDone: () => J(null) })
  ] }) : /* @__PURE__ */ e.jsx(
    W,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box-open" }),
      title: "Proje bağlamı gerekiyor",
      description: "Bu sayfa Dokümanlar'daki bir proje bağlamından açılır (?projectId=...).",
      action: /* @__PURE__ */ e.jsx(
        te,
        {
          primary: /* @__PURE__ */ e.jsx(v, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${G()}Documents/ReportBuilder`, children: "Rapor derleyiciye git" }) }),
          link: { label: "veya Projelere git", href: `${G()}Projects` }
        }
      )
    }
  ));
}
const ne = document.getElementById("deliveries-island");
ne && be(ne, "deliveries", /* @__PURE__ */ e.jsx(Oe, {}));
