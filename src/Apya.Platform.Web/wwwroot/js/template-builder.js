var f0 = { exports: {} }, Xp = {}, d0 = { exports: {} }, gt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var KR;
function G_() {
  if (KR) return gt;
  KR = 1;
  var ne = Symbol.for("react.element"), Z = Symbol.for("react.portal"), A = Symbol.for("react.fragment"), wt = Symbol.for("react.strict_mode"), mt = Symbol.for("react.profiler"), yt = Symbol.for("react.provider"), S = Symbol.for("react.context"), Ft = Symbol.for("react.forward_ref"), fe = Symbol.for("react.suspense"), de = Symbol.for("react.memo"), et = Symbol.for("react.lazy"), ee = Symbol.iterator;
  function K(_) {
    return _ === null || typeof _ != "object" ? null : (_ = ee && _[ee] || _["@@iterator"], typeof _ == "function" ? _ : null);
  }
  var X = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, le = Object.assign, Qe = {};
  function st(_, V, Ve) {
    this.props = _, this.context = V, this.refs = Qe, this.updater = Ve || X;
  }
  st.prototype.isReactComponent = {}, st.prototype.setState = function(_, V) {
    if (typeof _ != "object" && typeof _ != "function" && _ != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, _, V, "setState");
  }, st.prototype.forceUpdate = function(_) {
    this.updater.enqueueForceUpdate(this, _, "forceUpdate");
  };
  function Jt() {
  }
  Jt.prototype = st.prototype;
  function pt(_, V, Ve) {
    this.props = _, this.context = V, this.refs = Qe, this.updater = Ve || X;
  }
  var We = pt.prototype = new Jt();
  We.constructor = pt, le(We, st.prototype), We.isPureReactComponent = !0;
  var vt = Array.isArray, ke = Object.prototype.hasOwnProperty, ct = { current: null }, He = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ln(_, V, Ve) {
    var je, it = {}, tt = null, Je = null;
    if (V != null) for (je in V.ref !== void 0 && (Je = V.ref), V.key !== void 0 && (tt = "" + V.key), V) ke.call(V, je) && !He.hasOwnProperty(je) && (it[je] = V[je]);
    var nt = arguments.length - 2;
    if (nt === 1) it.children = Ve;
    else if (1 < nt) {
      for (var lt = Array(nt), Bt = 0; Bt < nt; Bt++) lt[Bt] = arguments[Bt + 2];
      it.children = lt;
    }
    if (_ && _.defaultProps) for (je in nt = _.defaultProps, nt) it[je] === void 0 && (it[je] = nt[je]);
    return { $$typeof: ne, type: _, key: tt, ref: Je, props: it, _owner: ct.current };
  }
  function Ht(_, V) {
    return { $$typeof: ne, type: _.type, key: V, ref: _.ref, props: _.props, _owner: _._owner };
  }
  function Zt(_) {
    return typeof _ == "object" && _ !== null && _.$$typeof === ne;
  }
  function un(_) {
    var V = { "=": "=0", ":": "=2" };
    return "$" + _.replace(/[=:]/g, function(Ve) {
      return V[Ve];
    });
  }
  var bt = /\/+/g;
  function Le(_, V) {
    return typeof _ == "object" && _ !== null && _.key != null ? un("" + _.key) : V.toString(36);
  }
  function At(_, V, Ve, je, it) {
    var tt = typeof _;
    (tt === "undefined" || tt === "boolean") && (_ = null);
    var Je = !1;
    if (_ === null) Je = !0;
    else switch (tt) {
      case "string":
      case "number":
        Je = !0;
        break;
      case "object":
        switch (_.$$typeof) {
          case ne:
          case Z:
            Je = !0;
        }
    }
    if (Je) return Je = _, it = it(Je), _ = je === "" ? "." + Le(Je, 0) : je, vt(it) ? (Ve = "", _ != null && (Ve = _.replace(bt, "$&/") + "/"), At(it, V, Ve, "", function(Bt) {
      return Bt;
    })) : it != null && (Zt(it) && (it = Ht(it, Ve + (!it.key || Je && Je.key === it.key ? "" : ("" + it.key).replace(bt, "$&/") + "/") + _)), V.push(it)), 1;
    if (Je = 0, je = je === "" ? "." : je + ":", vt(_)) for (var nt = 0; nt < _.length; nt++) {
      tt = _[nt];
      var lt = je + Le(tt, nt);
      Je += At(tt, V, Ve, lt, it);
    }
    else if (lt = K(_), typeof lt == "function") for (_ = lt.call(_), nt = 0; !(tt = _.next()).done; ) tt = tt.value, lt = je + Le(tt, nt++), Je += At(tt, V, Ve, lt, it);
    else if (tt === "object") throw V = String(_), Error("Objects are not valid as a React child (found: " + (V === "[object Object]" ? "object with keys {" + Object.keys(_).join(", ") + "}" : V) + "). If you meant to render a collection of children, use an array instead.");
    return Je;
  }
  function _t(_, V, Ve) {
    if (_ == null) return _;
    var je = [], it = 0;
    return At(_, je, "", "", function(tt) {
      return V.call(Ve, tt, it++);
    }), je;
  }
  function Dt(_) {
    if (_._status === -1) {
      var V = _._result;
      V = V(), V.then(function(Ve) {
        (_._status === 0 || _._status === -1) && (_._status = 1, _._result = Ve);
      }, function(Ve) {
        (_._status === 0 || _._status === -1) && (_._status = 2, _._result = Ve);
      }), _._status === -1 && (_._status = 0, _._result = V);
    }
    if (_._status === 1) return _._result.default;
    throw _._result;
  }
  var Te = { current: null }, J = { transition: null }, xe = { ReactCurrentDispatcher: Te, ReactCurrentBatchConfig: J, ReactCurrentOwner: ct };
  function ae() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return gt.Children = { map: _t, forEach: function(_, V, Ve) {
    _t(_, function() {
      V.apply(this, arguments);
    }, Ve);
  }, count: function(_) {
    var V = 0;
    return _t(_, function() {
      V++;
    }), V;
  }, toArray: function(_) {
    return _t(_, function(V) {
      return V;
    }) || [];
  }, only: function(_) {
    if (!Zt(_)) throw Error("React.Children.only expected to receive a single React element child.");
    return _;
  } }, gt.Component = st, gt.Fragment = A, gt.Profiler = mt, gt.PureComponent = pt, gt.StrictMode = wt, gt.Suspense = fe, gt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = xe, gt.act = ae, gt.cloneElement = function(_, V, Ve) {
    if (_ == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + _ + ".");
    var je = le({}, _.props), it = _.key, tt = _.ref, Je = _._owner;
    if (V != null) {
      if (V.ref !== void 0 && (tt = V.ref, Je = ct.current), V.key !== void 0 && (it = "" + V.key), _.type && _.type.defaultProps) var nt = _.type.defaultProps;
      for (lt in V) ke.call(V, lt) && !He.hasOwnProperty(lt) && (je[lt] = V[lt] === void 0 && nt !== void 0 ? nt[lt] : V[lt]);
    }
    var lt = arguments.length - 2;
    if (lt === 1) je.children = Ve;
    else if (1 < lt) {
      nt = Array(lt);
      for (var Bt = 0; Bt < lt; Bt++) nt[Bt] = arguments[Bt + 2];
      je.children = nt;
    }
    return { $$typeof: ne, type: _.type, key: it, ref: tt, props: je, _owner: Je };
  }, gt.createContext = function(_) {
    return _ = { $$typeof: S, _currentValue: _, _currentValue2: _, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, _.Provider = { $$typeof: yt, _context: _ }, _.Consumer = _;
  }, gt.createElement = ln, gt.createFactory = function(_) {
    var V = ln.bind(null, _);
    return V.type = _, V;
  }, gt.createRef = function() {
    return { current: null };
  }, gt.forwardRef = function(_) {
    return { $$typeof: Ft, render: _ };
  }, gt.isValidElement = Zt, gt.lazy = function(_) {
    return { $$typeof: et, _payload: { _status: -1, _result: _ }, _init: Dt };
  }, gt.memo = function(_, V) {
    return { $$typeof: de, type: _, compare: V === void 0 ? null : V };
  }, gt.startTransition = function(_) {
    var V = J.transition;
    J.transition = {};
    try {
      _();
    } finally {
      J.transition = V;
    }
  }, gt.unstable_act = ae, gt.useCallback = function(_, V) {
    return Te.current.useCallback(_, V);
  }, gt.useContext = function(_) {
    return Te.current.useContext(_);
  }, gt.useDebugValue = function() {
  }, gt.useDeferredValue = function(_) {
    return Te.current.useDeferredValue(_);
  }, gt.useEffect = function(_, V) {
    return Te.current.useEffect(_, V);
  }, gt.useId = function() {
    return Te.current.useId();
  }, gt.useImperativeHandle = function(_, V, Ve) {
    return Te.current.useImperativeHandle(_, V, Ve);
  }, gt.useInsertionEffect = function(_, V) {
    return Te.current.useInsertionEffect(_, V);
  }, gt.useLayoutEffect = function(_, V) {
    return Te.current.useLayoutEffect(_, V);
  }, gt.useMemo = function(_, V) {
    return Te.current.useMemo(_, V);
  }, gt.useReducer = function(_, V, Ve) {
    return Te.current.useReducer(_, V, Ve);
  }, gt.useRef = function(_) {
    return Te.current.useRef(_);
  }, gt.useState = function(_) {
    return Te.current.useState(_);
  }, gt.useSyncExternalStore = function(_, V, Ve) {
    return Te.current.useSyncExternalStore(_, V, Ve);
  }, gt.useTransition = function() {
    return Te.current.useTransition();
  }, gt.version = "18.3.1", gt;
}
var Zp = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Zp.exports;
var qR;
function K_() {
  return qR || (qR = 1, function(ne, Z) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var A = "18.3.1", wt = Symbol.for("react.element"), mt = Symbol.for("react.portal"), yt = Symbol.for("react.fragment"), S = Symbol.for("react.strict_mode"), Ft = Symbol.for("react.profiler"), fe = Symbol.for("react.provider"), de = Symbol.for("react.context"), et = Symbol.for("react.forward_ref"), ee = Symbol.for("react.suspense"), K = Symbol.for("react.suspense_list"), X = Symbol.for("react.memo"), le = Symbol.for("react.lazy"), Qe = Symbol.for("react.offscreen"), st = Symbol.iterator, Jt = "@@iterator";
      function pt(h) {
        if (h === null || typeof h != "object")
          return null;
        var C = st && h[st] || h[Jt];
        return typeof C == "function" ? C : null;
      }
      var We = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, vt = {
        transition: null
      }, ke = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, ct = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, He = {}, ln = null;
      function Ht(h) {
        ln = h;
      }
      He.setExtraStackFrame = function(h) {
        ln = h;
      }, He.getCurrentStack = null, He.getStackAddendum = function() {
        var h = "";
        ln && (h += ln);
        var C = He.getCurrentStack;
        return C && (h += C() || ""), h;
      };
      var Zt = !1, un = !1, bt = !1, Le = !1, At = !1, _t = {
        ReactCurrentDispatcher: We,
        ReactCurrentBatchConfig: vt,
        ReactCurrentOwner: ct
      };
      _t.ReactDebugCurrentFrame = He, _t.ReactCurrentActQueue = ke;
      function Dt(h) {
        {
          for (var C = arguments.length, M = new Array(C > 1 ? C - 1 : 0), j = 1; j < C; j++)
            M[j - 1] = arguments[j];
          J("warn", h, M);
        }
      }
      function Te(h) {
        {
          for (var C = arguments.length, M = new Array(C > 1 ? C - 1 : 0), j = 1; j < C; j++)
            M[j - 1] = arguments[j];
          J("error", h, M);
        }
      }
      function J(h, C, M) {
        {
          var j = _t.ReactDebugCurrentFrame, q = j.getStackAddendum();
          q !== "" && (C += "%s", M = M.concat([q]));
          var Ne = M.map(function(ie) {
            return String(ie);
          });
          Ne.unshift("Warning: " + C), Function.prototype.apply.call(console[h], console, Ne);
        }
      }
      var xe = {};
      function ae(h, C) {
        {
          var M = h.constructor, j = M && (M.displayName || M.name) || "ReactClass", q = j + "." + C;
          if (xe[q])
            return;
          Te("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", C, j), xe[q] = !0;
        }
      }
      var _ = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(h) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(h, C, M) {
          ae(h, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(h, C, M, j) {
          ae(h, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(h, C, M, j) {
          ae(h, "setState");
        }
      }, V = Object.assign, Ve = {};
      Object.freeze(Ve);
      function je(h, C, M) {
        this.props = h, this.context = C, this.refs = Ve, this.updater = M || _;
      }
      je.prototype.isReactComponent = {}, je.prototype.setState = function(h, C) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, C, "setState");
      }, je.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var it = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, tt = function(h, C) {
          Object.defineProperty(je.prototype, h, {
            get: function() {
              Dt("%s(...) is deprecated in plain JavaScript React classes. %s", C[0], C[1]);
            }
          });
        };
        for (var Je in it)
          it.hasOwnProperty(Je) && tt(Je, it[Je]);
      }
      function nt() {
      }
      nt.prototype = je.prototype;
      function lt(h, C, M) {
        this.props = h, this.context = C, this.refs = Ve, this.updater = M || _;
      }
      var Bt = lt.prototype = new nt();
      Bt.constructor = lt, V(Bt, je.prototype), Bt.isPureReactComponent = !0;
      function On() {
        var h = {
          current: null
        };
        return Object.seal(h), h;
      }
      var wr = Array.isArray;
      function Cn(h) {
        return wr(h);
      }
      function nr(h) {
        {
          var C = typeof Symbol == "function" && Symbol.toStringTag, M = C && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return M;
        }
      }
      function Pn(h) {
        try {
          return Bn(h), !1;
        } catch {
          return !0;
        }
      }
      function Bn(h) {
        return "" + h;
      }
      function Yr(h) {
        if (Pn(h))
          return Te("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", nr(h)), Bn(h);
      }
      function si(h, C, M) {
        var j = h.displayName;
        if (j)
          return j;
        var q = C.displayName || C.name || "";
        return q !== "" ? M + "(" + q + ")" : M;
      }
      function oa(h) {
        return h.displayName || "Context";
      }
      function Kn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && Te("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case yt:
            return "Fragment";
          case mt:
            return "Portal";
          case Ft:
            return "Profiler";
          case S:
            return "StrictMode";
          case ee:
            return "Suspense";
          case K:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case de:
              var C = h;
              return oa(C) + ".Consumer";
            case fe:
              var M = h;
              return oa(M._context) + ".Provider";
            case et:
              return si(h, h.render, "ForwardRef");
            case X:
              var j = h.displayName || null;
              return j !== null ? j : Kn(h.type) || "Memo";
            case le: {
              var q = h, Ne = q._payload, ie = q._init;
              try {
                return Kn(ie(Ne));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var Rn = Object.prototype.hasOwnProperty, In = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, gr, Ya, Ln;
      Ln = {};
      function Sr(h) {
        if (Rn.call(h, "ref")) {
          var C = Object.getOwnPropertyDescriptor(h, "ref").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.ref !== void 0;
      }
      function sa(h) {
        if (Rn.call(h, "key")) {
          var C = Object.getOwnPropertyDescriptor(h, "key").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.key !== void 0;
      }
      function $a(h, C) {
        var M = function() {
          gr || (gr = !0, Te("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        M.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: M,
          configurable: !0
        });
      }
      function ci(h, C) {
        var M = function() {
          Ya || (Ya = !0, Te("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        M.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: M,
          configurable: !0
        });
      }
      function te(h) {
        if (typeof h.ref == "string" && ct.current && h.__self && ct.current.stateNode !== h.__self) {
          var C = Kn(ct.current.type);
          Ln[C] || (Te('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', C, h.ref), Ln[C] = !0);
        }
      }
      var we = function(h, C, M, j, q, Ne, ie) {
        var Ue = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: wt,
          // Built-in properties that belong on the element
          type: h,
          key: C,
          ref: M,
          props: ie,
          // Record the component responsible for creating this element.
          _owner: Ne
        };
        return Ue._store = {}, Object.defineProperty(Ue._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(Ue, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: j
        }), Object.defineProperty(Ue, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: q
        }), Object.freeze && (Object.freeze(Ue.props), Object.freeze(Ue)), Ue;
      };
      function rt(h, C, M) {
        var j, q = {}, Ne = null, ie = null, Ue = null, dt = null;
        if (C != null) {
          Sr(C) && (ie = C.ref, te(C)), sa(C) && (Yr(C.key), Ne = "" + C.key), Ue = C.__self === void 0 ? null : C.__self, dt = C.__source === void 0 ? null : C.__source;
          for (j in C)
            Rn.call(C, j) && !In.hasOwnProperty(j) && (q[j] = C[j]);
        }
        var xt = arguments.length - 2;
        if (xt === 1)
          q.children = M;
        else if (xt > 1) {
          for (var rn = Array(xt), Qt = 0; Qt < xt; Qt++)
            rn[Qt] = arguments[Qt + 2];
          Object.freeze && Object.freeze(rn), q.children = rn;
        }
        if (h && h.defaultProps) {
          var at = h.defaultProps;
          for (j in at)
            q[j] === void 0 && (q[j] = at[j]);
        }
        if (Ne || ie) {
          var Wt = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          Ne && $a(q, Wt), ie && ci(q, Wt);
        }
        return we(h, Ne, ie, Ue, dt, ct.current, q);
      }
      function jt(h, C) {
        var M = we(h.type, C, h.ref, h._self, h._source, h._owner, h.props);
        return M;
      }
      function en(h, C, M) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var j, q = V({}, h.props), Ne = h.key, ie = h.ref, Ue = h._self, dt = h._source, xt = h._owner;
        if (C != null) {
          Sr(C) && (ie = C.ref, xt = ct.current), sa(C) && (Yr(C.key), Ne = "" + C.key);
          var rn;
          h.type && h.type.defaultProps && (rn = h.type.defaultProps);
          for (j in C)
            Rn.call(C, j) && !In.hasOwnProperty(j) && (C[j] === void 0 && rn !== void 0 ? q[j] = rn[j] : q[j] = C[j]);
        }
        var Qt = arguments.length - 2;
        if (Qt === 1)
          q.children = M;
        else if (Qt > 1) {
          for (var at = Array(Qt), Wt = 0; Wt < Qt; Wt++)
            at[Wt] = arguments[Wt + 2];
          q.children = at;
        }
        return we(h.type, Ne, ie, Ue, dt, xt, q);
      }
      function vn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === wt;
      }
      var on = ".", qn = ":";
      function tn(h) {
        var C = /[=:]/g, M = {
          "=": "=0",
          ":": "=2"
        }, j = h.replace(C, function(q) {
          return M[q];
        });
        return "$" + j;
      }
      var It = !1, Yt = /\/+/g;
      function ca(h) {
        return h.replace(Yt, "$&/");
      }
      function Er(h, C) {
        return typeof h == "object" && h !== null && h.key != null ? (Yr(h.key), tn("" + h.key)) : C.toString(36);
      }
      function Ta(h, C, M, j, q) {
        var Ne = typeof h;
        (Ne === "undefined" || Ne === "boolean") && (h = null);
        var ie = !1;
        if (h === null)
          ie = !0;
        else
          switch (Ne) {
            case "string":
            case "number":
              ie = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case wt:
                case mt:
                  ie = !0;
              }
          }
        if (ie) {
          var Ue = h, dt = q(Ue), xt = j === "" ? on + Er(Ue, 0) : j;
          if (Cn(dt)) {
            var rn = "";
            xt != null && (rn = ca(xt) + "/"), Ta(dt, C, rn, "", function(Kf) {
              return Kf;
            });
          } else dt != null && (vn(dt) && (dt.key && (!Ue || Ue.key !== dt.key) && Yr(dt.key), dt = jt(
            dt,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            M + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (dt.key && (!Ue || Ue.key !== dt.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              ca("" + dt.key) + "/"
            ) : "") + xt
          )), C.push(dt));
          return 1;
        }
        var Qt, at, Wt = 0, hn = j === "" ? on : j + qn;
        if (Cn(h))
          for (var Cl = 0; Cl < h.length; Cl++)
            Qt = h[Cl], at = hn + Er(Qt, Cl), Wt += Ta(Qt, C, M, at, q);
        else {
          var Go = pt(h);
          if (typeof Go == "function") {
            var Pi = h;
            Go === Pi.entries && (It || Dt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), It = !0);
            for (var Ko = Go.call(Pi), uu, Gf = 0; !(uu = Ko.next()).done; )
              Qt = uu.value, at = hn + Er(Qt, Gf++), Wt += Ta(Qt, C, M, at, q);
          } else if (Ne === "object") {
            var oc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (oc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : oc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Wt;
      }
      function Fi(h, C, M) {
        if (h == null)
          return h;
        var j = [], q = 0;
        return Ta(h, j, "", "", function(Ne) {
          return C.call(M, Ne, q++);
        }), j;
      }
      function Jl(h) {
        var C = 0;
        return Fi(h, function() {
          C++;
        }), C;
      }
      function Zl(h, C, M) {
        Fi(h, function() {
          C.apply(this, arguments);
        }, M);
      }
      function dl(h) {
        return Fi(h, function(C) {
          return C;
        }) || [];
      }
      function pl(h) {
        if (!vn(h))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return h;
      }
      function eu(h) {
        var C = {
          $$typeof: de,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: h,
          _currentValue2: h,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        C.Provider = {
          $$typeof: fe,
          _context: C
        };
        var M = !1, j = !1, q = !1;
        {
          var Ne = {
            $$typeof: de,
            _context: C
          };
          Object.defineProperties(Ne, {
            Provider: {
              get: function() {
                return j || (j = !0, Te("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), C.Provider;
              },
              set: function(ie) {
                C.Provider = ie;
              }
            },
            _currentValue: {
              get: function() {
                return C._currentValue;
              },
              set: function(ie) {
                C._currentValue = ie;
              }
            },
            _currentValue2: {
              get: function() {
                return C._currentValue2;
              },
              set: function(ie) {
                C._currentValue2 = ie;
              }
            },
            _threadCount: {
              get: function() {
                return C._threadCount;
              },
              set: function(ie) {
                C._threadCount = ie;
              }
            },
            Consumer: {
              get: function() {
                return M || (M = !0, Te("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), C.Consumer;
              }
            },
            displayName: {
              get: function() {
                return C.displayName;
              },
              set: function(ie) {
                q || (Dt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", ie), q = !0);
              }
            }
          }), C.Consumer = Ne;
        }
        return C._currentRenderer = null, C._currentRenderer2 = null, C;
      }
      var br = -1, _r = 0, rr = 1, fi = 2;
      function Qa(h) {
        if (h._status === br) {
          var C = h._result, M = C();
          if (M.then(function(Ne) {
            if (h._status === _r || h._status === br) {
              var ie = h;
              ie._status = rr, ie._result = Ne;
            }
          }, function(Ne) {
            if (h._status === _r || h._status === br) {
              var ie = h;
              ie._status = fi, ie._result = Ne;
            }
          }), h._status === br) {
            var j = h;
            j._status = _r, j._result = M;
          }
        }
        if (h._status === rr) {
          var q = h._result;
          return q === void 0 && Te(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, q), "default" in q || Te(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, q), q.default;
        } else
          throw h._result;
      }
      function di(h) {
        var C = {
          // We use these fields to store the result.
          _status: br,
          _result: h
        }, M = {
          $$typeof: le,
          _payload: C,
          _init: Qa
        };
        {
          var j, q;
          Object.defineProperties(M, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return j;
              },
              set: function(Ne) {
                Te("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), j = Ne, Object.defineProperty(M, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return q;
              },
              set: function(Ne) {
                Te("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), q = Ne, Object.defineProperty(M, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return M;
      }
      function pi(h) {
        h != null && h.$$typeof === X ? Te("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? Te("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && Te("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && Te("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var C = {
          $$typeof: et,
          render: h
        };
        {
          var M;
          Object.defineProperty(C, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return M;
            },
            set: function(j) {
              M = j, !h.name && !h.displayName && (h.displayName = j);
            }
          });
        }
        return C;
      }
      var R;
      R = Symbol.for("react.module.reference");
      function B(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === yt || h === Ft || At || h === S || h === ee || h === K || Le || h === Qe || Zt || un || bt || typeof h == "object" && h !== null && (h.$$typeof === le || h.$$typeof === X || h.$$typeof === fe || h.$$typeof === de || h.$$typeof === et || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === R || h.getModuleId !== void 0));
      }
      function ue(h, C) {
        B(h) || Te("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var M = {
          $$typeof: X,
          type: h,
          compare: C === void 0 ? null : C
        };
        {
          var j;
          Object.defineProperty(M, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return j;
            },
            set: function(q) {
              j = q, !h.name && !h.displayName && (h.displayName = q);
            }
          });
        }
        return M;
      }
      function ye() {
        var h = We.current;
        return h === null && Te(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function Ke(h) {
        var C = ye();
        if (h._context !== void 0) {
          var M = h._context;
          M.Consumer === h ? Te("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : M.Provider === h && Te("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return C.useContext(h);
      }
      function Ye(h) {
        var C = ye();
        return C.useState(h);
      }
      function ft(h, C, M) {
        var j = ye();
        return j.useReducer(h, C, M);
      }
      function ut(h) {
        var C = ye();
        return C.useRef(h);
      }
      function Tn(h, C) {
        var M = ye();
        return M.useEffect(h, C);
      }
      function nn(h, C) {
        var M = ye();
        return M.useInsertionEffect(h, C);
      }
      function sn(h, C) {
        var M = ye();
        return M.useLayoutEffect(h, C);
      }
      function ar(h, C) {
        var M = ye();
        return M.useCallback(h, C);
      }
      function Wa(h, C) {
        var M = ye();
        return M.useMemo(h, C);
      }
      function Ga(h, C, M) {
        var j = ye();
        return j.useImperativeHandle(h, C, M);
      }
      function qe(h, C) {
        {
          var M = ye();
          return M.useDebugValue(h, C);
        }
      }
      function Ze() {
        var h = ye();
        return h.useTransition();
      }
      function Ka(h) {
        var C = ye();
        return C.useDeferredValue(h);
      }
      function tu() {
        var h = ye();
        return h.useId();
      }
      function nu(h, C, M) {
        var j = ye();
        return j.useSyncExternalStore(h, C, M);
      }
      var vl = 0, Qu, hl, $r, Yo, kr, lc, uc;
      function Wu() {
      }
      Wu.__reactDisabledLog = !0;
      function ml() {
        {
          if (vl === 0) {
            Qu = console.log, hl = console.info, $r = console.warn, Yo = console.error, kr = console.group, lc = console.groupCollapsed, uc = console.groupEnd;
            var h = {
              configurable: !0,
              enumerable: !0,
              value: Wu,
              writable: !0
            };
            Object.defineProperties(console, {
              info: h,
              log: h,
              warn: h,
              error: h,
              group: h,
              groupCollapsed: h,
              groupEnd: h
            });
          }
          vl++;
        }
      }
      function fa() {
        {
          if (vl--, vl === 0) {
            var h = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: V({}, h, {
                value: Qu
              }),
              info: V({}, h, {
                value: hl
              }),
              warn: V({}, h, {
                value: $r
              }),
              error: V({}, h, {
                value: Yo
              }),
              group: V({}, h, {
                value: kr
              }),
              groupCollapsed: V({}, h, {
                value: lc
              }),
              groupEnd: V({}, h, {
                value: uc
              })
            });
          }
          vl < 0 && Te("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var qa = _t.ReactCurrentDispatcher, Xa;
      function Gu(h, C, M) {
        {
          if (Xa === void 0)
            try {
              throw Error();
            } catch (q) {
              var j = q.stack.trim().match(/\n( *(at )?)/);
              Xa = j && j[1] || "";
            }
          return `
` + Xa + h;
        }
      }
      var ru = !1, yl;
      {
        var Ku = typeof WeakMap == "function" ? WeakMap : Map;
        yl = new Ku();
      }
      function qu(h, C) {
        if (!h || ru)
          return "";
        {
          var M = yl.get(h);
          if (M !== void 0)
            return M;
        }
        var j;
        ru = !0;
        var q = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Ne;
        Ne = qa.current, qa.current = null, ml();
        try {
          if (C) {
            var ie = function() {
              throw Error();
            };
            if (Object.defineProperty(ie.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(ie, []);
              } catch (hn) {
                j = hn;
              }
              Reflect.construct(h, [], ie);
            } else {
              try {
                ie.call();
              } catch (hn) {
                j = hn;
              }
              h.call(ie.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (hn) {
              j = hn;
            }
            h();
          }
        } catch (hn) {
          if (hn && j && typeof hn.stack == "string") {
            for (var Ue = hn.stack.split(`
`), dt = j.stack.split(`
`), xt = Ue.length - 1, rn = dt.length - 1; xt >= 1 && rn >= 0 && Ue[xt] !== dt[rn]; )
              rn--;
            for (; xt >= 1 && rn >= 0; xt--, rn--)
              if (Ue[xt] !== dt[rn]) {
                if (xt !== 1 || rn !== 1)
                  do
                    if (xt--, rn--, rn < 0 || Ue[xt] !== dt[rn]) {
                      var Qt = `
` + Ue[xt].replace(" at new ", " at ");
                      return h.displayName && Qt.includes("<anonymous>") && (Qt = Qt.replace("<anonymous>", h.displayName)), typeof h == "function" && yl.set(h, Qt), Qt;
                    }
                  while (xt >= 1 && rn >= 0);
                break;
              }
          }
        } finally {
          ru = !1, qa.current = Ne, fa(), Error.prepareStackTrace = q;
        }
        var at = h ? h.displayName || h.name : "", Wt = at ? Gu(at) : "";
        return typeof h == "function" && yl.set(h, Wt), Wt;
      }
      function Hi(h, C, M) {
        return qu(h, !1);
      }
      function Qf(h) {
        var C = h.prototype;
        return !!(C && C.isReactComponent);
      }
      function Vi(h, C, M) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return qu(h, Qf(h));
        if (typeof h == "string")
          return Gu(h);
        switch (h) {
          case ee:
            return Gu("Suspense");
          case K:
            return Gu("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case et:
              return Hi(h.render);
            case X:
              return Vi(h.type, C, M);
            case le: {
              var j = h, q = j._payload, Ne = j._init;
              try {
                return Vi(Ne(q), C, M);
              } catch {
              }
            }
          }
        return "";
      }
      var Ot = {}, Xu = _t.ReactDebugCurrentFrame;
      function Tt(h) {
        if (h) {
          var C = h._owner, M = Vi(h.type, h._source, C ? C.type : null);
          Xu.setExtraStackFrame(M);
        } else
          Xu.setExtraStackFrame(null);
      }
      function $o(h, C, M, j, q) {
        {
          var Ne = Function.call.bind(Rn);
          for (var ie in h)
            if (Ne(h, ie)) {
              var Ue = void 0;
              try {
                if (typeof h[ie] != "function") {
                  var dt = Error((j || "React class") + ": " + M + " type `" + ie + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[ie] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw dt.name = "Invariant Violation", dt;
                }
                Ue = h[ie](C, ie, j, M, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (xt) {
                Ue = xt;
              }
              Ue && !(Ue instanceof Error) && (Tt(q), Te("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", j || "React class", M, ie, typeof Ue), Tt(null)), Ue instanceof Error && !(Ue.message in Ot) && (Ot[Ue.message] = !0, Tt(q), Te("Failed %s type: %s", M, Ue.message), Tt(null));
            }
        }
      }
      function vi(h) {
        if (h) {
          var C = h._owner, M = Vi(h.type, h._source, C ? C.type : null);
          Ht(M);
        } else
          Ht(null);
      }
      var Ie;
      Ie = !1;
      function Ju() {
        if (ct.current) {
          var h = Kn(ct.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function ir(h) {
        if (h !== void 0) {
          var C = h.fileName.replace(/^.*[\\\/]/, ""), M = h.lineNumber;
          return `

Check your code at ` + C + ":" + M + ".";
        }
        return "";
      }
      function hi(h) {
        return h != null ? ir(h.__source) : "";
      }
      var Dr = {};
      function mi(h) {
        var C = Ju();
        if (!C) {
          var M = typeof h == "string" ? h : h.displayName || h.name;
          M && (C = `

Check the top-level render call using <` + M + ">.");
        }
        return C;
      }
      function cn(h, C) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var M = mi(C);
          if (!Dr[M]) {
            Dr[M] = !0;
            var j = "";
            h && h._owner && h._owner !== ct.current && (j = " It was passed a child from " + Kn(h._owner.type) + "."), vi(h), Te('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', M, j), vi(null);
          }
        }
      }
      function $t(h, C) {
        if (typeof h == "object") {
          if (Cn(h))
            for (var M = 0; M < h.length; M++) {
              var j = h[M];
              vn(j) && cn(j, C);
            }
          else if (vn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var q = pt(h);
            if (typeof q == "function" && q !== h.entries)
              for (var Ne = q.call(h), ie; !(ie = Ne.next()).done; )
                vn(ie.value) && cn(ie.value, C);
          }
        }
      }
      function gl(h) {
        {
          var C = h.type;
          if (C == null || typeof C == "string")
            return;
          var M;
          if (typeof C == "function")
            M = C.propTypes;
          else if (typeof C == "object" && (C.$$typeof === et || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          C.$$typeof === X))
            M = C.propTypes;
          else
            return;
          if (M) {
            var j = Kn(C);
            $o(M, h.props, "prop", j, h);
          } else if (C.PropTypes !== void 0 && !Ie) {
            Ie = !0;
            var q = Kn(C);
            Te("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", q || "Unknown");
          }
          typeof C.getDefaultProps == "function" && !C.getDefaultProps.isReactClassApproved && Te("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Yn(h) {
        {
          for (var C = Object.keys(h.props), M = 0; M < C.length; M++) {
            var j = C[M];
            if (j !== "children" && j !== "key") {
              vi(h), Te("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", j), vi(null);
              break;
            }
          }
          h.ref !== null && (vi(h), Te("Invalid attribute `ref` supplied to `React.Fragment`."), vi(null));
        }
      }
      function Or(h, C, M) {
        var j = B(h);
        if (!j) {
          var q = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (q += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Ne = hi(C);
          Ne ? q += Ne : q += Ju();
          var ie;
          h === null ? ie = "null" : Cn(h) ? ie = "array" : h !== void 0 && h.$$typeof === wt ? (ie = "<" + (Kn(h.type) || "Unknown") + " />", q = " Did you accidentally export a JSX literal instead of a component?") : ie = typeof h, Te("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ie, q);
        }
        var Ue = rt.apply(this, arguments);
        if (Ue == null)
          return Ue;
        if (j)
          for (var dt = 2; dt < arguments.length; dt++)
            $t(arguments[dt], h);
        return h === yt ? Yn(Ue) : gl(Ue), Ue;
      }
      var xa = !1;
      function au(h) {
        var C = Or.bind(null, h);
        return C.type = h, xa || (xa = !0, Dt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(C, "type", {
          enumerable: !1,
          get: function() {
            return Dt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), C;
      }
      function Qo(h, C, M) {
        for (var j = en.apply(this, arguments), q = 2; q < arguments.length; q++)
          $t(arguments[q], j.type);
        return gl(j), j;
      }
      function Wo(h, C) {
        var M = vt.transition;
        vt.transition = {};
        var j = vt.transition;
        vt.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (vt.transition = M, M === null && j._updatedFibers) {
            var q = j._updatedFibers.size;
            q > 10 && Dt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), j._updatedFibers.clear();
          }
        }
      }
      var Sl = !1, iu = null;
      function Wf(h) {
        if (iu === null)
          try {
            var C = ("require" + Math.random()).slice(0, 7), M = ne && ne[C];
            iu = M.call(ne, "timers").setImmediate;
          } catch {
            iu = function(q) {
              Sl === !1 && (Sl = !0, typeof MessageChannel > "u" && Te("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Ne = new MessageChannel();
              Ne.port1.onmessage = q, Ne.port2.postMessage(void 0);
            };
          }
        return iu(h);
      }
      var wa = 0, Ja = !1;
      function yi(h) {
        {
          var C = wa;
          wa++, ke.current === null && (ke.current = []);
          var M = ke.isBatchingLegacy, j;
          try {
            if (ke.isBatchingLegacy = !0, j = h(), !M && ke.didScheduleLegacyUpdate) {
              var q = ke.current;
              q !== null && (ke.didScheduleLegacyUpdate = !1, El(q));
            }
          } catch (at) {
            throw ba(C), at;
          } finally {
            ke.isBatchingLegacy = M;
          }
          if (j !== null && typeof j == "object" && typeof j.then == "function") {
            var Ne = j, ie = !1, Ue = {
              then: function(at, Wt) {
                ie = !0, Ne.then(function(hn) {
                  ba(C), wa === 0 ? Zu(hn, at, Wt) : at(hn);
                }, function(hn) {
                  ba(C), Wt(hn);
                });
              }
            };
            return !Ja && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              ie || (Ja = !0, Te("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), Ue;
          } else {
            var dt = j;
            if (ba(C), wa === 0) {
              var xt = ke.current;
              xt !== null && (El(xt), ke.current = null);
              var rn = {
                then: function(at, Wt) {
                  ke.current === null ? (ke.current = [], Zu(dt, at, Wt)) : at(dt);
                }
              };
              return rn;
            } else {
              var Qt = {
                then: function(at, Wt) {
                  at(dt);
                }
              };
              return Qt;
            }
          }
        }
      }
      function ba(h) {
        h !== wa - 1 && Te("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), wa = h;
      }
      function Zu(h, C, M) {
        {
          var j = ke.current;
          if (j !== null)
            try {
              El(j), Wf(function() {
                j.length === 0 ? (ke.current = null, C(h)) : Zu(h, C, M);
              });
            } catch (q) {
              M(q);
            }
          else
            C(h);
        }
      }
      var eo = !1;
      function El(h) {
        if (!eo) {
          eo = !0;
          var C = 0;
          try {
            for (; C < h.length; C++) {
              var M = h[C];
              do
                M = M(!0);
              while (M !== null);
            }
            h.length = 0;
          } catch (j) {
            throw h = h.slice(C + 1), j;
          } finally {
            eo = !1;
          }
        }
      }
      var lu = Or, to = Qo, no = au, Za = {
        map: Fi,
        forEach: Zl,
        count: Jl,
        toArray: dl,
        only: pl
      };
      Z.Children = Za, Z.Component = je, Z.Fragment = yt, Z.Profiler = Ft, Z.PureComponent = lt, Z.StrictMode = S, Z.Suspense = ee, Z.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = _t, Z.act = yi, Z.cloneElement = to, Z.createContext = eu, Z.createElement = lu, Z.createFactory = no, Z.createRef = On, Z.forwardRef = pi, Z.isValidElement = vn, Z.lazy = di, Z.memo = ue, Z.startTransition = Wo, Z.unstable_act = yi, Z.useCallback = ar, Z.useContext = Ke, Z.useDebugValue = qe, Z.useDeferredValue = Ka, Z.useEffect = Tn, Z.useId = tu, Z.useImperativeHandle = Ga, Z.useInsertionEffect = nn, Z.useLayoutEffect = sn, Z.useMemo = Wa, Z.useReducer = ft, Z.useRef = ut, Z.useState = Ye, Z.useSyncExternalStore = nu, Z.useTransition = Ze, Z.version = A, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(Zp, Zp.exports)), Zp.exports;
}
process.env.NODE_ENV === "production" ? d0.exports = G_() : d0.exports = K_();
var ic = d0.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var XR;
function q_() {
  if (XR) return Xp;
  XR = 1;
  var ne = ic, Z = Symbol.for("react.element"), A = Symbol.for("react.fragment"), wt = Object.prototype.hasOwnProperty, mt = ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, yt = { key: !0, ref: !0, __self: !0, __source: !0 };
  function S(Ft, fe, de) {
    var et, ee = {}, K = null, X = null;
    de !== void 0 && (K = "" + de), fe.key !== void 0 && (K = "" + fe.key), fe.ref !== void 0 && (X = fe.ref);
    for (et in fe) wt.call(fe, et) && !yt.hasOwnProperty(et) && (ee[et] = fe[et]);
    if (Ft && Ft.defaultProps) for (et in fe = Ft.defaultProps, fe) ee[et] === void 0 && (ee[et] = fe[et]);
    return { $$typeof: Z, type: Ft, key: K, ref: X, props: ee, _owner: mt.current };
  }
  return Xp.Fragment = A, Xp.jsx = S, Xp.jsxs = S, Xp;
}
var Jp = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var JR;
function X_() {
  return JR || (JR = 1, process.env.NODE_ENV !== "production" && function() {
    var ne = ic, Z = Symbol.for("react.element"), A = Symbol.for("react.portal"), wt = Symbol.for("react.fragment"), mt = Symbol.for("react.strict_mode"), yt = Symbol.for("react.profiler"), S = Symbol.for("react.provider"), Ft = Symbol.for("react.context"), fe = Symbol.for("react.forward_ref"), de = Symbol.for("react.suspense"), et = Symbol.for("react.suspense_list"), ee = Symbol.for("react.memo"), K = Symbol.for("react.lazy"), X = Symbol.for("react.offscreen"), le = Symbol.iterator, Qe = "@@iterator";
    function st(R) {
      if (R === null || typeof R != "object")
        return null;
      var B = le && R[le] || R[Qe];
      return typeof B == "function" ? B : null;
    }
    var Jt = ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function pt(R) {
      {
        for (var B = arguments.length, ue = new Array(B > 1 ? B - 1 : 0), ye = 1; ye < B; ye++)
          ue[ye - 1] = arguments[ye];
        We("error", R, ue);
      }
    }
    function We(R, B, ue) {
      {
        var ye = Jt.ReactDebugCurrentFrame, Ke = ye.getStackAddendum();
        Ke !== "" && (B += "%s", ue = ue.concat([Ke]));
        var Ye = ue.map(function(ft) {
          return String(ft);
        });
        Ye.unshift("Warning: " + B), Function.prototype.apply.call(console[R], console, Ye);
      }
    }
    var vt = !1, ke = !1, ct = !1, He = !1, ln = !1, Ht;
    Ht = Symbol.for("react.module.reference");
    function Zt(R) {
      return !!(typeof R == "string" || typeof R == "function" || R === wt || R === yt || ln || R === mt || R === de || R === et || He || R === X || vt || ke || ct || typeof R == "object" && R !== null && (R.$$typeof === K || R.$$typeof === ee || R.$$typeof === S || R.$$typeof === Ft || R.$$typeof === fe || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      R.$$typeof === Ht || R.getModuleId !== void 0));
    }
    function un(R, B, ue) {
      var ye = R.displayName;
      if (ye)
        return ye;
      var Ke = B.displayName || B.name || "";
      return Ke !== "" ? ue + "(" + Ke + ")" : ue;
    }
    function bt(R) {
      return R.displayName || "Context";
    }
    function Le(R) {
      if (R == null)
        return null;
      if (typeof R.tag == "number" && pt("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof R == "function")
        return R.displayName || R.name || null;
      if (typeof R == "string")
        return R;
      switch (R) {
        case wt:
          return "Fragment";
        case A:
          return "Portal";
        case yt:
          return "Profiler";
        case mt:
          return "StrictMode";
        case de:
          return "Suspense";
        case et:
          return "SuspenseList";
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case Ft:
            var B = R;
            return bt(B) + ".Consumer";
          case S:
            var ue = R;
            return bt(ue._context) + ".Provider";
          case fe:
            return un(R, R.render, "ForwardRef");
          case ee:
            var ye = R.displayName || null;
            return ye !== null ? ye : Le(R.type) || "Memo";
          case K: {
            var Ke = R, Ye = Ke._payload, ft = Ke._init;
            try {
              return Le(ft(Ye));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var At = Object.assign, _t = 0, Dt, Te, J, xe, ae, _, V;
    function Ve() {
    }
    Ve.__reactDisabledLog = !0;
    function je() {
      {
        if (_t === 0) {
          Dt = console.log, Te = console.info, J = console.warn, xe = console.error, ae = console.group, _ = console.groupCollapsed, V = console.groupEnd;
          var R = {
            configurable: !0,
            enumerable: !0,
            value: Ve,
            writable: !0
          };
          Object.defineProperties(console, {
            info: R,
            log: R,
            warn: R,
            error: R,
            group: R,
            groupCollapsed: R,
            groupEnd: R
          });
        }
        _t++;
      }
    }
    function it() {
      {
        if (_t--, _t === 0) {
          var R = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: At({}, R, {
              value: Dt
            }),
            info: At({}, R, {
              value: Te
            }),
            warn: At({}, R, {
              value: J
            }),
            error: At({}, R, {
              value: xe
            }),
            group: At({}, R, {
              value: ae
            }),
            groupCollapsed: At({}, R, {
              value: _
            }),
            groupEnd: At({}, R, {
              value: V
            })
          });
        }
        _t < 0 && pt("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var tt = Jt.ReactCurrentDispatcher, Je;
    function nt(R, B, ue) {
      {
        if (Je === void 0)
          try {
            throw Error();
          } catch (Ke) {
            var ye = Ke.stack.trim().match(/\n( *(at )?)/);
            Je = ye && ye[1] || "";
          }
        return `
` + Je + R;
      }
    }
    var lt = !1, Bt;
    {
      var On = typeof WeakMap == "function" ? WeakMap : Map;
      Bt = new On();
    }
    function wr(R, B) {
      if (!R || lt)
        return "";
      {
        var ue = Bt.get(R);
        if (ue !== void 0)
          return ue;
      }
      var ye;
      lt = !0;
      var Ke = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var Ye;
      Ye = tt.current, tt.current = null, je();
      try {
        if (B) {
          var ft = function() {
            throw Error();
          };
          if (Object.defineProperty(ft.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(ft, []);
            } catch (qe) {
              ye = qe;
            }
            Reflect.construct(R, [], ft);
          } else {
            try {
              ft.call();
            } catch (qe) {
              ye = qe;
            }
            R.call(ft.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (qe) {
            ye = qe;
          }
          R();
        }
      } catch (qe) {
        if (qe && ye && typeof qe.stack == "string") {
          for (var ut = qe.stack.split(`
`), Tn = ye.stack.split(`
`), nn = ut.length - 1, sn = Tn.length - 1; nn >= 1 && sn >= 0 && ut[nn] !== Tn[sn]; )
            sn--;
          for (; nn >= 1 && sn >= 0; nn--, sn--)
            if (ut[nn] !== Tn[sn]) {
              if (nn !== 1 || sn !== 1)
                do
                  if (nn--, sn--, sn < 0 || ut[nn] !== Tn[sn]) {
                    var ar = `
` + ut[nn].replace(" at new ", " at ");
                    return R.displayName && ar.includes("<anonymous>") && (ar = ar.replace("<anonymous>", R.displayName)), typeof R == "function" && Bt.set(R, ar), ar;
                  }
                while (nn >= 1 && sn >= 0);
              break;
            }
        }
      } finally {
        lt = !1, tt.current = Ye, it(), Error.prepareStackTrace = Ke;
      }
      var Wa = R ? R.displayName || R.name : "", Ga = Wa ? nt(Wa) : "";
      return typeof R == "function" && Bt.set(R, Ga), Ga;
    }
    function Cn(R, B, ue) {
      return wr(R, !1);
    }
    function nr(R) {
      var B = R.prototype;
      return !!(B && B.isReactComponent);
    }
    function Pn(R, B, ue) {
      if (R == null)
        return "";
      if (typeof R == "function")
        return wr(R, nr(R));
      if (typeof R == "string")
        return nt(R);
      switch (R) {
        case de:
          return nt("Suspense");
        case et:
          return nt("SuspenseList");
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case fe:
            return Cn(R.render);
          case ee:
            return Pn(R.type, B, ue);
          case K: {
            var ye = R, Ke = ye._payload, Ye = ye._init;
            try {
              return Pn(Ye(Ke), B, ue);
            } catch {
            }
          }
        }
      return "";
    }
    var Bn = Object.prototype.hasOwnProperty, Yr = {}, si = Jt.ReactDebugCurrentFrame;
    function oa(R) {
      if (R) {
        var B = R._owner, ue = Pn(R.type, R._source, B ? B.type : null);
        si.setExtraStackFrame(ue);
      } else
        si.setExtraStackFrame(null);
    }
    function Kn(R, B, ue, ye, Ke) {
      {
        var Ye = Function.call.bind(Bn);
        for (var ft in R)
          if (Ye(R, ft)) {
            var ut = void 0;
            try {
              if (typeof R[ft] != "function") {
                var Tn = Error((ye || "React class") + ": " + ue + " type `" + ft + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof R[ft] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Tn.name = "Invariant Violation", Tn;
              }
              ut = R[ft](B, ft, ye, ue, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (nn) {
              ut = nn;
            }
            ut && !(ut instanceof Error) && (oa(Ke), pt("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", ye || "React class", ue, ft, typeof ut), oa(null)), ut instanceof Error && !(ut.message in Yr) && (Yr[ut.message] = !0, oa(Ke), pt("Failed %s type: %s", ue, ut.message), oa(null));
          }
      }
    }
    var Rn = Array.isArray;
    function In(R) {
      return Rn(R);
    }
    function gr(R) {
      {
        var B = typeof Symbol == "function" && Symbol.toStringTag, ue = B && R[Symbol.toStringTag] || R.constructor.name || "Object";
        return ue;
      }
    }
    function Ya(R) {
      try {
        return Ln(R), !1;
      } catch {
        return !0;
      }
    }
    function Ln(R) {
      return "" + R;
    }
    function Sr(R) {
      if (Ya(R))
        return pt("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", gr(R)), Ln(R);
    }
    var sa = Jt.ReactCurrentOwner, $a = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, ci, te;
    function we(R) {
      if (Bn.call(R, "ref")) {
        var B = Object.getOwnPropertyDescriptor(R, "ref").get;
        if (B && B.isReactWarning)
          return !1;
      }
      return R.ref !== void 0;
    }
    function rt(R) {
      if (Bn.call(R, "key")) {
        var B = Object.getOwnPropertyDescriptor(R, "key").get;
        if (B && B.isReactWarning)
          return !1;
      }
      return R.key !== void 0;
    }
    function jt(R, B) {
      typeof R.ref == "string" && sa.current;
    }
    function en(R, B) {
      {
        var ue = function() {
          ci || (ci = !0, pt("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", B));
        };
        ue.isReactWarning = !0, Object.defineProperty(R, "key", {
          get: ue,
          configurable: !0
        });
      }
    }
    function vn(R, B) {
      {
        var ue = function() {
          te || (te = !0, pt("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", B));
        };
        ue.isReactWarning = !0, Object.defineProperty(R, "ref", {
          get: ue,
          configurable: !0
        });
      }
    }
    var on = function(R, B, ue, ye, Ke, Ye, ft) {
      var ut = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: Z,
        // Built-in properties that belong on the element
        type: R,
        key: B,
        ref: ue,
        props: ft,
        // Record the component responsible for creating this element.
        _owner: Ye
      };
      return ut._store = {}, Object.defineProperty(ut._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(ut, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: ye
      }), Object.defineProperty(ut, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Ke
      }), Object.freeze && (Object.freeze(ut.props), Object.freeze(ut)), ut;
    };
    function qn(R, B, ue, ye, Ke) {
      {
        var Ye, ft = {}, ut = null, Tn = null;
        ue !== void 0 && (Sr(ue), ut = "" + ue), rt(B) && (Sr(B.key), ut = "" + B.key), we(B) && (Tn = B.ref, jt(B, Ke));
        for (Ye in B)
          Bn.call(B, Ye) && !$a.hasOwnProperty(Ye) && (ft[Ye] = B[Ye]);
        if (R && R.defaultProps) {
          var nn = R.defaultProps;
          for (Ye in nn)
            ft[Ye] === void 0 && (ft[Ye] = nn[Ye]);
        }
        if (ut || Tn) {
          var sn = typeof R == "function" ? R.displayName || R.name || "Unknown" : R;
          ut && en(ft, sn), Tn && vn(ft, sn);
        }
        return on(R, ut, Tn, Ke, ye, sa.current, ft);
      }
    }
    var tn = Jt.ReactCurrentOwner, It = Jt.ReactDebugCurrentFrame;
    function Yt(R) {
      if (R) {
        var B = R._owner, ue = Pn(R.type, R._source, B ? B.type : null);
        It.setExtraStackFrame(ue);
      } else
        It.setExtraStackFrame(null);
    }
    var ca;
    ca = !1;
    function Er(R) {
      return typeof R == "object" && R !== null && R.$$typeof === Z;
    }
    function Ta() {
      {
        if (tn.current) {
          var R = Le(tn.current.type);
          if (R)
            return `

Check the render method of \`` + R + "`.";
        }
        return "";
      }
    }
    function Fi(R) {
      return "";
    }
    var Jl = {};
    function Zl(R) {
      {
        var B = Ta();
        if (!B) {
          var ue = typeof R == "string" ? R : R.displayName || R.name;
          ue && (B = `

Check the top-level render call using <` + ue + ">.");
        }
        return B;
      }
    }
    function dl(R, B) {
      {
        if (!R._store || R._store.validated || R.key != null)
          return;
        R._store.validated = !0;
        var ue = Zl(B);
        if (Jl[ue])
          return;
        Jl[ue] = !0;
        var ye = "";
        R && R._owner && R._owner !== tn.current && (ye = " It was passed a child from " + Le(R._owner.type) + "."), Yt(R), pt('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', ue, ye), Yt(null);
      }
    }
    function pl(R, B) {
      {
        if (typeof R != "object")
          return;
        if (In(R))
          for (var ue = 0; ue < R.length; ue++) {
            var ye = R[ue];
            Er(ye) && dl(ye, B);
          }
        else if (Er(R))
          R._store && (R._store.validated = !0);
        else if (R) {
          var Ke = st(R);
          if (typeof Ke == "function" && Ke !== R.entries)
            for (var Ye = Ke.call(R), ft; !(ft = Ye.next()).done; )
              Er(ft.value) && dl(ft.value, B);
        }
      }
    }
    function eu(R) {
      {
        var B = R.type;
        if (B == null || typeof B == "string")
          return;
        var ue;
        if (typeof B == "function")
          ue = B.propTypes;
        else if (typeof B == "object" && (B.$$typeof === fe || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        B.$$typeof === ee))
          ue = B.propTypes;
        else
          return;
        if (ue) {
          var ye = Le(B);
          Kn(ue, R.props, "prop", ye, R);
        } else if (B.PropTypes !== void 0 && !ca) {
          ca = !0;
          var Ke = Le(B);
          pt("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Ke || "Unknown");
        }
        typeof B.getDefaultProps == "function" && !B.getDefaultProps.isReactClassApproved && pt("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function br(R) {
      {
        for (var B = Object.keys(R.props), ue = 0; ue < B.length; ue++) {
          var ye = B[ue];
          if (ye !== "children" && ye !== "key") {
            Yt(R), pt("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", ye), Yt(null);
            break;
          }
        }
        R.ref !== null && (Yt(R), pt("Invalid attribute `ref` supplied to `React.Fragment`."), Yt(null));
      }
    }
    var _r = {};
    function rr(R, B, ue, ye, Ke, Ye) {
      {
        var ft = Zt(R);
        if (!ft) {
          var ut = "";
          (R === void 0 || typeof R == "object" && R !== null && Object.keys(R).length === 0) && (ut += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Tn = Fi();
          Tn ? ut += Tn : ut += Ta();
          var nn;
          R === null ? nn = "null" : In(R) ? nn = "array" : R !== void 0 && R.$$typeof === Z ? (nn = "<" + (Le(R.type) || "Unknown") + " />", ut = " Did you accidentally export a JSX literal instead of a component?") : nn = typeof R, pt("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", nn, ut);
        }
        var sn = qn(R, B, ue, Ke, Ye);
        if (sn == null)
          return sn;
        if (ft) {
          var ar = B.children;
          if (ar !== void 0)
            if (ye)
              if (In(ar)) {
                for (var Wa = 0; Wa < ar.length; Wa++)
                  pl(ar[Wa], R);
                Object.freeze && Object.freeze(ar);
              } else
                pt("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              pl(ar, R);
        }
        if (Bn.call(B, "key")) {
          var Ga = Le(R), qe = Object.keys(B).filter(function(tu) {
            return tu !== "key";
          }), Ze = qe.length > 0 ? "{key: someKey, " + qe.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!_r[Ga + Ze]) {
            var Ka = qe.length > 0 ? "{" + qe.join(": ..., ") + ": ...}" : "{}";
            pt(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Ze, Ga, Ka, Ga), _r[Ga + Ze] = !0;
          }
        }
        return R === wt ? br(sn) : eu(sn), sn;
      }
    }
    function fi(R, B, ue) {
      return rr(R, B, ue, !0);
    }
    function Qa(R, B, ue) {
      return rr(R, B, ue, !1);
    }
    var di = Qa, pi = fi;
    Jp.Fragment = wt, Jp.jsx = di, Jp.jsxs = pi;
  }()), Jp;
}
process.env.NODE_ENV === "production" ? f0.exports = q_() : f0.exports = X_();
var Ce = f0.exports, p0 = { exports: {} }, Ba = {}, $m = { exports: {} }, s0 = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ZR;
function J_() {
  return ZR || (ZR = 1, function(ne) {
    function Z(J, xe) {
      var ae = J.length;
      J.push(xe);
      e: for (; 0 < ae; ) {
        var _ = ae - 1 >>> 1, V = J[_];
        if (0 < mt(V, xe)) J[_] = xe, J[ae] = V, ae = _;
        else break e;
      }
    }
    function A(J) {
      return J.length === 0 ? null : J[0];
    }
    function wt(J) {
      if (J.length === 0) return null;
      var xe = J[0], ae = J.pop();
      if (ae !== xe) {
        J[0] = ae;
        e: for (var _ = 0, V = J.length, Ve = V >>> 1; _ < Ve; ) {
          var je = 2 * (_ + 1) - 1, it = J[je], tt = je + 1, Je = J[tt];
          if (0 > mt(it, ae)) tt < V && 0 > mt(Je, it) ? (J[_] = Je, J[tt] = ae, _ = tt) : (J[_] = it, J[je] = ae, _ = je);
          else if (tt < V && 0 > mt(Je, ae)) J[_] = Je, J[tt] = ae, _ = tt;
          else break e;
        }
      }
      return xe;
    }
    function mt(J, xe) {
      var ae = J.sortIndex - xe.sortIndex;
      return ae !== 0 ? ae : J.id - xe.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var yt = performance;
      ne.unstable_now = function() {
        return yt.now();
      };
    } else {
      var S = Date, Ft = S.now();
      ne.unstable_now = function() {
        return S.now() - Ft;
      };
    }
    var fe = [], de = [], et = 1, ee = null, K = 3, X = !1, le = !1, Qe = !1, st = typeof setTimeout == "function" ? setTimeout : null, Jt = typeof clearTimeout == "function" ? clearTimeout : null, pt = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function We(J) {
      for (var xe = A(de); xe !== null; ) {
        if (xe.callback === null) wt(de);
        else if (xe.startTime <= J) wt(de), xe.sortIndex = xe.expirationTime, Z(fe, xe);
        else break;
        xe = A(de);
      }
    }
    function vt(J) {
      if (Qe = !1, We(J), !le) if (A(fe) !== null) le = !0, Dt(ke);
      else {
        var xe = A(de);
        xe !== null && Te(vt, xe.startTime - J);
      }
    }
    function ke(J, xe) {
      le = !1, Qe && (Qe = !1, Jt(ln), ln = -1), X = !0;
      var ae = K;
      try {
        for (We(xe), ee = A(fe); ee !== null && (!(ee.expirationTime > xe) || J && !un()); ) {
          var _ = ee.callback;
          if (typeof _ == "function") {
            ee.callback = null, K = ee.priorityLevel;
            var V = _(ee.expirationTime <= xe);
            xe = ne.unstable_now(), typeof V == "function" ? ee.callback = V : ee === A(fe) && wt(fe), We(xe);
          } else wt(fe);
          ee = A(fe);
        }
        if (ee !== null) var Ve = !0;
        else {
          var je = A(de);
          je !== null && Te(vt, je.startTime - xe), Ve = !1;
        }
        return Ve;
      } finally {
        ee = null, K = ae, X = !1;
      }
    }
    var ct = !1, He = null, ln = -1, Ht = 5, Zt = -1;
    function un() {
      return !(ne.unstable_now() - Zt < Ht);
    }
    function bt() {
      if (He !== null) {
        var J = ne.unstable_now();
        Zt = J;
        var xe = !0;
        try {
          xe = He(!0, J);
        } finally {
          xe ? Le() : (ct = !1, He = null);
        }
      } else ct = !1;
    }
    var Le;
    if (typeof pt == "function") Le = function() {
      pt(bt);
    };
    else if (typeof MessageChannel < "u") {
      var At = new MessageChannel(), _t = At.port2;
      At.port1.onmessage = bt, Le = function() {
        _t.postMessage(null);
      };
    } else Le = function() {
      st(bt, 0);
    };
    function Dt(J) {
      He = J, ct || (ct = !0, Le());
    }
    function Te(J, xe) {
      ln = st(function() {
        J(ne.unstable_now());
      }, xe);
    }
    ne.unstable_IdlePriority = 5, ne.unstable_ImmediatePriority = 1, ne.unstable_LowPriority = 4, ne.unstable_NormalPriority = 3, ne.unstable_Profiling = null, ne.unstable_UserBlockingPriority = 2, ne.unstable_cancelCallback = function(J) {
      J.callback = null;
    }, ne.unstable_continueExecution = function() {
      le || X || (le = !0, Dt(ke));
    }, ne.unstable_forceFrameRate = function(J) {
      0 > J || 125 < J ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Ht = 0 < J ? Math.floor(1e3 / J) : 5;
    }, ne.unstable_getCurrentPriorityLevel = function() {
      return K;
    }, ne.unstable_getFirstCallbackNode = function() {
      return A(fe);
    }, ne.unstable_next = function(J) {
      switch (K) {
        case 1:
        case 2:
        case 3:
          var xe = 3;
          break;
        default:
          xe = K;
      }
      var ae = K;
      K = xe;
      try {
        return J();
      } finally {
        K = ae;
      }
    }, ne.unstable_pauseExecution = function() {
    }, ne.unstable_requestPaint = function() {
    }, ne.unstable_runWithPriority = function(J, xe) {
      switch (J) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          J = 3;
      }
      var ae = K;
      K = J;
      try {
        return xe();
      } finally {
        K = ae;
      }
    }, ne.unstable_scheduleCallback = function(J, xe, ae) {
      var _ = ne.unstable_now();
      switch (typeof ae == "object" && ae !== null ? (ae = ae.delay, ae = typeof ae == "number" && 0 < ae ? _ + ae : _) : ae = _, J) {
        case 1:
          var V = -1;
          break;
        case 2:
          V = 250;
          break;
        case 5:
          V = 1073741823;
          break;
        case 4:
          V = 1e4;
          break;
        default:
          V = 5e3;
      }
      return V = ae + V, J = { id: et++, callback: xe, priorityLevel: J, startTime: ae, expirationTime: V, sortIndex: -1 }, ae > _ ? (J.sortIndex = ae, Z(de, J), A(fe) === null && J === A(de) && (Qe ? (Jt(ln), ln = -1) : Qe = !0, Te(vt, ae - _))) : (J.sortIndex = V, Z(fe, J), le || X || (le = !0, Dt(ke))), J;
    }, ne.unstable_shouldYield = un, ne.unstable_wrapCallback = function(J) {
      var xe = K;
      return function() {
        var ae = K;
        K = xe;
        try {
          return J.apply(this, arguments);
        } finally {
          K = ae;
        }
      };
    };
  }(s0)), s0;
}
var c0 = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var eT;
function Z_() {
  return eT || (eT = 1, function(ne) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var Z = !1, A = 5;
      function wt(te, we) {
        var rt = te.length;
        te.push(we), S(te, we, rt);
      }
      function mt(te) {
        return te.length === 0 ? null : te[0];
      }
      function yt(te) {
        if (te.length === 0)
          return null;
        var we = te[0], rt = te.pop();
        return rt !== we && (te[0] = rt, Ft(te, rt, 0)), we;
      }
      function S(te, we, rt) {
        for (var jt = rt; jt > 0; ) {
          var en = jt - 1 >>> 1, vn = te[en];
          if (fe(vn, we) > 0)
            te[en] = we, te[jt] = vn, jt = en;
          else
            return;
        }
      }
      function Ft(te, we, rt) {
        for (var jt = rt, en = te.length, vn = en >>> 1; jt < vn; ) {
          var on = (jt + 1) * 2 - 1, qn = te[on], tn = on + 1, It = te[tn];
          if (fe(qn, we) < 0)
            tn < en && fe(It, qn) < 0 ? (te[jt] = It, te[tn] = we, jt = tn) : (te[jt] = qn, te[on] = we, jt = on);
          else if (tn < en && fe(It, we) < 0)
            te[jt] = It, te[tn] = we, jt = tn;
          else
            return;
        }
      }
      function fe(te, we) {
        var rt = te.sortIndex - we.sortIndex;
        return rt !== 0 ? rt : te.id - we.id;
      }
      var de = 1, et = 2, ee = 3, K = 4, X = 5;
      function le(te, we) {
      }
      var Qe = typeof performance == "object" && typeof performance.now == "function";
      if (Qe) {
        var st = performance;
        ne.unstable_now = function() {
          return st.now();
        };
      } else {
        var Jt = Date, pt = Jt.now();
        ne.unstable_now = function() {
          return Jt.now() - pt;
        };
      }
      var We = 1073741823, vt = -1, ke = 250, ct = 5e3, He = 1e4, ln = We, Ht = [], Zt = [], un = 1, bt = null, Le = ee, At = !1, _t = !1, Dt = !1, Te = typeof setTimeout == "function" ? setTimeout : null, J = typeof clearTimeout == "function" ? clearTimeout : null, xe = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function ae(te) {
        for (var we = mt(Zt); we !== null; ) {
          if (we.callback === null)
            yt(Zt);
          else if (we.startTime <= te)
            yt(Zt), we.sortIndex = we.expirationTime, wt(Ht, we);
          else
            return;
          we = mt(Zt);
        }
      }
      function _(te) {
        if (Dt = !1, ae(te), !_t)
          if (mt(Ht) !== null)
            _t = !0, Ln(V);
          else {
            var we = mt(Zt);
            we !== null && Sr(_, we.startTime - te);
          }
      }
      function V(te, we) {
        _t = !1, Dt && (Dt = !1, sa()), At = !0;
        var rt = Le;
        try {
          var jt;
          if (!Z) return Ve(te, we);
        } finally {
          bt = null, Le = rt, At = !1;
        }
      }
      function Ve(te, we) {
        var rt = we;
        for (ae(rt), bt = mt(Ht); bt !== null && !(bt.expirationTime > rt && (!te || si())); ) {
          var jt = bt.callback;
          if (typeof jt == "function") {
            bt.callback = null, Le = bt.priorityLevel;
            var en = bt.expirationTime <= rt, vn = jt(en);
            rt = ne.unstable_now(), typeof vn == "function" ? bt.callback = vn : bt === mt(Ht) && yt(Ht), ae(rt);
          } else
            yt(Ht);
          bt = mt(Ht);
        }
        if (bt !== null)
          return !0;
        var on = mt(Zt);
        return on !== null && Sr(_, on.startTime - rt), !1;
      }
      function je(te, we) {
        switch (te) {
          case de:
          case et:
          case ee:
          case K:
          case X:
            break;
          default:
            te = ee;
        }
        var rt = Le;
        Le = te;
        try {
          return we();
        } finally {
          Le = rt;
        }
      }
      function it(te) {
        var we;
        switch (Le) {
          case de:
          case et:
          case ee:
            we = ee;
            break;
          default:
            we = Le;
            break;
        }
        var rt = Le;
        Le = we;
        try {
          return te();
        } finally {
          Le = rt;
        }
      }
      function tt(te) {
        var we = Le;
        return function() {
          var rt = Le;
          Le = we;
          try {
            return te.apply(this, arguments);
          } finally {
            Le = rt;
          }
        };
      }
      function Je(te, we, rt) {
        var jt = ne.unstable_now(), en;
        if (typeof rt == "object" && rt !== null) {
          var vn = rt.delay;
          typeof vn == "number" && vn > 0 ? en = jt + vn : en = jt;
        } else
          en = jt;
        var on;
        switch (te) {
          case de:
            on = vt;
            break;
          case et:
            on = ke;
            break;
          case X:
            on = ln;
            break;
          case K:
            on = He;
            break;
          case ee:
          default:
            on = ct;
            break;
        }
        var qn = en + on, tn = {
          id: un++,
          callback: we,
          priorityLevel: te,
          startTime: en,
          expirationTime: qn,
          sortIndex: -1
        };
        return en > jt ? (tn.sortIndex = en, wt(Zt, tn), mt(Ht) === null && tn === mt(Zt) && (Dt ? sa() : Dt = !0, Sr(_, en - jt))) : (tn.sortIndex = qn, wt(Ht, tn), !_t && !At && (_t = !0, Ln(V))), tn;
      }
      function nt() {
      }
      function lt() {
        !_t && !At && (_t = !0, Ln(V));
      }
      function Bt() {
        return mt(Ht);
      }
      function On(te) {
        te.callback = null;
      }
      function wr() {
        return Le;
      }
      var Cn = !1, nr = null, Pn = -1, Bn = A, Yr = -1;
      function si() {
        var te = ne.unstable_now() - Yr;
        return !(te < Bn);
      }
      function oa() {
      }
      function Kn(te) {
        if (te < 0 || te > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        te > 0 ? Bn = Math.floor(1e3 / te) : Bn = A;
      }
      var Rn = function() {
        if (nr !== null) {
          var te = ne.unstable_now();
          Yr = te;
          var we = !0, rt = !0;
          try {
            rt = nr(we, te);
          } finally {
            rt ? In() : (Cn = !1, nr = null);
          }
        } else
          Cn = !1;
      }, In;
      if (typeof xe == "function")
        In = function() {
          xe(Rn);
        };
      else if (typeof MessageChannel < "u") {
        var gr = new MessageChannel(), Ya = gr.port2;
        gr.port1.onmessage = Rn, In = function() {
          Ya.postMessage(null);
        };
      } else
        In = function() {
          Te(Rn, 0);
        };
      function Ln(te) {
        nr = te, Cn || (Cn = !0, In());
      }
      function Sr(te, we) {
        Pn = Te(function() {
          te(ne.unstable_now());
        }, we);
      }
      function sa() {
        J(Pn), Pn = -1;
      }
      var $a = oa, ci = null;
      ne.unstable_IdlePriority = X, ne.unstable_ImmediatePriority = de, ne.unstable_LowPriority = K, ne.unstable_NormalPriority = ee, ne.unstable_Profiling = ci, ne.unstable_UserBlockingPriority = et, ne.unstable_cancelCallback = On, ne.unstable_continueExecution = lt, ne.unstable_forceFrameRate = Kn, ne.unstable_getCurrentPriorityLevel = wr, ne.unstable_getFirstCallbackNode = Bt, ne.unstable_next = it, ne.unstable_pauseExecution = nt, ne.unstable_requestPaint = $a, ne.unstable_runWithPriority = je, ne.unstable_scheduleCallback = Je, ne.unstable_shouldYield = si, ne.unstable_wrapCallback = tt, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(c0)), c0;
}
var tT;
function lT() {
  return tT || (tT = 1, process.env.NODE_ENV === "production" ? $m.exports = J_() : $m.exports = Z_()), $m.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var nT;
function ek() {
  if (nT) return Ba;
  nT = 1;
  var ne = ic, Z = lT();
  function A(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var wt = /* @__PURE__ */ new Set(), mt = {};
  function yt(n, r) {
    S(n, r), S(n + "Capture", r);
  }
  function S(n, r) {
    for (mt[n] = r, n = 0; n < r.length; n++) wt.add(r[n]);
  }
  var Ft = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), fe = Object.prototype.hasOwnProperty, de = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, et = {}, ee = {};
  function K(n) {
    return fe.call(ee, n) ? !0 : fe.call(et, n) ? !1 : de.test(n) ? ee[n] = !0 : (et[n] = !0, !1);
  }
  function X(n, r, l, o) {
    if (l !== null && l.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return o ? !1 : l !== null ? !l.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function le(n, r, l, o) {
    if (r === null || typeof r > "u" || X(n, r, l, o)) return !0;
    if (o) return !1;
    if (l !== null) switch (l.type) {
      case 3:
        return !r;
      case 4:
        return r === !1;
      case 5:
        return isNaN(r);
      case 6:
        return isNaN(r) || 1 > r;
    }
    return !1;
  }
  function Qe(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var st = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    st[n] = new Qe(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    st[r] = new Qe(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    st[n] = new Qe(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    st[n] = new Qe(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    st[n] = new Qe(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    st[n] = new Qe(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    st[n] = new Qe(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    st[n] = new Qe(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    st[n] = new Qe(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Jt = /[\-:]([a-z])/g;
  function pt(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Jt,
      pt
    );
    st[r] = new Qe(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Jt, pt);
    st[r] = new Qe(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Jt, pt);
    st[r] = new Qe(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    st[n] = new Qe(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), st.xlinkHref = new Qe("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    st[n] = new Qe(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function We(n, r, l, o) {
    var c = st.hasOwnProperty(r) ? st[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (le(r, l, c, o) && (l = null), o || c === null ? K(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var vt = ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ke = Symbol.for("react.element"), ct = Symbol.for("react.portal"), He = Symbol.for("react.fragment"), ln = Symbol.for("react.strict_mode"), Ht = Symbol.for("react.profiler"), Zt = Symbol.for("react.provider"), un = Symbol.for("react.context"), bt = Symbol.for("react.forward_ref"), Le = Symbol.for("react.suspense"), At = Symbol.for("react.suspense_list"), _t = Symbol.for("react.memo"), Dt = Symbol.for("react.lazy"), Te = Symbol.for("react.offscreen"), J = Symbol.iterator;
  function xe(n) {
    return n === null || typeof n != "object" ? null : (n = J && n[J] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var ae = Object.assign, _;
  function V(n) {
    if (_ === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      _ = r && r[1] || "";
    }
    return `
` + _ + n;
  }
  var Ve = !1;
  function je(n, r) {
    if (!n || Ve) return "";
    Ve = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r) if (r = function() {
        throw Error();
      }, Object.defineProperty(r.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(r, []);
        } catch (z) {
          var o = z;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (z) {
          o = z;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (z) {
          o = z;
        }
        n();
      }
    } catch (z) {
      if (z && o && typeof z.stack == "string") {
        for (var c = z.stack.split(`
`), d = o.stack.split(`
`), m = c.length - 1, E = d.length - 1; 1 <= m && 0 <= E && c[m] !== d[E]; ) E--;
        for (; 1 <= m && 0 <= E; m--, E--) if (c[m] !== d[E]) {
          if (m !== 1 || E !== 1)
            do
              if (m--, E--, 0 > E || c[m] !== d[E]) {
                var T = `
` + c[m].replace(" at new ", " at ");
                return n.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", n.displayName)), T;
              }
            while (1 <= m && 0 <= E);
          break;
        }
      }
    } finally {
      Ve = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? V(n) : "";
  }
  function it(n) {
    switch (n.tag) {
      case 5:
        return V(n.type);
      case 16:
        return V("Lazy");
      case 13:
        return V("Suspense");
      case 19:
        return V("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = je(n.type, !1), n;
      case 11:
        return n = je(n.type.render, !1), n;
      case 1:
        return n = je(n.type, !0), n;
      default:
        return "";
    }
  }
  function tt(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case He:
        return "Fragment";
      case ct:
        return "Portal";
      case Ht:
        return "Profiler";
      case ln:
        return "StrictMode";
      case Le:
        return "Suspense";
      case At:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case un:
        return (n.displayName || "Context") + ".Consumer";
      case Zt:
        return (n._context.displayName || "Context") + ".Provider";
      case bt:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case _t:
        return r = n.displayName || null, r !== null ? r : tt(n.type) || "Memo";
      case Dt:
        r = n._payload, n = n._init;
        try {
          return tt(n(r));
        } catch {
        }
    }
    return null;
  }
  function Je(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return tt(r);
      case 8:
        return r === ln ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function") return r.displayName || r.name || null;
        if (typeof r == "string") return r;
    }
    return null;
  }
  function nt(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function lt(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Bt(n) {
    var r = lt(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var c = l.get, d = l.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return c.call(this);
      }, set: function(m) {
        o = "" + m, d.call(this, m);
      } }), Object.defineProperty(n, r, { enumerable: l.enumerable }), { getValue: function() {
        return o;
      }, setValue: function(m) {
        o = "" + m;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function On(n) {
    n._valueTracker || (n._valueTracker = Bt(n));
  }
  function wr(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = lt(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
  }
  function Cn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function nr(n, r) {
    var l = r.checked;
    return ae({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Pn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = nt(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function Bn(n, r) {
    r = r.checked, r != null && We(n, "checked", r, !1);
  }
  function Yr(n, r) {
    Bn(n, r);
    var l = nt(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? oa(n, r.type, l) : r.hasOwnProperty("defaultValue") && oa(n, r.type, nt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function si(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var o = r.type;
      if (!(o !== "submit" && o !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function oa(n, r, l) {
    (r !== "number" || Cn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Kn = Array.isArray;
  function Rn(n, r, l, o) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && o && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + nt(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, o && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function In(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(A(91));
    return ae({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function gr(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(A(92));
        if (Kn(l)) {
          if (1 < l.length) throw Error(A(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: nt(l) };
  }
  function Ya(n, r) {
    var l = nt(r.value), o = nt(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), o != null && (n.defaultValue = "" + o);
  }
  function Ln(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Sr(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function sa(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Sr(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var $a, ci = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, o, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, o, c);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for ($a = $a || document.createElement("div"), $a.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = $a.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function te(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var we = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, rt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(we).forEach(function(n) {
    rt.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), we[r] = we[n];
    });
  });
  function jt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || we.hasOwnProperty(n) && we[n] ? ("" + r).trim() : r + "px";
  }
  function en(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = jt(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var vn = ae({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function on(n, r) {
    if (r) {
      if (vn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(A(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(A(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(A(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(A(62));
    }
  }
  function qn(n, r) {
    if (n.indexOf("-") === -1) return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var tn = null;
  function It(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var Yt = null, ca = null, Er = null;
  function Ta(n) {
    if (n = De(n)) {
      if (typeof Yt != "function") throw Error(A(280));
      var r = n.stateNode;
      r && (r = mn(r), Yt(n.stateNode, n.type, r));
    }
  }
  function Fi(n) {
    ca ? Er ? Er.push(n) : Er = [n] : ca = n;
  }
  function Jl() {
    if (ca) {
      var n = ca, r = Er;
      if (Er = ca = null, Ta(n), r) for (n = 0; n < r.length; n++) Ta(r[n]);
    }
  }
  function Zl(n, r) {
    return n(r);
  }
  function dl() {
  }
  var pl = !1;
  function eu(n, r, l) {
    if (pl) return n(r, l);
    pl = !0;
    try {
      return Zl(n, r, l);
    } finally {
      pl = !1, (ca !== null || Er !== null) && (dl(), Jl());
    }
  }
  function br(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var o = mn(l);
    if (o === null) return null;
    l = o[r];
    e: switch (r) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (o = !o.disabled) || (n = n.type, o = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !o;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (l && typeof l != "function") throw Error(A(231, r, typeof l));
    return l;
  }
  var _r = !1;
  if (Ft) try {
    var rr = {};
    Object.defineProperty(rr, "passive", { get: function() {
      _r = !0;
    } }), window.addEventListener("test", rr, rr), window.removeEventListener("test", rr, rr);
  } catch {
    _r = !1;
  }
  function fi(n, r, l, o, c, d, m, E, T) {
    var z = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, z);
    } catch ($) {
      this.onError($);
    }
  }
  var Qa = !1, di = null, pi = !1, R = null, B = { onError: function(n) {
    Qa = !0, di = n;
  } };
  function ue(n, r, l, o, c, d, m, E, T) {
    Qa = !1, di = null, fi.apply(B, arguments);
  }
  function ye(n, r, l, o, c, d, m, E, T) {
    if (ue.apply(this, arguments), Qa) {
      if (Qa) {
        var z = di;
        Qa = !1, di = null;
      } else throw Error(A(198));
      pi || (pi = !0, R = z);
    }
  }
  function Ke(n) {
    var r = n, l = n;
    if (n.alternate) for (; r.return; ) r = r.return;
    else {
      n = r;
      do
        r = n, r.flags & 4098 && (l = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? l : null;
  }
  function Ye(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function ft(n) {
    if (Ke(n) !== n) throw Error(A(188));
  }
  function ut(n) {
    var r = n.alternate;
    if (!r) {
      if (r = Ke(n), r === null) throw Error(A(188));
      return r !== n ? null : n;
    }
    for (var l = n, o = r; ; ) {
      var c = l.return;
      if (c === null) break;
      var d = c.alternate;
      if (d === null) {
        if (o = c.return, o !== null) {
          l = o;
          continue;
        }
        break;
      }
      if (c.child === d.child) {
        for (d = c.child; d; ) {
          if (d === l) return ft(c), n;
          if (d === o) return ft(c), r;
          d = d.sibling;
        }
        throw Error(A(188));
      }
      if (l.return !== o.return) l = c, o = d;
      else {
        for (var m = !1, E = c.child; E; ) {
          if (E === l) {
            m = !0, l = c, o = d;
            break;
          }
          if (E === o) {
            m = !0, o = c, l = d;
            break;
          }
          E = E.sibling;
        }
        if (!m) {
          for (E = d.child; E; ) {
            if (E === l) {
              m = !0, l = d, o = c;
              break;
            }
            if (E === o) {
              m = !0, o = d, l = c;
              break;
            }
            E = E.sibling;
          }
          if (!m) throw Error(A(189));
        }
      }
      if (l.alternate !== o) throw Error(A(190));
    }
    if (l.tag !== 3) throw Error(A(188));
    return l.stateNode.current === l ? n : r;
  }
  function Tn(n) {
    return n = ut(n), n !== null ? nn(n) : null;
  }
  function nn(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = nn(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var sn = Z.unstable_scheduleCallback, ar = Z.unstable_cancelCallback, Wa = Z.unstable_shouldYield, Ga = Z.unstable_requestPaint, qe = Z.unstable_now, Ze = Z.unstable_getCurrentPriorityLevel, Ka = Z.unstable_ImmediatePriority, tu = Z.unstable_UserBlockingPriority, nu = Z.unstable_NormalPriority, vl = Z.unstable_LowPriority, Qu = Z.unstable_IdlePriority, hl = null, $r = null;
  function Yo(n) {
    if ($r && typeof $r.onCommitFiberRoot == "function") try {
      $r.onCommitFiberRoot(hl, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var kr = Math.clz32 ? Math.clz32 : Wu, lc = Math.log, uc = Math.LN2;
  function Wu(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (lc(n) / uc | 0) | 0;
  }
  var ml = 64, fa = 4194304;
  function qa(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function Xa(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var o = 0, c = n.suspendedLanes, d = n.pingedLanes, m = l & 268435455;
    if (m !== 0) {
      var E = m & ~c;
      E !== 0 ? o = qa(E) : (d &= m, d !== 0 && (o = qa(d)));
    } else m = l & ~c, m !== 0 ? o = qa(m) : d !== 0 && (o = qa(d));
    if (o === 0) return 0;
    if (r !== 0 && r !== o && !(r & c) && (c = o & -o, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if (o & 4 && (o |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= o; 0 < r; ) l = 31 - kr(r), c = 1 << l, o |= n[l], r &= ~c;
    return o;
  }
  function Gu(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function ru(n, r) {
    for (var l = n.suspendedLanes, o = n.pingedLanes, c = n.expirationTimes, d = n.pendingLanes; 0 < d; ) {
      var m = 31 - kr(d), E = 1 << m, T = c[m];
      T === -1 ? (!(E & l) || E & o) && (c[m] = Gu(E, r)) : T <= r && (n.expiredLanes |= E), d &= ~E;
    }
  }
  function yl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Ku() {
    var n = ml;
    return ml <<= 1, !(ml & 4194240) && (ml = 64), n;
  }
  function qu(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Hi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - kr(r), n[r] = l;
  }
  function Qf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var o = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - kr(l), d = 1 << c;
      r[c] = 0, o[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function Vi(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var o = 31 - kr(l), c = 1 << o;
      c & r | n[o] & r && (n[o] |= r), l &= ~c;
    }
  }
  var Ot = 0;
  function Xu(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var Tt, $o, vi, Ie, Ju, ir = !1, hi = [], Dr = null, mi = null, cn = null, $t = /* @__PURE__ */ new Map(), gl = /* @__PURE__ */ new Map(), Yn = [], Or = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function xa(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Dr = null;
        break;
      case "dragenter":
      case "dragleave":
        mi = null;
        break;
      case "mouseover":
      case "mouseout":
        cn = null;
        break;
      case "pointerover":
      case "pointerout":
        $t.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        gl.delete(r.pointerId);
    }
  }
  function au(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = De(r), r !== null && $o(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Qo(n, r, l, o, c) {
    switch (r) {
      case "focusin":
        return Dr = au(Dr, n, r, l, o, c), !0;
      case "dragenter":
        return mi = au(mi, n, r, l, o, c), !0;
      case "mouseover":
        return cn = au(cn, n, r, l, o, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return $t.set(d, au($t.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, gl.set(d, au(gl.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function Wo(n) {
    var r = pu(n.target);
    if (r !== null) {
      var l = Ke(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = Ye(l), r !== null) {
            n.blockedOn = r, Ju(n.priority, function() {
              vi(l);
            });
            return;
          }
        } else if (r === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function Sl(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = to(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        tn = o, l.target.dispatchEvent(o), tn = null;
      } else return r = De(l), r !== null && $o(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function iu(n, r, l) {
    Sl(n) && l.delete(r);
  }
  function Wf() {
    ir = !1, Dr !== null && Sl(Dr) && (Dr = null), mi !== null && Sl(mi) && (mi = null), cn !== null && Sl(cn) && (cn = null), $t.forEach(iu), gl.forEach(iu);
  }
  function wa(n, r) {
    n.blockedOn === r && (n.blockedOn = null, ir || (ir = !0, Z.unstable_scheduleCallback(Z.unstable_NormalPriority, Wf)));
  }
  function Ja(n) {
    function r(c) {
      return wa(c, n);
    }
    if (0 < hi.length) {
      wa(hi[0], n);
      for (var l = 1; l < hi.length; l++) {
        var o = hi[l];
        o.blockedOn === n && (o.blockedOn = null);
      }
    }
    for (Dr !== null && wa(Dr, n), mi !== null && wa(mi, n), cn !== null && wa(cn, n), $t.forEach(r), gl.forEach(r), l = 0; l < Yn.length; l++) o = Yn[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < Yn.length && (l = Yn[0], l.blockedOn === null); ) Wo(l), l.blockedOn === null && Yn.shift();
  }
  var yi = vt.ReactCurrentBatchConfig, ba = !0;
  function Zu(n, r, l, o) {
    var c = Ot, d = yi.transition;
    yi.transition = null;
    try {
      Ot = 1, El(n, r, l, o);
    } finally {
      Ot = c, yi.transition = d;
    }
  }
  function eo(n, r, l, o) {
    var c = Ot, d = yi.transition;
    yi.transition = null;
    try {
      Ot = 4, El(n, r, l, o);
    } finally {
      Ot = c, yi.transition = d;
    }
  }
  function El(n, r, l, o) {
    if (ba) {
      var c = to(n, r, l, o);
      if (c === null) Sc(n, r, o, lu, l), xa(n, o);
      else if (Qo(c, n, r, l, o)) o.stopPropagation();
      else if (xa(n, o), r & 4 && -1 < Or.indexOf(n)) {
        for (; c !== null; ) {
          var d = De(c);
          if (d !== null && Tt(d), d = to(n, r, l, o), d === null && Sc(n, r, o, lu, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else Sc(n, r, o, null, l);
    }
  }
  var lu = null;
  function to(n, r, l, o) {
    if (lu = null, n = It(o), n = pu(n), n !== null) if (r = Ke(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = Ye(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return lu = n, null;
  }
  function no(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Ze()) {
          case Ka:
            return 1;
          case tu:
            return 4;
          case nu:
          case vl:
            return 16;
          case Qu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Za = null, h = null, C = null;
  function M() {
    if (C) return C;
    var n, r = h, l = r.length, o, c = "value" in Za ? Za.value : Za.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var m = l - n;
    for (o = 1; o <= m && r[l - o] === c[d - o]; o++) ;
    return C = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function j(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function q() {
    return !0;
  }
  function Ne() {
    return !1;
  }
  function ie(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var E in n) n.hasOwnProperty(E) && (l = n[E], this[E] = l ? l(d) : d[E]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? q : Ne, this.isPropagationStopped = Ne, this;
    }
    return ae(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = q);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = q);
    }, persist: function() {
    }, isPersistent: q }), r;
  }
  var Ue = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, dt = ie(Ue), xt = ae({}, Ue, { view: 0, detail: 0 }), rn = ie(xt), Qt, at, Wt, hn = ae({}, xt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Jf, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Wt && (Wt && n.type === "mousemove" ? (Qt = n.screenX - Wt.screenX, at = n.screenY - Wt.screenY) : at = Qt = 0, Wt = n), Qt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : at;
  } }), Cl = ie(hn), Go = ae({}, hn, { dataTransfer: 0 }), Pi = ie(Go), Ko = ae({}, xt, { relatedTarget: 0 }), uu = ie(Ko), Gf = ae({}, Ue, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), oc = ie(Gf), Kf = ae({}, Ue, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), ev = ie(Kf), qf = ae({}, Ue, { data: 0 }), Xf = ie(qf), tv = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, nv = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Wm = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Bi(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = Wm[n]) ? !!r[n] : !1;
  }
  function Jf() {
    return Bi;
  }
  var Zf = ae({}, xt, { key: function(n) {
    if (n.key) {
      var r = tv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = j(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? nv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Jf, charCode: function(n) {
    return n.type === "keypress" ? j(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? j(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), ed = ie(Zf), td = ae({}, hn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), rv = ie(td), sc = ae({}, xt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Jf }), av = ie(sc), Qr = ae({}, Ue, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Ii = ie(Qr), Nn = ae({}, hn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Yi = ie(Nn), nd = [9, 13, 27, 32], ro = Ft && "CompositionEvent" in window, qo = null;
  Ft && "documentMode" in document && (qo = document.documentMode);
  var Xo = Ft && "TextEvent" in window && !qo, iv = Ft && (!ro || qo && 8 < qo && 11 >= qo), lv = " ", cc = !1;
  function uv(n, r) {
    switch (n) {
      case "keyup":
        return nd.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function ov(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var ao = !1;
  function sv(n, r) {
    switch (n) {
      case "compositionend":
        return ov(r);
      case "keypress":
        return r.which !== 32 ? null : (cc = !0, lv);
      case "textInput":
        return n = r.data, n === lv && cc ? null : n;
      default:
        return null;
    }
  }
  function Gm(n, r) {
    if (ao) return n === "compositionend" || !ro && uv(n, r) ? (n = M(), C = h = Za = null, ao = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length) return r.char;
          if (r.which) return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return iv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var Km = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function cv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!Km[n.type] : r === "textarea";
  }
  function rd(n, r, l, o) {
    Fi(o), r = rs(r, "onChange"), 0 < r.length && (l = new dt("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var gi = null, ou = null;
  function fv(n) {
    fu(n, 0);
  }
  function Jo(n) {
    var r = ti(n);
    if (wr(r)) return n;
  }
  function qm(n, r) {
    if (n === "change") return r;
  }
  var dv = !1;
  if (Ft) {
    var ad;
    if (Ft) {
      var id = "oninput" in document;
      if (!id) {
        var pv = document.createElement("div");
        pv.setAttribute("oninput", "return;"), id = typeof pv.oninput == "function";
      }
      ad = id;
    } else ad = !1;
    dv = ad && (!document.documentMode || 9 < document.documentMode);
  }
  function vv() {
    gi && (gi.detachEvent("onpropertychange", hv), ou = gi = null);
  }
  function hv(n) {
    if (n.propertyName === "value" && Jo(ou)) {
      var r = [];
      rd(r, ou, n, It(n)), eu(fv, r);
    }
  }
  function Xm(n, r, l) {
    n === "focusin" ? (vv(), gi = r, ou = l, gi.attachEvent("onpropertychange", hv)) : n === "focusout" && vv();
  }
  function mv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return Jo(ou);
  }
  function Jm(n, r) {
    if (n === "click") return Jo(r);
  }
  function yv(n, r) {
    if (n === "input" || n === "change") return Jo(r);
  }
  function Zm(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ei = typeof Object.is == "function" ? Object.is : Zm;
  function Zo(n, r) {
    if (ei(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length) return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!fe.call(r, c) || !ei(n[c], r[c])) return !1;
    }
    return !0;
  }
  function gv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function fc(n, r) {
    var l = gv(n);
    n = 0;
    for (var o; l; ) {
      if (l.nodeType === 3) {
        if (o = n + l.textContent.length, n <= r && o >= r) return { node: l, offset: r - n };
        n = o;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = gv(l);
    }
  }
  function Rl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? Rl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function es() {
    for (var n = window, r = Cn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = Cn(n.document);
    }
    return r;
  }
  function dc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function io(n) {
    var r = es(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && Rl(l.ownerDocument.documentElement, l)) {
      if (o !== null && dc(l)) {
        if (r = o.start, n = o.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, d = Math.min(o.start, c);
          o = o.end === void 0 ? d : Math.min(o.end, c), !n.extend && d > o && (c = o, o = d, d = c), c = fc(l, d);
          var m = fc(
            l,
            o
          );
          c && m && (n.rangeCount !== 1 || n.anchorNode !== c.node || n.anchorOffset !== c.offset || n.focusNode !== m.node || n.focusOffset !== m.offset) && (r = r.createRange(), r.setStart(c.node, c.offset), n.removeAllRanges(), d > o ? (n.addRange(r), n.extend(m.node, m.offset)) : (r.setEnd(m.node, m.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++) n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var ey = Ft && "documentMode" in document && 11 >= document.documentMode, lo = null, ld = null, ts = null, ud = !1;
  function od(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    ud || lo == null || lo !== Cn(o) || (o = lo, "selectionStart" in o && dc(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), ts && Zo(ts, o) || (ts = o, o = rs(ld, "onSelect"), 0 < o.length && (r = new dt("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = lo)));
  }
  function pc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var su = { animationend: pc("Animation", "AnimationEnd"), animationiteration: pc("Animation", "AnimationIteration"), animationstart: pc("Animation", "AnimationStart"), transitionend: pc("Transition", "TransitionEnd") }, lr = {}, sd = {};
  Ft && (sd = document.createElement("div").style, "AnimationEvent" in window || (delete su.animationend.animation, delete su.animationiteration.animation, delete su.animationstart.animation), "TransitionEvent" in window || delete su.transitionend.transition);
  function vc(n) {
    if (lr[n]) return lr[n];
    if (!su[n]) return n;
    var r = su[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in sd) return lr[n] = r[l];
    return n;
  }
  var Sv = vc("animationend"), Ev = vc("animationiteration"), Cv = vc("animationstart"), Rv = vc("transitionend"), cd = /* @__PURE__ */ new Map(), hc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function _a(n, r) {
    cd.set(n, r), yt(r, [n]);
  }
  for (var fd = 0; fd < hc.length; fd++) {
    var cu = hc[fd], ty = cu.toLowerCase(), ny = cu[0].toUpperCase() + cu.slice(1);
    _a(ty, "on" + ny);
  }
  _a(Sv, "onAnimationEnd"), _a(Ev, "onAnimationIteration"), _a(Cv, "onAnimationStart"), _a("dblclick", "onDoubleClick"), _a("focusin", "onFocus"), _a("focusout", "onBlur"), _a(Rv, "onTransitionEnd"), S("onMouseEnter", ["mouseout", "mouseover"]), S("onMouseLeave", ["mouseout", "mouseover"]), S("onPointerEnter", ["pointerout", "pointerover"]), S("onPointerLeave", ["pointerout", "pointerover"]), yt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), yt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), yt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), yt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), yt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), yt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var ns = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), dd = new Set("cancel close invalid load scroll toggle".split(" ").concat(ns));
  function mc(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, ye(o, r, void 0, n), n.currentTarget = null;
  }
  function fu(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r) for (var m = o.length - 1; 0 <= m; m--) {
          var E = o[m], T = E.instance, z = E.currentTarget;
          if (E = E.listener, T !== d && c.isPropagationStopped()) break e;
          mc(c, E, z), d = T;
        }
        else for (m = 0; m < o.length; m++) {
          if (E = o[m], T = E.instance, z = E.currentTarget, E = E.listener, T !== d && c.isPropagationStopped()) break e;
          mc(c, E, z), d = T;
        }
      }
    }
    if (pi) throw n = R, pi = !1, R = null, n;
  }
  function Vt(n, r) {
    var l = r[ls];
    l === void 0 && (l = r[ls] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (Tv(r, n, 2, !1), l.add(o));
  }
  function yc(n, r, l) {
    var o = 0;
    r && (o |= 4), Tv(l, n, o, r);
  }
  var gc = "_reactListening" + Math.random().toString(36).slice(2);
  function uo(n) {
    if (!n[gc]) {
      n[gc] = !0, wt.forEach(function(l) {
        l !== "selectionchange" && (dd.has(l) || yc(l, !1, n), yc(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[gc] || (r[gc] = !0, yc("selectionchange", !1, r));
    }
  }
  function Tv(n, r, l, o) {
    switch (no(r)) {
      case 1:
        var c = Zu;
        break;
      case 4:
        c = eo;
        break;
      default:
        c = El;
    }
    l = c.bind(null, r, l, n), c = void 0, !_r || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), o ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function Sc(n, r, l, o, c) {
    var d = o;
    if (!(r & 1) && !(r & 2) && o !== null) e: for (; ; ) {
      if (o === null) return;
      var m = o.tag;
      if (m === 3 || m === 4) {
        var E = o.stateNode.containerInfo;
        if (E === c || E.nodeType === 8 && E.parentNode === c) break;
        if (m === 4) for (m = o.return; m !== null; ) {
          var T = m.tag;
          if ((T === 3 || T === 4) && (T = m.stateNode.containerInfo, T === c || T.nodeType === 8 && T.parentNode === c)) return;
          m = m.return;
        }
        for (; E !== null; ) {
          if (m = pu(E), m === null) return;
          if (T = m.tag, T === 5 || T === 6) {
            o = d = m;
            continue e;
          }
          E = E.parentNode;
        }
      }
      o = o.return;
    }
    eu(function() {
      var z = d, $ = It(l), W = [];
      e: {
        var Y = cd.get(n);
        if (Y !== void 0) {
          var pe = dt, ge = n;
          switch (n) {
            case "keypress":
              if (j(l) === 0) break e;
            case "keydown":
            case "keyup":
              pe = ed;
              break;
            case "focusin":
              ge = "focus", pe = uu;
              break;
            case "focusout":
              ge = "blur", pe = uu;
              break;
            case "beforeblur":
            case "afterblur":
              pe = uu;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              pe = Cl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              pe = Pi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              pe = av;
              break;
            case Sv:
            case Ev:
            case Cv:
              pe = oc;
              break;
            case Rv:
              pe = Ii;
              break;
            case "scroll":
              pe = rn;
              break;
            case "wheel":
              pe = Yi;
              break;
            case "copy":
            case "cut":
            case "paste":
              pe = ev;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              pe = rv;
          }
          var Re = (r & 4) !== 0, kn = !Re && n === "scroll", k = Re ? Y !== null ? Y + "Capture" : null : Y;
          Re = [];
          for (var w = z, L; w !== null; ) {
            L = w;
            var Q = L.stateNode;
            if (L.tag === 5 && Q !== null && (L = Q, k !== null && (Q = br(w, k), Q != null && Re.push(oo(w, Q, L)))), kn) break;
            w = w.return;
          }
          0 < Re.length && (Y = new pe(Y, ge, null, l, $), W.push({ event: Y, listeners: Re }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (Y = n === "mouseover" || n === "pointerover", pe = n === "mouseout" || n === "pointerout", Y && l !== tn && (ge = l.relatedTarget || l.fromElement) && (pu(ge) || ge[$i])) break e;
          if ((pe || Y) && (Y = $.window === $ ? $ : (Y = $.ownerDocument) ? Y.defaultView || Y.parentWindow : window, pe ? (ge = l.relatedTarget || l.toElement, pe = z, ge = ge ? pu(ge) : null, ge !== null && (kn = Ke(ge), ge !== kn || ge.tag !== 5 && ge.tag !== 6) && (ge = null)) : (pe = null, ge = z), pe !== ge)) {
            if (Re = Cl, Q = "onMouseLeave", k = "onMouseEnter", w = "mouse", (n === "pointerout" || n === "pointerover") && (Re = rv, Q = "onPointerLeave", k = "onPointerEnter", w = "pointer"), kn = pe == null ? Y : ti(pe), L = ge == null ? Y : ti(ge), Y = new Re(Q, w + "leave", pe, l, $), Y.target = kn, Y.relatedTarget = L, Q = null, pu($) === z && (Re = new Re(k, w + "enter", ge, l, $), Re.target = L, Re.relatedTarget = kn, Q = Re), kn = Q, pe && ge) t: {
              for (Re = pe, k = ge, w = 0, L = Re; L; L = Tl(L)) w++;
              for (L = 0, Q = k; Q; Q = Tl(Q)) L++;
              for (; 0 < w - L; ) Re = Tl(Re), w--;
              for (; 0 < L - w; ) k = Tl(k), L--;
              for (; w--; ) {
                if (Re === k || k !== null && Re === k.alternate) break t;
                Re = Tl(Re), k = Tl(k);
              }
              Re = null;
            }
            else Re = null;
            pe !== null && xv(W, Y, pe, Re, !1), ge !== null && kn !== null && xv(W, kn, ge, Re, !0);
          }
        }
        e: {
          if (Y = z ? ti(z) : window, pe = Y.nodeName && Y.nodeName.toLowerCase(), pe === "select" || pe === "input" && Y.type === "file") var Se = qm;
          else if (cv(Y)) if (dv) Se = yv;
          else {
            Se = mv;
            var ze = Xm;
          }
          else (pe = Y.nodeName) && pe.toLowerCase() === "input" && (Y.type === "checkbox" || Y.type === "radio") && (Se = Jm);
          if (Se && (Se = Se(n, z))) {
            rd(W, Se, l, $);
            break e;
          }
          ze && ze(n, Y, z), n === "focusout" && (ze = Y._wrapperState) && ze.controlled && Y.type === "number" && oa(Y, "number", Y.value);
        }
        switch (ze = z ? ti(z) : window, n) {
          case "focusin":
            (cv(ze) || ze.contentEditable === "true") && (lo = ze, ld = z, ts = null);
            break;
          case "focusout":
            ts = ld = lo = null;
            break;
          case "mousedown":
            ud = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ud = !1, od(W, l, $);
            break;
          case "selectionchange":
            if (ey) break;
          case "keydown":
          case "keyup":
            od(W, l, $);
        }
        var Ae;
        if (ro) e: {
          switch (n) {
            case "compositionstart":
              var Be = "onCompositionStart";
              break e;
            case "compositionend":
              Be = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Be = "onCompositionUpdate";
              break e;
          }
          Be = void 0;
        }
        else ao ? uv(n, l) && (Be = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (Be = "onCompositionStart");
        Be && (iv && l.locale !== "ko" && (ao || Be !== "onCompositionStart" ? Be === "onCompositionEnd" && ao && (Ae = M()) : (Za = $, h = "value" in Za ? Za.value : Za.textContent, ao = !0)), ze = rs(z, Be), 0 < ze.length && (Be = new Xf(Be, n, null, l, $), W.push({ event: Be, listeners: ze }), Ae ? Be.data = Ae : (Ae = ov(l), Ae !== null && (Be.data = Ae)))), (Ae = Xo ? sv(n, l) : Gm(n, l)) && (z = rs(z, "onBeforeInput"), 0 < z.length && ($ = new Xf("onBeforeInput", "beforeinput", null, l, $), W.push({ event: $, listeners: z }), $.data = Ae));
      }
      fu(W, r);
    });
  }
  function oo(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function rs(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = br(n, l), d != null && o.unshift(oo(n, d, c)), d = br(n, r), d != null && o.push(oo(n, d, c))), n = n.return;
    }
    return o;
  }
  function Tl(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function xv(n, r, l, o, c) {
    for (var d = r._reactName, m = []; l !== null && l !== o; ) {
      var E = l, T = E.alternate, z = E.stateNode;
      if (T !== null && T === o) break;
      E.tag === 5 && z !== null && (E = z, c ? (T = br(l, d), T != null && m.unshift(oo(l, T, E))) : c || (T = br(l, d), T != null && m.push(oo(l, T, E)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var wv = /\r\n?/g, ry = /\u0000|\uFFFD/g;
  function bv(n) {
    return (typeof n == "string" ? n : "" + n).replace(wv, `
`).replace(ry, "");
  }
  function Ec(n, r, l) {
    if (r = bv(r), bv(n) !== r && l) throw Error(A(425));
  }
  function xl() {
  }
  var as = null, du = null;
  function Cc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Rc = typeof setTimeout == "function" ? setTimeout : void 0, pd = typeof clearTimeout == "function" ? clearTimeout : void 0, _v = typeof Promise == "function" ? Promise : void 0, so = typeof queueMicrotask == "function" ? queueMicrotask : typeof _v < "u" ? function(n) {
    return _v.resolve(null).then(n).catch(Tc);
  } : Rc;
  function Tc(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function co(n, r) {
    var l = r, o = 0;
    do {
      var c = l.nextSibling;
      if (n.removeChild(l), c && c.nodeType === 8) if (l = c.data, l === "/$") {
        if (o === 0) {
          n.removeChild(c), Ja(r);
          return;
        }
        o--;
      } else l !== "$" && l !== "$?" && l !== "$!" || o++;
      l = c;
    } while (l);
    Ja(r);
  }
  function Si(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3) break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?") break;
        if (r === "/$") return null;
      }
    }
    return n;
  }
  function kv(n) {
    n = n.previousSibling;
    for (var r = 0; n; ) {
      if (n.nodeType === 8) {
        var l = n.data;
        if (l === "$" || l === "$!" || l === "$?") {
          if (r === 0) return n;
          r--;
        } else l === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var wl = Math.random().toString(36).slice(2), Ei = "__reactFiber$" + wl, is = "__reactProps$" + wl, $i = "__reactContainer$" + wl, ls = "__reactEvents$" + wl, fo = "__reactListeners$" + wl, ay = "__reactHandles$" + wl;
  function pu(n) {
    var r = n[Ei];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[$i] || l[Ei]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = kv(n); n !== null; ) {
          if (l = n[Ei]) return l;
          n = kv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function De(n) {
    return n = n[Ei] || n[$i], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ti(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(A(33));
  }
  function mn(n) {
    return n[is] || null;
  }
  var St = [], ka = -1;
  function Da(n) {
    return { current: n };
  }
  function an(n) {
    0 > ka || (n.current = St[ka], St[ka] = null, ka--);
  }
  function _e(n, r) {
    ka++, St[ka] = n.current, n.current = r;
  }
  var Cr = {}, En = Da(Cr), $n = Da(!1), Wr = Cr;
  function Gr(n, r) {
    var l = n.type.contextTypes;
    if (!l) return Cr;
    var o = n.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === r) return o.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l) c[d] = r[d];
    return o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function Mn(n) {
    return n = n.childContextTypes, n != null;
  }
  function po() {
    an($n), an(En);
  }
  function Dv(n, r, l) {
    if (En.current !== Cr) throw Error(A(168));
    _e(En, r), _e($n, l);
  }
  function us(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(A(108, Je(n) || "Unknown", c));
    return ae({}, l, o);
  }
  function Xn(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Cr, Wr = En.current, _e(En, n), _e($n, $n.current), !0;
  }
  function xc(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(A(169));
    l ? (n = us(n, r, Wr), o.__reactInternalMemoizedMergedChildContext = n, an($n), an(En), _e(En, n)) : an($n), _e($n, l);
  }
  var Ci = null, vo = !1, Qi = !1;
  function wc(n) {
    Ci === null ? Ci = [n] : Ci.push(n);
  }
  function bl(n) {
    vo = !0, wc(n);
  }
  function Ri() {
    if (!Qi && Ci !== null) {
      Qi = !0;
      var n = 0, r = Ot;
      try {
        var l = Ci;
        for (Ot = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        Ci = null, vo = !1;
      } catch (c) {
        throw Ci !== null && (Ci = Ci.slice(n + 1)), sn(Ka, Ri), c;
      } finally {
        Ot = r, Qi = !1;
      }
    }
    return null;
  }
  var _l = [], kl = 0, Dl = null, Wi = 0, zn = [], Oa = 0, da = null, Ti = 1, xi = "";
  function vu(n, r) {
    _l[kl++] = Wi, _l[kl++] = Dl, Dl = n, Wi = r;
  }
  function Ov(n, r, l) {
    zn[Oa++] = Ti, zn[Oa++] = xi, zn[Oa++] = da, da = n;
    var o = Ti;
    n = xi;
    var c = 32 - kr(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - kr(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, Ti = 1 << 32 - kr(r) + c | l << c | o, xi = d + n;
    } else Ti = 1 << d | l << c | o, xi = n;
  }
  function bc(n) {
    n.return !== null && (vu(n, 1), Ov(n, 1, 0));
  }
  function _c(n) {
    for (; n === Dl; ) Dl = _l[--kl], _l[kl] = null, Wi = _l[--kl], _l[kl] = null;
    for (; n === da; ) da = zn[--Oa], zn[Oa] = null, xi = zn[--Oa], zn[Oa] = null, Ti = zn[--Oa], zn[Oa] = null;
  }
  var Kr = null, qr = null, dn = !1, La = null;
  function vd(n, r) {
    var l = Aa(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Lv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, Kr = n, qr = Si(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, Kr = n, qr = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = da !== null ? { id: Ti, overflow: xi } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Aa(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, Kr = n, qr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function hd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function md(n) {
    if (dn) {
      var r = qr;
      if (r) {
        var l = r;
        if (!Lv(n, r)) {
          if (hd(n)) throw Error(A(418));
          r = Si(l.nextSibling);
          var o = Kr;
          r && Lv(n, r) ? vd(o, l) : (n.flags = n.flags & -4097 | 2, dn = !1, Kr = n);
        }
      } else {
        if (hd(n)) throw Error(A(418));
        n.flags = n.flags & -4097 | 2, dn = !1, Kr = n;
      }
    }
  }
  function Qn(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    Kr = n;
  }
  function kc(n) {
    if (n !== Kr) return !1;
    if (!dn) return Qn(n), dn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Cc(n.type, n.memoizedProps)), r && (r = qr)) {
      if (hd(n)) throw os(), Error(A(418));
      for (; r; ) vd(n, r), r = Si(r.nextSibling);
    }
    if (Qn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(A(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                qr = Si(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        qr = null;
      }
    } else qr = Kr ? Si(n.stateNode.nextSibling) : null;
    return !0;
  }
  function os() {
    for (var n = qr; n; ) n = Si(n.nextSibling);
  }
  function Ol() {
    qr = Kr = null, dn = !1;
  }
  function Gi(n) {
    La === null ? La = [n] : La.push(n);
  }
  var iy = vt.ReactCurrentBatchConfig;
  function hu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(A(309));
          var o = l.stateNode;
        }
        if (!o) throw Error(A(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(m) {
          var E = c.refs;
          m === null ? delete E[d] : E[d] = m;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(A(284));
      if (!l._owner) throw Error(A(290, n));
    }
    return n;
  }
  function Dc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(A(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Nv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function mu(n) {
    function r(k, w) {
      if (n) {
        var L = k.deletions;
        L === null ? (k.deletions = [w], k.flags |= 16) : L.push(w);
      }
    }
    function l(k, w) {
      if (!n) return null;
      for (; w !== null; ) r(k, w), w = w.sibling;
      return null;
    }
    function o(k, w) {
      for (k = /* @__PURE__ */ new Map(); w !== null; ) w.key !== null ? k.set(w.key, w) : k.set(w.index, w), w = w.sibling;
      return k;
    }
    function c(k, w) {
      return k = Fl(k, w), k.index = 0, k.sibling = null, k;
    }
    function d(k, w, L) {
      return k.index = L, n ? (L = k.alternate, L !== null ? (L = L.index, L < w ? (k.flags |= 2, w) : L) : (k.flags |= 2, w)) : (k.flags |= 1048576, w);
    }
    function m(k) {
      return n && k.alternate === null && (k.flags |= 2), k;
    }
    function E(k, w, L, Q) {
      return w === null || w.tag !== 6 ? (w = Wd(L, k.mode, Q), w.return = k, w) : (w = c(w, L), w.return = k, w);
    }
    function T(k, w, L, Q) {
      var Se = L.type;
      return Se === He ? $(k, w, L.props.children, Q, L.key) : w !== null && (w.elementType === Se || typeof Se == "object" && Se !== null && Se.$$typeof === Dt && Nv(Se) === w.type) ? (Q = c(w, L.props), Q.ref = hu(k, w, L), Q.return = k, Q) : (Q = Fs(L.type, L.key, L.props, null, k.mode, Q), Q.ref = hu(k, w, L), Q.return = k, Q);
    }
    function z(k, w, L, Q) {
      return w === null || w.tag !== 4 || w.stateNode.containerInfo !== L.containerInfo || w.stateNode.implementation !== L.implementation ? (w = sf(L, k.mode, Q), w.return = k, w) : (w = c(w, L.children || []), w.return = k, w);
    }
    function $(k, w, L, Q, Se) {
      return w === null || w.tag !== 7 ? (w = el(L, k.mode, Q, Se), w.return = k, w) : (w = c(w, L), w.return = k, w);
    }
    function W(k, w, L) {
      if (typeof w == "string" && w !== "" || typeof w == "number") return w = Wd("" + w, k.mode, L), w.return = k, w;
      if (typeof w == "object" && w !== null) {
        switch (w.$$typeof) {
          case ke:
            return L = Fs(w.type, w.key, w.props, null, k.mode, L), L.ref = hu(k, null, w), L.return = k, L;
          case ct:
            return w = sf(w, k.mode, L), w.return = k, w;
          case Dt:
            var Q = w._init;
            return W(k, Q(w._payload), L);
        }
        if (Kn(w) || xe(w)) return w = el(w, k.mode, L, null), w.return = k, w;
        Dc(k, w);
      }
      return null;
    }
    function Y(k, w, L, Q) {
      var Se = w !== null ? w.key : null;
      if (typeof L == "string" && L !== "" || typeof L == "number") return Se !== null ? null : E(k, w, "" + L, Q);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case ke:
            return L.key === Se ? T(k, w, L, Q) : null;
          case ct:
            return L.key === Se ? z(k, w, L, Q) : null;
          case Dt:
            return Se = L._init, Y(
              k,
              w,
              Se(L._payload),
              Q
            );
        }
        if (Kn(L) || xe(L)) return Se !== null ? null : $(k, w, L, Q, null);
        Dc(k, L);
      }
      return null;
    }
    function pe(k, w, L, Q, Se) {
      if (typeof Q == "string" && Q !== "" || typeof Q == "number") return k = k.get(L) || null, E(w, k, "" + Q, Se);
      if (typeof Q == "object" && Q !== null) {
        switch (Q.$$typeof) {
          case ke:
            return k = k.get(Q.key === null ? L : Q.key) || null, T(w, k, Q, Se);
          case ct:
            return k = k.get(Q.key === null ? L : Q.key) || null, z(w, k, Q, Se);
          case Dt:
            var ze = Q._init;
            return pe(k, w, L, ze(Q._payload), Se);
        }
        if (Kn(Q) || xe(Q)) return k = k.get(L) || null, $(w, k, Q, Se, null);
        Dc(w, Q);
      }
      return null;
    }
    function ge(k, w, L, Q) {
      for (var Se = null, ze = null, Ae = w, Be = w = 0, er = null; Ae !== null && Be < L.length; Be++) {
        Ae.index > Be ? (er = Ae, Ae = null) : er = Ae.sibling;
        var Mt = Y(k, Ae, L[Be], Q);
        if (Mt === null) {
          Ae === null && (Ae = er);
          break;
        }
        n && Ae && Mt.alternate === null && r(k, Ae), w = d(Mt, w, Be), ze === null ? Se = Mt : ze.sibling = Mt, ze = Mt, Ae = er;
      }
      if (Be === L.length) return l(k, Ae), dn && vu(k, Be), Se;
      if (Ae === null) {
        for (; Be < L.length; Be++) Ae = W(k, L[Be], Q), Ae !== null && (w = d(Ae, w, Be), ze === null ? Se = Ae : ze.sibling = Ae, ze = Ae);
        return dn && vu(k, Be), Se;
      }
      for (Ae = o(k, Ae); Be < L.length; Be++) er = pe(Ae, k, Be, L[Be], Q), er !== null && (n && er.alternate !== null && Ae.delete(er.key === null ? Be : er.key), w = d(er, w, Be), ze === null ? Se = er : ze.sibling = er, ze = er);
      return n && Ae.forEach(function(Pl) {
        return r(k, Pl);
      }), dn && vu(k, Be), Se;
    }
    function Re(k, w, L, Q) {
      var Se = xe(L);
      if (typeof Se != "function") throw Error(A(150));
      if (L = Se.call(L), L == null) throw Error(A(151));
      for (var ze = Se = null, Ae = w, Be = w = 0, er = null, Mt = L.next(); Ae !== null && !Mt.done; Be++, Mt = L.next()) {
        Ae.index > Be ? (er = Ae, Ae = null) : er = Ae.sibling;
        var Pl = Y(k, Ae, Mt.value, Q);
        if (Pl === null) {
          Ae === null && (Ae = er);
          break;
        }
        n && Ae && Pl.alternate === null && r(k, Ae), w = d(Pl, w, Be), ze === null ? Se = Pl : ze.sibling = Pl, ze = Pl, Ae = er;
      }
      if (Mt.done) return l(
        k,
        Ae
      ), dn && vu(k, Be), Se;
      if (Ae === null) {
        for (; !Mt.done; Be++, Mt = L.next()) Mt = W(k, Mt.value, Q), Mt !== null && (w = d(Mt, w, Be), ze === null ? Se = Mt : ze.sibling = Mt, ze = Mt);
        return dn && vu(k, Be), Se;
      }
      for (Ae = o(k, Ae); !Mt.done; Be++, Mt = L.next()) Mt = pe(Ae, k, Be, Mt.value, Q), Mt !== null && (n && Mt.alternate !== null && Ae.delete(Mt.key === null ? Be : Mt.key), w = d(Mt, w, Be), ze === null ? Se = Mt : ze.sibling = Mt, ze = Mt);
      return n && Ae.forEach(function(vh) {
        return r(k, vh);
      }), dn && vu(k, Be), Se;
    }
    function kn(k, w, L, Q) {
      if (typeof L == "object" && L !== null && L.type === He && L.key === null && (L = L.props.children), typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case ke:
            e: {
              for (var Se = L.key, ze = w; ze !== null; ) {
                if (ze.key === Se) {
                  if (Se = L.type, Se === He) {
                    if (ze.tag === 7) {
                      l(k, ze.sibling), w = c(ze, L.props.children), w.return = k, k = w;
                      break e;
                    }
                  } else if (ze.elementType === Se || typeof Se == "object" && Se !== null && Se.$$typeof === Dt && Nv(Se) === ze.type) {
                    l(k, ze.sibling), w = c(ze, L.props), w.ref = hu(k, ze, L), w.return = k, k = w;
                    break e;
                  }
                  l(k, ze);
                  break;
                } else r(k, ze);
                ze = ze.sibling;
              }
              L.type === He ? (w = el(L.props.children, k.mode, Q, L.key), w.return = k, k = w) : (Q = Fs(L.type, L.key, L.props, null, k.mode, Q), Q.ref = hu(k, w, L), Q.return = k, k = Q);
            }
            return m(k);
          case ct:
            e: {
              for (ze = L.key; w !== null; ) {
                if (w.key === ze) if (w.tag === 4 && w.stateNode.containerInfo === L.containerInfo && w.stateNode.implementation === L.implementation) {
                  l(k, w.sibling), w = c(w, L.children || []), w.return = k, k = w;
                  break e;
                } else {
                  l(k, w);
                  break;
                }
                else r(k, w);
                w = w.sibling;
              }
              w = sf(L, k.mode, Q), w.return = k, k = w;
            }
            return m(k);
          case Dt:
            return ze = L._init, kn(k, w, ze(L._payload), Q);
        }
        if (Kn(L)) return ge(k, w, L, Q);
        if (xe(L)) return Re(k, w, L, Q);
        Dc(k, L);
      }
      return typeof L == "string" && L !== "" || typeof L == "number" ? (L = "" + L, w !== null && w.tag === 6 ? (l(k, w.sibling), w = c(w, L), w.return = k, k = w) : (l(k, w), w = Wd(L, k.mode, Q), w.return = k, k = w), m(k)) : l(k, w);
    }
    return kn;
  }
  var xn = mu(!0), oe = mu(!1), pa = Da(null), Xr = null, ho = null, yd = null;
  function gd() {
    yd = ho = Xr = null;
  }
  function Sd(n) {
    var r = pa.current;
    an(pa), n._currentValue = r;
  }
  function Ed(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function yn(n, r) {
    Xr = n, yd = ho = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (An = !0), n.firstContext = null);
  }
  function Na(n) {
    var r = n._currentValue;
    if (yd !== n) if (n = { context: n, memoizedValue: r, next: null }, ho === null) {
      if (Xr === null) throw Error(A(308));
      ho = n, Xr.dependencies = { lanes: 0, firstContext: n };
    } else ho = ho.next = n;
    return r;
  }
  var yu = null;
  function Cd(n) {
    yu === null ? yu = [n] : yu.push(n);
  }
  function Rd(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Cd(r)) : (l.next = c.next, c.next = l), r.interleaved = l, va(n, o);
  }
  function va(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var ha = !1;
  function Td(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Mv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Ki(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ll(n, r, l) {
    var o = n.updateQueue;
    if (o === null) return null;
    if (o = o.shared, Et & 2) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, va(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, Cd(o)) : (r.next = c.next, c.next = r), o.interleaved = r, va(n, l);
  }
  function Oc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  function zv(n, r) {
    var l = n.updateQueue, o = n.alternate;
    if (o !== null && (o = o.updateQueue, l === o)) {
      var c = null, d = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var m = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          d === null ? c = d = m : d = d.next = m, l = l.next;
        } while (l !== null);
        d === null ? c = d = r : d = d.next = r;
      } else c = d = r;
      l = { baseState: o.baseState, firstBaseUpdate: c, lastBaseUpdate: d, shared: o.shared, effects: o.effects }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function ss(n, r, l, o) {
    var c = n.updateQueue;
    ha = !1;
    var d = c.firstBaseUpdate, m = c.lastBaseUpdate, E = c.shared.pending;
    if (E !== null) {
      c.shared.pending = null;
      var T = E, z = T.next;
      T.next = null, m === null ? d = z : m.next = z, m = T;
      var $ = n.alternate;
      $ !== null && ($ = $.updateQueue, E = $.lastBaseUpdate, E !== m && (E === null ? $.firstBaseUpdate = z : E.next = z, $.lastBaseUpdate = T));
    }
    if (d !== null) {
      var W = c.baseState;
      m = 0, $ = z = T = null, E = d;
      do {
        var Y = E.lane, pe = E.eventTime;
        if ((o & Y) === Y) {
          $ !== null && ($ = $.next = {
            eventTime: pe,
            lane: 0,
            tag: E.tag,
            payload: E.payload,
            callback: E.callback,
            next: null
          });
          e: {
            var ge = n, Re = E;
            switch (Y = r, pe = l, Re.tag) {
              case 1:
                if (ge = Re.payload, typeof ge == "function") {
                  W = ge.call(pe, W, Y);
                  break e;
                }
                W = ge;
                break e;
              case 3:
                ge.flags = ge.flags & -65537 | 128;
              case 0:
                if (ge = Re.payload, Y = typeof ge == "function" ? ge.call(pe, W, Y) : ge, Y == null) break e;
                W = ae({}, W, Y);
                break e;
              case 2:
                ha = !0;
            }
          }
          E.callback !== null && E.lane !== 0 && (n.flags |= 64, Y = c.effects, Y === null ? c.effects = [E] : Y.push(E));
        } else pe = { eventTime: pe, lane: Y, tag: E.tag, payload: E.payload, callback: E.callback, next: null }, $ === null ? (z = $ = pe, T = W) : $ = $.next = pe, m |= Y;
        if (E = E.next, E === null) {
          if (E = c.shared.pending, E === null) break;
          Y = E, E = Y.next, Y.next = null, c.lastBaseUpdate = Y, c.shared.pending = null;
        }
      } while (!0);
      if ($ === null && (T = W), c.baseState = T, c.firstBaseUpdate = z, c.lastBaseUpdate = $, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Di |= m, n.lanes = m, n.memoizedState = W;
    }
  }
  function xd(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(A(191, c));
        c.call(o);
      }
    }
  }
  var cs = {}, wi = Da(cs), fs = Da(cs), ds = Da(cs);
  function gu(n) {
    if (n === cs) throw Error(A(174));
    return n;
  }
  function wd(n, r) {
    switch (_e(ds, r), _e(fs, n), _e(wi, cs), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : sa(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = sa(r, n);
    }
    an(wi), _e(wi, r);
  }
  function Su() {
    an(wi), an(fs), an(ds);
  }
  function Uv(n) {
    gu(ds.current);
    var r = gu(wi.current), l = sa(r, n.type);
    r !== l && (_e(fs, n), _e(wi, l));
  }
  function Lc(n) {
    fs.current === n && (an(wi), an(fs));
  }
  var gn = Da(0);
  function Nc(n) {
    for (var r = n; r !== null; ) {
      if (r.tag === 13) {
        var l = r.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || l.data === "$!")) return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if (r.flags & 128) return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === n) return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var ps = [];
  function Oe() {
    for (var n = 0; n < ps.length; n++) ps[n]._workInProgressVersionPrimary = null;
    ps.length = 0;
  }
  var ot = vt.ReactCurrentDispatcher, Lt = vt.ReactCurrentBatchConfig, Gt = 0, Nt = null, Un = null, Jn = null, Mc = !1, vs = !1, Eu = 0, I = 0;
  function kt() {
    throw Error(A(321));
  }
  function Fe(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ei(n[l], r[l])) return !1;
    return !0;
  }
  function Nl(n, r, l, o, c, d) {
    if (Gt = d, Nt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, ot.current = n === null || n.memoizedState === null ? Gc : Es, n = l(o, c), vs) {
      d = 0;
      do {
        if (vs = !1, Eu = 0, 25 <= d) throw Error(A(301));
        d += 1, Jn = Un = null, r.updateQueue = null, ot.current = Kc, n = l(o, c);
      } while (vs);
    }
    if (ot.current = wu, r = Un !== null && Un.next !== null, Gt = 0, Jn = Un = Nt = null, Mc = !1, r) throw Error(A(300));
    return n;
  }
  function ni() {
    var n = Eu !== 0;
    return Eu = 0, n;
  }
  function Rr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Jn === null ? Nt.memoizedState = Jn = n : Jn = Jn.next = n, Jn;
  }
  function wn() {
    if (Un === null) {
      var n = Nt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Un.next;
    var r = Jn === null ? Nt.memoizedState : Jn.next;
    if (r !== null) Jn = r, Un = n;
    else {
      if (n === null) throw Error(A(310));
      Un = n, n = { memoizedState: Un.memoizedState, baseState: Un.baseState, baseQueue: Un.baseQueue, queue: Un.queue, next: null }, Jn === null ? Nt.memoizedState = Jn = n : Jn = Jn.next = n;
    }
    return Jn;
  }
  function qi(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Ml(n) {
    var r = wn(), l = r.queue;
    if (l === null) throw Error(A(311));
    l.lastRenderedReducer = n;
    var o = Un, c = o.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var m = c.next;
        c.next = d.next, d.next = m;
      }
      o.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, o = o.baseState;
      var E = m = null, T = null, z = d;
      do {
        var $ = z.lane;
        if ((Gt & $) === $) T !== null && (T = T.next = { lane: 0, action: z.action, hasEagerState: z.hasEagerState, eagerState: z.eagerState, next: null }), o = z.hasEagerState ? z.eagerState : n(o, z.action);
        else {
          var W = {
            lane: $,
            action: z.action,
            hasEagerState: z.hasEagerState,
            eagerState: z.eagerState,
            next: null
          };
          T === null ? (E = T = W, m = o) : T = T.next = W, Nt.lanes |= $, Di |= $;
        }
        z = z.next;
      } while (z !== null && z !== d);
      T === null ? m = o : T.next = E, ei(o, r.memoizedState) || (An = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = T, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, Nt.lanes |= d, Di |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function Cu(n) {
    var r = wn(), l = r.queue;
    if (l === null) throw Error(A(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var m = c = c.next;
      do
        d = n(d, m.action), m = m.next;
      while (m !== c);
      ei(d, r.memoizedState) || (An = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, o];
  }
  function zc() {
  }
  function Uc(n, r) {
    var l = Nt, o = wn(), c = r(), d = !ei(o.memoizedState, c);
    if (d && (o.memoizedState = c, An = !0), o = o.queue, hs(Fc.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || Jn !== null && Jn.memoizedState.tag & 1) {
      if (l.flags |= 2048, Ru(9, jc.bind(null, l, o, c, r), void 0, null), Wn === null) throw Error(A(349));
      Gt & 30 || Ac(l, r, c);
    }
    return c;
  }
  function Ac(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = Nt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Nt.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function jc(n, r, l, o) {
    r.value = l, r.getSnapshot = o, Hc(r) && Vc(n);
  }
  function Fc(n, r, l) {
    return l(function() {
      Hc(r) && Vc(n);
    });
  }
  function Hc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ei(n, l);
    } catch {
      return !0;
    }
  }
  function Vc(n) {
    var r = va(n, 1);
    r !== null && zr(r, n, 1, -1);
  }
  function Pc(n) {
    var r = Rr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: qi, lastRenderedState: n }, r.queue = n, n = n.dispatch = xu.bind(null, Nt, n), [r.memoizedState, n];
  }
  function Ru(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = Nt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Nt.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Bc() {
    return wn().memoizedState;
  }
  function mo(n, r, l, o) {
    var c = Rr();
    Nt.flags |= n, c.memoizedState = Ru(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function yo(n, r, l, o) {
    var c = wn();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (Un !== null) {
      var m = Un.memoizedState;
      if (d = m.destroy, o !== null && Fe(o, m.deps)) {
        c.memoizedState = Ru(r, l, d, o);
        return;
      }
    }
    Nt.flags |= n, c.memoizedState = Ru(1 | r, l, d, o);
  }
  function Ic(n, r) {
    return mo(8390656, 8, n, r);
  }
  function hs(n, r) {
    return yo(2048, 8, n, r);
  }
  function Yc(n, r) {
    return yo(4, 2, n, r);
  }
  function ms(n, r) {
    return yo(4, 4, n, r);
  }
  function Tu(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function $c(n, r, l) {
    return l = l != null ? l.concat([n]) : null, yo(4, 4, Tu.bind(null, r, n), l);
  }
  function ys() {
  }
  function Qc(n, r) {
    var l = wn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && Fe(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function Wc(n, r) {
    var l = wn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && Fe(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function bd(n, r, l) {
    return Gt & 21 ? (ei(l, r) || (l = Ku(), Nt.lanes |= l, Di |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, An = !0), n.memoizedState = l);
  }
  function gs(n, r) {
    var l = Ot;
    Ot = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Lt.transition;
    Lt.transition = {};
    try {
      n(!1), r();
    } finally {
      Ot = l, Lt.transition = o;
    }
  }
  function _d() {
    return wn().memoizedState;
  }
  function Ss(n, r, l) {
    var o = Oi(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, Jr(n)) Av(r, l);
    else if (l = Rd(n, r, l, o), l !== null) {
      var c = Hn();
      zr(l, n, o, c), Xt(l, r, o);
    }
  }
  function xu(n, r, l) {
    var o = Oi(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Jr(n)) Av(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var m = r.lastRenderedState, E = d(m, l);
        if (c.hasEagerState = !0, c.eagerState = E, ei(E, m)) {
          var T = r.interleaved;
          T === null ? (c.next = c, Cd(r)) : (c.next = T.next, T.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = Rd(n, r, c, o), l !== null && (c = Hn(), zr(l, n, o, c), Xt(l, r, o));
    }
  }
  function Jr(n) {
    var r = n.alternate;
    return n === Nt || r !== null && r === Nt;
  }
  function Av(n, r) {
    vs = Mc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function Xt(n, r, l) {
    if (l & 4194240) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  var wu = { readContext: Na, useCallback: kt, useContext: kt, useEffect: kt, useImperativeHandle: kt, useInsertionEffect: kt, useLayoutEffect: kt, useMemo: kt, useReducer: kt, useRef: kt, useState: kt, useDebugValue: kt, useDeferredValue: kt, useTransition: kt, useMutableSource: kt, useSyncExternalStore: kt, useId: kt, unstable_isNewReconciler: !1 }, Gc = { readContext: Na, useCallback: function(n, r) {
    return Rr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Na, useEffect: Ic, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, mo(
      4194308,
      4,
      Tu.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return mo(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return mo(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = Rr();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var o = Rr();
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = Ss.bind(null, Nt, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = Rr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Pc, useDebugValue: ys, useDeferredValue: function(n) {
    return Rr().memoizedState = n;
  }, useTransition: function() {
    var n = Pc(!1), r = n[0];
    return n = gs.bind(null, n[1]), Rr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = Nt, c = Rr();
    if (dn) {
      if (l === void 0) throw Error(A(407));
      l = l();
    } else {
      if (l = r(), Wn === null) throw Error(A(349));
      Gt & 30 || Ac(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Ic(Fc.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, Ru(9, jc.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = Rr(), r = Wn.identifierPrefix;
    if (dn) {
      var l = xi, o = Ti;
      l = (o & ~(1 << 32 - kr(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Eu++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = I++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Es = {
    readContext: Na,
    useCallback: Qc,
    useContext: Na,
    useEffect: hs,
    useImperativeHandle: $c,
    useInsertionEffect: Yc,
    useLayoutEffect: ms,
    useMemo: Wc,
    useReducer: Ml,
    useRef: Bc,
    useState: function() {
      return Ml(qi);
    },
    useDebugValue: ys,
    useDeferredValue: function(n) {
      var r = wn();
      return bd(r, Un.memoizedState, n);
    },
    useTransition: function() {
      var n = Ml(qi)[0], r = wn().memoizedState;
      return [n, r];
    },
    useMutableSource: zc,
    useSyncExternalStore: Uc,
    useId: _d,
    unstable_isNewReconciler: !1
  }, Kc = { readContext: Na, useCallback: Qc, useContext: Na, useEffect: hs, useImperativeHandle: $c, useInsertionEffect: Yc, useLayoutEffect: ms, useMemo: Wc, useReducer: Cu, useRef: Bc, useState: function() {
    return Cu(qi);
  }, useDebugValue: ys, useDeferredValue: function(n) {
    var r = wn();
    return Un === null ? r.memoizedState = n : bd(r, Un.memoizedState, n);
  }, useTransition: function() {
    var n = Cu(qi)[0], r = wn().memoizedState;
    return [n, r];
  }, useMutableSource: zc, useSyncExternalStore: Uc, useId: _d, unstable_isNewReconciler: !1 };
  function ri(n, r) {
    if (n && n.defaultProps) {
      r = ae({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function kd(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : ae({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var qc = { isMounted: function(n) {
    return (n = n._reactInternals) ? Ke(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Hn(), c = Oi(n), d = Ki(o, c);
    d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (zr(r, n, c, o), Oc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Hn(), c = Oi(n), d = Ki(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (zr(r, n, c, o), Oc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Hn(), o = Oi(n), c = Ki(l, o);
    c.tag = 2, r != null && (c.callback = r), r = Ll(n, c, o), r !== null && (zr(r, n, o, l), Oc(r, n, o));
  } };
  function jv(n, r, l, o, c, d, m) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, m) : r.prototype && r.prototype.isPureReactComponent ? !Zo(l, o) || !Zo(c, d) : !0;
  }
  function Xc(n, r, l) {
    var o = !1, c = Cr, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Na(d) : (c = Mn(r) ? Wr : En.current, o = r.contextTypes, d = (o = o != null) ? Gr(n, c) : Cr), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = qc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Fv(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && qc.enqueueReplaceState(r, r.state, null);
  }
  function Cs(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, Td(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Na(d) : (d = Mn(r) ? Wr : En.current, c.context = Gr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (kd(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && qc.enqueueReplaceState(c, c.state, null), ss(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function bu(n, r) {
    try {
      var l = "", o = r;
      do
        l += it(o), o = o.return;
      while (o);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function Dd(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function Od(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var Jc = typeof WeakMap == "function" ? WeakMap : Map;
  function Hv(n, r, l) {
    l = Ki(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      To || (To = !0, Du = o), Od(n, r);
    }, l;
  }
  function Ld(n, r, l) {
    l = Ki(-1, l), l.tag = 3;
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      l.payload = function() {
        return o(c);
      }, l.callback = function() {
        Od(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      Od(n, r), typeof o != "function" && (Al === null ? Al = /* @__PURE__ */ new Set([this]) : Al.add(this));
      var m = r.stack;
      this.componentDidCatch(r.value, { componentStack: m !== null ? m : "" });
    }), l;
  }
  function Nd(n, r, l) {
    var o = n.pingCache;
    if (o === null) {
      o = n.pingCache = new Jc();
      var c = /* @__PURE__ */ new Set();
      o.set(r, c);
    } else c = o.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), o.set(r, c));
    c.has(l) || (c.add(l), n = dy.bind(null, n, r, l), r.then(n, n));
  }
  function Vv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function zl(n, r, l, o, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Ki(-1, 1), r.tag = 2, Ll(l, r, 1))), l.lanes |= 1), n);
  }
  var Rs = vt.ReactCurrentOwner, An = !1;
  function ur(n, r, l, o) {
    r.child = n === null ? oe(r, null, l, o) : xn(r, n.child, l, o);
  }
  function Zr(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return yn(r, c), o = Nl(n, r, l, o, d, c), l = ni(), n !== null && !An ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, za(n, r, c)) : (dn && l && bc(r), r.flags |= 1, ur(n, r, o, c), r.child);
  }
  function _u(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !Qd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, Xe(n, r, d, o, c)) : (n = Fs(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, !(n.lanes & c)) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Zo, l(m, o) && n.ref === r.ref) return za(n, r, c);
    }
    return r.flags |= 1, n = Fl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function Xe(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (Zo(d, o) && n.ref === r.ref) if (An = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) n.flags & 131072 && (An = !0);
      else return r.lanes = n.lanes, za(n, r, c);
    }
    return Pv(n, r, l, o, c);
  }
  function Ts(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, _e(Eo, ma), ma |= l;
    else {
      if (!(l & 1073741824)) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, _e(Eo, ma), ma |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, _e(Eo, ma), ma |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, _e(Eo, ma), ma |= o;
    return ur(n, r, c, l), r.child;
  }
  function Md(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Pv(n, r, l, o, c) {
    var d = Mn(l) ? Wr : En.current;
    return d = Gr(r, d), yn(r, c), l = Nl(n, r, l, o, d, c), o = ni(), n !== null && !An ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, za(n, r, c)) : (dn && o && bc(r), r.flags |= 1, ur(n, r, l, c), r.child);
  }
  function Bv(n, r, l, o, c) {
    if (Mn(l)) {
      var d = !0;
      Xn(r);
    } else d = !1;
    if (yn(r, c), r.stateNode === null) Ma(n, r), Xc(r, l, o), Cs(r, l, o, c), o = !0;
    else if (n === null) {
      var m = r.stateNode, E = r.memoizedProps;
      m.props = E;
      var T = m.context, z = l.contextType;
      typeof z == "object" && z !== null ? z = Na(z) : (z = Mn(l) ? Wr : En.current, z = Gr(r, z));
      var $ = l.getDerivedStateFromProps, W = typeof $ == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      W || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== o || T !== z) && Fv(r, m, o, z), ha = !1;
      var Y = r.memoizedState;
      m.state = Y, ss(r, o, m, c), T = r.memoizedState, E !== o || Y !== T || $n.current || ha ? (typeof $ == "function" && (kd(r, l, $, o), T = r.memoizedState), (E = ha || jv(r, l, E, o, Y, T, z)) ? (W || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = T), m.props = o, m.state = T, m.context = z, o = E) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, Mv(n, r), E = r.memoizedProps, z = r.type === r.elementType ? E : ri(r.type, E), m.props = z, W = r.pendingProps, Y = m.context, T = l.contextType, typeof T == "object" && T !== null ? T = Na(T) : (T = Mn(l) ? Wr : En.current, T = Gr(r, T));
      var pe = l.getDerivedStateFromProps;
      ($ = typeof pe == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== W || Y !== T) && Fv(r, m, o, T), ha = !1, Y = r.memoizedState, m.state = Y, ss(r, o, m, c);
      var ge = r.memoizedState;
      E !== W || Y !== ge || $n.current || ha ? (typeof pe == "function" && (kd(r, l, pe, o), ge = r.memoizedState), (z = ha || jv(r, l, z, o, Y, ge, T) || !1) ? ($ || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, ge, T), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, ge, T)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && Y === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && Y === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = ge), m.props = o, m.state = ge, m.context = T, o = z) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && Y === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && Y === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return xs(n, r, l, o, d, c);
  }
  function xs(n, r, l, o, c, d) {
    Md(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m) return c && xc(r, l, !1), za(n, r, d);
    o = r.stateNode, Rs.current = r;
    var E = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = xn(r, n.child, null, d), r.child = xn(r, null, E, d)) : ur(n, r, E, d), r.memoizedState = o.state, c && xc(r, l, !0), r.child;
  }
  function go(n) {
    var r = n.stateNode;
    r.pendingContext ? Dv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Dv(n, r.context, !1), wd(n, r.containerInfo);
  }
  function Iv(n, r, l, o, c) {
    return Ol(), Gi(c), r.flags |= 256, ur(n, r, l, o), r.child;
  }
  var Zc = { dehydrated: null, treeContext: null, retryLane: 0 };
  function zd(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function ef(n, r, l) {
    var o = r.pendingProps, c = gn.current, d = !1, m = (r.flags & 128) !== 0, E;
    if ((E = m) || (E = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), E ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), _e(gn, c & 1), n === null)
      return md(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, !(o & 1) && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Hl(m, o, 0, null), n = el(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = zd(l), r.memoizedState = Zc, n) : Ud(r, m));
    if (c = n.memoizedState, c !== null && (E = c.dehydrated, E !== null)) return Yv(n, r, m, o, E, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, E = c.sibling;
      var T = { mode: "hidden", children: o.children };
      return !(m & 1) && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = T, r.deletions = null) : (o = Fl(c, T), o.subtreeFlags = c.subtreeFlags & 14680064), E !== null ? d = Fl(E, d) : (d = el(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? zd(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = Zc, o;
    }
    return d = n.child, n = d.sibling, o = Fl(d, { mode: "visible", children: o.children }), !(r.mode & 1) && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function Ud(n, r) {
    return r = Hl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function ws(n, r, l, o) {
    return o !== null && Gi(o), xn(r, n.child, null, l), n = Ud(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Yv(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = Dd(Error(A(422))), ws(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Hl({ mode: "visible", children: o.children }, c, 0, null), d = el(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, r.mode & 1 && xn(r, n.child, null, m), r.child.memoizedState = zd(m), r.memoizedState = Zc, d);
    if (!(r.mode & 1)) return ws(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var E = o.dgst;
      return o = E, d = Error(A(419)), o = Dd(d, o, void 0), ws(n, r, m, o);
    }
    if (E = (m & n.childLanes) !== 0, An || E) {
      if (o = Wn, o !== null) {
        switch (m & -m) {
          case 4:
            c = 2;
            break;
          case 16:
            c = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            c = 32;
            break;
          case 536870912:
            c = 268435456;
            break;
          default:
            c = 0;
        }
        c = c & (o.suspendedLanes | m) ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, va(n, c), zr(o, n, c, -1));
      }
      return $d(), o = Dd(Error(A(421))), ws(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = py.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, qr = Si(c.nextSibling), Kr = r, dn = !0, La = null, n !== null && (zn[Oa++] = Ti, zn[Oa++] = xi, zn[Oa++] = da, Ti = n.id, xi = n.overflow, da = r), r = Ud(r, o.children), r.flags |= 4096, r);
  }
  function Ad(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), Ed(n.return, r, l);
  }
  function Lr(n, r, l, o, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: o, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = l, d.tailMode = c);
  }
  function bi(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, d = o.tail;
    if (ur(n, r, o.children, l), o = gn.current, o & 2) o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Ad(n, l, r);
        else if (n.tag === 19) Ad(n, l, r);
        else if (n.child !== null) {
          n.child.return = n, n = n.child;
          continue;
        }
        if (n === r) break e;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === r) break e;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
      o &= 1;
    }
    if (_e(gn, o), !(r.mode & 1)) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Nc(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Lr(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Nc(n) === null) {
            r.child = c;
            break;
          }
          n = c.sibling, c.sibling = l, l = c, c = n;
        }
        Lr(r, !0, l, null, d);
        break;
      case "together":
        Lr(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Ma(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function za(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Di |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(A(153));
    if (r.child !== null) {
      for (n = r.child, l = Fl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Fl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function bs(n, r, l) {
    switch (r.tag) {
      case 3:
        go(r), Ol();
        break;
      case 5:
        Uv(r);
        break;
      case 1:
        Mn(r.type) && Xn(r);
        break;
      case 4:
        wd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        _e(pa, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (_e(gn, gn.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? ef(n, r, l) : (_e(gn, gn.current & 1), n = za(n, r, l), n !== null ? n.sibling : null);
        _e(gn, gn.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, n.flags & 128) {
          if (o) return bi(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), _e(gn, gn.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Ts(n, r, l);
    }
    return za(n, r, l);
  }
  var Ua, jn, $v, Qv;
  Ua = function(n, r) {
    for (var l = r.child; l !== null; ) {
      if (l.tag === 5 || l.tag === 6) n.appendChild(l.stateNode);
      else if (l.tag !== 4 && l.child !== null) {
        l.child.return = l, l = l.child;
        continue;
      }
      if (l === r) break;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === r) return;
        l = l.return;
      }
      l.sibling.return = l.return, l = l.sibling;
    }
  }, jn = function() {
  }, $v = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, gu(wi.current);
      var d = null;
      switch (l) {
        case "input":
          c = nr(n, c), o = nr(n, o), d = [];
          break;
        case "select":
          c = ae({}, c, { value: void 0 }), o = ae({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = In(n, c), o = In(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = xl);
      }
      on(l, o);
      var m;
      l = null;
      for (z in c) if (!o.hasOwnProperty(z) && c.hasOwnProperty(z) && c[z] != null) if (z === "style") {
        var E = c[z];
        for (m in E) E.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
      } else z !== "dangerouslySetInnerHTML" && z !== "children" && z !== "suppressContentEditableWarning" && z !== "suppressHydrationWarning" && z !== "autoFocus" && (mt.hasOwnProperty(z) ? d || (d = []) : (d = d || []).push(z, null));
      for (z in o) {
        var T = o[z];
        if (E = c != null ? c[z] : void 0, o.hasOwnProperty(z) && T !== E && (T != null || E != null)) if (z === "style") if (E) {
          for (m in E) !E.hasOwnProperty(m) || T && T.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
          for (m in T) T.hasOwnProperty(m) && E[m] !== T[m] && (l || (l = {}), l[m] = T[m]);
        } else l || (d || (d = []), d.push(
          z,
          l
        )), l = T;
        else z === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, E = E ? E.__html : void 0, T != null && E !== T && (d = d || []).push(z, T)) : z === "children" ? typeof T != "string" && typeof T != "number" || (d = d || []).push(z, "" + T) : z !== "suppressContentEditableWarning" && z !== "suppressHydrationWarning" && (mt.hasOwnProperty(z) ? (T != null && z === "onScroll" && Vt("scroll", n), d || E === T || (d = [])) : (d = d || []).push(z, T));
      }
      l && (d = d || []).push("style", l);
      var z = d;
      (r.updateQueue = z) && (r.flags |= 4);
    }
  }, Qv = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function _s(n, r) {
    if (!dn) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var l = null; r !== null; ) r.alternate !== null && (l = r), r = r.sibling;
        l === null ? n.tail = null : l.sibling = null;
        break;
      case "collapsed":
        l = n.tail;
        for (var o = null; l !== null; ) l.alternate !== null && (o = l), l = l.sibling;
        o === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : o.sibling = null;
    }
  }
  function Zn(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, o = 0;
    if (r) for (var c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags & 14680064, o |= c.flags & 14680064, c.return = n, c = c.sibling;
    else for (c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags, o |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= o, n.childLanes = l, r;
  }
  function Wv(n, r, l) {
    var o = r.pendingProps;
    switch (_c(r), r.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Zn(r), null;
      case 1:
        return Mn(r.type) && po(), Zn(r), null;
      case 3:
        return o = r.stateNode, Su(), an($n), an(En), Oe(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (kc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, La !== null && (Ou(La), La = null))), jn(n, r), Zn(r), null;
      case 5:
        Lc(r);
        var c = gu(ds.current);
        if (l = r.type, n !== null && r.stateNode != null) $v(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(A(166));
            return Zn(r), null;
          }
          if (n = gu(wi.current), kc(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[Ei] = r, o[is] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                Vt("cancel", o), Vt("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                Vt("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < ns.length; c++) Vt(ns[c], o);
                break;
              case "source":
                Vt("error", o);
                break;
              case "img":
              case "image":
              case "link":
                Vt(
                  "error",
                  o
                ), Vt("load", o);
                break;
              case "details":
                Vt("toggle", o);
                break;
              case "input":
                Pn(o, d), Vt("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, Vt("invalid", o);
                break;
              case "textarea":
                gr(o, d), Vt("invalid", o);
            }
            on(l, d), c = null;
            for (var m in d) if (d.hasOwnProperty(m)) {
              var E = d[m];
              m === "children" ? typeof E == "string" ? o.textContent !== E && (d.suppressHydrationWarning !== !0 && Ec(o.textContent, E, n), c = ["children", E]) : typeof E == "number" && o.textContent !== "" + E && (d.suppressHydrationWarning !== !0 && Ec(
                o.textContent,
                E,
                n
              ), c = ["children", "" + E]) : mt.hasOwnProperty(m) && E != null && m === "onScroll" && Vt("scroll", o);
            }
            switch (l) {
              case "input":
                On(o), si(o, d, !0);
                break;
              case "textarea":
                On(o), Ln(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = xl);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            m = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Sr(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = m.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = m.createElement(l, { is: o.is }) : (n = m.createElement(l), l === "select" && (m = n, o.multiple ? m.multiple = !0 : o.size && (m.size = o.size))) : n = m.createElementNS(n, l), n[Ei] = r, n[is] = o, Ua(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (m = qn(l, o), l) {
                case "dialog":
                  Vt("cancel", n), Vt("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Vt("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < ns.length; c++) Vt(ns[c], n);
                  c = o;
                  break;
                case "source":
                  Vt("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  Vt(
                    "error",
                    n
                  ), Vt("load", n), c = o;
                  break;
                case "details":
                  Vt("toggle", n), c = o;
                  break;
                case "input":
                  Pn(n, o), c = nr(n, o), Vt("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = ae({}, o, { value: void 0 }), Vt("invalid", n);
                  break;
                case "textarea":
                  gr(n, o), c = In(n, o), Vt("invalid", n);
                  break;
                default:
                  c = o;
              }
              on(l, c), E = c;
              for (d in E) if (E.hasOwnProperty(d)) {
                var T = E[d];
                d === "style" ? en(n, T) : d === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, T != null && ci(n, T)) : d === "children" ? typeof T == "string" ? (l !== "textarea" || T !== "") && te(n, T) : typeof T == "number" && te(n, "" + T) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (mt.hasOwnProperty(d) ? T != null && d === "onScroll" && Vt("scroll", n) : T != null && We(n, d, T, m));
              }
              switch (l) {
                case "input":
                  On(n), si(n, o, !1);
                  break;
                case "textarea":
                  On(n), Ln(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + nt(o.value));
                  break;
                case "select":
                  n.multiple = !!o.multiple, d = o.value, d != null ? Rn(n, !!o.multiple, d, !1) : o.defaultValue != null && Rn(
                    n,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = xl);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o = !!o.autoFocus;
                  break e;
                case "img":
                  o = !0;
                  break e;
                default:
                  o = !1;
              }
            }
            o && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return Zn(r), null;
      case 6:
        if (n && r.stateNode != null) Qv(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null) throw Error(A(166));
          if (l = gu(ds.current), gu(wi.current), kc(r)) {
            if (o = r.stateNode, l = r.memoizedProps, o[Ei] = r, (d = o.nodeValue !== l) && (n = Kr, n !== null)) switch (n.tag) {
              case 3:
                Ec(o.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && Ec(o.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else o = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(o), o[Ei] = r, r.stateNode = o;
        }
        return Zn(r), null;
      case 13:
        if (an(gn), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (dn && qr !== null && r.mode & 1 && !(r.flags & 128)) os(), Ol(), r.flags |= 98560, d = !1;
          else if (d = kc(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(A(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(A(317));
              d[Ei] = r;
            } else Ol(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            Zn(r), d = !1;
          } else La !== null && (Ou(La), La = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, r.mode & 1 && (n === null || gn.current & 1 ? _n === 0 && (_n = 3) : $d())), r.updateQueue !== null && (r.flags |= 4), Zn(r), null);
      case 4:
        return Su(), jn(n, r), n === null && uo(r.stateNode.containerInfo), Zn(r), null;
      case 10:
        return Sd(r.type._context), Zn(r), null;
      case 17:
        return Mn(r.type) && po(), Zn(r), null;
      case 19:
        if (an(gn), d = r.memoizedState, d === null) return Zn(r), null;
        if (o = (r.flags & 128) !== 0, m = d.rendering, m === null) if (o) _s(d, !1);
        else {
          if (_n !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (m = Nc(n), m !== null) {
              for (r.flags |= 128, _s(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return _e(gn, gn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && qe() > Ro && (r.flags |= 128, o = !0, _s(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Nc(m), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), _s(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !dn) return Zn(r), null;
          } else 2 * qe() - d.renderingStartTime > Ro && l !== 1073741824 && (r.flags |= 128, o = !0, _s(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = qe(), r.sibling = null, l = gn.current, _e(gn, o ? l & 1 | 2 : l & 1), r) : (Zn(r), null);
      case 22:
      case 23:
        return Yd(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && r.mode & 1 ? ma & 1073741824 && (Zn(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : Zn(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(A(156, r.tag));
  }
  function tf(n, r) {
    switch (_c(r), r.tag) {
      case 1:
        return Mn(r.type) && po(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Su(), an($n), an(En), Oe(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Lc(r), null;
      case 13:
        if (an(gn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(A(340));
          Ol();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return an(gn), null;
      case 4:
        return Su(), null;
      case 10:
        return Sd(r.type._context), null;
      case 22:
      case 23:
        return Yd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ks = !1, Tr = !1, ly = typeof WeakSet == "function" ? WeakSet : Set, me = null;
  function So(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (o) {
      pn(n, r, o);
    }
    else l.current = null;
  }
  function nf(n, r, l) {
    try {
      l();
    } catch (o) {
      pn(n, r, o);
    }
  }
  var Gv = !1;
  function Kv(n, r) {
    if (as = ba, n = es(), dc(n)) {
      if ("selectionStart" in n) var l = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        l = (l = n.ownerDocument) && l.defaultView || window;
        var o = l.getSelection && l.getSelection();
        if (o && o.rangeCount !== 0) {
          l = o.anchorNode;
          var c = o.anchorOffset, d = o.focusNode;
          o = o.focusOffset;
          try {
            l.nodeType, d.nodeType;
          } catch {
            l = null;
            break e;
          }
          var m = 0, E = -1, T = -1, z = 0, $ = 0, W = n, Y = null;
          t: for (; ; ) {
            for (var pe; W !== l || c !== 0 && W.nodeType !== 3 || (E = m + c), W !== d || o !== 0 && W.nodeType !== 3 || (T = m + o), W.nodeType === 3 && (m += W.nodeValue.length), (pe = W.firstChild) !== null; )
              Y = W, W = pe;
            for (; ; ) {
              if (W === n) break t;
              if (Y === l && ++z === c && (E = m), Y === d && ++$ === o && (T = m), (pe = W.nextSibling) !== null) break;
              W = Y, Y = W.parentNode;
            }
            W = pe;
          }
          l = E === -1 || T === -1 ? null : { start: E, end: T };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (du = { focusedElem: n, selectionRange: l }, ba = !1, me = r; me !== null; ) if (r = me, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, me = n;
    else for (; me !== null; ) {
      r = me;
      try {
        var ge = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (ge !== null) {
              var Re = ge.memoizedProps, kn = ge.memoizedState, k = r.stateNode, w = k.getSnapshotBeforeUpdate(r.elementType === r.type ? Re : ri(r.type, Re), kn);
              k.__reactInternalSnapshotBeforeUpdate = w;
            }
            break;
          case 3:
            var L = r.stateNode.containerInfo;
            L.nodeType === 1 ? L.textContent = "" : L.nodeType === 9 && L.documentElement && L.removeChild(L.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(A(163));
        }
      } catch (Q) {
        pn(r, r.return, Q);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, me = n;
        break;
      }
      me = r.return;
    }
    return ge = Gv, Gv = !1, ge;
  }
  function Ds(n, r, l) {
    var o = r.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var c = o = o.next;
      do {
        if ((c.tag & n) === n) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && nf(r, l, d);
        }
        c = c.next;
      } while (c !== o);
    }
  }
  function Os(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & n) === n) {
          var o = l.create;
          l.destroy = o();
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function jd(n) {
    var r = n.ref;
    if (r !== null) {
      var l = n.stateNode;
      switch (n.tag) {
        case 5:
          n = l;
          break;
        default:
          n = l;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function rf(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, rf(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ei], delete r[is], delete r[ls], delete r[fo], delete r[ay])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Ls(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Xi(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || Ls(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function _i(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = xl));
    else if (o !== 4 && (n = n.child, n !== null)) for (_i(n, r, l), n = n.sibling; n !== null; ) _i(n, r, l), n = n.sibling;
  }
  function ki(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null)) for (ki(n, r, l), n = n.sibling; n !== null; ) ki(n, r, l), n = n.sibling;
  }
  var bn = null, Nr = !1;
  function Mr(n, r, l) {
    for (l = l.child; l !== null; ) qv(n, r, l), l = l.sibling;
  }
  function qv(n, r, l) {
    if ($r && typeof $r.onCommitFiberUnmount == "function") try {
      $r.onCommitFiberUnmount(hl, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Tr || So(l, r);
      case 6:
        var o = bn, c = Nr;
        bn = null, Mr(n, r, l), bn = o, Nr = c, bn !== null && (Nr ? (n = bn, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : bn.removeChild(l.stateNode));
        break;
      case 18:
        bn !== null && (Nr ? (n = bn, l = l.stateNode, n.nodeType === 8 ? co(n.parentNode, l) : n.nodeType === 1 && co(n, l), Ja(n)) : co(bn, l.stateNode));
        break;
      case 4:
        o = bn, c = Nr, bn = l.stateNode.containerInfo, Nr = !0, Mr(n, r, l), bn = o, Nr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Tr && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && (d & 2 || d & 4) && nf(l, r, m), c = c.next;
          } while (c !== o);
        }
        Mr(n, r, l);
        break;
      case 1:
        if (!Tr && (So(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
        } catch (E) {
          pn(l, r, E);
        }
        Mr(n, r, l);
        break;
      case 21:
        Mr(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Tr = (o = Tr) || l.memoizedState !== null, Mr(n, r, l), Tr = o) : Mr(n, r, l);
        break;
      default:
        Mr(n, r, l);
    }
  }
  function Xv(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new ly()), r.forEach(function(o) {
        var c = lh.bind(null, n, o);
        l.has(o) || (l.add(o), o.then(c, c));
      });
    }
  }
  function ai(n, r) {
    var l = r.deletions;
    if (l !== null) for (var o = 0; o < l.length; o++) {
      var c = l[o];
      try {
        var d = n, m = r, E = m;
        e: for (; E !== null; ) {
          switch (E.tag) {
            case 5:
              bn = E.stateNode, Nr = !1;
              break e;
            case 3:
              bn = E.stateNode.containerInfo, Nr = !0;
              break e;
            case 4:
              bn = E.stateNode.containerInfo, Nr = !0;
              break e;
          }
          E = E.return;
        }
        if (bn === null) throw Error(A(160));
        qv(d, m, c), bn = null, Nr = !1;
        var T = c.alternate;
        T !== null && (T.return = null), c.return = null;
      } catch (z) {
        pn(c, r, z);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Fd(r, n), r = r.sibling;
  }
  function Fd(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ai(r, n), ea(n), o & 4) {
          try {
            Ds(3, n, n.return), Os(3, n);
          } catch (Re) {
            pn(n, n.return, Re);
          }
          try {
            Ds(5, n, n.return);
          } catch (Re) {
            pn(n, n.return, Re);
          }
        }
        break;
      case 1:
        ai(r, n), ea(n), o & 512 && l !== null && So(l, l.return);
        break;
      case 5:
        if (ai(r, n), ea(n), o & 512 && l !== null && So(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            te(c, "");
          } catch (Re) {
            pn(n, n.return, Re);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, E = n.type, T = n.updateQueue;
          if (n.updateQueue = null, T !== null) try {
            E === "input" && d.type === "radio" && d.name != null && Bn(c, d), qn(E, m);
            var z = qn(E, d);
            for (m = 0; m < T.length; m += 2) {
              var $ = T[m], W = T[m + 1];
              $ === "style" ? en(c, W) : $ === "dangerouslySetInnerHTML" ? ci(c, W) : $ === "children" ? te(c, W) : We(c, $, W, z);
            }
            switch (E) {
              case "input":
                Yr(c, d);
                break;
              case "textarea":
                Ya(c, d);
                break;
              case "select":
                var Y = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var pe = d.value;
                pe != null ? Rn(c, !!d.multiple, pe, !1) : Y !== !!d.multiple && (d.defaultValue != null ? Rn(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : Rn(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[is] = d;
          } catch (Re) {
            pn(n, n.return, Re);
          }
        }
        break;
      case 6:
        if (ai(r, n), ea(n), o & 4) {
          if (n.stateNode === null) throw Error(A(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (Re) {
            pn(n, n.return, Re);
          }
        }
        break;
      case 3:
        if (ai(r, n), ea(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Ja(r.containerInfo);
        } catch (Re) {
          pn(n, n.return, Re);
        }
        break;
      case 4:
        ai(r, n), ea(n);
        break;
      case 13:
        ai(r, n), ea(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Pd = qe())), o & 4 && Xv(n);
        break;
      case 22:
        if ($ = l !== null && l.memoizedState !== null, n.mode & 1 ? (Tr = (z = Tr) || $, ai(r, n), Tr = z) : ai(r, n), ea(n), o & 8192) {
          if (z = n.memoizedState !== null, (n.stateNode.isHidden = z) && !$ && n.mode & 1) for (me = n, $ = n.child; $ !== null; ) {
            for (W = me = $; me !== null; ) {
              switch (Y = me, pe = Y.child, Y.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Ds(4, Y, Y.return);
                  break;
                case 1:
                  So(Y, Y.return);
                  var ge = Y.stateNode;
                  if (typeof ge.componentWillUnmount == "function") {
                    o = Y, l = Y.return;
                    try {
                      r = o, ge.props = r.memoizedProps, ge.state = r.memoizedState, ge.componentWillUnmount();
                    } catch (Re) {
                      pn(o, l, Re);
                    }
                  }
                  break;
                case 5:
                  So(Y, Y.return);
                  break;
                case 22:
                  if (Y.memoizedState !== null) {
                    Ns(W);
                    continue;
                  }
              }
              pe !== null ? (pe.return = Y, me = pe) : Ns(W);
            }
            $ = $.sibling;
          }
          e: for ($ = null, W = n; ; ) {
            if (W.tag === 5) {
              if ($ === null) {
                $ = W;
                try {
                  c = W.stateNode, z ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (E = W.stateNode, T = W.memoizedProps.style, m = T != null && T.hasOwnProperty("display") ? T.display : null, E.style.display = jt("display", m));
                } catch (Re) {
                  pn(n, n.return, Re);
                }
              }
            } else if (W.tag === 6) {
              if ($ === null) try {
                W.stateNode.nodeValue = z ? "" : W.memoizedProps;
              } catch (Re) {
                pn(n, n.return, Re);
              }
            } else if ((W.tag !== 22 && W.tag !== 23 || W.memoizedState === null || W === n) && W.child !== null) {
              W.child.return = W, W = W.child;
              continue;
            }
            if (W === n) break e;
            for (; W.sibling === null; ) {
              if (W.return === null || W.return === n) break e;
              $ === W && ($ = null), W = W.return;
            }
            $ === W && ($ = null), W.sibling.return = W.return, W = W.sibling;
          }
        }
        break;
      case 19:
        ai(r, n), ea(n), o & 4 && Xv(n);
        break;
      case 21:
        break;
      default:
        ai(
          r,
          n
        ), ea(n);
    }
  }
  function ea(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (Ls(l)) {
              var o = l;
              break e;
            }
            l = l.return;
          }
          throw Error(A(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (te(c, ""), o.flags &= -33);
            var d = Xi(n);
            ki(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, E = Xi(n);
            _i(n, E, m);
            break;
          default:
            throw Error(A(161));
        }
      } catch (T) {
        pn(n, n.return, T);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function uy(n, r, l) {
    me = n, Hd(n);
  }
  function Hd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; me !== null; ) {
      var c = me, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || ks;
        if (!m) {
          var E = c.alternate, T = E !== null && E.memoizedState !== null || Tr;
          E = ks;
          var z = Tr;
          if (ks = m, (Tr = T) && !z) for (me = c; me !== null; ) m = me, T = m.child, m.tag === 22 && m.memoizedState !== null ? Vd(c) : T !== null ? (T.return = m, me = T) : Vd(c);
          for (; d !== null; ) me = d, Hd(d), d = d.sibling;
          me = c, ks = E, Tr = z;
        }
        Jv(n);
      } else c.subtreeFlags & 8772 && d !== null ? (d.return = c, me = d) : Jv(n);
    }
  }
  function Jv(n) {
    for (; me !== null; ) {
      var r = me;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Tr || Os(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !Tr) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ri(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && xd(r, d, o);
              break;
            case 3:
              var m = r.updateQueue;
              if (m !== null) {
                if (l = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    l = r.child.stateNode;
                    break;
                  case 1:
                    l = r.child.stateNode;
                }
                xd(r, m, l);
              }
              break;
            case 5:
              var E = r.stateNode;
              if (l === null && r.flags & 4) {
                l = E;
                var T = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    T.autoFocus && l.focus();
                    break;
                  case "img":
                    T.src && (l.src = T.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (r.memoizedState === null) {
                var z = r.alternate;
                if (z !== null) {
                  var $ = z.memoizedState;
                  if ($ !== null) {
                    var W = $.dehydrated;
                    W !== null && Ja(W);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(A(163));
          }
          Tr || r.flags & 512 && jd(r);
        } catch (Y) {
          pn(r, r.return, Y);
        }
      }
      if (r === n) {
        me = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, me = l;
        break;
      }
      me = r.return;
    }
  }
  function Ns(n) {
    for (; me !== null; ) {
      var r = me;
      if (r === n) {
        me = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, me = l;
        break;
      }
      me = r.return;
    }
  }
  function Vd(n) {
    for (; me !== null; ) {
      var r = me;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Os(4, r);
            } catch (T) {
              pn(r, l, T);
            }
            break;
          case 1:
            var o = r.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = r.return;
              try {
                o.componentDidMount();
              } catch (T) {
                pn(r, c, T);
              }
            }
            var d = r.return;
            try {
              jd(r);
            } catch (T) {
              pn(r, d, T);
            }
            break;
          case 5:
            var m = r.return;
            try {
              jd(r);
            } catch (T) {
              pn(r, m, T);
            }
        }
      } catch (T) {
        pn(r, r.return, T);
      }
      if (r === n) {
        me = null;
        break;
      }
      var E = r.sibling;
      if (E !== null) {
        E.return = r.return, me = E;
        break;
      }
      me = r.return;
    }
  }
  var oy = Math.ceil, Ul = vt.ReactCurrentDispatcher, ku = vt.ReactCurrentOwner, or = vt.ReactCurrentBatchConfig, Et = 0, Wn = null, Fn = null, sr = 0, ma = 0, Eo = Da(0), _n = 0, Ms = null, Di = 0, Co = 0, af = 0, zs = null, ta = null, Pd = 0, Ro = 1 / 0, ya = null, To = !1, Du = null, Al = null, lf = !1, Ji = null, Us = 0, jl = 0, xo = null, As = -1, xr = 0;
  function Hn() {
    return Et & 6 ? qe() : As !== -1 ? As : As = qe();
  }
  function Oi(n) {
    return n.mode & 1 ? Et & 2 && sr !== 0 ? sr & -sr : iy.transition !== null ? (xr === 0 && (xr = Ku()), xr) : (n = Ot, n !== 0 || (n = window.event, n = n === void 0 ? 16 : no(n.type)), n) : 1;
  }
  function zr(n, r, l, o) {
    if (50 < jl) throw jl = 0, xo = null, Error(A(185));
    Hi(n, l, o), (!(Et & 2) || n !== Wn) && (n === Wn && (!(Et & 2) && (Co |= l), _n === 4 && ii(n, sr)), na(n, o), l === 1 && Et === 0 && !(r.mode & 1) && (Ro = qe() + 500, vo && Ri()));
  }
  function na(n, r) {
    var l = n.callbackNode;
    ru(n, r);
    var o = Xa(n, n === Wn ? sr : 0);
    if (o === 0) l !== null && ar(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && ar(l), r === 1) n.tag === 0 ? bl(Bd.bind(null, n)) : wc(Bd.bind(null, n)), so(function() {
        !(Et & 6) && Ri();
      }), l = null;
      else {
        switch (Xu(o)) {
          case 1:
            l = Ka;
            break;
          case 4:
            l = tu;
            break;
          case 16:
            l = nu;
            break;
          case 536870912:
            l = Qu;
            break;
          default:
            l = nu;
        }
        l = oh(l, uf.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function uf(n, r) {
    if (As = -1, xr = 0, Et & 6) throw Error(A(327));
    var l = n.callbackNode;
    if (wo() && n.callbackNode !== l) return null;
    var o = Xa(n, n === Wn ? sr : 0);
    if (o === 0) return null;
    if (o & 30 || o & n.expiredLanes || r) r = of(n, o);
    else {
      r = o;
      var c = Et;
      Et |= 2;
      var d = eh();
      (Wn !== n || sr !== r) && (ya = null, Ro = qe() + 500, Zi(n, r));
      do
        try {
          th();
          break;
        } catch (E) {
          Zv(n, E);
        }
      while (!0);
      gd(), Ul.current = d, Et = c, Fn !== null ? r = 0 : (Wn = null, sr = 0, r = _n);
    }
    if (r !== 0) {
      if (r === 2 && (c = yl(n), c !== 0 && (o = c, r = js(n, c))), r === 1) throw l = Ms, Zi(n, 0), ii(n, o), na(n, qe()), l;
      if (r === 6) ii(n, o);
      else {
        if (c = n.current.alternate, !(o & 30) && !sy(c) && (r = of(n, o), r === 2 && (d = yl(n), d !== 0 && (o = d, r = js(n, d))), r === 1)) throw l = Ms, Zi(n, 0), ii(n, o), na(n, qe()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(A(345));
          case 2:
            Nu(n, ta, ya);
            break;
          case 3:
            if (ii(n, o), (o & 130023424) === o && (r = Pd + 500 - qe(), 10 < r)) {
              if (Xa(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                Hn(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Rc(Nu.bind(null, n, ta, ya), r);
              break;
            }
            Nu(n, ta, ya);
            break;
          case 4:
            if (ii(n, o), (o & 4194240) === o) break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var m = 31 - kr(o);
              d = 1 << m, m = r[m], m > c && (c = m), o &= ~d;
            }
            if (o = c, o = qe() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * oy(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = Rc(Nu.bind(null, n, ta, ya), o);
              break;
            }
            Nu(n, ta, ya);
            break;
          case 5:
            Nu(n, ta, ya);
            break;
          default:
            throw Error(A(329));
        }
      }
    }
    return na(n, qe()), n.callbackNode === l ? uf.bind(null, n) : null;
  }
  function js(n, r) {
    var l = zs;
    return n.current.memoizedState.isDehydrated && (Zi(n, r).flags |= 256), n = of(n, r), n !== 2 && (r = ta, ta = l, r !== null && Ou(r)), n;
  }
  function Ou(n) {
    ta === null ? ta = n : ta.push.apply(ta, n);
  }
  function sy(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var o = 0; o < l.length; o++) {
          var c = l[o], d = c.getSnapshot;
          c = c.value;
          try {
            if (!ei(d(), c)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (l = r.child, r.subtreeFlags & 16384 && l !== null) l.return = r, r = l;
      else {
        if (r === n) break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === n) return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function ii(n, r) {
    for (r &= ~af, r &= ~Co, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - kr(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function Bd(n) {
    if (Et & 6) throw Error(A(327));
    wo();
    var r = Xa(n, 0);
    if (!(r & 1)) return na(n, qe()), null;
    var l = of(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = yl(n);
      o !== 0 && (r = o, l = js(n, o));
    }
    if (l === 1) throw l = Ms, Zi(n, 0), ii(n, r), na(n, qe()), l;
    if (l === 6) throw Error(A(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Nu(n, ta, ya), na(n, qe()), null;
  }
  function Id(n, r) {
    var l = Et;
    Et |= 1;
    try {
      return n(r);
    } finally {
      Et = l, Et === 0 && (Ro = qe() + 500, vo && Ri());
    }
  }
  function Lu(n) {
    Ji !== null && Ji.tag === 0 && !(Et & 6) && wo();
    var r = Et;
    Et |= 1;
    var l = or.transition, o = Ot;
    try {
      if (or.transition = null, Ot = 1, n) return n();
    } finally {
      Ot = o, or.transition = l, Et = r, !(Et & 6) && Ri();
    }
  }
  function Yd() {
    ma = Eo.current, an(Eo);
  }
  function Zi(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, pd(l)), Fn !== null) for (l = Fn.return; l !== null; ) {
      var o = l;
      switch (_c(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && po();
          break;
        case 3:
          Su(), an($n), an(En), Oe();
          break;
        case 5:
          Lc(o);
          break;
        case 4:
          Su();
          break;
        case 13:
          an(gn);
          break;
        case 19:
          an(gn);
          break;
        case 10:
          Sd(o.type._context);
          break;
        case 22:
        case 23:
          Yd();
      }
      l = l.return;
    }
    if (Wn = n, Fn = n = Fl(n.current, null), sr = ma = r, _n = 0, Ms = null, af = Co = Di = 0, ta = zs = null, yu !== null) {
      for (r = 0; r < yu.length; r++) if (l = yu[r], o = l.interleaved, o !== null) {
        l.interleaved = null;
        var c = o.next, d = l.pending;
        if (d !== null) {
          var m = d.next;
          d.next = c, o.next = m;
        }
        l.pending = o;
      }
      yu = null;
    }
    return n;
  }
  function Zv(n, r) {
    do {
      var l = Fn;
      try {
        if (gd(), ot.current = wu, Mc) {
          for (var o = Nt.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          Mc = !1;
        }
        if (Gt = 0, Jn = Un = Nt = null, vs = !1, Eu = 0, ku.current = null, l === null || l.return === null) {
          _n = 1, Ms = r, Fn = null;
          break;
        }
        e: {
          var d = n, m = l.return, E = l, T = r;
          if (r = sr, E.flags |= 32768, T !== null && typeof T == "object" && typeof T.then == "function") {
            var z = T, $ = E, W = $.tag;
            if (!($.mode & 1) && (W === 0 || W === 11 || W === 15)) {
              var Y = $.alternate;
              Y ? ($.updateQueue = Y.updateQueue, $.memoizedState = Y.memoizedState, $.lanes = Y.lanes) : ($.updateQueue = null, $.memoizedState = null);
            }
            var pe = Vv(m);
            if (pe !== null) {
              pe.flags &= -257, zl(pe, m, E, d, r), pe.mode & 1 && Nd(d, z, r), r = pe, T = z;
              var ge = r.updateQueue;
              if (ge === null) {
                var Re = /* @__PURE__ */ new Set();
                Re.add(T), r.updateQueue = Re;
              } else ge.add(T);
              break e;
            } else {
              if (!(r & 1)) {
                Nd(d, z, r), $d();
                break e;
              }
              T = Error(A(426));
            }
          } else if (dn && E.mode & 1) {
            var kn = Vv(m);
            if (kn !== null) {
              !(kn.flags & 65536) && (kn.flags |= 256), zl(kn, m, E, d, r), Gi(bu(T, E));
              break e;
            }
          }
          d = T = bu(T, E), _n !== 4 && (_n = 2), zs === null ? zs = [d] : zs.push(d), d = m;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var k = Hv(d, T, r);
                zv(d, k);
                break e;
              case 1:
                E = T;
                var w = d.type, L = d.stateNode;
                if (!(d.flags & 128) && (typeof w.getDerivedStateFromError == "function" || L !== null && typeof L.componentDidCatch == "function" && (Al === null || !Al.has(L)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var Q = Ld(d, E, r);
                  zv(d, Q);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        rh(l);
      } catch (Se) {
        r = Se, Fn === l && l !== null && (Fn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function eh() {
    var n = Ul.current;
    return Ul.current = wu, n === null ? wu : n;
  }
  function $d() {
    (_n === 0 || _n === 3 || _n === 2) && (_n = 4), Wn === null || !(Di & 268435455) && !(Co & 268435455) || ii(Wn, sr);
  }
  function of(n, r) {
    var l = Et;
    Et |= 2;
    var o = eh();
    (Wn !== n || sr !== r) && (ya = null, Zi(n, r));
    do
      try {
        cy();
        break;
      } catch (c) {
        Zv(n, c);
      }
    while (!0);
    if (gd(), Et = l, Ul.current = o, Fn !== null) throw Error(A(261));
    return Wn = null, sr = 0, _n;
  }
  function cy() {
    for (; Fn !== null; ) nh(Fn);
  }
  function th() {
    for (; Fn !== null && !Wa(); ) nh(Fn);
  }
  function nh(n) {
    var r = uh(n.alternate, n, ma);
    n.memoizedProps = n.pendingProps, r === null ? rh(n) : Fn = r, ku.current = null;
  }
  function rh(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = tf(l, r), l !== null) {
          l.flags &= 32767, Fn = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          _n = 6, Fn = null;
          return;
        }
      } else if (l = Wv(l, r, ma), l !== null) {
        Fn = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        Fn = r;
        return;
      }
      Fn = r = n;
    } while (r !== null);
    _n === 0 && (_n = 5);
  }
  function Nu(n, r, l) {
    var o = Ot, c = or.transition;
    try {
      or.transition = null, Ot = 1, fy(n, r, l, o);
    } finally {
      or.transition = c, Ot = o;
    }
    return null;
  }
  function fy(n, r, l, o) {
    do
      wo();
    while (Ji !== null);
    if (Et & 6) throw Error(A(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(A(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (Qf(n, d), n === Wn && (Fn = Wn = null, sr = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || lf || (lf = !0, oh(nu, function() {
      return wo(), null;
    })), d = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || d) {
      d = or.transition, or.transition = null;
      var m = Ot;
      Ot = 1;
      var E = Et;
      Et |= 4, ku.current = null, Kv(n, l), Fd(l, n), io(du), ba = !!as, du = as = null, n.current = l, uy(l), Ga(), Et = E, Ot = m, or.transition = d;
    } else n.current = l;
    if (lf && (lf = !1, Ji = n, Us = c), d = n.pendingLanes, d === 0 && (Al = null), Yo(l.stateNode), na(n, qe()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (To) throw To = !1, n = Du, Du = null, n;
    return Us & 1 && n.tag !== 0 && wo(), d = n.pendingLanes, d & 1 ? n === xo ? jl++ : (jl = 0, xo = n) : jl = 0, Ri(), null;
  }
  function wo() {
    if (Ji !== null) {
      var n = Xu(Us), r = or.transition, l = Ot;
      try {
        if (or.transition = null, Ot = 16 > n ? 16 : n, Ji === null) var o = !1;
        else {
          if (n = Ji, Ji = null, Us = 0, Et & 6) throw Error(A(331));
          var c = Et;
          for (Et |= 4, me = n.current; me !== null; ) {
            var d = me, m = d.child;
            if (me.flags & 16) {
              var E = d.deletions;
              if (E !== null) {
                for (var T = 0; T < E.length; T++) {
                  var z = E[T];
                  for (me = z; me !== null; ) {
                    var $ = me;
                    switch ($.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Ds(8, $, d);
                    }
                    var W = $.child;
                    if (W !== null) W.return = $, me = W;
                    else for (; me !== null; ) {
                      $ = me;
                      var Y = $.sibling, pe = $.return;
                      if (rf($), $ === z) {
                        me = null;
                        break;
                      }
                      if (Y !== null) {
                        Y.return = pe, me = Y;
                        break;
                      }
                      me = pe;
                    }
                  }
                }
                var ge = d.alternate;
                if (ge !== null) {
                  var Re = ge.child;
                  if (Re !== null) {
                    ge.child = null;
                    do {
                      var kn = Re.sibling;
                      Re.sibling = null, Re = kn;
                    } while (Re !== null);
                  }
                }
                me = d;
              }
            }
            if (d.subtreeFlags & 2064 && m !== null) m.return = d, me = m;
            else e: for (; me !== null; ) {
              if (d = me, d.flags & 2048) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Ds(9, d, d.return);
              }
              var k = d.sibling;
              if (k !== null) {
                k.return = d.return, me = k;
                break e;
              }
              me = d.return;
            }
          }
          var w = n.current;
          for (me = w; me !== null; ) {
            m = me;
            var L = m.child;
            if (m.subtreeFlags & 2064 && L !== null) L.return = m, me = L;
            else e: for (m = w; me !== null; ) {
              if (E = me, E.flags & 2048) try {
                switch (E.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Os(9, E);
                }
              } catch (Se) {
                pn(E, E.return, Se);
              }
              if (E === m) {
                me = null;
                break e;
              }
              var Q = E.sibling;
              if (Q !== null) {
                Q.return = E.return, me = Q;
                break e;
              }
              me = E.return;
            }
          }
          if (Et = c, Ri(), $r && typeof $r.onPostCommitFiberRoot == "function") try {
            $r.onPostCommitFiberRoot(hl, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        Ot = l, or.transition = r;
      }
    }
    return !1;
  }
  function ah(n, r, l) {
    r = bu(l, r), r = Hv(n, r, 1), n = Ll(n, r, 1), r = Hn(), n !== null && (Hi(n, 1, r), na(n, r));
  }
  function pn(n, r, l) {
    if (n.tag === 3) ah(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        ah(r, n, l);
        break;
      } else if (r.tag === 1) {
        var o = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (Al === null || !Al.has(o))) {
          n = bu(l, n), n = Ld(r, n, 1), r = Ll(r, n, 1), n = Hn(), r !== null && (Hi(r, 1, n), na(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function dy(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Hn(), n.pingedLanes |= n.suspendedLanes & l, Wn === n && (sr & l) === l && (_n === 4 || _n === 3 && (sr & 130023424) === sr && 500 > qe() - Pd ? Zi(n, 0) : af |= l), na(n, r);
  }
  function ih(n, r) {
    r === 0 && (n.mode & 1 ? (r = fa, fa <<= 1, !(fa & 130023424) && (fa = 4194304)) : r = 1);
    var l = Hn();
    n = va(n, r), n !== null && (Hi(n, r, l), na(n, l));
  }
  function py(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), ih(n, l);
  }
  function lh(n, r) {
    var l = 0;
    switch (n.tag) {
      case 13:
        var o = n.stateNode, c = n.memoizedState;
        c !== null && (l = c.retryLane);
        break;
      case 19:
        o = n.stateNode;
        break;
      default:
        throw Error(A(314));
    }
    o !== null && o.delete(r), ih(n, l);
  }
  var uh;
  uh = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || $n.current) An = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return An = !1, bs(n, r, l);
      An = !!(n.flags & 131072);
    }
    else An = !1, dn && r.flags & 1048576 && Ov(r, Wi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        Ma(n, r), n = r.pendingProps;
        var c = Gr(r, En.current);
        yn(r, l), c = Nl(null, r, o, n, c, l);
        var d = ni();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, Mn(o) ? (d = !0, Xn(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, Td(r), c.updater = qc, r.stateNode = c, c._reactInternals = r, Cs(r, o, n, l), r = xs(null, r, o, !0, d, l)) : (r.tag = 0, dn && d && bc(r), ur(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (Ma(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = hy(o), n = ri(o, n), c) {
            case 0:
              r = Pv(null, r, o, n, l);
              break e;
            case 1:
              r = Bv(null, r, o, n, l);
              break e;
            case 11:
              r = Zr(null, r, o, n, l);
              break e;
            case 14:
              r = _u(null, r, o, ri(o.type, n), l);
              break e;
          }
          throw Error(A(
            306,
            o,
            ""
          ));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ri(o, c), Pv(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ri(o, c), Bv(n, r, o, c, l);
      case 3:
        e: {
          if (go(r), n === null) throw Error(A(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, Mv(n, r), ss(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = bu(Error(A(423)), r), r = Iv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = bu(Error(A(424)), r), r = Iv(n, r, o, l, c);
            break e;
          } else for (qr = Si(r.stateNode.containerInfo.firstChild), Kr = r, dn = !0, La = null, l = oe(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Ol(), o === c) {
              r = za(n, r, l);
              break e;
            }
            ur(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Uv(r), n === null && md(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, Cc(o, c) ? m = null : d !== null && Cc(o, d) && (r.flags |= 32), Md(n, r), ur(n, r, m, l), r.child;
      case 6:
        return n === null && md(r), null;
      case 13:
        return ef(n, r, l);
      case 4:
        return wd(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = xn(r, null, o, l) : ur(n, r, o, l), r.child;
      case 11:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ri(o, c), Zr(n, r, o, c, l);
      case 7:
        return ur(n, r, r.pendingProps, l), r.child;
      case 8:
        return ur(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return ur(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, _e(pa, o._currentValue), o._currentValue = m, d !== null) if (ei(d.value, m)) {
            if (d.children === c.children && !$n.current) {
              r = za(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var E = d.dependencies;
            if (E !== null) {
              m = d.child;
              for (var T = E.firstContext; T !== null; ) {
                if (T.context === o) {
                  if (d.tag === 1) {
                    T = Ki(-1, l & -l), T.tag = 2;
                    var z = d.updateQueue;
                    if (z !== null) {
                      z = z.shared;
                      var $ = z.pending;
                      $ === null ? T.next = T : (T.next = $.next, $.next = T), z.pending = T;
                    }
                  }
                  d.lanes |= l, T = d.alternate, T !== null && (T.lanes |= l), Ed(
                    d.return,
                    l,
                    r
                  ), E.lanes |= l;
                  break;
                }
                T = T.next;
              }
            } else if (d.tag === 10) m = d.type === r.type ? null : d.child;
            else if (d.tag === 18) {
              if (m = d.return, m === null) throw Error(A(341));
              m.lanes |= l, E = m.alternate, E !== null && (E.lanes |= l), Ed(m, l, r), m = d.sibling;
            } else m = d.child;
            if (m !== null) m.return = d;
            else for (m = d; m !== null; ) {
              if (m === r) {
                m = null;
                break;
              }
              if (d = m.sibling, d !== null) {
                d.return = m.return, m = d;
                break;
              }
              m = m.return;
            }
            d = m;
          }
          ur(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, o = r.pendingProps.children, yn(r, l), c = Na(c), o = o(c), r.flags |= 1, ur(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ri(o, r.pendingProps), c = ri(o.type, c), _u(n, r, o, c, l);
      case 15:
        return Xe(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ri(o, c), Ma(n, r), r.tag = 1, Mn(o) ? (n = !0, Xn(r)) : n = !1, yn(r, l), Xc(r, o, c), Cs(r, o, c, l), xs(null, r, o, !0, n, l);
      case 19:
        return bi(n, r, l);
      case 22:
        return Ts(n, r, l);
    }
    throw Error(A(156, r.tag));
  };
  function oh(n, r) {
    return sn(n, r);
  }
  function vy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Aa(n, r, l, o) {
    return new vy(n, r, l, o);
  }
  function Qd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function hy(n) {
    if (typeof n == "function") return Qd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === bt) return 11;
      if (n === _t) return 14;
    }
    return 2;
  }
  function Fl(n, r) {
    var l = n.alternate;
    return l === null ? (l = Aa(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Fs(n, r, l, o, c, d) {
    var m = 2;
    if (o = n, typeof n == "function") Qd(n) && (m = 1);
    else if (typeof n == "string") m = 5;
    else e: switch (n) {
      case He:
        return el(l.children, c, d, r);
      case ln:
        m = 8, c |= 8;
        break;
      case Ht:
        return n = Aa(12, l, r, c | 2), n.elementType = Ht, n.lanes = d, n;
      case Le:
        return n = Aa(13, l, r, c), n.elementType = Le, n.lanes = d, n;
      case At:
        return n = Aa(19, l, r, c), n.elementType = At, n.lanes = d, n;
      case Te:
        return Hl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case Zt:
            m = 10;
            break e;
          case un:
            m = 9;
            break e;
          case bt:
            m = 11;
            break e;
          case _t:
            m = 14;
            break e;
          case Dt:
            m = 16, o = null;
            break e;
        }
        throw Error(A(130, n == null ? n : typeof n, ""));
    }
    return r = Aa(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function el(n, r, l, o) {
    return n = Aa(7, n, o, r), n.lanes = l, n;
  }
  function Hl(n, r, l, o) {
    return n = Aa(22, n, o, r), n.elementType = Te, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Wd(n, r, l) {
    return n = Aa(6, n, null, r), n.lanes = l, n;
  }
  function sf(n, r, l) {
    return r = Aa(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function sh(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = qu(0), this.expirationTimes = qu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = qu(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function cf(n, r, l, o, c, d, m, E, T) {
    return n = new sh(n, r, l, E, T), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = Aa(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Td(d), n;
  }
  function my(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ct, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function Gd(n) {
    if (!n) return Cr;
    n = n._reactInternals;
    e: {
      if (Ke(n) !== n || n.tag !== 1) throw Error(A(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (Mn(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(A(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (Mn(l)) return us(n, l, r);
    }
    return r;
  }
  function ch(n, r, l, o, c, d, m, E, T) {
    return n = cf(l, o, !0, n, c, d, m, E, T), n.context = Gd(null), l = n.current, o = Hn(), c = Oi(l), d = Ki(o, c), d.callback = r ?? null, Ll(l, d, c), n.current.lanes = c, Hi(n, c, o), na(n, o), n;
  }
  function ff(n, r, l, o) {
    var c = r.current, d = Hn(), m = Oi(c);
    return l = Gd(l), r.context === null ? r.context = l : r.pendingContext = l, r = Ki(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = Ll(c, r, m), n !== null && (zr(n, c, m, d), Oc(n, c, m)), m;
  }
  function df(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function Kd(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function pf(n, r) {
    Kd(n, r), (n = n.alternate) && Kd(n, r);
  }
  function fh() {
    return null;
  }
  var Mu = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function qd(n) {
    this._internalRoot = n;
  }
  vf.prototype.render = qd.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(A(409));
    ff(n, r, null, null);
  }, vf.prototype.unmount = qd.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Lu(function() {
        ff(null, n, null, null);
      }), r[$i] = null;
    }
  };
  function vf(n) {
    this._internalRoot = n;
  }
  vf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = Ie();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < Yn.length && r !== 0 && r < Yn[l].priority; l++) ;
      Yn.splice(l, 0, n), l === 0 && Wo(n);
    }
  };
  function Xd(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function hf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function dh() {
  }
  function yy(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var z = df(m);
          d.call(z);
        };
      }
      var m = ch(r, o, n, 0, null, !1, !1, "", dh);
      return n._reactRootContainer = m, n[$i] = m.current, uo(n.nodeType === 8 ? n.parentNode : n), Lu(), m;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof o == "function") {
      var E = o;
      o = function() {
        var z = df(T);
        E.call(z);
      };
    }
    var T = cf(n, 0, !1, null, null, !1, !1, "", dh);
    return n._reactRootContainer = T, n[$i] = T.current, uo(n.nodeType === 8 ? n.parentNode : n), Lu(function() {
      ff(r, T, l, o);
    }), T;
  }
  function Hs(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var m = d;
      if (typeof c == "function") {
        var E = c;
        c = function() {
          var T = df(m);
          E.call(T);
        };
      }
      ff(r, m, n, c);
    } else m = yy(l, r, n, c, o);
    return df(m);
  }
  Tt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = qa(r.pendingLanes);
          l !== 0 && (Vi(r, l | 1), na(r, qe()), !(Et & 6) && (Ro = qe() + 500, Ri()));
        }
        break;
      case 13:
        Lu(function() {
          var o = va(n, 1);
          if (o !== null) {
            var c = Hn();
            zr(o, n, 1, c);
          }
        }), pf(n, 1);
    }
  }, $o = function(n) {
    if (n.tag === 13) {
      var r = va(n, 134217728);
      if (r !== null) {
        var l = Hn();
        zr(r, n, 134217728, l);
      }
      pf(n, 134217728);
    }
  }, vi = function(n) {
    if (n.tag === 13) {
      var r = Oi(n), l = va(n, r);
      if (l !== null) {
        var o = Hn();
        zr(l, n, r, o);
      }
      pf(n, r);
    }
  }, Ie = function() {
    return Ot;
  }, Ju = function(n, r) {
    var l = Ot;
    try {
      return Ot = n, r();
    } finally {
      Ot = l;
    }
  }, Yt = function(n, r, l) {
    switch (r) {
      case "input":
        if (Yr(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = mn(o);
              if (!c) throw Error(A(90));
              wr(o), Yr(o, c);
            }
          }
        }
        break;
      case "textarea":
        Ya(n, l);
        break;
      case "select":
        r = l.value, r != null && Rn(n, !!l.multiple, r, !1);
    }
  }, Zl = Id, dl = Lu;
  var gy = { usingClientEntryPoint: !1, Events: [De, ti, mn, Fi, Jl, Id] }, Vs = { findFiberByHostInstance: pu, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, ph = { bundleType: Vs.bundleType, version: Vs.version, rendererPackageName: Vs.rendererPackageName, rendererConfig: Vs.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: vt.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = Tn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Vs.findFiberByHostInstance || fh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vl.isDisabled && Vl.supportsFiber) try {
      hl = Vl.inject(ph), $r = Vl;
    } catch {
    }
  }
  return Ba.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = gy, Ba.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Xd(r)) throw Error(A(200));
    return my(n, r, null, l);
  }, Ba.createRoot = function(n, r) {
    if (!Xd(n)) throw Error(A(299));
    var l = !1, o = "", c = Mu;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = cf(n, 1, !1, null, null, l, !1, o, c), n[$i] = r.current, uo(n.nodeType === 8 ? n.parentNode : n), new qd(r);
  }, Ba.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(A(188)) : (n = Object.keys(n).join(","), Error(A(268, n)));
    return n = Tn(r), n = n === null ? null : n.stateNode, n;
  }, Ba.flushSync = function(n) {
    return Lu(n);
  }, Ba.hydrate = function(n, r, l) {
    if (!hf(r)) throw Error(A(200));
    return Hs(null, n, r, !0, l);
  }, Ba.hydrateRoot = function(n, r, l) {
    if (!Xd(n)) throw Error(A(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = Mu;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = ch(r, null, n, 1, l ?? null, c, !1, d, m), n[$i] = r.current, uo(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new vf(r);
  }, Ba.render = function(n, r, l) {
    if (!hf(r)) throw Error(A(200));
    return Hs(null, n, r, !1, l);
  }, Ba.unmountComponentAtNode = function(n) {
    if (!hf(n)) throw Error(A(40));
    return n._reactRootContainer ? (Lu(function() {
      Hs(null, null, n, !1, function() {
        n._reactRootContainer = null, n[$i] = null;
      });
    }), !0) : !1;
  }, Ba.unstable_batchedUpdates = Id, Ba.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!hf(l)) throw Error(A(200));
    if (n == null || n._reactInternals === void 0) throw Error(A(38));
    return Hs(n, r, l, !1, o);
  }, Ba.version = "18.3.1-next-f1338f8080-20240426", Ba;
}
var Ia = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rT;
function tk() {
  return rT || (rT = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var ne = ic, Z = lT(), A = ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, wt = !1;
    function mt(e) {
      wt = e;
    }
    function yt(e) {
      if (!wt) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Ft("warn", e, a);
      }
    }
    function S(e) {
      if (!wt) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Ft("error", e, a);
      }
    }
    function Ft(e, t, a) {
      {
        var i = A.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var fe = 0, de = 1, et = 2, ee = 3, K = 4, X = 5, le = 6, Qe = 7, st = 8, Jt = 9, pt = 10, We = 11, vt = 12, ke = 13, ct = 14, He = 15, ln = 16, Ht = 17, Zt = 18, un = 19, bt = 21, Le = 22, At = 23, _t = 24, Dt = 25, Te = !0, J = !1, xe = !1, ae = !1, _ = !1, V = !0, Ve = !0, je = !0, it = !0, tt = /* @__PURE__ */ new Set(), Je = {}, nt = {};
    function lt(e, t) {
      Bt(e, t), Bt(e + "Capture", t);
    }
    function Bt(e, t) {
      Je[e] && S("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), Je[e] = t;
      {
        var a = e.toLowerCase();
        nt[a] = e, e === "onDoubleClick" && (nt.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        tt.add(t[i]);
    }
    var On = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", wr = Object.prototype.hasOwnProperty;
    function Cn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function nr(e) {
      try {
        return Pn(e), !1;
      } catch {
        return !0;
      }
    }
    function Pn(e) {
      return "" + e;
    }
    function Bn(e, t) {
      if (nr(e))
        return S("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Cn(e)), Pn(e);
    }
    function Yr(e) {
      if (nr(e))
        return S("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Cn(e)), Pn(e);
    }
    function si(e, t) {
      if (nr(e))
        return S("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Cn(e)), Pn(e);
    }
    function oa(e, t) {
      if (nr(e))
        return S("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Cn(e)), Pn(e);
    }
    function Kn(e) {
      if (nr(e))
        return S("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", Cn(e)), Pn(e);
    }
    function Rn(e) {
      if (nr(e))
        return S("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", Cn(e)), Pn(e);
    }
    var In = 0, gr = 1, Ya = 2, Ln = 3, Sr = 4, sa = 5, $a = 6, ci = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", te = ci + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", we = new RegExp("^[" + ci + "][" + te + "]*$"), rt = {}, jt = {};
    function en(e) {
      return wr.call(jt, e) ? !0 : wr.call(rt, e) ? !1 : we.test(e) ? (jt[e] = !0, !0) : (rt[e] = !0, S("Invalid attribute name: `%s`", e), !1);
    }
    function vn(e, t, a) {
      return t !== null ? t.type === In : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function on(e, t, a, i) {
      if (a !== null && a.type === In)
        return !1;
      switch (typeof t) {
        case "function":
        case "symbol":
          return !0;
        case "boolean": {
          if (i)
            return !1;
          if (a !== null)
            return !a.acceptsBooleans;
          var u = e.toLowerCase().slice(0, 5);
          return u !== "data-" && u !== "aria-";
        }
        default:
          return !1;
      }
    }
    function qn(e, t, a, i) {
      if (t === null || typeof t > "u" || on(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Ln:
            return !t;
          case Sr:
            return t === !1;
          case sa:
            return isNaN(t);
          case $a:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function tn(e) {
      return Yt.hasOwnProperty(e) ? Yt[e] : null;
    }
    function It(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === Ya || t === Ln || t === Sr, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var Yt = {}, ca = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    ca.forEach(function(e) {
      Yt[e] = new It(
        e,
        In,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
      var t = e[0], a = e[1];
      Yt[t] = new It(
        t,
        gr,
        !1,
        // mustUseProperty
        a,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
      Yt[e] = new It(
        e,
        Ya,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
      Yt[e] = new It(
        e,
        Ya,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope"
    ].forEach(function(e) {
      Yt[e] = new It(
        e,
        Ln,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Yt[e] = new It(
        e,
        Ln,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Yt[e] = new It(
        e,
        Sr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Yt[e] = new It(
        e,
        $a,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function(e) {
      Yt[e] = new It(
        e,
        sa,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Er = /[\-\:]([a-z])/g, Ta = function(e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Er, Ta);
      Yt[t] = new It(
        t,
        gr,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Er, Ta);
      Yt[t] = new It(
        t,
        gr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Er, Ta);
      Yt[t] = new It(
        t,
        gr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Yt[e] = new It(
        e,
        gr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Fi = "xlinkHref";
    Yt[Fi] = new It(
      "xlinkHref",
      gr,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Yt[e] = new It(
        e,
        gr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var Jl = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, Zl = !1;
    function dl(e) {
      !Zl && Jl.test(e) && (Zl = !0, S("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function pl(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        Bn(a, t), i.sanitizeURL && dl("" + a);
        var s = i.attributeName, f = null;
        if (i.type === Sr) {
          if (e.hasAttribute(s)) {
            var p = e.getAttribute(s);
            return p === "" ? !0 : qn(t, a, i, !1) ? p : p === "" + a ? a : p;
          }
        } else if (e.hasAttribute(s)) {
          if (qn(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === Ln)
            return a;
          f = e.getAttribute(s);
        }
        return qn(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function eu(e, t, a, i) {
      {
        if (!en(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return Bn(a, t), u === "" + a ? a : u;
      }
    }
    function br(e, t, a, i) {
      var u = tn(t);
      if (!vn(t, u, i)) {
        if (qn(t, a, u, i) && (a = null), i || u === null) {
          if (en(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (Bn(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = u.mustUseProperty;
        if (f) {
          var p = u.propertyName;
          if (a === null) {
            var v = u.type;
            e[p] = v === Ln ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var y = u.attributeName, g = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(y);
        else {
          var b = u.type, x;
          b === Ln || b === Sr && a === !0 ? x = "" : (Bn(a, y), x = "" + a, u.sanitizeURL && dl(x.toString())), g ? e.setAttributeNS(g, y, x) : e.setAttribute(y, x);
        }
      }
    }
    var _r = Symbol.for("react.element"), rr = Symbol.for("react.portal"), fi = Symbol.for("react.fragment"), Qa = Symbol.for("react.strict_mode"), di = Symbol.for("react.profiler"), pi = Symbol.for("react.provider"), R = Symbol.for("react.context"), B = Symbol.for("react.forward_ref"), ue = Symbol.for("react.suspense"), ye = Symbol.for("react.suspense_list"), Ke = Symbol.for("react.memo"), Ye = Symbol.for("react.lazy"), ft = Symbol.for("react.scope"), ut = Symbol.for("react.debug_trace_mode"), Tn = Symbol.for("react.offscreen"), nn = Symbol.for("react.legacy_hidden"), sn = Symbol.for("react.cache"), ar = Symbol.for("react.tracing_marker"), Wa = Symbol.iterator, Ga = "@@iterator";
    function qe(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Wa && e[Wa] || e[Ga];
      return typeof t == "function" ? t : null;
    }
    var Ze = Object.assign, Ka = 0, tu, nu, vl, Qu, hl, $r, Yo;
    function kr() {
    }
    kr.__reactDisabledLog = !0;
    function lc() {
      {
        if (Ka === 0) {
          tu = console.log, nu = console.info, vl = console.warn, Qu = console.error, hl = console.group, $r = console.groupCollapsed, Yo = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: kr,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        Ka++;
      }
    }
    function uc() {
      {
        if (Ka--, Ka === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Ze({}, e, {
              value: tu
            }),
            info: Ze({}, e, {
              value: nu
            }),
            warn: Ze({}, e, {
              value: vl
            }),
            error: Ze({}, e, {
              value: Qu
            }),
            group: Ze({}, e, {
              value: hl
            }),
            groupCollapsed: Ze({}, e, {
              value: $r
            }),
            groupEnd: Ze({}, e, {
              value: Yo
            })
          });
        }
        Ka < 0 && S("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Wu = A.ReactCurrentDispatcher, ml;
    function fa(e, t, a) {
      {
        if (ml === void 0)
          try {
            throw Error();
          } catch (u) {
            var i = u.stack.trim().match(/\n( *(at )?)/);
            ml = i && i[1] || "";
          }
        return `
` + ml + e;
      }
    }
    var qa = !1, Xa;
    {
      var Gu = typeof WeakMap == "function" ? WeakMap : Map;
      Xa = new Gu();
    }
    function ru(e, t) {
      if (!e || qa)
        return "";
      {
        var a = Xa.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      qa = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = Wu.current, Wu.current = null, lc();
      try {
        if (t) {
          var f = function() {
            throw Error();
          };
          if (Object.defineProperty(f.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(f, []);
            } catch (U) {
              i = U;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (U) {
              i = U;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (U) {
            i = U;
          }
          e();
        }
      } catch (U) {
        if (U && i && typeof U.stack == "string") {
          for (var p = U.stack.split(`
`), v = i.stack.split(`
`), y = p.length - 1, g = v.length - 1; y >= 1 && g >= 0 && p[y] !== v[g]; )
            g--;
          for (; y >= 1 && g >= 0; y--, g--)
            if (p[y] !== v[g]) {
              if (y !== 1 || g !== 1)
                do
                  if (y--, g--, g < 0 || p[y] !== v[g]) {
                    var b = `
` + p[y].replace(" at new ", " at ");
                    return e.displayName && b.includes("<anonymous>") && (b = b.replace("<anonymous>", e.displayName)), typeof e == "function" && Xa.set(e, b), b;
                  }
                while (y >= 1 && g >= 0);
              break;
            }
        }
      } finally {
        qa = !1, Wu.current = s, uc(), Error.prepareStackTrace = u;
      }
      var x = e ? e.displayName || e.name : "", N = x ? fa(x) : "";
      return typeof e == "function" && Xa.set(e, N), N;
    }
    function yl(e, t, a) {
      return ru(e, !0);
    }
    function Ku(e, t, a) {
      return ru(e, !1);
    }
    function qu(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Hi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return ru(e, qu(e));
      if (typeof e == "string")
        return fa(e);
      switch (e) {
        case ue:
          return fa("Suspense");
        case ye:
          return fa("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case B:
            return Ku(e.render);
          case Ke:
            return Hi(e.type, t, a);
          case Ye: {
            var i = e, u = i._payload, s = i._init;
            try {
              return Hi(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Qf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case X:
          return fa(e.type);
        case ln:
          return fa("Lazy");
        case ke:
          return fa("Suspense");
        case un:
          return fa("SuspenseList");
        case fe:
        case et:
        case He:
          return Ku(e.type);
        case We:
          return Ku(e.type.render);
        case de:
          return yl(e.type);
        default:
          return "";
      }
    }
    function Vi(e) {
      try {
        var t = "", a = e;
        do
          t += Qf(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Ot(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Xu(e) {
      return e.displayName || "Context";
    }
    function Tt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && S("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case fi:
          return "Fragment";
        case rr:
          return "Portal";
        case di:
          return "Profiler";
        case Qa:
          return "StrictMode";
        case ue:
          return "Suspense";
        case ye:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case R:
            var t = e;
            return Xu(t) + ".Consumer";
          case pi:
            var a = e;
            return Xu(a._context) + ".Provider";
          case B:
            return Ot(e, e.render, "ForwardRef");
          case Ke:
            var i = e.displayName || null;
            return i !== null ? i : Tt(e.type) || "Memo";
          case Ye: {
            var u = e, s = u._payload, f = u._init;
            try {
              return Tt(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function $o(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function vi(e) {
      return e.displayName || "Context";
    }
    function Ie(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case _t:
          return "Cache";
        case Jt:
          var i = a;
          return vi(i) + ".Consumer";
        case pt:
          var u = a;
          return vi(u._context) + ".Provider";
        case Zt:
          return "DehydratedFragment";
        case We:
          return $o(a, a.render, "ForwardRef");
        case Qe:
          return "Fragment";
        case X:
          return a;
        case K:
          return "Portal";
        case ee:
          return "Root";
        case le:
          return "Text";
        case ln:
          return Tt(a);
        case st:
          return a === Qa ? "StrictMode" : "Mode";
        case Le:
          return "Offscreen";
        case vt:
          return "Profiler";
        case bt:
          return "Scope";
        case ke:
          return "Suspense";
        case un:
          return "SuspenseList";
        case Dt:
          return "TracingMarker";
        case de:
        case fe:
        case Ht:
        case et:
        case ct:
        case He:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var Ju = A.ReactDebugCurrentFrame, ir = null, hi = !1;
    function Dr() {
      {
        if (ir === null)
          return null;
        var e = ir._debugOwner;
        if (e !== null && typeof e < "u")
          return Ie(e);
      }
      return null;
    }
    function mi() {
      return ir === null ? "" : Vi(ir);
    }
    function cn() {
      Ju.getCurrentStack = null, ir = null, hi = !1;
    }
    function $t(e) {
      Ju.getCurrentStack = e === null ? null : mi, ir = e, hi = !1;
    }
    function gl() {
      return ir;
    }
    function Yn(e) {
      hi = e;
    }
    function Or(e) {
      return "" + e;
    }
    function xa(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return Rn(e), e;
        default:
          return "";
      }
    }
    var au = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Qo(e, t) {
      au[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || S("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || S("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function Wo(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Sl(e) {
      return e._valueTracker;
    }
    function iu(e) {
      e._valueTracker = null;
    }
    function Wf(e) {
      var t = "";
      return e && (Wo(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function wa(e) {
      var t = Wo(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      Rn(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(p) {
            Rn(p), i = "" + p, s.call(this, p);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(p) {
            Rn(p), i = "" + p;
          },
          stopTracking: function() {
            iu(e), delete e[t];
          }
        };
        return f;
      }
    }
    function Ja(e) {
      Sl(e) || (e._valueTracker = wa(e));
    }
    function yi(e) {
      if (!e)
        return !1;
      var t = Sl(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Wf(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function ba(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Zu = !1, eo = !1, El = !1, lu = !1;
    function to(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function no(e, t) {
      var a = e, i = t.checked, u = Ze({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function Za(e, t) {
      Qo("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !eo && (S("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Dr() || "A component", t.type), eo = !0), t.value !== void 0 && t.defaultValue !== void 0 && !Zu && (S("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Dr() || "A component", t.type), Zu = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: xa(t.value != null ? t.value : i),
        controlled: to(t)
      };
    }
    function h(e, t) {
      var a = e, i = t.checked;
      i != null && br(a, "checked", i, !1);
    }
    function C(e, t) {
      var a = e;
      {
        var i = to(t);
        !a._wrapperState.controlled && i && !lu && (S("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), lu = !0), a._wrapperState.controlled && !i && !El && (S("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), El = !0);
      }
      h(e, t);
      var u = xa(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Or(u)) : a.value !== Or(u) && (a.value = Or(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Ne(a, t.type, u) : t.hasOwnProperty("defaultValue") && Ne(a, t.type, xa(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function M(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, s = u === "submit" || u === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Or(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var p = i.name;
      p !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, p !== "" && (i.name = p);
    }
    function j(e, t) {
      var a = e;
      C(a, t), q(a, t);
    }
    function q(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        Bn(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < u.length; s++) {
          var f = u[s];
          if (!(f === e || f.form !== e.form)) {
            var p = Lh(f);
            if (!p)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            yi(f), C(f, p);
          }
        }
      }
    }
    function Ne(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || ba(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Or(e._wrapperState.initialValue) : e.defaultValue !== Or(a) && (e.defaultValue = Or(a)));
    }
    var ie = !1, Ue = !1, dt = !1;
    function xt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? ne.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || Ue || (Ue = !0, S("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (dt || (dt = !0, S("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !ie && (S("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), ie = !0);
    }
    function rn(e, t) {
      t.value != null && e.setAttribute("value", Or(xa(t.value)));
    }
    var Qt = Array.isArray;
    function at(e) {
      return Qt(e);
    }
    var Wt;
    Wt = !1;
    function hn() {
      var e = Dr();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Cl = ["value", "defaultValue"];
    function Go(e) {
      {
        Qo("select", e);
        for (var t = 0; t < Cl.length; t++) {
          var a = Cl[t];
          if (e[a] != null) {
            var i = at(e[a]);
            e.multiple && !i ? S("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, hn()) : !e.multiple && i && S("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, hn());
          }
        }
      }
    }
    function Pi(e, t, a, i) {
      var u = e.options;
      if (t) {
        for (var s = a, f = {}, p = 0; p < s.length; p++)
          f["$" + s[p]] = !0;
        for (var v = 0; v < u.length; v++) {
          var y = f.hasOwnProperty("$" + u[v].value);
          u[v].selected !== y && (u[v].selected = y), y && i && (u[v].defaultSelected = !0);
        }
      } else {
        for (var g = Or(xa(a)), b = null, x = 0; x < u.length; x++) {
          if (u[x].value === g) {
            u[x].selected = !0, i && (u[x].defaultSelected = !0);
            return;
          }
          b === null && !u[x].disabled && (b = u[x]);
        }
        b !== null && (b.selected = !0);
      }
    }
    function Ko(e, t) {
      return Ze({}, t, {
        value: void 0
      });
    }
    function uu(e, t) {
      var a = e;
      Go(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Wt && (S("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Wt = !0);
    }
    function Gf(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? Pi(a, !!t.multiple, i, !1) : t.defaultValue != null && Pi(a, !!t.multiple, t.defaultValue, !0);
    }
    function oc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? Pi(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? Pi(a, !!t.multiple, t.defaultValue, !0) : Pi(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Kf(e, t) {
      var a = e, i = t.value;
      i != null && Pi(a, !!t.multiple, i, !1);
    }
    var ev = !1;
    function qf(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = Ze({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Or(a._wrapperState.initialValue)
      });
      return i;
    }
    function Xf(e, t) {
      var a = e;
      Qo("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !ev && (S("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Dr() || "A component"), ev = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          S("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (at(u)) {
              if (u.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              u = u[0];
            }
            s = u;
          }
        }
        s == null && (s = ""), i = s;
      }
      a._wrapperState = {
        initialValue: xa(i)
      };
    }
    function tv(e, t) {
      var a = e, i = xa(t.value), u = xa(t.defaultValue);
      if (i != null) {
        var s = Or(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Or(u));
    }
    function nv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function Wm(e, t) {
      tv(e, t);
    }
    var Bi = "http://www.w3.org/1999/xhtml", Jf = "http://www.w3.org/1998/Math/MathML", Zf = "http://www.w3.org/2000/svg";
    function ed(e) {
      switch (e) {
        case "svg":
          return Zf;
        case "math":
          return Jf;
        default:
          return Bi;
      }
    }
    function td(e, t) {
      return e == null || e === Bi ? ed(t) : e === Zf && t === "foreignObject" ? Bi : e;
    }
    var rv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, sc, av = rv(function(e, t) {
      if (e.namespaceURI === Zf && !("innerHTML" in e)) {
        sc = sc || document.createElement("div"), sc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = sc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Qr = 1, Ii = 3, Nn = 8, Yi = 9, nd = 11, ro = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Ii) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, qo = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, Xo = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function iv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var lv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(Xo).forEach(function(e) {
      lv.forEach(function(t) {
        Xo[iv(t, e)] = Xo[e];
      });
    });
    function cc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Xo.hasOwnProperty(e) && Xo[e]) ? t + "px" : (oa(t, e), ("" + t).trim());
    }
    var uv = /([A-Z])/g, ov = /^ms-/;
    function ao(e) {
      return e.replace(uv, "-$1").toLowerCase().replace(ov, "-ms-");
    }
    var sv = function() {
    };
    {
      var Gm = /^(?:webkit|moz|o)[A-Z]/, Km = /^-ms-/, cv = /-(.)/g, rd = /;\s*$/, gi = {}, ou = {}, fv = !1, Jo = !1, qm = function(e) {
        return e.replace(cv, function(t, a) {
          return a.toUpperCase();
        });
      }, dv = function(e) {
        gi.hasOwnProperty(e) && gi[e] || (gi[e] = !0, S(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          qm(e.replace(Km, "ms-"))
        ));
      }, ad = function(e) {
        gi.hasOwnProperty(e) && gi[e] || (gi[e] = !0, S("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, id = function(e, t) {
        ou.hasOwnProperty(t) && ou[t] || (ou[t] = !0, S(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(rd, "")));
      }, pv = function(e, t) {
        fv || (fv = !0, S("`NaN` is an invalid value for the `%s` css style property.", e));
      }, vv = function(e, t) {
        Jo || (Jo = !0, S("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      sv = function(e, t) {
        e.indexOf("-") > -1 ? dv(e) : Gm.test(e) ? ad(e) : rd.test(t) && id(e, t), typeof t == "number" && (isNaN(t) ? pv(e, t) : isFinite(t) || vv(e, t));
      };
    }
    var hv = sv;
    function Xm(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : ao(i)) + ":", t += cc(i, u, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function mv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || hv(i, t[i]);
          var s = cc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function Jm(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function yv(e) {
      var t = {};
      for (var a in e)
        for (var i = qo[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function Zm(e, t) {
      {
        if (!t)
          return;
        var a = yv(e), i = yv(t), u = {};
        for (var s in a) {
          var f = a[s], p = i[s];
          if (p && f !== p) {
            var v = f + "," + p;
            if (u[v])
              continue;
            u[v] = !0, S("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", Jm(e[f]) ? "Removing" : "Updating", f, p);
          }
        }
      }
    }
    var ei = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, Zo = Ze({
      menuitem: !0
    }, ei), gv = "__html";
    function fc(e, t) {
      if (t) {
        if (Zo[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(gv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && S("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function Rl(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var es = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, dc = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, io = {}, ey = new RegExp("^(aria)-[" + te + "]*$"), lo = new RegExp("^(aria)[A-Z][" + te + "]*$");
    function ld(e, t) {
      {
        if (wr.call(io, t) && io[t])
          return !0;
        if (lo.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = dc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return S("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), io[t] = !0, !0;
          if (t !== i)
            return S("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), io[t] = !0, !0;
        }
        if (ey.test(t)) {
          var u = t.toLowerCase(), s = dc.hasOwnProperty(u) ? u : null;
          if (s == null)
            return io[t] = !0, !1;
          if (t !== s)
            return S("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), io[t] = !0, !0;
        }
      }
      return !0;
    }
    function ts(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = ld(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? S("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && S("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function ud(e, t) {
      Rl(e, t) || ts(e, t);
    }
    var od = !1;
    function pc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !od && (od = !0, e === "select" && t.multiple ? S("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : S("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var su = function() {
    };
    {
      var lr = {}, sd = /^on./, vc = /^on[^A-Z]/, Sv = new RegExp("^(aria)-[" + te + "]*$"), Ev = new RegExp("^(aria)[A-Z][" + te + "]*$");
      su = function(e, t, a, i) {
        if (wr.call(lr, t) && lr[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return S("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), lr[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var p = f.hasOwnProperty(u) ? f[u] : null;
          if (p != null)
            return S("Invalid event handler property `%s`. Did you mean `%s`?", t, p), lr[t] = !0, !0;
          if (sd.test(t))
            return S("Unknown event handler property `%s`. It will be ignored.", t), lr[t] = !0, !0;
        } else if (sd.test(t))
          return vc.test(t) && S("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), lr[t] = !0, !0;
        if (Sv.test(t) || Ev.test(t))
          return !0;
        if (u === "innerhtml")
          return S("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), lr[t] = !0, !0;
        if (u === "aria")
          return S("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), lr[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return S("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), lr[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return S("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), lr[t] = !0, !0;
        var v = tn(t), y = v !== null && v.type === In;
        if (es.hasOwnProperty(u)) {
          var g = es[u];
          if (g !== t)
            return S("Invalid DOM property `%s`. Did you mean `%s`?", t, g), lr[t] = !0, !0;
        } else if (!y && t !== u)
          return S("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), lr[t] = !0, !0;
        return typeof a == "boolean" && on(t, a, v, !1) ? (a ? S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), lr[t] = !0, !0) : y ? !0 : on(t, a, v, !1) ? (lr[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === Ln && (S("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), lr[t] = !0), !0);
      };
    }
    var Cv = function(e, t, a) {
      {
        var i = [];
        for (var u in t) {
          var s = su(e, u, t[u], a);
          s || i.push(u);
        }
        var f = i.map(function(p) {
          return "`" + p + "`";
        }).join(", ");
        i.length === 1 ? S("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e) : i.length > 1 && S("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e);
      }
    };
    function Rv(e, t, a) {
      Rl(e, t) || Cv(e, t, a);
    }
    var cd = 1, hc = 2, _a = 4, fd = cd | hc | _a, cu = null;
    function ty(e) {
      cu !== null && S("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), cu = e;
    }
    function ny() {
      cu === null && S("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), cu = null;
    }
    function ns(e) {
      return e === cu;
    }
    function dd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Ii ? t.parentNode : t;
    }
    var mc = null, fu = null, Vt = null;
    function yc(e) {
      var t = ko(e);
      if (t) {
        if (typeof mc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Lh(a);
          mc(t.stateNode, t.type, i);
        }
      }
    }
    function gc(e) {
      mc = e;
    }
    function uo(e) {
      fu ? Vt ? Vt.push(e) : Vt = [e] : fu = e;
    }
    function Tv() {
      return fu !== null || Vt !== null;
    }
    function Sc() {
      if (fu) {
        var e = fu, t = Vt;
        if (fu = null, Vt = null, yc(e), t)
          for (var a = 0; a < t.length; a++)
            yc(t[a]);
      }
    }
    var oo = function(e, t) {
      return e(t);
    }, rs = function() {
    }, Tl = !1;
    function xv() {
      var e = Tv();
      e && (rs(), Sc());
    }
    function wv(e, t, a) {
      if (Tl)
        return e(t, a);
      Tl = !0;
      try {
        return oo(e, t, a);
      } finally {
        Tl = !1, xv();
      }
    }
    function ry(e, t, a) {
      oo = e, rs = a;
    }
    function bv(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function Ec(e, t, a) {
      switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(a.disabled && bv(t));
        default:
          return !1;
      }
    }
    function xl(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Lh(a);
      if (i === null)
        return null;
      var u = i[t];
      if (Ec(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var as = !1;
    if (On)
      try {
        var du = {};
        Object.defineProperty(du, "passive", {
          get: function() {
            as = !0;
          }
        }), window.addEventListener("test", du, du), window.removeEventListener("test", du, du);
      } catch {
        as = !1;
      }
    function Cc(e, t, a, i, u, s, f, p, v) {
      var y = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, y);
      } catch (g) {
        this.onError(g);
      }
    }
    var Rc = Cc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var pd = document.createElement("react");
      Rc = function(t, a, i, u, s, f, p, v, y) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var g = document.createEvent("Event"), b = !1, x = !0, N = window.event, U = Object.getOwnPropertyDescriptor(window, "event");
        function F() {
          pd.removeEventListener(H, Me, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = N);
        }
        var se = Array.prototype.slice.call(arguments, 3);
        function Me() {
          b = !0, F(), a.apply(i, se), x = !1;
        }
        var be, Rt = !1, ht = !1;
        function D(O) {
          if (be = O.error, Rt = !0, be === null && O.colno === 0 && O.lineno === 0 && (ht = !0), O.defaultPrevented && be != null && typeof be == "object")
            try {
              be._suppressLogging = !0;
            } catch {
            }
        }
        var H = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", D), pd.addEventListener(H, Me, !1), g.initEvent(H, !1, !1), pd.dispatchEvent(g), U && Object.defineProperty(window, "event", U), b && x && (Rt ? ht && (be = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : be = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(be)), window.removeEventListener("error", D), !b)
          return F(), Cc.apply(this, arguments);
      };
    }
    var _v = Rc, so = !1, Tc = null, co = !1, Si = null, kv = {
      onError: function(e) {
        so = !0, Tc = e;
      }
    };
    function wl(e, t, a, i, u, s, f, p, v) {
      so = !1, Tc = null, _v.apply(kv, arguments);
    }
    function Ei(e, t, a, i, u, s, f, p, v) {
      if (wl.apply(this, arguments), so) {
        var y = ls();
        co || (co = !0, Si = y);
      }
    }
    function is() {
      if (co) {
        var e = Si;
        throw co = !1, Si = null, e;
      }
    }
    function $i() {
      return so;
    }
    function ls() {
      if (so) {
        var e = Tc;
        return so = !1, Tc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function fo(e) {
      return e._reactInternals;
    }
    function ay(e) {
      return e._reactInternals !== void 0;
    }
    function pu(e, t) {
      e._reactInternals = t;
    }
    var De = (
      /*                      */
      0
    ), ti = (
      /*                */
      1
    ), mn = (
      /*                    */
      2
    ), St = (
      /*                       */
      4
    ), ka = (
      /*                */
      16
    ), Da = (
      /*                 */
      32
    ), an = (
      /*                     */
      64
    ), _e = (
      /*                   */
      128
    ), Cr = (
      /*            */
      256
    ), En = (
      /*                          */
      512
    ), $n = (
      /*                     */
      1024
    ), Wr = (
      /*                      */
      2048
    ), Gr = (
      /*                    */
      4096
    ), Mn = (
      /*                   */
      8192
    ), po = (
      /*             */
      16384
    ), Dv = (
      /*               */
      32767
    ), us = (
      /*                   */
      32768
    ), Xn = (
      /*                */
      65536
    ), xc = (
      /* */
      131072
    ), Ci = (
      /*                       */
      1048576
    ), vo = (
      /*                    */
      2097152
    ), Qi = (
      /*                 */
      4194304
    ), wc = (
      /*                */
      8388608
    ), bl = (
      /*               */
      16777216
    ), Ri = (
      /*              */
      33554432
    ), _l = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      St | $n | 0
    ), kl = mn | St | ka | Da | En | Gr | Mn, Dl = St | an | En | Mn, Wi = Wr | ka, zn = Qi | wc | vo, Oa = A.ReactCurrentOwner;
    function da(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (mn | Gr)) !== De && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === ee ? a : null;
    }
    function Ti(e) {
      if (e.tag === ke) {
        var t = e.memoizedState;
        if (t === null) {
          var a = e.alternate;
          a !== null && (t = a.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function xi(e) {
      return e.tag === ee ? e.stateNode.containerInfo : null;
    }
    function vu(e) {
      return da(e) === e;
    }
    function Ov(e) {
      {
        var t = Oa.current;
        if (t !== null && t.tag === de) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || S("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Ie(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = fo(e);
      return u ? da(u) === u : !1;
    }
    function bc(e) {
      if (da(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function _c(e) {
      var t = e.alternate;
      if (!t) {
        var a = da(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, u = t; ; ) {
        var s = i.return;
        if (s === null)
          break;
        var f = s.alternate;
        if (f === null) {
          var p = s.return;
          if (p !== null) {
            i = u = p;
            continue;
          }
          break;
        }
        if (s.child === f.child) {
          for (var v = s.child; v; ) {
            if (v === i)
              return bc(s), e;
            if (v === u)
              return bc(s), t;
            v = v.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== u.return)
          i = s, u = f;
        else {
          for (var y = !1, g = s.child; g; ) {
            if (g === i) {
              y = !0, i = s, u = f;
              break;
            }
            if (g === u) {
              y = !0, u = s, i = f;
              break;
            }
            g = g.sibling;
          }
          if (!y) {
            for (g = f.child; g; ) {
              if (g === i) {
                y = !0, i = f, u = s;
                break;
              }
              if (g === u) {
                y = !0, u = f, i = s;
                break;
              }
              g = g.sibling;
            }
            if (!y)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== u)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== ee)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Kr(e) {
      var t = _c(e);
      return t !== null ? qr(t) : null;
    }
    function qr(e) {
      if (e.tag === X || e.tag === le)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = qr(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function dn(e) {
      var t = _c(e);
      return t !== null ? La(t) : null;
    }
    function La(e) {
      if (e.tag === X || e.tag === le)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== K) {
          var a = La(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var vd = Z.unstable_scheduleCallback, Lv = Z.unstable_cancelCallback, hd = Z.unstable_shouldYield, md = Z.unstable_requestPaint, Qn = Z.unstable_now, kc = Z.unstable_getCurrentPriorityLevel, os = Z.unstable_ImmediatePriority, Ol = Z.unstable_UserBlockingPriority, Gi = Z.unstable_NormalPriority, iy = Z.unstable_LowPriority, hu = Z.unstable_IdlePriority, Dc = Z.unstable_yieldValue, Nv = Z.unstable_setDisableYieldValue, mu = null, xn = null, oe = null, pa = !1, Xr = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function ho(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return S("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Ve && (e = Ze({}, e, {
          getLaneLabelMap: yu,
          injectProfilingHooks: Na
        })), mu = t.inject(e), xn = t;
      } catch (a) {
        S("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function yd(e, t) {
      if (xn && typeof xn.onScheduleFiberRoot == "function")
        try {
          xn.onScheduleFiberRoot(mu, e, t);
        } catch (a) {
          pa || (pa = !0, S("React instrumentation encountered an error: %s", a));
        }
    }
    function gd(e, t) {
      if (xn && typeof xn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & _e) === _e;
          if (je) {
            var i;
            switch (t) {
              case Lr:
                i = os;
                break;
              case bi:
                i = Ol;
                break;
              case Ma:
                i = Gi;
                break;
              case za:
                i = hu;
                break;
              default:
                i = Gi;
                break;
            }
            xn.onCommitFiberRoot(mu, e, i, a);
          }
        } catch (u) {
          pa || (pa = !0, S("React instrumentation encountered an error: %s", u));
        }
    }
    function Sd(e) {
      if (xn && typeof xn.onPostCommitFiberRoot == "function")
        try {
          xn.onPostCommitFiberRoot(mu, e);
        } catch (t) {
          pa || (pa = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Ed(e) {
      if (xn && typeof xn.onCommitFiberUnmount == "function")
        try {
          xn.onCommitFiberUnmount(mu, e);
        } catch (t) {
          pa || (pa = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function yn(e) {
      if (typeof Dc == "function" && (Nv(e), mt(e)), xn && typeof xn.setStrictMode == "function")
        try {
          xn.setStrictMode(mu, e);
        } catch (t) {
          pa || (pa = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Na(e) {
      oe = e;
    }
    function yu() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < Eu; a++) {
          var i = Av(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Cd(e) {
      oe !== null && typeof oe.markCommitStarted == "function" && oe.markCommitStarted(e);
    }
    function Rd() {
      oe !== null && typeof oe.markCommitStopped == "function" && oe.markCommitStopped();
    }
    function va(e) {
      oe !== null && typeof oe.markComponentRenderStarted == "function" && oe.markComponentRenderStarted(e);
    }
    function ha() {
      oe !== null && typeof oe.markComponentRenderStopped == "function" && oe.markComponentRenderStopped();
    }
    function Td(e) {
      oe !== null && typeof oe.markComponentPassiveEffectMountStarted == "function" && oe.markComponentPassiveEffectMountStarted(e);
    }
    function Mv() {
      oe !== null && typeof oe.markComponentPassiveEffectMountStopped == "function" && oe.markComponentPassiveEffectMountStopped();
    }
    function Ki(e) {
      oe !== null && typeof oe.markComponentPassiveEffectUnmountStarted == "function" && oe.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ll() {
      oe !== null && typeof oe.markComponentPassiveEffectUnmountStopped == "function" && oe.markComponentPassiveEffectUnmountStopped();
    }
    function Oc(e) {
      oe !== null && typeof oe.markComponentLayoutEffectMountStarted == "function" && oe.markComponentLayoutEffectMountStarted(e);
    }
    function zv() {
      oe !== null && typeof oe.markComponentLayoutEffectMountStopped == "function" && oe.markComponentLayoutEffectMountStopped();
    }
    function ss(e) {
      oe !== null && typeof oe.markComponentLayoutEffectUnmountStarted == "function" && oe.markComponentLayoutEffectUnmountStarted(e);
    }
    function xd() {
      oe !== null && typeof oe.markComponentLayoutEffectUnmountStopped == "function" && oe.markComponentLayoutEffectUnmountStopped();
    }
    function cs(e, t, a) {
      oe !== null && typeof oe.markComponentErrored == "function" && oe.markComponentErrored(e, t, a);
    }
    function wi(e, t, a) {
      oe !== null && typeof oe.markComponentSuspended == "function" && oe.markComponentSuspended(e, t, a);
    }
    function fs(e) {
      oe !== null && typeof oe.markLayoutEffectsStarted == "function" && oe.markLayoutEffectsStarted(e);
    }
    function ds() {
      oe !== null && typeof oe.markLayoutEffectsStopped == "function" && oe.markLayoutEffectsStopped();
    }
    function gu(e) {
      oe !== null && typeof oe.markPassiveEffectsStarted == "function" && oe.markPassiveEffectsStarted(e);
    }
    function wd() {
      oe !== null && typeof oe.markPassiveEffectsStopped == "function" && oe.markPassiveEffectsStopped();
    }
    function Su(e) {
      oe !== null && typeof oe.markRenderStarted == "function" && oe.markRenderStarted(e);
    }
    function Uv() {
      oe !== null && typeof oe.markRenderYielded == "function" && oe.markRenderYielded();
    }
    function Lc() {
      oe !== null && typeof oe.markRenderStopped == "function" && oe.markRenderStopped();
    }
    function gn(e) {
      oe !== null && typeof oe.markRenderScheduled == "function" && oe.markRenderScheduled(e);
    }
    function Nc(e, t) {
      oe !== null && typeof oe.markForceUpdateScheduled == "function" && oe.markForceUpdateScheduled(e, t);
    }
    function ps(e, t) {
      oe !== null && typeof oe.markStateUpdateScheduled == "function" && oe.markStateUpdateScheduled(e, t);
    }
    var Oe = (
      /*                         */
      0
    ), ot = (
      /*                 */
      1
    ), Lt = (
      /*                    */
      2
    ), Gt = (
      /*               */
      8
    ), Nt = (
      /*              */
      16
    ), Un = Math.clz32 ? Math.clz32 : vs, Jn = Math.log, Mc = Math.LN2;
    function vs(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Jn(t) / Mc | 0) | 0;
    }
    var Eu = 31, I = (
      /*                        */
      0
    ), kt = (
      /*                          */
      0
    ), Fe = (
      /*                        */
      1
    ), Nl = (
      /*    */
      2
    ), ni = (
      /*             */
      4
    ), Rr = (
      /*            */
      8
    ), wn = (
      /*                     */
      16
    ), qi = (
      /*                */
      32
    ), Ml = (
      /*                       */
      4194240
    ), Cu = (
      /*                        */
      64
    ), zc = (
      /*                        */
      128
    ), Uc = (
      /*                        */
      256
    ), Ac = (
      /*                        */
      512
    ), jc = (
      /*                        */
      1024
    ), Fc = (
      /*                        */
      2048
    ), Hc = (
      /*                        */
      4096
    ), Vc = (
      /*                        */
      8192
    ), Pc = (
      /*                        */
      16384
    ), Ru = (
      /*                       */
      32768
    ), Bc = (
      /*                       */
      65536
    ), mo = (
      /*                       */
      131072
    ), yo = (
      /*                       */
      262144
    ), Ic = (
      /*                       */
      524288
    ), hs = (
      /*                       */
      1048576
    ), Yc = (
      /*                       */
      2097152
    ), ms = (
      /*                            */
      130023424
    ), Tu = (
      /*                             */
      4194304
    ), $c = (
      /*                             */
      8388608
    ), ys = (
      /*                             */
      16777216
    ), Qc = (
      /*                             */
      33554432
    ), Wc = (
      /*                             */
      67108864
    ), bd = Tu, gs = (
      /*          */
      134217728
    ), _d = (
      /*                          */
      268435455
    ), Ss = (
      /*               */
      268435456
    ), xu = (
      /*                        */
      536870912
    ), Jr = (
      /*                   */
      1073741824
    );
    function Av(e) {
      {
        if (e & Fe)
          return "Sync";
        if (e & Nl)
          return "InputContinuousHydration";
        if (e & ni)
          return "InputContinuous";
        if (e & Rr)
          return "DefaultHydration";
        if (e & wn)
          return "Default";
        if (e & qi)
          return "TransitionHydration";
        if (e & Ml)
          return "Transition";
        if (e & ms)
          return "Retry";
        if (e & gs)
          return "SelectiveHydration";
        if (e & Ss)
          return "IdleHydration";
        if (e & xu)
          return "Idle";
        if (e & Jr)
          return "Offscreen";
      }
    }
    var Xt = -1, wu = Cu, Gc = Tu;
    function Es(e) {
      switch (zl(e)) {
        case Fe:
          return Fe;
        case Nl:
          return Nl;
        case ni:
          return ni;
        case Rr:
          return Rr;
        case wn:
          return wn;
        case qi:
          return qi;
        case Cu:
        case zc:
        case Uc:
        case Ac:
        case jc:
        case Fc:
        case Hc:
        case Vc:
        case Pc:
        case Ru:
        case Bc:
        case mo:
        case yo:
        case Ic:
        case hs:
        case Yc:
          return e & Ml;
        case Tu:
        case $c:
        case ys:
        case Qc:
        case Wc:
          return e & ms;
        case gs:
          return gs;
        case Ss:
          return Ss;
        case xu:
          return xu;
        case Jr:
          return Jr;
        default:
          return S("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Kc(e, t) {
      var a = e.pendingLanes;
      if (a === I)
        return I;
      var i = I, u = e.suspendedLanes, s = e.pingedLanes, f = a & _d;
      if (f !== I) {
        var p = f & ~u;
        if (p !== I)
          i = Es(p);
        else {
          var v = f & s;
          v !== I && (i = Es(v));
        }
      } else {
        var y = a & ~u;
        y !== I ? i = Es(y) : s !== I && (i = Es(s));
      }
      if (i === I)
        return I;
      if (t !== I && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === I) {
        var g = zl(i), b = zl(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          g >= b || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          g === wn && (b & Ml) !== I
        )
          return t;
      }
      (i & ni) !== I && (i |= a & wn);
      var x = e.entangledLanes;
      if (x !== I)
        for (var N = e.entanglements, U = i & x; U > 0; ) {
          var F = An(U), se = 1 << F;
          i |= N[F], U &= ~se;
        }
      return i;
    }
    function ri(e, t) {
      for (var a = e.eventTimes, i = Xt; t > 0; ) {
        var u = An(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function kd(e, t) {
      switch (e) {
        case Fe:
        case Nl:
        case ni:
          return t + 250;
        case Rr:
        case wn:
        case qi:
        case Cu:
        case zc:
        case Uc:
        case Ac:
        case jc:
        case Fc:
        case Hc:
        case Vc:
        case Pc:
        case Ru:
        case Bc:
        case mo:
        case yo:
        case Ic:
        case hs:
        case Yc:
          return t + 5e3;
        case Tu:
        case $c:
        case ys:
        case Qc:
        case Wc:
          return Xt;
        case gs:
        case Ss:
        case xu:
        case Jr:
          return Xt;
        default:
          return S("Should have found matching lanes. This is a bug in React."), Xt;
      }
    }
    function qc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = An(f), v = 1 << p, y = s[p];
        y === Xt ? ((v & i) === I || (v & u) !== I) && (s[p] = kd(v, t)) : y <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function jv(e) {
      return Es(e.pendingLanes);
    }
    function Xc(e) {
      var t = e.pendingLanes & ~Jr;
      return t !== I ? t : t & Jr ? Jr : I;
    }
    function Fv(e) {
      return (e & Fe) !== I;
    }
    function Cs(e) {
      return (e & _d) !== I;
    }
    function bu(e) {
      return (e & ms) === e;
    }
    function Dd(e) {
      var t = Fe | ni | wn;
      return (e & t) === I;
    }
    function Od(e) {
      return (e & Ml) === e;
    }
    function Jc(e, t) {
      var a = Nl | ni | Rr | wn;
      return (t & a) !== I;
    }
    function Hv(e, t) {
      return (t & e.expiredLanes) !== I;
    }
    function Ld(e) {
      return (e & Ml) !== I;
    }
    function Nd() {
      var e = wu;
      return wu <<= 1, (wu & Ml) === I && (wu = Cu), e;
    }
    function Vv() {
      var e = Gc;
      return Gc <<= 1, (Gc & ms) === I && (Gc = Tu), e;
    }
    function zl(e) {
      return e & -e;
    }
    function Rs(e) {
      return zl(e);
    }
    function An(e) {
      return 31 - Un(e);
    }
    function ur(e) {
      return An(e);
    }
    function Zr(e, t) {
      return (e & t) !== I;
    }
    function _u(e, t) {
      return (e & t) === t;
    }
    function Xe(e, t) {
      return e | t;
    }
    function Ts(e, t) {
      return e & ~t;
    }
    function Md(e, t) {
      return e & t;
    }
    function Pv(e) {
      return e;
    }
    function Bv(e, t) {
      return e !== kt && e < t ? e : t;
    }
    function xs(e) {
      for (var t = [], a = 0; a < Eu; a++)
        t.push(e);
      return t;
    }
    function go(e, t, a) {
      e.pendingLanes |= t, t !== xu && (e.suspendedLanes = I, e.pingedLanes = I);
      var i = e.eventTimes, u = ur(t);
      i[u] = a;
    }
    function Iv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = An(i), s = 1 << u;
        a[u] = Xt, i &= ~s;
      }
    }
    function Zc(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function zd(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = I, e.pingedLanes = I, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = An(f), v = 1 << p;
        i[p] = I, u[p] = Xt, s[p] = Xt, f &= ~v;
      }
    }
    function ef(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = An(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function Ud(e, t) {
      var a = zl(t), i;
      switch (a) {
        case ni:
          i = Nl;
          break;
        case wn:
          i = Rr;
          break;
        case Cu:
        case zc:
        case Uc:
        case Ac:
        case jc:
        case Fc:
        case Hc:
        case Vc:
        case Pc:
        case Ru:
        case Bc:
        case mo:
        case yo:
        case Ic:
        case hs:
        case Yc:
        case Tu:
        case $c:
        case ys:
        case Qc:
        case Wc:
          i = qi;
          break;
        case xu:
          i = Ss;
          break;
        default:
          i = kt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== kt ? kt : i;
    }
    function ws(e, t, a) {
      if (Xr)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = ur(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function Yv(e, t) {
      if (Xr)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = ur(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function Ad(e, t) {
      return null;
    }
    var Lr = Fe, bi = ni, Ma = wn, za = xu, bs = kt;
    function Ua() {
      return bs;
    }
    function jn(e) {
      bs = e;
    }
    function $v(e, t) {
      var a = bs;
      try {
        return bs = e, t();
      } finally {
        bs = a;
      }
    }
    function Qv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function _s(e, t) {
      return e > t ? e : t;
    }
    function Zn(e, t) {
      return e !== 0 && e < t;
    }
    function Wv(e) {
      var t = zl(e);
      return Zn(Lr, t) ? Zn(bi, t) ? Cs(t) ? Ma : za : bi : Lr;
    }
    function tf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var ks;
    function Tr(e) {
      ks = e;
    }
    function ly(e) {
      ks(e);
    }
    var me;
    function So(e) {
      me = e;
    }
    var nf;
    function Gv(e) {
      nf = e;
    }
    var Kv;
    function Ds(e) {
      Kv = e;
    }
    var Os;
    function jd(e) {
      Os = e;
    }
    var rf = !1, Ls = [], Xi = null, _i = null, ki = null, bn = /* @__PURE__ */ new Map(), Nr = /* @__PURE__ */ new Map(), Mr = [], qv = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function Xv(e) {
      return qv.indexOf(e) > -1;
    }
    function ai(e, t, a, i, u) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: u,
        targetContainers: [i]
      };
    }
    function Fd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Xi = null;
          break;
        case "dragenter":
        case "dragleave":
          _i = null;
          break;
        case "mouseover":
        case "mouseout":
          ki = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          bn.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Nr.delete(i);
          break;
        }
      }
    }
    function ea(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = ai(t, a, i, u, s);
        if (t !== null) {
          var p = ko(t);
          p !== null && me(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return u !== null && v.indexOf(u) === -1 && v.push(u), e;
    }
    function uy(e, t, a, i, u) {
      switch (t) {
        case "focusin": {
          var s = u;
          return Xi = ea(Xi, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = u;
          return _i = ea(_i, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var p = u;
          return ki = ea(ki, e, t, a, i, p), !0;
        }
        case "pointerover": {
          var v = u, y = v.pointerId;
          return bn.set(y, ea(bn.get(y) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var g = u, b = g.pointerId;
          return Nr.set(b, ea(Nr.get(b) || null, e, t, a, i, g)), !0;
        }
      }
      return !1;
    }
    function Hd(e) {
      var t = Is(e.target);
      if (t !== null) {
        var a = da(t);
        if (a !== null) {
          var i = a.tag;
          if (i === ke) {
            var u = Ti(a);
            if (u !== null) {
              e.blockedOn = u, Os(e.priority, function() {
                nf(a);
              });
              return;
            }
          } else if (i === ee) {
            var s = a.stateNode;
            if (tf(s)) {
              e.blockedOn = xi(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function Jv(e) {
      for (var t = Kv(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < Mr.length && Zn(t, Mr[i].priority); i++)
        ;
      Mr.splice(i, 0, a), i === 0 && Hd(a);
    }
    function Ns(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = Co(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          ty(s), u.target.dispatchEvent(s), ny();
        } else {
          var f = ko(i);
          return f !== null && me(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Vd(e, t, a) {
      Ns(e) && a.delete(t);
    }
    function oy() {
      rf = !1, Xi !== null && Ns(Xi) && (Xi = null), _i !== null && Ns(_i) && (_i = null), ki !== null && Ns(ki) && (ki = null), bn.forEach(Vd), Nr.forEach(Vd);
    }
    function Ul(e, t) {
      e.blockedOn === t && (e.blockedOn = null, rf || (rf = !0, Z.unstable_scheduleCallback(Z.unstable_NormalPriority, oy)));
    }
    function ku(e) {
      if (Ls.length > 0) {
        Ul(Ls[0], e);
        for (var t = 1; t < Ls.length; t++) {
          var a = Ls[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Xi !== null && Ul(Xi, e), _i !== null && Ul(_i, e), ki !== null && Ul(ki, e);
      var i = function(p) {
        return Ul(p, e);
      };
      bn.forEach(i), Nr.forEach(i);
      for (var u = 0; u < Mr.length; u++) {
        var s = Mr[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; Mr.length > 0; ) {
        var f = Mr[0];
        if (f.blockedOn !== null)
          break;
        Hd(f), f.blockedOn === null && Mr.shift();
      }
    }
    var or = A.ReactCurrentBatchConfig, Et = !0;
    function Wn(e) {
      Et = !!e;
    }
    function Fn() {
      return Et;
    }
    function sr(e, t, a) {
      var i = af(t), u;
      switch (i) {
        case Lr:
          u = ma;
          break;
        case bi:
          u = Eo;
          break;
        case Ma:
        default:
          u = _n;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function ma(e, t, a, i) {
      var u = Ua(), s = or.transition;
      or.transition = null;
      try {
        jn(Lr), _n(e, t, a, i);
      } finally {
        jn(u), or.transition = s;
      }
    }
    function Eo(e, t, a, i) {
      var u = Ua(), s = or.transition;
      or.transition = null;
      try {
        jn(bi), _n(e, t, a, i);
      } finally {
        jn(u), or.transition = s;
      }
    }
    function _n(e, t, a, i) {
      Et && Ms(e, t, a, i);
    }
    function Ms(e, t, a, i) {
      var u = Co(e, t, a, i);
      if (u === null) {
        wy(e, t, i, Di, a), Fd(e, i);
        return;
      }
      if (uy(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Fd(e, i), t & _a && Xv(e)) {
        for (; u !== null; ) {
          var s = ko(u);
          s !== null && ly(s);
          var f = Co(e, t, a, i);
          if (f === null && wy(e, t, i, Di, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      wy(e, t, i, null, a);
    }
    var Di = null;
    function Co(e, t, a, i) {
      Di = null;
      var u = dd(i), s = Is(u);
      if (s !== null) {
        var f = da(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === ke) {
            var v = Ti(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === ee) {
            var y = f.stateNode;
            if (tf(y))
              return xi(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return Di = s, null;
    }
    function af(e) {
      switch (e) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return Lr;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return bi;
        case "message": {
          var t = kc();
          switch (t) {
            case os:
              return Lr;
            case Ol:
              return bi;
            case Gi:
            case iy:
              return Ma;
            case hu:
              return za;
            default:
              return Ma;
          }
        }
        default:
          return Ma;
      }
    }
    function zs(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function ta(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Pd(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function Ro(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var ya = null, To = null, Du = null;
    function Al(e) {
      return ya = e, To = Us(), !0;
    }
    function lf() {
      ya = null, To = null, Du = null;
    }
    function Ji() {
      if (Du)
        return Du;
      var e, t = To, a = t.length, i, u = Us(), s = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++)
        ;
      var f = a - e;
      for (i = 1; i <= f && t[a - i] === u[s - i]; i++)
        ;
      var p = i > 1 ? 1 - i : void 0;
      return Du = u.slice(e, p), Du;
    }
    function Us() {
      return "value" in ya ? ya.value : ya.textContent;
    }
    function jl(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function xo() {
      return !0;
    }
    function As() {
      return !1;
    }
    function xr(e) {
      function t(a, i, u, s, f) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var y = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return y ? this.isDefaultPrevented = xo : this.isDefaultPrevented = As, this.isPropagationStopped = As, this;
      }
      return Ze(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = xo);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = xo);
        },
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function() {
        },
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: xo
      }), t;
    }
    var Hn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Oi = xr(Hn), zr = Ze({}, Hn, {
      view: 0,
      detail: 0
    }), na = xr(zr), uf, js, Ou;
    function sy(e) {
      e !== Ou && (Ou && e.type === "mousemove" ? (uf = e.screenX - Ou.screenX, js = e.screenY - Ou.screenY) : (uf = 0, js = 0), Ou = e);
    }
    var ii = Ze({}, zr, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: pn,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (sy(e), uf);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : js;
      }
    }), Bd = xr(ii), Id = Ze({}, ii, {
      dataTransfer: 0
    }), Lu = xr(Id), Yd = Ze({}, zr, {
      relatedTarget: 0
    }), Zi = xr(Yd), Zv = Ze({}, Hn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), eh = xr(Zv), $d = Ze({}, Hn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), of = xr($d), cy = Ze({}, Hn, {
      data: 0
    }), th = xr(cy), nh = th, rh = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, Nu = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    function fy(e) {
      if (e.key) {
        var t = rh[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = jl(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Nu[e.keyCode] || "Unidentified" : "";
    }
    var wo = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function ah(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = wo[e];
      return i ? !!a[i] : !1;
    }
    function pn(e) {
      return ah;
    }
    var dy = Ze({}, zr, {
      key: fy,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: pn,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? jl(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? jl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), ih = xr(dy), py = Ze({}, ii, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), lh = xr(py), uh = Ze({}, zr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: pn
    }), oh = xr(uh), vy = Ze({}, Hn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Aa = xr(vy), Qd = Ze({}, ii, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), hy = xr(Qd), Fl = [9, 13, 27, 32], Fs = 229, el = On && "CompositionEvent" in window, Hl = null;
    On && "documentMode" in document && (Hl = document.documentMode);
    var Wd = On && "TextEvent" in window && !Hl, sf = On && (!el || Hl && Hl > 8 && Hl <= 11), sh = 32, cf = String.fromCharCode(sh);
    function my() {
      lt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), lt("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), lt("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), lt("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Gd = !1;
    function ch(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function ff(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function df(e, t) {
      return e === "keydown" && t.keyCode === Fs;
    }
    function Kd(e, t) {
      switch (e) {
        case "keyup":
          return Fl.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Fs;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function pf(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function fh(e) {
      return e.locale === "ko";
    }
    var Mu = !1;
    function qd(e, t, a, i, u) {
      var s, f;
      if (el ? s = ff(t) : Mu ? Kd(t, i) && (s = "onCompositionEnd") : df(t, i) && (s = "onCompositionStart"), !s)
        return null;
      sf && !fh(i) && (!Mu && s === "onCompositionStart" ? Mu = Al(u) : s === "onCompositionEnd" && Mu && (f = Ji()));
      var p = gh(a, s);
      if (p.length > 0) {
        var v = new th(s, t, null, i, u);
        if (e.push({
          event: v,
          listeners: p
        }), f)
          v.data = f;
        else {
          var y = pf(i);
          y !== null && (v.data = y);
        }
      }
    }
    function vf(e, t) {
      switch (e) {
        case "compositionend":
          return pf(t);
        case "keypress":
          var a = t.which;
          return a !== sh ? null : (Gd = !0, cf);
        case "textInput":
          var i = t.data;
          return i === cf && Gd ? null : i;
        default:
          return null;
      }
    }
    function Xd(e, t) {
      if (Mu) {
        if (e === "compositionend" || !el && Kd(e, t)) {
          var a = Ji();
          return lf(), Mu = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!ch(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return sf && !fh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function hf(e, t, a, i, u) {
      var s;
      if (Wd ? s = vf(t, i) : s = Xd(t, i), !s)
        return null;
      var f = gh(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new nh("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function dh(e, t, a, i, u, s, f) {
      qd(e, t, a, i, u), hf(e, t, a, i, u);
    }
    var yy = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function Hs(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!yy[e.type] : t === "textarea";
    }
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function gy(e) {
      if (!On)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Vs() {
      lt("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function ph(e, t, a, i) {
      uo(i);
      var u = gh(t, "onChange");
      if (u.length > 0) {
        var s = new Oi("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: u
        });
      }
    }
    var Vl = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function l(e) {
      var t = [];
      ph(t, n, e, dd(e)), wv(o, t);
    }
    function o(e) {
      b0(e, 0);
    }
    function c(e) {
      var t = Cf(e);
      if (yi(t))
        return e;
    }
    function d(e, t) {
      if (e === "change")
        return t;
    }
    var m = !1;
    On && (m = gy("input") && (!document.documentMode || document.documentMode > 9));
    function E(e, t) {
      Vl = e, n = t, Vl.attachEvent("onpropertychange", z);
    }
    function T() {
      Vl && (Vl.detachEvent("onpropertychange", z), Vl = null, n = null);
    }
    function z(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function $(e, t, a) {
      e === "focusin" ? (T(), E(t, a)) : e === "focusout" && T();
    }
    function W(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function Y(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function pe(e, t) {
      if (e === "click")
        return c(t);
    }
    function ge(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function Re(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Ne(e, "number", e.value);
    }
    function kn(e, t, a, i, u, s, f) {
      var p = a ? Cf(a) : window, v, y;
      if (r(p) ? v = d : Hs(p) ? m ? v = ge : (v = W, y = $) : Y(p) && (v = pe), v) {
        var g = v(t, a);
        if (g) {
          ph(e, g, i, u);
          return;
        }
      }
      y && y(t, p, a), t === "focusout" && Re(p);
    }
    function k() {
      Bt("onMouseEnter", ["mouseout", "mouseover"]), Bt("onMouseLeave", ["mouseout", "mouseover"]), Bt("onPointerEnter", ["pointerout", "pointerover"]), Bt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function w(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !ns(i)) {
        var y = i.relatedTarget || i.fromElement;
        if (y && (Is(y) || fp(y)))
          return;
      }
      if (!(!v && !p)) {
        var g;
        if (u.window === u)
          g = u;
        else {
          var b = u.ownerDocument;
          b ? g = b.defaultView || b.parentWindow : g = window;
        }
        var x, N;
        if (v) {
          var U = i.relatedTarget || i.toElement;
          if (x = a, N = U ? Is(U) : null, N !== null) {
            var F = da(N);
            (N !== F || N.tag !== X && N.tag !== le) && (N = null);
          }
        } else
          x = null, N = a;
        if (x !== N) {
          var se = Bd, Me = "onMouseLeave", be = "onMouseEnter", Rt = "mouse";
          (t === "pointerout" || t === "pointerover") && (se = lh, Me = "onPointerLeave", be = "onPointerEnter", Rt = "pointer");
          var ht = x == null ? g : Cf(x), D = N == null ? g : Cf(N), H = new se(Me, Rt + "leave", x, i, u);
          H.target = ht, H.relatedTarget = D;
          var O = null, G = Is(u);
          if (G === a) {
            var he = new se(be, Rt + "enter", N, i, u);
            he.target = D, he.relatedTarget = ht, O = he;
          }
          bT(e, H, O, x, N);
        }
      }
    }
    function L(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var Q = typeof Object.is == "function" ? Object.is : L;
    function Se(e, t) {
      if (Q(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!wr.call(t, s) || !Q(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function ze(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function Ae(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function Be(e, t) {
      for (var a = ze(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Ii) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = ze(Ae(a));
      }
    }
    function er(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, s = i.anchorOffset, f = i.focusNode, p = i.focusOffset;
      try {
        u.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return Mt(e, u, s, f, p);
    }
    function Mt(e, t, a, i, u) {
      var s = 0, f = -1, p = -1, v = 0, y = 0, g = e, b = null;
      e: for (; ; ) {
        for (var x = null; g === t && (a === 0 || g.nodeType === Ii) && (f = s + a), g === i && (u === 0 || g.nodeType === Ii) && (p = s + u), g.nodeType === Ii && (s += g.nodeValue.length), (x = g.firstChild) !== null; )
          b = g, g = x;
        for (; ; ) {
          if (g === e)
            break e;
          if (b === t && ++v === a && (f = s), b === i && ++y === u && (p = s), (x = g.nextSibling) !== null)
            break;
          g = b, b = g.parentNode;
        }
        g = x;
      }
      return f === -1 || p === -1 ? null : {
        start: f,
        end: p
      };
    }
    function Pl(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var u = i.getSelection(), s = e.textContent.length, f = Math.min(t.start, s), p = t.end === void 0 ? f : Math.min(t.end, s);
        if (!u.extend && f > p) {
          var v = p;
          p = f, f = v;
        }
        var y = Be(e, f), g = Be(e, p);
        if (y && g) {
          if (u.rangeCount === 1 && u.anchorNode === y.node && u.anchorOffset === y.offset && u.focusNode === g.node && u.focusOffset === g.offset)
            return;
          var b = a.createRange();
          b.setStart(y.node, y.offset), u.removeAllRanges(), f > p ? (u.addRange(b), u.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), u.addRange(b));
        }
      }
    }
    function vh(e) {
      return e && e.nodeType === Ii;
    }
    function h0(e, t) {
      return !e || !t ? !1 : e === t ? !0 : vh(e) ? !1 : vh(t) ? h0(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function oT(e) {
      return e && e.ownerDocument && h0(e.ownerDocument.documentElement, e);
    }
    function sT(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function m0() {
      for (var e = window, t = ba(); t instanceof e.HTMLIFrameElement; ) {
        if (sT(t))
          e = t.contentWindow;
        else
          return t;
        t = ba(e.document);
      }
      return t;
    }
    function Sy(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function cT() {
      var e = m0();
      return {
        focusedElem: e,
        selectionRange: Sy(e) ? dT(e) : null
      };
    }
    function fT(e) {
      var t = m0(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && oT(a)) {
        i !== null && Sy(a) && pT(a, i);
        for (var u = [], s = a; s = s.parentNode; )
          s.nodeType === Qr && u.push({
            element: s,
            left: s.scrollLeft,
            top: s.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var f = 0; f < u.length; f++) {
          var p = u[f];
          p.element.scrollLeft = p.left, p.element.scrollTop = p.top;
        }
      }
    }
    function dT(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = er(e), t || {
        start: 0,
        end: 0
      };
    }
    function pT(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Pl(e, t);
    }
    var vT = On && "documentMode" in document && document.documentMode <= 11;
    function hT() {
      lt("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var mf = null, Ey = null, Jd = null, Cy = !1;
    function mT(e) {
      if ("selectionStart" in e && Sy(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, a = t.getSelection();
      return {
        anchorNode: a.anchorNode,
        anchorOffset: a.anchorOffset,
        focusNode: a.focusNode,
        focusOffset: a.focusOffset
      };
    }
    function yT(e) {
      return e.window === e ? e.document : e.nodeType === Yi ? e : e.ownerDocument;
    }
    function y0(e, t, a) {
      var i = yT(a);
      if (!(Cy || mf == null || mf !== ba(i))) {
        var u = mT(mf);
        if (!Jd || !Se(Jd, u)) {
          Jd = u;
          var s = gh(Ey, "onSelect");
          if (s.length > 0) {
            var f = new Oi("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = mf;
          }
        }
      }
    }
    function gT(e, t, a, i, u, s, f) {
      var p = a ? Cf(a) : window;
      switch (t) {
        case "focusin":
          (Hs(p) || p.contentEditable === "true") && (mf = p, Ey = a, Jd = null);
          break;
        case "focusout":
          mf = null, Ey = null, Jd = null;
          break;
        case "mousedown":
          Cy = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Cy = !1, y0(e, i, u);
          break;
        case "selectionchange":
          if (vT)
            break;
        case "keydown":
        case "keyup":
          y0(e, i, u);
      }
    }
    function hh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var yf = {
      animationend: hh("Animation", "AnimationEnd"),
      animationiteration: hh("Animation", "AnimationIteration"),
      animationstart: hh("Animation", "AnimationStart"),
      transitionend: hh("Transition", "TransitionEnd")
    }, Ry = {}, g0 = {};
    On && (g0 = document.createElement("div").style, "AnimationEvent" in window || (delete yf.animationend.animation, delete yf.animationiteration.animation, delete yf.animationstart.animation), "TransitionEvent" in window || delete yf.transitionend.transition);
    function mh(e) {
      if (Ry[e])
        return Ry[e];
      if (!yf[e])
        return e;
      var t = yf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in g0)
          return Ry[e] = t[a];
      return e;
    }
    var S0 = mh("animationend"), E0 = mh("animationiteration"), C0 = mh("animationstart"), R0 = mh("transitionend"), T0 = /* @__PURE__ */ new Map(), x0 = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function bo(e, t) {
      T0.set(e, t), lt(t, [e]);
    }
    function ST() {
      for (var e = 0; e < x0.length; e++) {
        var t = x0[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        bo(a, "on" + i);
      }
      bo(S0, "onAnimationEnd"), bo(E0, "onAnimationIteration"), bo(C0, "onAnimationStart"), bo("dblclick", "onDoubleClick"), bo("focusin", "onFocus"), bo("focusout", "onBlur"), bo(R0, "onTransitionEnd");
    }
    function ET(e, t, a, i, u, s, f) {
      var p = T0.get(t);
      if (p !== void 0) {
        var v = Oi, y = t;
        switch (t) {
          case "keypress":
            if (jl(i) === 0)
              return;
          case "keydown":
          case "keyup":
            v = ih;
            break;
          case "focusin":
            y = "focus", v = Zi;
            break;
          case "focusout":
            y = "blur", v = Zi;
            break;
          case "beforeblur":
          case "afterblur":
            v = Zi;
            break;
          case "click":
            if (i.button === 2)
              return;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            v = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = Lu;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = oh;
            break;
          case S0:
          case E0:
          case C0:
            v = eh;
            break;
          case R0:
            v = Aa;
            break;
          case "scroll":
            v = na;
            break;
          case "wheel":
            v = hy;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = of;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            v = lh;
            break;
        }
        var g = (s & _a) !== 0;
        {
          var b = !g && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", x = xT(a, p, i.type, g, b);
          if (x.length > 0) {
            var N = new v(p, y, null, i, u);
            e.push({
              event: N,
              listeners: x
            });
          }
        }
      }
    }
    ST(), k(), Vs(), hT(), my();
    function CT(e, t, a, i, u, s, f) {
      ET(e, t, a, i, u, s);
      var p = (s & fd) === 0;
      p && (w(e, t, a, i, u), kn(e, t, a, i, u), gT(e, t, a, i, u), dh(e, t, a, i, u));
    }
    var Zd = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Ty = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(Zd));
    function w0(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ei(i, t, void 0, e), e.currentTarget = null;
    }
    function RT(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          w0(e, v, p), i = f;
        }
      else
        for (var y = 0; y < t.length; y++) {
          var g = t[y], b = g.instance, x = g.currentTarget, N = g.listener;
          if (b !== i && e.isPropagationStopped())
            return;
          w0(e, N, x), i = b;
        }
    }
    function b0(e, t) {
      for (var a = (t & _a) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        RT(s, f, a);
      }
      is();
    }
    function TT(e, t, a, i, u) {
      var s = dd(a), f = [];
      CT(f, e, i, a, s, t), b0(f, t);
    }
    function Sn(e, t) {
      Ty.has(e) || S('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = Zx(t), u = _T(e);
      i.has(u) || (_0(t, e, hc, a), i.add(u));
    }
    function xy(e, t, a) {
      Ty.has(e) && !t && S('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= _a), _0(a, e, i, t);
    }
    var yh = "_reactListening" + Math.random().toString(36).slice(2);
    function ep(e) {
      if (!e[yh]) {
        e[yh] = !0, tt.forEach(function(a) {
          a !== "selectionchange" && (Ty.has(a) || xy(a, !1, e), xy(a, !0, e));
        });
        var t = e.nodeType === Yi ? e : e.ownerDocument;
        t !== null && (t[yh] || (t[yh] = !0, xy("selectionchange", !1, t)));
      }
    }
    function _0(e, t, a, i, u) {
      var s = sr(e, t, a), f = void 0;
      as && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Pd(e, t, s, f) : ta(e, t, s) : f !== void 0 ? Ro(e, t, s, f) : zs(e, t, s);
    }
    function k0(e, t) {
      return e === t || e.nodeType === Nn && e.parentNode === t;
    }
    function wy(e, t, a, i, u) {
      var s = i;
      if (!(t & cd) && !(t & hc)) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === ee || v === K) {
              var y = p.stateNode.containerInfo;
              if (k0(y, f))
                break;
              if (v === K)
                for (var g = p.return; g !== null; ) {
                  var b = g.tag;
                  if (b === ee || b === K) {
                    var x = g.stateNode.containerInfo;
                    if (k0(x, f))
                      return;
                  }
                  g = g.return;
                }
              for (; y !== null; ) {
                var N = Is(y);
                if (N === null)
                  return;
                var U = N.tag;
                if (U === X || U === le) {
                  p = s = N;
                  continue e;
                }
                y = y.parentNode;
              }
            }
            p = p.return;
          }
        }
      }
      wv(function() {
        return TT(e, t, a, s);
      });
    }
    function tp(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function xT(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], y = e, g = null; y !== null; ) {
        var b = y, x = b.stateNode, N = b.tag;
        if (N === X && x !== null && (g = x, p !== null)) {
          var U = xl(y, p);
          U != null && v.push(tp(y, U, g));
        }
        if (u)
          break;
        y = y.return;
      }
      return v;
    }
    function gh(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var s = u, f = s.stateNode, p = s.tag;
        if (p === X && f !== null) {
          var v = f, y = xl(u, a);
          y != null && i.unshift(tp(u, y, v));
          var g = xl(u, t);
          g != null && i.push(tp(u, g, v));
        }
        u = u.return;
      }
      return i;
    }
    function gf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== X);
      return e || null;
    }
    function wT(e, t) {
      for (var a = e, i = t, u = 0, s = a; s; s = gf(s))
        u++;
      for (var f = 0, p = i; p; p = gf(p))
        f++;
      for (; u - f > 0; )
        a = gf(a), u--;
      for (; f - u > 0; )
        i = gf(i), f--;
      for (var v = u; v--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = gf(a), i = gf(i);
      }
      return null;
    }
    function D0(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, y = v.alternate, g = v.stateNode, b = v.tag;
        if (y !== null && y === i)
          break;
        if (b === X && g !== null) {
          var x = g;
          if (u) {
            var N = xl(p, s);
            N != null && f.unshift(tp(p, N, x));
          } else if (!u) {
            var U = xl(p, s);
            U != null && f.push(tp(p, U, x));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function bT(e, t, a, i, u) {
      var s = i && u ? wT(i, u) : null;
      i !== null && D0(e, t, i, s, !1), u !== null && a !== null && D0(e, a, u, s, !0);
    }
    function _T(e, t) {
      return e + "__bubble";
    }
    var ja = !1, np = "dangerouslySetInnerHTML", Sh = "suppressContentEditableWarning", _o = "suppressHydrationWarning", O0 = "autoFocus", Ps = "children", Bs = "style", Eh = "__html", by, Ch, rp, L0, Rh, N0, M0;
    by = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Ch = function(e, t) {
      ud(e, t), pc(e, t), Rv(e, t, {
        registrationNameDependencies: Je,
        possibleRegistrationNames: nt
      });
    }, N0 = On && !document.documentMode, rp = function(e, t, a) {
      if (!ja) {
        var i = Th(a), u = Th(t);
        u !== i && (ja = !0, S("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, L0 = function(e) {
      if (!ja) {
        ja = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), S("Extra attributes from the server: %s", t);
      }
    }, Rh = function(e, t) {
      t === !1 ? S("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : S("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, M0 = function(e, t) {
      var a = e.namespaceURI === Bi ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var kT = /\r\n?/g, DT = /\u0000|\uFFFD/g;
    function Th(e) {
      Kn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(kT, `
`).replace(DT, "");
    }
    function xh(e, t, a, i) {
      var u = Th(t), s = Th(e);
      if (s !== u && (i && (ja || (ja = !0, S('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && Te))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function z0(e) {
      return e.nodeType === Yi ? e : e.ownerDocument;
    }
    function OT() {
    }
    function wh(e) {
      e.onclick = OT;
    }
    function LT(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Bs)
            f && Object.freeze(f), mv(t, f);
          else if (s === np) {
            var p = f ? f[Eh] : void 0;
            p != null && av(t, p);
          } else if (s === Ps)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && ro(t, f);
            } else typeof f == "number" && ro(t, "" + f);
          else s === Sh || s === _o || s === O0 || (Je.hasOwnProperty(s) ? f != null && (typeof f != "function" && Rh(s, f), s === "onScroll" && Sn("scroll", t)) : f != null && br(t, s, f, u));
        }
    }
    function NT(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Bs ? mv(e, f) : s === np ? av(e, f) : s === Ps ? ro(e, f) : br(e, s, f, i);
      }
    }
    function MT(e, t, a, i) {
      var u, s = z0(a), f, p = i;
      if (p === Bi && (p = ed(e)), p === Bi) {
        if (u = Rl(e, t), !u && e !== e.toLowerCase() && S("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var v = s.createElement("div");
          v.innerHTML = "<script><\/script>";
          var y = v.firstChild;
          f = v.removeChild(y);
        } else if (typeof t.is == "string")
          f = s.createElement(e, {
            is: t.is
          });
        else if (f = s.createElement(e), e === "select") {
          var g = f;
          t.multiple ? g.multiple = !0 : t.size && (g.size = t.size);
        }
      } else
        f = s.createElementNS(p, e);
      return p === Bi && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !wr.call(by, e) && (by[e] = !0, S("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function zT(e, t) {
      return z0(t).createTextNode(e);
    }
    function UT(e, t, a, i) {
      var u = Rl(t, a);
      Ch(t, a);
      var s;
      switch (t) {
        case "dialog":
          Sn("cancel", e), Sn("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          Sn("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < Zd.length; f++)
            Sn(Zd[f], e);
          s = a;
          break;
        case "source":
          Sn("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          Sn("error", e), Sn("load", e), s = a;
          break;
        case "details":
          Sn("toggle", e), s = a;
          break;
        case "input":
          Za(e, a), s = no(e, a), Sn("invalid", e);
          break;
        case "option":
          xt(e, a), s = a;
          break;
        case "select":
          uu(e, a), s = Ko(e, a), Sn("invalid", e);
          break;
        case "textarea":
          Xf(e, a), s = qf(e, a), Sn("invalid", e);
          break;
        default:
          s = a;
      }
      switch (fc(t, s), LT(t, e, i, s, u), t) {
        case "input":
          Ja(e), M(e, a, !1);
          break;
        case "textarea":
          Ja(e), nv(e);
          break;
        case "option":
          rn(e, a);
          break;
        case "select":
          Gf(e, a);
          break;
        default:
          typeof s.onClick == "function" && wh(e);
          break;
      }
    }
    function AT(e, t, a, i, u) {
      Ch(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = no(e, a), p = no(e, i), s = [];
          break;
        case "select":
          f = Ko(e, a), p = Ko(e, i), s = [];
          break;
        case "textarea":
          f = qf(e, a), p = qf(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && wh(e);
          break;
      }
      fc(t, p);
      var v, y, g = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Bs) {
            var b = f[v];
            for (y in b)
              b.hasOwnProperty(y) && (g || (g = {}), g[y] = "");
          } else v === np || v === Ps || v === Sh || v === _o || v === O0 || (Je.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var x = p[v], N = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || x === N || x == null && N == null))
          if (v === Bs)
            if (x && Object.freeze(x), N) {
              for (y in N)
                N.hasOwnProperty(y) && (!x || !x.hasOwnProperty(y)) && (g || (g = {}), g[y] = "");
              for (y in x)
                x.hasOwnProperty(y) && N[y] !== x[y] && (g || (g = {}), g[y] = x[y]);
            } else
              g || (s || (s = []), s.push(v, g)), g = x;
          else if (v === np) {
            var U = x ? x[Eh] : void 0, F = N ? N[Eh] : void 0;
            U != null && F !== U && (s = s || []).push(v, U);
          } else v === Ps ? (typeof x == "string" || typeof x == "number") && (s = s || []).push(v, "" + x) : v === Sh || v === _o || (Je.hasOwnProperty(v) ? (x != null && (typeof x != "function" && Rh(v, x), v === "onScroll" && Sn("scroll", e)), !s && N !== x && (s = [])) : (s = s || []).push(v, x));
      }
      return g && (Zm(g, p[Bs]), (s = s || []).push(Bs, g)), s;
    }
    function jT(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && h(e, u);
      var s = Rl(a, i), f = Rl(a, u);
      switch (NT(e, t, s, f), a) {
        case "input":
          C(e, u);
          break;
        case "textarea":
          tv(e, u);
          break;
        case "select":
          oc(e, u);
          break;
      }
    }
    function FT(e) {
      {
        var t = e.toLowerCase();
        return es.hasOwnProperty(t) && es[t] || null;
      }
    }
    function HT(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = Rl(t, a), Ch(t, a), t) {
        case "dialog":
          Sn("cancel", e), Sn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          Sn("load", e);
          break;
        case "video":
        case "audio":
          for (var y = 0; y < Zd.length; y++)
            Sn(Zd[y], e);
          break;
        case "source":
          Sn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          Sn("error", e), Sn("load", e);
          break;
        case "details":
          Sn("toggle", e);
          break;
        case "input":
          Za(e, a), Sn("invalid", e);
          break;
        case "option":
          xt(e, a);
          break;
        case "select":
          uu(e, a), Sn("invalid", e);
          break;
        case "textarea":
          Xf(e, a), Sn("invalid", e);
          break;
      }
      fc(t, a);
      {
        v = /* @__PURE__ */ new Set();
        for (var g = e.attributes, b = 0; b < g.length; b++) {
          var x = g[b].name.toLowerCase();
          switch (x) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              v.add(g[b].name);
          }
        }
      }
      var N = null;
      for (var U in a)
        if (a.hasOwnProperty(U)) {
          var F = a[U];
          if (U === Ps)
            typeof F == "string" ? e.textContent !== F && (a[_o] !== !0 && xh(e.textContent, F, s, f), N = [Ps, F]) : typeof F == "number" && e.textContent !== "" + F && (a[_o] !== !0 && xh(e.textContent, F, s, f), N = [Ps, "" + F]);
          else if (Je.hasOwnProperty(U))
            F != null && (typeof F != "function" && Rh(U, F), U === "onScroll" && Sn("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var se = void 0, Me = tn(U);
            if (a[_o] !== !0) {
              if (!(U === Sh || U === _o || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              U === "value" || U === "checked" || U === "selected")) {
                if (U === np) {
                  var be = e.innerHTML, Rt = F ? F[Eh] : void 0;
                  if (Rt != null) {
                    var ht = M0(e, Rt);
                    ht !== be && rp(U, be, ht);
                  }
                } else if (U === Bs) {
                  if (v.delete(U), N0) {
                    var D = Xm(F);
                    se = e.getAttribute("style"), D !== se && rp(U, se, D);
                  }
                } else if (p && !_)
                  v.delete(U.toLowerCase()), se = eu(e, U, F), F !== se && rp(U, se, F);
                else if (!vn(U, Me, p) && !qn(U, F, Me, p)) {
                  var H = !1;
                  if (Me !== null)
                    v.delete(Me.attributeName), se = pl(e, U, F, Me);
                  else {
                    var O = i;
                    if (O === Bi && (O = ed(t)), O === Bi)
                      v.delete(U.toLowerCase());
                    else {
                      var G = FT(U);
                      G !== null && G !== U && (H = !0, v.delete(G)), v.delete(U);
                    }
                    se = eu(e, U, F);
                  }
                  var he = _;
                  !he && F !== se && !H && rp(U, se, F);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[_o] !== !0 && L0(v), t) {
        case "input":
          Ja(e), M(e, a, !0);
          break;
        case "textarea":
          Ja(e), nv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && wh(e);
          break;
      }
      return N;
    }
    function VT(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function _y(e, t) {
      {
        if (ja)
          return;
        ja = !0, S("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function ky(e, t) {
      {
        if (ja)
          return;
        ja = !0, S('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function Dy(e, t, a) {
      {
        if (ja)
          return;
        ja = !0, S("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Oy(e, t) {
      {
        if (t === "" || ja)
          return;
        ja = !0, S('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function PT(e, t, a) {
      switch (t) {
        case "input":
          j(e, a);
          return;
        case "textarea":
          Wm(e, a);
          return;
        case "select":
          Kf(e, a);
          return;
      }
    }
    var ap = function() {
    }, ip = function() {
    };
    {
      var BT = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], U0 = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], IT = U0.concat(["button"]), YT = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], A0 = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      ip = function(e, t) {
        var a = Ze({}, e || A0), i = {
          tag: t
        };
        return U0.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), IT.indexOf(t) !== -1 && (a.pTagInButtonScope = null), BT.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var $T = function(e, t) {
        switch (t) {
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          case "option":
            return e === "#text";
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          case "colgroup":
            return e === "col" || e === "template";
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return YT.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, QT = function(e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, j0 = {};
      ap = function(e, t, a) {
        a = a || A0;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && S("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = $T(e, u) ? null : i, f = s ? null : QT(e, a), p = s || f;
        if (p) {
          var v = p.tag, y = !!s + "|" + e + "|" + v;
          if (!j0[y]) {
            j0[y] = !0;
            var g = e, b = "";
            if (e === "#text" ? /\S/.test(t) ? g = "Text nodes" : (g = "Whitespace text nodes", b = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : g = "<" + e + ">", s) {
              var x = "";
              v === "table" && e === "tr" && (x += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), S("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", g, v, b, x);
            } else
              S("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", g, v);
          }
        }
      };
    }
    var bh = "suppressHydrationWarning", _h = "$", kh = "/$", lp = "$?", up = "$!", WT = "style", Ly = null, Ny = null;
    function GT(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case Yi:
        case nd: {
          t = i === Yi ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : td(null, "");
          break;
        }
        default: {
          var s = i === Nn ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = td(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = ip(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function KT(e, t, a) {
      {
        var i = e, u = td(i.namespace, t), s = ip(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function ok(e) {
      return e;
    }
    function qT(e) {
      Ly = Fn(), Ny = cT();
      var t = null;
      return Wn(!1), t;
    }
    function XT(e) {
      fT(Ny), Wn(Ly), Ly = null, Ny = null;
    }
    function JT(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (ap(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = ip(f.ancestorInfo, e);
          ap(null, p, v);
        }
        s = f.namespace;
      }
      var y = MT(e, t, a, s);
      return cp(u, y), Vy(y, t), y;
    }
    function ZT(e, t) {
      e.appendChild(t);
    }
    function ex(e, t, a, i, u) {
      switch (UT(e, t, a, i), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!a.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function tx(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = ip(f.ancestorInfo, t);
          ap(null, p, v);
        }
      }
      return AT(e, t, a, i);
    }
    function My(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function nx(e, t, a, i) {
      {
        var u = a;
        ap(null, e, u.ancestorInfo);
      }
      var s = zT(e, t);
      return cp(i, s), s;
    }
    function rx() {
      var e = window.event;
      return e === void 0 ? Ma : af(e.type);
    }
    var zy = typeof setTimeout == "function" ? setTimeout : void 0, ax = typeof clearTimeout == "function" ? clearTimeout : void 0, Uy = -1, F0 = typeof Promise == "function" ? Promise : void 0, ix = typeof queueMicrotask == "function" ? queueMicrotask : typeof F0 < "u" ? function(e) {
      return F0.resolve(null).then(e).catch(lx);
    } : zy;
    function lx(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function ux(e, t, a, i) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          return;
        case "img": {
          a.src && (e.src = a.src);
          return;
        }
      }
    }
    function ox(e, t, a, i, u, s) {
      jT(e, t, a, i, u), Vy(e, u);
    }
    function H0(e) {
      ro(e, "");
    }
    function sx(e, t, a) {
      e.nodeValue = a;
    }
    function cx(e, t) {
      e.appendChild(t);
    }
    function fx(e, t) {
      var a;
      e.nodeType === Nn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && wh(a);
    }
    function dx(e, t, a) {
      e.insertBefore(t, a);
    }
    function px(e, t, a) {
      e.nodeType === Nn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function vx(e, t) {
      e.removeChild(t);
    }
    function hx(e, t) {
      e.nodeType === Nn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Ay(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === Nn) {
          var s = u.data;
          if (s === kh)
            if (i === 0) {
              e.removeChild(u), ku(t);
              return;
            } else
              i--;
          else (s === _h || s === lp || s === up) && i++;
        }
        a = u;
      } while (a);
      ku(t);
    }
    function mx(e, t) {
      e.nodeType === Nn ? Ay(e.parentNode, t) : e.nodeType === Qr && Ay(e, t), ku(e);
    }
    function yx(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function gx(e) {
      e.nodeValue = "";
    }
    function Sx(e, t) {
      e = e;
      var a = t[WT], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = cc("display", i);
    }
    function Ex(e, t) {
      e.nodeValue = t;
    }
    function Cx(e) {
      e.nodeType === Qr ? e.textContent = "" : e.nodeType === Yi && e.documentElement && e.removeChild(e.documentElement);
    }
    function Rx(e, t, a) {
      return e.nodeType !== Qr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function Tx(e, t) {
      return t === "" || e.nodeType !== Ii ? null : e;
    }
    function xx(e) {
      return e.nodeType !== Nn ? null : e;
    }
    function V0(e) {
      return e.data === lp;
    }
    function jy(e) {
      return e.data === up;
    }
    function wx(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function bx(e, t) {
      e._reactRetry = t;
    }
    function Dh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Qr || t === Ii)
          break;
        if (t === Nn) {
          var a = e.data;
          if (a === _h || a === up || a === lp)
            break;
          if (a === kh)
            return null;
        }
      }
      return e;
    }
    function op(e) {
      return Dh(e.nextSibling);
    }
    function _x(e) {
      return Dh(e.firstChild);
    }
    function kx(e) {
      return Dh(e.firstChild);
    }
    function Dx(e) {
      return Dh(e.nextSibling);
    }
    function Ox(e, t, a, i, u, s, f) {
      cp(s, e), Vy(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var y = (s.mode & ot) !== Oe;
      return HT(e, t, a, p, i, y, f);
    }
    function Lx(e, t, a, i) {
      return cp(a, e), a.mode & ot, VT(e, t);
    }
    function Nx(e, t) {
      cp(t, e);
    }
    function Mx(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Nn) {
          var i = t.data;
          if (i === kh) {
            if (a === 0)
              return op(t);
            a--;
          } else (i === _h || i === up || i === lp) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function P0(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Nn) {
          var i = t.data;
          if (i === _h || i === up || i === lp) {
            if (a === 0)
              return t;
            a--;
          } else i === kh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function zx(e) {
      ku(e);
    }
    function Ux(e) {
      ku(e);
    }
    function Ax(e) {
      return e !== "head" && e !== "body";
    }
    function jx(e, t, a, i) {
      var u = !0;
      xh(t.nodeValue, a, i, u);
    }
    function Fx(e, t, a, i, u, s) {
      if (t[bh] !== !0) {
        var f = !0;
        xh(i.nodeValue, u, s, f);
      }
    }
    function Hx(e, t) {
      t.nodeType === Qr ? _y(e, t) : t.nodeType === Nn || ky(e, t);
    }
    function Vx(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Qr ? _y(a, t) : t.nodeType === Nn || ky(a, t));
      }
    }
    function Px(e, t, a, i, u) {
      (u || t[bh] !== !0) && (i.nodeType === Qr ? _y(a, i) : i.nodeType === Nn || ky(a, i));
    }
    function Bx(e, t, a) {
      Dy(e, t);
    }
    function Ix(e, t) {
      Oy(e, t);
    }
    function Yx(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && Dy(i, t);
      }
    }
    function $x(e, t) {
      {
        var a = e.parentNode;
        a !== null && Oy(a, t);
      }
    }
    function Qx(e, t, a, i, u, s) {
      (s || t[bh] !== !0) && Dy(a, i);
    }
    function Wx(e, t, a, i, u) {
      (u || t[bh] !== !0) && Oy(a, i);
    }
    function Gx(e) {
      S("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function Kx(e) {
      ep(e);
    }
    var Sf = Math.random().toString(36).slice(2), Ef = "__reactFiber$" + Sf, Fy = "__reactProps$" + Sf, sp = "__reactContainer$" + Sf, Hy = "__reactEvents$" + Sf, qx = "__reactListeners$" + Sf, Xx = "__reactHandles$" + Sf;
    function Jx(e) {
      delete e[Ef], delete e[Fy], delete e[Hy], delete e[qx], delete e[Xx];
    }
    function cp(e, t) {
      t[Ef] = e;
    }
    function Oh(e, t) {
      t[sp] = e;
    }
    function B0(e) {
      e[sp] = null;
    }
    function fp(e) {
      return !!e[sp];
    }
    function Is(e) {
      var t = e[Ef];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[sp] || a[Ef], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = P0(e); u !== null; ) {
              var s = u[Ef];
              if (s)
                return s;
              u = P0(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function ko(e) {
      var t = e[Ef] || e[sp];
      return t && (t.tag === X || t.tag === le || t.tag === ke || t.tag === ee) ? t : null;
    }
    function Cf(e) {
      if (e.tag === X || e.tag === le)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Lh(e) {
      return e[Fy] || null;
    }
    function Vy(e, t) {
      e[Fy] = t;
    }
    function Zx(e) {
      var t = e[Hy];
      return t === void 0 && (t = e[Hy] = /* @__PURE__ */ new Set()), t;
    }
    var I0 = {}, Y0 = A.ReactDebugCurrentFrame;
    function Nh(e) {
      if (e) {
        var t = e._owner, a = Hi(e.type, e._source, t ? t.type : null);
        Y0.setExtraStackFrame(a);
      } else
        Y0.setExtraStackFrame(null);
    }
    function tl(e, t, a, i, u) {
      {
        var s = Function.call.bind(wr);
        for (var f in e)
          if (s(e, f)) {
            var p = void 0;
            try {
              if (typeof e[f] != "function") {
                var v = Error((i || "React class") + ": " + a + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw v.name = "Invariant Violation", v;
              }
              p = e[f](t, f, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (y) {
              p = y;
            }
            p && !(p instanceof Error) && (Nh(u), S("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), Nh(null)), p instanceof Error && !(p.message in I0) && (I0[p.message] = !0, Nh(u), S("Failed %s type: %s", a, p.message), Nh(null));
          }
      }
    }
    var Py = [], Mh;
    Mh = [];
    var zu = -1;
    function Do(e) {
      return {
        current: e
      };
    }
    function ra(e, t) {
      if (zu < 0) {
        S("Unexpected pop.");
        return;
      }
      t !== Mh[zu] && S("Unexpected Fiber popped."), e.current = Py[zu], Py[zu] = null, Mh[zu] = null, zu--;
    }
    function aa(e, t, a) {
      zu++, Py[zu] = e.current, Mh[zu] = a, e.current = t;
    }
    var By;
    By = {};
    var li = {};
    Object.freeze(li);
    var Uu = Do(li), Bl = Do(!1), Iy = li;
    function Rf(e, t, a) {
      return a && Il(t) ? Iy : Uu.current;
    }
    function $0(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Tf(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return li;
        var u = e.stateNode;
        if (u && u.__reactInternalMemoizedUnmaskedChildContext === t)
          return u.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var p = Ie(e) || "Unknown";
          tl(i, s, "context", p);
        }
        return u && $0(e, t, s), s;
      }
    }
    function zh() {
      return Bl.current;
    }
    function Il(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Uh(e) {
      ra(Bl, e), ra(Uu, e);
    }
    function Yy(e) {
      ra(Bl, e), ra(Uu, e);
    }
    function Q0(e, t, a) {
      {
        if (Uu.current !== li)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        aa(Uu, t, e), aa(Bl, a, e);
      }
    }
    function W0(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = Ie(e) || "Unknown";
            By[s] || (By[s] = !0, S("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((Ie(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = Ie(e) || "Unknown";
          tl(u, f, "child context", v);
        }
        return Ze({}, a, f);
      }
    }
    function Ah(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || li;
        return Iy = Uu.current, aa(Uu, a, e), aa(Bl, Bl.current, e), !0;
      }
    }
    function G0(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = W0(e, t, Iy);
          i.__reactInternalMemoizedMergedChildContext = u, ra(Bl, e), ra(Uu, e), aa(Uu, u, e), aa(Bl, a, e);
        } else
          ra(Bl, e), aa(Bl, a, e);
      }
    }
    function ew(e) {
      {
        if (!vu(e) || e.tag !== de)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case ee:
              return t.stateNode.context;
            case de: {
              var a = t.type;
              if (Il(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var Oo = 0, jh = 1, Au = null, $y = !1, Qy = !1;
    function K0(e) {
      Au === null ? Au = [e] : Au.push(e);
    }
    function tw(e) {
      $y = !0, K0(e);
    }
    function q0() {
      $y && Lo();
    }
    function Lo() {
      if (!Qy && Au !== null) {
        Qy = !0;
        var e = 0, t = Ua();
        try {
          var a = !0, i = Au;
          for (jn(Lr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          Au = null, $y = !1;
        } catch (s) {
          throw Au !== null && (Au = Au.slice(e + 1)), vd(os, Lo), s;
        } finally {
          jn(t), Qy = !1;
        }
      }
      return null;
    }
    var xf = [], wf = 0, Fh = null, Hh = 0, Li = [], Ni = 0, Ys = null, ju = 1, Fu = "";
    function nw(e) {
      return Qs(), (e.flags & Ci) !== De;
    }
    function rw(e) {
      return Qs(), Hh;
    }
    function aw() {
      var e = Fu, t = ju, a = t & ~iw(t);
      return a.toString(32) + e;
    }
    function $s(e, t) {
      Qs(), xf[wf++] = Hh, xf[wf++] = Fh, Fh = e, Hh = t;
    }
    function X0(e, t, a) {
      Qs(), Li[Ni++] = ju, Li[Ni++] = Fu, Li[Ni++] = Ys, Ys = e;
      var i = ju, u = Fu, s = Vh(i) - 1, f = i & ~(1 << s), p = a + 1, v = Vh(t) + s;
      if (v > 30) {
        var y = s - s % 5, g = (1 << y) - 1, b = (f & g).toString(32), x = f >> y, N = s - y, U = Vh(t) + N, F = p << N, se = F | x, Me = b + u;
        ju = 1 << U | se, Fu = Me;
      } else {
        var be = p << s, Rt = be | f, ht = u;
        ju = 1 << v | Rt, Fu = ht;
      }
    }
    function Wy(e) {
      Qs();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        $s(e, a), X0(e, a, i);
      }
    }
    function Vh(e) {
      return 32 - Un(e);
    }
    function iw(e) {
      return 1 << Vh(e) - 1;
    }
    function Gy(e) {
      for (; e === Fh; )
        Fh = xf[--wf], xf[wf] = null, Hh = xf[--wf], xf[wf] = null;
      for (; e === Ys; )
        Ys = Li[--Ni], Li[Ni] = null, Fu = Li[--Ni], Li[Ni] = null, ju = Li[--Ni], Li[Ni] = null;
    }
    function lw() {
      return Qs(), Ys !== null ? {
        id: ju,
        overflow: Fu
      } : null;
    }
    function uw(e, t) {
      Qs(), Li[Ni++] = ju, Li[Ni++] = Fu, Li[Ni++] = Ys, ju = t.id, Fu = t.overflow, Ys = e;
    }
    function Qs() {
      Ar() || S("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Ur = null, Mi = null, nl = !1, Ws = !1, No = null;
    function ow() {
      nl && S("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function J0() {
      Ws = !0;
    }
    function sw() {
      return Ws;
    }
    function cw(e) {
      var t = e.stateNode.containerInfo;
      return Mi = kx(t), Ur = e, nl = !0, No = null, Ws = !1, !0;
    }
    function fw(e, t, a) {
      return Mi = Dx(t), Ur = e, nl = !0, No = null, Ws = !1, a !== null && uw(e, a), !0;
    }
    function Z0(e, t) {
      switch (e.tag) {
        case ee: {
          Hx(e.stateNode.containerInfo, t);
          break;
        }
        case X: {
          var a = (e.mode & ot) !== Oe;
          Px(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case ke: {
          var i = e.memoizedState;
          i.dehydrated !== null && Vx(i.dehydrated, t);
          break;
        }
      }
    }
    function eE(e, t) {
      Z0(e, t);
      var a = h_();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= ka) : i.push(a);
    }
    function Ky(e, t) {
      {
        if (Ws)
          return;
        switch (e.tag) {
          case ee: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case X:
                var i = t.type;
                t.pendingProps, Bx(a, i);
                break;
              case le:
                var u = t.pendingProps;
                Ix(a, u);
                break;
            }
            break;
          }
          case X: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case X: {
                var v = t.type, y = t.pendingProps, g = (e.mode & ot) !== Oe;
                Qx(
                  s,
                  f,
                  p,
                  v,
                  y,
                  // TODO: Delete this argument when we remove the legacy root API.
                  g
                );
                break;
              }
              case le: {
                var b = t.pendingProps, x = (e.mode & ot) !== Oe;
                Wx(
                  s,
                  f,
                  p,
                  b,
                  // TODO: Delete this argument when we remove the legacy root API.
                  x
                );
                break;
              }
            }
            break;
          }
          case ke: {
            var N = e.memoizedState, U = N.dehydrated;
            if (U !== null) switch (t.tag) {
              case X:
                var F = t.type;
                t.pendingProps, Yx(U, F);
                break;
              case le:
                var se = t.pendingProps;
                $x(U, se);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function tE(e, t) {
      t.flags = t.flags & ~Gr | mn, Ky(e, t);
    }
    function nE(e, t) {
      switch (e.tag) {
        case X: {
          var a = e.type;
          e.pendingProps;
          var i = Rx(t, a);
          return i !== null ? (e.stateNode = i, Ur = e, Mi = _x(i), !0) : !1;
        }
        case le: {
          var u = e.pendingProps, s = Tx(t, u);
          return s !== null ? (e.stateNode = s, Ur = e, Mi = null, !0) : !1;
        }
        case ke: {
          var f = xx(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: lw(),
              retryLane: Jr
            };
            e.memoizedState = p;
            var v = m_(f);
            return v.return = e, e.child = v, Ur = e, Mi = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function qy(e) {
      return (e.mode & ot) !== Oe && (e.flags & _e) === De;
    }
    function Xy(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function Jy(e) {
      if (nl) {
        var t = Mi;
        if (!t) {
          qy(e) && (Ky(Ur, e), Xy()), tE(Ur, e), nl = !1, Ur = e;
          return;
        }
        var a = t;
        if (!nE(e, t)) {
          qy(e) && (Ky(Ur, e), Xy()), t = op(a);
          var i = Ur;
          if (!t || !nE(e, t)) {
            tE(Ur, e), nl = !1, Ur = e;
            return;
          }
          eE(i, a);
        }
      }
    }
    function dw(e, t, a) {
      var i = e.stateNode, u = !Ws, s = Ox(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function pw(e) {
      var t = e.stateNode, a = e.memoizedProps, i = Lx(t, a, e);
      if (i) {
        var u = Ur;
        if (u !== null)
          switch (u.tag) {
            case ee: {
              var s = u.stateNode.containerInfo, f = (u.mode & ot) !== Oe;
              jx(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case X: {
              var p = u.type, v = u.memoizedProps, y = u.stateNode, g = (u.mode & ot) !== Oe;
              Fx(
                p,
                v,
                y,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                g
              );
              break;
            }
          }
      }
      return i;
    }
    function vw(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      Nx(a, e);
    }
    function hw(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return Mx(a);
    }
    function rE(e) {
      for (var t = e.return; t !== null && t.tag !== X && t.tag !== ee && t.tag !== ke; )
        t = t.return;
      Ur = t;
    }
    function Ph(e) {
      if (e !== Ur)
        return !1;
      if (!nl)
        return rE(e), nl = !0, !1;
      if (e.tag !== ee && (e.tag !== X || Ax(e.type) && !My(e.type, e.memoizedProps))) {
        var t = Mi;
        if (t)
          if (qy(e))
            aE(e), Xy();
          else
            for (; t; )
              eE(e, t), t = op(t);
      }
      return rE(e), e.tag === ke ? Mi = hw(e) : Mi = Ur ? op(e.stateNode) : null, !0;
    }
    function mw() {
      return nl && Mi !== null;
    }
    function aE(e) {
      for (var t = Mi; t; )
        Z0(e, t), t = op(t);
    }
    function bf() {
      Ur = null, Mi = null, nl = !1, Ws = !1;
    }
    function iE() {
      No !== null && (JC(No), No = null);
    }
    function Ar() {
      return nl;
    }
    function Zy(e) {
      No === null ? No = [e] : No.push(e);
    }
    var yw = A.ReactCurrentBatchConfig, gw = null;
    function Sw() {
      return yw.transition;
    }
    var rl = {
      recordUnsafeLifecycleWarnings: function(e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function(e, t) {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    };
    {
      var Ew = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Gt && (t = a), a = a.return;
        return t;
      }, Gs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, dp = [], pp = [], vp = [], hp = [], mp = [], yp = [], Ks = /* @__PURE__ */ new Set();
      rl.recordUnsafeLifecycleWarnings = function(e, t) {
        Ks.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && dp.push(e), e.mode & Gt && typeof t.UNSAFE_componentWillMount == "function" && pp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && vp.push(e), e.mode & Gt && typeof t.UNSAFE_componentWillReceiveProps == "function" && hp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && mp.push(e), e.mode & Gt && typeof t.UNSAFE_componentWillUpdate == "function" && yp.push(e));
      }, rl.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        dp.length > 0 && (dp.forEach(function(x) {
          e.add(Ie(x) || "Component"), Ks.add(x.type);
        }), dp = []);
        var t = /* @__PURE__ */ new Set();
        pp.length > 0 && (pp.forEach(function(x) {
          t.add(Ie(x) || "Component"), Ks.add(x.type);
        }), pp = []);
        var a = /* @__PURE__ */ new Set();
        vp.length > 0 && (vp.forEach(function(x) {
          a.add(Ie(x) || "Component"), Ks.add(x.type);
        }), vp = []);
        var i = /* @__PURE__ */ new Set();
        hp.length > 0 && (hp.forEach(function(x) {
          i.add(Ie(x) || "Component"), Ks.add(x.type);
        }), hp = []);
        var u = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(x) {
          u.add(Ie(x) || "Component"), Ks.add(x.type);
        }), mp = []);
        var s = /* @__PURE__ */ new Set();
        if (yp.length > 0 && (yp.forEach(function(x) {
          s.add(Ie(x) || "Component"), Ks.add(x.type);
        }), yp = []), t.size > 0) {
          var f = Gs(t);
          S(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var p = Gs(i);
          S(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, p);
        }
        if (s.size > 0) {
          var v = Gs(s);
          S(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, v);
        }
        if (e.size > 0) {
          var y = Gs(e);
          yt(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (a.size > 0) {
          var g = Gs(a);
          yt(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, g);
        }
        if (u.size > 0) {
          var b = Gs(u);
          yt(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, b);
        }
      };
      var Bh = /* @__PURE__ */ new Map(), lE = /* @__PURE__ */ new Set();
      rl.recordLegacyContextWarning = function(e, t) {
        var a = Ew(e);
        if (a === null) {
          S("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!lE.has(e.type)) {
          var i = Bh.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Bh.set(a, i)), i.push(e));
        }
      }, rl.flushLegacyContextWarning = function() {
        Bh.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(Ie(s) || "Component"), lE.add(s.type);
            });
            var u = Gs(i);
            try {
              $t(a), S(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              cn();
            }
          }
        });
      }, rl.discardPendingWarnings = function() {
        dp = [], pp = [], vp = [], hp = [], mp = [], yp = [], Bh = /* @__PURE__ */ new Map();
      };
    }
    var eg, tg, ng, rg, ag, uE = function(e, t) {
    };
    eg = !1, tg = !1, ng = {}, rg = {}, ag = {}, uE = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = Ie(t) || "Component";
        rg[a] || (rg[a] = !0, S('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function Cw(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function gp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & Gt || V) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== de) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !Cw(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = Ie(e) || "Component";
          ng[u] || (S('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), ng[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== de)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            f = p.stateNode;
          }
          if (!f)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var v = f;
          si(i, "ref");
          var y = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === y)
            return t.ref;
          var g = function(b) {
            var x = v.refs;
            b === null ? delete x[y] : x[y] = b;
          };
          return g._stringRef = y, g;
        } else {
          if (typeof i != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!a._owner)
            throw new Error("Element ref was specified as a string (" + i + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return i;
    }
    function Ih(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Yh(e) {
      {
        var t = Ie(e) || "Component";
        if (ag[t])
          return;
        ag[t] = !0, S("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function oE(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function sE(e) {
      function t(D, H) {
        if (e) {
          var O = D.deletions;
          O === null ? (D.deletions = [H], D.flags |= ka) : O.push(H);
        }
      }
      function a(D, H) {
        if (!e)
          return null;
        for (var O = H; O !== null; )
          t(D, O), O = O.sibling;
        return null;
      }
      function i(D, H) {
        for (var O = /* @__PURE__ */ new Map(), G = H; G !== null; )
          G.key !== null ? O.set(G.key, G) : O.set(G.index, G), G = G.sibling;
        return O;
      }
      function u(D, H) {
        var O = ac(D, H);
        return O.index = 0, O.sibling = null, O;
      }
      function s(D, H, O) {
        if (D.index = O, !e)
          return D.flags |= Ci, H;
        var G = D.alternate;
        if (G !== null) {
          var he = G.index;
          return he < H ? (D.flags |= mn, H) : he;
        } else
          return D.flags |= mn, H;
      }
      function f(D) {
        return e && D.alternate === null && (D.flags |= mn), D;
      }
      function p(D, H, O, G) {
        if (H === null || H.tag !== le) {
          var he = ZS(O, D.mode, G);
          return he.return = D, he;
        } else {
          var ce = u(H, O);
          return ce.return = D, ce;
        }
      }
      function v(D, H, O, G) {
        var he = O.type;
        if (he === fi)
          return g(D, H, O.props.children, G, O.key);
        if (H !== null && (H.elementType === he || // Keep this check inline so it only runs on the false path:
        vR(H, O) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof he == "object" && he !== null && he.$$typeof === Ye && oE(he) === H.type)) {
          var ce = u(H, O.props);
          return ce.ref = gp(D, H, O), ce.return = D, ce._debugSource = O._source, ce._debugOwner = O._owner, ce;
        }
        var Pe = JS(O, D.mode, G);
        return Pe.ref = gp(D, H, O), Pe.return = D, Pe;
      }
      function y(D, H, O, G) {
        if (H === null || H.tag !== K || H.stateNode.containerInfo !== O.containerInfo || H.stateNode.implementation !== O.implementation) {
          var he = e0(O, D.mode, G);
          return he.return = D, he;
        } else {
          var ce = u(H, O.children || []);
          return ce.return = D, ce;
        }
      }
      function g(D, H, O, G, he) {
        if (H === null || H.tag !== Qe) {
          var ce = Io(O, D.mode, G, he);
          return ce.return = D, ce;
        } else {
          var Pe = u(H, O);
          return Pe.return = D, Pe;
        }
      }
      function b(D, H, O) {
        if (typeof H == "string" && H !== "" || typeof H == "number") {
          var G = ZS("" + H, D.mode, O);
          return G.return = D, G;
        }
        if (typeof H == "object" && H !== null) {
          switch (H.$$typeof) {
            case _r: {
              var he = JS(H, D.mode, O);
              return he.ref = gp(D, null, H), he.return = D, he;
            }
            case rr: {
              var ce = e0(H, D.mode, O);
              return ce.return = D, ce;
            }
            case Ye: {
              var Pe = H._payload, Ge = H._init;
              return b(D, Ge(Pe), O);
            }
          }
          if (at(H) || qe(H)) {
            var qt = Io(H, D.mode, O, null);
            return qt.return = D, qt;
          }
          Ih(D, H);
        }
        return typeof H == "function" && Yh(D), null;
      }
      function x(D, H, O, G) {
        var he = H !== null ? H.key : null;
        if (typeof O == "string" && O !== "" || typeof O == "number")
          return he !== null ? null : p(D, H, "" + O, G);
        if (typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case _r:
              return O.key === he ? v(D, H, O, G) : null;
            case rr:
              return O.key === he ? y(D, H, O, G) : null;
            case Ye: {
              var ce = O._payload, Pe = O._init;
              return x(D, H, Pe(ce), G);
            }
          }
          if (at(O) || qe(O))
            return he !== null ? null : g(D, H, O, G, null);
          Ih(D, O);
        }
        return typeof O == "function" && Yh(D), null;
      }
      function N(D, H, O, G, he) {
        if (typeof G == "string" && G !== "" || typeof G == "number") {
          var ce = D.get(O) || null;
          return p(H, ce, "" + G, he);
        }
        if (typeof G == "object" && G !== null) {
          switch (G.$$typeof) {
            case _r: {
              var Pe = D.get(G.key === null ? O : G.key) || null;
              return v(H, Pe, G, he);
            }
            case rr: {
              var Ge = D.get(G.key === null ? O : G.key) || null;
              return y(H, Ge, G, he);
            }
            case Ye:
              var qt = G._payload, zt = G._init;
              return N(D, H, O, zt(qt), he);
          }
          if (at(G) || qe(G)) {
            var Gn = D.get(O) || null;
            return g(H, Gn, G, he, null);
          }
          Ih(H, G);
        }
        return typeof G == "function" && Yh(H), null;
      }
      function U(D, H, O) {
        {
          if (typeof D != "object" || D === null)
            return H;
          switch (D.$$typeof) {
            case _r:
            case rr:
              uE(D, O);
              var G = D.key;
              if (typeof G != "string")
                break;
              if (H === null) {
                H = /* @__PURE__ */ new Set(), H.add(G);
                break;
              }
              if (!H.has(G)) {
                H.add(G);
                break;
              }
              S("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", G);
              break;
            case Ye:
              var he = D._payload, ce = D._init;
              U(ce(he), H, O);
              break;
          }
        }
        return H;
      }
      function F(D, H, O, G) {
        for (var he = null, ce = 0; ce < O.length; ce++) {
          var Pe = O[ce];
          he = U(Pe, he, D);
        }
        for (var Ge = null, qt = null, zt = H, Gn = 0, Ut = 0, Vn = null; zt !== null && Ut < O.length; Ut++) {
          zt.index > Ut ? (Vn = zt, zt = null) : Vn = zt.sibling;
          var la = x(D, zt, O[Ut], G);
          if (la === null) {
            zt === null && (zt = Vn);
            break;
          }
          e && zt && la.alternate === null && t(D, zt), Gn = s(la, Gn, Ut), qt === null ? Ge = la : qt.sibling = la, qt = la, zt = Vn;
        }
        if (Ut === O.length) {
          if (a(D, zt), Ar()) {
            var Ir = Ut;
            $s(D, Ir);
          }
          return Ge;
        }
        if (zt === null) {
          for (; Ut < O.length; Ut++) {
            var oi = b(D, O[Ut], G);
            oi !== null && (Gn = s(oi, Gn, Ut), qt === null ? Ge = oi : qt.sibling = oi, qt = oi);
          }
          if (Ar()) {
            var Ca = Ut;
            $s(D, Ca);
          }
          return Ge;
        }
        for (var Ra = i(D, zt); Ut < O.length; Ut++) {
          var ua = N(Ra, D, Ut, O[Ut], G);
          ua !== null && (e && ua.alternate !== null && Ra.delete(ua.key === null ? Ut : ua.key), Gn = s(ua, Gn, Ut), qt === null ? Ge = ua : qt.sibling = ua, qt = ua);
        }
        if (e && Ra.forEach(function($f) {
          return t(D, $f);
        }), Ar()) {
          var $u = Ut;
          $s(D, $u);
        }
        return Ge;
      }
      function se(D, H, O, G) {
        var he = qe(O);
        if (typeof he != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          O[Symbol.toStringTag] === "Generator" && (tg || S("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), tg = !0), O.entries === he && (eg || S("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), eg = !0);
          var ce = he.call(O);
          if (ce)
            for (var Pe = null, Ge = ce.next(); !Ge.done; Ge = ce.next()) {
              var qt = Ge.value;
              Pe = U(qt, Pe, D);
            }
        }
        var zt = he.call(O);
        if (zt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var Gn = null, Ut = null, Vn = H, la = 0, Ir = 0, oi = null, Ca = zt.next(); Vn !== null && !Ca.done; Ir++, Ca = zt.next()) {
          Vn.index > Ir ? (oi = Vn, Vn = null) : oi = Vn.sibling;
          var Ra = x(D, Vn, Ca.value, G);
          if (Ra === null) {
            Vn === null && (Vn = oi);
            break;
          }
          e && Vn && Ra.alternate === null && t(D, Vn), la = s(Ra, la, Ir), Ut === null ? Gn = Ra : Ut.sibling = Ra, Ut = Ra, Vn = oi;
        }
        if (Ca.done) {
          if (a(D, Vn), Ar()) {
            var ua = Ir;
            $s(D, ua);
          }
          return Gn;
        }
        if (Vn === null) {
          for (; !Ca.done; Ir++, Ca = zt.next()) {
            var $u = b(D, Ca.value, G);
            $u !== null && (la = s($u, la, Ir), Ut === null ? Gn = $u : Ut.sibling = $u, Ut = $u);
          }
          if (Ar()) {
            var $f = Ir;
            $s(D, $f);
          }
          return Gn;
        }
        for (var qp = i(D, Vn); !Ca.done; Ir++, Ca = zt.next()) {
          var Xl = N(qp, D, Ir, Ca.value, G);
          Xl !== null && (e && Xl.alternate !== null && qp.delete(Xl.key === null ? Ir : Xl.key), la = s(Xl, la, Ir), Ut === null ? Gn = Xl : Ut.sibling = Xl, Ut = Xl);
        }
        if (e && qp.forEach(function(W_) {
          return t(D, W_);
        }), Ar()) {
          var Q_ = Ir;
          $s(D, Q_);
        }
        return Gn;
      }
      function Me(D, H, O, G) {
        if (H !== null && H.tag === le) {
          a(D, H.sibling);
          var he = u(H, O);
          return he.return = D, he;
        }
        a(D, H);
        var ce = ZS(O, D.mode, G);
        return ce.return = D, ce;
      }
      function be(D, H, O, G) {
        for (var he = O.key, ce = H; ce !== null; ) {
          if (ce.key === he) {
            var Pe = O.type;
            if (Pe === fi) {
              if (ce.tag === Qe) {
                a(D, ce.sibling);
                var Ge = u(ce, O.props.children);
                return Ge.return = D, Ge._debugSource = O._source, Ge._debugOwner = O._owner, Ge;
              }
            } else if (ce.elementType === Pe || // Keep this check inline so it only runs on the false path:
            vR(ce, O) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof Pe == "object" && Pe !== null && Pe.$$typeof === Ye && oE(Pe) === ce.type) {
              a(D, ce.sibling);
              var qt = u(ce, O.props);
              return qt.ref = gp(D, ce, O), qt.return = D, qt._debugSource = O._source, qt._debugOwner = O._owner, qt;
            }
            a(D, ce);
            break;
          } else
            t(D, ce);
          ce = ce.sibling;
        }
        if (O.type === fi) {
          var zt = Io(O.props.children, D.mode, G, O.key);
          return zt.return = D, zt;
        } else {
          var Gn = JS(O, D.mode, G);
          return Gn.ref = gp(D, H, O), Gn.return = D, Gn;
        }
      }
      function Rt(D, H, O, G) {
        for (var he = O.key, ce = H; ce !== null; ) {
          if (ce.key === he)
            if (ce.tag === K && ce.stateNode.containerInfo === O.containerInfo && ce.stateNode.implementation === O.implementation) {
              a(D, ce.sibling);
              var Pe = u(ce, O.children || []);
              return Pe.return = D, Pe;
            } else {
              a(D, ce);
              break;
            }
          else
            t(D, ce);
          ce = ce.sibling;
        }
        var Ge = e0(O, D.mode, G);
        return Ge.return = D, Ge;
      }
      function ht(D, H, O, G) {
        var he = typeof O == "object" && O !== null && O.type === fi && O.key === null;
        if (he && (O = O.props.children), typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case _r:
              return f(be(D, H, O, G));
            case rr:
              return f(Rt(D, H, O, G));
            case Ye:
              var ce = O._payload, Pe = O._init;
              return ht(D, H, Pe(ce), G);
          }
          if (at(O))
            return F(D, H, O, G);
          if (qe(O))
            return se(D, H, O, G);
          Ih(D, O);
        }
        return typeof O == "string" && O !== "" || typeof O == "number" ? f(Me(D, H, "" + O, G)) : (typeof O == "function" && Yh(D), a(D, H));
      }
      return ht;
    }
    var _f = sE(!0), cE = sE(!1);
    function Rw(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = ac(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = ac(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function Tw(e, t) {
      for (var a = e.child; a !== null; )
        c_(a, t), a = a.sibling;
    }
    var ig = Do(null), lg;
    lg = {};
    var $h = null, kf = null, ug = null, Qh = !1;
    function Wh() {
      $h = null, kf = null, ug = null, Qh = !1;
    }
    function fE() {
      Qh = !0;
    }
    function dE() {
      Qh = !1;
    }
    function pE(e, t, a) {
      aa(ig, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== lg && S("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = lg;
    }
    function og(e, t) {
      var a = ig.current;
      ra(ig, t), e._currentValue = a;
    }
    function sg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (_u(i.childLanes, t) ? u !== null && !_u(u.childLanes, t) && (u.childLanes = Xe(u.childLanes, t)) : (i.childLanes = Xe(i.childLanes, t), u !== null && (u.childLanes = Xe(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && S("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function xw(e, t, a) {
      ww(e, t, a);
    }
    function ww(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === de) {
                var p = Rs(a), v = Hu(Xt, p);
                v.tag = Kh;
                var y = i.updateQueue;
                if (y !== null) {
                  var g = y.shared, b = g.pending;
                  b === null ? v.next = v : (v.next = b.next, b.next = v), g.pending = v;
                }
              }
              i.lanes = Xe(i.lanes, a);
              var x = i.alternate;
              x !== null && (x.lanes = Xe(x.lanes, a)), sg(i.return, a, e), s.lanes = Xe(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === pt)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === Zt) {
          var N = i.return;
          if (N === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          N.lanes = Xe(N.lanes, a);
          var U = N.alternate;
          U !== null && (U.lanes = Xe(U.lanes, a)), sg(N, a, e), u = i.sibling;
        } else
          u = i.child;
        if (u !== null)
          u.return = i;
        else
          for (u = i; u !== null; ) {
            if (u === e) {
              u = null;
              break;
            }
            var F = u.sibling;
            if (F !== null) {
              F.return = u.return, u = F;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Df(e, t) {
      $h = e, kf = null, ug = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (Zr(a.lanes, t) && Mp(), a.firstContext = null);
      }
    }
    function tr(e) {
      Qh && S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (ug !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (kf === null) {
          if ($h === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          kf = a, $h.dependencies = {
            lanes: I,
            firstContext: a
          };
        } else
          kf = kf.next = a;
      }
      return t;
    }
    var qs = null;
    function cg(e) {
      qs === null ? qs = [e] : qs.push(e);
    }
    function bw() {
      if (qs !== null) {
        for (var e = 0; e < qs.length; e++) {
          var t = qs[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, u = t.pending;
            if (u !== null) {
              var s = u.next;
              u.next = i, a.next = s;
            }
            t.pending = a;
          }
        }
        qs = null;
      }
    }
    function vE(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, cg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Gh(e, i);
    }
    function _w(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, cg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function kw(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, cg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Gh(e, i);
    }
    function Fa(e, t) {
      return Gh(e, t);
    }
    var Dw = Gh;
    function Gh(e, t) {
      e.lanes = Xe(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = Xe(a.lanes, t)), a === null && (e.flags & (mn | Gr)) !== De && cR(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = Xe(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = Xe(a.childLanes, t) : (u.flags & (mn | Gr)) !== De && cR(e), i = u, u = u.return;
      if (i.tag === ee) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var hE = 0, mE = 1, Kh = 2, fg = 3, qh = !1, dg, Xh;
    dg = !1, Xh = null;
    function pg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: I
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function yE(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var u = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = u;
      }
    }
    function Hu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: hE,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function Mo(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (Xh === u && !dg && (S("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), dg = !0), _1()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, Dw(e, a);
      } else
        return kw(e, u, t, a);
    }
    function Jh(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (Ld(a)) {
          var s = u.lanes;
          s = Md(s, e.pendingLanes);
          var f = Xe(s, a);
          u.lanes = f, ef(e, f);
        }
      }
    }
    function vg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var u = i.updateQueue;
        if (a === u) {
          var s = null, f = null, p = a.firstBaseUpdate;
          if (p !== null) {
            var v = p;
            do {
              var y = {
                eventTime: v.eventTime,
                lane: v.lane,
                tag: v.tag,
                payload: v.payload,
                callback: v.callback,
                next: null
              };
              f === null ? s = f = y : (f.next = y, f = y), v = v.next;
            } while (v !== null);
            f === null ? s = f = t : (f.next = t, f = t);
          } else
            s = f = t;
          a = {
            baseState: u.baseState,
            firstBaseUpdate: s,
            lastBaseUpdate: f,
            shared: u.shared,
            effects: u.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var g = a.lastBaseUpdate;
      g === null ? a.firstBaseUpdate = t : g.next = t, a.lastBaseUpdate = t;
    }
    function Ow(e, t, a, i, u, s) {
      switch (a.tag) {
        case mE: {
          var f = a.payload;
          if (typeof f == "function") {
            fE();
            var p = f.call(s, i, u);
            {
              if (e.mode & Gt) {
                yn(!0);
                try {
                  f.call(s, i, u);
                } finally {
                  yn(!1);
                }
              }
              dE();
            }
            return p;
          }
          return f;
        }
        case fg:
          e.flags = e.flags & ~Xn | _e;
        case hE: {
          var v = a.payload, y;
          if (typeof v == "function") {
            fE(), y = v.call(s, i, u);
            {
              if (e.mode & Gt) {
                yn(!0);
                try {
                  v.call(s, i, u);
                } finally {
                  yn(!1);
                }
              }
              dE();
            }
          } else
            y = v;
          return y == null ? i : Ze({}, i, y);
        }
        case Kh:
          return qh = !0, i;
      }
      return i;
    }
    function Zh(e, t, a, i) {
      var u = e.updateQueue;
      qh = !1, Xh = u.shared;
      var s = u.firstBaseUpdate, f = u.lastBaseUpdate, p = u.shared.pending;
      if (p !== null) {
        u.shared.pending = null;
        var v = p, y = v.next;
        v.next = null, f === null ? s = y : f.next = y, f = v;
        var g = e.alternate;
        if (g !== null) {
          var b = g.updateQueue, x = b.lastBaseUpdate;
          x !== f && (x === null ? b.firstBaseUpdate = y : x.next = y, b.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var N = u.baseState, U = I, F = null, se = null, Me = null, be = s;
        do {
          var Rt = be.lane, ht = be.eventTime;
          if (_u(i, Rt)) {
            if (Me !== null) {
              var H = {
                eventTime: ht,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: kt,
                tag: be.tag,
                payload: be.payload,
                callback: be.callback,
                next: null
              };
              Me = Me.next = H;
            }
            N = Ow(e, u, be, N, t, a);
            var O = be.callback;
            if (O !== null && // If the update was already committed, we should not queue its
            // callback again.
            be.lane !== kt) {
              e.flags |= an;
              var G = u.effects;
              G === null ? u.effects = [be] : G.push(be);
            }
          } else {
            var D = {
              eventTime: ht,
              lane: Rt,
              tag: be.tag,
              payload: be.payload,
              callback: be.callback,
              next: null
            };
            Me === null ? (se = Me = D, F = N) : Me = Me.next = D, U = Xe(U, Rt);
          }
          if (be = be.next, be === null) {
            if (p = u.shared.pending, p === null)
              break;
            var he = p, ce = he.next;
            he.next = null, be = ce, u.lastBaseUpdate = he, u.shared.pending = null;
          }
        } while (!0);
        Me === null && (F = N), u.baseState = F, u.firstBaseUpdate = se, u.lastBaseUpdate = Me;
        var Pe = u.shared.interleaved;
        if (Pe !== null) {
          var Ge = Pe;
          do
            U = Xe(U, Ge.lane), Ge = Ge.next;
          while (Ge !== Pe);
        } else s === null && (u.shared.lanes = I);
        $p(U), e.lanes = U, e.memoizedState = N;
      }
      Xh = null;
    }
    function Lw(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function gE() {
      qh = !1;
    }
    function em() {
      return qh;
    }
    function SE(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, Lw(f, a));
        }
    }
    var Sp = {}, zo = Do(Sp), Ep = Do(Sp), tm = Do(Sp);
    function nm(e) {
      if (e === Sp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function EE() {
      var e = nm(tm.current);
      return e;
    }
    function hg(e, t) {
      aa(tm, t, e), aa(Ep, e, e), aa(zo, Sp, e);
      var a = GT(t);
      ra(zo, e), aa(zo, a, e);
    }
    function Of(e) {
      ra(zo, e), ra(Ep, e), ra(tm, e);
    }
    function mg() {
      var e = nm(zo.current);
      return e;
    }
    function CE(e) {
      nm(tm.current);
      var t = nm(zo.current), a = KT(t, e.type);
      t !== a && (aa(Ep, e, e), aa(zo, a, e));
    }
    function yg(e) {
      Ep.current === e && (ra(zo, e), ra(Ep, e));
    }
    var Nw = 0, RE = 1, TE = 1, Cp = 2, al = Do(Nw);
    function gg(e, t) {
      return (e & t) !== 0;
    }
    function Lf(e) {
      return e & RE;
    }
    function Sg(e, t) {
      return e & RE | t;
    }
    function Mw(e, t) {
      return e | t;
    }
    function Uo(e, t) {
      aa(al, t, e);
    }
    function Nf(e) {
      ra(al, e);
    }
    function zw(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function rm(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === ke) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || V0(i) || jy(i))
              return t;
          }
        } else if (t.tag === un && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & _e) !== De;
          if (u)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var Ha = (
      /*   */
      0
    ), cr = (
      /* */
      1
    ), Yl = (
      /*  */
      2
    ), fr = (
      /*    */
      4
    ), jr = (
      /*   */
      8
    ), Eg = [];
    function Cg() {
      for (var e = 0; e < Eg.length; e++) {
        var t = Eg[e];
        t._workInProgressVersionPrimary = null;
      }
      Eg.length = 0;
    }
    function Uw(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var ve = A.ReactCurrentDispatcher, Rp = A.ReactCurrentBatchConfig, Rg, Mf;
    Rg = /* @__PURE__ */ new Set();
    var Xs = I, Kt = null, dr = null, pr = null, am = !1, Tp = !1, xp = 0, Aw = 0, jw = 25, P = null, zi = null, Ao = -1, Tg = !1;
    function Pt() {
      {
        var e = P;
        zi === null ? zi = [e] : zi.push(e);
      }
    }
    function re() {
      {
        var e = P;
        zi !== null && (Ao++, zi[Ao] !== e && Fw(e));
      }
    }
    function zf(e) {
      e != null && !at(e) && S("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", P, typeof e);
    }
    function Fw(e) {
      {
        var t = Ie(Kt);
        if (!Rg.has(t) && (Rg.add(t), zi !== null)) {
          for (var a = "", i = 30, u = 0; u <= Ao; u++) {
            for (var s = zi[u], f = u === Ao ? e : s, p = u + 1 + ". " + s; p.length < i; )
              p += " ";
            p += f + `
`, a += p;
          }
          S(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function ia() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function xg(e, t) {
      if (Tg)
        return !1;
      if (t === null)
        return S("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", P), !1;
      e.length !== t.length && S(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, P, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!Q(e[a], t[a]))
          return !1;
      return !0;
    }
    function Uf(e, t, a, i, u, s) {
      Xs = s, Kt = t, zi = e !== null ? e._debugHookTypes : null, Ao = -1, Tg = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = I, e !== null && e.memoizedState !== null ? ve.current = $E : zi !== null ? ve.current = YE : ve.current = IE;
      var f = a(i, u);
      if (Tp) {
        var p = 0;
        do {
          if (Tp = !1, xp = 0, p >= jw)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, Tg = !1, dr = null, pr = null, t.updateQueue = null, Ao = -1, ve.current = QE, f = a(i, u);
        } while (Tp);
      }
      ve.current = ym, t._debugHookTypes = zi;
      var v = dr !== null && dr.next !== null;
      if (Xs = I, Kt = null, dr = null, pr = null, P = null, zi = null, Ao = -1, e !== null && (e.flags & zn) !== (t.flags & zn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & ot) !== Oe && S("Internal React error: Expected static flag was missing. Please notify the React team."), am = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function Af() {
      var e = xp !== 0;
      return xp = 0, e;
    }
    function xE(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Nt) !== Oe ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Ts(e.lanes, a);
    }
    function wE() {
      if (ve.current = ym, am) {
        for (var e = Kt.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        am = !1;
      }
      Xs = I, Kt = null, dr = null, pr = null, zi = null, Ao = -1, P = null, FE = !1, Tp = !1, xp = 0;
    }
    function $l() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return pr === null ? Kt.memoizedState = pr = e : pr = pr.next = e, pr;
    }
    function Ui() {
      var e;
      if (dr === null) {
        var t = Kt.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = dr.next;
      var a;
      if (pr === null ? a = Kt.memoizedState : a = pr.next, a !== null)
        pr = a, a = pr.next, dr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        dr = e;
        var i = {
          memoizedState: dr.memoizedState,
          baseState: dr.baseState,
          baseQueue: dr.baseQueue,
          queue: dr.queue,
          next: null
        };
        pr === null ? Kt.memoizedState = pr = i : pr = pr.next = i;
      }
      return pr;
    }
    function bE() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function wg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function bg(e, t, a) {
      var i = $l(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: I,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = Bw.bind(null, Kt, s);
      return [i.memoizedState, f];
    }
    function _g(e, t, a) {
      var i = Ui(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = dr, f = s.baseQueue, p = u.pending;
      if (p !== null) {
        if (f !== null) {
          var v = f.next, y = p.next;
          f.next = y, p.next = v;
        }
        s.baseQueue !== f && S("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = p, u.pending = null;
      }
      if (f !== null) {
        var g = f.next, b = s.baseState, x = null, N = null, U = null, F = g;
        do {
          var se = F.lane;
          if (_u(Xs, se)) {
            if (U !== null) {
              var be = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: kt,
                action: F.action,
                hasEagerState: F.hasEagerState,
                eagerState: F.eagerState,
                next: null
              };
              U = U.next = be;
            }
            if (F.hasEagerState)
              b = F.eagerState;
            else {
              var Rt = F.action;
              b = e(b, Rt);
            }
          } else {
            var Me = {
              lane: se,
              action: F.action,
              hasEagerState: F.hasEagerState,
              eagerState: F.eagerState,
              next: null
            };
            U === null ? (N = U = Me, x = b) : U = U.next = Me, Kt.lanes = Xe(Kt.lanes, se), $p(se);
          }
          F = F.next;
        } while (F !== null && F !== g);
        U === null ? x = b : U.next = N, Q(b, i.memoizedState) || Mp(), i.memoizedState = b, i.baseState = x, i.baseQueue = U, u.lastRenderedState = b;
      }
      var ht = u.interleaved;
      if (ht !== null) {
        var D = ht;
        do {
          var H = D.lane;
          Kt.lanes = Xe(Kt.lanes, H), $p(H), D = D.next;
        } while (D !== ht);
      } else f === null && (u.lanes = I);
      var O = u.dispatch;
      return [i.memoizedState, O];
    }
    function kg(e, t, a) {
      var i = Ui(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = u.dispatch, f = u.pending, p = i.memoizedState;
      if (f !== null) {
        u.pending = null;
        var v = f.next, y = v;
        do {
          var g = y.action;
          p = e(p, g), y = y.next;
        } while (y !== v);
        Q(p, i.memoizedState) || Mp(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function sk(e, t, a) {
    }
    function ck(e, t, a) {
    }
    function Dg(e, t, a) {
      var i = Kt, u = $l(), s, f = Ar();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), Mf || s !== a() && (S("The result of getServerSnapshot should be cached to avoid an infinite loop"), Mf = !0);
      } else {
        if (s = t(), !Mf) {
          var p = t();
          Q(s, p) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), Mf = !0);
        }
        var v = Am();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Jc(v, Xs) || _E(i, t, s);
      }
      u.memoizedState = s;
      var y = {
        value: s,
        getSnapshot: t
      };
      return u.queue = y, sm(DE.bind(null, i, y, e), [e]), i.flags |= Wr, wp(cr | jr, kE.bind(null, i, y, s, t), void 0, null), s;
    }
    function im(e, t, a) {
      var i = Kt, u = Ui(), s = t();
      if (!Mf) {
        var f = t();
        Q(s, f) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), Mf = !0);
      }
      var p = u.memoizedState, v = !Q(p, s);
      v && (u.memoizedState = s, Mp());
      var y = u.queue;
      if (_p(DE.bind(null, i, y, e), [e]), y.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      pr !== null && pr.memoizedState.tag & cr) {
        i.flags |= Wr, wp(cr | jr, kE.bind(null, i, y, s, t), void 0, null);
        var g = Am();
        if (g === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Jc(g, Xs) || _E(i, t, s);
      }
      return s;
    }
    function _E(e, t, a) {
      e.flags |= po;
      var i = {
        getSnapshot: t,
        value: a
      }, u = Kt.updateQueue;
      if (u === null)
        u = bE(), Kt.updateQueue = u, u.stores = [i];
      else {
        var s = u.stores;
        s === null ? u.stores = [i] : s.push(i);
      }
    }
    function kE(e, t, a, i) {
      t.value = a, t.getSnapshot = i, OE(t) && LE(e);
    }
    function DE(e, t, a) {
      var i = function() {
        OE(t) && LE(e);
      };
      return a(i);
    }
    function OE(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !Q(a, i);
      } catch {
        return !0;
      }
    }
    function LE(e) {
      var t = Fa(e, Fe);
      t !== null && yr(t, e, Fe, Xt);
    }
    function lm(e) {
      var t = $l();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: I,
        dispatch: null,
        lastRenderedReducer: wg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = Iw.bind(null, Kt, a);
      return [t.memoizedState, i];
    }
    function Og(e) {
      return _g(wg);
    }
    function Lg(e) {
      return kg(wg);
    }
    function wp(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = Kt.updateQueue;
      if (s === null)
        s = bE(), Kt.updateQueue = s, s.lastEffect = u.next = u;
      else {
        var f = s.lastEffect;
        if (f === null)
          s.lastEffect = u.next = u;
        else {
          var p = f.next;
          f.next = u, u.next = p, s.lastEffect = u;
        }
      }
      return u;
    }
    function Ng(e) {
      var t = $l();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function um(e) {
      var t = Ui();
      return t.memoizedState;
    }
    function bp(e, t, a, i) {
      var u = $l(), s = i === void 0 ? null : i;
      Kt.flags |= e, u.memoizedState = wp(cr | t, a, void 0, s);
    }
    function om(e, t, a, i) {
      var u = Ui(), s = i === void 0 ? null : i, f = void 0;
      if (dr !== null) {
        var p = dr.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (xg(s, v)) {
            u.memoizedState = wp(t, a, f, s);
            return;
          }
        }
      }
      Kt.flags |= e, u.memoizedState = wp(cr | t, a, f, s);
    }
    function sm(e, t) {
      return (Kt.mode & Nt) !== Oe ? bp(Ri | Wr | wc, jr, e, t) : bp(Wr | wc, jr, e, t);
    }
    function _p(e, t) {
      return om(Wr, jr, e, t);
    }
    function Mg(e, t) {
      return bp(St, Yl, e, t);
    }
    function cm(e, t) {
      return om(St, Yl, e, t);
    }
    function zg(e, t) {
      var a = St;
      return a |= Qi, (Kt.mode & Nt) !== Oe && (a |= bl), bp(a, fr, e, t);
    }
    function fm(e, t) {
      return om(St, fr, e, t);
    }
    function NE(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var u = t;
        u.hasOwnProperty("current") || S("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(u).join(", ") + "}");
        var s = e();
        return u.current = s, function() {
          u.current = null;
        };
      }
    }
    function Ug(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = St;
      return u |= Qi, (Kt.mode & Nt) !== Oe && (u |= bl), bp(u, fr, NE.bind(null, t, e), i);
    }
    function dm(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return om(St, fr, NE.bind(null, t, e), i);
    }
    function Hw(e, t) {
    }
    var pm = Hw;
    function Ag(e, t) {
      var a = $l(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function vm(e, t) {
      var a = Ui(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (xg(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function jg(e, t) {
      var a = $l(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function hm(e, t) {
      var a = Ui(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (xg(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Fg(e) {
      var t = $l();
      return t.memoizedState = e, e;
    }
    function ME(e) {
      var t = Ui(), a = dr, i = a.memoizedState;
      return UE(t, i, e);
    }
    function zE(e) {
      var t = Ui();
      if (dr === null)
        return t.memoizedState = e, e;
      var a = dr.memoizedState;
      return UE(t, a, e);
    }
    function UE(e, t, a) {
      var i = !Dd(Xs);
      if (i) {
        if (!Q(a, t)) {
          var u = Nd();
          Kt.lanes = Xe(Kt.lanes, u), $p(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Mp()), e.memoizedState = a, a;
    }
    function Vw(e, t, a) {
      var i = Ua();
      jn(Qv(i, bi)), e(!0);
      var u = Rp.transition;
      Rp.transition = {};
      var s = Rp.transition;
      Rp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (jn(i), Rp.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && yt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Hg() {
      var e = lm(!1), t = e[0], a = e[1], i = Vw.bind(null, a), u = $l();
      return u.memoizedState = i, [t, i];
    }
    function AE() {
      var e = Og(), t = e[0], a = Ui(), i = a.memoizedState;
      return [t, i];
    }
    function jE() {
      var e = Lg(), t = e[0], a = Ui(), i = a.memoizedState;
      return [t, i];
    }
    var FE = !1;
    function Pw() {
      return FE;
    }
    function Vg() {
      var e = $l(), t = Am(), a = t.identifierPrefix, i;
      if (Ar()) {
        var u = aw();
        i = ":" + a + "R" + u;
        var s = xp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = Aw++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function mm() {
      var e = Ui(), t = e.memoizedState;
      return t;
    }
    function Bw(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Po(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (HE(e))
        VE(t, u);
      else {
        var s = vE(e, t, u, i);
        if (s !== null) {
          var f = Ea();
          yr(s, e, i, f), PE(s, t, i);
        }
      }
      BE(e, i);
    }
    function Iw(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Po(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (HE(e))
        VE(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === I && (s === null || s.lanes === I)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = ve.current, ve.current = il;
            try {
              var v = t.lastRenderedState, y = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = y, Q(y, v)) {
                _w(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              ve.current = p;
            }
          }
        }
        var g = vE(e, t, u, i);
        if (g !== null) {
          var b = Ea();
          yr(g, e, i, b), PE(g, t, i);
        }
      }
      BE(e, i);
    }
    function HE(e) {
      var t = e.alternate;
      return e === Kt || t !== null && t === Kt;
    }
    function VE(e, t) {
      Tp = am = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function PE(e, t, a) {
      if (Ld(a)) {
        var i = t.lanes;
        i = Md(i, e.pendingLanes);
        var u = Xe(i, a);
        t.lanes = u, ef(e, u);
      }
    }
    function BE(e, t, a) {
      ps(e, t);
    }
    var ym = {
      readContext: tr,
      useCallback: ia,
      useContext: ia,
      useEffect: ia,
      useImperativeHandle: ia,
      useInsertionEffect: ia,
      useLayoutEffect: ia,
      useMemo: ia,
      useReducer: ia,
      useRef: ia,
      useState: ia,
      useDebugValue: ia,
      useDeferredValue: ia,
      useTransition: ia,
      useMutableSource: ia,
      useSyncExternalStore: ia,
      useId: ia,
      unstable_isNewReconciler: J
    }, IE = null, YE = null, $E = null, QE = null, Ql = null, il = null, gm = null;
    {
      var Pg = function() {
        S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, $e = function() {
        S("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      IE = {
        readContext: function(e) {
          return tr(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", Pt(), zf(t), Ag(e, t);
        },
        useContext: function(e) {
          return P = "useContext", Pt(), tr(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", Pt(), zf(t), sm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", Pt(), zf(a), Ug(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", Pt(), zf(t), Mg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", Pt(), zf(t), zg(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", Pt(), zf(t);
          var a = ve.current;
          ve.current = Ql;
          try {
            return jg(e, t);
          } finally {
            ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", Pt();
          var i = ve.current;
          ve.current = Ql;
          try {
            return bg(e, t, a);
          } finally {
            ve.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", Pt(), Ng(e);
        },
        useState: function(e) {
          P = "useState", Pt();
          var t = ve.current;
          ve.current = Ql;
          try {
            return lm(e);
          } finally {
            ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", Pt(), void 0;
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", Pt(), Fg(e);
        },
        useTransition: function() {
          return P = "useTransition", Pt(), Hg();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", Pt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", Pt(), Dg(e, t, a);
        },
        useId: function() {
          return P = "useId", Pt(), Vg();
        },
        unstable_isNewReconciler: J
      }, YE = {
        readContext: function(e) {
          return tr(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", re(), Ag(e, t);
        },
        useContext: function(e) {
          return P = "useContext", re(), tr(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", re(), sm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", re(), Ug(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", re(), Mg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", re(), zg(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", re();
          var a = ve.current;
          ve.current = Ql;
          try {
            return jg(e, t);
          } finally {
            ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", re();
          var i = ve.current;
          ve.current = Ql;
          try {
            return bg(e, t, a);
          } finally {
            ve.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", re(), Ng(e);
        },
        useState: function(e) {
          P = "useState", re();
          var t = ve.current;
          ve.current = Ql;
          try {
            return lm(e);
          } finally {
            ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", re(), void 0;
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", re(), Fg(e);
        },
        useTransition: function() {
          return P = "useTransition", re(), Hg();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", re(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", re(), Dg(e, t, a);
        },
        useId: function() {
          return P = "useId", re(), Vg();
        },
        unstable_isNewReconciler: J
      }, $E = {
        readContext: function(e) {
          return tr(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", re(), vm(e, t);
        },
        useContext: function(e) {
          return P = "useContext", re(), tr(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", re(), _p(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", re(), dm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", re(), cm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", re(), fm(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", re();
          var a = ve.current;
          ve.current = il;
          try {
            return hm(e, t);
          } finally {
            ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", re();
          var i = ve.current;
          ve.current = il;
          try {
            return _g(e, t, a);
          } finally {
            ve.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", re(), um();
        },
        useState: function(e) {
          P = "useState", re();
          var t = ve.current;
          ve.current = il;
          try {
            return Og(e);
          } finally {
            ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", re(), pm();
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", re(), ME(e);
        },
        useTransition: function() {
          return P = "useTransition", re(), AE();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", re(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", re(), im(e, t);
        },
        useId: function() {
          return P = "useId", re(), mm();
        },
        unstable_isNewReconciler: J
      }, QE = {
        readContext: function(e) {
          return tr(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", re(), vm(e, t);
        },
        useContext: function(e) {
          return P = "useContext", re(), tr(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", re(), _p(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", re(), dm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", re(), cm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", re(), fm(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", re();
          var a = ve.current;
          ve.current = gm;
          try {
            return hm(e, t);
          } finally {
            ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", re();
          var i = ve.current;
          ve.current = gm;
          try {
            return kg(e, t, a);
          } finally {
            ve.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", re(), um();
        },
        useState: function(e) {
          P = "useState", re();
          var t = ve.current;
          ve.current = gm;
          try {
            return Lg(e);
          } finally {
            ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", re(), pm();
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", re(), zE(e);
        },
        useTransition: function() {
          return P = "useTransition", re(), jE();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", re(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", re(), im(e, t);
        },
        useId: function() {
          return P = "useId", re(), mm();
        },
        unstable_isNewReconciler: J
      }, Ql = {
        readContext: function(e) {
          return Pg(), tr(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", $e(), Pt(), Ag(e, t);
        },
        useContext: function(e) {
          return P = "useContext", $e(), Pt(), tr(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", $e(), Pt(), sm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", $e(), Pt(), Ug(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", $e(), Pt(), Mg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", $e(), Pt(), zg(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", $e(), Pt();
          var a = ve.current;
          ve.current = Ql;
          try {
            return jg(e, t);
          } finally {
            ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", $e(), Pt();
          var i = ve.current;
          ve.current = Ql;
          try {
            return bg(e, t, a);
          } finally {
            ve.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", $e(), Pt(), Ng(e);
        },
        useState: function(e) {
          P = "useState", $e(), Pt();
          var t = ve.current;
          ve.current = Ql;
          try {
            return lm(e);
          } finally {
            ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", $e(), Pt(), void 0;
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", $e(), Pt(), Fg(e);
        },
        useTransition: function() {
          return P = "useTransition", $e(), Pt(), Hg();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", $e(), Pt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", $e(), Pt(), Dg(e, t, a);
        },
        useId: function() {
          return P = "useId", $e(), Pt(), Vg();
        },
        unstable_isNewReconciler: J
      }, il = {
        readContext: function(e) {
          return Pg(), tr(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", $e(), re(), vm(e, t);
        },
        useContext: function(e) {
          return P = "useContext", $e(), re(), tr(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", $e(), re(), _p(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", $e(), re(), dm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", $e(), re(), cm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", $e(), re(), fm(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", $e(), re();
          var a = ve.current;
          ve.current = il;
          try {
            return hm(e, t);
          } finally {
            ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", $e(), re();
          var i = ve.current;
          ve.current = il;
          try {
            return _g(e, t, a);
          } finally {
            ve.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", $e(), re(), um();
        },
        useState: function(e) {
          P = "useState", $e(), re();
          var t = ve.current;
          ve.current = il;
          try {
            return Og(e);
          } finally {
            ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", $e(), re(), pm();
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", $e(), re(), ME(e);
        },
        useTransition: function() {
          return P = "useTransition", $e(), re(), AE();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", $e(), re(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", $e(), re(), im(e, t);
        },
        useId: function() {
          return P = "useId", $e(), re(), mm();
        },
        unstable_isNewReconciler: J
      }, gm = {
        readContext: function(e) {
          return Pg(), tr(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", $e(), re(), vm(e, t);
        },
        useContext: function(e) {
          return P = "useContext", $e(), re(), tr(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", $e(), re(), _p(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", $e(), re(), dm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", $e(), re(), cm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", $e(), re(), fm(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", $e(), re();
          var a = ve.current;
          ve.current = il;
          try {
            return hm(e, t);
          } finally {
            ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", $e(), re();
          var i = ve.current;
          ve.current = il;
          try {
            return kg(e, t, a);
          } finally {
            ve.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", $e(), re(), um();
        },
        useState: function(e) {
          P = "useState", $e(), re();
          var t = ve.current;
          ve.current = il;
          try {
            return Lg(e);
          } finally {
            ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", $e(), re(), pm();
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", $e(), re(), zE(e);
        },
        useTransition: function() {
          return P = "useTransition", $e(), re(), jE();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", $e(), re(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", $e(), re(), im(e, t);
        },
        useId: function() {
          return P = "useId", $e(), re(), mm();
        },
        unstable_isNewReconciler: J
      };
    }
    var jo = Z.unstable_now, WE = 0, Sm = -1, kp = -1, Em = -1, Bg = !1, Cm = !1;
    function GE() {
      return Bg;
    }
    function Yw() {
      Cm = !0;
    }
    function $w() {
      Bg = !1, Cm = !1;
    }
    function Qw() {
      Bg = Cm, Cm = !1;
    }
    function KE() {
      return WE;
    }
    function qE() {
      WE = jo();
    }
    function Ig(e) {
      kp = jo(), e.actualStartTime < 0 && (e.actualStartTime = jo());
    }
    function XE(e) {
      kp = -1;
    }
    function Rm(e, t) {
      if (kp >= 0) {
        var a = jo() - kp;
        e.actualDuration += a, t && (e.selfBaseDuration = a), kp = -1;
      }
    }
    function Wl(e) {
      if (Sm >= 0) {
        var t = jo() - Sm;
        Sm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case ee:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case vt:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function Yg(e) {
      if (Em >= 0) {
        var t = jo() - Em;
        Em = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case ee:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case vt:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function Gl() {
      Sm = jo();
    }
    function $g() {
      Em = jo();
    }
    function Qg(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ll(e, t) {
      if (e && e.defaultProps) {
        var a = Ze({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var Wg = {}, Gg, Kg, qg, Xg, Jg, JE, Tm, Zg, eS, tS, Dp;
    {
      Gg = /* @__PURE__ */ new Set(), Kg = /* @__PURE__ */ new Set(), qg = /* @__PURE__ */ new Set(), Xg = /* @__PURE__ */ new Set(), Zg = /* @__PURE__ */ new Set(), Jg = /* @__PURE__ */ new Set(), eS = /* @__PURE__ */ new Set(), tS = /* @__PURE__ */ new Set(), Dp = /* @__PURE__ */ new Set();
      var ZE = /* @__PURE__ */ new Set();
      Tm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          ZE.has(a) || (ZE.add(a), S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, JE = function(e, t) {
        if (t === void 0) {
          var a = Tt(e) || "Component";
          Jg.has(a) || (Jg.add(a), S("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(Wg, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(Wg);
    }
    function nS(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & Gt) {
          yn(!0);
          try {
            s = a(i, u);
          } finally {
            yn(!1);
          }
        }
        JE(t, s);
      }
      var f = s == null ? u : Ze({}, u, s);
      if (e.memoizedState = f, e.lanes === I) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var rS = {
      isMounted: Ov,
      enqueueSetState: function(e, t, a) {
        var i = fo(e), u = Ea(), s = Po(i), f = Hu(u, s);
        f.payload = t, a != null && (Tm(a, "setState"), f.callback = a);
        var p = Mo(i, f, s);
        p !== null && (yr(p, i, s, u), Jh(p, i, s)), ps(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = fo(e), u = Ea(), s = Po(i), f = Hu(u, s);
        f.tag = mE, f.payload = t, a != null && (Tm(a, "replaceState"), f.callback = a);
        var p = Mo(i, f, s);
        p !== null && (yr(p, i, s, u), Jh(p, i, s)), ps(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = fo(e), i = Ea(), u = Po(a), s = Hu(i, u);
        s.tag = Kh, t != null && (Tm(t, "forceUpdate"), s.callback = t);
        var f = Mo(a, s, u);
        f !== null && (yr(f, a, u, i), Jh(f, a, u)), Nc(a, u);
      }
    };
    function eC(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & Gt) {
            yn(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              yn(!1);
            }
          }
          v === void 0 && S("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", Tt(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Se(a, i) || !Se(u, s) : !0;
    }
    function Ww(e, t, a) {
      var i = e.stateNode;
      {
        var u = Tt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? S("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : S("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && S("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && S("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && S("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && S("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !Dp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Gt) === Oe && (Dp.add(t), S(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !Dp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Gt) === Oe && (Dp.add(t), S(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && S("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !eS.has(t) && (eS.add(t), S("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && S("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && S("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", Tt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && S("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && S("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && S("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && S("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && S("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && S("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !qg.has(t) && (qg.add(t), S("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", Tt(t))), typeof i.getDerivedStateFromProps == "function" && S("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && S("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && S("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || at(p)) && S("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && S("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function tC(e, t) {
      t.updater = rS, e.stateNode = t, pu(t, e), t._reactInternalInstance = Wg;
    }
    function nC(e, t, a) {
      var i = !1, u = li, s = li, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === R && f._context === void 0
        );
        if (!p && !tS.has(t)) {
          tS.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === pi ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", S("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", Tt(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = tr(f);
      else {
        u = Rf(e, t, !0);
        var y = t.contextTypes;
        i = y != null, s = i ? Tf(e, u) : li;
      }
      var g = new t(a, s);
      if (e.mode & Gt) {
        yn(!0);
        try {
          g = new t(a, s);
        } finally {
          yn(!1);
        }
      }
      var b = e.memoizedState = g.state !== null && g.state !== void 0 ? g.state : null;
      tC(e, g);
      {
        if (typeof t.getDerivedStateFromProps == "function" && b === null) {
          var x = Tt(t) || "Component";
          Kg.has(x) || (Kg.add(x), S("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", x, g.state === null ? "null" : "undefined", x));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof g.getSnapshotBeforeUpdate == "function") {
          var N = null, U = null, F = null;
          if (typeof g.componentWillMount == "function" && g.componentWillMount.__suppressDeprecationWarning !== !0 ? N = "componentWillMount" : typeof g.UNSAFE_componentWillMount == "function" && (N = "UNSAFE_componentWillMount"), typeof g.componentWillReceiveProps == "function" && g.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? U = "componentWillReceiveProps" : typeof g.UNSAFE_componentWillReceiveProps == "function" && (U = "UNSAFE_componentWillReceiveProps"), typeof g.componentWillUpdate == "function" && g.componentWillUpdate.__suppressDeprecationWarning !== !0 ? F = "componentWillUpdate" : typeof g.UNSAFE_componentWillUpdate == "function" && (F = "UNSAFE_componentWillUpdate"), N !== null || U !== null || F !== null) {
            var se = Tt(t) || "Component", Me = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            Xg.has(se) || (Xg.add(se), S(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, se, Me, N !== null ? `
  ` + N : "", U !== null ? `
  ` + U : "", F !== null ? `
  ` + F : ""));
          }
        }
      }
      return i && $0(e, u, s), g;
    }
    function Gw(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (S("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", Ie(e) || "Component"), rS.enqueueReplaceState(t, t.state, null));
    }
    function rC(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = Ie(e) || "Component";
          Gg.has(s) || (Gg.add(s), S("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        rS.enqueueReplaceState(t, t.state, null);
      }
    }
    function aS(e, t, a, i) {
      Ww(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, pg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = tr(s);
      else {
        var f = Rf(e, t, !0);
        u.context = Tf(e, f);
      }
      {
        if (u.state === a) {
          var p = Tt(t) || "Component";
          Zg.has(p) || (Zg.add(p), S("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & Gt && rl.recordLegacyContextWarning(e, u), rl.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (nS(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (Gw(e, u), Zh(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var y = St;
        y |= Qi, (e.mode & Nt) !== Oe && (y |= bl), e.flags |= y;
      }
    }
    function Kw(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = li;
      if (typeof p == "object" && p !== null)
        v = tr(p);
      else {
        var y = Rf(e, t, !0);
        v = Tf(e, y);
      }
      var g = t.getDerivedStateFromProps, b = typeof g == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !b && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && rC(e, u, a, v), gE();
      var x = e.memoizedState, N = u.state = x;
      if (Zh(e, a, u, i), N = e.memoizedState, s === a && x === N && !zh() && !em()) {
        if (typeof u.componentDidMount == "function") {
          var U = St;
          U |= Qi, (e.mode & Nt) !== Oe && (U |= bl), e.flags |= U;
        }
        return !1;
      }
      typeof g == "function" && (nS(e, t, g, a), N = e.memoizedState);
      var F = em() || eC(e, t, s, a, x, N, v);
      if (F) {
        if (!b && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var se = St;
          se |= Qi, (e.mode & Nt) !== Oe && (se |= bl), e.flags |= se;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var Me = St;
          Me |= Qi, (e.mode & Nt) !== Oe && (Me |= bl), e.flags |= Me;
        }
        e.memoizedProps = a, e.memoizedState = N;
      }
      return u.props = a, u.state = N, u.context = v, F;
    }
    function qw(e, t, a, i, u) {
      var s = t.stateNode;
      yE(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : ll(t.type, f);
      s.props = p;
      var v = t.pendingProps, y = s.context, g = a.contextType, b = li;
      if (typeof g == "object" && g !== null)
        b = tr(g);
      else {
        var x = Rf(t, a, !0);
        b = Tf(t, x);
      }
      var N = a.getDerivedStateFromProps, U = typeof N == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !U && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || y !== b) && rC(t, s, i, b), gE();
      var F = t.memoizedState, se = s.state = F;
      if (Zh(t, i, s, u), se = t.memoizedState, f === v && F === se && !zh() && !em() && !xe)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || F !== e.memoizedState) && (t.flags |= St), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || F !== e.memoizedState) && (t.flags |= $n), !1;
      typeof N == "function" && (nS(t, a, N, i), se = t.memoizedState);
      var Me = em() || eC(t, a, p, i, F, se, b) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      xe;
      return Me ? (!U && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, se, b), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, se, b)), typeof s.componentDidUpdate == "function" && (t.flags |= St), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= $n)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || F !== e.memoizedState) && (t.flags |= St), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || F !== e.memoizedState) && (t.flags |= $n), t.memoizedProps = i, t.memoizedState = se), s.props = i, s.state = se, s.context = b, Me;
    }
    function Js(e, t) {
      return {
        value: e,
        source: t,
        stack: Vi(t),
        digest: null
      };
    }
    function iS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function Xw(e, t) {
      return !0;
    }
    function lS(e, t) {
      try {
        var a = Xw(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === de)
            return;
          console.error(i);
        }
        var p = u ? Ie(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", y;
        if (e.tag === ee)
          y = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var g = Ie(e) || "Anonymous";
          y = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + g + ".");
        }
        var b = v + `
` + f + `

` + ("" + y);
        console.error(b);
      } catch (x) {
        setTimeout(function() {
          throw x;
        });
      }
    }
    var Jw = typeof WeakMap == "function" ? WeakMap : Map;
    function aC(e, t, a) {
      var i = Hu(Xt, a);
      i.tag = fg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        Y1(u), lS(e, t);
      }, i;
    }
    function uS(e, t, a) {
      var i = Hu(Xt, a);
      i.tag = fg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          hR(e), lS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        hR(e), lS(e, t), typeof u != "function" && B1(this);
        var v = t.value, y = t.stack;
        this.componentDidCatch(v, {
          componentStack: y !== null ? y : ""
        }), typeof u != "function" && (Zr(e.lanes, Fe) || S("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", Ie(e) || "Unknown"));
      }), i;
    }
    function iC(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new Jw(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = $1.bind(null, e, t, a);
        Xr && Qp(e, a), t.then(s, s);
      }
    }
    function Zw(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function eb(e, t) {
      var a = e.tag;
      if ((e.mode & ot) === Oe && (a === fe || a === We || a === He)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function lC(e) {
      var t = e;
      do {
        if (t.tag === ke && zw(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function uC(e, t, a, i, u) {
      if ((e.mode & ot) === Oe) {
        if (e === t)
          e.flags |= Xn;
        else {
          if (e.flags |= _e, a.flags |= xc, a.flags &= -52805, a.tag === de) {
            var s = a.alternate;
            if (s === null)
              a.tag = Ht;
            else {
              var f = Hu(Xt, Fe);
              f.tag = Kh, Mo(a, f, Fe);
            }
          }
          a.lanes = Xe(a.lanes, Fe);
        }
        return e;
      }
      return e.flags |= Xn, e.lanes = u, e;
    }
    function tb(e, t, a, i, u) {
      if (a.flags |= us, Xr && Qp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        eb(a), Ar() && a.mode & ot && J0();
        var f = lC(t);
        if (f !== null) {
          f.flags &= ~Cr, uC(f, t, a, e, u), f.mode & ot && iC(e, s, u), Zw(f, e, s);
          return;
        } else {
          if (!Fv(u)) {
            iC(e, s, u), VS();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (Ar() && a.mode & ot) {
        J0();
        var v = lC(t);
        if (v !== null) {
          (v.flags & Xn) === De && (v.flags |= Cr), uC(v, t, a, e, u), Zy(Js(i, a));
          return;
        }
      }
      i = Js(i, a), z1(i);
      var y = t;
      do {
        switch (y.tag) {
          case ee: {
            var g = i;
            y.flags |= Xn;
            var b = Rs(u);
            y.lanes = Xe(y.lanes, b);
            var x = aC(y, g, b);
            vg(y, x);
            return;
          }
          case de:
            var N = i, U = y.type, F = y.stateNode;
            if ((y.flags & _e) === De && (typeof U.getDerivedStateFromError == "function" || F !== null && typeof F.componentDidCatch == "function" && !lR(F))) {
              y.flags |= Xn;
              var se = Rs(u);
              y.lanes = Xe(y.lanes, se);
              var Me = uS(y, N, se);
              vg(y, Me);
              return;
            }
            break;
        }
        y = y.return;
      } while (y !== null);
    }
    function nb() {
      return null;
    }
    var Op = A.ReactCurrentOwner, ul = !1, oS, Lp, sS, cS, fS, Zs, dS, xm, Np;
    oS = {}, Lp = {}, sS = {}, cS = {}, fS = {}, Zs = !1, dS = {}, xm = {}, Np = {};
    function ga(e, t, a, i) {
      e === null ? t.child = cE(t, null, a, i) : t.child = _f(t, e.child, a, i);
    }
    function rb(e, t, a, i) {
      t.child = _f(t, e.child, null, i), t.child = _f(t, null, a, i);
    }
    function oC(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && tl(
          s,
          i,
          // Resolved props
          "prop",
          Tt(a)
        );
      }
      var f = a.render, p = t.ref, v, y;
      Df(t, u), va(t);
      {
        if (Op.current = t, Yn(!0), v = Uf(e, t, f, i, p, u), y = Af(), t.mode & Gt) {
          yn(!0);
          try {
            v = Uf(e, t, f, i, p, u), y = Af();
          } finally {
            yn(!1);
          }
        }
        Yn(!1);
      }
      return ha(), e !== null && !ul ? (xE(e, t, u), Vu(e, t, u)) : (Ar() && y && Wy(t), t.flags |= ti, ga(e, t, v, u), t.child);
    }
    function sC(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (o_(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = Yf(s), t.tag = He, t.type = f, hS(t, s), cC(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && tl(
            p,
            i,
            // Resolved props
            "prop",
            Tt(s)
          ), a.defaultProps !== void 0) {
            var v = Tt(s) || "Unknown";
            Np[v] || (S("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), Np[v] = !0);
          }
        }
        var y = XS(a.type, null, i, t, t.mode, u);
        return y.ref = t.ref, y.return = t, t.child = y, y;
      }
      {
        var g = a.type, b = g.propTypes;
        b && tl(
          b,
          i,
          // Resolved props
          "prop",
          Tt(g)
        );
      }
      var x = e.child, N = CS(e, u);
      if (!N) {
        var U = x.memoizedProps, F = a.compare;
        if (F = F !== null ? F : Se, F(U, i) && e.ref === t.ref)
          return Vu(e, t, u);
      }
      t.flags |= ti;
      var se = ac(x, i);
      return se.ref = t.ref, se.return = t, t.child = se, se;
    }
    function cC(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === Ye) {
          var f = s, p = f._payload, v = f._init;
          try {
            s = v(p);
          } catch {
            s = null;
          }
          var y = s && s.propTypes;
          y && tl(
            y,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            Tt(s)
          );
        }
      }
      if (e !== null) {
        var g = e.memoizedProps;
        if (Se(g, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ul = !1, t.pendingProps = i = g, CS(e, u))
            (e.flags & xc) !== De && (ul = !0);
          else return t.lanes = e.lanes, Vu(e, t, u);
      }
      return pS(e, t, a, i, u);
    }
    function fC(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || ae)
        if ((t.mode & ot) === Oe) {
          var f = {
            baseLanes: I,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, jm(t, a);
        } else if (Zr(a, Jr)) {
          var b = {
            baseLanes: I,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = b;
          var x = s !== null ? s.baseLanes : a;
          jm(t, x);
        } else {
          var p = null, v;
          if (s !== null) {
            var y = s.baseLanes;
            v = Xe(y, a);
          } else
            v = a;
          t.lanes = t.childLanes = Jr;
          var g = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = g, t.updateQueue = null, jm(t, v), null;
        }
      else {
        var N;
        s !== null ? (N = Xe(s.baseLanes, a), t.memoizedState = null) : N = a, jm(t, N);
      }
      return ga(e, t, u, a), t.child;
    }
    function ab(e, t, a) {
      var i = t.pendingProps;
      return ga(e, t, i, a), t.child;
    }
    function ib(e, t, a) {
      var i = t.pendingProps.children;
      return ga(e, t, i, a), t.child;
    }
    function lb(e, t, a) {
      {
        t.flags |= St;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return ga(e, t, s, a), t.child;
    }
    function dC(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= En, t.flags |= vo);
    }
    function pS(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && tl(
          s,
          i,
          // Resolved props
          "prop",
          Tt(a)
        );
      }
      var f;
      {
        var p = Rf(t, a, !0);
        f = Tf(t, p);
      }
      var v, y;
      Df(t, u), va(t);
      {
        if (Op.current = t, Yn(!0), v = Uf(e, t, a, i, f, u), y = Af(), t.mode & Gt) {
          yn(!0);
          try {
            v = Uf(e, t, a, i, f, u), y = Af();
          } finally {
            yn(!1);
          }
        }
        Yn(!1);
      }
      return ha(), e !== null && !ul ? (xE(e, t, u), Vu(e, t, u)) : (Ar() && y && Wy(t), t.flags |= ti, ga(e, t, v, u), t.child);
    }
    function pC(e, t, a, i, u) {
      {
        switch (T_(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= _e, t.flags |= Xn;
            var y = new Error("Simulated error coming from DevTools"), g = Rs(u);
            t.lanes = Xe(t.lanes, g);
            var b = uS(t, Js(y, t), g);
            vg(t, b);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var x = a.propTypes;
          x && tl(
            x,
            i,
            // Resolved props
            "prop",
            Tt(a)
          );
        }
      }
      var N;
      Il(a) ? (N = !0, Ah(t)) : N = !1, Df(t, u);
      var U = t.stateNode, F;
      U === null ? (bm(e, t), nC(t, a, i), aS(t, a, i, u), F = !0) : e === null ? F = Kw(t, a, i, u) : F = qw(e, t, a, i, u);
      var se = vS(e, t, a, F, N, u);
      {
        var Me = t.stateNode;
        F && Me.props !== i && (Zs || S("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", Ie(t) || "a component"), Zs = !0);
      }
      return se;
    }
    function vS(e, t, a, i, u, s) {
      dC(e, t);
      var f = (t.flags & _e) !== De;
      if (!i && !f)
        return u && G0(t, a, !1), Vu(e, t, s);
      var p = t.stateNode;
      Op.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, XE();
      else {
        va(t);
        {
          if (Yn(!0), v = p.render(), t.mode & Gt) {
            yn(!0);
            try {
              p.render();
            } finally {
              yn(!1);
            }
          }
          Yn(!1);
        }
        ha();
      }
      return t.flags |= ti, e !== null && f ? rb(e, t, v, s) : ga(e, t, v, s), t.memoizedState = p.state, u && G0(t, a, !0), t.child;
    }
    function vC(e) {
      var t = e.stateNode;
      t.pendingContext ? Q0(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Q0(e, t.context, !1), hg(e, t.containerInfo);
    }
    function ub(e, t, a) {
      if (vC(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, s = u.element;
      yE(e, t), Zh(t, i, null, a);
      var f = t.memoizedState;
      t.stateNode;
      var p = f.element;
      if (u.isDehydrated) {
        var v = {
          element: p,
          isDehydrated: !1,
          cache: f.cache,
          pendingSuspenseBoundaries: f.pendingSuspenseBoundaries,
          transitions: f.transitions
        }, y = t.updateQueue;
        if (y.baseState = v, t.memoizedState = v, t.flags & Cr) {
          var g = Js(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return hC(e, t, p, a, g);
        } else if (p !== s) {
          var b = Js(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return hC(e, t, p, a, b);
        } else {
          cw(t);
          var x = cE(t, null, p, a);
          t.child = x;
          for (var N = x; N; )
            N.flags = N.flags & ~mn | Gr, N = N.sibling;
        }
      } else {
        if (bf(), p === s)
          return Vu(e, t, a);
        ga(e, t, p, a);
      }
      return t.child;
    }
    function hC(e, t, a, i, u) {
      return bf(), Zy(u), t.flags |= Cr, ga(e, t, a, i), t.child;
    }
    function ob(e, t, a) {
      CE(t), e === null && Jy(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = My(i, u);
      return p ? f = null : s !== null && My(i, s) && (t.flags |= Da), dC(e, t), ga(e, t, f, a), t.child;
    }
    function sb(e, t) {
      return e === null && Jy(t), null;
    }
    function cb(e, t, a, i) {
      bm(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var y = t.tag = s_(v), g = ll(v, u), b;
      switch (y) {
        case fe:
          return hS(t, v), t.type = v = Yf(v), b = pS(null, t, v, g, i), b;
        case de:
          return t.type = v = $S(v), b = pC(null, t, v, g, i), b;
        case We:
          return t.type = v = QS(v), b = oC(null, t, v, g, i), b;
        case ct: {
          if (t.type !== t.elementType) {
            var x = v.propTypes;
            x && tl(
              x,
              g,
              // Resolved for outer only
              "prop",
              Tt(v)
            );
          }
          return b = sC(
            null,
            t,
            v,
            ll(v.type, g),
            // The inner type can have defaults too
            i
          ), b;
        }
      }
      var N = "";
      throw v !== null && typeof v == "object" && v.$$typeof === Ye && (N = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + N));
    }
    function fb(e, t, a, i, u) {
      bm(e, t), t.tag = de;
      var s;
      return Il(a) ? (s = !0, Ah(t)) : s = !1, Df(t, u), nC(t, a, i), aS(t, a, i, u), vS(null, t, a, !0, s, u);
    }
    function db(e, t, a, i) {
      bm(e, t);
      var u = t.pendingProps, s;
      {
        var f = Rf(t, a, !1);
        s = Tf(t, f);
      }
      Df(t, i);
      var p, v;
      va(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var y = Tt(a) || "Unknown";
          oS[y] || (S("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", y, y), oS[y] = !0);
        }
        t.mode & Gt && rl.recordLegacyContextWarning(t, null), Yn(!0), Op.current = t, p = Uf(null, t, a, u, s, i), v = Af(), Yn(!1);
      }
      if (ha(), t.flags |= ti, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var g = Tt(a) || "Unknown";
        Lp[g] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", g, g, g), Lp[g] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var b = Tt(a) || "Unknown";
          Lp[b] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", b, b, b), Lp[b] = !0);
        }
        t.tag = de, t.memoizedState = null, t.updateQueue = null;
        var x = !1;
        return Il(a) ? (x = !0, Ah(t)) : x = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, pg(t), tC(t, p), aS(t, a, u, i), vS(null, t, a, !0, x, i);
      } else {
        if (t.tag = fe, t.mode & Gt) {
          yn(!0);
          try {
            p = Uf(null, t, a, u, s, i), v = Af();
          } finally {
            yn(!1);
          }
        }
        return Ar() && v && Wy(t), ga(null, t, p, i), hS(t, a), t.child;
      }
    }
    function hS(e, t) {
      {
        if (t && t.childContextTypes && S("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Dr();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), fS[u] || (fS[u] = !0, S("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = Tt(t) || "Unknown";
          Np[f] || (S("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), Np[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = Tt(t) || "Unknown";
          cS[p] || (S("%s: Function components do not support getDerivedStateFromProps.", p), cS[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = Tt(t) || "Unknown";
          sS[v] || (S("%s: Function components do not support contextType.", v), sS[v] = !0);
        }
      }
    }
    var mS = {
      dehydrated: null,
      treeContext: null,
      retryLane: kt
    };
    function yS(e) {
      return {
        baseLanes: e,
        cachePool: nb(),
        transitions: null
      };
    }
    function pb(e, t) {
      var a = null;
      return {
        baseLanes: Xe(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function vb(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return gg(e, Cp);
    }
    function hb(e, t) {
      return Ts(e.childLanes, t);
    }
    function mC(e, t, a) {
      var i = t.pendingProps;
      x_(t) && (t.flags |= _e);
      var u = al.current, s = !1, f = (t.flags & _e) !== De;
      if (f || vb(u, e) ? (s = !0, t.flags &= ~_e) : (e === null || e.memoizedState !== null) && (u = Mw(u, TE)), u = Lf(u), Uo(t, u), e === null) {
        Jy(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return Eb(t, v);
        }
        var y = i.children, g = i.fallback;
        if (s) {
          var b = mb(t, y, g, a), x = t.child;
          return x.memoizedState = yS(a), t.memoizedState = mS, b;
        } else
          return gS(t, y);
      } else {
        var N = e.memoizedState;
        if (N !== null) {
          var U = N.dehydrated;
          if (U !== null)
            return Cb(e, t, f, i, U, N, a);
        }
        if (s) {
          var F = i.fallback, se = i.children, Me = gb(e, t, se, F, a), be = t.child, Rt = e.child.memoizedState;
          return be.memoizedState = Rt === null ? yS(a) : pb(Rt, a), be.childLanes = hb(e, a), t.memoizedState = mS, Me;
        } else {
          var ht = i.children, D = yb(e, t, ht, a);
          return t.memoizedState = null, D;
        }
      }
    }
    function gS(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = SS(u, i);
      return s.return = e, e.child = s, s;
    }
    function mb(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & ot) === Oe && s !== null ? (p = s, p.childLanes = I, p.pendingProps = f, e.mode & Lt && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Io(a, u, i, null)) : (p = SS(f, u), v = Io(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function SS(e, t, a) {
      return yR(e, t, I, null);
    }
    function yC(e, t) {
      return ac(e, t);
    }
    function yb(e, t, a, i) {
      var u = e.child, s = u.sibling, f = yC(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & ot) === Oe && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= ka) : p.push(s);
      }
      return t.child = f, f;
    }
    function gb(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, y;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & ot) === Oe && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var g = t.child;
        y = g, y.childLanes = I, y.pendingProps = v, t.mode & Lt && (y.actualDuration = 0, y.actualStartTime = -1, y.selfBaseDuration = f.selfBaseDuration, y.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        y = yC(f, v), y.subtreeFlags = f.subtreeFlags & zn;
      var b;
      return p !== null ? b = ac(p, i) : (b = Io(i, s, u, null), b.flags |= mn), b.return = t, y.return = t, y.sibling = b, t.child = y, b;
    }
    function wm(e, t, a, i) {
      i !== null && Zy(i), _f(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = gS(t, s);
      return f.flags |= mn, t.memoizedState = null, f;
    }
    function Sb(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = SS(f, s), v = Io(i, s, u, null);
      return v.flags |= mn, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & ot) !== Oe && _f(t, e.child, null, u), v;
    }
    function Eb(e, t, a) {
      return (e.mode & ot) === Oe ? (S("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = Fe) : jy(t) ? e.lanes = Rr : e.lanes = Jr, null;
    }
    function Cb(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & Cr) {
          t.flags &= ~Cr;
          var D = iS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return wm(e, t, f, D);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= _e, null;
          var H = i.children, O = i.fallback, G = Sb(e, t, H, O, f), he = t.child;
          return he.memoizedState = yS(f), t.memoizedState = mS, G;
        }
      else {
        if (ow(), (t.mode & ot) === Oe)
          return wm(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (jy(u)) {
          var p, v, y;
          {
            var g = wx(u);
            p = g.digest, v = g.message, y = g.stack;
          }
          var b;
          v ? b = new Error(v) : b = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var x = iS(b, p, y);
          return wm(e, t, f, x);
        }
        var N = Zr(f, e.childLanes);
        if (ul || N) {
          var U = Am();
          if (U !== null) {
            var F = Ud(U, f);
            if (F !== kt && F !== s.retryLane) {
              s.retryLane = F;
              var se = Xt;
              Fa(e, F), yr(U, e, F, se);
            }
          }
          VS();
          var Me = iS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return wm(e, t, f, Me);
        } else if (V0(u)) {
          t.flags |= _e, t.child = e.child;
          var be = Q1.bind(null, e);
          return bx(u, be), null;
        } else {
          fw(t, u, s.treeContext);
          var Rt = i.children, ht = gS(t, Rt);
          return ht.flags |= Gr, ht;
        }
      }
    }
    function gC(e, t, a) {
      e.lanes = Xe(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = Xe(i.lanes, t)), sg(e.return, t, a);
    }
    function Rb(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === ke) {
          var u = i.memoizedState;
          u !== null && gC(i, a, e);
        } else if (i.tag === un)
          gC(i, a, e);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
    }
    function Tb(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && rm(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function xb(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !dS[e])
        if (dS[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              S('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              S('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              S('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          S('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function wb(e, t) {
      e !== void 0 && !xm[e] && (e !== "collapsed" && e !== "hidden" ? (xm[e] = !0, S('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (xm[e] = !0, S('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function SC(e, t) {
      {
        var a = at(e), i = !a && typeof qe(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return S("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function bb(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (at(e)) {
          for (var a = 0; a < e.length; a++)
            if (!SC(e[a], a))
              return;
        } else {
          var i = qe(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!SC(s.value, f))
                  return;
                f++;
              }
          } else
            S('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function ES(e, t, a, i, u) {
      var s = e.memoizedState;
      s === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: u
      } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = i, s.tail = a, s.tailMode = u);
    }
    function EC(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      xb(u), wb(s, u), bb(f, u), ga(e, t, f, a);
      var p = al.current, v = gg(p, Cp);
      if (v)
        p = Sg(p, Cp), t.flags |= _e;
      else {
        var y = e !== null && (e.flags & _e) !== De;
        y && Rb(t, t.child, a), p = Lf(p);
      }
      if (Uo(t, p), (t.mode & ot) === Oe)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var g = Tb(t.child), b;
            g === null ? (b = t.child, t.child = null) : (b = g.sibling, g.sibling = null), ES(
              t,
              !1,
              // isBackwards
              b,
              g,
              s
            );
            break;
          }
          case "backwards": {
            var x = null, N = t.child;
            for (t.child = null; N !== null; ) {
              var U = N.alternate;
              if (U !== null && rm(U) === null) {
                t.child = N;
                break;
              }
              var F = N.sibling;
              N.sibling = x, x = N, N = F;
            }
            ES(
              t,
              !0,
              // isBackwards
              x,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            ES(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function _b(e, t, a) {
      hg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = _f(t, null, i, a) : ga(e, t, i, a), t.child;
    }
    var CC = !1;
    function kb(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || CC || (CC = !0, S("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && tl(v, s, "prop", "Context.Provider");
      }
      if (pE(t, u, p), f !== null) {
        var y = f.value;
        if (Q(y, p)) {
          if (f.children === s.children && !zh())
            return Vu(e, t, a);
        } else
          xw(t, u, a);
      }
      var g = s.children;
      return ga(e, t, g, a), t.child;
    }
    var RC = !1;
    function Db(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (RC || (RC = !0, S("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && S("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Df(t, a);
      var f = tr(i);
      va(t);
      var p;
      return Op.current = t, Yn(!0), p = s(f), Yn(!1), ha(), t.flags |= ti, ga(e, t, p, a), t.child;
    }
    function Mp() {
      ul = !0;
    }
    function bm(e, t) {
      (t.mode & ot) === Oe && e !== null && (e.alternate = null, t.alternate = null, t.flags |= mn);
    }
    function Vu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), XE(), $p(t.lanes), Zr(a, t.childLanes) ? (Rw(e, t), t.child) : null;
    }
    function Ob(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var u = i.child;
          if (u === null)
            throw new Error("Expected parent to have a child.");
          for (; u.sibling !== t; )
            if (u = u.sibling, u === null)
              throw new Error("Expected to find the previous sibling.");
          u.sibling = a;
        }
        var s = i.deletions;
        return s === null ? (i.deletions = [e], i.flags |= ka) : s.push(e), a.flags |= mn, a;
      }
    }
    function CS(e, t) {
      var a = e.lanes;
      return !!Zr(a, t);
    }
    function Lb(e, t, a) {
      switch (t.tag) {
        case ee:
          vC(t), t.stateNode, bf();
          break;
        case X:
          CE(t);
          break;
        case de: {
          var i = t.type;
          Il(i) && Ah(t);
          break;
        }
        case K:
          hg(t, t.stateNode.containerInfo);
          break;
        case pt: {
          var u = t.memoizedProps.value, s = t.type._context;
          pE(t, s, u);
          break;
        }
        case vt:
          {
            var f = Zr(a, t.childLanes);
            f && (t.flags |= St);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case ke: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Uo(t, Lf(al.current)), t.flags |= _e, null;
            var y = t.child, g = y.childLanes;
            if (Zr(a, g))
              return mC(e, t, a);
            Uo(t, Lf(al.current));
            var b = Vu(e, t, a);
            return b !== null ? b.sibling : null;
          } else
            Uo(t, Lf(al.current));
          break;
        }
        case un: {
          var x = (e.flags & _e) !== De, N = Zr(a, t.childLanes);
          if (x) {
            if (N)
              return EC(e, t, a);
            t.flags |= _e;
          }
          var U = t.memoizedState;
          if (U !== null && (U.rendering = null, U.tail = null, U.lastEffect = null), Uo(t, al.current), N)
            break;
          return null;
        }
        case Le:
        case At:
          return t.lanes = I, fC(e, t, a);
      }
      return Vu(e, t, a);
    }
    function TC(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return Ob(e, t, XS(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || zh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ul = !0;
        else {
          var s = CS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & _e) === De)
            return ul = !1, Lb(e, t, a);
          (e.flags & xc) !== De ? ul = !0 : ul = !1;
        }
      } else if (ul = !1, Ar() && nw(t)) {
        var f = t.index, p = rw();
        X0(t, p, f);
      }
      switch (t.lanes = I, t.tag) {
        case et:
          return db(e, t, t.type, a);
        case ln: {
          var v = t.elementType;
          return cb(e, t, v, a);
        }
        case fe: {
          var y = t.type, g = t.pendingProps, b = t.elementType === y ? g : ll(y, g);
          return pS(e, t, y, b, a);
        }
        case de: {
          var x = t.type, N = t.pendingProps, U = t.elementType === x ? N : ll(x, N);
          return pC(e, t, x, U, a);
        }
        case ee:
          return ub(e, t, a);
        case X:
          return ob(e, t, a);
        case le:
          return sb(e, t);
        case ke:
          return mC(e, t, a);
        case K:
          return _b(e, t, a);
        case We: {
          var F = t.type, se = t.pendingProps, Me = t.elementType === F ? se : ll(F, se);
          return oC(e, t, F, Me, a);
        }
        case Qe:
          return ab(e, t, a);
        case st:
          return ib(e, t, a);
        case vt:
          return lb(e, t, a);
        case pt:
          return kb(e, t, a);
        case Jt:
          return Db(e, t, a);
        case ct: {
          var be = t.type, Rt = t.pendingProps, ht = ll(be, Rt);
          if (t.type !== t.elementType) {
            var D = be.propTypes;
            D && tl(
              D,
              ht,
              // Resolved for outer only
              "prop",
              Tt(be)
            );
          }
          return ht = ll(be.type, ht), sC(e, t, be, ht, a);
        }
        case He:
          return cC(e, t, t.type, t.pendingProps, a);
        case Ht: {
          var H = t.type, O = t.pendingProps, G = t.elementType === H ? O : ll(H, O);
          return fb(e, t, H, G, a);
        }
        case un:
          return EC(e, t, a);
        case bt:
          break;
        case Le:
          return fC(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function jf(e) {
      e.flags |= St;
    }
    function xC(e) {
      e.flags |= En, e.flags |= vo;
    }
    var wC, RS, bC, _C;
    wC = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === X || u.tag === le)
          ZT(e, u.stateNode);
        else if (u.tag !== K) {
          if (u.child !== null) {
            u.child.return = u, u = u.child;
            continue;
          }
        }
        if (u === t)
          return;
        for (; u.sibling === null; ) {
          if (u.return === null || u.return === t)
            return;
          u = u.return;
        }
        u.sibling.return = u.return, u = u.sibling;
      }
    }, RS = function(e, t) {
    }, bC = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = mg(), v = tx(f, a, s, i, u, p);
        t.updateQueue = v, v && jf(t);
      }
    }, _C = function(e, t, a, i) {
      a !== i && jf(t);
    };
    function zp(e, t) {
      if (!Ar())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var u = e.tail, s = null; u !== null; )
              u.alternate !== null && (s = u), u = u.sibling;
            s === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : s.sibling = null;
            break;
          }
        }
    }
    function Fr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = I, i = De;
      if (t) {
        if ((e.mode & Lt) !== Oe) {
          for (var v = e.selfBaseDuration, y = e.child; y !== null; )
            a = Xe(a, Xe(y.lanes, y.childLanes)), i |= y.subtreeFlags & zn, i |= y.flags & zn, v += y.treeBaseDuration, y = y.sibling;
          e.treeBaseDuration = v;
        } else
          for (var g = e.child; g !== null; )
            a = Xe(a, Xe(g.lanes, g.childLanes)), i |= g.subtreeFlags & zn, i |= g.flags & zn, g.return = e, g = g.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Lt) !== Oe) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = Xe(a, Xe(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = Xe(a, Xe(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function Nb(e, t, a) {
      if (mw() && (t.mode & ot) !== Oe && (t.flags & _e) === De)
        return aE(t), bf(), t.flags |= Cr | us | Xn, !1;
      var i = Ph(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (vw(t), Fr(t), (t.mode & Lt) !== Oe) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (bf(), (t.flags & _e) === De && (t.memoizedState = null), t.flags |= St, Fr(t), (t.mode & Lt) !== Oe) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return iE(), !0;
    }
    function kC(e, t, a) {
      var i = t.pendingProps;
      switch (Gy(t), t.tag) {
        case et:
        case ln:
        case He:
        case fe:
        case We:
        case Qe:
        case st:
        case vt:
        case Jt:
        case ct:
          return Fr(t), null;
        case de: {
          var u = t.type;
          return Il(u) && Uh(t), Fr(t), null;
        }
        case ee: {
          var s = t.stateNode;
          if (Of(t), Yy(t), Cg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Ph(t);
            if (f)
              jf(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Cr) !== De) && (t.flags |= $n, iE());
            }
          }
          return RS(e, t), Fr(t), null;
        }
        case X: {
          yg(t);
          var v = EE(), y = t.type;
          if (e !== null && t.stateNode != null)
            bC(e, t, y, i, v), e.ref !== t.ref && xC(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Fr(t), null;
            }
            var g = mg(), b = Ph(t);
            if (b)
              dw(t, v, g) && jf(t);
            else {
              var x = JT(y, i, v, g, t);
              wC(x, t, !1, !1), t.stateNode = x, ex(x, y, i, v) && jf(t);
            }
            t.ref !== null && xC(t);
          }
          return Fr(t), null;
        }
        case le: {
          var N = i;
          if (e && t.stateNode != null) {
            var U = e.memoizedProps;
            _C(e, t, U, N);
          } else {
            if (typeof N != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var F = EE(), se = mg(), Me = Ph(t);
            Me ? pw(t) && jf(t) : t.stateNode = nx(N, F, se, t);
          }
          return Fr(t), null;
        }
        case ke: {
          Nf(t);
          var be = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Rt = Nb(e, t, be);
            if (!Rt)
              return t.flags & Xn ? t : null;
          }
          if ((t.flags & _e) !== De)
            return t.lanes = a, (t.mode & Lt) !== Oe && Qg(t), t;
          var ht = be !== null, D = e !== null && e.memoizedState !== null;
          if (ht !== D && ht) {
            var H = t.child;
            if (H.flags |= Mn, (t.mode & ot) !== Oe) {
              var O = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              O || gg(al.current, TE) ? M1() : VS();
            }
          }
          var G = t.updateQueue;
          if (G !== null && (t.flags |= St), Fr(t), (t.mode & Lt) !== Oe && ht) {
            var he = t.child;
            he !== null && (t.treeBaseDuration -= he.treeBaseDuration);
          }
          return null;
        }
        case K:
          return Of(t), RS(e, t), e === null && Kx(t.stateNode.containerInfo), Fr(t), null;
        case pt:
          var ce = t.type._context;
          return og(ce, t), Fr(t), null;
        case Ht: {
          var Pe = t.type;
          return Il(Pe) && Uh(t), Fr(t), null;
        }
        case un: {
          Nf(t);
          var Ge = t.memoizedState;
          if (Ge === null)
            return Fr(t), null;
          var qt = (t.flags & _e) !== De, zt = Ge.rendering;
          if (zt === null)
            if (qt)
              zp(Ge, !1);
            else {
              var Gn = U1() && (e === null || (e.flags & _e) === De);
              if (!Gn)
                for (var Ut = t.child; Ut !== null; ) {
                  var Vn = rm(Ut);
                  if (Vn !== null) {
                    qt = !0, t.flags |= _e, zp(Ge, !1);
                    var la = Vn.updateQueue;
                    return la !== null && (t.updateQueue = la, t.flags |= St), t.subtreeFlags = De, Tw(t, a), Uo(t, Sg(al.current, Cp)), t.child;
                  }
                  Ut = Ut.sibling;
                }
              Ge.tail !== null && Qn() > KC() && (t.flags |= _e, qt = !0, zp(Ge, !1), t.lanes = bd);
            }
          else {
            if (!qt) {
              var Ir = rm(zt);
              if (Ir !== null) {
                t.flags |= _e, qt = !0;
                var oi = Ir.updateQueue;
                if (oi !== null && (t.updateQueue = oi, t.flags |= St), zp(Ge, !0), Ge.tail === null && Ge.tailMode === "hidden" && !zt.alternate && !Ar())
                  return Fr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Qn() * 2 - Ge.renderingStartTime > KC() && a !== Jr && (t.flags |= _e, qt = !0, zp(Ge, !1), t.lanes = bd);
            }
            if (Ge.isBackwards)
              zt.sibling = t.child, t.child = zt;
            else {
              var Ca = Ge.last;
              Ca !== null ? Ca.sibling = zt : t.child = zt, Ge.last = zt;
            }
          }
          if (Ge.tail !== null) {
            var Ra = Ge.tail;
            Ge.rendering = Ra, Ge.tail = Ra.sibling, Ge.renderingStartTime = Qn(), Ra.sibling = null;
            var ua = al.current;
            return qt ? ua = Sg(ua, Cp) : ua = Lf(ua), Uo(t, ua), Ra;
          }
          return Fr(t), null;
        }
        case bt:
          break;
        case Le:
        case At: {
          HS(t);
          var $u = t.memoizedState, $f = $u !== null;
          if (e !== null) {
            var qp = e.memoizedState, Xl = qp !== null;
            Xl !== $f && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !ae && (t.flags |= Mn);
          }
          return !$f || (t.mode & ot) === Oe ? Fr(t) : Zr(ql, Jr) && (Fr(t), t.subtreeFlags & (mn | St) && (t.flags |= Mn)), null;
        }
        case _t:
          return null;
        case Dt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Mb(e, t, a) {
      switch (Gy(t), t.tag) {
        case de: {
          var i = t.type;
          Il(i) && Uh(t);
          var u = t.flags;
          return u & Xn ? (t.flags = u & ~Xn | _e, (t.mode & Lt) !== Oe && Qg(t), t) : null;
        }
        case ee: {
          t.stateNode, Of(t), Yy(t), Cg();
          var s = t.flags;
          return (s & Xn) !== De && (s & _e) === De ? (t.flags = s & ~Xn | _e, t) : null;
        }
        case X:
          return yg(t), null;
        case ke: {
          Nf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            bf();
          }
          var p = t.flags;
          return p & Xn ? (t.flags = p & ~Xn | _e, (t.mode & Lt) !== Oe && Qg(t), t) : null;
        }
        case un:
          return Nf(t), null;
        case K:
          return Of(t), null;
        case pt:
          var v = t.type._context;
          return og(v, t), null;
        case Le:
        case At:
          return HS(t), null;
        case _t:
          return null;
        default:
          return null;
      }
    }
    function DC(e, t, a) {
      switch (Gy(t), t.tag) {
        case de: {
          var i = t.type.childContextTypes;
          i != null && Uh(t);
          break;
        }
        case ee: {
          t.stateNode, Of(t), Yy(t), Cg();
          break;
        }
        case X: {
          yg(t);
          break;
        }
        case K:
          Of(t);
          break;
        case ke:
          Nf(t);
          break;
        case un:
          Nf(t);
          break;
        case pt:
          var u = t.type._context;
          og(u, t);
          break;
        case Le:
        case At:
          HS(t);
          break;
      }
    }
    var OC = null;
    OC = /* @__PURE__ */ new Set();
    var _m = !1, Hr = !1, zb = typeof WeakSet == "function" ? WeakSet : Set, Ee = null, Ff = null, Hf = null;
    function Ub(e) {
      wl(null, function() {
        throw e;
      }), ls();
    }
    var Ab = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Lt)
        try {
          Gl(), t.componentWillUnmount();
        } finally {
          Wl(e);
        }
      else
        t.componentWillUnmount();
    };
    function LC(e, t) {
      try {
        Fo(fr, e);
      } catch (a) {
        fn(e, t, a);
      }
    }
    function TS(e, t, a) {
      try {
        Ab(e, a);
      } catch (i) {
        fn(e, t, i);
      }
    }
    function jb(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        fn(e, t, i);
      }
    }
    function NC(e, t) {
      try {
        zC(e);
      } catch (a) {
        fn(e, t, a);
      }
    }
    function Vf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (je && it && e.mode & Lt)
              try {
                Gl(), i = a(null);
              } finally {
                Wl(e);
              }
            else
              i = a(null);
          } catch (u) {
            fn(e, t, u);
          }
          typeof i == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Ie(e));
        } else
          a.current = null;
    }
    function km(e, t, a) {
      try {
        a();
      } catch (i) {
        fn(e, t, i);
      }
    }
    var MC = !1;
    function Fb(e, t) {
      qT(e.containerInfo), Ee = t, Hb();
      var a = MC;
      return MC = !1, a;
    }
    function Hb() {
      for (; Ee !== null; ) {
        var e = Ee, t = e.child;
        (e.subtreeFlags & _l) !== De && t !== null ? (t.return = e, Ee = t) : Vb();
      }
    }
    function Vb() {
      for (; Ee !== null; ) {
        var e = Ee;
        $t(e);
        try {
          Pb(e);
        } catch (a) {
          fn(e, e.return, a);
        }
        cn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ee = t;
          return;
        }
        Ee = e.return;
      }
    }
    function Pb(e) {
      var t = e.alternate, a = e.flags;
      if ((a & $n) !== De) {
        switch ($t(e), e.tag) {
          case fe:
          case We:
          case He:
            break;
          case de: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !Zs && (s.props !== e.memoizedProps && S("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ie(e) || "instance"), s.state !== e.memoizedState && S("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ie(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ll(e.type, i), u);
              {
                var p = OC;
                f === void 0 && !p.has(e.type) && (p.add(e.type), S("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", Ie(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case ee: {
            {
              var v = e.stateNode;
              Cx(v.containerInfo);
            }
            break;
          }
          case X:
          case le:
          case K:
          case Ht:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        cn();
      }
    }
    function ol(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var p = f.destroy;
            f.destroy = void 0, p !== void 0 && ((e & jr) !== Ha ? Ki(t) : (e & fr) !== Ha && ss(t), (e & Yl) !== Ha && Wp(!0), km(t, a, p), (e & Yl) !== Ha && Wp(!1), (e & jr) !== Ha ? Ll() : (e & fr) !== Ha && xd());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Fo(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var u = i.next, s = u;
        do {
          if ((s.tag & e) === e) {
            (e & jr) !== Ha ? Td(t) : (e & fr) !== Ha && Oc(t);
            var f = s.create;
            (e & Yl) !== Ha && Wp(!0), s.destroy = f(), (e & Yl) !== Ha && Wp(!1), (e & jr) !== Ha ? Mv() : (e & fr) !== Ha && zv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & fr) !== De ? v = "useLayoutEffect" : (s.tag & Yl) !== De ? v = "useInsertionEffect" : v = "useEffect";
                var y = void 0;
                p === null ? y = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof p.then == "function" ? y = `

It looks like you wrote ` + v + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + v + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : y = " You returned: " + p, S("%s must not return anything besides a function, which is used for clean-up.%s", v, y);
              }
            }
          }
          s = s.next;
        } while (s !== u);
      }
    }
    function Bb(e, t) {
      if ((t.flags & St) !== De)
        switch (t.tag) {
          case vt: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = KE(), p = t.alternate === null ? "mount" : "update";
            GE() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case ee:
                  var y = v.stateNode;
                  y.passiveEffectDuration += a;
                  break e;
                case vt:
                  var g = v.stateNode;
                  g.passiveEffectDuration += a;
                  break e;
              }
              v = v.return;
            }
            break;
          }
        }
    }
    function Ib(e, t, a, i) {
      if ((a.flags & Dl) !== De)
        switch (a.tag) {
          case fe:
          case We:
          case He: {
            if (!Hr)
              if (a.mode & Lt)
                try {
                  Gl(), Fo(fr | cr, a);
                } finally {
                  Wl(a);
                }
              else
                Fo(fr | cr, a);
            break;
          }
          case de: {
            var u = a.stateNode;
            if (a.flags & St && !Hr)
              if (t === null)
                if (a.type === a.elementType && !Zs && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ie(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ie(a) || "instance")), a.mode & Lt)
                  try {
                    Gl(), u.componentDidMount();
                  } finally {
                    Wl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ll(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !Zs && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ie(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ie(a) || "instance")), a.mode & Lt)
                  try {
                    Gl(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Wl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !Zs && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ie(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ie(a) || "instance")), SE(a, p, u));
            break;
          }
          case ee: {
            var v = a.updateQueue;
            if (v !== null) {
              var y = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case X:
                    y = a.child.stateNode;
                    break;
                  case de:
                    y = a.child.stateNode;
                    break;
                }
              SE(a, v, y);
            }
            break;
          }
          case X: {
            var g = a.stateNode;
            if (t === null && a.flags & St) {
              var b = a.type, x = a.memoizedProps;
              ux(g, b, x);
            }
            break;
          }
          case le:
            break;
          case K:
            break;
          case vt: {
            {
              var N = a.memoizedProps, U = N.onCommit, F = N.onRender, se = a.stateNode.effectDuration, Me = KE(), be = t === null ? "mount" : "update";
              GE() && (be = "nested-update"), typeof F == "function" && F(a.memoizedProps.id, be, a.actualDuration, a.treeBaseDuration, a.actualStartTime, Me);
              {
                typeof U == "function" && U(a.memoizedProps.id, be, se, Me), V1(a);
                var Rt = a.return;
                e: for (; Rt !== null; ) {
                  switch (Rt.tag) {
                    case ee:
                      var ht = Rt.stateNode;
                      ht.effectDuration += se;
                      break e;
                    case vt:
                      var D = Rt.stateNode;
                      D.effectDuration += se;
                      break e;
                  }
                  Rt = Rt.return;
                }
              }
            }
            break;
          }
          case ke: {
            Xb(e, a);
            break;
          }
          case un:
          case Ht:
          case bt:
          case Le:
          case At:
          case Dt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Hr || a.flags & En && zC(a);
    }
    function Yb(e) {
      switch (e.tag) {
        case fe:
        case We:
        case He: {
          if (e.mode & Lt)
            try {
              Gl(), LC(e, e.return);
            } finally {
              Wl(e);
            }
          else
            LC(e, e.return);
          break;
        }
        case de: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && jb(e, e.return, t), NC(e, e.return);
          break;
        }
        case X: {
          NC(e, e.return);
          break;
        }
      }
    }
    function $b(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === X) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? yx(u) : Sx(i.stateNode, i.memoizedProps);
            } catch (f) {
              fn(e, e.return, f);
            }
          }
        } else if (i.tag === le) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? gx(s) : Ex(s, i.memoizedProps);
            } catch (f) {
              fn(e, e.return, f);
            }
        } else if (!((i.tag === Le || i.tag === At) && i.memoizedState !== null && i !== e)) {
          if (i.child !== null) {
            i.child.return = i, i = i.child;
            continue;
          }
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          a === i && (a = null), i = i.return;
        }
        a === i && (a = null), i.sibling.return = i.return, i = i.sibling;
      }
    }
    function zC(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case X:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & Lt)
            try {
              Gl(), u = t(i);
            } finally {
              Wl(e);
            }
          else
            u = t(i);
          typeof u == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Ie(e));
        } else
          t.hasOwnProperty("current") || S("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", Ie(e)), t.current = i;
      }
    }
    function Qb(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function UC(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, UC(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === X) {
          var a = e.stateNode;
          a !== null && Jx(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function Wb(e) {
      for (var t = e.return; t !== null; ) {
        if (AC(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function AC(e) {
      return e.tag === X || e.tag === ee || e.tag === K;
    }
    function jC(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || AC(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== X && t.tag !== le && t.tag !== Zt; ) {
          if (t.flags & mn || t.child === null || t.tag === K)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & mn))
          return t.stateNode;
      }
    }
    function Gb(e) {
      var t = Wb(e);
      switch (t.tag) {
        case X: {
          var a = t.stateNode;
          t.flags & Da && (H0(a), t.flags &= ~Da);
          var i = jC(e);
          wS(e, i, a);
          break;
        }
        case ee:
        case K: {
          var u = t.stateNode.containerInfo, s = jC(e);
          xS(e, s, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function xS(e, t, a) {
      var i = e.tag, u = i === X || i === le;
      if (u) {
        var s = e.stateNode;
        t ? px(a, s, t) : fx(a, s);
      } else if (i !== K) {
        var f = e.child;
        if (f !== null) {
          xS(f, t, a);
          for (var p = f.sibling; p !== null; )
            xS(p, t, a), p = p.sibling;
        }
      }
    }
    function wS(e, t, a) {
      var i = e.tag, u = i === X || i === le;
      if (u) {
        var s = e.stateNode;
        t ? dx(a, s, t) : cx(a, s);
      } else if (i !== K) {
        var f = e.child;
        if (f !== null) {
          wS(f, t, a);
          for (var p = f.sibling; p !== null; )
            wS(p, t, a), p = p.sibling;
        }
      }
    }
    var Vr = null, sl = !1;
    function Kb(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case X: {
              Vr = i.stateNode, sl = !1;
              break e;
            }
            case ee: {
              Vr = i.stateNode.containerInfo, sl = !0;
              break e;
            }
            case K: {
              Vr = i.stateNode.containerInfo, sl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Vr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        FC(e, t, a), Vr = null, sl = !1;
      }
      Qb(a);
    }
    function Ho(e, t, a) {
      for (var i = a.child; i !== null; )
        FC(e, t, i), i = i.sibling;
    }
    function FC(e, t, a) {
      switch (Ed(a), a.tag) {
        case X:
          Hr || Vf(a, t);
        case le: {
          {
            var i = Vr, u = sl;
            Vr = null, Ho(e, t, a), Vr = i, sl = u, Vr !== null && (sl ? hx(Vr, a.stateNode) : vx(Vr, a.stateNode));
          }
          return;
        }
        case Zt: {
          Vr !== null && (sl ? mx(Vr, a.stateNode) : Ay(Vr, a.stateNode));
          return;
        }
        case K: {
          {
            var s = Vr, f = sl;
            Vr = a.stateNode.containerInfo, sl = !0, Ho(e, t, a), Vr = s, sl = f;
          }
          return;
        }
        case fe:
        case We:
        case ct:
        case He: {
          if (!Hr) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var y = v.next, g = y;
                do {
                  var b = g, x = b.destroy, N = b.tag;
                  x !== void 0 && ((N & Yl) !== Ha ? km(a, t, x) : (N & fr) !== Ha && (ss(a), a.mode & Lt ? (Gl(), km(a, t, x), Wl(a)) : km(a, t, x), xd())), g = g.next;
                } while (g !== y);
              }
            }
          }
          Ho(e, t, a);
          return;
        }
        case de: {
          if (!Hr) {
            Vf(a, t);
            var U = a.stateNode;
            typeof U.componentWillUnmount == "function" && TS(a, t, U);
          }
          Ho(e, t, a);
          return;
        }
        case bt: {
          Ho(e, t, a);
          return;
        }
        case Le: {
          if (
            // TODO: Remove this dead flag
            a.mode & ot
          ) {
            var F = Hr;
            Hr = F || a.memoizedState !== null, Ho(e, t, a), Hr = F;
          } else
            Ho(e, t, a);
          break;
        }
        default: {
          Ho(e, t, a);
          return;
        }
      }
    }
    function qb(e) {
      e.memoizedState;
    }
    function Xb(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && Ux(s);
          }
        }
      }
    }
    function HC(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new zb()), t.forEach(function(i) {
          var u = W1.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), Xr)
              if (Ff !== null && Hf !== null)
                Qp(Hf, Ff);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function Jb(e, t, a) {
      Ff = a, Hf = e, $t(t), VC(t, e), $t(t), Ff = null, Hf = null;
    }
    function cl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            Kb(e, t, s);
          } catch (v) {
            fn(s, t, v);
          }
        }
      var f = gl();
      if (t.subtreeFlags & kl)
        for (var p = t.child; p !== null; )
          $t(p), VC(p, e), p = p.sibling;
      $t(f);
    }
    function VC(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case fe:
        case We:
        case ct:
        case He: {
          if (cl(t, e), Kl(e), u & St) {
            try {
              ol(Yl | cr, e, e.return), Fo(Yl | cr, e);
            } catch (Pe) {
              fn(e, e.return, Pe);
            }
            if (e.mode & Lt) {
              try {
                Gl(), ol(fr | cr, e, e.return);
              } catch (Pe) {
                fn(e, e.return, Pe);
              }
              Wl(e);
            } else
              try {
                ol(fr | cr, e, e.return);
              } catch (Pe) {
                fn(e, e.return, Pe);
              }
          }
          return;
        }
        case de: {
          cl(t, e), Kl(e), u & En && i !== null && Vf(i, i.return);
          return;
        }
        case X: {
          cl(t, e), Kl(e), u & En && i !== null && Vf(i, i.return);
          {
            if (e.flags & Da) {
              var s = e.stateNode;
              try {
                H0(s);
              } catch (Pe) {
                fn(e, e.return, Pe);
              }
            }
            if (u & St) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, y = e.type, g = e.updateQueue;
                if (e.updateQueue = null, g !== null)
                  try {
                    ox(f, g, y, v, p, e);
                  } catch (Pe) {
                    fn(e, e.return, Pe);
                  }
              }
            }
          }
          return;
        }
        case le: {
          if (cl(t, e), Kl(e), u & St) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var b = e.stateNode, x = e.memoizedProps, N = i !== null ? i.memoizedProps : x;
            try {
              sx(b, N, x);
            } catch (Pe) {
              fn(e, e.return, Pe);
            }
          }
          return;
        }
        case ee: {
          if (cl(t, e), Kl(e), u & St && i !== null) {
            var U = i.memoizedState;
            if (U.isDehydrated)
              try {
                zx(t.containerInfo);
              } catch (Pe) {
                fn(e, e.return, Pe);
              }
          }
          return;
        }
        case K: {
          cl(t, e), Kl(e);
          return;
        }
        case ke: {
          cl(t, e), Kl(e);
          var F = e.child;
          if (F.flags & Mn) {
            var se = F.stateNode, Me = F.memoizedState, be = Me !== null;
            if (se.isHidden = be, be) {
              var Rt = F.alternate !== null && F.alternate.memoizedState !== null;
              Rt || N1();
            }
          }
          if (u & St) {
            try {
              qb(e);
            } catch (Pe) {
              fn(e, e.return, Pe);
            }
            HC(e);
          }
          return;
        }
        case Le: {
          var ht = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & ot
          ) {
            var D = Hr;
            Hr = D || ht, cl(t, e), Hr = D;
          } else
            cl(t, e);
          if (Kl(e), u & Mn) {
            var H = e.stateNode, O = e.memoizedState, G = O !== null, he = e;
            if (H.isHidden = G, G && !ht && (he.mode & ot) !== Oe) {
              Ee = he;
              for (var ce = he.child; ce !== null; )
                Ee = ce, e1(ce), ce = ce.sibling;
            }
            $b(he, G);
          }
          return;
        }
        case un: {
          cl(t, e), Kl(e), u & St && HC(e);
          return;
        }
        case bt:
          return;
        default: {
          cl(t, e), Kl(e);
          return;
        }
      }
    }
    function Kl(e) {
      var t = e.flags;
      if (t & mn) {
        try {
          Gb(e);
        } catch (a) {
          fn(e, e.return, a);
        }
        e.flags &= ~mn;
      }
      t & Gr && (e.flags &= ~Gr);
    }
    function Zb(e, t, a) {
      Ff = a, Hf = t, Ee = e, PC(e, t, a), Ff = null, Hf = null;
    }
    function PC(e, t, a) {
      for (var i = (e.mode & ot) !== Oe; Ee !== null; ) {
        var u = Ee, s = u.child;
        if (u.tag === Le && i) {
          var f = u.memoizedState !== null, p = f || _m;
          if (p) {
            bS(e, t, a);
            continue;
          } else {
            var v = u.alternate, y = v !== null && v.memoizedState !== null, g = y || Hr, b = _m, x = Hr;
            _m = p, Hr = g, Hr && !x && (Ee = u, t1(u));
            for (var N = s; N !== null; )
              Ee = N, PC(
                N,
                // New root; bubble back up to here and stop.
                t,
                a
              ), N = N.sibling;
            Ee = u, _m = b, Hr = x, bS(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Dl) !== De && s !== null ? (s.return = u, Ee = s) : bS(e, t, a);
      }
    }
    function bS(e, t, a) {
      for (; Ee !== null; ) {
        var i = Ee;
        if ((i.flags & Dl) !== De) {
          var u = i.alternate;
          $t(i);
          try {
            Ib(t, u, i, a);
          } catch (f) {
            fn(i, i.return, f);
          }
          cn();
        }
        if (i === e) {
          Ee = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, Ee = s;
          return;
        }
        Ee = i.return;
      }
    }
    function e1(e) {
      for (; Ee !== null; ) {
        var t = Ee, a = t.child;
        switch (t.tag) {
          case fe:
          case We:
          case ct:
          case He: {
            if (t.mode & Lt)
              try {
                Gl(), ol(fr, t, t.return);
              } finally {
                Wl(t);
              }
            else
              ol(fr, t, t.return);
            break;
          }
          case de: {
            Vf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && TS(t, t.return, i);
            break;
          }
          case X: {
            Vf(t, t.return);
            break;
          }
          case Le: {
            var u = t.memoizedState !== null;
            if (u) {
              BC(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Ee = a) : BC(e);
      }
    }
    function BC(e) {
      for (; Ee !== null; ) {
        var t = Ee;
        if (t === e) {
          Ee = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ee = a;
          return;
        }
        Ee = t.return;
      }
    }
    function t1(e) {
      for (; Ee !== null; ) {
        var t = Ee, a = t.child;
        if (t.tag === Le) {
          var i = t.memoizedState !== null;
          if (i) {
            IC(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Ee = a) : IC(e);
      }
    }
    function IC(e) {
      for (; Ee !== null; ) {
        var t = Ee;
        $t(t);
        try {
          Yb(t);
        } catch (i) {
          fn(t, t.return, i);
        }
        if (cn(), t === e) {
          Ee = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ee = a;
          return;
        }
        Ee = t.return;
      }
    }
    function n1(e, t, a, i) {
      Ee = t, r1(t, e, a, i);
    }
    function r1(e, t, a, i) {
      for (; Ee !== null; ) {
        var u = Ee, s = u.child;
        (u.subtreeFlags & Wi) !== De && s !== null ? (s.return = u, Ee = s) : a1(e, t, a, i);
      }
    }
    function a1(e, t, a, i) {
      for (; Ee !== null; ) {
        var u = Ee;
        if ((u.flags & Wr) !== De) {
          $t(u);
          try {
            i1(t, u, a, i);
          } catch (f) {
            fn(u, u.return, f);
          }
          cn();
        }
        if (u === e) {
          Ee = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, Ee = s;
          return;
        }
        Ee = u.return;
      }
    }
    function i1(e, t, a, i) {
      switch (t.tag) {
        case fe:
        case We:
        case He: {
          if (t.mode & Lt) {
            $g();
            try {
              Fo(jr | cr, t);
            } finally {
              Yg(t);
            }
          } else
            Fo(jr | cr, t);
          break;
        }
      }
    }
    function l1(e) {
      Ee = e, u1();
    }
    function u1() {
      for (; Ee !== null; ) {
        var e = Ee, t = e.child;
        if ((Ee.flags & ka) !== De) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              Ee = u, c1(u, e);
            }
            {
              var s = e.alternate;
              if (s !== null) {
                var f = s.child;
                if (f !== null) {
                  s.child = null;
                  do {
                    var p = f.sibling;
                    f.sibling = null, f = p;
                  } while (f !== null);
                }
              }
            }
            Ee = e;
          }
        }
        (e.subtreeFlags & Wi) !== De && t !== null ? (t.return = e, Ee = t) : o1();
      }
    }
    function o1() {
      for (; Ee !== null; ) {
        var e = Ee;
        (e.flags & Wr) !== De && ($t(e), s1(e), cn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ee = t;
          return;
        }
        Ee = e.return;
      }
    }
    function s1(e) {
      switch (e.tag) {
        case fe:
        case We:
        case He: {
          e.mode & Lt ? ($g(), ol(jr | cr, e, e.return), Yg(e)) : ol(jr | cr, e, e.return);
          break;
        }
      }
    }
    function c1(e, t) {
      for (; Ee !== null; ) {
        var a = Ee;
        $t(a), d1(a, t), cn();
        var i = a.child;
        i !== null ? (i.return = a, Ee = i) : f1(e);
      }
    }
    function f1(e) {
      for (; Ee !== null; ) {
        var t = Ee, a = t.sibling, i = t.return;
        if (UC(t), t === e) {
          Ee = null;
          return;
        }
        if (a !== null) {
          a.return = i, Ee = a;
          return;
        }
        Ee = i;
      }
    }
    function d1(e, t) {
      switch (e.tag) {
        case fe:
        case We:
        case He: {
          e.mode & Lt ? ($g(), ol(jr, e, t), Yg(e)) : ol(jr, e, t);
          break;
        }
      }
    }
    function p1(e) {
      switch (e.tag) {
        case fe:
        case We:
        case He: {
          try {
            Fo(fr | cr, e);
          } catch (a) {
            fn(e, e.return, a);
          }
          break;
        }
        case de: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            fn(e, e.return, a);
          }
          break;
        }
      }
    }
    function v1(e) {
      switch (e.tag) {
        case fe:
        case We:
        case He: {
          try {
            Fo(jr | cr, e);
          } catch (t) {
            fn(e, e.return, t);
          }
          break;
        }
      }
    }
    function h1(e) {
      switch (e.tag) {
        case fe:
        case We:
        case He: {
          try {
            ol(fr | cr, e, e.return);
          } catch (a) {
            fn(e, e.return, a);
          }
          break;
        }
        case de: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && TS(e, e.return, t);
          break;
        }
      }
    }
    function m1(e) {
      switch (e.tag) {
        case fe:
        case We:
        case He:
          try {
            ol(jr | cr, e, e.return);
          } catch (t) {
            fn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Up = Symbol.for;
      Up("selector.component"), Up("selector.has_pseudo_class"), Up("selector.role"), Up("selector.test_id"), Up("selector.text");
    }
    var y1 = [];
    function g1() {
      y1.forEach(function(e) {
        return e();
      });
    }
    var S1 = A.ReactCurrentActQueue;
    function E1(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function YC() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && S1.current !== null && S("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var C1 = Math.ceil, _S = A.ReactCurrentDispatcher, kS = A.ReactCurrentOwner, Pr = A.ReactCurrentBatchConfig, fl = A.ReactCurrentActQueue, vr = (
      /*             */
      0
    ), $C = (
      /*               */
      1
    ), Br = (
      /*                */
      2
    ), Ai = (
      /*                */
      4
    ), Pu = 0, Ap = 1, ec = 2, Dm = 3, jp = 4, QC = 5, DS = 6, Ct = vr, Sa = null, Dn = null, hr = I, ql = I, OS = Do(I), mr = Pu, Fp = null, Om = I, Hp = I, Lm = I, Vp = null, Va = null, LS = 0, WC = 500, GC = 1 / 0, R1 = 500, Bu = null;
    function Pp() {
      GC = Qn() + R1;
    }
    function KC() {
      return GC;
    }
    var Nm = !1, NS = null, Pf = null, tc = !1, Vo = null, Bp = I, MS = [], zS = null, T1 = 50, Ip = 0, US = null, AS = !1, Mm = !1, x1 = 50, Bf = 0, zm = null, Yp = Xt, Um = I, qC = !1;
    function Am() {
      return Sa;
    }
    function Ea() {
      return (Ct & (Br | Ai)) !== vr ? Qn() : (Yp !== Xt || (Yp = Qn()), Yp);
    }
    function Po(e) {
      var t = e.mode;
      if ((t & ot) === Oe)
        return Fe;
      if ((Ct & Br) !== vr && hr !== I)
        return Rs(hr);
      var a = Sw() !== gw;
      if (a) {
        if (Pr.transition !== null) {
          var i = Pr.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Um === kt && (Um = Nd()), Um;
      }
      var u = Ua();
      if (u !== kt)
        return u;
      var s = rx();
      return s;
    }
    function w1(e) {
      var t = e.mode;
      return (t & ot) === Oe ? Fe : Vv();
    }
    function yr(e, t, a, i) {
      K1(), qC && S("useInsertionEffect must not schedule updates."), AS && (Mm = !0), go(e, a, i), (Ct & Br) !== I && e === Sa ? J1(t) : (Xr && ws(e, t, a), Z1(t), e === Sa && ((Ct & Br) === vr && (Hp = Xe(Hp, a)), mr === jp && Bo(e, hr)), Pa(e, i), a === Fe && Ct === vr && (t.mode & ot) === Oe && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !fl.isBatchingLegacy && (Pp(), q0()));
    }
    function b1(e, t, a) {
      var i = e.current;
      i.lanes = t, go(e, t, a), Pa(e, a);
    }
    function _1(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Ct & Br) !== vr
      );
    }
    function Pa(e, t) {
      var a = e.callbackNode;
      qc(e, t);
      var i = Kc(e, e === Sa ? hr : I);
      if (i === I) {
        a !== null && dR(a), e.callbackNode = null, e.callbackPriority = kt;
        return;
      }
      var u = zl(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(fl.current !== null && a !== IS)) {
        a == null && s !== Fe && S("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && dR(a);
      var f;
      if (u === Fe)
        e.tag === Oo ? (fl.isBatchingLegacy !== null && (fl.didScheduleLegacyUpdate = !0), tw(ZC.bind(null, e))) : K0(ZC.bind(null, e)), fl.current !== null ? fl.current.push(Lo) : ix(function() {
          (Ct & (Br | Ai)) === vr && Lo();
        }), f = null;
      else {
        var p;
        switch (Wv(i)) {
          case Lr:
            p = os;
            break;
          case bi:
            p = Ol;
            break;
          case Ma:
            p = Gi;
            break;
          case za:
            p = hu;
            break;
          default:
            p = Gi;
            break;
        }
        f = YS(p, XC.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function XC(e, t) {
      if ($w(), Yp = Xt, Um = I, (Ct & (Br | Ai)) !== vr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = Yu();
      if (i && e.callbackNode !== a)
        return null;
      var u = Kc(e, e === Sa ? hr : I);
      if (u === I)
        return null;
      var s = !Jc(e, u) && !Hv(e, u) && !t, f = s ? j1(e, u) : Fm(e, u);
      if (f !== Pu) {
        if (f === ec) {
          var p = Xc(e);
          p !== I && (u = p, f = jS(e, p));
        }
        if (f === Ap) {
          var v = Fp;
          throw nc(e, I), Bo(e, u), Pa(e, Qn()), v;
        }
        if (f === DS)
          Bo(e, u);
        else {
          var y = !Jc(e, u), g = e.current.alternate;
          if (y && !D1(g)) {
            if (f = Fm(e, u), f === ec) {
              var b = Xc(e);
              b !== I && (u = b, f = jS(e, b));
            }
            if (f === Ap) {
              var x = Fp;
              throw nc(e, I), Bo(e, u), Pa(e, Qn()), x;
            }
          }
          e.finishedWork = g, e.finishedLanes = u, k1(e, f, u);
        }
      }
      return Pa(e, Qn()), e.callbackNode === a ? XC.bind(null, e) : null;
    }
    function jS(e, t) {
      var a = Vp;
      if (tf(e)) {
        var i = nc(e, t);
        i.flags |= Cr, Gx(e.containerInfo);
      }
      var u = Fm(e, t);
      if (u !== ec) {
        var s = Va;
        Va = a, s !== null && JC(s);
      }
      return u;
    }
    function JC(e) {
      Va === null ? Va = e : Va.push.apply(Va, e);
    }
    function k1(e, t, a) {
      switch (t) {
        case Pu:
        case Ap:
          throw new Error("Root did not complete. This is a bug in React.");
        case ec: {
          rc(e, Va, Bu);
          break;
        }
        case Dm: {
          if (Bo(e, a), bu(a) && // do not delay if we're inside an act() scope
          !pR()) {
            var i = LS + WC - Qn();
            if (i > 10) {
              var u = Kc(e, I);
              if (u !== I)
                break;
              var s = e.suspendedLanes;
              if (!_u(s, a)) {
                Ea(), Zc(e, s);
                break;
              }
              e.timeoutHandle = zy(rc.bind(null, e, Va, Bu), i);
              break;
            }
          }
          rc(e, Va, Bu);
          break;
        }
        case jp: {
          if (Bo(e, a), Od(a))
            break;
          if (!pR()) {
            var f = ri(e, a), p = f, v = Qn() - p, y = G1(v) - v;
            if (y > 10) {
              e.timeoutHandle = zy(rc.bind(null, e, Va, Bu), y);
              break;
            }
          }
          rc(e, Va, Bu);
          break;
        }
        case QC: {
          rc(e, Va, Bu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function D1(e) {
      for (var t = e; ; ) {
        if (t.flags & po) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], f = s.getSnapshot, p = s.value;
                try {
                  if (!Q(f(), p))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var v = t.child;
        if (t.subtreeFlags & po && v !== null) {
          v.return = t, t = v;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function Bo(e, t) {
      t = Ts(t, Lm), t = Ts(t, Hp), Iv(e, t);
    }
    function ZC(e) {
      if (Qw(), (Ct & (Br | Ai)) !== vr)
        throw new Error("Should not already be working.");
      Yu();
      var t = Kc(e, I);
      if (!Zr(t, Fe))
        return Pa(e, Qn()), null;
      var a = Fm(e, t);
      if (e.tag !== Oo && a === ec) {
        var i = Xc(e);
        i !== I && (t = i, a = jS(e, i));
      }
      if (a === Ap) {
        var u = Fp;
        throw nc(e, I), Bo(e, t), Pa(e, Qn()), u;
      }
      if (a === DS)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, rc(e, Va, Bu), Pa(e, Qn()), null;
    }
    function O1(e, t) {
      t !== I && (ef(e, Xe(t, Fe)), Pa(e, Qn()), (Ct & (Br | Ai)) === vr && (Pp(), Lo()));
    }
    function FS(e, t) {
      var a = Ct;
      Ct |= $C;
      try {
        return e(t);
      } finally {
        Ct = a, Ct === vr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !fl.isBatchingLegacy && (Pp(), q0());
      }
    }
    function L1(e, t, a, i, u) {
      var s = Ua(), f = Pr.transition;
      try {
        return Pr.transition = null, jn(Lr), e(t, a, i, u);
      } finally {
        jn(s), Pr.transition = f, Ct === vr && Pp();
      }
    }
    function Iu(e) {
      Vo !== null && Vo.tag === Oo && (Ct & (Br | Ai)) === vr && Yu();
      var t = Ct;
      Ct |= $C;
      var a = Pr.transition, i = Ua();
      try {
        return Pr.transition = null, jn(Lr), e ? e() : void 0;
      } finally {
        jn(i), Pr.transition = a, Ct = t, (Ct & (Br | Ai)) === vr && Lo();
      }
    }
    function eR() {
      return (Ct & (Br | Ai)) !== vr;
    }
    function jm(e, t) {
      aa(OS, ql, e), ql = Xe(ql, t);
    }
    function HS(e) {
      ql = OS.current, ra(OS, e);
    }
    function nc(e, t) {
      e.finishedWork = null, e.finishedLanes = I;
      var a = e.timeoutHandle;
      if (a !== Uy && (e.timeoutHandle = Uy, ax(a)), Dn !== null)
        for (var i = Dn.return; i !== null; ) {
          var u = i.alternate;
          DC(u, i), i = i.return;
        }
      Sa = e;
      var s = ac(e.current, null);
      return Dn = s, hr = ql = t, mr = Pu, Fp = null, Om = I, Hp = I, Lm = I, Vp = null, Va = null, bw(), rl.discardPendingWarnings(), s;
    }
    function tR(e, t) {
      do {
        var a = Dn;
        try {
          if (Wh(), wE(), cn(), kS.current = null, a === null || a.return === null) {
            mr = Ap, Fp = t, Dn = null;
            return;
          }
          if (je && a.mode & Lt && Rm(a, !0), Ve)
            if (ha(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              wi(a, i, hr);
            } else
              cs(a, t, hr);
          tb(e, a.return, a, t, hr), iR(a);
        } catch (u) {
          t = u, Dn === a && a !== null ? (a = a.return, Dn = a) : a = Dn;
          continue;
        }
        return;
      } while (!0);
    }
    function nR() {
      var e = _S.current;
      return _S.current = ym, e === null ? ym : e;
    }
    function rR(e) {
      _S.current = e;
    }
    function N1() {
      LS = Qn();
    }
    function $p(e) {
      Om = Xe(e, Om);
    }
    function M1() {
      mr === Pu && (mr = Dm);
    }
    function VS() {
      (mr === Pu || mr === Dm || mr === ec) && (mr = jp), Sa !== null && (Cs(Om) || Cs(Hp)) && Bo(Sa, hr);
    }
    function z1(e) {
      mr !== jp && (mr = ec), Vp === null ? Vp = [e] : Vp.push(e);
    }
    function U1() {
      return mr === Pu;
    }
    function Fm(e, t) {
      var a = Ct;
      Ct |= Br;
      var i = nR();
      if (Sa !== e || hr !== t) {
        if (Xr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Qp(e, hr), u.clear()), Yv(e, t);
        }
        Bu = Ad(), nc(e, t);
      }
      Su(t);
      do
        try {
          A1();
          break;
        } catch (s) {
          tR(e, s);
        }
      while (!0);
      if (Wh(), Ct = a, rR(i), Dn !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Lc(), Sa = null, hr = I, mr;
    }
    function A1() {
      for (; Dn !== null; )
        aR(Dn);
    }
    function j1(e, t) {
      var a = Ct;
      Ct |= Br;
      var i = nR();
      if (Sa !== e || hr !== t) {
        if (Xr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Qp(e, hr), u.clear()), Yv(e, t);
        }
        Bu = Ad(), Pp(), nc(e, t);
      }
      Su(t);
      do
        try {
          F1();
          break;
        } catch (s) {
          tR(e, s);
        }
      while (!0);
      return Wh(), rR(i), Ct = a, Dn !== null ? (Uv(), Pu) : (Lc(), Sa = null, hr = I, mr);
    }
    function F1() {
      for (; Dn !== null && !hd(); )
        aR(Dn);
    }
    function aR(e) {
      var t = e.alternate;
      $t(e);
      var a;
      (e.mode & Lt) !== Oe ? (Ig(e), a = PS(t, e, ql), Rm(e, !0)) : a = PS(t, e, ql), cn(), e.memoizedProps = e.pendingProps, a === null ? iR(e) : Dn = a, kS.current = null;
    }
    function iR(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & us) === De) {
          $t(t);
          var u = void 0;
          if ((t.mode & Lt) === Oe ? u = kC(a, t, ql) : (Ig(t), u = kC(a, t, ql), Rm(t, !1)), cn(), u !== null) {
            Dn = u;
            return;
          }
        } else {
          var s = Mb(a, t);
          if (s !== null) {
            s.flags &= Dv, Dn = s;
            return;
          }
          if ((t.mode & Lt) !== Oe) {
            Rm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= us, i.subtreeFlags = De, i.deletions = null;
          else {
            mr = DS, Dn = null;
            return;
          }
        }
        var v = t.sibling;
        if (v !== null) {
          Dn = v;
          return;
        }
        t = i, Dn = t;
      } while (t !== null);
      mr === Pu && (mr = QC);
    }
    function rc(e, t, a) {
      var i = Ua(), u = Pr.transition;
      try {
        Pr.transition = null, jn(Lr), H1(e, t, a, i);
      } finally {
        Pr.transition = u, jn(i);
      }
      return null;
    }
    function H1(e, t, a, i) {
      do
        Yu();
      while (Vo !== null);
      if (q1(), (Ct & (Br | Ai)) !== vr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (Cd(s), u === null)
        return Rd(), null;
      if (s === I && S("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = I, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = kt;
      var f = Xe(u.lanes, u.childLanes);
      zd(e, f), e === Sa && (Sa = null, Dn = null, hr = I), ((u.subtreeFlags & Wi) !== De || (u.flags & Wi) !== De) && (tc || (tc = !0, zS = a, YS(Gi, function() {
        return Yu(), null;
      })));
      var p = (u.subtreeFlags & (_l | kl | Dl | Wi)) !== De, v = (u.flags & (_l | kl | Dl | Wi)) !== De;
      if (p || v) {
        var y = Pr.transition;
        Pr.transition = null;
        var g = Ua();
        jn(Lr);
        var b = Ct;
        Ct |= Ai, kS.current = null, Fb(e, u), qE(), Jb(e, u, s), XT(e.containerInfo), e.current = u, fs(s), Zb(u, e, s), ds(), md(), Ct = b, jn(g), Pr.transition = y;
      } else
        e.current = u, qE();
      var x = tc;
      if (tc ? (tc = !1, Vo = e, Bp = s) : (Bf = 0, zm = null), f = e.pendingLanes, f === I && (Pf = null), x || sR(e.current, !1), gd(u.stateNode, i), Xr && e.memoizedUpdaters.clear(), g1(), Pa(e, Qn()), t !== null)
        for (var N = e.onRecoverableError, U = 0; U < t.length; U++) {
          var F = t[U], se = F.stack, Me = F.digest;
          N(F.value, {
            componentStack: se,
            digest: Me
          });
        }
      if (Nm) {
        Nm = !1;
        var be = NS;
        throw NS = null, be;
      }
      return Zr(Bp, Fe) && e.tag !== Oo && Yu(), f = e.pendingLanes, Zr(f, Fe) ? (Yw(), e === US ? Ip++ : (Ip = 0, US = e)) : Ip = 0, Lo(), Rd(), null;
    }
    function Yu() {
      if (Vo !== null) {
        var e = Wv(Bp), t = _s(Ma, e), a = Pr.transition, i = Ua();
        try {
          return Pr.transition = null, jn(t), P1();
        } finally {
          jn(i), Pr.transition = a;
        }
      }
      return !1;
    }
    function V1(e) {
      MS.push(e), tc || (tc = !0, YS(Gi, function() {
        return Yu(), null;
      }));
    }
    function P1() {
      if (Vo === null)
        return !1;
      var e = zS;
      zS = null;
      var t = Vo, a = Bp;
      if (Vo = null, Bp = I, (Ct & (Br | Ai)) !== vr)
        throw new Error("Cannot flush passive effects while already rendering.");
      AS = !0, Mm = !1, gu(a);
      var i = Ct;
      Ct |= Ai, l1(t.current), n1(t, t.current, a, e);
      {
        var u = MS;
        MS = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          Bb(t, f);
        }
      }
      wd(), sR(t.current, !0), Ct = i, Lo(), Mm ? t === zm ? Bf++ : (Bf = 0, zm = t) : Bf = 0, AS = !1, Mm = !1, Sd(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function lR(e) {
      return Pf !== null && Pf.has(e);
    }
    function B1(e) {
      Pf === null ? Pf = /* @__PURE__ */ new Set([e]) : Pf.add(e);
    }
    function I1(e) {
      Nm || (Nm = !0, NS = e);
    }
    var Y1 = I1;
    function uR(e, t, a) {
      var i = Js(a, t), u = aC(e, i, Fe), s = Mo(e, u, Fe), f = Ea();
      s !== null && (go(s, Fe, f), Pa(s, f));
    }
    function fn(e, t, a) {
      if (Ub(a), Wp(!1), e.tag === ee) {
        uR(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === ee) {
          uR(i, e, a);
          return;
        } else if (i.tag === de) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !lR(s)) {
            var f = Js(a, e), p = uS(i, f, Fe), v = Mo(i, p, Fe), y = Ea();
            v !== null && (go(v, Fe, y), Pa(v, y));
            return;
          }
        }
        i = i.return;
      }
      S(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function $1(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Ea();
      Zc(e, a), e_(e), Sa === e && _u(hr, a) && (mr === jp || mr === Dm && bu(hr) && Qn() - LS < WC ? nc(e, I) : Lm = Xe(Lm, a)), Pa(e, u);
    }
    function oR(e, t) {
      t === kt && (t = w1(e));
      var a = Ea(), i = Fa(e, t);
      i !== null && (go(i, t, a), Pa(i, a));
    }
    function Q1(e) {
      var t = e.memoizedState, a = kt;
      t !== null && (a = t.retryLane), oR(e, a);
    }
    function W1(e, t) {
      var a = kt, i;
      switch (e.tag) {
        case ke:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case un:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), oR(e, a);
    }
    function G1(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : C1(e / 1960) * 1960;
    }
    function K1() {
      if (Ip > T1)
        throw Ip = 0, US = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Bf > x1 && (Bf = 0, zm = null, S("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function q1() {
      rl.flushLegacyContextWarning(), rl.flushPendingUnsafeLifecycleWarnings();
    }
    function sR(e, t) {
      $t(e), Hm(e, bl, h1), t && Hm(e, Ri, m1), Hm(e, bl, p1), t && Hm(e, Ri, v1), cn();
    }
    function Hm(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== De ? i = i.child : ((i.flags & t) !== De && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Vm = null;
    function cR(e) {
      {
        if ((Ct & Br) !== vr || !(e.mode & ot))
          return;
        var t = e.tag;
        if (t !== et && t !== ee && t !== de && t !== fe && t !== We && t !== ct && t !== He)
          return;
        var a = Ie(e) || "ReactComponent";
        if (Vm !== null) {
          if (Vm.has(a))
            return;
          Vm.add(a);
        } else
          Vm = /* @__PURE__ */ new Set([a]);
        var i = ir;
        try {
          $t(e), S("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? $t(e) : cn();
        }
      }
    }
    var PS;
    {
      var X1 = null;
      PS = function(e, t, a) {
        var i = gR(X1, t);
        try {
          return TC(e, t, a);
        } catch (s) {
          if (sw() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Wh(), wE(), DC(e, t), gR(t, i), t.mode & Lt && Ig(t), wl(null, TC, null, e, t, a), $i()) {
            var u = ls();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var fR = !1, BS;
    BS = /* @__PURE__ */ new Set();
    function J1(e) {
      if (hi && !Pw())
        switch (e.tag) {
          case fe:
          case We:
          case He: {
            var t = Dn && Ie(Dn) || "Unknown", a = t;
            if (!BS.has(a)) {
              BS.add(a);
              var i = Ie(e) || "Unknown";
              S("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case de: {
            fR || (S("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), fR = !0);
            break;
          }
        }
    }
    function Qp(e, t) {
      if (Xr) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          ws(e, i, t);
        });
      }
    }
    var IS = {};
    function YS(e, t) {
      {
        var a = fl.current;
        return a !== null ? (a.push(t), IS) : vd(e, t);
      }
    }
    function dR(e) {
      if (e !== IS)
        return Lv(e);
    }
    function pR() {
      return fl.current !== null;
    }
    function Z1(e) {
      {
        if (e.mode & ot) {
          if (!YC())
            return;
        } else if (!E1() || Ct !== vr || e.tag !== fe && e.tag !== We && e.tag !== He)
          return;
        if (fl.current === null) {
          var t = ir;
          try {
            $t(e), S(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, Ie(e));
          } finally {
            t ? $t(e) : cn();
          }
        }
      }
    }
    function e_(e) {
      e.tag !== Oo && YC() && fl.current === null && S(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Wp(e) {
      qC = e;
    }
    var ji = null, If = null, t_ = function(e) {
      ji = e;
    };
    function Yf(e) {
      {
        if (ji === null)
          return e;
        var t = ji(e);
        return t === void 0 ? e : t.current;
      }
    }
    function $S(e) {
      return Yf(e);
    }
    function QS(e) {
      {
        if (ji === null)
          return e;
        var t = ji(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Yf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: B,
                render: a
              };
              return e.displayName !== void 0 && (i.displayName = e.displayName), i;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function vR(e, t) {
      {
        if (ji === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case de: {
            typeof i == "function" && (u = !0);
            break;
          }
          case fe: {
            (typeof i == "function" || s === Ye) && (u = !0);
            break;
          }
          case We: {
            (s === B || s === Ye) && (u = !0);
            break;
          }
          case ct:
          case He: {
            (s === Ke || s === Ye) && (u = !0);
            break;
          }
          default:
            return !1;
        }
        if (u) {
          var f = ji(a);
          if (f !== void 0 && f === ji(i))
            return !0;
        }
        return !1;
      }
    }
    function hR(e) {
      {
        if (ji === null || typeof WeakSet != "function")
          return;
        If === null && (If = /* @__PURE__ */ new WeakSet()), If.add(e);
      }
    }
    var n_ = function(e, t) {
      {
        if (ji === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        Yu(), Iu(function() {
          WS(e.current, i, a);
        });
      }
    }, r_ = function(e, t) {
      {
        if (e.context !== li)
          return;
        Yu(), Iu(function() {
          Gp(t, e, null, null);
        });
      }
    };
    function WS(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case fe:
          case He:
          case de:
            v = p;
            break;
          case We:
            v = p.render;
            break;
        }
        if (ji === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var y = !1, g = !1;
        if (v !== null) {
          var b = ji(v);
          b !== void 0 && (a.has(b) ? g = !0 : t.has(b) && (f === de ? g = !0 : y = !0));
        }
        if (If !== null && (If.has(e) || i !== null && If.has(i)) && (g = !0), g && (e._debugNeedsRemount = !0), g || y) {
          var x = Fa(e, Fe);
          x !== null && yr(x, e, Fe, Xt);
        }
        u !== null && !g && WS(u, t, a), s !== null && WS(s, t, a);
      }
    }
    var a_ = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return GS(e.current, i, a), a;
      }
    };
    function GS(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case fe:
          case He:
          case de:
            p = f;
            break;
          case We:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? i_(e, a) : i !== null && GS(i, t, a), u !== null && GS(u, t, a);
      }
    }
    function i_(e, t) {
      {
        var a = l_(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case X:
              t.add(i.stateNode);
              return;
            case K:
              t.add(i.stateNode.containerInfo);
              return;
            case ee:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function l_(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === X)
          i = !0, t.add(a.stateNode);
        else if (a.child !== null) {
          a.child.return = a, a = a.child;
          continue;
        }
        if (a === e)
          return i;
        for (; a.sibling === null; ) {
          if (a.return === null || a.return === e)
            return i;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
      return !1;
    }
    var KS;
    {
      KS = !1;
      try {
        var mR = Object.preventExtensions({});
      } catch {
        KS = !0;
      }
    }
    function u_(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = De, this.subtreeFlags = De, this.deletions = null, this.lanes = I, this.childLanes = I, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !KS && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var ui = function(e, t, a, i) {
      return new u_(e, t, a, i);
    };
    function qS(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function o_(e) {
      return typeof e == "function" && !qS(e) && e.defaultProps === void 0;
    }
    function s_(e) {
      if (typeof e == "function")
        return qS(e) ? de : fe;
      if (e != null) {
        var t = e.$$typeof;
        if (t === B)
          return We;
        if (t === Ke)
          return ct;
      }
      return et;
    }
    function ac(e, t) {
      var a = e.alternate;
      a === null ? (a = ui(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = De, a.subtreeFlags = De, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & zn, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case et:
        case fe:
        case He:
          a.type = Yf(e.type);
          break;
        case de:
          a.type = $S(e.type);
          break;
        case We:
          a.type = QS(e.type);
          break;
      }
      return a;
    }
    function c_(e, t) {
      e.flags &= zn | mn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = I, e.lanes = t, e.child = null, e.subtreeFlags = De, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = De, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function f_(e, t, a) {
      var i;
      return e === jh ? (i = ot, t === !0 && (i |= Gt, i |= Nt)) : i = Oe, Xr && (i |= Lt), ui(ee, null, null, i);
    }
    function XS(e, t, a, i, u, s) {
      var f = et, p = e;
      if (typeof e == "function")
        qS(e) ? (f = de, p = $S(p)) : p = Yf(p);
      else if (typeof e == "string")
        f = X;
      else
        e: switch (e) {
          case fi:
            return Io(a.children, u, s, t);
          case Qa:
            f = st, u |= Gt, (u & ot) !== Oe && (u |= Nt);
            break;
          case di:
            return d_(a, u, s, t);
          case ue:
            return p_(a, u, s, t);
          case ye:
            return v_(a, u, s, t);
          case Tn:
            return yR(a, u, s, t);
          case nn:
          case ft:
          case sn:
          case ar:
          case ut:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case pi:
                  f = pt;
                  break e;
                case R:
                  f = Jt;
                  break e;
                case B:
                  f = We, p = QS(p);
                  break e;
                case Ke:
                  f = ct;
                  break e;
                case Ye:
                  f = ln, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var y = i ? Ie(i) : null;
              y && (v += `

Check the render method of \`` + y + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var g = ui(f, a, t, u);
      return g.elementType = e, g.type = p, g.lanes = s, g._debugOwner = i, g;
    }
    function JS(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = XS(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Io(e, t, a, i) {
      var u = ui(Qe, e, i, t);
      return u.lanes = a, u;
    }
    function d_(e, t, a, i) {
      typeof e.id != "string" && S('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = ui(vt, e, i, t | Lt);
      return u.elementType = di, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function p_(e, t, a, i) {
      var u = ui(ke, e, i, t);
      return u.elementType = ue, u.lanes = a, u;
    }
    function v_(e, t, a, i) {
      var u = ui(un, e, i, t);
      return u.elementType = ye, u.lanes = a, u;
    }
    function yR(e, t, a, i) {
      var u = ui(Le, e, i, t);
      u.elementType = Tn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function ZS(e, t, a) {
      var i = ui(le, e, null, t);
      return i.lanes = a, i;
    }
    function h_() {
      var e = ui(X, null, null, Oe);
      return e.elementType = "DELETED", e;
    }
    function m_(e) {
      var t = ui(Zt, null, null, Oe);
      return t.stateNode = e, t;
    }
    function e0(e, t, a) {
      var i = e.children !== null ? e.children : [], u = ui(K, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function gR(e, t) {
      return e === null && (e = ui(et, null, null, Oe)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function y_(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Uy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = kt, this.eventTimes = xs(I), this.expirationTimes = xs(Xt), this.pendingLanes = I, this.suspendedLanes = I, this.pingedLanes = I, this.expiredLanes = I, this.mutableReadLanes = I, this.finishedLanes = I, this.entangledLanes = I, this.entanglements = xs(I), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Eu; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case jh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Oo:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function SR(e, t, a, i, u, s, f, p, v, y) {
      var g = new y_(e, t, a, p, v), b = f_(t, s);
      g.current = b, b.stateNode = g;
      {
        var x = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        b.memoizedState = x;
      }
      return pg(b), g;
    }
    var t0 = "18.3.1";
    function g_(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return Yr(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: rr,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var n0, r0;
    n0 = !1, r0 = {};
    function ER(e) {
      if (!e)
        return li;
      var t = fo(e), a = ew(t);
      if (t.tag === de) {
        var i = t.type;
        if (Il(i))
          return W0(t, i, a);
      }
      return a;
    }
    function S_(e, t) {
      {
        var a = fo(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = Kr(a);
        if (u === null)
          return null;
        if (u.mode & Gt) {
          var s = Ie(a) || "Component";
          if (!r0[s]) {
            r0[s] = !0;
            var f = ir;
            try {
              $t(u), a.mode & Gt ? S("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : S("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? $t(f) : cn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function CR(e, t, a, i, u, s, f, p) {
      var v = !1, y = null;
      return SR(e, t, v, y, a, i, u, s, f);
    }
    function RR(e, t, a, i, u, s, f, p, v, y) {
      var g = !0, b = SR(a, i, g, e, u, s, f, p, v);
      b.context = ER(null);
      var x = b.current, N = Ea(), U = Po(x), F = Hu(N, U);
      return F.callback = t ?? null, Mo(x, F, U), b1(b, U, N), b;
    }
    function Gp(e, t, a, i) {
      yd(t, e);
      var u = t.current, s = Ea(), f = Po(u);
      gn(f);
      var p = ER(a);
      t.context === null ? t.context = p : t.pendingContext = p, hi && ir !== null && !n0 && (n0 = !0, S(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, Ie(ir) || "Unknown"));
      var v = Hu(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && S("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var y = Mo(u, v, f);
      return y !== null && (yr(y, u, f, s), Jh(y, u, f)), f;
    }
    function Pm(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case X:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function E_(e) {
      switch (e.tag) {
        case ee: {
          var t = e.stateNode;
          if (tf(t)) {
            var a = jv(t);
            O1(t, a);
          }
          break;
        }
        case ke: {
          Iu(function() {
            var u = Fa(e, Fe);
            if (u !== null) {
              var s = Ea();
              yr(u, e, Fe, s);
            }
          });
          var i = Fe;
          a0(e, i);
          break;
        }
      }
    }
    function TR(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Bv(a.retryLane, t));
    }
    function a0(e, t) {
      TR(e, t);
      var a = e.alternate;
      a && TR(a, t);
    }
    function C_(e) {
      if (e.tag === ke) {
        var t = gs, a = Fa(e, t);
        if (a !== null) {
          var i = Ea();
          yr(a, e, t, i);
        }
        a0(e, t);
      }
    }
    function R_(e) {
      if (e.tag === ke) {
        var t = Po(e), a = Fa(e, t);
        if (a !== null) {
          var i = Ea();
          yr(a, e, t, i);
        }
        a0(e, t);
      }
    }
    function xR(e) {
      var t = dn(e);
      return t === null ? null : t.stateNode;
    }
    var wR = function(e) {
      return null;
    };
    function T_(e) {
      return wR(e);
    }
    var bR = function(e) {
      return !1;
    };
    function x_(e) {
      return bR(e);
    }
    var _R = null, kR = null, DR = null, OR = null, LR = null, NR = null, MR = null, zR = null, UR = null;
    {
      var AR = function(e, t, a) {
        var i = t[a], u = at(e) ? e.slice() : Ze({}, e);
        return a + 1 === t.length ? (at(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = AR(e[i], t, a + 1), u);
      }, jR = function(e, t) {
        return AR(e, t, 0);
      }, FR = function(e, t, a, i) {
        var u = t[i], s = at(e) ? e.slice() : Ze({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], at(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = FR(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return s;
      }, HR = function(e, t, a) {
        if (t.length !== a.length) {
          yt("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              yt("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return FR(e, t, a, 0);
      }, VR = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = at(e) ? e.slice() : Ze({}, e);
        return s[u] = VR(e[u], t, a + 1, i), s;
      }, PR = function(e, t, a) {
        return VR(e, t, 0, a);
      }, i0 = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      _R = function(e, t, a, i) {
        var u = i0(e, t);
        if (u !== null) {
          var s = PR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = Ze({}, e.memoizedProps);
          var f = Fa(e, Fe);
          f !== null && yr(f, e, Fe, Xt);
        }
      }, kR = function(e, t, a) {
        var i = i0(e, t);
        if (i !== null) {
          var u = jR(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = Ze({}, e.memoizedProps);
          var s = Fa(e, Fe);
          s !== null && yr(s, e, Fe, Xt);
        }
      }, DR = function(e, t, a, i) {
        var u = i0(e, t);
        if (u !== null) {
          var s = HR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = Ze({}, e.memoizedProps);
          var f = Fa(e, Fe);
          f !== null && yr(f, e, Fe, Xt);
        }
      }, OR = function(e, t, a) {
        e.pendingProps = PR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Fa(e, Fe);
        i !== null && yr(i, e, Fe, Xt);
      }, LR = function(e, t) {
        e.pendingProps = jR(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Fa(e, Fe);
        a !== null && yr(a, e, Fe, Xt);
      }, NR = function(e, t, a) {
        e.pendingProps = HR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Fa(e, Fe);
        i !== null && yr(i, e, Fe, Xt);
      }, MR = function(e) {
        var t = Fa(e, Fe);
        t !== null && yr(t, e, Fe, Xt);
      }, zR = function(e) {
        wR = e;
      }, UR = function(e) {
        bR = e;
      };
    }
    function w_(e) {
      var t = Kr(e);
      return t === null ? null : t.stateNode;
    }
    function b_(e) {
      return null;
    }
    function __() {
      return ir;
    }
    function k_(e) {
      var t = e.findFiberByHostInstance, a = A.ReactCurrentDispatcher;
      return ho({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: _R,
        overrideHookStateDeletePath: kR,
        overrideHookStateRenamePath: DR,
        overrideProps: OR,
        overridePropsDeletePath: LR,
        overridePropsRenamePath: NR,
        setErrorHandler: zR,
        setSuspenseHandler: UR,
        scheduleUpdate: MR,
        currentDispatcherRef: a,
        findHostInstanceByFiber: w_,
        findFiberByHostInstance: t || b_,
        // React Refresh
        findHostInstancesForRefresh: a_,
        scheduleRefresh: n_,
        scheduleRoot: r_,
        setRefreshHandler: t_,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: __,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: t0
      });
    }
    var BR = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function l0(e) {
      this._internalRoot = e;
    }
    Bm.prototype.render = l0.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? S("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Im(arguments[1]) ? S("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && S("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Nn) {
          var i = xR(t.current);
          i && i.parentNode !== a && S("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Gp(e, t, null, null);
    }, Bm.prototype.unmount = l0.prototype.unmount = function() {
      typeof arguments[0] == "function" && S("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        eR() && S("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Iu(function() {
          Gp(null, e, null, null);
        }), B0(t);
      }
    };
    function D_(e, t) {
      if (!Im(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      IR(e);
      var a = !1, i = !1, u = "", s = BR;
      t != null && (t.hydrate ? yt("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === _r && S(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = CR(e, jh, null, a, i, u, s);
      Oh(f.current, e);
      var p = e.nodeType === Nn ? e.parentNode : e;
      return ep(p), new l0(f);
    }
    function Bm(e) {
      this._internalRoot = e;
    }
    function O_(e) {
      e && Jv(e);
    }
    Bm.prototype.unstable_scheduleHydration = O_;
    function L_(e, t, a) {
      if (!Im(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      IR(e), t === void 0 && S("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = BR;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var y = RR(t, null, e, jh, i, s, f, p, v);
      if (Oh(y.current, e), ep(e), u)
        for (var g = 0; g < u.length; g++) {
          var b = u[g];
          Uw(y, b);
        }
      return new Bm(y);
    }
    function Im(e) {
      return !!(e && (e.nodeType === Qr || e.nodeType === Yi || e.nodeType === nd));
    }
    function Kp(e) {
      return !!(e && (e.nodeType === Qr || e.nodeType === Yi || e.nodeType === nd || e.nodeType === Nn && e.nodeValue === " react-mount-point-unstable "));
    }
    function IR(e) {
      e.nodeType === Qr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), fp(e) && (e._reactRootContainer ? S("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : S("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var N_ = A.ReactCurrentOwner, YR;
    YR = function(e) {
      if (e._reactRootContainer && e.nodeType !== Nn) {
        var t = xR(e._reactRootContainer.current);
        t && t.parentNode !== e && S("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = u0(e), u = !!(i && ko(i));
      u && !a && S("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Qr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function u0(e) {
      return e ? e.nodeType === Yi ? e.documentElement : e.firstChild : null;
    }
    function $R() {
    }
    function M_(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var x = Pm(f);
            s.call(x);
          };
        }
        var f = RR(
          t,
          i,
          e,
          Oo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          $R
        );
        e._reactRootContainer = f, Oh(f.current, e);
        var p = e.nodeType === Nn ? e.parentNode : e;
        return ep(p), Iu(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var y = i;
          i = function() {
            var x = Pm(g);
            y.call(x);
          };
        }
        var g = CR(
          e,
          Oo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          $R
        );
        e._reactRootContainer = g, Oh(g.current, e);
        var b = e.nodeType === Nn ? e.parentNode : e;
        return ep(b), Iu(function() {
          Gp(t, g, a, i);
        }), g;
      }
    }
    function z_(e, t) {
      e !== null && typeof e != "function" && S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Ym(e, t, a, i, u) {
      YR(a), z_(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = M_(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = Pm(f);
            p.call(v);
          };
        }
        Gp(t, f, e, u);
      }
      return Pm(f);
    }
    var QR = !1;
    function U_(e) {
      {
        QR || (QR = !0, S("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = N_.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || S("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Tt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Qr ? e : S_(e, "findDOMNode");
    }
    function A_(e, t, a) {
      if (S("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Kp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = fp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Ym(null, e, t, !0, a);
    }
    function j_(e, t, a) {
      if (S("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Kp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = fp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Ym(null, e, t, !1, a);
    }
    function F_(e, t, a, i) {
      if (S("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Kp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !ay(e))
        throw new Error("parentComponent must be a valid React Component");
      return Ym(e, t, a, !1, i);
    }
    var WR = !1;
    function H_(e) {
      if (WR || (WR = !0, S("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Kp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = fp(e) && e._reactRootContainer === void 0;
        t && S("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = u0(e), i = a && !ko(a);
          i && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Iu(function() {
          Ym(null, null, e, !1, function() {
            e._reactRootContainer = null, B0(e);
          });
        }), !0;
      } else {
        {
          var u = u0(e), s = !!(u && ko(u)), f = e.nodeType === Qr && Kp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Tr(E_), So(C_), Gv(R_), Ds(Ua), jd($v), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && S("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), gc(PT), ry(FS, L1, Iu);
    function V_(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Im(t))
        throw new Error("Target container is not a DOM element.");
      return g_(e, t, null, a);
    }
    function P_(e, t, a, i) {
      return F_(e, t, a, i);
    }
    var o0 = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [ko, Cf, Lh, uo, Sc, FS]
    };
    function B_(e, t) {
      return o0.usingClientEntryPoint || S('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), D_(e, t);
    }
    function I_(e, t, a) {
      return o0.usingClientEntryPoint || S('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), L_(e, t, a);
    }
    function Y_(e) {
      return eR() && S("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Iu(e);
    }
    var $_ = k_({
      findFiberByHostInstance: Is,
      bundleType: 1,
      version: t0,
      rendererPackageName: "react-dom"
    });
    if (!$_ && On && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var GR = window.location.protocol;
      /^(https?|file):$/.test(GR) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (GR === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ia.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = o0, Ia.createPortal = V_, Ia.createRoot = B_, Ia.findDOMNode = U_, Ia.flushSync = Y_, Ia.hydrate = A_, Ia.hydrateRoot = I_, Ia.render = j_, Ia.unmountComponentAtNode = H_, Ia.unstable_batchedUpdates = FS, Ia.unstable_renderSubtreeIntoContainer = P_, Ia.version = t0, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Ia;
}
function uT() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(uT);
    } catch (ne) {
      console.error(ne);
    }
  }
}
process.env.NODE_ENV === "production" ? (uT(), p0.exports = ek()) : p0.exports = tk();
var nk = p0.exports, v0, Qm = nk;
if (process.env.NODE_ENV === "production")
  v0 = Qm.createRoot, Qm.hydrateRoot;
else {
  var aT = Qm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  v0 = function(ne, Z) {
    aT.usingClientEntryPoint = !0;
    try {
      return Qm.createRoot(ne, Z);
    } finally {
      aT.usingClientEntryPoint = !1;
    }
  };
}
const rk = () => /* @__PURE__ */ Ce.jsx("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5", children: /* @__PURE__ */ Ce.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), ak = () => /* @__PURE__ */ Ce.jsx("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5", children: /* @__PURE__ */ Ce.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 15l7-7 7 7" }) }), ik = () => /* @__PURE__ */ Ce.jsx("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5", children: /* @__PURE__ */ Ce.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) }), lk = () => /* @__PURE__ */ Ce.jsx("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2.5", className: "w-5 h-5", children: /* @__PURE__ */ Ce.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4v16m8-8H4" }) }), uk = () => {
  const [ne, Z] = ic.useState(""), [A, wt] = ic.useState([]), [mt, yt] = ic.useState(!1), S = [
    { type: "TextInput", label: "Metin Kutusu", defaultContent: "Kısa Yanıt" },
    { type: "NumberInput", label: "Sayısal Girdi", defaultContent: "Sayısal Değer" },
    { type: "Select", label: "Açılır Liste", defaultContent: "Lütfen Birini Seçin" },
    { type: "Rating", label: "Derecelendirme", defaultContent: "Memnuniyet Puanı" }
  ], Ft = (K, X) => {
    const le = {
      id: Math.random().toString(36).substr(2, 9),
      type: K,
      order: A.length + 1,
      content: X,
      settings: K === "Select" ? { options: ["Seçenek 1", "Seçenek 2"], required: !1 } : { required: !1 }
    };
    wt([...A, le]);
  }, fe = (K) => {
    wt(A.filter((X) => X.id !== K).map((X, le) => ({ ...X, order: le + 1 })));
  }, de = (K, X) => {
    if (X === "up" && K === 0 || X === "down" && K === A.length - 1) return;
    const le = [...A], Qe = X === "up" ? K - 1 : K + 1;
    [le[K], le[Qe]] = [le[Qe], le[K]], wt(le.map((st, Jt) => ({ ...st, order: Jt + 1 })));
  }, et = (K, X) => {
    wt(A.map((le) => le.id === K ? { ...le, content: X } : le));
  }, ee = () => {
    if (!ne.trim()) {
      window.abp.message.warn("Lütfen formunuza şık bir başlık verin!", "Başlık Eksik");
      return;
    }
    if (A.length === 0) {
      window.abp.message.warn("Forma henüz hiçbir soru eklemediniz. Lütfen sol menüden blok seçin.", "Sorular Eksik");
      return;
    }
    yt(!0);
    const K = ne.trim().toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-") + "-" + Math.random().toString(36).substr(2, 6), X = {
      title: ne,
      slug: K,
      blocks: A.map((le) => {
        let Qe = 0;
        return le.type === "NumberInput" ? Qe = 1 : le.type === "Select" ? Qe = 2 : le.type === "Rating" && (Qe = 4), {
          type: Qe,
          order: le.order,
          content: le.content || "İsimsiz Soru",
          settings: JSON.stringify(le.settings || {})
        };
      })
    };
    window.abp.ajax({
      type: "POST",
      url: "/api/app/template",
      data: JSON.stringify(X)
    }).then(function(le) {
      window.abp.notify.success("Şablon başarıyla veritabanına kaydedildi!", "Tebrikler"), Z(""), wt([]), yt(!1);
    }).catch(function(le) {
      let Qe = le && le.message ? le.message : "Şablon kaydedilirken bir hata oluştu.";
      window.abp.message.error(Qe, "Hata"), yt(!1);
    });
  };
  return /* @__PURE__ */ Ce.jsxs("div", { className: "relative flex h-full min-h-[calc(100vh-80px)] bg-slate-50 overflow-hidden rounded-tl-3xl shadow-inner text-slate-800", children: [
    /* @__PURE__ */ Ce.jsx("div", { className: "absolute top-[-10%] left-[10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob" }),
    /* @__PURE__ */ Ce.jsx("div", { className: "absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob", style: { animationDelay: "2s" } }),
    /* @__PURE__ */ Ce.jsx("div", { className: "absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob", style: { animationDelay: "4s" } }),
    /* @__PURE__ */ Ce.jsxs("div", { className: "relative w-80 bg-white/60 backdrop-blur-3xl border-r border-white/50 p-8 flex flex-col gap-8 shadow-[10px_0_30px_rgba(0,0,0,0.02)] z-10", children: [
      /* @__PURE__ */ Ce.jsxs("div", { children: [
        /* @__PURE__ */ Ce.jsx("h3", { className: "text-xs font-bold text-indigo-500 tracking-widest uppercase mb-1", children: "Araç Kutusu" }),
        /* @__PURE__ */ Ce.jsx("p", { className: "text-2xl font-extrabold tracking-tight text-slate-900 border-b-2 border-indigo-100 pb-4 inline-block", children: "Yapı Taşları" })
      ] }),
      /* @__PURE__ */ Ce.jsx("div", { className: "flex flex-col gap-3", children: S.map((K) => /* @__PURE__ */ Ce.jsxs(
        "button",
        {
          onClick: () => Ft(K.type, K.defaultContent),
          disabled: mt,
          className: "group flex items-center gap-4 w-full p-4 bg-white/70 border border-white rounded-[1.25rem] hover:bg-gradient-to-r hover:from-white hover:to-indigo-50/50 hover:border-indigo-100/80 shadow-sm hover:shadow-[0_8px_20px_rgba(99,102,241,0.08)] transition-all duration-300 ease-out hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed",
          children: [
            /* @__PURE__ */ Ce.jsx("div", { className: "p-2.5 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 group-hover:from-indigo-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm", children: /* @__PURE__ */ Ce.jsx(lk, {}) }),
            /* @__PURE__ */ Ce.jsx("span", { className: "font-bold text-[15px] text-slate-700 group-hover:text-indigo-950 transition-colors", children: K.label })
          ]
        },
        K.type
      )) })
    ] }),
    /* @__PURE__ */ Ce.jsxs("div", { className: "relative flex-1 p-12 overflow-y-auto z-10 scroll-smooth", children: [
      /* @__PURE__ */ Ce.jsxs("div", { className: "flex justify-between items-center max-w-4xl mx-auto mb-12", children: [
        /* @__PURE__ */ Ce.jsxs("div", { children: [
          /* @__PURE__ */ Ce.jsx("h2", { className: "text-[2.5rem] leading-tight font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500", children: "Dinamik Şablon Motoru" }),
          /* @__PURE__ */ Ce.jsxs("p", { className: "text-slate-500 font-semibold mt-2 flex items-center gap-2", children: [
            /* @__PURE__ */ Ce.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }),
            " Sistemi inşa eden gelecek nesil arayüz"
          ] })
        ] }),
        /* @__PURE__ */ Ce.jsx(
          "button",
          {
            onClick: ee,
            disabled: mt,
            className: "relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-2xl group bg-gradient-to-br from-indigo-500 to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-indigo-300 hover:shadow-[0_10px_25px_rgba(99,102,241,0.3)] transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:cursor-not-allowed",
            children: /* @__PURE__ */ Ce.jsx("span", { className: "relative px-8 py-3.5 transition-all ease-in duration-200 bg-white rounded-[14px] group-hover:bg-opacity-0 text-slate-800 group-hover:text-white font-bold tracking-wide text-[15px] flex items-center gap-2", children: mt ? /* @__PURE__ */ Ce.jsxs("span", { children: [
              /* @__PURE__ */ Ce.jsxs("svg", { className: "animate-spin h-5 w-5 text-current inline-block mr-2", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ Ce.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ Ce.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
              ] }),
              "Kaydediliyor..."
            ] }) : "Taslağı Canlıya Al" })
          }
        )
      ] }),
      /* @__PURE__ */ Ce.jsxs("div", { className: "max-w-4xl mx-auto bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white p-14 relative overflow-hidden group/canvas", children: [
        /* @__PURE__ */ Ce.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-bl-full -z-10 group-hover/canvas:scale-110 transition-transform duration-700" }),
        /* @__PURE__ */ Ce.jsx(
          "input",
          {
            type: "text",
            className: "w-full text-5xl font-black bg-transparent border-none p-0 focus:ring-0 text-slate-900 placeholder-slate-300/80 mb-14 border-b-[3px] border-slate-100 hover:border-slate-200 focus:border-indigo-500 pb-5 transition-all focus:outline-none",
            value: ne,
            onChange: (K) => Z(K.target.value),
            placeholder: "Müşteri Formu Başlığı..."
          }
        ),
        A.length === 0 ? /* @__PURE__ */ Ce.jsxs("div", { className: "text-center py-28 px-4 bg-slate-50/50 border-2 border-dashed border-slate-200/80 rounded-[2.5rem] animate-fade-in hover:bg-slate-50 hover:border-indigo-300/50 transition-all duration-500 cursor-pointer", children: [
          /* @__PURE__ */ Ce.jsx("div", { className: "inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-8", children: /* @__PURE__ */ Ce.jsx("svg", { className: "w-10 h-10 text-indigo-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ Ce.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }) }) }),
          /* @__PURE__ */ Ce.jsx("h3", { className: "text-3xl text-slate-800 font-extrabold mb-3 tracking-tight", children: "Ekrana bir şey sürükleyin" }),
          /* @__PURE__ */ Ce.jsx("p", { className: "text-slate-400 font-semibold text-lg", children: "Mucize yaratmak için sol paneli kullanın." })
        ] }) : /* @__PURE__ */ Ce.jsx("div", { className: "flex flex-col gap-8", children: A.map((K, X) => /* @__PURE__ */ Ce.jsxs("div", { className: "group/block relative bg-white border border-slate-100/80 rounded-[2rem] p-10 hover:border-indigo-200 hover:shadow-[0_12px_40px_rgba(99,102,241,0.06)] transition-all duration-400 animate-fade-in hover:-translate-y-1", children: [
          /* @__PURE__ */ Ce.jsxs("div", { className: "absolute -top-5 -right-5 hidden group-hover/block:flex items-center gap-2 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-2 z-20 animate-fade-in", children: [
            /* @__PURE__ */ Ce.jsx("button", { onClick: () => de(X, "up"), className: "p-2.5 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors", title: "Yukarı Taşı", children: /* @__PURE__ */ Ce.jsx(ak, {}) }),
            /* @__PURE__ */ Ce.jsx("button", { onClick: () => de(X, "down"), className: "p-2.5 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors", title: "Aşağı Taşı", children: /* @__PURE__ */ Ce.jsx(ik, {}) }),
            /* @__PURE__ */ Ce.jsx("div", { className: "w-px h-6 bg-slate-700 mx-1" }),
            /* @__PURE__ */ Ce.jsx("button", { onClick: () => fe(K.id), className: "p-2.5 hover:bg-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-colors", title: "Bileşeni Sil", children: /* @__PURE__ */ Ce.jsx(rk, {}) })
          ] }),
          /* @__PURE__ */ Ce.jsx("div", { className: "flex gap-4 items-start", children: /* @__PURE__ */ Ce.jsxs("div", { className: "flex-1 w-full", children: [
            /* @__PURE__ */ Ce.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ Ce.jsx("span", { className: "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 uppercase tracking-widest border border-indigo-100/50", children: K.type }) }),
            /* @__PURE__ */ Ce.jsx(
              "input",
              {
                type: "text",
                value: K.content,
                onChange: (le) => et(K.id, le.target.value),
                className: "w-full font-extrabold text-slate-800 border-none p-0 focus:ring-0 text-2xl focus:outline-none mb-2 bg-transparent placeholder-slate-300",
                placeholder: "Buraya sorunuzu yazın..."
              }
            )
          ] }) }),
          /* @__PURE__ */ Ce.jsxs("div", { className: "mt-8 pt-8 border-t border-slate-100", children: [
            K.type === "TextInput" && /* @__PURE__ */ Ce.jsx("input", { type: "text", disabled: !0, className: "w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-5 text-slate-400 font-semibold text-[15px]", placeholder: "Kullanıcı metin girecek..." }),
            K.type === "Select" && /* @__PURE__ */ Ce.jsx("select", { disabled: !0, className: "w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-5 text-slate-400 font-semibold text-[15px] appearance-none", children: /* @__PURE__ */ Ce.jsx("option", { children: "Açılır liste görünümü..." }) }),
            K.type === "Rating" && /* @__PURE__ */ Ce.jsx("div", { className: "flex gap-4", children: [1, 2, 3, 4, 5].map((le) => /* @__PURE__ */ Ce.jsx("div", { className: "w-14 h-14 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-slate-300 font-black text-xl shadow-sm", children: le }, le)) }),
            K.type === "NumberInput" && /* @__PURE__ */ Ce.jsx("input", { type: "number", disabled: !0, className: "w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-5 text-slate-400 font-semibold text-[15px]", placeholder: "Sayısal Değer..." })
          ] })
        ] }, K.id)) })
      ] })
    ] })
  ] });
}, iT = document.getElementById("dynamic-assets-app-root");
iT && v0(iT).render(/* @__PURE__ */ Ce.jsx(uk, {}));
