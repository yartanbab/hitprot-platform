import { r as t, j as e, b as H } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { g as x, B as T } from "./Dialog-CkwGYc9B.js";
import { S as A } from "./SkeletonShape-DJE-K0js.js";
import { E as L } from "./EmptyState-CUE7sfrU.js";
const z = (s, n) => {
  var d, p, i;
  return (i = (p = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : p[s]) == null ? void 0 : i.call(p, n);
}, q = () => {
  var s;
  return ((s = window == null ? void 0 : window.abp) == null ? void 0 : s.appPath) ?? "/";
};
function m(s) {
  return new Promise((n, d) => {
    window.abp.ajax(s).done(n).fail(d);
  });
}
const o = (s, n = {}) => {
  const d = new URLSearchParams();
  Object.entries(n).forEach(([i, y]) => {
    y != null && y !== "" && d.append(i, y);
  });
  const p = d.toString();
  return `${q()}Documents/Admin?handler=${s}${p ? "&" + p : ""}`;
}, E = (s, n) => m({ url: s, type: "POST", contentType: "application/json", data: JSON.stringify(n) }), J = () => m({ url: o("Types"), type: "GET" }), K = () => m({ url: o("Rules"), type: "GET" }), Z = (s) => E(o("CreateRule"), s), X = (s, n) => E(o("UpdateRule", { id: s }), n), Q = (s) => m({ url: o("DeleteRule", { id: s }), type: "POST" }), ee = (s, n) => m({ url: o("SetRuleEnabled", { id: s, isEnabled: n }), type: "POST" }), ae = (s) => m({ url: o("DryRun", { ruleId: s }), type: "POST" }), se = (s) => m({ url: o("RunRule", { ruleId: s }), type: "POST" }), O = (s) => m({ url: o("FieldPermissions", { documentTypeId: s }), type: "GET" }), ie = (s) => E(o("SetFieldPermission"), s), P = () => m({ url: o("Integrations"), type: "GET" }), ne = (s, n) => E(o("SaveIntegration", { id: s }), n), te = () => m({ url: o("Templates"), type: "GET" }), le = () => m({ url: o("Consolidated"), type: "GET" }), re = {
  1: "Belge adı",
  2: "Belge tipi",
  3: "Tutar",
  4: "Dönem",
  5: "Durum",
  6: "İş adımı",
  7: "Geçerlilik",
  8: "Klasör",
  9: "Eksik zorunlu alan sayısı"
}, ce = {
  1: "eşittir",
  2: "eşit değildir",
  3: "içerir",
  4: "büyüktür",
  5: "küçüktür",
  6: "boş",
  7: "dolu"
}, oe = {
  1: "Klasöre taşı",
  2: "Belge tipini ata",
  3: "Etiket ekle",
  4: "Durumu değiştir",
  5: "İş adımı ata",
  6: "Dönem ata"
};
function de({ rule: s, onChanged: n, onEdit: d, onDelete: p }) {
  const [i, y] = t.useState(null), [h, j] = t.useState(!1), k = async () => {
    j(!0);
    try {
      y(await ae(s.id));
    } finally {
      j(!1);
    }
  }, R = async () => {
    if (window.confirm(`"${s.name}" kuralı gerçekten uygulanacak. Devam edilsin mi?`)) {
      j(!0);
      try {
        y(await se(s.id)), await n();
      } finally {
        j(!1);
      }
    }
  }, b = async () => {
    j(!0);
    try {
      await ee(s.id, !s.isEnabled), await n();
    } finally {
      j(!1);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: s.name }),
          /* @__PURE__ */ e.jsx(x, { variant: s.isEnabled ? "positive" : "neutral", size: "sm", children: s.isEnabled ? "Açık" : "Kapalı" }),
          /* @__PURE__ */ e.jsx(x, { variant: "neutral", size: "sm", children: s.trigger === 1 ? "Yüklemede" : "Zamanlı" })
        ] }),
        s.description && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: s.description })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
          "toplam ",
          s.totalAffectedCount,
          " belge"
        ] }),
        /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: h, onClick: b, children: s.isEnabled ? "Kapat" : "Aç" }),
        /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: h, onClick: () => d(s), children: "Düzenle" }),
        /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", disabled: h, onClick: () => p(s), children: "Sil" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-rule-block is-if", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: s.logicalOperator === 1 ? "Eğer (tümü)" : "Eğer (herhangi biri)" }),
        s.conditions.length === 0 ? /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Koşul yok — koşulsuz kural hiçbir belgeye uygulanmaz." }) : s.conditions.map((l) => /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12 }, children: [
          re[l.field] || "—",
          " ",
          /* @__PURE__ */ e.jsx("em", { children: ce[l.operator] || "—" }),
          l.compareValue ? ` "${l.compareValue}"` : ""
        ] }, l.id))
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-rule-block is-then", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "O zaman" }),
        s.actions.map((l) => /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12 }, children: [
          oe[l.actionType] || "—",
          l.payloadLabel ? ` → ${l.payloadLabel}` : l.payload ? ` → ${l.payload}` : ""
        ] }, l.id))
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ e.jsx(T, { variant: "outline", size: "sm", isLoading: h, onClick: k, children: "Kuru çalıştır" }),
      /* @__PURE__ */ e.jsx(
        T,
        {
          variant: "primary",
          size: "sm",
          disabled: !s.isEnabled || h,
          onClick: R,
          title: s.isEnabled ? void 0 : "Kapalı kural çalıştırılamaz",
          children: "Uygula"
        }
      ),
      i && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "d-flex align-items-center gap-2",
          style: { fontSize: 11.5, color: "var(--apya-text-secondary)" },
          children: [
            /* @__PURE__ */ e.jsx(x, { variant: i.isDryRun ? "brand" : "positive", size: "sm", children: i.isDryRun ? "Kuru" : "Uygulandı" }),
            i.matchedCount,
            " eşleşme · ",
            /* @__PURE__ */ e.jsx("strong", { children: i.affectedCount }),
            " belge etkilenir",
            i.sample.length > 0 && ` (ör. ${i.sample.slice(0, 3).join(", ")})`
          ]
        }
      )
    ] })
  ] });
}
const w = (...s) => s.filter(Boolean).join(" "), pe = [
  { key: "schema", label: "Meta şema" },
  { key: "rules", label: "Kural motoru" },
  { key: "templates", label: "Şablon galerisi" },
  { key: "integrations", label: "Entegrasyonlar" },
  { key: "permissions", label: "Alan bazlı izinler" },
  { key: "consolidated", label: "Konsolide rapor" }
], me = {
  1: "metin",
  2: "tarih",
  3: "para",
  4: "sayı",
  5: "yüzde",
  6: "liste",
  7: "ilişki"
}, ye = { 1: "Manuel", 2: "OCR", 3: "AI", 4: "Kural" }, ue = { 1: "Herkes", 2: "Kısıtlı", 3: "Gizli" }, G = {
  1: { text: "düzenle", chip: "apya-chip-positive" },
  2: { text: "görüntüle", chip: "apya-chip-accent" },
  3: { text: "maskeli", chip: "apya-chip-warning" },
  4: { text: "gizli", chip: "apya-chip-neutral" }
}, xe = {
  1: "E-posta kutusu",
  2: "Muhasebe",
  3: "Soğuk arşiv",
  4: "Sürücü eşitleme"
};
function he() {
  const [s, n] = t.useState("schema"), [d, p] = t.useState([]), [i, y] = t.useState(null), [h, j] = t.useState([]), [k, R] = t.useState([]), [b, l] = t.useState([]), [f, I] = t.useState(null), [g, $] = t.useState(null), [F, B] = t.useState(!0), [C, u] = t.useState(!1), D = t.useCallback(async () => {
    const a = await J();
    p(a ?? []), !i && (a != null && a.length) && y(a[0].id);
  }, [i]);
  t.useEffect(() => {
    (async () => {
      B(!0);
      try {
        await D();
      } catch (a) {
        z("error", "Yönetim verisi yüklenemedi."), console.error("[DocumentsAdmin] load", a);
      } finally {
        B(!1);
      }
    })();
  }, [D]), t.useEffect(() => {
    (async () => {
      try {
        s === "rules" && h.length === 0 && j(await K() ?? []), s === "templates" && k.length === 0 && R(await te() ?? []), s === "integrations" && b.length === 0 && l(await P() ?? []), s === "consolidated" && !g && $(await le()), s === "permissions" && i && I(await O(i));
      } catch (a) {
        z("error", "Modül verisi yüklenemedi."), console.error("[DocumentsAdmin] module load", a);
      }
    })();
  }, [s, i]);
  const N = t.useCallback(async () => j(await K() ?? []), []), v = d.find((a) => a.id === i), _ = async () => {
    const a = window.prompt("Kural adı:");
    if (a) {
      u(!0);
      try {
        await Z({
          name: a,
          trigger: 1,
          logicalOperator: 1,
          // Yeni kural boş koşulla anlamsız olurdu; ilk koşul olarak "eksik meta"
          // gibi güvenli bir varsayılan verilir, kullanıcı düzenler.
          conditions: [{ order: 1, field: 9, operator: 4, compareValue: "0" }],
          actions: [{ order: 1, actionType: 3, payload: "incelenecek" }]
        }), await N();
      } catch {
        z("error", "Kural oluşturulamadı.");
      } finally {
        u(!1);
      }
    }
  }, V = async (a) => {
    if (window.confirm(`"${a.name}" silinsin mi?`)) {
      u(!0);
      try {
        await Q(a.id), await N();
      } finally {
        u(!1);
      }
    }
  }, W = async (a) => {
    const r = window.prompt("Kural adı:", a.name);
    if (r) {
      u(!0);
      try {
        await X(a.id, {
          name: r,
          description: a.description,
          trigger: a.trigger,
          logicalOperator: a.logicalOperator,
          order: a.order,
          conditions: a.conditions.map((c) => ({
            order: c.order,
            field: c.field,
            operator: c.operator,
            compareValue: c.compareValue
          })),
          actions: a.actions.map((c) => ({
            order: c.order,
            actionType: c.actionType,
            payload: c.payload
          }))
        }), await N();
      } finally {
        u(!1);
      }
    }
  }, Y = async (a, r, c) => {
    const S = c >= 4 ? 1 : c + 1;
    u(!0);
    try {
      await ie({ documentTypeId: i, fieldId: a, roleName: r, level: S }), I(await O(i));
    } catch {
      z("error", "İzin güncellenemedi.");
    } finally {
      u(!1);
    }
  }, U = async () => {
    const a = window.prompt("Bağlantı adı:");
    if (!a) return;
    const r = window.prompt("Hedef (adres/kimlik):") || null;
    u(!0);
    try {
      await ne(null, { kind: 1, name: a, target: r, isEnabled: !1 }), l(await P() ?? []);
    } finally {
      u(!1);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Doküman yönetimi" }),
      /* @__PURE__ */ e.jsx("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: "Belge tipleri, kurallar, izinler ve bağlantılar" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "d-flex align-items-center gap-2 flex-wrap mb-4", children: pe.map((a) => /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        className: w("apya-doc-filterchip", s === a.key && "is-active"),
        style: { height: 31, fontSize: 12.5 },
        onClick: () => n(a.key),
        children: a.label
      },
      a.key
    )) }),
    F ? /* @__PURE__ */ e.jsx(A, { rows: 6 }) : s === "schema" ? /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-shell is-wide", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-docs-tree", style: { maxHeight: "none" }, children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", style: { padding: "4px 8px 6px" }, children: "Belge tipleri" }),
        d.map((a) => /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: w("apya-md-item", i === a.id && "selected"),
            style: { borderRadius: 8 },
            onClick: () => y(a.id),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-title", children: a.name }),
              a.isSystem && /* @__PURE__ */ e.jsx(x, { variant: "neutral", size: "sm", children: "sistem" }),
              /* @__PURE__ */ e.jsx("span", { className: "apya-md-item-side apya-numeric", children: a.fields.length })
            ]
          },
          a.id
        )),
        /* @__PURE__ */ e.jsx("div", { style: { padding: "6px 8px", fontSize: 11, color: "var(--apya-text-tertiary)" }, children: "Sistem tipleri tüm kiracılarda paylaşılır; düzenlenemez." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-docs-main", children: v ? /* @__PURE__ */ e.jsxs("div", { className: "p-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2 mb-3", children: [
          /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 14, fontWeight: 600 }, children: [
            v.name,
            " · alan şeması"
          ] }),
          /* @__PURE__ */ e.jsxs(x, { variant: "brand", size: "sm", children: [
            v.fields.length,
            " alan"
          ] }),
          v.retentionMonths && /* @__PURE__ */ e.jsxs(x, { variant: "neutral", size: "sm", children: [
            "saklama ",
            v.retentionMonths,
            " ay"
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-row-head", style: { gridTemplateColumns: "minmax(0,1fr) 90px 80px 90px 110px" }, children: [
          /* @__PURE__ */ e.jsx("span", { children: "Alan" }),
          /* @__PURE__ */ e.jsx("span", { children: "Tip" }),
          /* @__PURE__ */ e.jsx("span", { children: "Zorunlu" }),
          /* @__PURE__ */ e.jsx("span", { children: "Doldurma" }),
          /* @__PURE__ */ e.jsx("span", { children: "Görünürlük" })
        ] }),
        v.fields.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row", style: { gridTemplateColumns: "minmax(0,1fr) 90px 80px 90px 110px", cursor: "default" }, children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: a.label }),
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: me[a.fieldType] }),
          /* @__PURE__ */ e.jsx("span", { children: a.isRequired && /* @__PURE__ */ e.jsx(x, { variant: "negative", size: "sm", children: "zorunlu" }) }),
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5 }, children: ye[a.fillSource] }),
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5 }, children: ue[a.visibility] })
        ] }, a.id))
      ] }) : /* @__PURE__ */ e.jsx(L, { icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list" }), title: "Bir belge tipi seçin" }) })
    ] }) : s === "rules" ? /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          T,
          {
            variant: "primary",
            size: "sm",
            disabled: C,
            onClick: _,
            leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
            children: "Yeni kural"
          }
        ),
        /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Yeni kural KAPALI doğar — önce kuru çalıştırıp etkisini görün." })
      ] }),
      h.length === 0 ? /* @__PURE__ */ e.jsx(
        L,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-wand-magic-sparkles" }),
          title: "Henüz kural yok",
          description: "Koşul → eylem tanımlayarak belgeleri otomatik sınıflandırın."
        }
      ) : h.map((a) => /* @__PURE__ */ e.jsx(
        de,
        {
          rule: a,
          onChanged: N,
          onEdit: W,
          onDelete: V
        },
        a.id
      ))
    ] }) : s === "templates" ? /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-grid", children: [
      k.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-tile", style: { cursor: "default" }, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-head", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("div", { className: "apya-tile-title", children: a.name }),
            /* @__PURE__ */ e.jsx("div", { className: "apya-tile-sub", children: a.issuer || "—" })
          ] }),
          /* @__PURE__ */ e.jsxs(x, { variant: "brand", size: "sm", children: [
            a.enabledSectionCount,
            " bölüm"
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-tile-foot", children: [
          /* @__PURE__ */ e.jsx("span", { children: a.isSystem ? "Sistem şablonu" : "Kiracı şablonu" }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", children: [
            a.sections.length,
            " tanım"
          ] })
        ] })
      ] }, a.id)),
      k.length === 0 && /* @__PURE__ */ e.jsx(L, { icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-layer-group" }), title: "Şablon yok" })
    ] }) : s === "integrations" ? /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-3", children: [
      /* @__PURE__ */ e.jsx("div", { className: "d-flex align-items-center gap-2", children: /* @__PURE__ */ e.jsx(
        T,
        {
          variant: "primary",
          size: "sm",
          disabled: C,
          onClick: U,
          leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          children: "Bağlantı ekle"
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", style: { borderColor: "var(--apya-warning-500)" }, children: /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 12, color: "var(--apya-text-secondary)" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-info" }),
        " Bu kayıtlar yalnız ",
        /* @__PURE__ */ e.jsx("strong", { children: "yapılandırma" }),
        ' tutar. Gerçek eşitleme altyapısı (e-posta çekme, S3 aktarımı, muhasebe senkronu) henüz yok — bir bağlantı hiçbir zaman kendiliğinden "bağlı" duruma geçmez.'
      ] }) }),
      b.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-activity-row", style: { gridTemplateColumns: "150px minmax(0,1fr) 150px 110px" }, children: [
        /* @__PURE__ */ e.jsx(x, { variant: "neutral", size: "sm", children: xe[a.kind] }),
        /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12.5 }, children: a.name }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric text-truncate", style: { fontSize: 11 }, children: a.target || "—" }),
        /* @__PURE__ */ e.jsx(x, { variant: "warning", size: "sm", children: "kurulum bekliyor" })
      ] }, a.id))
    ] }) : s === "permissions" ? f ? /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 13.5, fontWeight: 600 }, children: [
          "Alan bazlı izinler · ",
          f.documentTypeName
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "d-flex gap-2", children: Object.entries(G).map(([a, r]) => /* @__PURE__ */ e.jsx("span", { className: w("apya-chip", r.chip), children: r.text }, a)) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { style: { overflowX: "auto" }, children: [
        /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "apya-doc-row apya-doc-row-head",
            style: { gridTemplateColumns: `220px repeat(${f.roles.length}, minmax(110px, 1fr))` },
            children: [
              /* @__PURE__ */ e.jsx("span", { children: "Alan" }),
              f.roles.map((a) => /* @__PURE__ */ e.jsx("span", { children: a }, a))
            ]
          }
        ),
        f.rows.map((a) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "apya-doc-row",
            style: { gridTemplateColumns: `220px repeat(${f.roles.length}, minmax(110px, 1fr))`, cursor: "default" },
            children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: a.label }),
              f.roles.map((r) => {
                const c = a.levels[r] ?? 1, S = G[c];
                return /* @__PURE__ */ e.jsx("span", { children: /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: w("apya-chip", S.chip),
                    style: { border: "none", cursor: "pointer" },
                    disabled: C,
                    title: "Seviyeyi değiştirmek için tıklayın",
                    onClick: () => Y(a.fieldId, r, c),
                    children: S.text
                  }
                ) }, r);
              })
            ]
          },
          a.fieldId
        ))
      ] }),
      /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Matris ETKİN seviyeyi gösterir (kural + devralma + varsayılan). Bir kullanıcı birden çok role sahipse en az kısıtlayıcı olan geçerlidir." })
    ] }) : /* @__PURE__ */ e.jsx(A, { rows: 5 }) : g ? /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpis", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Kiracı" }),
          /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: g.tenantCount }),
          /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            g.tenantsWithProjects,
            " tanesi projeli"
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Toplam belge" }),
          /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: g.totalDocuments })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-row apya-doc-row-head", style: { gridTemplateColumns: "minmax(0,1fr) 90px 90px 130px 110px" }, children: [
          /* @__PURE__ */ e.jsx("span", { children: "Kiracı" }),
          /* @__PURE__ */ e.jsx("span", { children: "Proje" }),
          /* @__PURE__ */ e.jsx("span", { children: "Belge" }),
          /* @__PURE__ */ e.jsx("span", { children: "Belgelenen tutar" }),
          /* @__PURE__ */ e.jsx("span", { children: "Son belge" })
        ] }),
        g.rows.map((a) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "apya-doc-row",
            style: { gridTemplateColumns: "minmax(0,1fr) 90px 90px 130px 110px", cursor: "default" },
            children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: a.tenantName }),
              /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", children: a.projectCount }),
              /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", children: a.documentCount }),
              /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", children: new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2 }).format(a.documentedAmount) }),
              /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11 }, children: a.lastDocumentAt ? new Intl.DateTimeFormat("tr-TR").format(new Date(a.lastDocumentAt)) : "—" })
            ]
          },
          a.tenantId ?? "host"
        ))
      ] })
    ] }) : /* @__PURE__ */ e.jsx(A, { rows: 5 })
  ] });
}
const M = document.getElementById("documents-admin-island");
M && H(M).render(/* @__PURE__ */ e.jsx(he, {}));
