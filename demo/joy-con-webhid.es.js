var Oe = Object.defineProperty;
var je = (e, t, n) => t in e ? Oe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var he = (e, t, n) => je(e, typeof t != "symbol" ? t + "" : t, n);
function ze(e, t) {
  const n = 1e3 / e, c = 0.4;
  let l = !0, o = 1, i = 0, s = 0, r = 0, x = 1 / n;
  function w(u, p, f, _, y, I) {
    let a, d, b, B, m, E, L, k, F, O, W, X, Y, Z, j, H, D, V, ee, h, v, te;
    if (E = 0.5 * (-i * u - s * p - r * f), L = 0.5 * (o * u + s * f - r * p), k = 0.5 * (o * p - i * f + r * u), F = 0.5 * (o * f + i * p - s * u), !(_ === 0 && y === 0 && I === 0)) {
      a = (_ * _ + y * y + I * I) ** -0.5;
      const $ = _ * a, Q = y * a, G = I * a;
      O = 2 * o, W = 2 * i, X = 2 * s, Y = 2 * r, Z = 4 * o, j = 4 * i, H = 4 * s, D = 8 * i, V = 8 * s, ee = o * o, h = i * i, v = s * s, te = r * r, d = Z * v + X * $ + Z * h - W * Q, b = j * te - Y * $ + 4 * ee * i - O * Q - j + D * h + D * v + j * G, B = 4 * ee * s + O * $ + H * te - Y * Q - H + V * h + V * v + H * G, m = 4 * h * r - W * $ + 4 * v * r - X * Q, a = (d * d + b * b + B * B + m * m) ** -0.5, d *= a, b *= a, B *= a, m *= a, E -= c * d, L -= c * b, k -= c * B, F -= c * m;
    }
    o += E * x, i += L * x, s += k * x, r += F * x, a = (o * o + i * i + s * s + r * r) ** -0.5, o *= a, i *= a, s *= a, r *= a;
  }
  function R(u, p, f, _, y, I) {
    return {
      x: p * I - f * y,
      y: f * _ - u * I,
      z: u * y - p * _
    };
  }
  function M(u, p, f, _, y, I) {
    const a = -Math.atan2(u, Math.sqrt(p * p + f * f)), d = R(u, p, f, 1, 0, 0), b = R(1, 0, 0, d.x, d.y, d.z), B = Math.atan2(b.y, b.z), m = Math.cos(B), E = Math.sin(a), L = Math.sin(B), k = y * m - I * L, F = _ * Math.cos(a) + y * L * E + I * m * E;
    return {
      heading: -Math.atan2(k, F),
      pitch: a,
      roll: B
    };
  }
  function J(u) {
    const p = Math.cos(u.heading * 0.5), f = Math.sin(u.heading * 0.5), _ = Math.cos(u.pitch * 0.5), y = Math.sin(u.pitch * 0.5), I = Math.cos(u.roll * 0.5), a = Math.sin(u.roll * 0.5);
    return {
      w: I * _ * p + a * y * f,
      x: a * _ * p - I * y * f,
      y: I * y * p + a * _ * f,
      z: I * _ * f - a * y * p
    };
  }
  function g(u, p, f, _, y, I) {
    const a = M(u, p, f, _, y, I), d = J(a), b = (d.w * d.w + d.x * d.x + d.y * d.y + d.z * d.z) ** -0.5;
    o = d.w * b, i = d.x * b, s = d.y * b, r = d.z * b, l = !0;
  }
  function T(u, p, f, _, y, I, a, d, b, B) {
    x = B ?? x, l || g(_, y, I, a ?? 0, d ?? 0, b ?? 0);
    let m, E, L, k, F, O, W, X, Y, Z, j, H, D, V, ee, h, v, te, $, Q, G, ie, _e, ce, re, ve, A, C, le, U, ue, S, q, ae, K;
    if (a === void 0 || d === void 0 || b === void 0 || a === 0 && d === 0 && b === 0) {
      w(u, p, f, _, y, I);
      return;
    }
    if (O = 0.5 * (-i * u - s * p - r * f), W = 0.5 * (o * u + s * f - r * p), X = 0.5 * (o * p - i * f + r * u), Y = 0.5 * (o * f + i * p - s * u), !(_ === 0 && y === 0 && I === 0)) {
      m = (_ * _ + y * y + I * I) ** -0.5;
      const me = _ * m, fe = y * m, Ae = I * m;
      m = (a * a + d * d + b * b) ** -0.5;
      const ne = a * m, de = d * m, pe = b * m;
      H = 2 * o * ne, D = 2 * o * de, V = 2 * o * pe, ee = 2 * i * ne, Q = 2 * o, G = 2 * i, ie = 2 * s, _e = 2 * r, ce = 2 * o * s, re = 2 * s * r, ve = o * o, A = o * i, C = o * s, le = o * r, U = i * i, ue = i * s, S = i * r, q = s * s, ae = s * r, K = r * r, Z = a * ve - D * r + V * s + a * U + G * d * s + G * b * r - a * q - a * K, j = H * r + d * ve - V * i + ee * s - d * U + d * q + ie * b * r - d * K, h = Math.sqrt(Z * Z + j * j), v = -H * s + D * i + b * ve + ee * r - b * U + ie * d * r - b * q + b * K, te = 2 * h, $ = 2 * v, E = -ie * (2 * S - ce - me) + G * (2 * A + re - fe) - v * s * (h * (0.5 - q - K) + v * (S - C) - ne) + (-h * r + v * i) * (h * (ue - le) + v * (A + ae) - de) + h * s * (h * (C + S) + v * (0.5 - U - q) - pe), L = _e * (2 * S - ce - me) + Q * (2 * A + re - fe) - 4 * i * (1 - 2 * U - 2 * q - Ae) + v * r * (h * (0.5 - q - K) + v * (S - C) - ne) + (h * s + v * o) * (h * (ue - le) + v * (A + ae) - de) + (h * r - $ * i) * (h * (C + S) + v * (0.5 - U - q) - pe), k = -Q * (2 * S - ce - me) + _e * (2 * A + re - fe) - 4 * s * (1 - 2 * U - 2 * q - Ae) + (-te * s - v * o) * (h * (0.5 - q - K) + v * (S - C) - ne) + (h * i + v * r) * (h * (ue - le) + v * (A + ae) - de) + (h * o - $ * s) * (h * (C + S) + v * (0.5 - U - q) - pe), F = G * (2 * S - ce - me) + ie * (2 * A + re - fe) + (-te * r + v * i) * (h * (0.5 - q - K) + v * (S - C) - ne) + (-h * o + v * s) * (h * (ue - le) + v * (A + ae) - de) + h * i * (h * (C + S) + v * (0.5 - U - q) - pe), m = (E * E + L * L + k * k + F * F) ** -0.5, E *= m, L *= m, k *= m, F *= m, O -= c * E, W -= c * L, X -= c * k, Y -= c * F;
    }
    o += O * x, i += W * x, s += X * x, r += Y * x, m = (o * o + i * i + s * s + r * r) ** -0.5, o *= m, i *= m, s *= m, r *= m;
  }
  return {
    update: T,
    init: g,
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
const Ce = ze(10), Ne = ze(10), xe = 180 / Math.PI;
function He(e, t) {
  let n;
  for (const c of e) {
    const l = t(c);
    l !== void 0 && (n = n === void 0 ? l : n + l);
  }
  return n;
}
function se(e, t = (n) => n) {
  const n = e == null ? 0 : e.length, c = He(e, t);
  return n ? c / n : Number.NaN;
}
function $e(e) {
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
const Qe = {
  // biome-ignore lint/complexity/useSimpleNumberKeys:
  1: "Left Joy-Con",
  // biome-ignore lint/complexity/useSimpleNumberKeys:
  2: "Right Joy-Con",
  // biome-ignore lint/complexity/useSimpleNumberKeys:
  3: "Pro Controller"
}, be = 0.75, Ge = 0.0125, Pe = Math.PI / 2;
function ye(e, t, n, c) {
  const l = Date.now(), o = e.timestamp ? (l - e.timestamp) / 1e3 : 0;
  e.timestamp = l;
  const i = Math.sqrt(
    n.x ** 2 + n.y ** 2 + n.z ** 2
  );
  return e.alpha = (1 - Ge) * (e.alpha + t.z * o), i !== 0 && (e.beta = be * (e.beta + t.x * o) + (1 - be) * (n.x * Pe / i), e.gamma = be * (e.gamma + t.y * o) + (1 - be) * (n.y * -Pe / i)), {
    alpha: c === 8198 ? (-1 * (e.alpha * 180) / Math.PI * 430 % 90).toFixed(6) : (e.alpha * 180 / Math.PI * 430 % 360).toFixed(6),
    beta: (-1 * (e.beta * 180) / Math.PI).toFixed(6),
    gamma: c === 8198 ? (-1 * (e.gamma * 180) / Math.PI).toFixed(6) : (e.gamma * 180 / Math.PI).toFixed(6)
  };
}
function Ie(e) {
  const t = e.w * e.w, n = e.x * e.x, c = e.y * e.y, l = e.z * e.z;
  return {
    alpha: (xe * Math.atan2(2 * (e.x * e.y + e.z * e.w), n - c - l + t)).toFixed(6),
    beta: (xe * -Math.asin(2 * (e.x * e.z - e.y * e.w))).toFixed(6),
    gamma: (xe * Math.atan2(2 * (e.y * e.z + e.x * e.w), -n - c + l + t)).toFixed(6)
  };
}
function we(e, t, n) {
  return n === 8198 ? (Ce.update(e.x, e.y, e.z, t.x, t.y, t.z), Ce.getQuaternion()) : (Ne.update(e.x, e.y, e.z, t.x, t.y, t.z), Ne.getQuaternion());
}
function N(e) {
  const t = new DataView(e.buffer);
  return Number.parseFloat((244e-6 * t.getInt16(0, !0)).toFixed(6));
}
function P(e) {
  const t = new DataView(e.buffer);
  return Number.parseFloat((0.06103 * t.getInt16(0, !0)).toFixed(6));
}
function z(e) {
  const t = new DataView(e.buffer);
  return Number.parseFloat((1694e-7 * t.getInt16(0, !0)).toFixed(6));
}
function Ke(e) {
  const t = e.slice(15, 26), n = t.slice(0, 1)[0], c = t.slice(1, 2)[0], l = t.slice(2, 3), o = t.slice(4, 10), i = [];
  for (const x of o)
    i.push(x.toString(16));
  const s = t.slice(11, 12);
  return {
    _raw: t.slice(0, 12),
    _hex: t.slice(0, 12),
    firmwareVersion: {
      major: n,
      minor: c
    },
    type: Qe[l[0]],
    macAddress: i.join(":"),
    spiColorInUse: s[0] === 1
  };
}
function We(e, t) {
  return {
    _raw: e.slice(0, 1),
    // index 0
    _hex: t.slice(0, 1)
  };
}
function Xe(e, t) {
  return {
    _raw: e.slice(1, 2),
    // index 1
    _hex: t.slice(1, 2)
  };
}
function Ye(e, t) {
  return {
    _raw: e.slice(2, 3),
    // high nibble
    _hex: t.slice(2, 3),
    level: $e(t.slice(2, 3))
  };
}
function Ze(e, t) {
  return {
    _raw: e.slice(2, 3),
    // low nibble
    _hex: t.slice(2, 3)
  };
}
function De(e, t) {
  return {
    _raw: e.slice(1, 3),
    // index 1,2
    _hex: t.slice(1, 3)
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
    chargingGrip: !!(128 & e[4])
  };
}
function et(e, t) {
  return {
    _raw: e.slice(3, 4),
    // index 3
    _hex: t.slice(3, 4)
  };
}
function tt(e, t) {
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
function nt(e, t) {
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
function ot(e, t) {
  return {
    _raw: e.slice(4),
    // index 4
    _hex: t.slice(4)
  };
}
function Re(e, t) {
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
function Me(e, t) {
  return {
    _raw: e.slice(14, 15),
    // index 14
    _hex: t.slice(14, 15)
  };
}
function qe(e, t) {
  return {
    _raw: e.slice(15),
    // index 15 ~
    _hex: t.slice(15)
  };
}
function Se(e, t) {
  return [
    {
      x: {
        _raw: e.slice(13, 15),
        // index 13,14
        _hex: t.slice(13, 15),
        acc: N(e.slice(13, 15))
      },
      y: {
        _raw: e.slice(15, 17),
        // index 15,16
        _hex: t.slice(15, 17),
        acc: N(e.slice(15, 17))
      },
      z: {
        _raw: e.slice(17, 19),
        // index 17,18
        _hex: t.slice(17, 19),
        acc: N(e.slice(17, 19))
      }
    },
    {
      x: {
        _raw: e.slice(25, 27),
        // index 25,26
        _hex: t.slice(25, 27),
        acc: N(e.slice(25, 27))
      },
      y: {
        _raw: e.slice(27, 29),
        // index 27,28
        _hex: t.slice(27, 29),
        acc: N(e.slice(27, 29))
      },
      z: {
        _raw: e.slice(29, 31),
        // index 29,30
        _hex: t.slice(29, 31),
        acc: N(e.slice(29, 31))
      }
    },
    {
      x: {
        _raw: e.slice(37, 39),
        // index 37,38
        _hex: t.slice(37, 39),
        acc: N(e.slice(37, 39))
      },
      y: {
        _raw: e.slice(39, 41),
        // index 39,40
        _hex: t.slice(39, 41),
        acc: N(e.slice(39, 41))
      },
      z: {
        _raw: e.slice(41, 43),
        // index 41,42
        _hex: t.slice(41, 43),
        acc: N(e.slice(41, 43))
      }
    }
  ];
}
function Ee(e, t) {
  return [
    [
      {
        _raw: e.slice(19, 21),
        // index 19,20
        _hex: t.slice(19, 21),
        dps: P(e.slice(19, 21)),
        rps: z(e.slice(19, 21))
      },
      {
        _raw: e.slice(21, 23),
        // index 21,22
        _hex: t.slice(21, 23),
        dps: P(e.slice(21, 23)),
        rps: z(e.slice(21, 23))
      },
      {
        _raw: e.slice(23, 25),
        // index 23,24
        _hex: t.slice(23, 25),
        dps: P(e.slice(23, 25)),
        rps: z(e.slice(23, 25))
      }
    ],
    [
      {
        _raw: e.slice(31, 33),
        // index 31,32
        _hex: t.slice(31, 33),
        dps: P(e.slice(31, 33)),
        rps: z(e.slice(31, 33))
      },
      {
        _raw: e.slice(33, 35),
        // index 33,34
        _hex: t.slice(33, 35),
        dps: P(e.slice(33, 35)),
        rps: z(e.slice(33, 35))
      },
      {
        _raw: e.slice(35, 37),
        // index 35,36
        _hex: t.slice(35, 37),
        dps: P(e.slice(35, 37)),
        rps: z(e.slice(35, 37))
      }
    ],
    [
      {
        _raw: e.slice(43, 45),
        // index 43,44
        _hex: t.slice(43, 45),
        dps: P(e.slice(43, 45)),
        rps: z(e.slice(43, 45))
      },
      {
        _raw: e.slice(45, 47),
        // index 45,46
        _hex: t.slice(45, 47),
        dps: P(e.slice(45, 47)),
        rps: z(e.slice(45, 47))
      },
      {
        _raw: e.slice(47, 49),
        // index 47,48
        _hex: t.slice(47, 49),
        dps: P(e.slice(47, 49)),
        rps: z(e.slice(47, 49))
      }
    ]
  ];
}
function Le(e) {
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
function oe(e) {
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
function Be(e, t) {
  return {
    _raw: e.slice(38, 2),
    _hex: t.slice(38, 2),
    strain: new DataView(e.buffer, 39, 2).getInt16(0, !0)
  };
}
const st = async (e) => {
  const t = ({
    subcommand: s,
    expectedReport: r,
    timeoutErrorMessage: x = "timeout."
  }) => (w) => new Promise((R, M) => {
    const J = setTimeout(() => {
      w.removeEventListener("inputreport", g), M(new Error(x));
    }, 5e3), g = (T) => {
      const u = T;
      if (u.reportId !== 33)
        return;
      const p = new Uint8Array(u.data.buffer);
      for (const [f, _] of Object.entries(r))
        if (p[Number(f) - 1] !== _)
          return;
      w.removeEventListener("inputreport", g), clearTimeout(J), setTimeout(R, 50);
    };
    w.addEventListener("inputreport", g), (async () => await w.sendReport(
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
function it(e, t) {
  const n = new (Object.getPrototypeOf(e)).constructor(
    e.length + t.length
  );
  return n.set(e, 0), n.set(t, e.length), n;
}
class Fe extends EventTarget {
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
    he(this, "eventListenerAttached", !1);
    he(this, "device");
    he(this, "lastValues");
    he(this, "ledstate", 0);
    this.device = n, this.lastValues = {
      timestamp: null,
      alpha: 0,
      beta: 0,
      gamma: 0
    };
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
        const { _raw: x, _hex: w, ...R } = r;
        i(R);
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
        const { _raw: x, _hex: w, ...R } = r;
        i(R);
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
    await st(this.device);
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
    const o = (g, T, u) => Math.min(Math.max(g, T), u), s = new Uint8Array(9);
    s[0] = 0;
    let r = o(n, 40.875885, 626.286133), x = o(c, 81.75177, 1252.572266);
    x = (Math.round(32 * Math.log2(x * 0.1)) - 96) * 4, r = Math.round(32 * Math.log2(r * 0.1)) - 64;
    const w = o(l, 0, 1);
    let R;
    w === 0 ? R = 0 : w < 0.117 ? R = (Math.log2(w * 1e3) * 32 - 96) / (5 - w ** 2) - 1 : w < 0.23 ? R = Math.log2(w * 1e3) * 32 - 96 - 92 : R = (Math.log2(w * 1e3) * 32 - 96) * 2 - 246;
    let M = Math.round(R) * 0.5;
    const J = M % 2;
    J > 0 && --M, M = M >> 1, M += 64, J > 0 && (M |= 32768), s[1] = x & 255, s[2] = R + (x >>> 8 & 255), s[3] = r + (M >>> 8 & 255), s[4] += M & 255;
    for (let g = 0; g < 4; g++)
      s[5 + g] = s[1 + g];
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
    var r, x;
    if (!n)
      return;
    const o = it(
      new Uint8Array([c]),
      new Uint8Array(n.buffer)
    ), i = Array.from(o).map((w) => w.toString(16).padStart(2, "0")).join("");
    let s = {
      inputReportID: We(o, i)
    };
    switch (c) {
      case 63: {
        s = {
          ...s,
          buttonStatus: De(o, i),
          analogStick: et(o, i),
          filter: ot(o, i)
        };
        break;
      }
      case 33:
      case 48: {
        if (s = {
          ...s,
          timer: Xe(o, i),
          batteryLevel: Ye(o, i),
          connectionInfo: Ze(o, i),
          buttonStatus: Ve(
            o,
            i
          ),
          analogStickLeft: tt(o, i),
          analogStickRight: nt(
            o,
            i
          ),
          vibrator: Re == null ? void 0 : Re(o, i)
        }, c === 33 && (s = {
          ...s,
          ack: ge == null ? void 0 : ge(o, i),
          subcommandID: Me == null ? void 0 : Me(o, i),
          subcommandReplyData: qe == null ? void 0 : qe(
            o,
            i
          ),
          deviceInfo: Ke(o)
        }), c === 48) {
          const w = Se == null ? void 0 : Se(
            o,
            i
          ), R = Ee == null ? void 0 : Ee(o, i), M = oe == null ? void 0 : oe(
            R.map((u) => u.map((p) => p.rps ?? 0))
          ), J = oe == null ? void 0 : oe(
            R.map((u) => u.map((p) => p.dps ?? 0))
          ), g = Le == null ? void 0 : Le(
            w.map((u) => [
              u.x.acc ?? 0,
              u.y.acc ?? 0,
              u.z.acc ?? 0
            ])
          ), T = we == null ? void 0 : we(
            M,
            g,
            l.productId
          );
          s = {
            ...s,
            accelerometers: w,
            gyroscopes: R,
            actualAccelerometer: g,
            actualGyroscope: { dps: J, rps: M },
            actualOrientation: ye == null ? void 0 : ye(
              this.lastValues,
              M,
              g,
              l.productId
            ),
            actualOrientationQuaternion: Ie == null ? void 0 : Ie(T),
            quaternion: T,
            ringCon: Be == null ? void 0 : Be(o, i)
          };
        }
        break;
      }
    }
    (r = s.deviceInfo) != null && r.type && this._receiveDeviceInfo(s.deviceInfo), (x = s.batteryLevel) != null && x.level && this._receiveBatteryLevel(s.batteryLevel), this._receiveInputEvent(s);
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
class ct extends Fe {
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
class rt extends Fe {
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
class lt extends Fe {
  /**
   * Dispatches a "hidinput" custom event with the provided packet as its detail.
   *
   * @param packet - The input data received from the HID device.
   */
  _receiveInputEvent(t) {
    this.dispatchEvent(new CustomEvent("hidinput", { detail: t }));
  }
}
const ut = async (e) => {
  let t = null;
  return e.productId === 8198 ? t = new ct(e) : e.productId === 8199 && e.productName === "Joy-Con (R)" && (t = new rt(e)), t || (t = new lt(e)), await t.open(), await t.enableUSBHIDJoystickReport(), await t.enableStandardFullMode(), await t.enableIMUMode(), t;
}, Je = /* @__PURE__ */ new Map(), ke = [], Te = (e) => {
  const t = ke.indexOf(e);
  return t >= 0 ? t : (ke.push(e), ke.length - 1);
}, Ue = async (e) => {
  const t = Te(e);
  console.log(
    `HID connected: ${t} ${e.productId.toString(16)} ${e.productName}`
  ), Je.set(t, await ut(e));
}, at = async (e) => {
  const t = Te(e);
  console.log(
    `HID disconnected: ${t} ${e.productId.toString(16)} ${e.productName}`
  ), Je.delete(t);
};
navigator.hid.addEventListener("connect", async ({ device: e }) => {
  Ue(e);
});
navigator.hid.addEventListener("disconnect", ({ device: e }) => {
  at(e);
});
document.addEventListener("DOMContentLoaded", async () => {
  const e = await navigator.hid.getDevices();
  for (const t of e)
    await Ue(t);
});
const pt = async () => {
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
    await Ue(t);
  } catch (t) {
    t instanceof Error ? console.error(t.name, t.message) : console.error(t);
  }
};
export {
  lt as GeneralController,
  ct as JoyConLeft,
  rt as JoyConRight,
  pt as connectJoyCon,
  Je as connectedJoyCons
};
