/* Bilingual glossary for the almanac. Chinese terms come from lunar-javascript;
   English renderings are plain-language glosses written for this app. */
var TERMS = {
  yiji: {
    '祭祀':'Ancestor offerings','祈福':'Pray for blessings','求嗣':'Pray for children','开光':'Consecrate a statue',
    '塑绘':'Sculpt or paint deities','齐醮':'Taoist rites','斋醮':'Taoist rites','沐浴':'Bathe & cleanse',
    '酬神':'Thank the deities','造庙':'Build a temple','祀灶':'Kitchen-god offering','焚香':'Burn incense',
    '谢土':'Thank the earth god','出火':'Move the altar','雕刻':'Carving','嫁娶':'Wedding','订婚':'Engagement',
    '纳采':'Betrothal gifts','问名':'Exchange birth details','纳婿':'Welcome a son-in-law','归宁':'Visit parents (newlywed)',
    '安床':'Set up a bed','合帐':'Hang bed curtains','冠笄':'Coming-of-age rite','订盟':'Make an agreement',
    '进人口':'Welcome new household members','裁衣':'Cut cloth / tailoring','挽面':'Facial threading','开容':'Grooming & beauty',
    '修坟':'Repair a tomb','启钻':'Exhumation','破土':'Break ground (grave)','安葬':'Burial','立碑':'Erect a tombstone',
    '成服':'Put on mourning','除服':'End mourning','开生坟':'Prepare a grave','合寿木':'Make a coffin','入殓':'Encoffining',
    '移柩':'Move a coffin','普渡':'Offerings to wandering spirits','入宅':'Move into a new home','安香':'Install a home altar',
    '安门':'Install a door','修造':'Build or renovate','起基':'Lay a foundation','动土':'Break ground','上梁':'Raise the roof beam',
    '竖柱':'Erect pillars','开井开池':'Dig a well or pond','作陂放水':'Build a dam / release water','拆卸':'Dismantle',
    '破屋':'Demolish a house','坏垣':'Pull down walls','补垣':'Repair walls','伐木做梁':'Fell timber for beams',
    '作灶':'Build a stove','解除':'Cleansing rite','开柱眼':'Drill pillar holes','穿屏扇架':'Install screens & frames',
    '盖屋合脊':'Roof a house','开厕':'Build a toilet','造仓':'Build a storehouse','塞穴':'Seal up holes',
    '平治道涂':'Repair roads','造桥':'Build a bridge','作厕':'Build a toilet','筑堤':'Build an embankment','开池':'Dig a pond',
    '伐木':'Fell trees','开渠':'Dig a channel','掘井':'Dig a well','扫舍':'Clean the house','放水':'Release water',
    '造屋':'Build a house','合脊':'Close the roof ridge','造畜稠':'Build an animal pen','修门':'Repair a door',
    '定磉':'Set pillar bases','作梁':'Make beams','修饰垣墙':'Decorate walls','架马':'Put up scaffolding',
    '开市':'Open a business','挂匾':'Hang a signboard','纳财':'Receive money','求财':'Seek income','开仓':'Open a storehouse',
    '买车':'Buy a vehicle','置产':'Buy property','雇佣':'Hire staff','出货财':'Ship goods','安机械':'Install machinery',
    '造车器':'Make vehicles or tools','经络':'Spinning & weaving','酝酿':'Brewing','作染':'Dyeing','鼓铸':'Metal casting',
    '造船':'Build a boat','割蜜':'Harvest honey','栽种':'Planting','取渔':'Fishing','结网':'Make nets','牧养':'Raise livestock',
    '安碓磑':'Install a mill','习艺':'Learn a skill','入学':'Start school','理发':'Haircut','探病':'Visit the sick',
    '见贵':'Meet important people','乘船':'Travel by boat','渡水':'Cross water','针灸':'Acupuncture','出行':'Travel',
    '移徙':'Relocate','分居':'Split a household','剃头':'Shave the head','整手足甲':'Trim nails','纳畜':'Acquire livestock',
    '捕捉':'Pest control','畋猎':'Hunting','教牛马':'Train animals','会亲友':'Meet family & friends','赴任':'Start a new post',
    '求医':'See a doctor','治病':'Medical treatment','词讼':'Lawsuits','起基动土':'Lay foundation & break ground',
    '破屋坏垣':'Demolition','盖屋':'Roofing','造仓库':'Build a warehouse','立券交易':'Sign contracts & trade',
    '交易':'Trade & deals','立券':'Sign contracts','安机':'Install machinery','会友':'Meet friends',
    '求医疗病':'Seek medical treatment','诸事不宜':'Nothing advisable','馀事勿取':'Nothing else advisable','行丧':'Funeral',
    '断蚁':'Get rid of ants','归岫':'Return home','无':'None'
  },
  tianShen: {
    '青龙':'Azure Dragon','明堂':'Bright Hall','天刑':'Heavenly Punishment','朱雀':'Vermilion Bird','金匮':'Golden Chest',
    '天德':'Heavenly Virtue','白虎':'White Tiger','玉堂':'Jade Hall','天牢':'Heavenly Prison','玄武':'Black Tortoise',
    '司命':'Life Keeper','勾陈':'Hook Array'
  },
  zhiXing: {
    '建':'Establish','除':'Remove','满':'Full','平':'Balance','定':'Settle','执':'Hold','破':'Break','危':'Danger',
    '成':'Success','收':'Harvest','开':'Open','闭':'Close'
  },
  shenSha: {
    '天恩':'Heavenly Grace','母仓':'Mother Granary','不将':'Bu Jiang (weddings)','四相':'Four Ministers','五合':'Five Harmonies',
    '三合':'Three Harmony','月德':'Monthly Virtue','月空':'Monthly Void','月德合':'Monthly Virtue Union','月恩':'Monthly Grace',
    '时阴':'Seasonal Yin','五富':'Five Riches','生气':'Vital Qi','金匮':'Golden Chest','相日':'Minister Day','阴德':'Hidden Virtue',
    '六合':'Six Harmony','益后':'Benefit Heirs','青龙':'Azure Dragon','续世':'Continue Lineage','明堂':'Bright Hall',
    '王日':'King Day','要安':'Peace','官日':'Official Day','吉期':'Lucky Period','福德':'Blessing Virtue','六仪':'Six Rites',
    '金堂':'Golden Hall','宝光':'Precious Light','民日':'People Day','临日':'Approach Day','天马':'Heavenly Horse',
    '敬安':'Respect & Peace','普护':'Universal Protection','驿马':'Travelling Horse','天后':'Heavenly Empress',
    '阳德':'Yang Virtue','天喜':'Heavenly Joy','天医':'Heavenly Doctor','司命':'Life Keeper','圣心':'Sage Heart',
    '玉宇':'Jade Palace','守日':'Guard Day','时德':'Seasonal Virtue','解神':'Release Spirit','时阳':'Seasonal Yang',
    '天仓':'Heavenly Granary','天巫':'Heavenly Healer','玉堂':'Jade Hall','福生':'Blessings Arise','天德':'Heavenly Virtue',
    '天德合':'Heavenly Virtue Union','天愿':'Heavenly Wish','天赦':'Heavenly Pardon','天符':'Heavenly Talisman',
    '阴神':'Yin Spirit','解除':'Cleansing',
    '五虚':'Five Voids','五离':'Five Partings','重日':'Double Day','复日':'Repeat Day','血支':'Blood Branch',
    '天贼':'Heavenly Thief','土符':'Earth Talisman','游祸':'Roaming Calamity','白虎':'White Tiger','小耗':'Minor Loss',
    '致死':'Fatal','河魁':'River Chief','劫煞':'Robbery Sha','月煞':'Monthly Sha','月建':'Month Establish','往亡':'Going & Lost',
    '大时':'Great Time','大败':'Great Defeat','咸池':'Salty Pool','厌对':'Opposed Loathing','招摇':'Ostentation',
    '九坎':'Nine Pits','九焦':'Nine Scorches','天罡':'Heavenly Dipper','死神':'Death Spirit','月害':'Monthly Harm',
    '死气':'Dead Qi','月破':'Month Break','大耗':'Great Loss','天牢':'Heavenly Prison','元武':'Black Tortoise',
    '月厌':'Monthly Loathing','月虚':'Monthly Emptiness','归忌':'Return Taboo','小时':'Minor Time','天刑':'Heavenly Punishment',
    '朱雀':'Vermilion Bird','九空':'Nine Voids','天吏':'Heavenly Clerk','地火':'Earth Fire','四击':'Four Strikes',
    '大煞':'Great Sha','勾陈':'Hook Array','八专':'Eight Focus','灾煞':'Disaster Sha','天火':'Heavenly Fire',
    '血忌':'Blood Taboo','土府':'Earth Mansion','月刑':'Monthly Punishment','触水龙':'Water Dragon','地囊':'Earth Sack',
    '八风':'Eight Winds','四废':'Four Wastes','四忌':'Four Taboos','四穷':'Four Hardships','五墓':'Five Tombs',
    '阴错':'Yin Error','四耗':'Four Losses','阳错':'Yang Error','孤辰':'Lonely Star','四离':'Four Partings',
    '天狗':'Heavenly Dog','三丧':'Three Mournings','大退':'Great Retreat',
    '鸣吠':'Cock-crow & Dog-bark','鸣吠对':'Opposite Cock-crow','除神':'Removing Spirit','鬼哭':'Ghost Cry','逐阵':'Chasing Array',
    '阳破阴冲':'Yang Break, Yin Clash','三阴':'Three Yin','八龙':'Eight Dragons','大会':'Grand Meeting','小会':'Minor Meeting',
    '单阴':'Single Yin','七鸟':'Seven Birds','行狠':'Ruthless','岁薄':'Thin Year','了戾':'Perverse','阴阳击冲':'Yin-Yang Strike',
    '七符':'Seven Talismans','九虎':'Nine Tigers','阴位':'Yin Position','绝阳':'Exhausted Yang','纯阴':'Pure Yin','六蛇':'Six Snakes',
    '纯阳':'Pure Yang','孤阳':'Lonely Yang','绝阴':'Exhausted Yin','成日':'Completion Day','阴道冲阳':'Yin Way Clashes Yang',
    '阴阳交破':'Yin-Yang Cross Break','阴阳俱错':'Yin-Yang Both Err','阳错阴冲':'Yang Error, Yin Clash','无':'None'
  },
  dir: {
    '正北':'North','东北':'Northeast','正东':'East','东南':'Southeast','正南':'South','西南':'Southwest','正西':'West','西北':'Northwest',
    '北':'North','东':'East','南':'South','西':'West','中':'Centre'
  },
  dirAngle: { '正北':0,'北':0,'东北':45,'正东':90,'东':90,'东南':135,'正南':180,'南':180,'西南':225,'正西':270,'西':270,'西北':315 },
  animal: {
    '鼠':'Rat','牛':'Ox','虎':'Tiger','兔':'Rabbit','龙':'Dragon','蛇':'Snake','马':'Horse','羊':'Goat','猴':'Monkey',
    '鸡':'Rooster','狗':'Dog','猪':'Pig'
  },
  element: { '木':'Wood','火':'Fire','土':'Earth','金':'Metal','水':'Water' },
  shiShen: {
    '比肩':'Friend','劫财':'Rob Wealth','食神':'Eating God','伤官':'Hurting Officer','偏财':'Indirect Wealth',
    '正财':'Direct Wealth','七杀':'Seven Killings','正官':'Direct Officer','偏印':'Indirect Resource','正印':'Direct Resource',
    '日主':'Day Master'
  },
  theme: {
    '比肩':['同辈助力，适合合作、运动与坚持自我；留意固执。','Peer energy: good for teamwork, exercise and standing firm. Watch out for stubbornness.'],
    '劫财':['竞争心强，宜团队协作；慎借贷与冲动消费。','Competitive energy: team up with others, and be careful with lending and impulse spending.'],
    '食神':['心情舒畅，宜创作、美食、休闲与表达。','Relaxed, creative energy: good for food, hobbies, rest and self-expression.'],
    '伤官':['灵感多、口才佳，宜创新；言语易冲，避免争执。','Sharp, inventive energy: great for new ideas. Mind your words to avoid arguments.'],
    '偏财':['机会与人缘活跃，宜社交、洽谈；理财宜稳。','Opportunity and social energy: good for networking and talks. Keep money decisions measured.'],
    '正财':['务实稳健，宜处理账务、日常工作与家务。','Steady, practical energy: good for accounts, routine work and family matters.'],
    '七杀':['压力与挑战并存，宜果断行事、锻炼身体；忌冒险。','Pressure and challenge: act decisively and stay active. Avoid risky moves.'],
    '正官':['秩序与责任，宜办公事、守规矩、见上司。','Order and responsibility: good for official matters, following rules and meeting superiors.'],
    '偏印':['思考深入，宜学习、研究、独处；防多疑。','Reflective energy: good for study, research and quiet time. Avoid overthinking.'],
    '正印':['贵人与支持，宜学习、求助、照顾自己。','Support and nurturing: good for learning, asking for help and self-care.']
  },
  shichen: {
    '子':['夜半','Midnight'],'丑':['鸡鸣','Cockcrow'],'寅':['平旦','Dawn'],'卯':['日出','Sunrise'],'辰':['食时','Breakfast'],
    '巳':['隅中','Late morning'],'午':['日中','Noon'],'未':['日昳','Early afternoon'],'申':['晡时','Late afternoon'],
    '酉':['日入','Sunset'],'戌':['黄昏','Dusk'],'亥':['人定','Night']
  },
  jieQi: {
    '冬至':'Winter Solstice','小寒':'Minor Cold','大寒':'Major Cold','立春':'Start of Spring','雨水':'Rain Water',
    '惊蛰':'Awakening of Insects','春分':'Spring Equinox','清明':'Clear & Bright','谷雨':'Grain Rain','立夏':'Start of Summer',
    '小满':'Grain Buds','芒种':'Grain in Ear','夏至':'Summer Solstice','小暑':'Minor Heat','大暑':'Major Heat',
    '立秋':'Start of Autumn','处暑':'End of Heat','白露':'White Dew','秋分':'Autumn Equinox','寒露':'Cold Dew',
    '霜降':'Frost Descent','立冬':'Start of Winter','小雪':'Minor Snow','大雪':'Major Snow',
    'DONG_ZHI':'Winter Solstice','XIAO_HAN':'Minor Cold','DA_HAN':'Major Cold','LI_CHUN':'Start of Spring',
    'YU_SHUI':'Rain Water','JING_ZHE':'Awakening of Insects'
  },

  stem: { '甲':'Yang Wood','乙':'Yin Wood','丙':'Yang Fire','丁':'Yin Fire','戊':'Yang Earth','己':'Yin Earth',
    '庚':'Yang Metal','辛':'Yin Metal','壬':'Yang Water','癸':'Yin Water' },
  branch: { '子':'Rat','丑':'Ox','寅':'Tiger','卯':'Rabbit','辰':'Dragon','巳':'Snake','午':'Horse','未':'Goat',
    '申':'Monkey','酉':'Rooster','戌':'Dog','亥':'Pig' },
  nayin: {
    '海中金':'Sea Metal','沙中金':'Sand Metal','炉中火':'Furnace Fire','山下火':'Fire below the Mountain','大林木':'Forest Wood',
    '平地木':'Flatland Wood','路旁土':'Roadside Earth','壁上土':'Wall Earth','剑锋金':'Sword Metal','金箔金':'Gold Leaf Metal',
    '山头火':'Mountain-top Fire','覆灯火':'Lamp Fire','涧下水':'Brook Water','天河水':'Heavenly River Water','城头土':'City-wall Earth',
    '大驿土':'Highway Earth','白蜡金':'White Wax Metal','钗钏金':'Jewellery Metal','杨柳木':'Willow Wood','桑柘木':'Mulberry Wood',
    '泉中水':'Spring Water','大溪水':'Great Stream Water','屋上土':'Rooftop Earth','沙中土':'Sand Earth','霹雳火':'Thunderbolt Fire',
    '天上火':'Sky Fire','松柏木':'Pine & Cypress Wood','石榴木':'Pomegranate Wood','长流水':'Long River Water','大海水':'Ocean Water'
  },
  xiu: {
    '角':'Horn','亢':'Neck','氐':'Root','房':'Room','心':'Heart','尾':'Tail','箕':'Winnowing Basket','斗':'Dipper','牛':'Ox',
    '女':'Girl','虚':'Emptiness','危':'Rooftop','室':'Encampment','壁':'Wall','奎':'Legs','娄':'Bond','胃':'Stomach',
    '昴':'Hairy Head','毕':'Net','觜':'Turtle Beak','参':'Three Stars','井':'Well','鬼':'Ghost','柳':'Willow','星':'Star',
    '张':'Extended Net','翼':'Wings','轸':'Chariot'
  },
  xiuZheng: { '木':'Wood','金':'Metal','土':'Earth','日':'Sun','月':'Moon','火':'Fire','水':'Water' },
  xiuAnimal: {
    '蛟':'Flood Dragon','龙':'Dragon','貉':'Badger','兔':'Rabbit','狐':'Fox','虎':'Tiger','豹':'Leopard','獬':'Unicorn','牛':'Ox',
    '蝠':'Bat','鼠':'Rat','燕':'Swallow','猪':'Pig','貐':'Porcupine','狼':'Wolf','狗':'Dog','雉':'Pheasant','鸡':'Rooster',
    '乌':'Crow','猴':'Monkey','猿':'Ape','犴':'Wild Dog','羊':'Goat','獐':'Muntjac','马':'Horse','鹿':'Deer','蛇':'Snake','蚓':'Earthworm'
  },
  pengzu: {
    '甲不开仓财物耗散':'Jia days: don’t open the storehouse, or wealth drains away',
    '乙不栽植千株不长':'Yi days: don’t plant, or nothing will grow',
    '丙不修灶必见灾殃':'Bing days: don’t repair the stove, or trouble follows',
    '丁不剃头头必生疮':'Ding days: don’t shave the head, or sores appear',
    '戊不受田田主不祥':'Wu days: don’t take on land, or the owner has bad luck',
    '己不破券二比并亡':'Ji days: don’t break contracts, or both sides lose',
    '庚不经络织机虚张':'Geng days: don’t weave, or the loom runs idle',
    '辛不合酱主人不尝':'Xin days: don’t make sauce, or the host won’t taste it',
    '壬不泱水更难提防':'Ren days: don’t release water, or floods are hard to stop',
    '癸不词讼理弱敌强':'Gui days: don’t sue, or the other side prevails',
    '子不问卜自惹祸殃':'Rat days: don’t consult fortune-tellers, or you invite trouble',
    '丑不冠带主不还乡':'Ox days: don’t hold coming-of-age rites, or the person won’t return home',
    '寅不祭祀神鬼不尝':'Tiger days: don’t make offerings, or the spirits won’t accept them',
    '卯不穿井水泉不香':'Rabbit days: don’t dig wells, or the water won’t be sweet',
    '辰不哭泣必主重丧':'Dragon days: don’t weep, or mourning repeats',
    '巳不远行财物伏藏':'Snake days: don’t travel far, or your wealth stays hidden',
    '午不苫盖屋主更张':'Horse days: don’t thatch the roof, or the household changes owner',
    '未不服药毒气入肠':'Goat days: traditionally no medicine (always follow your doctor)',
    '申不安床鬼祟入房':'Monkey days: don’t set up a bed, or spirits enter the room',
    '酉不会客醉坐颠狂':'Rooster days: don’t host guests, or drinking gets out of hand',
    '戌不吃犬作怪上床':'Dog days: don’t eat dog meat, or strange things happen',
    '亥不嫁娶不利新郎':'Pig days: don’t marry, or it is unlucky for the groom'
  },
  week: ['日','一','二','三','四','五','六'],
  weekEn: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
};
