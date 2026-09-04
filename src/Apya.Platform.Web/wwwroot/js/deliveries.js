import { j as e, r, b as de } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { g as E, B as w, I as me } from "./Dialog-BdNKdiS6.js";
import { S as J } from "./SkeletonShape-CiCOe1YJ.js";
import { E as U } from "./EmptyState-Bhcx2Wdd.js";
import { M as pe } from "./ModalPortal-8QCz-DZi.js";
const M = (t) => {
  var s, l;
  return (l = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.auth) == null ? void 0 : l.isGranted(t);
}, h = (t, s) => {
  var l, p, y;
  return (y = (p = (l = window == null ? void 0 : window.abp) == null ? void 0 : l.notify) == null ? void 0 : p[t]) == null ? void 0 : y.call(p, s);
}, _ = () => {
  var t;
  return ((t = window == null ? void 0 : window.abp) == null ? void 0 : t.appPath) ?? "/";
};
function m(t) {
  return new Promise((s, l) => {
    window.abp.ajax(t).done(s).fail(l);
  });
}
const c = (t, s = {}) => {
  const l = new URLSearchParams();
  Object.entries(s).forEach(([y, o]) => {
    o != null && o !== "" && l.append(y, o);
  });
  const p = l.toString();
  return `${_()}Documents/Deliveries?handler=${t}${p ? "&" + p : ""}`;
}, R = (t, s) => m({ url: t, type: "POST", contentType: "application/json", data: JSON.stringify(s) }), ye = (t) => m({ url: c("Packages", { projectId: t }), type: "GET" }), H = (t) => m({ url: c("Package", { id: t }), type: "GET" }), xe = (t) => R(c("CreatePackage"), t), he = (t) => m({ url: c("DeletePackage", { id: t }), type: "POST" }), ue = (t, s) => R(c("AddItems"), { packageId: t, documentFileIds: s }), fe = (t) => m({ url: c("RemoveItem", { itemId: t }), type: "POST" }), ge = (t) => m({ url: c("Preflight", { packageId: t }), type: "GET" }), je = (t) => m({ url: c("Generate", { packageId: t }), type: "POST" }), ve = () => m({ url: c("Templates"), type: "GET" }), ke = (t) => m({ url: c("Runs", { projectId: t }), type: "GET" }), D = (t) => m({ url: c("ShareLinks", { packageId: t }), type: "GET" }), we = (t) => R(c("CreateShareLink"), t), be = (t) => m({ url: c("RevokeShareLink", { id: t }), type: "POST" }), Se = (t, s) => m({
  url: `${_()}Documents?handler=Files&projectId=${t}&maxResultCount=50&skipCount=0` + (s ? `&filterText=${encodeURIComponent(s)}` : ""),
  type: "GET"
}), Ne = {
  1: "Zorunlu kalem",
  2: "Süresi dolmuş belge",
  3: "Eksik meta",
  4: "Gizli alan",
  5: "Boş paket"
};
function Pe({ result: t, loading: s, busy: l, onGenerate: p, onClose: y }) {
  var b;
  const o = (t == null ? void 0 : t.canGenerate) === !0;
  return /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsx("div", { className: "apya-in apya-doc-overlay", onClick: y, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-pop-in apya-doc-dialog",
      style: { maxWidth: 560 },
      onClick: (x) => x.stopPropagation(),
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
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: s ? "Kontrol ediliyor…" : o ? "Paket üretilebilir." : `${(t == null ? void 0 : t.blockingCount) ?? 0} kalem üretimi engelliyor.` })
          ] })
        ] }),
        s ? /* @__PURE__ */ e.jsx(J, { rows: 4 }) : (((b = t == null ? void 0 : t.issues) == null ? void 0 : b.length) ?? 0) === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12.5, color: "var(--apya-text-secondary)" }, children: "Engelleyen veya uyarı gerektiren bir durum bulunmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column gap-2", style: { maxHeight: 320, overflowY: "auto" }, children: t.issues.map((x, g) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "d-flex align-items-start gap-2",
            style: {
              padding: "8px 10px",
              borderRadius: 10,
              background: x.isBlocking ? "rgba(248,113,113,.08)" : "var(--apya-surface-sunken)"
            },
            children: [
              /* @__PURE__ */ e.jsx(E, { variant: x.isBlocking ? "negative" : "warning", size: "sm", children: x.isBlocking ? "Bloke" : "Uyarı" }),
              /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
                /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12.5 }, children: x.message }),
                /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: Ne[x.kind] || "—" })
              ] })
            ]
          },
          g
        )) }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 justify-content-end mt-4", children: [
          /* @__PURE__ */ e.jsx(w, { variant: "outline", size: "sm", onClick: y, children: "Kapat" }),
          /* @__PURE__ */ e.jsx(
            w,
            {
              variant: "primary",
              size: "sm",
              disabled: !o || s,
              isLoading: l,
              title: o ? void 0 : "Bloke kalemler giderilmeden üretilemez",
              onClick: p,
              children: "Paketi üret"
            }
          )
        ] })
      ]
    }
  ) }) });
}
const Y = (...t) => t.filter(Boolean).join(" "), N = {
  date: (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(t)) : "—",
  size: (t) => t ? t < 1024 * 1024 ? (t / 1024).toFixed(0) + " KB" : (t / (1024 * 1024)).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " MB" : "—"
}, Z = {
  1: { text: "Taslak", chip: "apya-chip-neutral" },
  2: { text: "Üretildi", chip: "apya-chip-positive" },
  3: { text: "Gönderildi", chip: "apya-chip-accent" }
}, C = { Pdf: 1, Zip: 2, Excel: 4 };
function ze({ message: t, onDone: s }) {
  return r.useEffect(() => {
    const l = setTimeout(s, 3200);
    return () => clearTimeout(l);
  }, [s]), /* @__PURE__ */ e.jsx("div", { className: "apya-pop-in apya-doc-toast", role: "status", children: /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12 }, children: t }) });
}
function Te() {
  const t = new URLSearchParams(window.location.search).get("projectId"), [s, l] = r.useState([]), [p, y] = r.useState([]), [o, b] = r.useState([]), [x, g] = r.useState(!0), [B, I] = r.useState(null), [i, j] = r.useState(null), [u, d] = r.useState(!1), [Q, V] = r.useState(null), [X, L] = r.useState(!1), [ee, S] = r.useState(!1), [ae, A] = r.useState(""), [G, P] = r.useState([]), [$, z] = r.useState([]), [W, O] = r.useState(null), v = M("Platform.Documents.GenerateReports"), T = M("Platform.Documents.ShareExternally"), f = r.useCallback(async () => {
    if (!t) {
      g(!1);
      return;
    }
    g(!0);
    try {
      const [a, n, k] = await Promise.all([
        ye(t),
        ve(),
        ke(t)
      ]);
      l(a ?? []), y(n ?? []), b(k ?? []);
    } catch (a) {
      h("error", "Teslim paketleri yüklenemedi."), console.error("[Deliveries] load", a);
    } finally {
      g(!1);
    }
  }, [t]);
  r.useEffect(() => {
    f();
  }, [f]);
  const F = async (a) => {
    I(a);
    try {
      const [n, k] = await Promise.all([H(a), T ? D(a) : Promise.resolve([])]);
      j(n), z(k ?? []);
    } catch (n) {
      h("error", "Paket açılamadı."), console.error("[Deliveries] openPackage", n);
    }
  }, te = async () => {
    const a = window.prompt("Paket adı:");
    if (a) {
      d(!0);
      try {
        const n = await xe({
          projectId: t,
          name: a,
          formats: C.Pdf | C.Zip | C.Excel
        });
        await f(), await F(n.id);
      } catch (n) {
        h("error", "Paket oluşturulamadı."), console.error("[Deliveries] create", n);
      } finally {
        d(!1);
      }
    }
  }, se = async (a) => {
    d(!0);
    try {
      await he(a), B === a && (I(null), j(null)), await f();
    } catch {
      h("error", "Paket silinemedi.");
    } finally {
      d(!1);
    }
  }, ie = async (a) => {
    if (A(a), !a.trim()) {
      P([]);
      return;
    }
    try {
      const n = await Se(t, a.trim());
      P(n.items ?? []);
    } catch (n) {
      console.error("[Deliveries] search", n);
    }
  }, ne = async (a) => {
    d(!0);
    try {
      j(await ue(i.id, [a])), A(""), P([]), await f();
    } catch {
      h("error", "Ek eklenemedi.");
    } finally {
      d(!1);
    }
  }, re = async (a) => {
    d(!0);
    try {
      j(await fe(a)), await f();
    } catch {
      h("error", "Ek çıkarılamadı.");
    } finally {
      d(!1);
    }
  }, le = async () => {
    S(!0), L(!0);
    try {
      V(await ge(i.id));
    } catch {
      h("error", "Kontrol çalıştırılamadı."), S(!1);
    } finally {
      L(!1);
    }
  }, oe = async () => {
    d(!0);
    try {
      const a = await je(i.id);
      S(!1), O(`Paket üretildi — sürüm v${a.version}.`), j(await H(i.id)), await f();
    } catch (a) {
      h("error", "Paket üretilemedi — engelleyen kalemler olabilir."), console.error("[Deliveries] generate", a);
    } finally {
      d(!1);
    }
  }, ce = async () => {
    const a = Number(window.prompt("Kaç gün geçerli olsun?", "14"));
    if (!a || a < 1) return;
    const n = window.confirm("İndirmeye izin verilsin mi? (İptal = yalnız görüntüleme)"), k = window.prompt("Filigran metni (boş bırakılabilir):") || null;
    d(!0);
    try {
      const K = await we({
        targetType: 1,
        targetId: i.id,
        lifetimeDays: a,
        allowDownload: n,
        watermark: k
      });
      z(await D(i.id)), window.prompt("Bağlantı (yalnız şimdi gösterilir, kopyalayın):", window.location.origin + K.url);
    } catch {
      h("error", "Bağlantı oluşturulamadı.");
    } finally {
      d(!1);
    }
  };
  return t ? /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Teslimler & arşiv" }),
        /* @__PURE__ */ e.jsx("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: "Paket kurucu, üretim öncesi kontrol ve rapor sürümleri" })
      ] }),
      v && /* @__PURE__ */ e.jsx(w, { variant: "primary", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }), disabled: u, onClick: te, children: "Yeni paket" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-shell is-wide", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", style: { maxHeight: "none" }, children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Paketler" }),
        x ? /* @__PURE__ */ e.jsx("div", { className: "p-2", children: /* @__PURE__ */ e.jsx(J, { rows: 4 }) }) : s.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-center py-5 px-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz paket yok." }) : s.map((a) => {
          const n = Z[a.status] || Z[1];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => F(a.id),
              className: Y("apya-md-item", B === a.id && "selected"),
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
                /* @__PURE__ */ e.jsx("span", { className: Y("apya-chip", n.chip), children: n.text })
              ]
            },
            a.id
          );
        }),
        /* @__PURE__ */ e.jsx("div", { style: { height: 1, background: "var(--apya-border-subtle)", margin: "8px 4px" } }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "0 8px 6px" }, children: "Sürüm arşivi" }),
        o.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[11px] px-2 pb-2", style: { color: "var(--apya-text-tertiary)" }, children: "Henüz üretim yapılmadı." }) : o.map((a) => /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: i ? /* @__PURE__ */ e.jsxs("div", { className: "p-3 d-flex flex-column gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: i.name }),
            /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
              i.reportTemplateName || "Şablon seçilmedi",
              i.periodCode && ` · ${i.periodCode}`,
              i.generatedAt && ` · ${N.date(i.generatedAt)} üretildi`
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
            i.hasOutput && /* @__PURE__ */ e.jsx(
              "a",
              {
                href: `${window.abp.appPath}Documents/Deliveries?handler=DownloadPackage&packageId=${i.id}`,
                className: "apya-doc-linkbtn",
                children: "Çıktıyı indir"
              }
            ),
            T && i.hasOutput && /* @__PURE__ */ e.jsxs(w, { variant: "outline", size: "sm", disabled: u, onClick: ce, children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-share-nodes" }),
              " Paylaş"
            ] }),
            v && /* @__PURE__ */ e.jsx(w, { variant: "primary", size: "sm", disabled: u, onClick: le, children: "Paketi üret" }),
            v && i.status === 1 && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: u, onClick: () => se(i.id), children: "Sil" })
          ] })
        ] }),
        i.status !== 1 && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock" }),
          " Üretilmiş paket düzenlenemez — içerik değişirse denetim izi anlamsızlaşır."
        ] }),
        i.status === 1 && v && /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx(
            me,
            {
              size: "sm",
              placeholder: "Ek eklemek için belge ara",
              leading: /* @__PURE__ */ e.jsx("i", { className: "fa fa-search", style: { fontSize: 11 } }),
              value: ae,
              onChange: (a) => ie(a.target.value)
            }
          ),
          G.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-2 d-flex flex-column gap-1", children: G.slice(0, 8).map((a) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "apya-md-item",
              style: { borderRadius: 8 },
              onClick: () => ne(a.id),
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
            /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: N.size(a.fileSize) }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-end", children: [
              a.expiryDate && new Date(a.expiryDate) <= /* @__PURE__ */ new Date() && /* @__PURE__ */ e.jsx(E, { variant: "negative", size: "sm", children: "Süresi dolmuş" }),
              i.status === 1 && v && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: u, onClick: () => re(a.id), children: "Çıkar" })
            ] })
          ] }, a.id)) })
        ] }),
        T && $.length > 0 && /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline mb-2", children: "Paylaşım bağlantıları" }),
          $.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", style: { gridTemplateColumns: "110px minmax(0,1fr) 120px 90px" }, children: [
            /* @__PURE__ */ e.jsx(E, { variant: a.isActive ? "positive" : "neutral", size: "sm", children: a.isActive ? "Aktif" : a.revokedAt ? "İptal" : "Süresi doldu" }),
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
            /* @__PURE__ */ e.jsx("span", { className: "text-end", children: a.isActive && /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: u, onClick: async () => {
              await be(a.id), z(await D(i.id));
            }, children: "İptal et" }) })
          ] }, a.id))
        ] })
      ] }) : /* @__PURE__ */ e.jsx(
        U,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box" }),
          title: "Bir paket seçin",
          description: "Ekleri sıralayın, kontrolü çalıştırın ve paketi üretin."
        }
      ) })
    ] }),
    ee && /* @__PURE__ */ e.jsx(
      Pe,
      {
        result: Q,
        loading: X,
        busy: u,
        onGenerate: oe,
        onClose: () => S(!1)
      }
    ),
    W && /* @__PURE__ */ e.jsx(ze, { message: W, onDone: () => O(null) })
  ] }) : /* @__PURE__ */ e.jsx("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: /* @__PURE__ */ e.jsx(
    U,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-box-open" }),
      title: "Proje bağlamı gerekiyor",
      description: "Bu sayfa Dokümanlar'daki bir proje bağlamından açılır (?projectId=...)."
    }
  ) });
}
const q = document.getElementById("deliveries-island");
q && de(q).render(/* @__PURE__ */ e.jsx(Te, {}));
