/* UI for the BaZi Almanac. Everything is stored on the device (localStorage). */
(function () {
  'use strict';
  var E = window.ENG, T = TERMS;
  var KEY = 'bazi-almanac-v1';
  var S = { profile: null, chart: null, lang: 'both', tab: 'today', date: null, draft: null };

  /* ---------- storage ---------- */
  function load() {
    try { var o = JSON.parse(localStorage.getItem(KEY) || '{}'); S.profile = o.profile || null; S.lang = o.lang || 'both'; } catch (e) {}
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ profile: S.profile, lang: S.lang })); } catch (e) {}
  }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function L(zh, en) { return '<span class="zh">' + zh + '</span><span class="en">' + en + '</span>'; }
  function term(zh, dict) {
    var en = T[dict][zh];
    return en ? '<span class="zh">' + esc(zh) + '</span><span class="en">' + esc(en) + '</span>' : '<span class="cn">' + esc(zh) + '</span>';
  }
  // Chinese characters always visible, English gloss after them
  function termCn(zh, dict) {
    var en = T[dict][zh];
    return '<span class="cn">' + esc(zh) + '</span>' + (en ? '<span class="en gloss">' + esc(en) + '</span>' : '');
  }
  function el(e) { return '<span class="el el-' + T.element[e] + '">' + e + '<span class="en"> ' + T.element[e] + '</span></span>'; }
  // 甲寅 -> "Wood Tiger" (stem and branch always share yin/yang, so element + animal is unambiguous)
  function gzEn(gz) { return T.element[E.GAN_EL[gz[0]]] + ' ' + T.branch[gz[1]]; }
  function gzGloss(gz) { return '<span class="cn">' + gz + '</span><span class="en gloss">' + gzEn(gz) + '</span>'; }
  function z(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() }; }
  function todayYmd() { return ymd(new Date()); }
  function isToday(o) { var t = todayYmd(); return o.y === t.y && o.m === t.m && o.d === t.d; }
  function shift(o, days) { return ymd(new Date(o.y, o.m - 1, o.d + days)); }
  var MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function dateLabel(o) {
    var w = new Date(o.y, o.m - 1, o.d).getDay();
    return L(o.y + '年' + o.m + '月' + o.d + '日 星期' + T.week[w], T.weekEn[w] + ', ' + o.d + ' ' + MONTH_EN[o.m - 1] + ' ' + o.y);
  }
  function animalOf(desc) { var a = desc.slice(-1); return term(a, 'animal'); }
  function arrow(dirZh) {
    var a = T.dirAngle[dirZh];
    if (a == null) return '';
    return '<svg class="arrow" viewBox="0 0 24 24" style="transform:rotate(' + a + 'deg)" aria-hidden="true"><path d="M12 3l5 9h-3.5v9h-3v-9H7z"/></svg>';
  }
  function tierClass(t) { return 'tier' + t.k; }
  function scoreBadge(sc) {
    return '<span class="badge ' + tierClass(sc.tier) + '">' + sc.score + ' · ' + L(sc.tier.zh, sc.tier.en) + '</span>';
  }
  function chips(list, dict, cls) {
    if (!list || !list.length) return '<span class="muted">—</span>';
    return list.map(function (x) { return '<span class="chip ' + (cls || '') + '">' + termCn(x, dict) + '</span>'; }).join('');
  }
  function why(sc) {
    return '<ul class="why">' + sc.why.map(function (w) {
      return '<li><b class="' + (w[2] >= 0 ? 'up' : 'down') + '">' + (w[2] > 0 ? '+' : '') + w[2] + '</b> ' + L(esc(w[0]), esc(w[1])) + '</li>';
    }).join('') + '</ul>';
  }
  function lunarDate(lunar) {
    var m = lunar.getMonth(), leap = m < 0;
    return L('农历' + lunar.getMonthInChinese() + '月' + lunar.getDayInChinese(),
      'Lunar ' + (leap ? 'leap ' : '') + 'month ' + Math.abs(m) + ', day ' + lunar.getDay());
  }
  function currentTimeIdx(times) {
    var now = new Date(), hm = z(now.getHours()) + ':' + z(now.getMinutes());
    for (var i = 0; i < times.length; i++) if (hm >= times[i].start && hm <= times[i].end) return i;
    return -1;
  }
  function shichenName(t, i, n) {
    var nm = T.shichen[t.zhi];
    var zh = t.zhi + '时', en = nm[1] + ' (' + t.zhi + ')';
    if (t.zhi === '子') { zh = (i === 0 ? '早' : '夜') + zh; en = (i === 0 ? 'Early ' : 'Late ') + en; }
    return L(zh + ' · ' + nm[0], en);
  }

  /* ---------- chart ---------- */
  function refreshChart() {
    S.chart = null;
    if (!S.profile) return;
    try { S.chart = E.computeChart(S.profile); } catch (e) { console.error(e); }
  }

  /* ---------- views ---------- */
  function dateBar() {
    var o = S.date;
    return '<div class="datebar">' +
      '<button class="nav" data-act="prev" aria-label="Previous day">‹</button>' +
      '<label class="datepick">' + dateLabel(o) +
      '<input type="date" id="pickDate" value="' + o.y + '-' + z(o.m) + '-' + z(o.d) + '"></label>' +
      '<button class="nav" data-act="next" aria-label="Next day">›</button>' +
      (isToday(o) ? '' : '<button class="today-btn" data-act="today">' + L('今天', 'Today') + '</button>') +
      '</div>';
  }

  function setupPrompt() {
    return '<div class="card prompt"><p>' + L('输入出生资料，即可获得个人化的每日及时辰运势。', 'Add your birth details to get personal daily and two-hour readings.') +
      '</p><button class="btn primary" data-tab="me">' + L('开始设定', 'Set up my chart') + '</button></div>';
  }

  function viewToday() {
    var o = S.date, c = S.chart, r = E.dayReading(o.y, o.m, o.d, c), lu = r.lunar;
    var jq = lu.getJieQi();
    var h = dateBar();
    h += '<div class="card hero"><div class="lunar">' + lunarDate(lu) + '</div>' +
      '<div class="gz cn">' + lu.getYearInGanZhi() + '年 ' + lu.getMonthInGanZhi() + '月 ' + lu.getDayInGanZhi() + '日</div>' +
      '<div class="en gz-en">' + gzEn(lu.getYearInGanZhi()) + ' year · ' + gzEn(lu.getMonthInGanZhi()) + ' month · ' + gzEn(lu.getDayInGanZhi()) + ' day</div>' +
      '<div class="sub">' + L(lu.getYearShengXiao() + '年 · 纳音' + lu.getDayNaYin(), 'Year of the ' + T.animal[lu.getYearShengXiao()] + ' · Day sound element: ' + T.nayin[lu.getDayNaYin()]) +
      (jq ? ' · <b>' + termCn(jq, 'jieQi') + '</b>' : '') + '</div></div>';

    if (c) {
      h += '<div class="card score-card ' + tierClass(r.score.tier) + '">' +
        '<div class="ring" style="--p:' + r.score.score + '"><b>' + r.score.score + '</b></div>' +
        '<div class="score-txt"><div class="label">' + L('今日个人运势', 'Your luck today') + '</div>' +
        '<div class="tier-name">' + L(r.score.tier.zh, r.score.tier.en) + '</div>' +
        '<div class="theme"><span class="tag">' + termCn(r.god, 'shiShen') + '</span> ' + L(T.theme[r.god][0], T.theme[r.god][1]) + '</div></div>' +
        '<details class="whybox"><summary>' + L('为什么？', 'Why this score?') + '</summary>' + why(r.score) + '</details></div>';
    } else h += setupPrompt();

    if (isToday(o)) {
      var i = currentTimeIdx(r.times);
      if (i >= 0) {
        var t = r.times[i];
        h += '<div class="card now"><div class="card-h">' + L('当前时辰', 'Right now') + ' <span class="muted">' + t.start + '–' + t.end + '</span></div>' +
          '<div class="now-row"><div><div class="big cn">' + t.gan + t.zhi + '</div><div class="en small">' + gzEn(t.gan + t.zhi) + '</div>' + shichenName(t, i) + '</div>' +
          (c ? scoreBadge(t.score) : '<span class="badge ' + (t.t.getTianShenLuck() === '吉' ? 'tier4' : 'tier2') + '">' + termCn(t.t.getTianShen(), 'tianShen') + '</span>') + '</div>' +
          '<div class="mini">' + L('财神', 'Wealth') + ' ' + arrow(t.t.getPositionCaiDesc()) + term(t.t.getPositionCaiDesc(), 'dir') +
          ' · ' + L('喜神', 'Joy') + ' ' + arrow(t.t.getPositionXiDesc()) + term(t.t.getPositionXiDesc(), 'dir') + '</div>' +
          '<button class="link" data-tab="hours">' + L('查看全部时辰 →', 'See all two-hour readings →') + '</button></div>';
      }
    }

    h += '<div class="card"><div class="card-h ok">' + L('宜', 'Good for') + '</div><div class="chips">' + chips(lu.getDayYi(), 'yiji', 'yi') + '</div>' +
      '<div class="card-h bad">' + L('忌', 'Avoid') + '</div><div class="chips">' + chips(lu.getDayJi(), 'yiji', 'ji') + '</div></div>';

    var dirs = [['喜神', 'Joy God', lu.getDayPositionXiDesc()], ['财神', 'Wealth God', lu.getDayPositionCaiDesc()],
      ['福神', 'Fortune God', lu.getDayPositionFuDesc()], ['阳贵神', 'Noble (day)', lu.getDayPositionYangGuiDesc()]];
    h += '<div class="card"><div class="card-h">' + L('吉神方位', 'Lucky directions') + '</div><div class="dirs">' +
      dirs.map(function (d) { return '<div class="dir">' + arrow(d[2]) + '<div><div class="muted small">' + L(d[0], d[1]) + '</div>' + term(d[2], 'dir') + '</div></div>'; }).join('') +
      '</div></div>';

    var ts = lu.getDayTianShen();
    h += '<div class="card"><div class="card-h">' + L('今日详情', 'Day details') + '</div><dl class="facts">' +
      '<dt>' + L('冲煞', 'Clash') + '</dt><dd>' + L('冲' + lu.getDayChongDesc() + ' 煞' + lu.getDaySha(),
        'Clashes with ' + T.animal[lu.getDayChongShengXiao()] + ' · Sha in the ' + T.dir[lu.getDaySha()]) + '</dd>' +
      '<dt>' + L('值神', 'Day spirit') + '</dt><dd>' + termCn(ts, 'tianShen') + ' <span class="muted">' + L(lu.getDayTianShenType(), lu.getDayTianShenType() === '黄道' ? 'Yellow Path · auspicious' : 'Black Path · inauspicious') + '</span></dd>' +
      '<dt>' + L('建除', 'Day officer') + '</dt><dd>' + termCn(lu.getZhiXing(), 'zhiXing') + '</dd>' +
      '<dt>' + L('星宿', 'Lunar mansion') + '</dt><dd>' + L(lu.getXiu() + lu.getZheng() + lu.getAnimal() + ' · ' + lu.getXiuLuck(),
        T.xiu[lu.getXiu()] + ' mansion (' + T.xiuZheng[lu.getZheng()] + ', ' + T.xiuAnimal[lu.getAnimal()] + ') · ' + (lu.getXiuLuck() === '吉' ? 'lucky' : 'unlucky')) + '</dd>' +
      '<dt>' + L('彭祖百忌', 'Pengzu taboos') + '</dt><dd>' + L(lu.getPengZuGan() + ' ' + lu.getPengZuZhi(),
        T.pengzu[lu.getPengZuGan()] + '. ' + T.pengzu[lu.getPengZuZhi()] + '.') + '</dd>' +
      '</dl><div class="card-h small">' + L('吉神宜趋', 'Lucky stars') + '</div><div class="chips">' + chips(lu.getDayJiShen(), 'shenSha', 'yi') + '</div>' +
      '<div class="card-h small">' + L('凶煞宜忌', 'Unlucky stars') + '</div><div class="chips">' + chips(lu.getDayXiongSha(), 'shenSha', 'ji') + '</div></div>';

    // 7-day strip
    var start = shift(o, -3);
    h += '<div class="card"><div class="card-h">' + L('本周', 'This week') + '</div><div class="week">';
    for (var k = 0; k < 7; k++) {
      var dd = shift(start, k), rr = E.dayReading(dd.y, dd.m, dd.d, c);
      var w = new Date(dd.y, dd.m - 1, dd.d).getDay();
      h += '<button class="wday ' + (k === 3 ? 'sel ' : '') + tierClass(rr.score.tier) + '" data-go="' + dd.y + '-' + dd.m + '-' + dd.d + '">' +
        '<span class="small">' + L(T.week[w], T.weekEn[w]) + '</span><b>' + dd.d + '</b><span class="dot"></span>' +
        '<span class="small">' + (c ? rr.score.score : rr.lunar.getDayTianShenType()) + '</span></button>';
    }
    h += '</div></div>';
    return h;
  }

  function viewHours() {
    var o = S.date, c = S.chart, r = E.dayReading(o.y, o.m, o.d, c);
    var cur = isToday(o) ? currentTimeIdx(r.times) : -1;
    var h = dateBar();
    if (!c) h += setupPrompt();
    h += '<p class="note">' + L('每个时辰约两小时，以本机时间为准。点开查看宜忌与方位。', 'Each block is about two hours, using this phone’s clock. Tap one for to-dos and directions.') + '</p>';
    r.times.forEach(function (t, i) {
      var lt = t.t, luck = lt.getTianShenLuck() === '吉';
      h += '<details class="card hour ' + (i === cur ? 'current' : '') + '"' + (i === cur ? ' open id="curHour"' : '') + '>' +
        '<summary><div class="h-time">' + t.start + '<br><span class="muted">' + t.end + '</span></div>' +
        '<div class="h-main"><div><b>' + gzGloss(t.gan + t.zhi) + '</b> ' + shichenName(t, i) + '</div>' +
        '<div class="small muted">' + termCn(lt.getTianShen(), 'tianShen') + ' · ' + L(luck ? '吉' : '凶', luck ? 'lucky' : 'unlucky') +
        (c ? ' · ' + termCn(t.god, 'shiShen') : '') + '</div>' +
        (c ? '<div class="bar ' + tierClass(t.score.tier) + '"><i style="width:' + t.score.score + '%"></i></div>' : '') + '</div>' +
        (c ? '<div class="h-score ' + tierClass(t.score.tier) + '">' + t.score.score + '</div>' : '') +
        '</summary><div class="h-body">' +
        '<div class="card-h ok small">' + L('宜', 'Good for') + '</div><div class="chips">' + chips(lt.getYi(), 'yiji', 'yi') + '</div>' +
        '<div class="card-h bad small">' + L('忌', 'Avoid') + '</div><div class="chips">' + chips(lt.getJi(), 'yiji', 'ji') + '</div>' +
        '<div class="mini">' + L('财神', 'Wealth') + ' ' + arrow(lt.getPositionCaiDesc()) + term(lt.getPositionCaiDesc(), 'dir') +
        ' · ' + L('喜神', 'Joy') + ' ' + arrow(lt.getPositionXiDesc()) + term(lt.getPositionXiDesc(), 'dir') +
        ' · ' + L('福神', 'Fortune') + ' ' + arrow(lt.getPositionFuDesc()) + term(lt.getPositionFuDesc(), 'dir') + '</div>' +
        '<div class="mini">' + L('冲' + lt.getChongDesc() + ' 煞' + lt.getSha(), 'Clashes with ' + T.animal[lt.getChongShengXiao()] + ' · Sha in the ' + T.dir[lt.getSha()]) + '</div>' +
        (c ? '<div class="theme">' + L(T.theme[t.god][0], T.theme[t.god][1]) + '</div>' + why(t.score) : '') +
        '</div></details>';
    });
    return h;
  }

  function viewMonth() {
    var o = S.date, c = S.chart;
    var first = new Date(o.y, o.m - 1, 1), days = new Date(o.y, o.m, 0).getDate(), lead = first.getDay();
    var h = '<div class="datebar"><button class="nav" data-act="pm">‹</button><div class="datepick">' +
      L(o.y + '年' + o.m + '月', MONTH_EN[o.m - 1] + ' ' + o.y) + '</div><button class="nav" data-act="nm">›</button></div>';
    h += '<div class="card"><div class="grid">' + T.week.map(function (w, i) { return '<div class="gh">' + L(w, T.weekEn[i].slice(0, 2)) + '</div>'; }).join('');
    for (var i = 0; i < lead; i++) h += '<div></div>';
    for (var d = 1; d <= days; d++) {
      var r = E.dayReading(o.y, o.m, d, c), lu = r.lunar, jq = lu.getJieQi();
      var sub = jq || (lu.getDay() === 1 ? lu.getMonthInChinese() + '月' : lu.getDayInChinese());
      var subEn = jq ? T.jieQi[jq] : (lu.getDay() === 1 ? 'LM' + Math.abs(lu.getMonth()) : 'L' + lu.getDay());
      var sel = d === o.d ? ' sel' : '', td = isToday({ y: o.y, m: o.m, d: d }) ? ' is-today' : '';
      h += '<button class="cell ' + tierClass(r.score.tier) + sel + td + '" data-go="' + o.y + '-' + o.m + '-' + d + '">' +
        '<b>' + d + '</b><span class="zh tiny">' + sub + '</span><span class="en tiny">' + subEn + '</span>' +
        '<span class="tiny">' + (c ? r.score.score : (lu.getDayTianShenType() === '黄道' ? '●' : '○')) + '</span></button>';
    }
    h += '</div><div class="legend">' + [5, 4, 3, 2, 1].map(function (k) {
      var t = { 5: ['大吉', 'Excellent'], 4: ['吉', 'Good'], 3: ['平', 'Fair'], 2: ['小心', 'Take care'], 1: ['凶', 'Challenging'] }[k];
      return '<span class="tier' + k + '"><i></i>' + L(t[0], t[1]) + '</span>';
    }).join('') + '</div>' +
      '<p class="note en">L12 = 12th day of the lunar month · LM10 = first day of lunar month 10</p>' +
      (c ? '' : '<p class="note">' + L('● 黄道日 ○ 黑道日。设定命盘后显示个人分数。', '● Yellow Path day ○ Black Path day. Set up your chart to see personal scores.') + '</p>') +
      '</div>';
    return h;
  }

  function viewChart() {
    var c = S.chart, p = S.profile;
    if (!c) return setupPrompt();
    var labels = [['年柱', 'Year'], ['月柱', 'Month'], ['日柱', 'Day'], ['时柱', 'Hour']];
    var h = '<div class="card"><div class="card-h">' + L('四柱八字', 'Four Pillars') + (p.name ? ' · ' + esc(p.name) : '') + '</div><div class="pillars">';
    c.pillars.forEach(function (pl, i) {
      h += '<div class="pillar' + (i === 2 ? ' dm' : '') + '"><div class="small muted">' + L(labels[i][0], labels[i][1]) + '</div>';
      if (!pl) { h += '<div class="unknown">?</div><div class="tiny muted">' + L('时辰不详', 'Hour unknown') + '</div></div>'; return; }
      h += '<div class="tiny god">' + termCn(pl.ganGod, 'shiShen') + '</div>' +
        '<div class="char el-' + T.element[pl.ganEl] + '">' + pl.gan + '</div><div class="en pen">' + T.stem[pl.gan] + '</div>' +
        '<div class="char el-' + T.element[pl.zhiEl] + '">' + pl.zhi + '</div><div class="en pen">' + T.branch[pl.zhi] + '</div>' +
        '<div class="hide">' + pl.hide.map(function (x) { return '<span class="el-' + T.element[x.el] + '">' + x.gan + '</span>'; }).join('') + '</div>' +
        '<div class="en pen muted">Hidden: ' + pl.hide.map(function (x) { return T.stem[x.gan]; }).join(', ') + '</div>' +
        '<div class="tiny muted cn">' + pl.nayin + '</div><div class="en pen muted">' + T.nayin[pl.nayin] + '</div></div>';
    });
    h += '</div><p class="small">' + L('日主', 'Day Master') + ': <b>' + c.dayGan + '</b> ' + el(c.dmEl) +
      ' · ' + L('生肖', 'Zodiac') + ': ' + term(c.animal, 'animal') + ' · ' + L('农历生日', 'Lunar birthday') + ': ' + L(c.lunarBirth, lunarBirthEn(c.lunarBirthParts)) + '</p></div>';

    // elements
    h += '<div class="card"><div class="card-h">' + L('五行力量', 'Five Elements balance') + '</div>';
    E.ELEMENTS.forEach(function (e) {
      var pct = Math.round(c.weights[e] / c.total * 100);
      h += '<div class="elrow">' + el(e) + '<div class="bar el-bg-' + T.element[e] + '"><i style="width:' + pct + '%"></i></div><span class="small">' + pct + '%</span></div>';
    });
    h += '<p>' + L('日主' + (c.strong ? '偏强' : '偏弱') + '（同类与生扶占 ' + Math.round(c.ratio * 100) + '%）。',
      'Your Day Master is ' + (c.strong ? 'strong' : 'weak') + ' (self + support = ' + Math.round(c.ratio * 100) + '%).') + '</p>' +
      '<p>' + L('喜用', 'Helpful elements') + ': ' + c.fav.map(el).join(' ') + '<br>' + L('忌', 'Less helpful') + ': ' + c.unfav.map(el).join(' ') + '</p>' +
      '<p class="note">' + L('采用简化的旺衰法（月令加倍）。专业命理师可能有不同判断。', 'Uses a simplified strength method (month branch counted double). A professional reader may judge differently.') + '</p></div>';

    // luck pillars
    h += '<div class="card"><div class="card-h">' + L('大运', '10-year luck pillars') + '</div><p class="small muted">' +
      L('出生后 ' + c.yunStart.y + ' 年 ' + c.yunStart.m + ' 个月 ' + c.yunStart.d + ' 天起运', 'Starts ' + c.yunStart.y + 'y ' + c.yunStart.m + 'm ' + c.yunStart.d + 'd after birth') +
      '</p><div class="luck">';
    var yr = new Date().getFullYear();
    c.luck.forEach(function (d, i) {
      var nxt = c.luck[i + 1], cur = yr >= d.year && (!nxt || yr < nxt.year);
      h += '<div class="lp' + (cur ? ' cur' : '') + '"><div class="tiny muted">' + d.age + L('岁', ' yrs') + '</div>' +
        '<div class="cn el-' + T.element[d.ganEl] + '">' + d.gz[0] + '</div><div class="cn el-' + T.element[d.zhiEl] + '">' + d.gz[1] + '</div>' +
        '<div class="en tiny">' + gzEn(d.gz) + '</div>' +
        '<div class="tiny">' + d.year + '</div></div>';
    });
    h += '</div></div>';

    // birthplace trace
    var tr = c.trace, off = tr.offset, offS = (off >= 0 ? '+' : '−') + Math.floor(Math.abs(off) / 60) + ':' + z(Math.abs(off) % 60);
    h += '<div class="card"><div class="card-h">' + L('出生地校正', 'Birthplace correction') + '</div><dl class="facts">' +
      '<dt>' + L('出生地', 'Birthplace') + '</dt><dd>' + esc(placeName(p.place)) + '<br><span class="muted small">' + p.place.lat.toFixed(2) + '°, ' + p.place.lon.toFixed(2) + '° · ' + esc(p.place.tz) + '</span></dd>' +
      '<dt>' + L('当地钟表时间', 'Local clock time') + '</dt><dd>' + tr.clock + (tr.unknownTime ? ' <span class="muted">' + L('(时辰不详，以正午计)', '(hour unknown, noon used)') + '</span>' : '') + '</dd>' +
      '<dt>' + L('当时时区', 'Time zone then') + '</dt><dd>UTC' + offS + '</dd>' +
      '<dt>' + L('经度校正', 'Longitude adj.') + '</dt><dd>' + fmtMin(tr.lonCorr - off) + '</dd>' +
      '<dt>' + L('均时差', 'Equation of time') + '</dt><dd>' + fmtMin(tr.eot) + '</dd>' +
      '<dt>' + L('真太阳时', 'True solar time') + '</dt><dd><b>' + tr.tst + '</b></dd>' +
      '</dl><p class="note">' + L('日柱与时柱按真太阳时排定；年柱与月柱按节气交接的实际时刻（北京时间）排定。时区与夏令时依据历史时区资料自动处理。',
        'Day and hour pillars use true solar time at your birthplace. Year and month pillars use the exact solar-term moment. Historical time zones and daylight saving are applied automatically.') + '</p></div>';

    // free calculator links
    h += '<div class="card"><div class="card-h">' + L('免费八字排盘对照', 'Check with a free BaZi calculator') + '</div>' +
      '<p class="small">' + L('本应用使用开源免费的 lunar-javascript 排盘引擎，完全在手机上运算。你也可以把出生资料复制到其他免费排盘网站对照。',
        'This app runs the free, open-source lunar-javascript engine right on your phone. You can also copy your details into another free calculator to compare.') + '</p>' +
      '<div class="btns"><button class="btn" data-act="copy">' + L('复制命盘', 'Copy my chart') + '</button>' +
      '<a class="btn" href="https://www.masterseanchan.com/bazi-calculator/" target="_blank" rel="noopener">' + L('免费八字计算器 ↗', 'Free BaZi calculator ↗') + '</a>' +
      '<a class="btn" href="https://www.google.com/search?q=free+bazi+calculator+four+pillars" target="_blank" rel="noopener">' + L('更多免费排盘 ↗', 'Find more calculators ↗') + '</a>' +
      '<a class="btn" href="https://github.com/6tail/lunar-javascript" target="_blank" rel="noopener">' + L('排盘引擎 ↗', 'Engine source ↗') + '</a></div></div>';
    return h;
  }

  function lunarBirthEn(b) {
    if (!b) return '';
    return 'year ' + b.gz + ' (' + gzEn(b.gz) + '), ' + (b.month < 0 ? 'leap ' : '') + 'month ' + Math.abs(b.month) + ', day ' + b.day;
  }
  function fmtMin(m) { var s = m < 0 ? '−' : '+'; m = Math.abs(m); return s + Math.floor(m / 60) + 'h ' + z(Math.round(m % 60)) + 'm'; }
  function placeName(pl) { return pl ? [pl.zh, pl.en, pl.country].filter(Boolean).join(' · ') : ''; }

  function viewMe() {
    var p = S.draft || (S.draft = JSON.parse(JSON.stringify(S.profile || { name: '', gender: 1, date: '1990-01-01', time: '12:00', unknownTime: false, place: null, sect: 1 })));
    var tzs = [];
    try { tzs = Intl.supportedValuesOf('timeZone'); } catch (e) {}
    var h = '<form class="card form" id="pform" autocomplete="off"><div class="card-h">' + L('出生资料', 'Birth details') + '</div>' +
      '<label>' + L('称呼（可选）', 'Name (optional)') + '<input name="name" value="' + esc(p.name) + '" maxlength="30"></label>' +
      '<div class="seg"><span>' + L('性别（用于大运）', 'Sex (for luck pillars)') + '</span>' +
      '<label><input type="radio" name="gender" value="1"' + (p.gender !== 0 ? ' checked' : '') + '>' + L('男', 'Male') + '</label>' +
      '<label><input type="radio" name="gender" value="0"' + (p.gender === 0 ? ' checked' : '') + '>' + L('女', 'Female') + '</label></div>' +
      '<div class="two"><label>' + L('出生日期（公历）', 'Date of birth') + '<input type="date" name="date" min="1900-01-01" max="2099-12-31" value="' + esc(p.date) + '" required></label>' +
      '<label>' + L('出生时间', 'Time of birth') + '<input type="time" name="time" value="' + esc(p.time) + '"' + (p.unknownTime ? ' disabled' : '') + '></label></div>' +
      '<label class="check"><input type="checkbox" name="unknownTime"' + (p.unknownTime ? ' checked' : '') + '>' + L('不知道出生时辰（只排三柱）', 'I don’t know my birth time (3 pillars only)') + '</label>' +
      '<div class="card-h">' + L('出生地', 'Birthplace') + '</div>' +
      '<div class="place-sel">' + (p.place ? '<b>' + esc(placeName(p.place)) + '</b><br><span class="small muted">' + p.place.lat.toFixed(2) + '°, ' + p.place.lon.toFixed(2) + '° · ' + esc(p.place.tz) + '</span>'
        : '<span class="muted">' + L('尚未选择', 'Not chosen yet') + '</span>') + '</div>' +
      '<label>' + L('搜索城市', 'Search a city') + '<input id="placeQ" placeholder="海口 / Singapore / Ipoh…" enterkeyhint="search"></label>' +
      '<div id="placeList" class="plist"></div>' +
      '<button type="button" class="btn small" data-act="geo">' + L('🌐 全球搜索（需联网）', '🌐 Search worldwide (online)') + '</button>' +
      '<details class="manual"><summary>' + L('手动输入经纬度', 'Enter coordinates by hand') + '</summary>' +
      '<div class="two"><label>' + L('纬度', 'Latitude') + '<input name="lat" inputmode="decimal" value="' + (p.place ? p.place.lat : '') + '"></label>' +
      '<label>' + L('经度（东为正）', 'Longitude (east +)') + '<input name="lon" inputmode="decimal" value="' + (p.place ? p.place.lon : '') + '"></label></div>' +
      '<label>' + L('时区', 'Time zone') + '<input name="tz" list="tzlist" value="' + esc(p.place ? p.place.tz : Intl.DateTimeFormat().resolvedOptions().timeZone) + '"></label>' +
      '<datalist id="tzlist">' + tzs.map(function (t) { return '<option value="' + t + '">'; }).join('') + '</datalist>' +
      '<button type="button" class="btn small" data-act="manual">' + L('使用这些数值', 'Use these values') + '</button></details>' +
      '<div class="card-h">' + L('子时换日', 'Day change at Zi hour') + '</div>' +
      '<label class="check"><input type="radio" name="sect" value="1"' + (p.sect !== 2 ? ' checked' : '') + '>' + L('23:00 换日（传统，常用）', 'New day at 23:00 (traditional)') + '</label>' +
      '<label class="check"><input type="radio" name="sect" value="2"' + (p.sect === 2 ? ' checked' : '') + '>' + L('00:00 换日', 'New day at midnight') + '</label>' +
      '<div id="formMsg" class="msg"></div>' +
      '<button type="submit" class="btn primary wide">' + L('保存并排盘', 'Save & calculate') + '</button></form>';

    h += '<div class="card"><div class="card-h">' + L('设置', 'Settings') + '</div>' +
      '<div class="seg"><span>' + L('语言', 'Language') + '</span>' +
      [['both', '双语 Both'], ['zh', '中文'], ['en', 'English']].map(function (o) {
        return '<label><input type="radio" name="lang" value="' + o[0] + '"' + (S.lang === o[0] ? ' checked' : '') + '>' + o[1] + '</label>';
      }).join('') + '</div>' +
      '<p class="small">' + L('所有资料只保存在本机，不会上传。', 'All data stays on this device. Nothing is uploaded.') + '</p>' +
      (S.profile ? '<button class="btn danger small" data-act="wipe">' + L('删除我的资料', 'Delete my data') + '</button>' : '') + '</div>';

    h += '<div class="card"><div class="card-h">' + L('安装到手机', 'Install on your phone') + '</div><ol class="small steps">' +
      '<li>' + L('用 Safari（iPhone）或 Chrome（Android）打开本页。', 'Open this page in Safari (iPhone) or Chrome (Android).') + '</li>' +
      '<li>' + L('点「分享」或「⋮」菜单。', 'Tap the Share button or the ⋮ menu.') + '</li>' +
      '<li>' + L('选择「添加到主屏幕」。', 'Choose “Add to Home Screen”.') + '</li>' +
      '<li>' + L('之后可像普通应用一样离线使用。', 'It now opens like an app, even offline.') + '</li></ol></div>';
    return h;
  }

  /* ---------- birthplace search ---------- */
  function renderPlaces(list, online) {
    var box = document.getElementById('placeList');
    if (!box) return;
    if (!list.length) { box.innerHTML = '<div class="small muted">' + L('没有结果', 'No matches') + '</div>'; return; }
    box.innerHTML = list.slice(0, 8).map(function (c, i) {
      return '<button type="button" class="pitem" data-pi="' + i + '"><b>' + esc(c.zh ? c.zh + ' ' : '') + esc(c.en) + '</b> <span class="muted small">' +
        esc([c.admin, c.country].filter(Boolean).join(', ')) + ' · ' + esc(c.tz) + '</span></button>';
    }).join('');
    box._list = list;
  }
  function localSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) { renderPlaces([], false); document.getElementById('placeList').innerHTML = ''; return; }
    renderPlaces(CITIES.filter(function (c) { return c[0].indexOf(q) >= 0 || c[1].toLowerCase().indexOf(q) >= 0 || c[2].toLowerCase().indexOf(q) >= 0; })
      .map(function (c) { return { zh: c[0], en: c[1], country: c[2], lat: c[3], lon: c[4], tz: c[5] }; }), false);
  }
  function geoSearch() {
    var q = (document.getElementById('placeQ').value || '').trim();
    var box = document.getElementById('placeList');
    if (!q) return;
    box.innerHTML = '<div class="small muted">' + L('搜索中…', 'Searching…') + '</div>';
    fetch('https://geocoding-api.open-meteo.com/v1/search?count=8&format=json&language=en&name=' + encodeURIComponent(q))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        renderPlaces((j.results || []).map(function (x) {
          return { zh: '', en: x.name, admin: x.admin1, country: x.country, lat: x.latitude, lon: x.longitude, tz: x.timezone };
        }), true);
      })
      .catch(function () { box.innerHTML = '<div class="small bad">' + L('无法联网搜索，请用内置城市或手动输入。', 'Online search failed. Use a built-in city or enter coordinates by hand.') + '</div>'; });
  }
  function readForm() {
    var f = document.getElementById('pform');
    if (!f) return;
    var d = S.draft;
    d.name = f.name.value.trim();
    d.gender = +f.querySelector('[name=gender]:checked').value;
    d.date = f.date.value;
    d.time = f.time.value || '12:00';
    d.unknownTime = f.unknownTime.checked;
    d.sect = +f.querySelector('[name=sect]:checked').value;
  }
  function validTz(tz) { try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return true; } catch (e) { return false; } }

  /* ---------- render & events ---------- */
  var VIEWS = { today: viewToday, hours: viewHours, month: viewMonth, chart: viewChart, me: viewMe };
  function render() {
    document.body.className = 'lang-' + S.lang;
    document.getElementById('langBtn').textContent = { both: '双语', zh: '中文', en: 'EN' }[S.lang];
    if (S.tab !== 'me') S.draft = null;
    document.getElementById('view').innerHTML = VIEWS[S.tab]() + disclaimer();
    Array.prototype.forEach.call(document.querySelectorAll('.tabs button'), function (b) { b.classList.toggle('on', b.dataset.tab === S.tab); });
    var cur = document.getElementById('curHour');
    if (cur) cur.scrollIntoView({ block: 'center' });
  }
  function disclaimer() {
    return '<p class="disclaimer">' + L('仅供娱乐及文化参考，不构成医疗、法律或财务建议。', 'For entertainment and cultural reference only. Not medical, legal or financial advice.') + '</p>';
  }
  function go(tab) { S.tab = tab; render(); window.scrollTo(0, 0); }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tab],[data-act],[data-go],[data-pi]');
    if (!t) return;
    if (t.dataset.tab) { if (S.tab === 'me') readForm(); go(t.dataset.tab); return; }
    if (t.dataset.go) { var p = t.dataset.go.split('-').map(Number); S.date = { y: p[0], m: p[1], d: p[2] }; if (S.tab === 'month') S.tab = 'today'; render(); window.scrollTo(0, 0); return; }
    if (t.dataset.pi != null) {
      readForm();
      var c = document.getElementById('placeList')._list[+t.dataset.pi];
      S.draft.place = { zh: c.zh, en: c.en, country: c.country, lat: +c.lat, lon: +c.lon, tz: c.tz };
      render(); return;
    }
    var a = t.dataset.act;
    if (a === 'prev') S.date = shift(S.date, -1);
    else if (a === 'next') S.date = shift(S.date, 1);
    else if (a === 'today') S.date = todayYmd();
    else if (a === 'pm') S.date = ymd(new Date(S.date.y, S.date.m - 2, 1));
    else if (a === 'nm') S.date = ymd(new Date(S.date.y, S.date.m, 1));
    else if (a === 'geo') { geoSearch(); return; }
    else if (a === 'manual') {
      readForm();
      var f = document.getElementById('pform'), lat = parseFloat(f.lat.value), lon = parseFloat(f.lon.value), tz = f.tz.value.trim();
      if (isNaN(lat) || isNaN(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180 || !validTz(tz)) {
        document.getElementById('formMsg').innerHTML = L('请输入有效的纬度、经度和时区（如 Asia/Kuala_Lumpur）。', 'Please enter a valid latitude, longitude and time zone (e.g. Asia/Kuala_Lumpur).');
        return;
      }
      S.draft.place = { zh: '', en: lat.toFixed(2) + ', ' + lon.toFixed(2), country: '', lat: lat, lon: lon, tz: tz };
    }
    else if (a === 'copy') { copyChart(); return; }
    else if (a === 'wipe') {
      if (!confirm('删除所有资料？ Delete all data?')) return;
      S.profile = null; S.chart = null; S.draft = null; save();
    }
    else if (a === 'lang') { S.lang = { both: 'zh', zh: 'en', en: 'both' }[S.lang]; save(); }
    else return;
    render();
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'pickDate' && t.value) { var p = t.value.split('-').map(Number); S.date = { y: p[0], m: p[1], d: p[2] }; render(); }
    else if (t.name === 'lang') { S.lang = t.value; save(); render(); }
    else if (t.name === 'unknownTime') { document.querySelector('#pform [name=time]').disabled = t.checked; }
  });
  document.addEventListener('input', function (e) { if (e.target.id === 'placeQ') localSearch(e.target.value); });
  document.addEventListener('keydown', function (e) { if (e.target.id === 'placeQ' && e.key === 'Enter') { e.preventDefault(); geoSearch(); } });
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'pform') return;
    e.preventDefault();
    readForm();
    var msg = document.getElementById('formMsg');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(S.draft.date)) { msg.innerHTML = L('请填写出生日期。', 'Please enter your date of birth.'); return; }
    if (!S.draft.place) { msg.innerHTML = L('请选择出生地。', 'Please choose your birthplace.'); return; }
    S.profile = S.draft; S.draft = null;
    refreshChart();
    if (!S.chart) { msg.innerHTML = L('无法排盘，请检查资料。', 'Could not calculate the chart. Please check your details.'); S.draft = S.profile; return; }
    save(); go('chart');
  });

  function copyChart() {
    var c = S.chart, p = S.profile;
    var txt = '八字 BaZi: ' + c.pillars.map(function (x) { return x ? x.gz : '??'; }).join(' ') +
      '\n(' + c.pillars.map(function (x) { return x ? gzEn(x.gz) : '?'; }).join(' · ') + ')' +
      '\n出生 Born: ' + c.trace.clock + ' @ ' + placeName(p.place) + ' (' + p.place.lat + ', ' + p.place.lon + ', ' + p.place.tz + ')' +
      '\n真太阳时 True solar time: ' + c.trace.tst +
      '\n日主 Day Master: ' + c.dayGan + ' ' + c.dmEl + ' · 喜用 Helpful: ' + c.fav.join('') +
      '\n大运 Luck: ' + c.luck.map(function (d) { return d.age + ' ' + d.gz; }).join(', ');
    var done = function () { alert('已复制 Copied'); };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () { prompt('', txt); });
    else prompt('', txt);
  }

  // Refresh "right now" when the shichen changes or the app comes back to the front.
  var lastKey = '';
  function tick() {
    var n = new Date(), k = n.toDateString() + Math.floor((n.getHours() + 1) / 2);
    if (lastKey && k !== lastKey && (S.tab === 'today' || S.tab === 'hours')) render();
    lastKey = k;
  }
  setInterval(tick, 60000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });

  load();
  S.date = todayYmd();
  refreshChart();
  if (!S.profile) S.tab = 'me';
  render();
  tick();

  if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
})();
