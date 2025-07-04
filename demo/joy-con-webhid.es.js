var Ee = Object.defineProperty;
var Ae = (e, t, n) =>
  t in e
    ? Ee(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
    : (e[t] = n);
var ue = (e, t, n) => Ae(e, typeof t != 'symbol' ? t + '' : t, n);
const xe = async (e) => {
  const t =
      ({
        subcommand: s,
        expectedReport: l,
        timeoutErrorMessage: u = 'timeout.',
      }) =>
      (f) =>
        new Promise((M, w) => {
          const R = setTimeout(() => {
              (f.removeEventListener('inputreport', B), w(new Error(u)));
            }, 5e3),
            B = (L) => {
              const j = L;
              if (j.reportId !== 33) return;
              const E = new Uint8Array(j.data.buffer);
              for (const [A, x] of Object.entries(l))
                if (E[Number(A) - 1] !== x) return;
              (f.removeEventListener('inputreport', B),
                clearTimeout(R),
                setTimeout(M, 50));
            };
          (f.addEventListener('inputreport', B),
            (async () =>
              await f.sendReport(
                1,
                new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, ...s])
              ))());
        }),
    n = t({
      subcommand: [34, 1],
      expectedReport: {
        13: 128,
        14: 34,
      },
    }),
    o = t({
      subcommand: [
        33, 33, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 243,
      ],
      expectedReport: {
        14: 33,
      },
    }),
    a = t({
      subcommand: [89],
      expectedReport: {
        14: 89,
        16: 32,
      },
      timeoutErrorMessage: 'ring-con not found.',
    }),
    p = t({
      subcommand: [
        92, 6, 3, 37, 6, 0, 0, 0, 0, 28, 22, 237, 52, 54, 0, 0, 0, 10, 100, 11,
        230, 169, 34, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 144, 168, 225, 52, 54,
      ],
      expectedReport: {
        14: 92,
      },
    }),
    i = t({
      subcommand: [90, 4, 1, 1, 2],
      expectedReport: {
        14: 90,
      },
    });
  (await n(e), await o(e), await a(e), await p(e), await i(e));
};
function Fe(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default')
    ? e.default
    : e;
}
var fe, Me;
function Be() {
  return (
    Me ||
      ((Me = 1),
      (fe = function (t, n) {
        n = n || {};
        const o = n.kp || 1,
          a = n.ki || 0;
        let i = 1 / (1e3 / t),
          s = n.doInitialisation !== !0,
          l = 2 * o;
        const u = 2 * a;
        let f = 1,
          M = 0,
          w = 0,
          R = 0,
          B = 0,
          L = 0,
          j = 0;
        function E(c, r, d, q, h, b) {
          let v, m, _, P, F, J, U;
          (q !== 0 &&
            h !== 0 &&
            b !== 0 &&
            ((v = (q * q + h * h + b * b) ** -0.5),
            (q *= v),
            (h *= v),
            (b *= v),
            (m = M * R - f * w),
            (_ = f * M + w * R),
            (P = f * f - 0.5 + R * R),
            (F = h * P - b * _),
            (J = b * m - q * P),
            (U = q * _ - h * m),
            u > 0
              ? ((B += u * F * i),
                (L += u * J * i),
                (j += u * U * i),
                (c += B),
                (r += L),
                (d += j))
              : ((B = 0), (L = 0), (j = 0)),
            (c += l * F),
            (r += l * J),
            (d += l * U)),
            (c *= 0.5 * i),
            (r *= 0.5 * i),
            (d *= 0.5 * i));
          const C = f,
            N = M,
            H = w;
          ((f += -N * c - H * r - R * d),
            (M += C * c + H * d - R * r),
            (w += C * r - N * d + R * c),
            (R += C * d + N * r - H * c),
            (v = (f * f + M * M + w * w + R * R) ** -0.5),
            (f *= v),
            (M *= v),
            (w *= v),
            (R *= v));
        }
        function A(c, r, d, q, h, b) {
          return {
            x: r * b - d * h,
            y: d * q - c * b,
            z: c * h - r * q,
          };
        }
        function x(c, r, d, q, h, b) {
          const v = -Math.atan2(c, Math.sqrt(r * r + d * d)),
            m = A(c, r, d, 1, 0, 0),
            _ = A(1, 0, 0, m.x, m.y, m.z),
            P = Math.atan2(_.y, _.z),
            F = Math.cos(P),
            J = Math.sin(v),
            U = Math.sin(P),
            C = h * F - b * U,
            N = q * Math.cos(v) + h * U * J + b * F * J;
          return {
            heading: -Math.atan2(C, N),
            pitch: v,
            roll: P,
          };
        }
        function S(c) {
          const r = Math.cos(c.heading * 0.5),
            d = Math.sin(c.heading * 0.5),
            q = Math.cos(c.pitch * 0.5),
            h = Math.sin(c.pitch * 0.5),
            b = Math.cos(c.roll * 0.5),
            v = Math.sin(c.roll * 0.5);
          return {
            w: b * q * r + v * h * d,
            x: v * q * r - b * h * d,
            y: b * h * r + v * q * d,
            z: b * q * d - v * h * r,
          };
        }
        function I(c, r, d, q, h, b) {
          const v = x(c, r, d, q, h, b),
            m = S(v),
            _ = (m.w * m.w + m.x * m.x + m.y * m.y + m.z * m.z) ** -0.5;
          ((f = m.w * _),
            (M = m.x * _),
            (w = m.y * _),
            (R = m.z * _),
            (s = !0));
        }
        function k(c, r, d, q, h, b, v, m, _, P) {
          ((i = P || i), s || I(q, h, b, v, m, _));
          let F,
            J,
            U,
            C,
            N,
            H,
            V,
            T,
            G,
            g,
            y,
            W,
            le,
            se,
            X,
            Y,
            ae,
            Z,
            z,
            ce,
            D,
            K,
            ee,
            $;
          if (
            v === void 0 ||
            m === void 0 ||
            _ === void 0 ||
            (v === 0 && m === 0 && _ === 0)
          ) {
            E(c, r, d, q, h, b);
            return;
          }
          (q !== 0 &&
            h !== 0 &&
            b !== 0 &&
            ((F = (q * q + h * h + b * b) ** -0.5),
            (q *= F),
            (h *= F),
            (b *= F),
            (F = (v * v + m * m + _ * _) ** -0.5),
            (v *= F),
            (m *= F),
            (_ *= F),
            (J = f * f),
            (U = f * M),
            (C = f * w),
            (N = f * R),
            (H = M * M),
            (V = M * w),
            (T = M * R),
            (G = w * w),
            (g = w * R),
            (y = R * R),
            (W = 2 * (v * (0.5 - G - y) + m * (V - N) + _ * (T + C))),
            (le = 2 * (v * (V + N) + m * (0.5 - H - y) + _ * (g - U))),
            (se = Math.sqrt(W * W + le * le)),
            (X = 2 * (v * (T - C) + m * (g + U) + _ * (0.5 - H - G))),
            (Y = T - C),
            (ae = U + g),
            (Z = J - 0.5 + y),
            (z = se * (0.5 - G - y) + X * (T - C)),
            (ce = se * (V - N) + X * (U + g)),
            (D = se * (C + T) + X * (0.5 - H - G)),
            (K = h * Z - b * ae + (m * D - _ * ce)),
            (ee = b * Y - q * Z + (_ * z - v * D)),
            ($ = q * ae - h * Y + (v * ce - m * z)),
            u > 0
              ? ((B += u * K * i),
                (L += u * ee * i),
                (j += u * $ * i),
                (c += B),
                (r += L),
                (d += j))
              : ((B = 0), (L = 0), (j = 0)),
            (c += l * K),
            (r += l * ee),
            (d += l * $)),
            (c *= 0.5 * i),
            (r *= 0.5 * i),
            (d *= 0.5 * i));
          const te = f,
            Q = M,
            O = w;
          ((f += -Q * c - O * r - R * d),
            (M += te * c + O * d - R * r),
            (w += te * r - Q * d + R * c),
            (R += te * d + Q * r - O * c),
            (F = (f * f + M * M + w * w + R * R) ** -0.5),
            (f *= F),
            (M *= F),
            (w *= F),
            (R *= F));
        }
        return {
          update: k,
          init: I,
          getQuaternion() {
            return {
              w: f,
              x: M,
              y: w,
              z: R,
            };
          },
        };
      })),
    fe
  );
}
var ve, Ie;
function Le() {
  return (
    Ie ||
      ((Ie = 1),
      (ve = function (t, n) {
        n = n || {};
        const o = 1e3 / t;
        let a = n.beta || 0.4,
          p = n.doInitialisation !== !0,
          i = 1,
          s = 0,
          l = 0,
          u = 0,
          f = 1 / o;
        function M(E, A, x, S, I, k) {
          let c, r, d, q, h, b, v, m, _, P, F, J, U, C, N, H, V, T, G, g, y, W;
          ((b = 0.5 * (-s * E - l * A - u * x)),
            (v = 0.5 * (i * E + l * x - u * A)),
            (m = 0.5 * (i * A - s * x + u * E)),
            (_ = 0.5 * (i * x + s * A - l * E)),
            (S === 0 && I === 0 && k === 0) ||
              ((c = (S * S + I * I + k * k) ** -0.5),
              (S *= c),
              (I *= c),
              (k *= c),
              (P = 2 * i),
              (F = 2 * s),
              (J = 2 * l),
              (U = 2 * u),
              (C = 4 * i),
              (N = 4 * s),
              (H = 4 * l),
              (V = 8 * s),
              (T = 8 * l),
              (G = i * i),
              (g = s * s),
              (y = l * l),
              (W = u * u),
              (r = C * y + J * S + C * g - F * I),
              (d =
                N * W - U * S + 4 * G * s - P * I - N + V * g + V * y + N * k),
              (q =
                4 * G * l + P * S + H * W - U * I - H + T * g + T * y + H * k),
              (h = 4 * g * u - F * S + 4 * y * u - J * I),
              (c = (r * r + d * d + q * q + h * h) ** -0.5),
              (r *= c),
              (d *= c),
              (q *= c),
              (h *= c),
              (b -= a * r),
              (v -= a * d),
              (m -= a * q),
              (_ -= a * h)),
            (i += b * f),
            (s += v * f),
            (l += m * f),
            (u += _ * f),
            (c = (i * i + s * s + l * l + u * u) ** -0.5),
            (i *= c),
            (s *= c),
            (l *= c),
            (u *= c));
        }
        function w(E, A, x, S, I, k) {
          return {
            x: A * k - x * I,
            y: x * S - E * k,
            z: E * I - A * S,
          };
        }
        function R(E, A, x, S, I, k) {
          const c = -Math.atan2(E, Math.sqrt(A * A + x * x)),
            r = w(E, A, x, 1, 0, 0),
            d = w(1, 0, 0, r.x, r.y, r.z),
            q = Math.atan2(d.y, d.z),
            h = Math.cos(q),
            b = Math.sin(c),
            v = Math.sin(q),
            m = I * h - k * v,
            _ = S * Math.cos(c) + I * v * b + k * h * b;
          return {
            heading: -Math.atan2(m, _),
            pitch: c,
            roll: q,
          };
        }
        function B(E) {
          const A = Math.cos(E.heading * 0.5),
            x = Math.sin(E.heading * 0.5),
            S = Math.cos(E.pitch * 0.5),
            I = Math.sin(E.pitch * 0.5),
            k = Math.cos(E.roll * 0.5),
            c = Math.sin(E.roll * 0.5);
          return {
            w: k * S * A + c * I * x,
            x: c * S * A - k * I * x,
            y: k * I * A + c * S * x,
            z: k * S * x - c * I * A,
          };
        }
        function L(E, A, x, S, I, k) {
          const c = R(E, A, x, S, I, k),
            r = B(c),
            d = (r.w * r.w + r.x * r.x + r.y * r.y + r.z * r.z) ** -0.5;
          ((i = r.w * d),
            (s = r.x * d),
            (l = r.y * d),
            (u = r.z * d),
            (p = !0));
        }
        function j(E, A, x, S, I, k, c, r, d, q) {
          ((f = q || f), p || L(S, I, k, c, r, d));
          let h,
            b,
            v,
            m,
            _,
            P,
            F,
            J,
            U,
            C,
            N,
            H,
            V,
            T,
            G,
            g,
            y,
            W,
            le,
            se,
            X,
            Y,
            ae,
            Z,
            z,
            ce,
            D,
            K,
            ee,
            $,
            te,
            Q,
            O,
            he,
            re;
          if (
            c === void 0 ||
            r === void 0 ||
            d === void 0 ||
            (c === 0 && r === 0 && d === 0)
          ) {
            M(E, A, x, S, I, k);
            return;
          }
          ((P = 0.5 * (-s * E - l * A - u * x)),
            (F = 0.5 * (i * E + l * x - u * A)),
            (J = 0.5 * (i * A - s * x + u * E)),
            (U = 0.5 * (i * x + s * A - l * E)),
            (S === 0 && I === 0 && k === 0) ||
              ((h = (S * S + I * I + k * k) ** -0.5),
              (S *= h),
              (I *= h),
              (k *= h),
              (h = (c * c + r * r + d * d) ** -0.5),
              (c *= h),
              (r *= h),
              (d *= h),
              (H = 2 * i * c),
              (V = 2 * i * r),
              (T = 2 * i * d),
              (G = 2 * s * c),
              (se = 2 * i),
              (X = 2 * s),
              (Y = 2 * l),
              (ae = 2 * u),
              (Z = 2 * i * l),
              (z = 2 * l * u),
              (ce = i * i),
              (D = i * s),
              (K = i * l),
              (ee = i * u),
              ($ = s * s),
              (te = s * l),
              (Q = s * u),
              (O = l * l),
              (he = l * u),
              (re = u * u),
              (C =
                c * ce -
                V * u +
                T * l +
                c * $ +
                X * r * l +
                X * d * u -
                c * O -
                c * re),
              (N =
                H * u +
                r * ce -
                T * s +
                G * l -
                r * $ +
                r * O +
                Y * d * u -
                r * re),
              (g = Math.sqrt(C * C + N * N)),
              (y =
                -H * l +
                V * s +
                d * ce +
                G * u -
                d * $ +
                Y * r * u -
                d * O +
                d * re),
              (W = 2 * g),
              (le = 2 * y),
              (b =
                -Y * (2 * Q - Z - S) +
                X * (2 * D + z - I) -
                y * l * (g * (0.5 - O - re) + y * (Q - K) - c) +
                (-g * u + y * s) * (g * (te - ee) + y * (D + he) - r) +
                g * l * (g * (K + Q) + y * (0.5 - $ - O) - d)),
              (v =
                ae * (2 * Q - Z - S) +
                se * (2 * D + z - I) -
                4 * s * (1 - 2 * $ - 2 * O - k) +
                y * u * (g * (0.5 - O - re) + y * (Q - K) - c) +
                (g * l + y * i) * (g * (te - ee) + y * (D + he) - r) +
                (g * u - le * s) * (g * (K + Q) + y * (0.5 - $ - O) - d)),
              (m =
                -se * (2 * Q - Z - S) +
                ae * (2 * D + z - I) -
                4 * l * (1 - 2 * $ - 2 * O - k) +
                (-W * l - y * i) * (g * (0.5 - O - re) + y * (Q - K) - c) +
                (g * s + y * u) * (g * (te - ee) + y * (D + he) - r) +
                (g * i - le * l) * (g * (K + Q) + y * (0.5 - $ - O) - d)),
              (_ =
                X * (2 * Q - Z - S) +
                Y * (2 * D + z - I) +
                (-W * u + y * s) * (g * (0.5 - O - re) + y * (Q - K) - c) +
                (-g * i + y * l) * (g * (te - ee) + y * (D + he) - r) +
                g * s * (g * (K + Q) + y * (0.5 - $ - O) - d)),
              (h = (b * b + v * v + m * m + _ * _) ** -0.5),
              (b *= h),
              (v *= h),
              (m *= h),
              (_ *= h),
              (P -= a * b),
              (F -= a * v),
              (J -= a * m),
              (U -= a * _)),
            (i += P * f),
            (s += F * f),
            (l += J * f),
            (u += U * f),
            (h = (i * i + s * s + l * l + u * u) ** -0.5),
            (i *= h),
            (s *= h),
            (l *= h),
            (u *= h));
        }
        return {
          update: j,
          init: L,
          getQuaternion() {
            return {
              w: i,
              x: s,
              y: l,
              z: u,
            };
          },
        };
      })),
    ve
  );
}
var me, _e;
function Ue() {
  if (_e) return me;
  _e = 1;
  const e = 180 / Math.PI;
  function t(n) {
    n = n || {};
    const o = n.sampleInterval || 20,
      a = n.algorithm || 'Madgwick';
    let p;
    if (a === 'Mahony') p = Be();
    else if (a === 'Madgwick') p = Le();
    else throw new Error(`AHRS(): Algorithm not valid: ${a}`);
    const i = p(o, n),
      s = this;
    Object.keys(i).forEach((l) => (s[l] = i[l]));
  }
  return (
    (t.prototype.toVector = function () {
      const o = this.getQuaternion(),
        a = 2 * Math.acos(o.w),
        p = Math.sin(a / 2);
      return {
        angle: a,
        x: o.x / p,
        y: o.y / p,
        z: o.z / p,
      };
    }),
    (t.prototype.getEulerAngles = function () {
      const o = this.getQuaternion(),
        a = o.w * o.w,
        p = o.x * o.x,
        i = o.y * o.y,
        s = o.z * o.z;
      return {
        heading: Math.atan2(2 * (o.x * o.y + o.z * o.w), p - i - s + a),
        pitch: -Math.asin(2 * (o.x * o.z - o.y * o.w)),
        roll: Math.atan2(2 * (o.y * o.z + o.x * o.w), -p - i + s + a),
      };
    }),
    (t.prototype.getEulerAnglesDegrees = function () {
      const o = this.getEulerAngles();
      return {
        heading: o.heading * e,
        pitch: o.pitch * e,
        roll: o.roll * e,
      };
    }),
    (me = t),
    me
  );
}
var Ce = Ue();
const Re = /* @__PURE__ */ Fe(Ce);
function Ne(e, t) {
  let n;
  for (const o of e) {
    const a = t(o);
    a !== void 0 && (n = n === void 0 ? a : n + a);
  }
  return n;
}
function de(e, t = (n) => n) {
  const n = e == null ? 0 : e.length,
    o = Ne(e, t);
  return n ? o / n : Number.NaN;
}
function Pe(e) {
  let t;
  switch (e[0]) {
    case '8':
      t = 'full';
      break;
    case '4':
      t = 'medium';
      break;
    case '2':
      t = 'low';
      break;
    case '1':
      t = 'critical';
      break;
    case '0':
      t = 'empty';
      break;
    default:
      t = 'charging';
  }
  return t;
}
const He = {
    // biome-ignore lint/complexity/useSimpleNumberKeys:
    1: 'Left Joy-Con',
    // biome-ignore lint/complexity/useSimpleNumberKeys:
    2: 'Right Joy-Con',
    // biome-ignore lint/complexity/useSimpleNumberKeys:
    3: 'Pro Controller',
  },
  pe = 0.75,
  Oe = 0.0125,
  ge = Math.PI / 2;
