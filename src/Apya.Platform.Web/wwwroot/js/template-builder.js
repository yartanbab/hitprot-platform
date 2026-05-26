import { c as j, j as e, r as c } from "./vendor.js";
const y = () => /* @__PURE__ */ e.jsx("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5", children: /* @__PURE__ */ e.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), k = () => /* @__PURE__ */ e.jsx("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5", children: /* @__PURE__ */ e.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 15l7-7 7 7" }) }), N = () => /* @__PURE__ */ e.jsx("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5", children: /* @__PURE__ */ e.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) }), S = () => /* @__PURE__ */ e.jsx("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2.5", className: "w-5 h-5", children: /* @__PURE__ */ e.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4v16m8-8H4" }) }), C = () => {
  const [o, u] = c.useState(""), [l, n] = c.useState([]), [i, d] = c.useState(!1), h = [
    { type: "TextInput", label: "Metin Kutusu", defaultContent: "Kısa Yanıt" },
    { type: "NumberInput", label: "Sayısal Girdi", defaultContent: "Sayısal Değer" },
    { type: "Select", label: "Açılır Liste", defaultContent: "Lütfen Birini Seçin" },
    { type: "Rating", label: "Derecelendirme", defaultContent: "Memnuniyet Puanı" }
  ], m = (t, a) => {
    const r = {
      id: Math.random().toString(36).substr(2, 9),
      type: t,
      order: l.length + 1,
      content: a,
      settings: t === "Select" ? { options: ["Seçenek 1", "Seçenek 2"], required: !1 } : { required: !1 }
    };
    n([...l, r]);
  }, b = (t) => {
    n(l.filter((a) => a.id !== t).map((a, r) => ({ ...a, order: r + 1 })));
  }, x = (t, a) => {
    if (a === "up" && t === 0 || a === "down" && t === l.length - 1) return;
    const r = [...l], s = a === "up" ? t - 1 : t + 1;
    [r[t], r[s]] = [r[s], r[t]], n(r.map((v, w) => ({ ...v, order: w + 1 })));
  }, g = (t, a) => {
    n(l.map((r) => r.id === t ? { ...r, content: a } : r));
  }, f = () => {
    if (!o.trim()) {
      window.abp.message.warn("Lütfen formunuza şık bir başlık verin!", "Başlık Eksik");
      return;
    }
    if (l.length === 0) {
      window.abp.message.warn("Forma henüz hiçbir soru eklemediniz. Lütfen sol menüden blok seçin.", "Sorular Eksik");
      return;
    }
    d(!0);
    const t = o.trim().toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-") + "-" + Math.random().toString(36).substr(2, 6), a = {
      title: o,
      slug: t,
      blocks: l.map((r) => {
        let s = 0;
        return r.type === "NumberInput" ? s = 1 : r.type === "Select" ? s = 2 : r.type === "Rating" && (s = 4), {
          type: s,
          order: r.order,
          content: r.content || "İsimsiz Soru",
          settings: JSON.stringify(r.settings || {})
        };
      })
    };
    window.abp.ajax({
      type: "POST",
      url: "/api/app/template",
      data: JSON.stringify(a)
    }).then(function(r) {
      window.abp.notify.success("Şablon başarıyla veritabanına kaydedildi!", "Tebrikler"), u(""), n([]), d(!1);
    }).catch(function(r) {
      let s = r && r.message ? r.message : "Şablon kaydedilirken bir hata oluştu.";
      window.abp.message.error(s, "Hata"), d(!1);
    });
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "relative flex h-full min-h-[calc(100vh-80px)] bg-slate-50 overflow-hidden rounded-tl-3xl shadow-inner text-slate-800", children: [
    /* @__PURE__ */ e.jsx("div", { className: "absolute top-[-10%] left-[10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob" }),
    /* @__PURE__ */ e.jsx("div", { className: "absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob", style: { animationDelay: "2s" } }),
    /* @__PURE__ */ e.jsx("div", { className: "absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob", style: { animationDelay: "4s" } }),
    /* @__PURE__ */ e.jsxs("div", { className: "relative w-80 bg-white/60 backdrop-blur-3xl border-r border-white/50 p-8 flex flex-col gap-8 shadow-[10px_0_30px_rgba(0,0,0,0.02)] z-10", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-xs font-bold text-indigo-500 tracking-widest uppercase mb-1", children: "Araç Kutusu" }),
        /* @__PURE__ */ e.jsx("p", { className: "text-2xl font-extrabold tracking-tight text-slate-900 border-b-2 border-indigo-100 pb-4 inline-block", children: "Yapı Taşları" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: h.map((t) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: () => m(t.type, t.defaultContent),
          disabled: i,
          className: "group flex items-center gap-4 w-full p-4 bg-white/70 border border-white rounded-[1.25rem] hover:bg-gradient-to-r hover:from-white hover:to-indigo-50/50 hover:border-indigo-100/80 shadow-sm hover:shadow-[0_8px_20px_rgba(99,102,241,0.08)] transition-all duration-300 ease-out hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed",
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "p-2.5 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 group-hover:from-indigo-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm", children: /* @__PURE__ */ e.jsx(S, {}) }),
            /* @__PURE__ */ e.jsx("span", { className: "font-bold text-[15px] text-slate-700 group-hover:text-indigo-950 transition-colors", children: t.label })
          ]
        },
        t.type
      )) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "relative flex-1 p-12 overflow-y-auto z-10 scroll-smooth", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-center max-w-4xl mx-auto mb-12", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[2.5rem] leading-tight font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500", children: "Dinamik Şablon Motoru" }),
          /* @__PURE__ */ e.jsxs("p", { className: "text-slate-500 font-semibold mt-2 flex items-center gap-2", children: [
            /* @__PURE__ */ e.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }),
            " Sistemi inşa eden gelecek nesil arayüz"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: f,
            disabled: i,
            className: "relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-2xl group bg-gradient-to-br from-indigo-500 to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-indigo-300 hover:shadow-[0_10px_25px_rgba(99,102,241,0.3)] transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:cursor-not-allowed",
            children: /* @__PURE__ */ e.jsx("span", { className: "relative px-8 py-3.5 transition-all ease-in duration-200 bg-white rounded-[14px] group-hover:bg-opacity-0 text-slate-800 group-hover:text-white font-bold tracking-wide text-[15px] flex items-center gap-2", children: i ? /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsxs("svg", { className: "animate-spin h-5 w-5 text-current inline-block mr-2", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ e.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ e.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
              ] }),
              "Kaydediliyor..."
            ] }) : "Taslağı Canlıya Al" })
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "max-w-4xl mx-auto bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white p-14 relative overflow-hidden group/canvas", children: [
        /* @__PURE__ */ e.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-bl-full -z-10 group-hover/canvas:scale-110 transition-transform duration-700" }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            className: "w-full text-5xl font-black bg-transparent border-none p-0 focus:ring-0 text-slate-900 placeholder-slate-300/80 mb-14 border-b-[3px] border-slate-100 hover:border-slate-200 focus:border-indigo-500 pb-5 transition-all focus:outline-none",
            value: o,
            onChange: (t) => u(t.target.value),
            placeholder: "Müşteri Formu Başlığı..."
          }
        ),
        l.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "text-center py-28 px-4 bg-slate-50/50 border-2 border-dashed border-slate-200/80 rounded-[2.5rem] animate-fade-in hover:bg-slate-50 hover:border-indigo-300/50 transition-all duration-500 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("div", { className: "inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-8", children: /* @__PURE__ */ e.jsx("svg", { className: "w-10 h-10 text-indigo-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ e.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }) }) }),
          /* @__PURE__ */ e.jsx("h3", { className: "text-3xl text-slate-800 font-extrabold mb-3 tracking-tight", children: "Ekrana bir şey sürükleyin" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-slate-400 font-semibold text-lg", children: "Mucize yaratmak için sol paneli kullanın." })
        ] }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-8", children: l.map((t, a) => /* @__PURE__ */ e.jsxs("div", { className: "group/block relative bg-white border border-slate-100/80 rounded-[2rem] p-10 hover:border-indigo-200 hover:shadow-[0_12px_40px_rgba(99,102,241,0.06)] transition-all duration-400 animate-fade-in hover:-translate-y-1", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "absolute -top-5 -right-5 hidden group-hover/block:flex items-center gap-2 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-2 z-20 animate-fade-in", children: [
            /* @__PURE__ */ e.jsx("button", { onClick: () => x(a, "up"), className: "p-2.5 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors", title: "Yukarı Taşı", children: /* @__PURE__ */ e.jsx(k, {}) }),
            /* @__PURE__ */ e.jsx("button", { onClick: () => x(a, "down"), className: "p-2.5 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors", title: "Aşağı Taşı", children: /* @__PURE__ */ e.jsx(N, {}) }),
            /* @__PURE__ */ e.jsx("div", { className: "w-px h-6 bg-slate-700 mx-1" }),
            /* @__PURE__ */ e.jsx("button", { onClick: () => b(t.id), className: "p-2.5 hover:bg-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-colors", title: "Bileşeni Sil", children: /* @__PURE__ */ e.jsx(y, {}) })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex gap-4 items-start", children: /* @__PURE__ */ e.jsxs("div", { className: "flex-1 w-full", children: [
            /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 uppercase tracking-widest border border-indigo-100/50", children: t.type }) }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "text",
                value: t.content,
                onChange: (r) => g(t.id, r.target.value),
                className: "w-full font-extrabold text-slate-800 border-none p-0 focus:ring-0 text-2xl focus:outline-none mb-2 bg-transparent placeholder-slate-300",
                placeholder: "Buraya sorunuzu yazın..."
              }
            )
          ] }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "mt-8 pt-8 border-t border-slate-100", children: [
            t.type === "TextInput" && /* @__PURE__ */ e.jsx("input", { type: "text", disabled: !0, className: "w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-5 text-slate-400 font-semibold text-[15px]", placeholder: "Kullanıcı metin girecek..." }),
            t.type === "Select" && /* @__PURE__ */ e.jsx("select", { disabled: !0, className: "w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-5 text-slate-400 font-semibold text-[15px] appearance-none", children: /* @__PURE__ */ e.jsx("option", { children: "Açılır liste görünümü..." }) }),
            t.type === "Rating" && /* @__PURE__ */ e.jsx("div", { className: "flex gap-4", children: [1, 2, 3, 4, 5].map((r) => /* @__PURE__ */ e.jsx("div", { className: "w-14 h-14 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-slate-300 font-black text-xl shadow-sm", children: r }, r)) }),
            t.type === "NumberInput" && /* @__PURE__ */ e.jsx("input", { type: "number", disabled: !0, className: "w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-5 text-slate-400 font-semibold text-[15px]", placeholder: "Sayısal Değer..." })
          ] })
        ] }, t.id)) })
      ] })
    ] })
  ] });
}, p = document.getElementById("dynamic-assets-app-root");
p && j(p).render(/* @__PURE__ */ e.jsx(C, {}));
