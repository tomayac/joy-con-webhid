var Se = Object.defineProperty;
var Ae = (e, t, n) => t in e ? Se(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ne = (e, t, n) => Ae(e, typeof t != "symbol" ? t + "" : t, n);
const Ee = async (e) => {
  const t = ({
    subcommand: s,
    expectedReport: r,
    timeoutErrorMessage: _ = "timeout."
  }) => (w) => new Promise((g, M) => {
    const T = setTimeout(() => {
      w.removeEventListener("inputreport", R), M(new Error(_));
    }, 5e3), R = (S) => {
      const d = S;
      if (d.reportId !== 33)
        return;
      const v = new Uint8Array(d.data.buffer);
      for (const [f, y] of Object.entries(r))
        if (v[Number(f) - 1] !== y)
          return;
      w.removeEventListener("inputreport", R), clearTimeout(T), setTimeout(g, 50);
    };
    w.addEventListener("inputreport", R), (async () => await w.sendReport(
      1,
      new Uint8Array([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        ...s
      ])
    ))();
  }), n = t({
    subcommand: [34, 1],
    expectedReport: {
      13: 128,
      14: 34
    }
  }), c = t({
    subcommand: [
      33,
      33,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      243
    ],
    expectedReport: {
      14: 33
    }
  }), l = t({
    subcommand: [89],
    expectedReport: {
      14: 89,
      16: 32
    },
    timeoutErrorMessage: "ring-con not found."
  }), o = t({
    subcommand: [
      92,
      6,
      3,
      37,
      6,
      0,
      0,
      0,
      0,
      28,
      22,
      237,
      52,
      54,
      0,
      0,
      0,
      10,
      100,
      11,
      230,
      169,
      34,
      0,
      0,
      4,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      144,
      168,
      225,
      52,
      54
    ],
    expectedReport: {
      14: 92
    }
  }), i = t({
    subcommand: [90, 4, 1, 1, 2],
    expectedReport: {
      14: 90
    }
  });
  await n(e), await c(e), await l(e), await o(e), await i(e);
};
function we(e, t) {
  const n = 1e3 / e, c = 0.4;
  let l = !0, o = 1, i = 0, s = 0, r = 0, _ = 1 / n;
  function w(d, v, f, y, x, I) {
    let a, u, b, L, m, E, k, B, F, O, K, V, W, X, j, H, Y, Z, ee, p, h, te;
    if (E = 0.5 * (-i * d - s * v - r * f), k = 0.5 * (o * d + s * f - r * v), B = 0.5 * (o * v - i * f + r * d), F = 0.5 * (o * f + i * v - s * d), !(y === 0 && x === 0 && I === 0)) {
      a = (y * y + x * x + I * I) ** -0.5;
      const G = y * a, Q = x * a, $ = I * a;
      O = 2 * o, K = 2 * i, V = 2 * s, W = 2 * r, X = 4 * o, j = 4 * i, H = 4 * s, Y = 8 * i, Z = 8 * s, ee = o * o, p = i * i, h = s * s, te = r * r, u = X * h + V * G + X * p - K * Q, b = j * te - W * G + 4 * ee * i - O * Q - j + Y * p + Y * h + j * $, L = 4 * ee * s + O * G + H * te - W * Q - H + Z * p + Z * h + H * $, m = 4 * p * r - K * G + 4 * h * r - V * Q, a = (u * u + b * b + L * L + m * m) ** -0.5, u *= a, b *= a, L *= a, m *= a, E -= c * u, k -= c * b, B -= c * L, F -= c * m;
    }
    o += E * _, i += k * _, s += B * _, r += F * _, a = (o * o + i * i + s * s + r * r) ** -0.5, o *= a, i *= a, s *= a, r *= a;
  }
  function g(d, v, f, y, x, I) {
    return {
      x: v * I - f * x,
      y: f * y - d * I,
      z: d * x - v * y
    };
  }
  function M(d, v, f, y, x, I) {
    const a = -Math.atan2(d, Math.sqrt(v * v + f * f)), u = g(d, v, f, 1, 0, 0), b = g(1, 0, 0, u.x, u.y, u.z), L = Math.atan2(b.y, b.z), m = Math.cos(L), E = Math.sin(a), k = Math.sin(L), B = x * m - I * k, F = y * Math.cos(a) + x * k * E + I * m * E;
    return {
      heading: -Math.atan2(B, F),
      pitch: a,
      roll: L
    };
  }
  function T(d) {
    const v = Math.cos(d.heading * 0.5), f = Math.sin(d.heading * 0.5), y = Math.cos(d.pitch * 0.5), x = Math.sin(d.pitch * 0.5), I = Math.cos(d.roll * 0.5), a = Math.sin(d.roll * 0.5);
    return {
      w: I * y * v + a * x * f,
      x: a * y * v - I * x * f,
      y: I * x * v + a * y * f,
      z: I * y * f - a * x * v
    };
  }
  function R(d, v, f, y, x, I) {
    const a = M(d, v, f, y, x, I), u = T(a), b = (u.w * u.w + u.x * u.x + u.y * u.y + u.z * u.z) ** -0.5;
    o = u.w * b, i = u.x * b, s = u.y * b, r = u.z * b, l = !0;
  }
  function S(d, v, f, y, x, I, a, u, b, L) {
    _ = L ?? _, l || R(y, x, I, a ?? 0, u ?? 0, b ?? 0);
    let m, E, k, B, F, O, K, V, W, X, j, H, Y, Z, ee, p, h, te, G, Q, $, ie, be, ce, re, he, U, N, le, C, ae, A, q, ue, D;
    if (a === void 0 || u === void 0 || b === void 0 || a === 0 && u === 0 && b === 0) {
      w(d, v, f, y, x, I);
      return;
    }
    if (O = 0.5 * (-i * d - s * v - r * f), K = 0.5 * (o * d + s * f - r * v), V = 0.5 * (o * v - i * f + r * d), W = 0.5 * (o * f + i * v - s * d), !(y === 0 && x === 0 && I === 0)) {
      m = (y * y + x * x + I * I) ** -0.5;
      const me = y * m, ve = x * m, Ie = I * m;
      m = (a * a + u * u + b * b) ** -0.5;
      const oe = a * m, de = u * m, pe = b * m;
      H = 2 * o * oe, Y = 2 * o * de, Z = 2 * o * pe, ee = 2 * i * oe, Q = 2 * o, $ = 2 * i, ie = 2 * s, be = 2 * r, ce = 2 * o * s, re = 2 * s * r, he = o * o, U = o * i, N = o * s, le = o * r, C = i * i, ae = i * s, A = i * r, q = s * s, ue = s * r, D = r * r, X = a * he - Y * r + Z * s + a * C + $ * u * s + $ * b * r - a * q - a * D, j = H * r + u * he - Z * i + ee * s - u * C + u * q + ie * b * r - u * D, p = Math.sqrt(X * X + j * j), h = -H * s + Y * i + b * he + ee * r - b * C + ie * u * r - b * q + b * D, te = 2 * p, G = 2 * h, E = -ie * (2 * A - ce - me) + $ * (2 * U + re - ve) - h * s * (p * (0.5 - q - D) + h * (A - N) - oe) + (-p * r + h * i) * (p * (ae - le) + h * (U + ue) - de) + p * s * (p * (N + A) + h * (0.5 - C - q) - pe), k = be * (2 * A - ce - me) + Q * (2 * U + re - ve) - 4 * i * (1 - 2 * C - 2 * q - Ie) + h * r * (p * (0.5 - q - D) + h * (A - N) - oe) + (p * s + h * o) * (p * (ae - le) + h * (U + ue) - de) + (p * r - G * i) * (p * (N + A) + h * (0.5 - C - q) - pe), B = -Q * (2 * A - ce - me) + be * (2 * U + re - ve) - 4 * s * (1 - 2 * C - 2 * q - Ie) + (-te * s - h * o) * (p * (0.5 - q - D) + h * (A - N) - oe) + (p * i + h * r) * (p * (ae - le) + h * (U + ue) - de) + (p * o - G * s) * (p * (N + A) + h * (0.5 - C - q) - pe), F = $ * (2 * A - ce - me) + ie * (2 * U + re - ve) + (-te * r + h * i) * (p * (0.5 - q - D) + h * (A - N) - oe) + (-p * o + h * s) * (p * (ae - le) + h * (U + ue) - de) + p * i * (p * (N + A) + h * (0.5 - C - q) - pe), m = (E * E + k * k + B * B + F * F) ** -0.5, E *= m, k *= m, B *= m, F *= m, O -= c * E, K -= c * k, V -= c * B, W -= c * F;
    }
    o += O * _, i += K * _, s += V * _, r += W * _, m = (o * o + i * i + s * s + r * r) ** -0.5, o *= m, i *= m, s *= m, r *= m;
  }
  return {
    update: S,
    init: R,
    getQuaternion() {
      return {
        w: o,
        x: i,
        y: s,
        z: r
      };
    }
  };
}
function ke(e, t) {
  let n;
  for (const c of e) {
    const l = t(c);
    l !== void 0 && (n = n === void 0 ? l : n + l);
  }
  return n;
}
function se(e, t = (n) => n) {
  const n = e == null ? 0 : e.length, c = ke(e, t);
  return n ? c / n : Number.NaN;
}
function Le(e) {
  let t;
  switch (e[0]) {
    case "8":
      t = "full";
      break;
    case "4":
      t = "medium";
      break;
    case "2":
      t = "low";
      break;
    case "1":
      t = "critical";
      break;
    case "0":
      t = "empty";
      break;
    default:
      t = "charging";
  }
  return t;
}
const Be = {
  // biome-ignore lint/complexity/useSimpleNumberKeys:
  1: "Left Joy-Con",
  // biome-ignore lint/complexity/useSimpleNumberKeys:
  2: "Right Joy-Con",
  // biome-ignore lint/complexity/useSimpleNumberKeys:
  3: "Pro Controller"
}, fe = 0.75, Fe = 0.0125, ge = Math.PI / 2;
function Ce(e, t, n, c) {
  const l = Date.now(), o = e.timestamp ? (l - e.timestamp) / 1e3 : 0;
  e.timestamp = l;
  const i = Math.sqrt(
    n.x ** 2 + n.y ** 2 + n.z ** 2
  );
  return e.alpha = (1 - Fe) * (e.alpha + t.z * o), i !== 0 && (e.beta = fe * (e.beta + t.x * o) + (1 - fe) * (n.x * ge / i), e.gamma = fe * (e.gamma + t.y * o) + (1 - fe) * (n.y * -ge / i)), {
    alpha: c === 8198 ? (-1 * (e.alpha * 180) / Math.PI * 430 % 90).toFixed(6) : (e.alpha * 180 / Math.PI * 430 % 360).toFixed(6),
    beta: (-1 * (e.beta * 180) / Math.PI).toFixed(6),
    gamma: c === 8198 ? (-1 * (e.gamma * 180) / Math.PI).toFixed(6) : (e.gamma * 180 / Math.PI).toFixed(6)
  };
}
function Ue(e) {
  const t = 180 / Math.PI, n = e.w * e.w, c = e.x * e.x, l = e.y * e.y, o = e.z * e.z;
  return {
    alpha: (t * Math.atan2(2 * (e.x * e.y + e.z * e.w), c - l - o + n)).toFixed(6),
    beta: (t * -Math.asin(2 * (e.x * e.z - e.y * e.w))).toFixed(6),
    gamma: (t * Math.atan2(2 * (e.y * e.z + e.x * e.w), -c - l + o + n)).toFixed(6)
  };
}
function P(e) {
  const t = new DataView(e.buffer);
  return Number.parseFloat((244e-6 * t.getInt16(0, !0)).toFixed(6));
}
function J(e) {
  const t = new DataView(e.buffer);
  return Number.parseFloat((0.06103 * t.getInt16(0, !0)).toFixed(6));
}
function z(e) {
  const t = new DataView(e.buffer);
  return Number.parseFloat((1694e-7 * t.getInt16(0, !0)).toFixed(6));
}
function Ne(e) {
  const t = e.slice(15, 26), n = t.slice(0, 1)[0], c = t.slice(1, 2)[0], l = t.slice(2, 3), o = t.slice(4, 10), i = [];
  for (const _ of o)
    i.push(_.toString(16));
  const s = t.slice(11, 12);
  return {
    _raw: t.slice(0, 12),
    _hex: t.slice(0, 12),
    firmwareVersion: {
      major: n,
      minor: c
    },
    type: Be[l[0]],
    macAddress: i.join(":"),
    spiColorInUse: s[0] === 1
  };
}
function Pe(e, t) {
  return {
    _raw: e.slice(0, 1),
    // index 0
    _hex: t.slice(0, 1)
  };
}
function Je(e, t) {
  return {
    _raw: e.slice(1, 2),
    // index 1
    _hex: t.slice(1, 2)
  };
}
function ze(e, t) {
  return {
    _raw: e.slice(2, 3),
    // high nibble
    _hex: t.slice(2, 3),
    level: Le(t.slice(2, 3))
  };
}
function Te(e, t) {
  return {
    _raw: e.slice(2, 3),
    // low nibble
    _hex: t.slice(2, 3)
  };
}
function Oe(e, t) {
  return {
    _raw: e.slice(1, 3),
    // index 1,2
    _hex: t.slice(1, 3)
  };
}
function je(e, t) {
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
    chargingGrip: !!(128 & e[4])
  };
}
function He(e, t) {
  return {
    _raw: e.slice(3, 4),
    // index 3
    _hex: t.slice(3, 4)
  };
}
function Ge(e, t) {
  let n = e[6] | (e[7] & 15) << 8;
  n = (n / 1995 - 1) * 2;
  let c = (e[7] >> 4 | e[8] << 4) * -1;
  return c = (c / 2220 + 1) * 2, {
    _raw: e.slice(6, 9),
    // index 6,7,8
    _hex: t.slice(6, 9),
    horizontal: n.toFixed(1),
    vertical: c.toFixed(1)
  };
}
function Qe(e, t) {
  let n = e[9] | (e[10] & 15) << 8;
  n = (n / 1995 - 1) * 2;
  let c = (e[10] >> 4 | e[11] << 4) * -1;
  return c = (c / 2220 + 1) * 2, {
    _raw: e.slice(9, 12),
    // index 9,10,11
    _hex: t.slice(9, 12),
    horizontal: n.toFixed(1),
    vertical: c.toFixed(1)
  };
}
function $e(e, t) {
  return {
    _raw: e.slice(4),
    // index 4
    _hex: t.slice(4)
  };
}
function De(e, t) {
  return {
    _raw: e.slice(12, 13),
    // index 12
    _hex: t.slice(12, 13)
  };
}
function Ke(e, t) {
  return {
    _raw: e.slice(13, 14),
    // index 13
    _hex: t.slice(13, 14)
  };
}
function Ve(e, t) {
  return {
    _raw: e.slice(14, 15),
    // index 14
    _hex: t.slice(14, 15)
  };
}
function We(e, t) {
  return {
    _raw: e.slice(15),
    // index 15 ~
    _hex: t.slice(15)
  };
}
function Xe(e, t) {
  return [
    {
      x: {
        _raw: e.slice(13, 15),
        // index 13,14
        _hex: t.slice(13, 15),
        acc: P(e.slice(13, 15))
      },
      y: {
        _raw: e.slice(15, 17),
        // index 15,16
        _hex: t.slice(15, 17),
        acc: P(e.slice(15, 17))
      },
      z: {
        _raw: e.slice(17, 19),
        // index 17,18
        _hex: t.slice(17, 19),
        acc: P(e.slice(17, 19))
      }
    },
    {
      x: {
        _raw: e.slice(25, 27),
        // index 25,26
        _hex: t.slice(25, 27),
        acc: P(e.slice(25, 27))
      },
      y: {
        _raw: e.slice(27, 29),
        // index 27,28
        _hex: t.slice(27, 29),
        acc: P(e.slice(27, 29))
      },
      z: {
        _raw: e.slice(29, 31),
        // index 29,30
        _hex: t.slice(29, 31),
        acc: P(e.slice(29, 31))
      }
    },
    {
      x: {
        _raw: e.slice(37, 39),
        // index 37,38
        _hex: t.slice(37, 39),
        acc: P(e.slice(37, 39))
      },
      y: {
        _raw: e.slice(39, 41),
        // index 39,40
        _hex: t.slice(39, 41),
        acc: P(e.slice(39, 41))
      },
      z: {
        _raw: e.slice(41, 43),
        // index 41,42
        _hex: t.slice(41, 43),
        acc: P(e.slice(41, 43))
      }
    }
  ];
}
function Ye(e, t) {
  return [
    [
      {
        _raw: e.slice(19, 21),
        // index 19,20
        _hex: t.slice(19, 21),
        dps: J(e.slice(19, 21)),
        rps: z(e.slice(19, 21))
      },
      {
        _raw: e.slice(21, 23),
        // index 21,22
        _hex: t.slice(21, 23),
        dps: J(e.slice(21, 23)),
        rps: z(e.slice(21, 23))
      },
      {
        _raw: e.slice(23, 25),
        // index 23,24
        _hex: t.slice(23, 25),
        dps: J(e.slice(23, 25)),
        rps: z(e.slice(23, 25))
      }
    ],
    [
      {
        _raw: e.slice(31, 33),
        // index 31,32
        _hex: t.slice(31, 33),
        dps: J(e.slice(31, 33)),
        rps: z(e.slice(31, 33))
      },
      {
        _raw: e.slice(33, 35),
        // index 33,34
        _hex: t.slice(33, 35),
        dps: J(e.slice(33, 35)),
        rps: z(e.slice(33, 35))
      },
      {
        _raw: e.slice(35, 37),
        // index 35,36
        _hex: t.slice(35, 37),
        dps: J(e.slice(35, 37)),
        rps: z(e.slice(35, 37))
      }
    ],
    [
      {
        _raw: e.slice(43, 45),
        // index 43,44
        _hex: t.slice(43, 45),
        dps: J(e.slice(43, 45)),
        rps: z(e.slice(43, 45))
      },
      {
        _raw: e.slice(45, 47),
        // index 45,46
        _hex: t.slice(45, 47),
        dps: J(e.slice(45, 47)),
        rps: z(e.slice(45, 47))
      },
      {
        _raw: e.slice(47, 49),
        // index 47,48
        _hex: t.slice(47, 49),
        dps: J(e.slice(47, 49)),
        rps: z(e.slice(47, 49))
      }
    ]
  ];
}
function Ze(e) {
  const t = 5e-3 * e.length;
  return {
    x: Number.parseFloat(
      (se(e.map(([c]) => c)) * t).toFixed(6)
    ),
    y: Number.parseFloat(
      (se(e.map(([c, l]) => l)) * t).toFixed(6)
    ),
    z: Number.parseFloat(
      (se(e.map(([c, l, o]) => o)) * t).toFixed(6)
    )
  };
}
function Re(e) {
  const t = 5e-3 * e.length, n = [
    se(e.map((c) => c[0])),
    se(e.map((c) => c[1])),
    se(e.map((c) => c[2]))
  ].map((c) => Number.parseFloat((c * t).toFixed(6)));
  return {
    x: n[0],
    y: n[1],
    z: n[2]
  };
}
function et(e, t) {
  return {
    _raw: e.slice(38, 2),
    _hex: t.slice(38, 2),
    strain: new DataView(e.buffer, 39, 2).getInt16(0, !0)
  };
}
function tt(e, t) {
  const n = new (Object.getPrototypeOf(e)).constructor(
    e.length + t.length
  );
  return n.set(e, 0), n.set(t, e.length), n;
}
class _e extends EventTarget {
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
    ne(this, "eventListenerAttached", !1);
    ne(this, "quaternion");
    ne(this, "madgwick");
    ne(this, "device");
    ne(this, "lastValues");
    ne(this, "ledstate", 0);
    this.device = n, this.lastValues = {
      timestamp: null,
      alpha: 0,
      beta: 0,
      gamma: 0
    }, n.productId === 8198 ? (this.madgwick = we(10), this.quaternion = this.madgwick.getQuaternion()) : n.productId === 8199 && (this.madgwick = we(10), this.quaternion = this.madgwick.getQuaternion());
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
  on(n, c, l) {
    super.addEventListener(n, c, l);
  }
  /**
   * Opens a connection to the Joy-Con device if it is not already opened,
   * and attaches an event listener for input reports.
   *
   * @returns {Promise<void>} A promise that resolves when the device is opened and the event listener is attached.
   */
  async open() {
    this.device.opened || await this.device.open(), this.device.addEventListener("inputreport", this._onInputReport.bind(this));
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
    const l = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      ...[2]
    ], o = new Promise((i) => {
      const s = ({ detail: r }) => {
        const { _raw: _, _hex: w, ...g } = r;
        i(g);
      };
      this.addEventListener("deviceinfo", s, {
        once: !0
      });
    });
    return await this.device.sendReport(1, new Uint8Array(l)), o;
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
    const l = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      ...[80]
    ], o = new Promise((i) => {
      const s = ({ detail: r }) => {
        const { _raw: _, _hex: w, ...g } = r;
        i(g);
      };
      this.addEventListener("batterylevel", s, {
        once: !0
      });
    });
    return await this.device.sendReport(1, new Uint8Array(l)), o;
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
    const l = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      ...[3, 63]
    ];
    await this.device.sendReport(1, new Uint8Array(l));
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
    const l = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      ...[3, 48]
    ];
    await this.device.sendReport(1, new Uint8Array(l));
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
    const l = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      ...[64, 1]
    ];
    await this.device.sendReport(1, new Uint8Array(l));
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
    const l = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      ...[64, 0]
    ];
    await this.device.sendReport(1, new Uint8Array(l));
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
    const l = [
      0,
      0,
      1,
      64,
      64,
      0,
      1,
      64,
      64,
      ...[72, 1]
    ];
    await this.device.sendReport(1, new Uint8Array(l));
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
    const l = [
      0,
      0,
      1,
      64,
      64,
      0,
      1,
      64,
      64,
      ...[72, 0]
    ];
    await this.device.sendReport(1, new Uint8Array(l));
  }
  /**
   * Enables RingCon.
   *
   * @memberof JoyCon
   * @seeAlso https://github.com/mascii/demo-of-ring-con-with-web-hid
   */
  async enableRingCon() {
    await Ee(this.device);
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
    var c;
    ((c = this.device.collections[0].outputReports) == null ? void 0 : c.find(
      (l) => l.reportId === 128
    )) != null && (await this.device.sendReport(128, new Uint8Array([1])), await this.device.sendReport(128, new Uint8Array([2])), await this.device.sendReport(1, new Uint8Array([3])), await this.device.sendReport(128, new Uint8Array([4])));
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
  async rumble(n, c, l) {
    const o = (R, S, d) => Math.min(Math.max(R, S), d), s = new Uint8Array(9);
    s[0] = 0;
    let r = o(n, 40.875885, 626.286133), _ = o(c, 81.75177, 1252.572266);
    _ = (Math.round(32 * Math.log2(_ * 0.1)) - 96) * 4, r = Math.round(32 * Math.log2(r * 0.1)) - 64;
    const w = o(l, 0, 1);
    let g;
    w === 0 ? g = 0 : w < 0.117 ? g = (Math.log2(w * 1e3) * 32 - 96) / (5 - w ** 2) - 1 : w < 0.23 ? g = Math.log2(w * 1e3) * 32 - 96 - 92 : g = (Math.log2(w * 1e3) * 32 - 96) * 2 - 246;
    let M = Math.round(g) * 0.5;
    const T = M % 2;
    T > 0 && --M, M = M >> 1, M += 64, T > 0 && (M |= 32768), s[1] = _ & 255, s[2] = g + (_ >>> 8 & 255), s[3] = r + (M >>> 8 & 255), s[4] += M & 255;
    for (let R = 0; R < 4; R++)
      s[5 + R] = s[1 + R];
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
    const c = [0, 0, 0, 0, 0, 0, 0, 0], l = [48, n];
    await this.device.sendReport(
      1,
      new Uint8Array([...c, 0, ...l])
    );
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
    this.ledstate |= 1 << n, await this.setLEDState(this.ledstate);
  }
  /**
   * Resets (turns off) the LED at the specified index by clearing its corresponding bits
   * in the internal LED state and updates the device.
   *
   * @param n - The index of the LED to reset (0-based).
   * @returns A promise that resolves when the LED state has been updated.
   */
  async resetLED(n) {
    this.ledstate &= ~(1 << n | 1 << 4 + n), await this.setLEDState(this.ledstate);
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
    this.ledstate &= ~(1 << n), this.ledstate |= 1 << 4 + n, await this.setLEDState(this.ledstate);
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
  _onInputReport({ data: n, reportId: c, device: l }) {
    var r, _;
    if (!n)
      return;
    const o = tt(
      new Uint8Array([c]),
      new Uint8Array(n.buffer)
    ), i = Array.from(o).map((w) => w.toString(16).padStart(2, "0")).join("");
    let s = {
      inputReportID: Pe(o, i)
    };
    switch (c) {
      case 63: {
        s = {
          ...s,
          buttonStatus: Oe(o, i),
          analogStick: He(o, i),
          filter: $e(o, i)
        };
        break;
      }
      case 33:
      case 48: {
        if (s = {
          ...s,
          timer: Je(o, i),
          batteryLevel: ze(o, i),
          connectionInfo: Te(o, i),
          buttonStatus: je(
            o,
            i
          ),
          analogStickLeft: Ge(o, i),
          analogStickRight: Qe(
            o,
            i
          ),
          vibrator: De(o, i)
        }, c === 33 && (s = {
          ...s,
          ack: Ke(o, i),
          subcommandID: Ve(o, i),
          subcommandReplyData: We(
            o,
            i
          ),
          deviceInfo: Ne(o)
        }), c === 48) {
          const w = Xe(
            o,
            i
          ), g = Ye(o, i), M = Re(
            g.map((S) => S.map((d) => d.rps ?? 0))
          ), T = Re(
            g.map((S) => S.map((d) => d.dps ?? 0))
          ), R = Ze(
            w.map((S) => [
              S.x.acc ?? 0,
              S.y.acc ?? 0,
              S.z.acc ?? 0
            ])
          );
          this.madgwick.update(M.x, M.y, M.z, R.x, R.y, R.z), s = {
            ...s,
            accelerometers: w,
            gyroscopes: g,
            actualAccelerometer: R,
            actualGyroscope: { dps: T, rps: M },
            actualOrientation: Ce(
              this.lastValues,
              M,
              R,
              l.productId
            ),
            actualOrientationQuaternion: Ue(
              this.quaternion
            ),
            quaternion: this.quaternion,
            ringCon: et(o, i)
          };
        }
        break;
      }
    }
    (r = s.deviceInfo) != null && r.type && this._receiveDeviceInfo(s.deviceInfo), (_ = s.batteryLevel) != null && _.level && this._receiveBatteryLevel(s.batteryLevel), this._receiveInputEvent(s);
  }
  /**
   * Dispatches a "deviceinfo" custom event with the provided device information as its detail.
   *
   * @param deviceInfo - The information about the device to be included in the event detail.
   */
  _receiveDeviceInfo(n) {
    this.dispatchEvent(new CustomEvent("deviceinfo", { detail: n }));
  }
  /**
   * Dispatches a "batterylevel" custom event with the provided battery level detail.
   *
   * @param batteryLevel - The battery level information to include in the event detail.
   */
  _receiveBatteryLevel(n) {
    this.dispatchEvent(
      new CustomEvent("batterylevel", { detail: n })
    );
  }
  // To be overridden by subclasses
  _receiveInputEvent(n) {
  }
}
class nt extends _e {
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
    n.x = void 0, n.y = void 0, n.b = void 0, n.a = void 0, n.plus = void 0, n.r = void 0, n.zr = void 0, n.home = void 0, n.rightStick = void 0, this.dispatchEvent(new CustomEvent("hidinput", { detail: t }));
  }
}
class ot extends _e {
  /**
   * Handles an input event packet from the Joy-Con device, sanitizes specific button statuses by setting them to `undefined`,
   * and dispatches a "hidinput" custom event with the modified packet as its detail.
   *
   * @param packet - The input event data received from the Joy-Con, expected to contain a `buttonStatus` property.
   */
  _receiveInputEvent(t) {
    const n = t.buttonStatus;
    n.up = void 0, n.down = void 0, n.left = void 0, n.right = void 0, n.minus = void 0, n.l = void 0, n.zl = void 0, n.capture = void 0, n.leftStick = void 0, this.dispatchEvent(new CustomEvent("hidinput", { detail: t }));
  }
}
class st extends _e {
  /**
   * Dispatches a "hidinput" custom event with the provided packet as its detail.
   *
   * @param packet - The input data received from the HID device.
   */
  _receiveInputEvent(t) {
    this.dispatchEvent(new CustomEvent("hidinput", { detail: t }));
  }
}
const it = async (e) => {
  let t = null;
  return e.productId === 8198 ? t = new nt(e) : e.productId === 8199 && e.productName === "Joy-Con (R)" && (t = new ot(e)), t || (t = new st(e)), await t.open(), await t.enableUSBHIDJoystickReport(), await t.enableStandardFullMode(), await t.enableIMUMode(), t;
}, Me = /* @__PURE__ */ new Map(), ye = [], qe = (e) => {
  const t = ye.indexOf(e);
  return t >= 0 ? t : (ye.push(e), ye.length - 1);
}, xe = async (e) => {
  const t = qe(e);
  console.log(
    `HID connected: ${t} ${e.productId.toString(16)} ${e.productName}`
  ), Me.set(t, await it(e));
}, ct = async (e) => {
  const t = qe(e);
  console.log(
    `HID disconnected: ${t} ${e.productId.toString(16)} ${e.productName}`
  ), Me.delete(t);
};
navigator.hid.addEventListener("connect", async ({ device: e }) => {
  xe(e);
});
navigator.hid.addEventListener("disconnect", ({ device: e }) => {
  ct(e);
});
document.addEventListener("DOMContentLoaded", async () => {
  const e = await navigator.hid.getDevices();
  for (const t of e)
    await xe(t);
});
const lt = async () => {
  const e = [
    {
      vendorId: 1406
      // Nintendo Co., Ltd
    }
  ];
  try {
    const [t] = await navigator.hid.requestDevice({ filters: e });
    if (!t)
      return;
    await xe(t);
  } catch (t) {
    t instanceof Error ? console.error(t.name, t.message) : console.error(t);
  }
};
export {
  st as GeneralController,
  nt as JoyConLeft,
  ot as JoyConRight,
  lt as connectJoyCon,
  Me as connectedJoyCons
};
