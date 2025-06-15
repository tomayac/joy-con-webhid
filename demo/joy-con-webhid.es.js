var je = Object.defineProperty;
var He = (e, t, n) => t in e ? je(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ve = (e, t, n) => He(e, typeof t != "symbol" ? t + "" : t, n);
function Je(e, t) {
  const n = {}, c = 1e3 / e, r = n.beta ?? 0.4;
  let w = n.doInitialisation !== !0, i = 1, o = 0, s = 0, l = 0, h = 1 / c;
  function R(u, p, b, I, x, y) {
    let a, d, _, B, f, E, L, k, F, j, X, Y, Z, V, H, $, D, ee, te, v, m, ne;
    if (E = 0.5 * (-o * u - s * p - l * b), L = 0.5 * (i * u + s * b - l * p), k = 0.5 * (i * p - o * b + l * u), F = 0.5 * (i * b + o * p - s * u), !(I === 0 && x === 0 && y === 0)) {
      a = (I * I + x * x + y * y) ** -0.5;
      const Q = I * a, G = x * a, K = y * a;
      j = 2 * i, X = 2 * o, Y = 2 * s, Z = 2 * l, V = 4 * i, H = 4 * o, $ = 4 * s, D = 8 * o, ee = 8 * s, te = i * i, v = o * o, m = s * s, ne = l * l, d = V * m + Y * Q + V * v - X * G, _ = H * ne - Z * Q + 4 * te * o - j * G - H + D * v + D * m + H * K, B = 4 * te * s + j * Q + $ * ne - Z * G - $ + ee * v + ee * m + $ * K, f = 4 * v * l - X * Q + 4 * m * l - Y * G, a = (d * d + _ * _ + B * B + f * f) ** -0.5, d *= a, _ *= a, B *= a, f *= a, E -= r * d, L -= r * _, k -= r * B, F -= r * f;
    }
    i += E * h, o += L * h, s += k * h, l += F * h, a = (i * i + o * o + s * s + l * l) ** -0.5, i *= a, o *= a, s *= a, l *= a;
  }
  function M(u, p, b, I, x, y) {
    return {
      x: p * y - b * x,
      y: b * I - u * y,
      z: u * x - p * I
    };
  }
  function A(u, p, b, I, x, y) {
    const a = -Math.atan2(u, Math.sqrt(p * p + b * b)), d = M(u, p, b, 1, 0, 0), _ = M(1, 0, 0, d.x, d.y, d.z), B = Math.atan2(_.y, _.z), f = Math.cos(B), E = Math.sin(a), L = Math.sin(B), k = x * f - y * L, F = I * Math.cos(a) + x * L * E + y * f * E;
    return {
      heading: -Math.atan2(k, F),
      pitch: a,
      roll: B
    };
  }
  function g(u) {
    const p = Math.cos(u.heading * 0.5), b = Math.sin(u.heading * 0.5), I = Math.cos(u.pitch * 0.5), x = Math.sin(u.pitch * 0.5), y = Math.cos(u.roll * 0.5), a = Math.sin(u.roll * 0.5);
    return {
      w: y * I * p + a * x * b,
      x: a * I * p - y * x * b,
      y: y * x * p + a * I * b,
      z: y * I * b - a * x * p
    };
  }
  function U(u, p, b, I, x, y) {
    const a = A(u, p, b, I, x, y), d = g(a), _ = (d.w * d.w + d.x * d.x + d.y * d.y + d.z * d.z) ** -0.5;
    i = d.w * _, o = d.x * _, s = d.y * _, l = d.z * _, w = !0;
  }
  function N(u, p, b, I, x, y, a, d, _, B) {
    h = B ?? h, w || U(I, x, y, a ?? 0, d ?? 0, _ ?? 0);
    let f, E, L, k, F, j, X, Y, Z, V, H, $, D, ee, te, v, m, ne, Q, G, K, ce, xe, re, le, me, P, z, ae, C, ue, S, q, de, W;
    if (a === void 0 || d === void 0 || _ === void 0 || a === 0 && d === 0 && _ === 0) {
      R(u, p, b, I, x, y);
      return;
    }
    if (j = 0.5 * (-o * u - s * p - l * b), X = 0.5 * (i * u + s * b - l * p), Y = 0.5 * (i * p - o * b + l * u), Z = 0.5 * (i * b + o * p - s * u), !(I === 0 && x === 0 && y === 0)) {
      f = (I * I + x * x + y * y) ** -0.5;
      const fe = I * f, be = x * f, Ce = y * f;
      f = (a * a + d * d + _ * _) ** -0.5;
      const oe = a * f, pe = d * f, he = _ * f;
      $ = 2 * i * oe, D = 2 * i * pe, ee = 2 * i * he, te = 2 * o * oe, G = 2 * i, K = 2 * o, ce = 2 * s, xe = 2 * l, re = 2 * i * s, le = 2 * s * l, me = i * i, P = i * o, z = i * s, ae = i * l, C = o * o, ue = o * s, S = o * l, q = s * s, de = s * l, W = l * l, V = a * me - D * l + ee * s + a * C + K * d * s + K * _ * l - a * q - a * W, H = $ * l + d * me - ee * o + te * s - d * C + d * q + ce * _ * l - d * W, v = Math.sqrt(V * V + H * H), m = -$ * s + D * o + _ * me + te * l - _ * C + ce * d * l - _ * q + _ * W, ne = 2 * v, Q = 2 * m, E = -ce * (2 * S - re - fe) + K * (2 * P + le - be) - m * s * (v * (0.5 - q - W) + m * (S - z) - oe) + (-v * l + m * o) * (v * (ue - ae) + m * (P + de) - pe) + v * s * (v * (z + S) + m * (0.5 - C - q) - he), L = xe * (2 * S - re - fe) + G * (2 * P + le - be) - 4 * o * (1 - 2 * C - 2 * q - Ce) + m * l * (v * (0.5 - q - W) + m * (S - z) - oe) + (v * s + m * i) * (v * (ue - ae) + m * (P + de) - pe) + (v * l - Q * o) * (v * (z + S) + m * (0.5 - C - q) - he), k = -G * (2 * S - re - fe) + xe * (2 * P + le - be) - 4 * s * (1 - 2 * C - 2 * q - Ce) + (-ne * s - m * i) * (v * (0.5 - q - W) + m * (S - z) - oe) + (v * o + m * l) * (v * (ue - ae) + m * (P + de) - pe) + (v * i - Q * s) * (v * (z + S) + m * (0.5 - C - q) - he), F = K * (2 * S - re - fe) + ce * (2 * P + le - be) + (-ne * l + m * o) * (v * (0.5 - q - W) + m * (S - z) - oe) + (-v * i + m * s) * (v * (ue - ae) + m * (P + de) - pe) + v * o * (v * (z + S) + m * (0.5 - C - q) - he), f = (E * E + L * L + k * k + F * F) ** -0.5, E *= f, L *= f, k *= f, F *= f, j -= r * E, X -= r * L, Y -= r * k, Z -= r * F;
    }
    i += j * h, o += X * h, s += Y * h, l += Z * h, f = (i * i + o * o + s * s + l * l) ** -0.5, i *= f, o *= f, s *= f, l *= f;
  }
  return {
    update: N,
    init: U,
    getQuaternion() {
      return {
        w: i,
        x: o,
        y: s,
        z: l
      };
    }
  };
}
const Ne = Je(10), Pe = Je(10), ye = 180 / Math.PI;
function $e(e, t) {
  let n;
  for (const c of e) {
    const r = t(c);
    r !== void 0 && (n = n === void 0 ? r : n + r);
  }
  return n;
}
function se(e) {
  return Qe(e, (t) => t);
}
function Qe(e, t) {
  const n = e == null ? 0 : e.length;
  return n ? $e(e, t) / n : Number.NaN;
}
function Ge(e) {
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
const Ke = {
  // biome-ignore lint/complexity/useSimpleNumberKeys:
  1: "Left Joy-Con",
  // biome-ignore lint/complexity/useSimpleNumberKeys:
  2: "Right Joy-Con",
  // biome-ignore lint/complexity/useSimpleNumberKeys:
  3: "Pro Controller"
}, _e = 0.75, We = 0.0125, ze = Math.PI / 2;
function Ie(e, t, n, c) {
  const r = Date.now(), w = e.timestamp ? (r - e.timestamp) / 1e3 : 0;
  e.timestamp = r;
  const i = Math.sqrt(
    n.x ** 2 + n.y ** 2 + n.z ** 2
  );
  return e.alpha = (1 - We) * (e.alpha + t.z * w), i !== 0 && (e.beta = _e * (e.beta + t.x * w) + (1 - _e) * (n.x * ze / i), e.gamma = _e * (e.gamma + t.y * w) + (1 - _e) * (n.y * -ze / i)), {
    alpha: c === 8198 ? (-1 * (e.alpha * 180) / Math.PI * 430 % 90).toFixed(6) : (e.alpha * 180 / Math.PI * 430 % 360).toFixed(6),
    beta: (-1 * (e.beta * 180) / Math.PI).toFixed(6),
    gamma: c === 8198 ? (-1 * (e.gamma * 180) / Math.PI).toFixed(6) : (e.gamma * 180 / Math.PI).toFixed(6)
  };
}
function we(e) {
  const t = e.w * e.w, n = e.x * e.x, c = e.y * e.y, r = e.z * e.z;
  return {
    alpha: (ye * Math.atan2(2 * (e.x * e.y + e.z * e.w), n - c - r + t)).toFixed(6),
    beta: (ye * -Math.asin(2 * (e.x * e.z - e.y * e.w))).toFixed(6),
    gamma: (ye * Math.atan2(2 * (e.y * e.z + e.x * e.w), -n - c + r + t)).toFixed(6)
  };
}
function Re(e, t, n) {
  return n === 8198 ? (Ne.update(e.x, e.y, e.z, t.x, t.y, t.z), Ne.getQuaternion()) : (Pe.update(e.x, e.y, e.z, t.x, t.y, t.z), Pe.getQuaternion());
}
function J(e) {
  const t = new DataView(e.buffer);
  return Number.parseFloat((244e-6 * t.getInt16(0, !0)).toFixed(6));
}
function T(e) {
  const t = new DataView(e.buffer);
  return Number.parseFloat((0.06103 * t.getInt16(0, !0)).toFixed(6));
}
function O(e) {
  const t = new DataView(e.buffer);
  return Number.parseFloat((1694e-7 * t.getInt16(0, !0)).toFixed(6));
}
function Xe(e) {
  const t = e.slice(15, 26), n = t.slice(0, 1)[0], c = t.slice(1, 2)[0], r = t.slice(2, 3), w = t.slice(4, 10), i = [];
  for (const l of w)
    i.push(l.toString(16));
  const o = t.slice(11, 12);
  return {
    _raw: t.slice(0, 12),
    _hex: t.slice(0, 12),
    firmwareVersion: {
      major: n,
      minor: c
    },
    type: Ke[r[0]],
    macAddress: i.join(":"),
    spiColorInUse: o[0] === 1
  };
}
function Ye(e, t) {
  return {
    _raw: e.slice(0, 1),
    // index 0
    _hex: t.slice(0, 1)
  };
}
function Ze(e, t) {
  return {
    _raw: e.slice(1, 2),
    // index 1
    _hex: t.slice(1, 2)
  };
}
function Ve(e, t) {
  return {
    _raw: e.slice(2, 3),
    // high nibble
    _hex: t.slice(2, 3),
    level: Ge(t.slice(2, 3))
  };
}
function De(e, t) {
  return {
    _raw: e.slice(2, 3),
    // low nibble
    _hex: t.slice(2, 3)
  };
}
function et(e, t) {
  return {
    _raw: e.slice(1, 3),
    // index 1,2
    _hex: t.slice(1, 3)
  };
}
function tt(e, t) {
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
function nt(e, t) {
  return {
    _raw: e.slice(3, 4),
    // index 3
    _hex: t.slice(3, 4)
  };
}
function ot(e, t) {
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
function it(e, t) {
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
function st(e, t) {
  return {
    _raw: e.slice(4),
    // index 4
    _hex: t.slice(4)
  };
}
function Me(e, t) {
  return {
    _raw: e.slice(12, 13),
    // index 12
    _hex: t.slice(12, 13)
  };
}
function ge(e, t) {
  return {
    _raw: e.slice(13, 14),
    // index 13
    _hex: t.slice(13, 14)
  };
}
function qe(e, t) {
  return {
    _raw: e.slice(14, 15),
    // index 14
    _hex: t.slice(14, 15)
  };
}
function Se(e, t) {
  return {
    _raw: e.slice(15),
    // index 15 ~
    _hex: t.slice(15)
  };
}
function Ee(e, t) {
  return [
    {
      x: {
        _raw: e.slice(13, 15),
        // index 13,14
        _hex: t.slice(13, 15),
        acc: J(e.slice(13, 15))
      },
      y: {
        _raw: e.slice(15, 17),
        // index 15,16
        _hex: t.slice(15, 17),
        acc: J(e.slice(15, 17))
      },
      z: {
        _raw: e.slice(17, 19),
        // index 17,18
        _hex: t.slice(17, 19),
        acc: J(e.slice(17, 19))
      }
    },
    {
      x: {
        _raw: e.slice(25, 27),
        // index 25,26
        _hex: t.slice(25, 27),
        acc: J(e.slice(25, 27))
      },
      y: {
        _raw: e.slice(27, 29),
        // index 27,28
        _hex: t.slice(27, 29),
        acc: J(e.slice(27, 29))
      },
      z: {
        _raw: e.slice(29, 31),
        // index 29,30
        _hex: t.slice(29, 31),
        acc: J(e.slice(29, 31))
      }
    },
    {
      x: {
        _raw: e.slice(37, 39),
        // index 37,38
        _hex: t.slice(37, 39),
        acc: J(e.slice(37, 39))
      },
      y: {
        _raw: e.slice(39, 41),
        // index 39,40
        _hex: t.slice(39, 41),
        acc: J(e.slice(39, 41))
      },
      z: {
        _raw: e.slice(41, 43),
        // index 41,42
        _hex: t.slice(41, 43),
        acc: J(e.slice(41, 43))
      }
    }
  ];
}
function Le(e, t) {
  return [
    [
      {
        _raw: e.slice(19, 21),
        // index 19,20
        _hex: t.slice(19, 21),
        dps: T(e.slice(19, 21)),
        rps: O(e.slice(19, 21))
      },
      {
        _raw: e.slice(21, 23),
        // index 21,22
        _hex: t.slice(21, 23),
        dps: T(e.slice(21, 23)),
        rps: O(e.slice(21, 23))
      },
      {
        _raw: e.slice(23, 25),
        // index 23,24
        _hex: t.slice(23, 25),
        dps: T(e.slice(23, 25)),
        rps: O(e.slice(23, 25))
      }
    ],
    [
      {
        _raw: e.slice(31, 33),
        // index 31,32
        _hex: t.slice(31, 33),
        dps: T(e.slice(31, 33)),
        rps: O(e.slice(31, 33))
      },
      {
        _raw: e.slice(33, 35),
        // index 33,34
        _hex: t.slice(33, 35),
        dps: T(e.slice(33, 35)),
        rps: O(e.slice(33, 35))
      },
      {
        _raw: e.slice(35, 37),
        // index 35,36
        _hex: t.slice(35, 37),
        dps: T(e.slice(35, 37)),
        rps: O(e.slice(35, 37))
      }
    ],
    [
      {
        _raw: e.slice(43, 45),
        // index 43,44
        _hex: t.slice(43, 45),
        dps: T(e.slice(43, 45)),
        rps: O(e.slice(43, 45))
      },
      {
        _raw: e.slice(45, 47),
        // index 45,46
        _hex: t.slice(45, 47),
        dps: T(e.slice(45, 47)),
        rps: O(e.slice(45, 47))
      },
      {
        _raw: e.slice(47, 49),
        // index 47,48
        _hex: t.slice(47, 49),
        dps: T(e.slice(47, 49)),
        rps: O(e.slice(47, 49))
      }
    ]
  ];
}
function Be(e) {
  const t = 5e-3 * e.length;
  return {
    x: Number.parseFloat(
      (se(e.map(([c]) => c)) * t).toFixed(6)
    ),
    y: Number.parseFloat(
      (se(e.map(([c, r]) => r)) * t).toFixed(6)
    ),
    z: Number.parseFloat(
      (se(e.map(([c, r, w]) => w)) * t).toFixed(6)
    )
  };
}
function ie(e) {
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
function ke(e, t) {
  return {
    _raw: e.slice(38, 2),
    _hex: t.slice(38, 2),
    strain: new DataView(e.buffer, 39, 2).getInt16(0, !0)
  };
}
const ct = async (e) => {
  const t = ({
    subcommand: o,
    expectedReport: s,
    timeoutErrorMessage: l = "timeout."
  }) => (h) => new Promise((R, M) => {
    const A = setTimeout(() => {
      h.removeEventListener("inputreport", g), M(new Error(l));
    }, 5e3), g = (U) => {
      const N = U;
      if (N.reportId !== 33)
        return;
      const u = new Uint8Array(N.data.buffer);
      for (const [p, b] of Object.entries(s))
        if (u[Number(p) - 1] !== b)
          return;
      h.removeEventListener("inputreport", g), clearTimeout(A), setTimeout(R, 50);
    };
    h.addEventListener("inputreport", g), (async () => await h.sendReport(
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
        ...o
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
  }), r = t({
    subcommand: [89],
    expectedReport: {
      14: 89,
      16: 32
    },
    timeoutErrorMessage: "ring-con not found."
  }), w = t({
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
  await n(e), await c(e), await r(e), await w(e), await i(e);
};
function rt(e, t) {
  const n = new (Object.getPrototypeOf(e)).constructor(
    e.length + t.length
  );
  return n.set(e, 0), n.set(t, e.length), n;
}
class Ae extends EventTarget {
  constructor(n) {
    super();
    ve(this, "eventListenerAttached", !1);
    ve(this, "device");
    ve(this, "lastValues");
    ve(this, "ledstate", 0);
    this.device = n, this.lastValues = {
      timestamp: void 0,
      alpha: 0,
      beta: 0,
      gamma: 0
    };
  }
  /**
   * Type-safe event listener for JoyCon custom events.
   */
  on(n, c, r) {
    super.addEventListener(n, c, r);
  }
  async open() {
    this.device.opened || await this.device.open(), this.device.addEventListener("inputreport", this._onInputReport.bind(this));
  }
  async getRequestDeviceInfo() {
    const r = [
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
    ], w = new Promise((i) => {
      const o = ({ detail: s }) => {
        const { _raw: l, _hex: h, ...R } = s;
        i(R);
      };
      this.addEventListener("deviceinfo", o, {
        once: !0
      });
    });
    return await this.device.sendReport(1, new Uint8Array(r)), w;
  }
  async getBatteryLevel() {
    const r = [
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
    ], w = new Promise((i) => {
      const o = ({ detail: s }) => {
        const { _raw: l, _hex: h, ...R } = s;
        i(R);
      };
      this.addEventListener("batterylevel", o, {
        once: !0
      });
    });
    return await this.device.sendReport(1, new Uint8Array(r)), w;
  }
  async enableSimpleHIDMode() {
    const r = [
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
    await this.device.sendReport(1, new Uint8Array(r));
  }
  async enableStandardFullMode() {
    const r = [
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
    await this.device.sendReport(1, new Uint8Array(r));
  }
  async enableIMUMode() {
    const r = [
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
    await this.device.sendReport(1, new Uint8Array(r));
  }
  async disableIMUMode() {
    const r = [
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
    await this.device.sendReport(1, new Uint8Array(r));
  }
  async enableVibration() {
    const r = [
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
    await this.device.sendReport(1, new Uint8Array(r));
  }
  async disableVibration() {
    const r = [
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
    await this.device.sendReport(1, new Uint8Array(r));
  }
  async enableRingCon() {
    await ct(this.device);
  }
  async enableUSBHIDJoystickReport() {
    var c;
    ((c = this.device.collections[0].outputReports) == null ? void 0 : c.find(
      (r) => r.reportId === 128
    )) != null && (await this.device.sendReport(128, new Uint8Array([1])), await this.device.sendReport(128, new Uint8Array([2])), await this.device.sendReport(1, new Uint8Array([3])), await this.device.sendReport(128, new Uint8Array([4])));
  }
  async rumble(n, c, r) {
    const w = (g, U, N) => Math.min(Math.max(g, U), N), o = new Uint8Array(9);
    o[0] = 0;
    let s = w(n, 40.875885, 626.286133), l = w(c, 81.75177, 1252.572266);
    l = (Math.round(32 * Math.log2(l * 0.1)) - 96) * 4, s = Math.round(32 * Math.log2(s * 0.1)) - 64;
    const h = w(r, 0, 1);
    let R;
    h === 0 ? R = 0 : h < 0.117 ? R = (Math.log2(h * 1e3) * 32 - 96) / (5 - h ** 2) - 1 : h < 0.23 ? R = Math.log2(h * 1e3) * 32 - 96 - 92 : R = (Math.log2(h * 1e3) * 32 - 96) * 2 - 246;
    let M = Math.round(R) * 0.5;
    const A = M % 2;
    A > 0 && --M, M = M >> 1, M += 64, A > 0 && (M |= 32768), o[1] = l & 255, o[2] = R + (l >>> 8 & 255), o[3] = s + (M >>> 8 & 255), o[4] += M & 255;
    for (let g = 0; g < 4; g++)
      o[5 + g] = o[1 + g];
    await this.device.sendReport(16, new Uint8Array(o));
  }
  async setLEDState(n) {
    const c = [0, 0, 0, 0, 0, 0, 0, 0], r = [48, n];
    await this.device.sendReport(
      1,
      new Uint8Array([...c, 0, ...r])
    );
  }
  async setLED(n) {
    this.ledstate |= 1 << n, await this.setLEDState(this.ledstate);
  }
  async resetLED(n) {
    this.ledstate &= ~(1 << n | 1 << 4 + n), await this.setLEDState(this.ledstate);
  }
  async blinkLED(n) {
    this.ledstate &= ~(1 << n), this.ledstate |= 1 << 4 + n, await this.setLEDState(this.ledstate);
  }
  _onInputReport({ data: n, reportId: c, device: r }) {
    var l, h;
    if (!n)
      return;
    const w = new Uint8Array(n.buffer), i = rt(new Uint8Array([c]), w), o = Array.from(i).map((R) => R.toString(16).padStart(2, "0")).join("");
    let s = {
      inputReportID: Ye(i, o)
    };
    switch (c) {
      case 63: {
        s = {
          ...s,
          buttonStatus: et(i, o),
          analogStick: nt(i, o),
          filter: st(i, o)
        };
        break;
      }
      case 33:
      case 48: {
        if (s = {
          ...s,
          timer: Ze(i, o),
          batteryLevel: Ve(i, o),
          connectionInfo: De(i, o),
          buttonStatus: tt(
            i,
            o
          ),
          analogStickLeft: ot(i, o),
          analogStickRight: it(
            i,
            o
          ),
          vibrator: Me == null ? void 0 : Me(i, o)
        }, c === 33 && (s = {
          ...s,
          ack: ge == null ? void 0 : ge(i, o),
          subcommandID: qe == null ? void 0 : qe(i, o),
          subcommandReplyData: Se == null ? void 0 : Se(
            i,
            o
          ),
          deviceInfo: Xe(i)
        }), c === 48) {
          const R = Ee == null ? void 0 : Ee(
            i,
            o
          ), M = Le == null ? void 0 : Le(i, o), A = ie == null ? void 0 : ie(
            M.map((u) => u.map((p) => p.rps ?? 0))
          ), g = ie == null ? void 0 : ie(
            M.map((u) => u.map((p) => p.dps ?? 0))
          ), U = Be == null ? void 0 : Be(
            R.map((u) => [
              u.x.acc ?? 0,
              u.y.acc ?? 0,
              u.z.acc ?? 0
            ])
          ), N = Re == null ? void 0 : Re(
            A,
            U,
            r.productId
          );
          s = {
            ...s,
            accelerometers: R,
            gyroscopes: M,
            actualAccelerometer: U,
            actualGyroscope: { dps: g, rps: A },
            actualOrientation: Ie == null ? void 0 : Ie(
              this.lastValues,
              A,
              U,
              r.productId
            ),
            actualOrientationQuaternion: we == null ? void 0 : we(N),
            quaternion: N,
            ringCon: ke == null ? void 0 : ke(i, o)
          };
        }
        break;
      }
    }
    (l = s.deviceInfo) != null && l.type && this._receiveDeviceInfo(s.deviceInfo), (h = s.batteryLevel) != null && h.level && this._receiveBatteryLevel(s.batteryLevel), this._receiveInputEvent(s);
  }
  _receiveDeviceInfo(n) {
    this.dispatchEvent(new CustomEvent("deviceinfo", { detail: n }));
  }
  _receiveBatteryLevel(n) {
    this.dispatchEvent(
      new CustomEvent("batterylevel", { detail: n })
    );
  }
  // To be overridden by subclasses
  _receiveInputEvent(n) {
  }
}
class lt extends Ae {
  _receiveInputEvent(t) {
    const n = t.buttonStatus;
    n.x = void 0, n.y = void 0, n.b = void 0, n.a = void 0, n.plus = void 0, n.r = void 0, n.zr = void 0, n.home = void 0, n.rightStick = void 0, this.dispatchEvent(new CustomEvent("hidinput", { detail: t }));
  }
}
class at extends Ae {
  _receiveInputEvent(t) {
    const n = t.buttonStatus;
    n.up = void 0, n.down = void 0, n.left = void 0, n.right = void 0, n.minus = void 0, n.l = void 0, n.zl = void 0, n.capture = void 0, n.leftStick = void 0, this.dispatchEvent(new CustomEvent("hidinput", { detail: t }));
  }
}
class ut extends Ae {
  _receiveInputEvent(t) {
    this.dispatchEvent(new CustomEvent("hidinput", { detail: t }));
  }
}
const dt = async (e) => {
  let t = null;
  return e.productId === 8198 ? t = new lt(e) : e.productId === 8199 && e.productName === "Joy-Con (R)" && (t = new at(e)), t || (t = new ut(e)), await t.open(), await t.enableUSBHIDJoystickReport(), await t.enableStandardFullMode(), await t.enableIMUMode(), t;
}, Te = /* @__PURE__ */ new Map(), Fe = [], Oe = (e) => {
  const t = Fe.indexOf(e);
  return t >= 0 ? t : (Fe.push(e), Fe.length - 1);
}, Ue = async (e) => {
  const t = Oe(e);
  console.log(
    `HID connected: ${t} ${e.productId.toString(16)} ${e.productName}`
  ), Te.set(t, await dt(e));
}, pt = async (e) => {
  const t = Oe(e);
  console.log(
    `HID disconnected: ${t} ${e.productId.toString(16)} ${e.productName}`
  ), Te.delete(t);
};
navigator.hid.addEventListener("connect", async ({ device: e }) => {
  Ue(e);
});
navigator.hid.addEventListener("disconnect", ({ device: e }) => {
  pt(e);
});
document.addEventListener("DOMContentLoaded", async () => {
  const e = await navigator.hid.getDevices();
  for (const t of e)
    await Ue(t);
});
const vt = async () => {
  const e = [
    {
      vendorId: 1406
      // Nintendo Co., Ltd
    }
  ];
  try {
    const n = (await navigator.hid.requestDevice({ filters: e }))[0];
    if (!n)
      return;
    await Ue(n);
  } catch (t) {
    t instanceof Error ? console.error(t.name, t.message) : console.error(t);
  }
};
export {
  ut as GeneralController,
  lt as JoyConLeft,
  at as JoyConRight,
  vt as connectJoyCon,
  Te as connectedJoyCons
};
