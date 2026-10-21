/* BaZi + almanac engine. Calendar maths comes from lunar-javascript (MIT, 6tail);
   this file adds birthplace / true-solar-time handling and the personal scoring layer.
   No DOM access, so it also runs under Node for testing. */
(function (root) {
  'use strict';
  var Solar = root.Solar, LunarUtil = root.LunarUtil;

  var GAN_EL = {'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'};
  var ZHI_EL = {'子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'};
  var ZHI_ANIMAL = {'子':'鼠','丑':'牛','寅':'虎','卯':'兔','辰':'龙','巳':'蛇','午':'马','未':'羊','申':'猴','酉':'鸡','戌':'狗','亥':'猪'};
  var ANIMAL_EN = {'鼠':'Rat','牛':'Ox','虎':'Tiger','兔':'Rabbit','龙':'Dragon','蛇':'Snake','马':'Horse','羊':'Goat','猴':'Monkey','鸡':'Rooster','狗':'Dog','猪':'Pig'};
  var GEN = {'木':'火','火':'土','土':'金','金':'水','水':'木'};   // X generates GEN[X]
  var CTRL = {'木':'土','土':'水','水':'火','火':'金','金':'木'};  // X controls CTRL[X]
  var ELEMENTS = ['木','火','土','金','水'];
  var EL_EN = {'木':'Wood','火':'Fire','土':'Earth','金':'Metal','水':'Water'};
  var ZX_EN = {'成':'Success','开':'Open','定':'Settle','满':'Full','除':'Remove','破':'Break','危':'Danger','闭':'Close'};
  var CHONG = {'子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳'};
  var HE = {'子':'丑','丑':'子','寅':'亥','亥':'寅','卯':'戌','戌':'卯','辰':'酉','酉':'辰','巳':'申','申':'巳','午':'未','未':'午'};
  var HAI = {'子':'未','未':'子','丑':'午','午':'丑','寅':'巳','巳':'寅','卯':'辰','辰':'卯','申':'亥','亥':'申','酉':'戌','戌':'酉'};
  var SANHE = ['申子辰','寅午戌','巳酉丑','亥卯未'];

  function keyOf(obj, val) { for (var k in obj) if (obj[k] === val) return k; }
  function genBy(el) { return keyOf(GEN, el); }     // resource: the element that feeds el
  function ctrlBy(el) { return keyOf(CTRL, el); }   // officer: the element that controls el
  function sanhe(a, b) { return a !== b && SANHE.some(function (g) { return g.indexOf(a) >= 0 && g.indexOf(b) >= 0; }); }

  /* ---------- birthplace & time ---------- */

  // Minutes east of UTC for an IANA zone at a given instant (uses the browser's
  // historical tz database, so old offsets and daylight saving are handled).
  function tzOffset(tz, ms) {
    var f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit',
      day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    var p = {};
    f.formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = x.value; });
    var h = +p.hour === 24 ? 0 : +p.hour;
    var asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, h, +p.minute, +p.second);
    return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
  }

  // Wall-clock time in a zone -> UTC milliseconds.
  function localToUtc(y, mo, d, h, mi, tz) {
    var guess = Date.UTC(y, mo - 1, d, h, mi);
    var off1 = tzOffset(tz, guess);
    var utc = guess - off1 * 60000;
    var off2 = tzOffset(tz, utc);
    return off2 === off1 ? utc : guess - off2 * 60000;
  }

  // Equation of time in minutes (sundial minus clock), accurate to ~1 minute.
  function equationOfTime(ms) {
    var dt = new Date(ms);
    var n = Math.floor((ms - Date.UTC(dt.getUTCFullYear(), 0, 0)) / 86400000);
    var b = 2 * Math.PI * (n - 81) / 365;
    return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  }

  function solarFromMs(ms) {
    var d = new Date(ms);
    return Solar.fromYmdHms(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(),
      d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
  }

  function fmtMs(ms) {
    var d = new Date(ms);
    function z(n) { return (n < 10 ? '0' : '') + n; }
    return d.getUTCFullYear() + '-' + z(d.getUTCMonth() + 1) + '-' + z(d.getUTCDate()) + ' ' + z(d.getUTCHours()) + ':' + z(d.getUTCMinutes());
  }

  /* ---------- natal chart ---------- */

  function pillar(gan, zhi, dayGan, isDay) {
    var hide = LunarUtil.ZHI_HIDE_GAN[zhi] || [];
    return {
      gan: gan, zhi: zhi, gz: gan + zhi,
      ganEl: GAN_EL[gan], zhiEl: ZHI_EL[zhi],
      ganGod: isDay ? '日主' : LunarUtil.SHI_SHEN[dayGan + gan],
      hide: hide.map(function (g) { return { gan: g, el: GAN_EL[g], god: LunarUtil.SHI_SHEN[dayGan + g] }; }),
      nayin: LunarUtil.NAYIN[gan + zhi]
    };
  }

  /* profile: { gender: 1 male | 0 female, date:'YYYY-MM-DD', time:'HH:MM', unknownTime,
                place:{ lat, lon, tz }, sect: 1 (day starts 23:00) | 2 (day starts 00:00) } */
  function computeChart(p) {
    var ds = p.date.split('-').map(Number);
    var hm = (p.unknownTime || !p.time ? '12:00' : p.time).split(':').map(Number);
    var place = p.place;
    var utc = localToUtc(ds[0], ds[1], ds[2], hm[0], hm[1], place.tz);
    var offset = tzOffset(place.tz, utc);
    var lonCorr = place.lon * 4;                 // minutes from Greenwich mean time
    var eot = equationOfTime(utc);
    var tstMs = utc + (lonCorr + eot) * 60000;   // true (apparent) solar time at birthplace
    var bjMs = utc + 8 * 3600000;                // solar terms are tabulated in UTC+8

    var sect = p.sect === 2 ? 2 : 1;
    var ecT = solarFromMs(tstMs).getLunar().getEightChar(); ecT.setSect(sect);
    var ecB = solarFromMs(bjMs).getLunar().getEightChar(); ecB.setSect(sect);

    var dayGan = ecT.getDayGan();
    // Year and month pillars change at solar-term instants, so they are read from the
    // absolute moment; day and hour pillars follow the sun at the birthplace.
    var pillars = [
      pillar(ecB.getYearGan(), ecB.getYearZhi(), dayGan),
      pillar(ecB.getMonthGan(), ecB.getMonthZhi(), dayGan),
      pillar(dayGan, ecT.getDayZhi(), dayGan, true),
      p.unknownTime ? null : pillar(ecT.getTimeGan(), ecT.getTimeZhi(), dayGan)
    ];

    // Five-element weights: stems 1, hidden stems 1 / .5 / .3, month branch doubled (seasonal command).
    var w = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    pillars.forEach(function (pl, i) {
      if (!pl) return;
      w[pl.ganEl] += 1;
      var mult = i === 1 ? 2 : 1;
      pl.hide.forEach(function (h, j) { w[h.el] += [1, 0.5, 0.3][j] * mult; });
    });
    var total = ELEMENTS.reduce(function (s, e) { return s + w[e]; }, 0);
    var dmEl = GAN_EL[dayGan], resEl = genBy(dmEl);
    var ratio = (w[dmEl] + w[resEl]) / total;
    var strong = ratio >= 0.5;
    var fav = strong ? [GEN[dmEl], CTRL[dmEl], ctrlBy(dmEl)] : [resEl, dmEl];
    var unfav = strong ? [resEl, dmEl] : [ctrlBy(dmEl), CTRL[dmEl], GEN[dmEl]];

    var yun = ecB.getYun(p.gender === 0 ? 0 : 1);
    var luck = yun.getDaYun().filter(function (d) { return d.getGanZhi(); }).slice(0, 8).map(function (d) {
      var gz = d.getGanZhi();
      return { gz: gz, age: d.getStartAge(), year: d.getStartYear(), ganEl: GAN_EL[gz[0]], zhiEl: ZHI_EL[gz[1]],
        god: LunarUtil.SHI_SHEN[dayGan + gz[0]] };
    });

    var birthLunar = Solar.fromYmdHms(ds[0], ds[1], ds[2], hm[0], hm[1], 0).getLunar();
    return {
      pillars: pillars, dayGan: dayGan, dayZhi: pillars[2].zhi, yearZhi: pillars[0].zhi,
      animal: ZHI_ANIMAL[pillars[0].zhi],
      dmEl: dmEl, weights: w, total: total, ratio: ratio, strong: strong, fav: fav, unfav: unfav,
      luck: luck, yunStart: { y: yun.getStartYear(), m: yun.getStartMonth(), d: yun.getStartDay() },
      lunarBirth: birthLunar.getYearInGanZhi() + '年 ' + birthLunar.getMonthInChinese() + '月' + birthLunar.getDayInChinese(),
      trace: {
        clock: p.date + ' ' + (p.unknownTime ? '12:00' : p.time), offset: offset, utc: fmtMs(utc),
        lonCorr: lonCorr, eot: eot, tst: fmtMs(tstMs), bj: fmtMs(bjMs), unknownTime: !!p.unknownTime
      }
    };
  }

  /* ---------- personal scoring ---------- */

  // gan/zhi: the period's stem & branch; type: '黄道'|'黑道'; extra: [[zh, en, delta]]
  function scorePeriod(gan, zhi, type, chart, extra) {
    var s = 60, why = [];
    function add(d, zh, en) { s += d; why.push([zh, en, d]); }
    if (type === '黄道') add(8, '黄道吉时段', 'Yellow Path (auspicious) period');
    else if (type === '黑道') add(-8, '黑道时段', 'Black Path (inauspicious) period');
    (extra || []).forEach(function (x) { add(x[2], x[0], x[1]); });
    if (chart) {
      var ge = GAN_EL[gan], ze = ZHI_EL[zhi];
      if (chart.fav.indexOf(ge) >= 0) add(10, '天干' + gan + '属' + ge + '，为你的喜用', 'Stem ' + gan + ' carries ' + EL_EN[ge] + ', a helpful element for you');
      else if (chart.unfav.indexOf(ge) >= 0) add(-7, '天干' + gan + '属' + ge + '，非你所喜', 'Stem ' + gan + ' carries ' + EL_EN[ge] + ', a less helpful element for you');
      if (chart.fav.indexOf(ze) >= 0) add(7, '地支' + zhi + '属' + ze + '，助你', 'Branch ' + zhi + ' carries ' + EL_EN[ze] + ', which supports you');
      else if (chart.unfav.indexOf(ze) >= 0) add(-5, '地支' + zhi + '属' + ze + '，耗你', 'Branch ' + zhi + ' carries ' + EL_EN[ze] + ', which drains you');
      var dz = chart.dayZhi, yz = chart.yearZhi;
      if (CHONG[zhi] === dz) add(-15, zhi + '冲你的日支' + dz, zhi + ' clashes with your Day Branch ' + dz);
      else if (HE[zhi] === dz) add(8, zhi + '与你的日支' + dz + '六合', zhi + ' forms a Six Harmony with your Day Branch ' + dz);
      else if (sanhe(zhi, dz)) add(5, zhi + '与你的日支' + dz + '三合', zhi + ' is in Three Harmony with your Day Branch ' + dz);
      else if (HAI[zhi] === dz) add(-4, zhi + '与你的日支' + dz + '相害', zhi + ' harms your Day Branch ' + dz);
      if (CHONG[zhi] === yz && yz !== dz) add(-6, '冲你的生肖（' + ZHI_ANIMAL[yz] + '）', 'Clashes with your zodiac sign (' + ANIMAL_EN[ZHI_ANIMAL[yz]] + ')');
    }
    s = Math.max(5, Math.min(98, s));
    return { score: s, why: why, tier: tier(s) };
  }

  function tier(s) {
    if (s >= 80) return { k: 5, zh: '大吉', en: 'Excellent' };
    if (s >= 66) return { k: 4, zh: '吉', en: 'Good' };
    if (s >= 50) return { k: 3, zh: '平', en: 'Fair' };
    if (s >= 36) return { k: 2, zh: '小心', en: 'Take care' };
    return { k: 1, zh: '凶', en: 'Challenging' };
  }

  var ZHIXING_ADJ = { '成': 4, '开': 4, '定': 3, '满': 2, '除': 2, '破': -6, '危': -3, '闭': -3 };

  function dayReading(y, m, d, chart) {
    var lunar = Solar.fromYmd(y, m, d).getLunar();
    var gan = lunar.getDayGan(), zhi = lunar.getDayZhi(), zx = lunar.getZhiXing();
    var extra = ZHIXING_ADJ[zx] ? [['建除值' + zx, 'Day officer: ' + ZX_EN[zx] + ' (' + zx + ')', ZHIXING_ADJ[zx]]] : [];
    var sc = scorePeriod(gan, zhi, lunar.getDayTianShenType(), chart, extra);
    return {
      lunar: lunar, gan: gan, zhi: zhi, zhiXing: zx, score: sc,
      god: chart ? LunarUtil.SHI_SHEN[chart.dayGan + gan] : null,
      times: lunar.getTimes().map(function (t) {
        var tsc = scorePeriod(t.getGan(), t.getZhi(), t.getTianShenType(), chart);
        return { t: t, gan: t.getGan(), zhi: t.getZhi(), start: t.getMinHm(), end: t.getMaxHm(), score: tsc,
          god: chart ? LunarUtil.SHI_SHEN[chart.dayGan + t.getGan()] : null };
      })
    };
  }

  root.ENG = {
    GAN_EL: GAN_EL, ZHI_EL: ZHI_EL, ZHI_ANIMAL: ZHI_ANIMAL, ELEMENTS: ELEMENTS, GEN: GEN, CTRL: CTRL,
    tzOffset: tzOffset, localToUtc: localToUtc, equationOfTime: equationOfTime,
    computeChart: computeChart, dayReading: dayReading, scorePeriod: scorePeriod
  };
})(typeof window !== 'undefined' ? window : globalThis);