function je(e, t, n, o) {
  const a = Date.now(),
    p = e.timestamp ? (a - e.timestamp) / 1e3 : 0;
  e.timestamp = a;
  const i = Math.sqrt(n.x ** 2 + n.y ** 2 + n.z ** 2);
  return (
    (e.alpha = (1 - Oe) * (e.alpha + t.z * p)),
    i !== 0 &&
      ((e.beta = pe * (e.beta + t.x * p) + (1 - pe) * ((n.x * ge) / i)),
      (e.gamma = pe * (e.gamma + t.y * p) + (1 - pe) * ((n.y * -ge) / i))),
    {
      alpha:
        o === 8198
          ? ((((-1 * (e.alpha * 180)) / Math.PI) * 430) % 90).toFixed(6)
          : ((((e.alpha * 180) / Math.PI) * 430) % 360).toFixed(6),
      beta: ((-1 * (e.beta * 180)) / Math.PI).toFixed(6),
      gamma:
        o === 8198
          ? ((-1 * (e.gamma * 180)) / Math.PI).toFixed(6)
          : ((e.gamma * 180) / Math.PI).toFixed(6),
    }
  );
}
function Je(e) {
  const t = 180 / Math.PI,
    n = e.w * e.w,
    o = e.x * e.x,
    a = e.y * e.y,
    p = e.z * e.z;
  return {
    alpha: (t * Math.atan2(2 * (e.x * e.y + e.z * e.w), o - a - p + n)).toFixed(
      6
    ),
    beta: (t * -Math.asin(2 * (e.x * e.z - e.y * e.w))).toFixed(6),
    gamma: (
      t * Math.atan2(2 * (e.y * e.z + e.x * e.w), -o - a + p + n)
    ).toFixed(6),
  };
}
function ne(e) {
  const t = new DataView(e.buffer);
  return Number.parseFloat((244e-6 * t.getInt16(0, !0)).toFixed(6));
}
function oe(e) {
  const t = new DataView(e.buffer);
  return Number.parseFloat((0.06103 * t.getInt16(0, !0)).toFixed(6));
}
function ie(e) {
  const t = new DataView(e.buffer);
  return Number.parseFloat((1694e-7 * t.getInt16(0, !0)).toFixed(6));
}
function Qe(e) {
  const t = e.slice(15, 26),
    n = t.slice(0, 1)[0],
    o = t.slice(1, 2)[0],
    a = t.slice(2, 3),
    p = t.slice(4, 10),
    i = [];
  for (const u of p) i.push(u.toString(16));
  const s = t.slice(11, 12);
  return {
    _raw: t.slice(0, 12),
    _hex: t.slice(0, 12),
    firmwareVersion: {
      major: n,
      minor: o,
    },
    type: He[a[0]],
    macAddress: i.join(':'),
    spiColorInUse: s[0] === 1,
  };
}
function Te(e, t) {
  return {
    _raw: e.slice(0, 1),
    // index 0
    _hex: t.slice(0, 1),
  };
}
function $e(e, t) {
  return {
    _raw: e.slice(1, 2),
    // index 1
    _hex: t.slice(1, 2),
  };
}
function Ge(e, t) {
  return {
    _raw: e.slice(2, 3),
    // high nibble
    _hex: t.slice(2, 3),
    level: Pe(t.slice(2, 3)),
  };
}
function De(e, t) {
  return {
    _raw: e.slice(2, 3),
    // low nibble
    _hex: t.slice(2, 3),
  };
}
function Ke(e, t) {
  return {
    _raw: e.slice(1, 3),
    // index 1,2
    _hex: t.slice(1, 3),
  };
}
function Ve(e, t) {
  return {
    _raw: e.slice(3, 6),
    // index 3,4,5
    _hex: t.slice(3, 6),
    // Byte 3 (Right Joy-Con)
    y: !!(1 & e[3]),
    x: !!(2 & e[3]),
    b: !!(4 & e[3]),
    a: !!(8 & e[3]),
    r: !!(64 & e[3]),
    zr: !!(128 & e[3]),
    // Byte 5 (Left Joy-Con)
    down: !!(1 & e[5]),
    up: !!(2 & e[5]),
    right: !!(4 & e[5]),
    left: !!(8 & e[5]),
    l: !!(64 & e[5]),
    zl: !!(128 & e[5]),
    // Byte 3,5 (Shared)
    sr: !!(16 & e[3]) || !!(16 & e[5]),
    sl: !!(32 & e[3]) || !!(32 & e[5]),
    // Byte 4 (Shared)
    minus: !!(1 & e[4]),
    plus: !!(2 & e[4]),
    rightStick: !!(4 & e[4]),
    leftStick: !!(8 & e[4]),
    home: !!(16 & e[4]),
    capture: !!(32 & e[4]),
    chargingGrip: !!(128 & e[4]),
  };
}
function We(e, t) {
  return {
    _raw: e.slice(3, 4),
    // index 3
    _hex: t.slice(3, 4),
  };
}
function Xe(e, t) {
  let n = e[6] | ((e[7] & 15) << 8);
  n = (n / 1995 - 1) * 2;
  let o = ((e[7] >> 4) | (e[8] << 4)) * -1;
  return (
    (o = (o / 2220 + 1) * 2),
    {
      _raw: e.slice(6, 9),
      // index 6,7,8
      _hex: t.slice(6, 9),
      horizontal: n.toFixed(1),
      vertical: o.toFixed(1),
    }
  );
}
function Ye(e, t) {
  let n = e[9] | ((e[10] & 15) << 8);
  n = (n / 1995 - 1) * 2;
  let o = ((e[10] >> 4) | (e[11] << 4)) * -1;
  return (
    (o = (o / 2220 + 1) * 2),
    {
      _raw: e.slice(9, 12),
      // index 9,10,11
      _hex: t.slice(9, 12),
      horizontal: n.toFixed(1),
      vertical: o.toFixed(1),
    }
  );
}
function Ze(e, t) {
  return {
    _raw: e.slice(4),
    // index 4
    _hex: t.slice(4),
  };
}
function ze(e, t) {
  return {
    _raw: e.slice(12, 13),
    // index 12
    _hex: t.slice(12, 13),
  };
}
function et(e, t) {
  return {
    _raw: e.slice(13, 14),
    // index 13
    _hex: t.slice(13, 14),
  };
}
function tt(e, t) {
  return {
    _raw: e.slice(14, 15),
    // index 14
    _hex: t.slice(14, 15),
  };
}
function nt(e, t) {
  return {
    _raw: e.slice(15),
    // index 15 ~
    _hex: t.slice(15),
  };
}
function ot(e, t) {
  return [
    {
      x: {
        _raw: e.slice(13, 15),
        // index 13,14
        _hex: t.slice(13, 15),
        acc: ne(e.slice(13, 15)),
      },
      y: {
        _raw: e.slice(15, 17),
        // index 15,16
        _hex: t.slice(15, 17),
        acc: ne(e.slice(15, 17)),
      },
      z: {
        _raw: e.slice(17, 19),
        // index 17,18
        _hex: t.slice(17, 19),
        acc: ne(e.slice(17, 19)),
      },
    },
    {
      x: {
        _raw: e.slice(25, 27),
        // index 25,26
        _hex: t.slice(25, 27),
        acc: ne(e.slice(25, 27)),
      },
      y: {
        _raw: e.slice(27, 29),
        // index 27,28
        _hex: t.slice(27, 29),
        acc: ne(e.slice(27, 29)),
      },
      z: {
        _raw: e.slice(29, 31),
        // index 29,30
        _hex: t.slice(29, 31),
        acc: ne(e.slice(29, 31)),
      },
    },
    {
      x: {
        _raw: e.slice(37, 39),
        // index 37,38
        _hex: t.slice(37, 39),
        acc: ne(e.slice(37, 39)),
      },
      y: {
        _raw: e.slice(39, 41),
        // index 39,40
        _hex: t.slice(39, 41),
        acc: ne(e.slice(39, 41)),
      },
      z: {
        _raw: e.slice(41, 43),
        // index 41,42
        _hex: t.slice(41, 43),
        acc: ne(e.slice(41, 43)),
      },
    },
  ];
}
function it(e, t) {
  return [
    [
      {
        _raw: e.slice(19, 21),
        // index 19,20
        _hex: t.slice(19, 21),
        dps: oe(e.slice(19, 21)),
        rps: ie(e.slice(19, 21)),
      },
      {
        _raw: e.slice(21, 23),
        // index 21,22
        _hex: t.slice(21, 23),
        dps: oe(e.slice(21, 23)),
        rps: ie(e.slice(21, 23)),
      },
      {
        _raw: e.slice(23, 25),
        // index 23,24
        _hex: t.slice(23, 25),
        dps: oe(e.slice(23, 25)),
        rps: ie(e.slice(23, 25)),
      },
    ],
    [
      {
        _raw: e.slice(31, 33),
        // index 31,32
        _hex: t.slice(31, 33),
        dps: oe(e.slice(31, 33)),
        rps: ie(e.slice(31, 33)),
      },
      {
        _raw: e.slice(33, 35),
        // index 33,34
        _hex: t.slice(33, 35),
        dps: oe(e.slice(33, 35)),
        rps: ie(e.slice(33, 35)),
      },
      {
        _raw: e.slice(35, 37),
        // index 35,36
        _hex: t.slice(35, 37),
        dps: oe(e.slice(35, 37)),
        rps: ie(e.slice(35, 37)),
      },
    ],
    [
      {
        _raw: e.slice(43, 45),
        // index 43,44
        _hex: t.slice(43, 45),
        dps: oe(e.slice(43, 45)),
        rps: ie(e.slice(43, 45)),
      },
      {
        _raw: e.slice(45, 47),
        // index 45,46
        _hex: t.slice(45, 47),
        dps: oe(e.slice(45, 47)),
        rps: ie(e.slice(45, 47)),
      },
      {
        _raw: e.slice(47, 49),
        // index 47,48
        _hex: t.slice(47, 49),
        dps: oe(e.slice(47, 49)),
        rps: ie(e.slice(47, 49)),
      },
    ],
  ];
}
function st(e) {
  const t = 5e-3 * e.length;
  return {
    x: Number.parseFloat((de(e.map(([o]) => o)) * t).toFixed(6)),
    y: Number.parseFloat((de(e.map(([, o]) => o)) * t).toFixed(6)),
    z: Number.parseFloat((de(e.map(([, , o]) => o)) * t).toFixed(6)),
  };
}
function ye(e) {
  const t = 5e-3 * e.length,
    n = [
      de(e.map((o) => o[0])),
      de(e.map((o) => o[1])),
      de(e.map((o) => o[2])),
    ].map((o) => Number.parseFloat((o * t).toFixed(6)));
  return {
    x: n[0],
    y: n[1],
    z: n[2],
  };
}
function ct(e, t) {
  return {
    _raw: e.slice(38, 2),
    _hex: t.slice(38, 2),
    strain: new DataView(e.buffer, 39, 2).getInt16(0, !0),
  };
}
function rt(e, t) {
  const n = new (Object.getPrototypeOf(e).constructor)(e.length + t.length);
  return (n.set(e, 0), n.set(t, e.length), n);
}
class we extends EventTarget {
  /**
   * Creates an instance of the JoyCon class.
   *
   * @param device - The HIDDevice instance representing the connected Joy-Con controller.
   *
   * Initializes the device and sets up the initial state for sensor values,
   * including timestamp, alpha, beta, and gamma.
   */
  constructor(n) {
    super();
    ue(this, 'eventListenerAttached', !1);
    ue(this, 'quaternion');
    ue(this, 'madgwick');
    ue(this, 'device');
    ue(this, 'lastValues');
    ue(this, 'ledstate', 0);
    ((this.device = n),
      (this.lastValues = {
        timestamp: null,
        alpha: 0,
        beta: 0,
        gamma: 0,
      }),
      n.productId === 8198
        ? ((this.madgwick = new Re({
            sampleInterval: 10,
            algorithm: 'Madgwick',
          })),
          (this.quaternion = this.madgwick.getQuaternion()))
        : n.productId === 8199 &&
          ((this.madgwick = new Re({
            sampleInterval: 10,
            algorithm: 'Madgwick',
          })),
          (this.quaternion = this.madgwick.getQuaternion())));
  }
  /**
   * Registers an event listener for a specific JoyCon event type.
   *
   * @typeParam K - The type of the JoyCon event to listen for, constrained to the keys of `JoyConEvents`.
   * @param type - The event type to listen for.
   * @param listener - The callback function that will be invoked when the event is dispatched.
   *                   The `this` context within the listener is bound to the current `JoyCon` instance,
   *                   and the event object is of the type corresponding to the event type.
   * @param options - Optional. An options object specifying characteristics about the event listener,
   *                  or a boolean indicating whether events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
   */
  on(n, o, a) {
    super.addEventListener(n, o, a);
  }
  /**
   * Opens a connection to the Joy-Con device if it is not already opened,
   * and attaches an event listener for input reports.
   *
   * @returns {Promise<void>} A promise that resolves when the device is opened and the event listener is attached.
   */
  async open() {
    (this.device.opened || (await this.device.open()),
      this.device.addEventListener(
        'inputreport',
        this._onInputReport.bind(this)
      ));
  }
  /**
   * Sends a request to the Joy-Con device to retrieve device information.
   *
   * This method sends a specific output report to the device and listens for a
   * "deviceinfo" event. When the event is received, it resolves with the device
   * information, excluding any raw or hexadecimal data fields.
   *
   * @returns A promise that resolves with the cleaned device information object.
   */
  async getRequestDeviceInfo() {
    const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, ...[2]],
      p = new Promise((i) => {
        const s = ({ detail: l }) => {
          const { _raw: u, _hex: f, ...M } = l;
          i(M);
        };
        this.addEventListener('deviceinfo', s, {
          once: !0,
        });
      });
    return (await this.device.sendReport(1, new Uint8Array(a)), p);
  }
  /**
   * Requests the current battery level from the Joy-Con device.
   *
   * Sends a specific output report to the device to query the battery level,
   * then listens for a "batterylevel" custom event. Once the event is received,
   * it resolves with the battery level information, excluding any raw or hex data.
   *
   * @returns {Promise<unknown>} A promise that resolves with the cleaned battery level data.
   */
  async getBatteryLevel() {
    const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, ...[80]],
      p = new Promise((i) => {
        const s = ({ detail: l }) => {
          const { _raw: u, _hex: f, ...M } = l;
          i(M);
        };
        this.addEventListener('batterylevel', s, {
          once: !0,
        });
      });
    return (await this.device.sendReport(1, new Uint8Array(a)), p);
  }
  /**
   * Enables the Simple HID mode on the connected Joy-Con device.
   *
   * This method sends a specific output report to the device to switch it into
   * Simple HID mode, which allows for basic input/output communication.
   *
   * @returns {Promise<void>} A promise that resolves once the command has been sent.
   * @throws {DOMException} If the report cannot be sent to the device.
   */
  async enableSimpleHIDMode() {
    const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, ...[3, 63]];
    await this.device.sendReport(1, new Uint8Array(a));
  }
  /**
   * Enables the "Standard Full Mode" on the Joy-Con device by sending the appropriate subcommand.
   *
   * This mode allows the Joy-Con to report all standard input data, including button presses,
   * analog stick positions, and sensor data. The method constructs the required data packet
   * and sends it to the device using the HID report protocol.
   *
   * @returns {Promise<void>} A promise that resolves once the command has been sent.
   * @throws {Error} If the device communication fails.
   */
  async enableStandardFullMode() {
    const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, ...[3, 48]];
    await this.device.sendReport(1, new Uint8Array(a));
  }
  /**
   * Enables the IMU (Inertial Measurement Unit) mode on the Joy-Con device.
   *
   * Sends a subcommand to the device to activate the IMU, which allows the Joy-Con
   * to start reporting motion sensor data such as accelerometer and gyroscope readings.
   *
   * @returns A promise that resolves when the command has been sent to the device.
   * @throws Will throw an error if sending the report to the device fails.
   */
  async enableIMUMode() {
    const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, ...[64, 1]];
    await this.device.sendReport(1, new Uint8Array(a));
  }
  /**
   * Disables the IMU (Inertial Measurement Unit) mode on the connected Joy-Con device.
   *
   * Sends a subcommand to the device to turn off IMU functionality, which includes
   * the accelerometer and gyroscope sensors. This can be useful for reducing power
   * consumption or when IMU data is not needed.
   *
   * @returns A promise that resolves when the command has been sent to the device.
   * @throws Will throw an error if sending the report to the device fails.
   */
  async disableIMUMode() {
    const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, ...[64, 0]];
    await this.device.sendReport(1, new Uint8Array(a));
  }
  /**
   * Enables the vibration feature on the connected Joy-Con device.
   *
   * This method sends a specific output report to the device to activate vibration.
   * It constructs the required data packet, including the subcommand for enabling vibration,
   * and transmits it using the WebHID API.
   *
   * @returns A promise that resolves when the vibration command has been sent.
   * @throws {DOMException} If sending the report to the device fails.
   */
  async enableVibration() {
    const a = [0, 0, 1, 64, 64, 0, 1, 64, 64, ...[72, 1]];
    await this.device.sendReport(1, new Uint8Array(a));
  }
  /**
   * Disables the vibration feature on the connected Joy-Con controller.
   *
   * Sends a specific output report to the device to turn off vibration.
   * This method constructs the appropriate data packet and sends it using the WebHID API.
   *
   * @returns A promise that resolves when the vibration disable command has been sent.
   */
  async disableVibration() {
    const a = [0, 0, 1, 64, 64, 0, 1, 64, 64, ...[72, 0]];
    await this.device.sendReport(1, new Uint8Array(a));
  }
  /**
   * Enables RingCon.
   *
   * @memberof JoyCon
   * @seeAlso https://github.com/mascii/demo-of-ring-con-with-web-hid
   */
  async enableRingCon() {
    await xe(this.device);
  }
  /**
   * Enables the USB HID joystick report mode for the connected device.
   *
   * This method checks if the device supports a specific output report (with reportId 0x80).
   * If supported, it sends a sequence of USB HID reports to the device to enable joystick reporting.
   * The sequence of reports is required to properly initialize the device for joystick input over USB.
   *
   * @returns {Promise<void>} A promise that resolves once the reports have been sent.
   */
  async enableUSBHIDJoystickReport() {
    var o;
    ((o = this.device.collections[0].outputReports) == null
      ? void 0
      : o.find((a) => a.reportId === 128)) != null &&
      (await this.device.sendReport(128, new Uint8Array([1])),
      await this.device.sendReport(128, new Uint8Array([2])),
      await this.device.sendReport(1, new Uint8Array([3])),
      await this.device.sendReport(128, new Uint8Array([4])));
  }
  /**
   * Sends a rumble (vibration) command to the Joy-Con device with the specified frequency and amplitude parameters.
   *
   * @param lowFrequency - The low frequency value for the rumble effect (in Hz). Must be between 40.875885 and 626.286133.
   * @param highFrequency - The high frequency value for the rumble effect (in Hz). Must be between 81.75177 and 1252.572266.
   * @param amplitude - The amplitude (strength) of the rumble effect. Must be between 0 (off) and 1 (maximum).
   * @returns A promise that resolves when the rumble command has been sent to the device.
   *
   * @remarks
   * This method encodes the frequency and amplitude values into the format expected by the Joy-Con hardware,
   * clamps the input values to their valid ranges, and sends the resulting data packet via HID.
   * The rumble effect is applied to both left and right motors of the Joy-Con.
   */
  async rumble(n, o, a) {
    const p = (B, L, j) => Math.min(Math.max(B, L), j),
      s = new Uint8Array(9);
    s[0] = 0;
    let l = p(n, 40.875885, 626.286133),
      u = p(o, 81.75177, 1252.572266);
    ((u = (Math.round(32 * Math.log2(u * 0.1)) - 96) * 4),
      (l = Math.round(32 * Math.log2(l * 0.1)) - 64));
    const f = p(a, 0, 1);
    let M;
    f === 0
      ? (M = 0)
      : f < 0.117
        ? (M = (Math.log2(f * 1e3) * 32 - 96) / (5 - f ** 2) - 1)
        : f < 0.23
          ? (M = Math.log2(f * 1e3) * 32 - 96 - 92)
          : (M = (Math.log2(f * 1e3) * 32 - 96) * 2 - 246);
    let w = Math.round(M) * 0.5;
    const R = w % 2;
    (R > 0 && --w,
      (w = w >> 1),
      (w += 64),
      R > 0 && (w |= 32768),
      (s[1] = u & 255),
      (s[2] = M + ((u >>> 8) & 255)),
      (s[3] = l + ((w >>> 8) & 255)),
      (s[4] += w & 255));
    for (let B = 0; B < 4; B++) s[5 + B] = s[1 + B];
    await this.device.sendReport(16, new Uint8Array(s));
  }
  /**
   * Sets the LED state on the Joy-Con device.
   *
   * Sends a subcommand to the device to control the LED indicators.
   *
   * @param n - The LED state value to set. The value determines which LEDs are turned on or off.
   * @returns A promise that resolves when the command has been sent to the device.
   */
  async setLEDState(n) {
    const o = [0, 0, 0, 0, 0, 0, 0, 0],
      a = [48, n];
    await this.device.sendReport(1, new Uint8Array([...o, 0, ...a]));
  }
  /**
   * Sets the specified LED on the Joy-Con controller.
   *
   * Updates the internal LED state by turning on the LED at the given index `n`,
   * then sends the updated state to the device.
   *
   * @param n - The index of the LED to turn on (0-based).
   * @returns A promise that resolves when the LED state has been updated.
   */
  async setLED(n) {
    ((this.ledstate |= 1 << n), await this.setLEDState(this.ledstate));
  }
  /**
   * Resets (turns off) the LED at the specified index by clearing its corresponding bits
   * in the internal LED state and updates the device.
   *
   * @param n - The index of the LED to reset (0-based).
   * @returns A promise that resolves when the LED state has been updated.
   */
  async resetLED(n) {
    ((this.ledstate &= ~((1 << n) | (1 << (4 + n)))),
      await this.setLEDState(this.ledstate));
  }
  /**
   * Blinks the specified LED on the Joy-Con controller.
   *
   * This method updates the internal LED state by first turning off the LED at position `n`,
   * then setting the corresponding blink bit for that LED. It then sends the updated state
   * to the controller.
   *
   * @param n - The index of the LED to blink (typically 0-3).
   * @returns A promise that resolves when the LED state has been updated.
   */
  async blinkLED(n) {
    ((this.ledstate &= ~(1 << n)),
      (this.ledstate |= 1 << (4 + n)),
      await this.setLEDState(this.ledstate));
  }
  /**
   * Handles the HID input report event from a Joy-Con device, parses the incoming data,
   * and emits structured input events based on the report type.
   *
   * @param event - The HID input report event containing the data, reportId, and device.
   * @remarks
   * This method processes different types of input reports (e.g., 0x3f, 0x21, 0x30) by parsing
   * the raw data using various PacketParser methods. It extracts information such as button status,
   * analog stick positions, battery level, accelerometer and gyroscope data, and device info.
   * The parsed data is then dispatched to relevant handlers and listeners.
   *
   * @private
   */
  _onInputReport({ data: n, reportId: o, device: a }) {
    var l, u;
    if (!n) return;
    const p = rt(new Uint8Array([o]), new Uint8Array(n.buffer)),
      i = Array.from(p)
        .map((f) => f.toString(16).padStart(2, '0'))
        .join('');
    let s = {
      inputReportID: Te(p, i),
    };
    switch (o) {
      case 63: {
        s = {
          ...s,
          buttonStatus: Ke(p, i),
          analogStick: We(p, i),
          filter: Ze(p, i),
        };
        break;
      }
      case 33:
      case 48: {
        if (
          ((s = {
            ...s,
            timer: $e(p, i),
            batteryLevel: Ge(p, i),
            connectionInfo: De(p, i),
            buttonStatus: Ve(p, i),
            analogStickLeft: Xe(p, i),
            analogStickRight: Ye(p, i),
            vibrator: ze(p, i),
          }),
          o === 33 &&
            (s = {
              ...s,
              ack: et(p, i),
              subcommandID: tt(p, i),
              subcommandReplyData: nt(p, i),
              deviceInfo: Qe(p),
            }),
          o === 48)
        ) {
          const f = ot(p, i),
            M = it(p, i),
            w = ye(M.map((L) => L.map((j) => j.rps ?? 0))),
            R = ye(M.map((L) => L.map((j) => j.dps ?? 0))),
            B = st(f.map((L) => [L.x.acc ?? 0, L.y.acc ?? 0, L.z.acc ?? 0]));
          (this.madgwick.update(w.x, w.y, w.z, B.x, B.y, B.z),
            (s = {
              ...s,
              accelerometers: f,
              gyroscopes: M,
              actualAccelerometer: B,
              actualGyroscope: { dps: R, rps: w },
              actualOrientation: je(this.lastValues, w, B, a.productId),
              actualOrientationQuaternion: Je(this.quaternion),
              quaternion: this.quaternion,
              ringCon: ct(p, i),
            }));
        }
        break;
      }
    }
    ((l = s.deviceInfo) != null &&
      l.type &&
      this._receiveDeviceInfo(s.deviceInfo),
      (u = s.batteryLevel) != null &&
        u.level &&
        this._receiveBatteryLevel(s.batteryLevel),
      this._receiveInputEvent(s));
  }
  /**
   * Dispatches a "deviceinfo" custom event with the provided device information as its detail.
   *
   * @param deviceInfo - The information about the device to be included in the event detail.
   */
  _receiveDeviceInfo(n) {
    this.dispatchEvent(new CustomEvent('deviceinfo', { detail: n }));
  }
  /**
   * Dispatches a "batterylevel" custom event with the provided battery level detail.
   *
   * @param batteryLevel - The battery level information to include in the event detail.
   */
  _receiveBatteryLevel(n) {
    this.dispatchEvent(new CustomEvent('batterylevel', { detail: n }));
  }
  // To be overridden by subclasses
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _receiveInputEvent(n) {}
}
class lt extends we {
  /**
   * Handles an input event packet by removing specific button statuses and dispatching a custom "hidinput" event.
   *
   * @param packet - The input event data containing button statuses and other information.
   *
   * The method sets the following button statuses to `undefined` in the `buttonStatus` object:
   * - x
   * - y
   * - b
   * - a
   * - plus
   * - r
   * - zr
   * - home
   * - rightStick
   *
   * After modifying the packet, it dispatches a `CustomEvent` named "hidinput" with the modified packet as its detail.
   */
  _receiveInputEvent(t) {
    const n = t.buttonStatus;
    ((n.x = void 0),
      (n.y = void 0),
      (n.b = void 0),
      (n.a = void 0),
      (n.plus = void 0),
      (n.r = void 0),
      (n.zr = void 0),
      (n.home = void 0),
      (n.rightStick = void 0),
      this.dispatchEvent(new CustomEvent('hidinput', { detail: t })));
  }
}
class at extends we {
  /**
   * Handles an input event packet from the Joy-Con device, sanitizes specific button statuses by setting them to `undefined`,
   * and dispatches a "hidinput" custom event with the modified packet as its detail.
   *
   * @param packet - The input event data received from the Joy-Con, expected to contain a `buttonStatus` property.
   */
  _receiveInputEvent(t) {
    const n = t.buttonStatus;
    ((n.up = void 0),
      (n.down = void 0),
      (n.left = void 0),
      (n.right = void 0),
      (n.minus = void 0),
      (n.l = void 0),
      (n.zl = void 0),
      (n.capture = void 0),
      (n.leftStick = void 0),
      this.dispatchEvent(new CustomEvent('hidinput', { detail: t })));
  }
}
class ut extends we {
  /**
   * Dispatches a "hidinput" custom event with the provided packet as its detail.
   *
   * @param packet - The input data received from the HID device.
   */
  _receiveInputEvent(t) {
    this.dispatchEvent(new CustomEvent('hidinput', { detail: t }));
  }
}
const dt = async (e) => {
    let t = null;
    return (
      e.productId === 8198
        ? (t = new lt(e))
        : e.productId === 8199 &&
          e.productName === 'Joy-Con (R)' &&
          (t = new at(e)),
      t || (t = new ut(e)),
      await t.open(),
      await t.enableUSBHIDJoystickReport(),
      await t.enableStandardFullMode(),
      await t.enableIMUMode(),
      t
    );
  },
  Se = /* @__PURE__ */ new Map(),
  be = [],
  ke = (e) => {
    const t = be.indexOf(e);
    return t >= 0 ? t : (be.push(e), be.length - 1);
  },
  qe = async (e) => {
    const t = ke(e);
    (console.log(
      `HID connected: ${t} ${e.productId.toString(16)} ${e.productName}`
    ),
      Se.set(t, await dt(e)));
  },
  ht = async (e) => {
    const t = ke(e);
    (console.log(
      `HID disconnected: ${t} ${e.productId.toString(16)} ${e.productName}`
    ),
      Se.delete(t));
  };
navigator.hid.addEventListener('connect', async ({ device: e }) => {
  qe(e);
});
navigator.hid.addEventListener('disconnect', ({ device: e }) => {
  ht(e);
});
document.addEventListener('DOMContentLoaded', async () => {
  const e = await navigator.hid.getDevices();
  for (const t of e) await qe(t);
});
const ft = async () => {
  const e = [
    {
      vendorId: 1406,
      // Nintendo Co., Ltd
    },
  ];
  try {
    const [t] = await navigator.hid.requestDevice({ filters: e });
    if (!t) return;
    await qe(t);
  } catch (t) {
    t instanceof Error ? console.error(t.name, t.message) : console.error(t);
  }
};
export {
  ut as GeneralController,
  lt as JoyConLeft,
  at as JoyConRight,
  ft as connectJoyCon,
  Se as connectedJoyCons,
};
