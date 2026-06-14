const jobs = {
  doctor: {
    name: "의사",
    skill: "전문",
    tierOptions: ["진정", "강화제", "검진", "박애"],
    hp: 100,
    attack: 5,
    armor: 0,
    text: "상대방을 치료할 수 있고 치료량이 10 증가한다. 스스로도 치료 가능하다.",
  },
  hunter: {
    name: "사냥꾼",
    skill: "유능",
    tierOptions: ["은탄", "이타적 유전자", "항체 보유자", "추적"],
    hp: 250,
    attack: 20,
    armor: 3,
    text: "탐험 시 동물 자원 보상이 보장된다. 데드저스티스의 일원.",
  },
  soldier: {
    name: "군인",
    skill: "방탄",
    tierOptions: ["불침번", "불굴", "정신력", "사격술"],
    hp: 200,
    attack: 15,
    armor: 10,
    text: "보호력이 높고 기지 방어에 강하다. 데드저스티스 협력자.",
  },
  citizen: {
    name: "시민",
    skill: "없음",
    tierOptions: [],
    hp: 140,
    attack: 5,
    armor: 1,
    text: "갑자기 이 세계에 떨어진 이세계인.",
  },
  farmer: {
    name: "농부",
    skill: "농사",
    tierOptions: ["비료", "풍년", "퇴비통", "대혁명"],
    hp: 120,
    attack: 7,
    armor: 1,
    text: "심은 씨앗의 수확량이 최고치로 고정. 제작·연구 가능.",
  },
  merchant: {
    name: "상인",
    skill: "거래",
    tierOptions: ["돈은 곧 힘이다", "종묘상", "식료품 상인", "잡화 상인"],
    hp: 140,
    attack: 10,
    armor: 3,
    text: "물건을 팔아 상인 가방 코인을 모으고 코인으로 자원을 구매한다.",
  },
  beast: {
    name: "짐승인간",
    skill: "갈망",
    tierOptions: ["마지막 손톱", "긴 손톱", "포효", "찢기"],
    hp: 350,
    attack: 30,
    armor: 20,
    text: "2턴마다 좀비를 처치해 먹어야 한다. 탈수 없음. 제작·연구 불가.",
  },
};

const teamPreset = ["doctor", "hunter", "soldier", "citizen"];

const jobVisuals = {
  doctor: "assets/images/char-doctor.png",
  hunter: "assets/images/char-hunter.png",
  soldier: "assets/images/char-soldier.png",
  citizen: "assets/images/char-citizen.png",
  farmer: "assets/images/char-citizen.png",
  merchant: "assets/images/char-doctor.png",
  beast: "assets/images/char-soldier.png",
};

const places = [
  { id: "base", name: "기지", icon: "⌂", desc: "서바이벌스의 임시 거점. 모든 길의 중심이다.", threat: 1, x: 50, y: 48 },
  { id: "lab", name: "연구소", icon: "⚗", desc: "엔터톤사이언스 보고서와 백신 단서를 찾을 수 있다.", threat: 3, x: 23, y: 28 },
  { id: "hospital", name: "폐병원", icon: "✚", desc: "데드저스티스 창립자의 일기가 숨겨져 있다.", threat: 2, x: 75, y: 28 },
  { id: "construction", name: "공사장", icon: "⚒", desc: "고철과 방벽 재료를 얻기 좋은 위험 구역.", threat: 3, x: 21, y: 56 },
  { id: "shop", name: "은밀한 상점", icon: "▣", desc: "희귀 자원과 달 탈출 정보를 거래하는 비밀 거점.", threat: 3, x: 78, y: 56 },
  { id: "city", name: "폐도시", icon: "▦", desc: "고철과 장비를 얻는 대신 감염자가 많다.", threat: 4, x: 50, y: 74 },
  { id: "mart", name: "마트", icon: "▤", desc: "식량과 물을 안정적으로 확보할 수 있는 폐상점.", threat: 2, x: 50, y: 91 },
  { id: "forest", name: "숲", icon: "♣", desc: "탐험으로 길을 찾은 뒤에만 갈 수 있는 잠금 지역.", threat: 5, x: 82, y: 82, locked: true },
];

const clueTexts = {
  lab1: "보고서1: 본부 폭격 이후 엔터톤사이언스 CEO 존 스래플러가 은폐를 위해 죠나바이러스 방사를 명령했다.",
  lab2: "보고서2: 엔터톤 19주년 행사 공원에서 오후 3시 50분 죠나바이러스 100mg 방사가 예정되었다.",
  lab3: "보고서3: 백신 개발은 이미 안정적이며, 엔터톤사이언스는 영웅처럼 등장할 때를 기다리고 있다.",
  hospital1: "일기1: 엔터톤사이언스의 뒷계획을 막기 위해 데드저스티스가 창립되었다.",
  shop1: "은밀한 상점 거래 기록: 달 이주선 좌표와 민간 탈출 브로커의 암호가 남아 있다.",
  forest1: "숲 수색 기록: 도시 외곽의 폐쇄 구역 아래에 오래된 대피 루트가 숨겨져 있다.",
  lab2f_journal: "연구일지1: 죠나바이러스는 인공 합성체다. 역 합성 경로로 백신을 만들 수 있다.",
  lab2f_torn: "찢어진 연구일지: ...최종 실험 일자... 피험자 ID Z-09... 살아있다...",
};

const eventTables = {
  base: [
    { text: "기지 창고에서 비상 식량을 찾았다.", effect: () => addResource("food", 2) },
    { text: "방벽 균열을 보강했다.", effect: () => { state.base = Math.min(8, state.base + 1); } },
  ],
  lab: [
    { text: "오염된 샘플 냉장고를 열었다. 데이터와 의약품을 확보했다.", effect: () => { addResource("data", 1); addResource("meds", 1); } },
    { text: "보안 장치가 작동해 체력이 감소했다.", effect: () => { activePlayer().hp -= 8; } },
  ],
  hospital: [
    { text: "폐병원 처치실에서 의약품을 확보했다.", effect: () => addResource("meds", 2) },
    { text: "데드저스티스 표식을 발견했다. 신뢰도가 증가했다.", effect: () => { state.justice = Math.min(10, state.justice + 1); } },
  ],
  city: [
    { text: "폐차장에서 고철을 대량 수거했다.", effect: () => addResource("scrap", 3) },
    { text: "건물 붕괴로 부상을 입었다.", effect: () => { activePlayer().hp -= 10; } },
  ],
  construction: [
    { text: "공사장 철골을 회수해 고철을 확보했다.", effect: () => addResource("scrap", 3) },
    { text: "크레인 잔해로 방벽을 보강했다.", effect: () => { state.base = Math.min(8, state.base + 2); } },
  ],
  shop: [
    { text: "은밀한 상점에서 의약품과 데이터를 교환했다.", effect: () => { addResource("meds", 1); addResource("data", 1); } },
    { text: "상점 주인이 달 탈출 브로커의 소문을 흘렸다.", effect: () => { state.moonPlan = true; } },
  ],
  mart: [
    { text: "마트 창고에서 식량과 물을 확보했다.", effect: () => { addResource("food", 3); addResource("water", 3); } },
    { text: "냉동고 전원이 살아 있어 의약품 보관함을 찾았다.", effect: () => addResource("meds", 1) },
  ],
  forest: [
    { text: "숲 안쪽에서 숨겨진 대피 루트를 찾았다.", effect: () => { addResource("food", 4); addResource("water", 2); } },
    { text: "숲의 감염 동물 흔적 때문에 부상을 입었다.", effect: () => { activePlayer().hp -= 12; } },
  ],
};

const achievements = [
  { id: "start1", group: "생존 업적", name: "생존 시작", desc: "게임을 1회 시작한다.", test: () => meta.starts >= 1 },
  { id: "start5", group: "생존 업적", name: "생존 아마추어", desc: "게임을 5회 시작한다.", test: () => meta.starts >= 5 },
  { id: "start10", group: "생존 업적", name: "생존 중수", desc: "게임을 10회 플레이 한다. 보상: 보석 100개.", test: () => meta.starts >= 10 },
  { id: "start50", group: "생존 업적", name: "생존 고수", desc: "게임을 50회 플레이 한다. 보상: 보석 200개.", test: () => meta.starts >= 50 },
  { id: "start100", group: "생존 업적", name: "생존 마스터", desc: "게임을 100회 플레이 한다. 보상: 랭킹 등록 가능.", test: () => meta.starts >= 100 },
  { id: "rank401", group: "랭킹 업적", name: "랭킹 아마추어", desc: "랭킹 401~1000등 보상: 아마추어 랭커 프로필 카드.", test: () => false },
  { id: "rank201", group: "랭킹 업적", name: "랭킹 중수", desc: "랭킹 201~400등 보상: 프로필 카드/틀과 보석 500개.", test: () => false },
  { id: "rank6", group: "랭킹 업적", name: "랭킹 고수", desc: "랭킹 6~200등 보상: 프로필 카드/틀과 보석 800개.", test: () => false },
  { id: "rank2", group: "랭킹 업적", name: "랭킹 마스터", desc: "랭킹 2~5등 보상: 프로필 카드/틀과 보석 1000개.", test: () => false },
  { id: "rank1", group: "랭킹 업적", name: "더 랭커", desc: "랭킹 1등 보상: 더 랭커 프로필 카드/틀과 보석 2000개.", test: () => false },
];

const relics = [
  { id: "twoHearts", name: "두개의 심장", grade: "일반", icon: "♡", level: 1, shards: 0, need: 4, type: "전투", effect: "체력 +1%. 1~5레벨마다 체력 +1%씩 증가" },
  { id: "uselessDoll", name: "쓸모없는 인형", grade: "전설", icon: "▥", level: 1, shards: 0, need: 10, type: "연구", effect: "1~4레벨 능력 없음. 5레벨부터 게임 유물 슬롯 +2" },
];

const shopItems = [
  { id: "freeGems", tab: "daily", name: "무료 보석", icon: "◇", desc: "12시간 갱신 전까지 2회만 받을 수 있다.", price: "무료", currency: "ad", reward: { gems: 30 }, badge: "" },
  { id: "coinHandful", tab: "coins", name: "한줌의 코인", icon: "◎", desc: "코인 1000개를 획득한다.", price: 5, currency: "gems", reward: { coins: 1000 }, badge: "" },
  { id: "coinBag", tab: "coins", name: "배낭 코인", icon: "◎", desc: "코인 5000개를 획득한다.", price: 25, currency: "gems", reward: { coins: 5000 }, badge: "" },
  { id: "coinCarrier", tab: "coins", name: "캐리어 코인", icon: "◎", desc: "코인 10000개를 획득한다.", price: 50, currency: "gems", reward: { coins: 10000 }, badge: "" },
  { id: "coinPharaoh", tab: "coins", name: "파라오의 코인", icon: "◎", desc: "코인 50000개를 획득한다.", price: 250, currency: "gems", reward: { coins: 50000 }, badge: "" },
  { id: "jobCard", tab: "jobs", name: "직업 카드 구매", icon: "▱", desc: "의사, 사냥꾼, 군인 중 하나의 직업 카드를 얻는다. 중복 카드는 강화 재료가 된다.", price: 100, currency: "gems", reward: { jobCard: true }, badge: "2티어" },
  { id: "relicDraw", tab: "relics", name: "랜덤 유물 조각", icon: "♡", desc: "현재 테스트에서는 두개의 심장 조각 1개를 획득한다.", price: 50, currency: "gems", reward: { relicShard: "twoHearts" }, badge: "" },
  { id: "adRemove", tab: "utility", name: "광고 제거", icon: "▣", desc: "상업 버전의 광고 제거 상품 위치. 현재는 UI 테스트용.", price: 5000, currency: "coins", reward: { data: 1 }, badge: "영구" },
];

const timeByActionSpend = ["오전 9시", "오전 11시", "오후 1시", "오후 3시", "오후 5시", "오후 7시", "오후 9시"];

const relicGradeRates = [
  ["일반", 50],
  ["레어", 30],
  ["에픽", 15],
  ["전설", 5],
];

const actionFeedbackMeta = {
  move: { icon: "⌖", title: "탐색 준비", time: "3초", body: "지도에서 이동할 장소를 선택한다." },
  attack: { icon: "⚔", title: "공격", time: "무기별", body: "접근 중인 좀비를 제압한다." },
  craft: { icon: "⚒", title: "제작", time: "3초", body: "확보한 재료로 생존 도구를 만든다." },
  heal: { icon: "✚", title: "치료", time: "3초", body: "부상자를 치료하고 상태를 정비한다." },
  research: { icon: "◇", title: "연구", time: "3초", body: "제작법과 바이러스 단서를 분석한다." },
  investigate: { icon: "⌕", title: "조사", time: "3초", body: "현재 장소의 기록과 단서를 수색한다." },
  interact: { icon: "❖", title: "상호작용", time: "3초", body: "주변을 수확하고 채집한다." },
  expedition: { icon: "↟", title: "탐험", time: "3초", body: "위험 구역을 돌파해 보급품을 찾는다." },
};

const inventoryLabels = {
  wood: "나무",
  firewood: "땔감",
  stick: "막대기",
  web: "거미줄",
  thread: "실",
  rope: "줄",
  stone: "돌",
  spear: "창",
  lumber: "목재",
  waterwheel: "물레방아",
  mortarBowl: "절구통",
  pestle: "절구",
  shovel: "삽",
  soil: "흙",
  gardenBed: "텃밭",
  cookingTable: "조잡한 요리대",
  riceSeed: "벼씨",
  potato: "감자",
  wheat: "밀",
  bread: "빵",
  potatoSoup: "감자국",
  stoneSlab: "석재",
  stoneCutter: "석재 절단기",
  barricade: "바리케이드",
  throwingStone: "투척용 석",
  pickaxe: "곡괭이",
  smelter: "제련기",
  beryllium: "베릴륨",
  ironOre: "철광석",
  goldOre: "금광석",
  diamond: "다이아몬드",
  alloy: "합금",
  ironIngot: "철주괴",
  goldIngot: "금주괴",
  energyCell: "에너지 전지",
  carrotSeed: "당근 씨앗",
  fertilizer: "비료",
};

const recipes = [
  { id: "firewood", name: "땔감", input: { wood: 3 }, output: { firewood: 1 }, unlock: "나무 얻기" },
  { id: "stick", name: "막대기", input: { wood: 2 }, output: { stick: 1 }, unlock: "나무 얻기" },
  { id: "thread", name: "실", input: { web: 1 }, output: { thread: 2 }, unlock: "숲 진입 후 거미줄 획득" },
  { id: "rope", name: "줄", input: { thread: 4 }, output: { rope: 2 }, unlock: "숲 진입 후 거미줄 획득" },
  { id: "spear", name: "창", input: { rope: 2, stone: 1 }, output: { spear: 1 }, unlock: "아무 좀비 한 마리 잡기" },
  { id: "waterwheel", name: "물레방아", input: { wood: 15 }, output: { waterwheel: 1 }, unlock: "마트 탐험 성공" },
  { id: "lumber", name: "목재", input: { wood: 1 }, output: { lumber: 1 }, unlock: "나무 얻기" },
  { id: "mortarBowl", name: "절구통", input: { lumber: 3 }, output: { mortarBowl: 1 }, unlock: "목재 얻기" },
  { id: "pestle", name: "절구", input: { lumber: 2 }, output: { pestle: 1 }, unlock: "목재 얻기" },
  { id: "shovel", name: "삽", input: { stick: 1, lumber: 1 }, output: { shovel: 1 }, unlock: "목재 얻기" },
  { id: "gardenBed", name: "텃밭", input: { soil: 3 }, output: { gardenBed: 1 }, unlock: "삽 제작하기" },
  { id: "cookingTable", name: "조잡한 요리대", input: { lumber: 3 }, output: { cookingTable: 1 }, unlock: "목재 제작하기" },
  { id: "stoneCutter", name: "석재 절단기", input: { stone: 3, wood: 2 }, output: { stoneCutter: 1 }, unlock: "돌 3개 확보" },
  { id: "stoneSlab", name: "석재 변환", input: { stone: 3 }, output: { stoneSlab: 3 }, unlock: "석재 절단기 보유", requiresTool: "stoneCutter" },
  { id: "throwingStone", name: "투척용 석", input: { stoneSlab: 1, stone: 1 }, output: { throwingStone: 2 }, unlock: "석재 확보" },
  { id: "barricade", name: "바리케이드", input: { stoneSlab: 3, stone: 3 }, output: { barricade: 1 }, unlock: "석재 3개 확보" },
  { id: "pickaxe", name: "곡괭이", input: { stoneSlab: 12, lumber: 1 }, output: { pickaxe: 1 }, unlock: "석재 12개 확보" },
  { id: "smelter", name: "제련기", input: { stoneSlab: 30 }, output: { smelter: 1 }, unlock: "석재 30개 확보" },
];

const zombieTypes = {
  citizenZombie: { name: "시민 좀비", attack: 3, hp: 5, advance: 1 },
  runnerZombie: { name: "육상 좀비", attack: 2, hp: 4, advance: 3 },
  enhancedZombie: { name: "강화 좀비", attack: 10, hp: 10, advance: 1 },
  golemZombie: { name: "골렘 좀비", attack: 14, hp: 22, advance: 1 },
  bossZombie: { name: "보스 감염체", attack: 22, hp: 60, advance: 1 },
};

const easyWaves = [
  { citizenZombie: 2 },
  { citizenZombie: 2, runnerZombie: 1 },
  { runnerZombie: 2, citizenZombie: 2 },
  { runnerZombie: 3, citizenZombie: 2 },
  { enhancedZombie: 1, runnerZombie: 2 },
  { enhancedZombie: 1, runnerZombie: 2, citizenZombie: 2 },
  { enhancedZombie: 2, runnerZombie: 1, citizenZombie: 3 },
  { golemZombie: 1, enhancedZombie: 1, runnerZombie: 2 },
  { golemZombie: 1, enhancedZombie: 2, citizenZombie: 3 },
  { golemZombie: 2, enhancedZombie: 2, runnerZombie: 2 },
];

const meta = {
  coins: 1200,
  gems: 120,
  starts: 0,
  dailyResetAt: Date.now() + 12 * 60 * 60 * 1000,
  freeGemClaims: 0,
  adResetUses: 0,
  coinResetUses: 0,
  jobCards: {
    doctor: 0,
    hunter: 0,
    soldier: 0,
    citizen: 1,
    farmer: 0,
    merchant: 0,
    beast: 0,
  },
  ownedJobs: new Set(["citizen"]),
  best: { day: 0, wave: 0 },
  upgrades: {
    doctor: [],
    hunter: [],
    soldier: [],
    citizen: [],
    farmer: [],
    merchant: [],
    beast: [],
  },
  achievements: new Set(),
};

const state = {
  started: false,
  phase: "lobby",
  discussionLeft: 90,
  day: 1,
  mode: "solo",
  difficulty: "easy",
  wave: 1,
  base: 8,
  location: "base",
  currentPlayer: 0,
  players: [],
  hunger: 100,
  thirst: 100,
  maxInventory: 500,
  selectedRelics: new Set(),
  relicFilter: "all",
  shopTab: "daily",
  inventory: {},
  lastUnlockedJob: "",
  resources: {
    food: 8,
    water: 8,
    scrap: 3,
    meds: 2,
    data: 0,
    weapon: 0,
  },
  vaccine: 0,
  justice: 0,
  researchedCraft: false,
  moonPlan: false,
  forestUnlocked: false,
  clues: new Set(),
  ended: false,
};

const els = {
  titleScreen: document.querySelector("#titleScreen"),
  enterLobby: document.querySelector("#enterLobby"),
  openPrep: document.querySelector("#openPrep"),
  difficulty: document.querySelector("#difficulty"),
  mode: document.querySelector("#mode"),
  bootStatus: document.querySelector("#bootStatus"),
  teamSize: document.querySelector("#teamSize"),
  job: document.querySelector("#job"),
  startGame: document.querySelector("#startGame"),
  wallet: document.querySelector("#wallet"),
  topCoins: document.querySelector("#topCoins"),
  topGems: document.querySelector("#topGems"),
  musicToggle: document.querySelector("#musicToggle"),
  prepScreen: document.querySelector("#prepScreen"),
  prepRelics: document.querySelector("#prepRelics"),
  prepJobCards: document.querySelector("#prepJobCards"),
  prepRelicSlots: document.querySelector("#prepRelicSlots"),
  prepRoster: document.querySelector("#prepRoster"),
  prepBriefing: document.querySelector("#prepBriefing"),
  shopTimer: document.querySelector("#shopTimer"),
  shopScreen: document.querySelector("#shopScreen"),
  shopGrid: document.querySelector("#shopGrid"),
  infoScreen: document.querySelector("#infoScreen"),
  infoEyebrow: document.querySelector("#infoEyebrow"),
  infoTitle: document.querySelector("#infoTitle"),
  infoContent: document.querySelector("#infoContent"),
  rewardDialog: document.querySelector("#rewardDialog"),
  rewardIcon: document.querySelector("#rewardIcon"),
  rewardBody: document.querySelector("#rewardBody"),
  rewardClose: document.querySelector("#rewardClose"),
  upgradeList: document.querySelector("#upgradeList"),
  relicScreen: document.querySelector("#relicScreen"),
  relicGrid: document.querySelector("#relicGrid"),
  relicTotalLevel: document.querySelector("#relicTotalLevel"),
  lobbyPanel: document.querySelector("#lobbyPanel"),
  achievements: document.querySelector("#achievements"),
  day: document.querySelector("#day"),
  mobileDay: document.querySelector("#mobileDay"),
  clock: document.querySelector("#clock"),
  mobileClock: document.querySelector("#mobileClock"),
  phase: document.querySelector("#phase"),
  mobilePhase: document.querySelector("#mobilePhase"),
  wave: document.querySelector("#wave"),
  currentPlayer: document.querySelector("#currentPlayer"),
  mobilePlayer: document.querySelector("#mobilePlayer"),
  actions: document.querySelector("#actions"),
  mobileActions: document.querySelector("#mobileActions"),
  hp: document.querySelector("#hp"),
  mobileHpText: document.querySelector("#mobileHpText"),
  mobileHpBar: document.querySelector("#mobileHpBar"),
  base: document.querySelector("#base"),
  mobileBaseText: document.querySelector("#mobileBaseText"),
  mobileBaseBar: document.querySelector("#mobileBaseBar"),
  location: document.querySelector("#location"),
  zombieType: document.querySelector("#zombieType"),
  thirstText: document.querySelector("#thirstText"),
  thirstMeter: document.querySelector("#thirstMeter"),
  hungerText: document.querySelector("#hungerText"),
  hungerMeter: document.querySelector("#hungerMeter"),
  vaccineText: document.querySelector("#vaccineText"),
  vaccineMeter: document.querySelector("#vaccineMeter"),
  justiceText: document.querySelector("#justiceText"),
  justiceMeter: document.querySelector("#justiceMeter"),
  mapGrid: document.querySelector("#mapGrid"),
  craftGuide: document.querySelector("#craftGuide"),
  partyList: document.querySelector("#partyList"),
  discussionPanel: document.querySelector("#discussionPanel"),
  discussionTimer: document.querySelector("#discussionTimer"),
  discussionRoster: document.querySelector("#discussionRoster"),
  skipDiscussion: document.querySelector("#skipDiscussion"),
  operationOverlay: document.querySelector("#operationOverlay"),
  operationOverlayText: document.querySelector("#operationOverlayText"),
  actionFeedback: document.querySelector("#actionFeedback"),
  actionIcon: document.querySelector("#actionIcon"),
  actionTitle: document.querySelector("#actionTitle"),
  actionBody: document.querySelector("#actionBody"),
  actionTime: document.querySelector("#actionTime"),
  actionProgress: document.querySelector("#actionProgress"),
  resultToast: document.querySelector("#resultToast"),
  inventoryCount: document.querySelector("#inventoryCount"),
  inventoryMini: document.querySelector("#inventoryMini"),
  cardInfo: document.querySelector("#cardInfo"),
  log: document.querySelector("#log"),
  clues: document.querySelector("#clues"),
  endTurn: document.querySelector("#endTurn"),
  openInventory: document.querySelector("#openInventory"),
  mobileEndTurn: document.querySelector("#mobileEndTurn"),
  mobileInventory: document.querySelector("#mobileInventory"),
  inventoryDialog: document.querySelector("#inventoryDialog"),
  inventoryFull: document.querySelector("#inventoryFull"),
  inventoryClose: document.querySelector("#inventoryClose"),
  endingDialog: document.querySelector("#endingDialog"),
  endingTitle: document.querySelector("#endingTitle"),
  endingBody: document.querySelector("#endingBody"),
  restart: document.querySelector("#restart"),
  adReset: document.querySelector("#adReset"),
  coinReset: document.querySelector("#coinReset"),
};

let discussionInterval = 0;

const resourceEls = {
  food: document.querySelector("#food"),
  water: document.querySelector("#water"),
  scrap: document.querySelector("#scrap"),
  meds: document.querySelector("#meds"),
  data: document.querySelector("#data"),
  weapon: document.querySelector("#weapon"),
};

const META_KEY = "zwd-save-v1";

function saveMeta() {
  try {
    localStorage.setItem(META_KEY, JSON.stringify({
      coins: meta.coins,
      gems: meta.gems,
      starts: meta.starts,
      dailyResetAt: meta.dailyResetAt,
      freeGemClaims: meta.freeGemClaims,
      adResetUses: meta.adResetUses,
      coinResetUses: meta.coinResetUses,
      jobCards: meta.jobCards,
      ownedJobs: [...meta.ownedJobs],
      upgrades: meta.upgrades,
      achievements: [...meta.achievements],
      best: meta.best,
      relics: relics.map((relic) => ({ id: relic.id, level: relic.level, shards: relic.shards })),
    }));
  } catch (error) {
    // 저장 실패(시크릿 모드 등)는 게임 진행을 막지 않는다.
  }
}

function loadMeta() {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.coins === "number") meta.coins = data.coins;
    if (typeof data.gems === "number") meta.gems = data.gems;
    if (typeof data.starts === "number") meta.starts = data.starts;
    if (typeof data.dailyResetAt === "number") meta.dailyResetAt = data.dailyResetAt;
    if (typeof data.freeGemClaims === "number") meta.freeGemClaims = data.freeGemClaims;
    if (typeof data.adResetUses === "number") meta.adResetUses = data.adResetUses;
    if (typeof data.coinResetUses === "number") meta.coinResetUses = data.coinResetUses;
    if (data.jobCards) Object.assign(meta.jobCards, data.jobCards);
    if (Array.isArray(data.ownedJobs)) meta.ownedJobs = new Set(data.ownedJobs.concat("citizen"));
    if (data.upgrades) Object.assign(meta.upgrades, data.upgrades);
    if (Array.isArray(data.achievements)) meta.achievements = new Set(data.achievements);
    if (data.best) Object.assign(meta.best, data.best);
    (data.relics || []).forEach((saved) => {
      const relic = relics.find((candidate) => candidate.id === saved.id);
      if (relic) { relic.level = saved.level; relic.shards = saved.shards; }
    });
  } catch (error) {
    // 손상된 저장 데이터는 무시하고 새로 시작한다.
  }
}

function createPlayer(index, jobId) {
  const job = jobs[jobId];
  const upgraded = meta.upgrades[jobId];
  const hpBonus = upgraded.includes("이타적 유전자") ? 30 : 0;
  const armorBonus = upgraded.includes("불굴") ? 5 : 0;
  const attackBonus = upgraded.includes("사격술") ? 10 : 0;
  return {
    id: index + 1,
    jobId,
    name: `P${index + 1}`,
    hp: job.hp + hpBonus,
    maxHp: job.hp + hpBonus,
    attack: job.attack + attackBonus,
    armor: job.armor + armorBonus,
    actions: actionLimit(jobId),
    boosted: false,
    beastAteThisTurn: false,
    beastSkipTurnCount: 0,
    beastRoarCooldown: 0,
    merchantCoins: 0,
    farmerAttackBonus: 0,
    farmerTurnCounter: 0,
  };
}

function actionLimit(jobId) {
  return jobId === "soldier" && meta.upgrades.soldier.includes("불침번") ? 7 : 6;
}

function defaultInventory() {
  return {
    wood: 6,
    firewood: 0,
    stick: 0,
    web: 0,
    thread: 0,
    rope: 0,
    stone: 1,
    spear: 0,
    lumber: 0,
    waterwheel: 0,
    mortarBowl: 0,
    pestle: 0,
    shovel: 0,
    soil: 0,
    gardenBed: 0,
    cookingTable: 0,
    riceSeed: 0,
    potato: 0,
    wheat: 0,
    bread: 0,
    potatoSoup: 0,
    stoneSlab: 0,
    stoneCutter: 0,
    barricade: 0,
    throwingStone: 0,
    pickaxe: 0,
    smelter: 0,
    beryllium: 0,
    ironOre: 0,
    goldOre: 0,
    diamond: 0,
    alloy: 0,
    ironIngot: 0,
    goldIngot: 0,
    energyCell: 0,
    carrotSeed: 0,
    fertilizer: 0,
  };
}

function setupPlayers() {
  const size = state.mode === "team" ? Number(els.teamSize.value) : 1;
  state.players = Array.from({ length: size }, (_, index) => {
    const preferredJob = state.mode === "team" ? teamPreset[index] : els.job.value;
    const jobId = meta.ownedJobs.has(preferredJob) ? preferredJob : "citizen";
    return createPlayer(index, jobId);
  });
}

function resetGame(shouldStart = false) {
  state.difficulty = els.difficulty.value;
  state.mode = els.mode.value;
  state.started = shouldStart;
  state.phase = shouldStart ? "discussion" : "lobby";
  state.discussionLeft = 90;
  state.day = 1;
  state.wave = 1;
  state.base = 8;
  state.location = "base";
  state.currentPlayer = 0;
  state.hunger = 100;
  state.thirst = 100;
  state.inventory = defaultInventory();
  state.resources = { food: 6, water: 6, scrap: 3, meds: 2, data: 0, weapon: 0 };
  state.vaccine = 0;
  state.justice = 0;
  state.researchedCraft = false;
  state.moonPlan = false;
  state.forestUnlocked = false;
  state.clues = new Set();
  state.ended = false;
  setupPlayers();
  els.log.innerHTML = "";
  if (shouldStart) {
    meta.starts += 1;
    log("오전 7시 토의가 시작되었다. 90초 동안 오늘의 역할을 정한다.");
    log(state.mode === "solo"
      ? "갑자기 이상해진 사람들 속에서 진실을 파헤치기 위한 위험한 모험을 시작한다."
      : "갑자기 이상해진 사람들 속에서 진실을 파헤치기 위해서 동료와 함께 위험한 모험을 시작한다.");
  } else {
    log("로비 대기 중이다. 작전 시작을 누르면 오전 7시 토의 후 게임에 들어간다.");
  }
  checkAchievements();
  render();
  setScreen("combat");
  if (shouldStart) startDiscussionTimer();
  else stopDiscussionTimer();
}

function updatePrepConfig() {
  state.difficulty = els.difficulty.value;
  state.mode = els.mode.value;
  els.teamSize.disabled = state.mode !== "team";
  renderPrepSummary();
}

function resetDailyShopIfNeeded() {
  if (Date.now() < meta.dailyResetAt) return;
  meta.dailyResetAt = Date.now() + 12 * 60 * 60 * 1000;
  meta.freeGemClaims = 0;
  meta.adResetUses = 0;
  meta.coinResetUses = 0;
}

function formatRemainingTime(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}시간 ${String(minutes).padStart(2, "0")}분 ${String(seconds).padStart(2, "0")}초`;
}

function updateShopTimer() {
  resetDailyShopIfNeeded();
  els.shopTimer.textContent = formatRemainingTime(meta.dailyResetAt - Date.now());
  els.adReset.textContent = `광고 초기화 ${Math.max(0, 2 - meta.adResetUses)}/2`;
  els.coinReset.textContent = `일일 상품 초기화 1000 · ${Math.max(0, 3 - meta.coinResetUses)}/3`;
  els.adReset.disabled = meta.adResetUses >= 2;
  els.coinReset.disabled = meta.coinResetUses >= 3;
}

function launchOperation() {
  els.operationOverlay.hidden = false;
  els.operationOverlayText.textContent = `${els.mode.value === "team" ? `${els.teamSize.value}인 팀` : "솔로"} 작전 데이터를 불러오는 중이다.`;
  window.setTimeout(() => {
    els.operationOverlay.hidden = true;
    resetGame(true);
  }, 900);
}

function stopDiscussionTimer() {
  if (!discussionInterval) return;
  window.clearInterval(discussionInterval);
  discussionInterval = 0;
}

function startDiscussionTimer() {
  stopDiscussionTimer();
  discussionInterval = window.setInterval(() => {
    if (state.phase !== "discussion" || state.ended) {
      stopDiscussionTimer();
      return;
    }
    state.discussionLeft = Math.max(0, state.discussionLeft - 1);
    renderDiscussion();
    if (state.discussionLeft <= 0) skipDiscussion();
  }, 1000);
}

function triggerMapEntry() {
  const app = document.querySelector(".app");
  app?.classList.add("map-entering");
  window.setTimeout(() => app?.classList.remove("map-entering"), 900);
}

function showResultToast(message) {
  if (!els.resultToast) return;
  els.resultToast.textContent = message;
  els.resultToast.hidden = false;
  els.resultToast.classList.remove("show");
  void els.resultToast.offsetWidth;
  els.resultToast.classList.add("show");
  window.clearTimeout(showResultToast.timer);
  showResultToast.timer = window.setTimeout(() => {
    els.resultToast.hidden = true;
    els.resultToast.classList.remove("show");
  }, 1700);
}

function showActionFeedback(actionId, bodyOverride = "") {
  const meta = actionFeedbackMeta[actionId] || actionFeedbackMeta.move;
  els.actionIcon.textContent = meta.icon;
  els.actionTitle.textContent = meta.title;
  els.actionBody.textContent = bodyOverride || meta.body;
  els.actionTime.textContent = meta.time;
  els.actionFeedback.hidden = false;
  els.actionFeedback.classList.remove("show");
  void els.actionFeedback.offsetWidth;
  els.actionFeedback.classList.add("show");
  window.clearTimeout(showActionFeedback.timer);
  showActionFeedback.timer = window.setTimeout(() => {
    els.actionFeedback.hidden = true;
    els.actionFeedback.classList.remove("show");
  }, 900);
}

function runAction(actionId, handler) {
  showActionFeedback(actionId);
  handler();
}

function activePlayer() {
  return state.players[state.currentPlayer];
}

function activeJob() {
  return jobs[activePlayer().jobId];
}

function getPlace() {
  return places.find((place) => place.id === state.location);
}

function zombieProfile() {
  if (state.day < 2) return { name: "웨이브 대기", pressure: 0, damage: 0, summary: "2일차부터 웨이브 시작" };
  const wave = easyWaves[Math.min(state.wave - 1, easyWaves.length - 1)] || easyWaves[easyWaves.length - 1];
  const entries = Object.entries(wave);
  const pressure = entries.reduce((sum, [id, count]) => sum + zombieTypes[id].attack * count, 0);
  const damage = Math.max(...entries.map(([id]) => zombieTypes[id].attack));
  return {
    name: entries.map(([id, count]) => `${zombieTypes[id].name} ${count}`).join(" / "),
    pressure,
    damage,
    summary: entries.map(([id, count]) => `${zombieTypes[id].name}x${count}`).join(", "),
  };
}

function spentActionsForClock() {
  if (!state.players.length) return 0;
  return Math.min(...state.players.map((player) => Math.min(6, actionLimit(player.jobId) - player.actions)));
}

function clockLabel() {
  if (state.phase === "discussion") return "오전 7시";
  if (state.phase === "lobby") return "로비";
  return timeByActionSpend[spentActionsForClock()] || "오후 9시";
}

function phaseLabel() {
  if (state.phase === "discussion") return "토의";
  if (state.phase === "game") return "작전";
  return "로비";
}

function inventoryCount() {
  return Object.values(state.inventory).reduce((sum, value) => sum + value, 0);
}

function setCombatVisibility() {
  const app = document.querySelector(".app");
  app?.classList.toggle("in-game", state.started);
  app?.classList.toggle("discussion-mode", state.phase === "discussion");
  document.querySelectorAll(".lobby-combat").forEach((section) => {
    section.hidden = state.started;
  });
  document.querySelectorAll(".play-combat").forEach((section) => {
    section.hidden = !state.started;
  });
}

function render() {
  const player = activePlayer();
  const job = activeJob();
  renderJobOptions();
  els.teamSize.disabled = els.mode.value !== "team";
  els.day.textContent = `${state.day}일차`;
  els.clock.textContent = clockLabel();
  els.phase.textContent = phaseLabel();
  els.wave.textContent = state.wave;
  els.currentPlayer.textContent = `${player.name} ${job.name}`;
  els.actions.textContent = player.actions;
  els.hp.textContent = `${Math.max(0, player.hp)} / ${player.maxHp}`;
  els.base.textContent = `${Math.max(0, state.base)} / 8`;
  els.mobileDay.textContent = `${state.day}일차`;
  els.mobileClock.textContent = clockLabel();
  els.mobilePhase.textContent = phaseLabel();
  els.mobilePlayer.textContent = `${player.name} ${job.name}`;
  els.mobileActions.textContent = player.actions;
  els.mobileHpText.textContent = `${Math.max(0, player.hp)}/${player.maxHp}`;
  els.mobileHpBar.style.width = `${Math.max(0, Math.min(100, Math.round((player.hp / player.maxHp) * 100)))}%`;
  els.mobileBaseText.textContent = `${Math.max(0, state.base)}/8`;
  els.mobileBaseBar.style.width = `${Math.max(0, Math.min(100, Math.round((state.base / 8) * 100)))}%`;
  els.location.textContent = getPlace().name;
  els.zombieType.textContent = zombieProfile().name;
  els.thirstText.textContent = state.thirst;
  els.thirstMeter.style.width = `${state.thirst}%`;
  els.hungerText.textContent = state.hunger;
  els.hungerMeter.style.width = `${state.hunger}%`;
  els.vaccineText.textContent = `${state.vaccine}%`;
  els.vaccineMeter.style.width = `${state.vaccine}%`;
  els.justiceText.textContent = state.justice;
  els.justiceMeter.style.width = `${Math.min(100, state.justice * 10)}%`;
  els.wallet.textContent = `코인 ${meta.coins} / 보석 ${meta.gems}`;
  els.topCoins.textContent = meta.coins;
  els.topGems.textContent = meta.gems;
  els.discussionPanel.hidden = state.phase !== "discussion";
  els.endTurn.textContent = state.phase === "discussion" ? "토의 건너뛰기" : "턴 종료";
  els.mobileEndTurn.textContent = state.phase === "discussion" ? "토의 넘김" : "턴 종료";
  renderCraftGuide();
  renderDiscussion();
  els.inventoryCount.textContent = `${inventoryCount()}/${state.maxInventory}`;
  els.inventoryMini.innerHTML = Object.entries(state.inventory)
    .filter(([, value]) => value > 0)
    .slice(0, 10)
    .map(([key, value]) => `<span>${inventoryLabels[key] || key} <b>${value}</b></span>`)
    .join("") || "<span>비어 있음</span>";
  renderInventoryFull();

  for (const [key, value] of Object.entries(state.resources)) {
    resourceEls[key].textContent = value;
  }

  els.cardInfo.innerHTML = `
    <div class="card-portrait" style="--portrait-image: url('${jobVisuals[player.jobId]}')"></div>
    <strong>${job.name} 카드</strong>
    <span>기본: 체력 ${job.hp} / 공격 ${job.attack} / 보호 ${job.armor}</span>
    <span>고유: ${job.skill}</span>
    <span>강화: ${meta.upgrades[player.jobId].join(" / ") || "없음"}</span>
    <span>${job.text}</span>
  `;

  els.partyList.innerHTML = state.players.map((member, index) => {
    const memberJob = jobs[member.jobId];
    return `
      <button class="party-row ${index === state.currentPlayer ? "active" : ""}" data-player="${index}" type="button">
        <strong>${member.name} ${memberJob.name}</strong>
        <span>${member.hp <= 0 ? "사망 · 행동 불가" : `체력 ${Math.max(0, member.hp)} / ${member.maxHp} · 행동 ${member.actions}`}</span>
      </button>
    `;
  }).join("");
  document.querySelectorAll(".party-row").forEach((row) => {
    const member = state.players[Number(row.dataset.player)];
    row.style.setProperty("--portrait-image", `url('${jobVisuals[member.jobId]}')`); 
  });

  els.mapGrid.innerHTML = places.map((place) => `
    <button class="tile ${state.location === place.id ? "active" : ""} ${isPlaceLocked(place) ? "locked" : ""}" data-place="${place.id}" style="--node-x: ${place.x}%; --node-y: ${place.y}%" type="button">
      <h4><span class="node-icon">${isPlaceLocked(place) ? "▣" : place.icon}</span> ${place.name}</h4>
      <p>${place.desc}</p>
    </button>
  `).join("");

  renderUpgrades();
  renderShop();
  renderRelics();
  renderPrepSummary();
  renderCodex();
  renderAchievements();
  setCombatVisibility();

  document.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("click", () => moveTo(tile.dataset.place));
  });
  document.querySelectorAll(".party-row").forEach((row) => {
    row.addEventListener("click", () => switchPlayer(Number(row.dataset.player)));
  });
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.disabled = state.ended || !state.started || state.phase !== "game";
  });
  saveMeta();
}

function renderCraftGuide() {
  const showGuide = state.started && state.phase === "game" && state.location === "base";
  els.craftGuide.hidden = !showGuide;
  if (!showGuide) return;
  const visibleRecipes = recipes.slice(0, 8);
  els.craftGuide.innerHTML = `
    <div class="craft-guide-head">
      <strong>기지 제작 가능 목록</strong>
      <span>${state.researchedCraft ? "연구 완료" : "연구 필요"}</span>
    </div>
    <div class="craft-guide-list">
      ${visibleRecipes.map((recipe) => {
        const craftable = state.researchedCraft && hasInventory(recipe.input);
        return `
          <article class="${craftable ? "craftable" : ""}">
            <b>${recipe.name}</b>
            <small>${itemList(recipe.input)} → ${itemList(recipe.output)}</small>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderDiscussion() {
  if (!els.discussionTimer || !els.discussionRoster) return;
  els.discussionTimer.textContent = `${state.discussionLeft}`;
  els.discussionRoster.innerHTML = state.players.map((player, index) => {
    const job = jobs[player.jobId];
    const role = player.jobId === "doctor"
      ? "치료/백신"
      : player.jobId === "hunter"
        ? "탐험/식량"
        : player.jobId === "soldier"
          ? "방어/전투"
          : "조사/보급";
    return `
      <article>
        <span>P${index + 1}</span>
        <strong>${job.name}</strong>
        <small>${role}</small>
      </article>
    `;
  }).join("");
}

function renderUpgrades() {
  els.upgradeList.innerHTML = Object.entries(jobs).map(([jobId, job]) => {
    const next = job.tierOptions.find((option) => !meta.upgrades[jobId].includes(option));
    const text = next ? `다음 능력: ${next}` : "강화 완료";
    const owned = meta.ownedJobs.has(jobId);
    return `
      <div class="upgrade-row ${owned ? "" : "locked"}">
        <div class="job-mini" style="--portrait-image: url('${jobVisuals[jobId]}')"></div>
        <div>
          <strong>${job.name}</strong>
          <span>${owned ? `${text} · 보유 카드 ${meta.jobCards[jobId] || 0}장` : "상점에서 직업 카드를 얻어야 강화 가능"}</span>
        </div>
        <button data-upgrade="${jobId}" ${owned && next ? "" : "disabled"} type="button">강화</button>
      </div>
    `;
  }).join("");
  document.querySelectorAll("[data-upgrade]").forEach((button) => {
    button.addEventListener("click", () => upgradeCard(button.dataset.upgrade));
  });
}

function renderJobOptions() {
  const current = meta.ownedJobs.has(els.job.value) ? els.job.value : "citizen";
  els.job.innerHTML = Object.entries(jobs)
    .filter(([jobId]) => meta.ownedJobs.has(jobId))
    .map(([jobId, job]) => `<option value="${jobId}">${job.name}</option>`)
    .join("");
  els.job.value = current;
}

function renderCodex() {
  els.clues.innerHTML = Object.entries(clueTexts).map(([id, text]) => {
    const unlocked = state.clues.has(id);
    return `<li class="${unlocked ? "unlocked" : "locked"}">${unlocked ? text : "미확인 기록"}</li>`;
  }).join("");
}

function renderAchievements() {
  els.achievements.innerHTML = achievements.map((achievement) => {
    const done = meta.achievements.has(achievement.id);
    return `<li class="${done ? "done" : ""}"><strong>${achievement.name}</strong><br>${achievement.desc}</li>`;
  }).join("");
}

function renderRelics() {
  const totalLevel = relics.reduce((sum, relic) => sum + relic.level, 0);
  els.relicTotalLevel.textContent = totalLevel;
  const limit = activeRelicLimit();
  const visibleRelics = relics.filter((relic) => {
    if (state.relicFilter === "all") return true;
    if (state.relicFilter === "upgradable") return relic.shards >= relic.need;
    return relic.type === state.relicFilter;
  });
  els.relicGrid.innerHTML = visibleRelics.map((relic) => {
    const percent = Math.min(100, Math.round((relic.shards / relic.need) * 100));
    const selected = state.selectedRelics.has(relic.id);
    const visibleEffect = relic.level > 1 ? relic.effect : "능력 미공개. 레벨업 후 공개.";
    return `
      <article class="relic-card ${selected ? "selected" : ""}">
        <div class="relic-icon">${relic.icon}</div>
        <strong>${relic.name}</strong>
        <small>${relic.grade} · ${relic.type} · ${visibleEffect}</small>
        <div class="relic-progress">
          <span><b>Lv.${relic.level}</b><b>${relic.shards}/${relic.need}</b></span>
          <div class="relic-bar"><i style="--progress: ${percent}%"></i></div>
        </div>
        <button data-relic="${relic.id}" type="button">${selected ? "장착 중" : `장착 ${state.selectedRelics.size}/${limit}`}</button>
      </article>
    `;
  }).join("") || `<article class="relic-card"><strong>해당 유물 없음</strong><small>현재 필터에 맞는 유물이 없다.</small></article>`;
  document.querySelectorAll("[data-relic-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.relicFilter === state.relicFilter);
  });
  document.querySelectorAll("[data-relic]").forEach((button) => {
    button.addEventListener("click", () => toggleRelic(button.dataset.relic));
  });
}

function renderPrepSummary() {
  els.teamSize.disabled = els.mode.value !== "team";
  const selected = relics.filter((relic) => state.selectedRelics.has(relic.id));
  const limit = activeRelicLimit();
  els.prepRelics.textContent = `${selected.length}/${limit}`;
  els.prepBriefing.textContent = `${els.difficulty.options[els.difficulty.selectedIndex].text} · ${els.mode.value === "team" ? `${els.teamSize.value}인 팀` : "솔로"}`;

  els.prepJobCards.innerHTML = Object.entries(jobs).map(([jobId, job]) => {
    const owned = meta.ownedJobs.has(jobId);
    const selectedJob = els.job.value === jobId;
    return `
      <button class="prep-job ${selectedJob ? "selected" : ""} ${owned ? "" : "locked"}" data-prep-job="${jobId}" type="button">
        <span class="prep-job-art" style="--portrait-image: url('${jobVisuals[jobId]}')"></span>
        <strong>${job.name}</strong>
        <small>${owned ? `${job.skill} · 카드 ${meta.jobCards[jobId] || 0}장` : "상점 직업 카드 필요"}</small>
      </button>
    `;
  }).join("");

  els.prepRelicSlots.innerHTML = relics.map((relic) => {
    const equipped = state.selectedRelics.has(relic.id);
    return `
      <button class="prep-relic ${equipped ? "selected" : ""}" data-prep-relic="${relic.id}" type="button">
        <span>${relic.icon}</span>
        <strong>${relic.name}</strong>
        <small>${relic.grade} · Lv.${relic.level}</small>
      </button>
    `;
  }).join("");

  const rosterJobIds = els.mode.value === "team"
    ? teamPreset.slice(0, Number(els.teamSize.value)).map((jobId) => meta.ownedJobs.has(jobId) ? jobId : "citizen")
    : [els.job.value];
  els.prepRoster.innerHTML = rosterJobIds.map((jobId, index) => {
    const job = jobs[jobId];
    return `
      <div class="prep-roster-row">
        <span>P${index + 1}</span>
        <strong>${job.name}</strong>
        <small>체력 ${job.hp} / 공격 ${job.attack} / 보호 ${job.armor}</small>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-prep-job]").forEach((button) => {
    button.addEventListener("click", () => selectPrepJob(button.dataset.prepJob));
  });
  document.querySelectorAll("[data-prep-relic]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleRelic(button.dataset.prepRelic);
      renderPrepSummary();
    });
  });
}

function renderShop() {
  updateShopTimer();
  const visibleItems = shopItems.filter((item) => state.shopTab === "daily" ? item.tab === "daily" : item.tab === state.shopTab);
  els.shopGrid.innerHTML = visibleItems.map((item) => {
    const soldOut = item.id === "freeGems" && meta.freeGemClaims >= 2;
    const price = item.currency === "gems"
      ? `보석 ${item.price}`
      : item.currency === "coins"
        ? `코인 ${item.price}`
        : item.id === "freeGems"
          ? `무료 ${Math.max(0, 2 - meta.freeGemClaims)}/2`
          : item.price;
    return `
      <article class="shop-card ${item.badge ? "discount" : ""} ${soldOut ? "sold-out" : ""}" data-badge="${item.badge}">
        <div class="shop-icon">${item.icon}</div>
        <strong>${item.name}</strong>
        <small>${item.desc}</small>
        <div class="price-row">
          <span>${price}</span>
          <button data-buy="${item.id}" ${soldOut ? "disabled" : ""} type="button">${soldOut ? "완료" : "구매"}</button>
        </div>
      </article>
    `;
  }).join("") || `<article class="shop-card"><strong>상품 준비 중</strong><small>이 카테고리 상품은 다음 단계에서 추가한다.</small></article>`;
  document.querySelectorAll("[data-shop-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.shopTab === state.shopTab);
  });
  document.querySelectorAll("[data-buy]").forEach((button) => {
    button.addEventListener("click", () => buyShopItem(button.dataset.buy));
  });
}

function buyShopItem(itemId) {
  const item = shopItems.find((candidate) => candidate.id === itemId);
  if (!item) return;
  resetDailyShopIfNeeded();
  if (item.id === "freeGems" && meta.freeGemClaims >= 2) {
    showReward("!", "무료 보석은 12시간마다 2회만 받을 수 있다.");
    return;
  }
  if (item.currency === "gems" && meta.gems < item.price) {
    showReward("!", "보석이 부족하다.");
    return;
  }
  if (item.currency === "coins" && meta.coins < item.price) {
    showReward("!", "코인이 부족하다.");
    return;
  }
  if (item.currency === "gems") meta.gems -= item.price;
  if (item.currency === "coins") meta.coins -= item.price;
  if (item.id === "freeGems") meta.freeGemClaims += 1;
  applyReward(item.reward);
  render();
  showReward(item.icon, rewardText(item.reward));
}

function applyReward(reward) {
  if (reward.gems) meta.gems += reward.gems;
  if (reward.coins) meta.coins += reward.coins;
  if (reward.jobCard) drawRandomJobCard();
  if (reward.relicShard) addRelicShard(reward.relicShard, 1);
  ["food", "water", "scrap", "meds", "data", "weapon"].forEach((key) => {
    if (reward[key]) state.resources[key] += reward[key];
  });
}

function rewardText(reward) {
  const labels = {
    gems: "보석",
    coins: "코인",
    food: "식량",
    water: "물",
    scrap: "고철",
    meds: "의약품",
    data: "데이터",
    weapon: "무기",
    jobCard: "직업 카드",
    relicShard: "유물 조각",
  };
  if (reward.jobCard) return state.lastUnlockedJob ? `${jobs[state.lastUnlockedJob].name} 카드 +1` : "직업 카드 +1";
  if (reward.relicShard) return `${relics.find((relic) => relic.id === reward.relicShard)?.name || "유물"} 조각 1`;
  return Object.entries(reward).map(([key, value]) => `${labels[key]} ${value}`).join(", ");
}

function addRelicShard(relicId, amount) {
  const relic = relics.find((candidate) => candidate.id === relicId);
  if (!relic) return;
  relic.shards += amount;
  if (relic.shards >= relic.need) {
    relic.shards -= relic.need;
    relic.level += 1;
    log(`${relic.name} 유물이 Lv.${relic.level}이 되었다.`);
  }
}

function renderInventoryFull() {
  els.inventoryFull.innerHTML = Object.entries(state.inventory)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => `<article><strong>${inventoryLabels[key] || key}</strong><span>${value}</span></article>`)
    .join("") || "<p>보유 중인 물품이 없다.</p>";
}

function drawRandomJobCard() {
  const candidates = ["doctor", "hunter", "soldier"];
  const jobId = candidates[Math.floor(Math.random() * candidates.length)];
  meta.jobCards[jobId] += 1;
  meta.ownedJobs.add(jobId);
  state.lastUnlockedJob = jobId;
  log(`${jobs[jobId].name} 직업 카드 1장을 획득했다. 보유 ${meta.jobCards[jobId]}장.`);
}

function itemList(items) {
  return Object.entries(items)
    .map(([key, value]) => `${inventoryLabels[key] || key} ${value}`)
    .join(", ");
}

function renderBaseGridPreview() {
  const fieldRows = Array.from({ length: 15 }, () => "<span></span>".repeat(8));
  const baseRows = Array.from({ length: 3 }, () => "<i></i>".repeat(6));
  return `
    <div class="base-grid-preview" aria-label="8x15 전장과 3x6 기지">
      ${fieldRows.map((row) => `<div class="field-row">${row}</div>`).join("")}
      ${baseRows.map((row) => `<div class="base-row">${row}</div>`).join("")}
    </div>
  `;
}

const infoScreens = {
  jobs: {
    eyebrow: "Job / Zombie Codex",
    title: "직업 도감 · 좀비 도감",
    body: () => `
      <div class="info-grid">
        ${Object.entries(jobs).map(([jobId, job]) => `
          <article class="${meta.ownedJobs.has(jobId) ? "done" : ""}">
            <h3>${job.name}</h3>
            <p>체력 ${job.hp} / 공격 ${job.attack} / 보호 ${job.armor}</p>
            <p>고유 능력: ${job.skill}</p>
            <p>${job.text}</p>
            <small>${meta.ownedJobs.has(jobId) ? "보유 중" : "상점 직업 카드 구매로 해금"} · 티어 능력: ${job.tierOptions.join(" / ") || "없음"}</small>
          </article>
        `).join("")}
      </div>
      <div class="info-grid">
        ${Object.values(zombieTypes).map((zombie) => `
          <article>
            <h3>${zombie.name}</h3>
            <p>공격력 ${zombie.attack} / 체력 ${zombie.hp} / 턴 종료 전진 ${zombie.advance}칸</p>
          </article>
        `).join("")}
      </div>
    `,
  },
  achievements: {
    eyebrow: "Profile Rewards",
    title: "업적",
    body: () => ["생존 업적", "랭킹 업적"].map((group) => `
      <section class="info-section">
        <h3>${group}</h3>
        <div class="info-grid">${achievements.filter((achievement) => achievement.group === group).map((achievement) => `
          <article class="${meta.achievements.has(achievement.id) ? "done" : ""}">
            <h3>${achievement.name}</h3>
            <p>${achievement.desc}</p>
            <small>${meta.achievements.has(achievement.id) ? "달성" : "미달성"}</small>
          </article>
        `).join("")}</div>
      </section>
    `).join(""),
  },
  ranking: {
    eyebrow: "My Records",
    title: "랭킹",
    body: () => `
      <p class="info-note">온라인 랭킹은 준비 중이다. 지금은 이 기기에서 세운 나의 최고 기록을 보여준다.</p>
      <div class="info-grid">
        <article><h3>최고 생존 일수</h3><p>${meta.best.day}일</p></article>
        <article><h3>최고 웨이브</h3><p>${meta.best.wave}웨이브</p></article>
        <article><h3>플레이 횟수</h3><p>${meta.starts}회</p></article>
      </div>
    `,
  },
  base: {
    eyebrow: "Base Map",
    title: "기지",
    body: () => `
      <p class="info-note">전장은 8x15칸, 마지막 가로 중심에는 3x6 기지가 붙는다. 기지 체력 기본값은 8이다.</p>
      ${renderBaseGridPreview()}
      <div class="info-grid">
        <article><h3>제작 도구</h3><p>${recipes.map((recipe) => `${itemList(recipe.input)} -> ${itemList(recipe.output)}`).join("<br>")}</p></article>
        <article><h3>생존 게이지</h3><p>행동 1당 탈수 -3, 배고픔 -1. 둘 중 하나가 0이면 죽음 엔딩으로 이동한다.</p></article>
      </div>
    `,
  },
  quests: {
    eyebrow: "Daily / Weekly / Monthly",
    title: "퀘스트",
    body: () => `
      <div class="info-grid">
        <article><h3>일일 퀘스트</h3><p>조사 1회, 탐험 1회, 제작 1회.</p></article>
        <article><h3>주간 퀘스트</h3><p>3웨이브 생존, 단서 3개 수집.</p></article>
        <article><h3>월간 퀘스트</h3><p>백신 엔딩 또는 협력 엔딩 1회 도달.</p></article>
      </div>
    `,
  },
  attendance: {
    eyebrow: "Attendance",
    title: "출석 보상",
    body: () => `
      <div class="info-grid">
        <article><h3>1일차</h3><p>코인 1000</p></article>
        <article><h3>3일차</h3><p>보석 30</p></article>
        <article><h3>7일차</h3><p>랜덤 유물 조각</p></article>
      </div>
    `,
  },
};

function renderInfoScreen(screen) {
  const info = infoScreens[screen];
  if (!info) return;
  els.infoEyebrow.textContent = info.eyebrow;
  els.infoTitle.textContent = info.title;
  els.infoContent.innerHTML = info.body();
}

function showReward(icon, body) {
  els.rewardIcon.textContent = icon;
  els.rewardBody.textContent = body;
  openDialog(els.rewardDialog);
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
    return;
  }
  dialog.classList.add("dialog-fallback");
  dialog.setAttribute("open", "");
}

function closeDialog(dialog) {
  if (typeof dialog.close === "function") {
    dialog.close();
    return;
  }
  dialog.classList.remove("dialog-fallback");
  dialog.removeAttribute("open");
}

function setScreen(screen) {
  const isRelic = screen === "relic";
  const isShop = screen === "shop";
  const isPrep = screen === "prep";
  const isCombat = screen === "combat";
  const isInfo = Boolean(infoScreens[screen]);
  document.querySelector(".app")?.classList.toggle("prep-mode", isPrep);
  document.querySelectorAll(".combat-screen").forEach((section) => {
    section.hidden = !isCombat;
  });
  els.prepScreen.hidden = !isPrep;
  els.shopScreen.hidden = !isShop;
  els.relicScreen.hidden = !isRelic;
  els.infoScreen.hidden = !isInfo;
  if (isCombat) setCombatVisibility();
  if (isPrep) renderPrepSummary();
  if (isInfo) renderInfoScreen(screen);
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === screen);
  });
}

function enterLobby() {
  document.querySelector(".app")?.classList.remove("title-mode");
  setScreen("combat");
}

function activeRelicLimit() {
  const doll = relics.find((relic) => relic.id === "uselessDoll");
  return state.selectedRelics.has("uselessDoll") && doll?.level >= 5 ? 6 : 4;
}

function toggleRelic(relicId) {
  if (state.selectedRelics.has(relicId)) {
    state.selectedRelics.delete(relicId);
    renderRelics();
    renderPrepSummary();
    return;
  }
  if (state.selectedRelics.size >= activeRelicLimit()) {
    showReward("!", `유물은 게임당 ${activeRelicLimit()}개까지 선택할 수 있다.`);
    return;
  }
  state.selectedRelics.add(relicId);
  renderRelics();
  renderPrepSummary();
}

function selectPrepJob(jobId) {
  if (!meta.ownedJobs.has(jobId)) {
    showReward("▱", `${jobs[jobId].name} 카드는 상점의 직업 카드 구매로 해금해야 한다.`);
    return;
  }
  els.job.value = jobId;
  renderPrepSummary();
}

function switchPlayer(index) {
  if (index < 0 || index >= state.players.length) return;
  if (state.players[index].hp <= 0) {
    log("쓰러진 동료로는 전환할 수 없다.");
    return;
  }
  state.currentPlayer = index;
  log(`${activePlayer().name} ${activeJob().name} 차례로 전환했다.`);
  render();
}

function isPlaceLocked(place) {
  return Boolean(place.locked && !state.forestUnlocked);
}

function upgradeCard(jobId) {
  const next = jobs[jobId].tierOptions.find((option) => !meta.upgrades[jobId].includes(option));
  if (!next) return;
  if ((meta.jobCards[jobId] || 0) <= 0) {
    log(`${jobs[jobId].name} 카드가 부족하다. 상점에서 직업 카드를 구매해야 한다.`);
    showReward("▱", "강화에는 같은 직업 카드 1장이 필요하다.");
    return;
  }
  if (meta.gems < 30) {
    log("카드 강화에는 보석 30개가 필요하다.");
    return;
  }
  meta.gems -= 30;
  meta.jobCards[jobId] -= 1;
  meta.upgrades[jobId].push(next);
  log(`${jobs[jobId].name} 카드에 ${next} 능력이 붙었다.`);
  state.players = state.players.map((player, index) => {
    const rebuilt = createPlayer(index, player.jobId);
    rebuilt.hp = Math.min(rebuilt.maxHp, player.hp + Math.max(0, rebuilt.maxHp - player.maxHp));
    rebuilt.actions = player.actions;
    rebuilt.boosted = player.boosted;
    rebuilt.beastAteThisTurn = player.beastAteThisTurn;
    rebuilt.beastSkipTurnCount = player.beastSkipTurnCount;
    rebuilt.beastRoarCooldown = player.beastRoarCooldown;
    rebuilt.merchantCoins = player.merchantCoins;
    rebuilt.farmerAttackBonus = player.farmerAttackBonus;
    rebuilt.farmerTurnCounter = player.farmerTurnCounter;
    return rebuilt;
  });
  render();
}

function addResource(key, amount) {
  state.resources[key] += amount;
}

function addInventory(key, amount) {
  const nextCount = inventoryCount() + amount;
  if (amount > 0 && nextCount > state.maxInventory) {
    log(`인벤토리 한도 ${state.maxInventory}개를 초과할 수 없다.`);
    return false;
  }
  state.inventory[key] = Math.max(0, (state.inventory[key] || 0) + amount);
  return true;
}

function hasInventory(items) {
  return Object.entries(items).every(([key, value]) => (state.inventory[key] || 0) >= value);
}

function applyInventoryRecipe(recipe) {
  if (!hasInventory(recipe.input)) return false;
  Object.entries(recipe.input).forEach(([key, value]) => addInventory(key, -value));
  Object.entries(recipe.output).forEach(([key, value]) => addInventory(key, value));
  return true;
}

function recordActionCost(cost, seconds) {
  if (activePlayer().jobId !== "beast") {
    state.thirst = Math.max(0, state.thirst - cost * 3);
  }
  state.hunger = Math.max(0, state.hunger - cost);
  if (seconds) log(`행동 처리 시간 ${seconds}초 소요.`);
  if (state.thirst <= 0 || state.hunger <= 0) {
    showEnding("죽음 엔딩", "탈수 또는 배고픔이 한계에 도달했다. 결국 우리는 여기서 최후를 맞이한다.");
  }
}

function spend(cost, action = "") {
  if (!state.started) {
    log("아직 작전이 시작되지 않았다.");
    return false;
  }
  if (state.phase === "discussion") {
    log("오전 7시 토의 중에는 행동을 소비하지 않는다. 토의를 건너뛰면 오전 9시 작전이 시작된다.");
    return false;
  }
  const player = activePlayer();
  if (player.jobId === "beast" && (action === "craft" || action === "research")) {
    log("짐승인간은 거친 손 때문에 제작이나 연구를 할 수 없다.");
    return false;
  }
  if (player.hp <= 0) {
    log(`${player.name}은(는) 쓰러져서 행동할 수 없다.`);
    return false;
  }
  if (player.actions < cost) {
    log(`행동력이 부족하다. 필요 ${cost}, 현재 ${player.actions}.`);
    return false;
  }
  player.actions -= cost;
  recordActionCost(cost, 0);
  return true;
}

function moveTo(placeId) {
  if (state.location === placeId) return;
  const nextPlace = places.find((place) => place.id === placeId);
  if (nextPlace && isPlaceLocked(nextPlace)) {
    log("숲은 아직 잠겨 있다. 탐험으로 길을 찾아야 갈 수 있다.");
    return;
  }
  if (!spend(2)) return;
  showActionFeedback("move", `${nextPlace.name}로 이동 중이다.`);
  state.location = placeId;
  const danger = getPlace().threat + state.wave - activePlayer().armor;
  if (danger > 4) {
    const damage = Math.max(4, danger * 2);
    activePlayer().hp -= damage;
    log(`${getPlace().name}로 탐색했다. 3초 소요. 감염자와 마주쳐 ${activePlayer().name} 체력 ${damage} 피해.`);
  } else {
    log(`${getPlace().name}로 탐색했다. 3초 소요.`);
  }
  checkEndings();
  render();
}

function attack() {
  if (!spend(1)) return;
  const player = activePlayer();
  const upgraded = meta.upgrades[player.jobId];
  const hasSpear = state.inventory.spear > 0;
  const hasThrowingStone = (state.inventory.throwingStone || 0) > 0;
  const weaponSeconds = hasSpear ? 2 : 4;
  const silverBonus = upgraded.includes("은탄") ? 4 : 0;
  const boostBonus = player.boosted ? 8 : 0;
  if (player.boosted) { player.boosted = false; }
  const longClawBonus = (player.jobId === "beast" && upgraded.includes("긴 손톱")) ? Math.floor(player.attack * 0.5) : 0;
  const throwingBonus = hasThrowingStone ? 3 : 0;
  if (hasThrowingStone) state.inventory.throwingStone -= 1;
  const damage = player.attack + state.resources.weapon * 4 + (hasSpear ? 5 : 0) + silverBonus + boostBonus + longClawBonus;
  const baseRepair = Math.min(10, Math.floor(damage / 4));
  state.base = Math.min(8, state.base + Math.ceil((baseRepair + throwingBonus) / 6));
  // 짐승인간 — 좀비 먹기 (체력 +5, 갈망 충족)
  if (player.jobId === "beast") {
    player.beastAteThisTurn = true;
    player.beastSkipTurnCount = 0;
    player.hp = Math.min(player.maxHp, player.hp + 5);
    log(`${player.name}이 좀비를 처치하고 먹었다. 체력 5 회복. 갈망 충족.`);
  }
  const throwNote = hasThrowingStone ? " 투척용 석 사용." : "";
  log(`${player.name}이 ${zombieProfile().name}를 공격했다. 피해 ${damage}. 기지 압박 완화.${throwNote}`);
  render();
}

function beastRoar() {
  const player = activePlayer();
  if (player.jobId !== "beast") { log("포효는 짐증인간 전용이다."); return; }
  const upgraded = meta.upgrades.beast;
  if (!upgraded.includes("포효")) { log("포효 능력이 없다. 3티어를 강화해야 한다."); return; }
  if (player.beastRoarCooldown > 0) { log(`포효 쿨타임: ${player.beastRoarCooldown}턴 남음.`); return; }
  if (!spend(1)) return;
  state.beastRoarActive = true;
  player.beastRoarCooldown = 3;
  log("포효! 이번 밤 웨이브 피해 50% 감소. 쿨타임 3턴.");
  render();
}

function beastTear() {
  const player = activePlayer();
  if (player.jobId !== "beast") { log("찢기는 짐증인간 전용이다."); return; }
  const upgraded = meta.upgrades.beast;
  if (!upgraded.includes("찢기")) { log("찢기 능력이 없다. 4티어를 강화해야 한다."); return; }
  const damage = 50;
  const baseRepair = Math.min(4, Math.floor(damage / 10));
  state.base = Math.min(8, state.base + baseRepair);
  log(`${player.name}이 행동 소모 없이 좀비를 찢었다. 피해 50. (먹기 아님)`);
  render();
}

function craft() {
  if (!spend(1, "craft")) return;
  if (!state.researchedCraft) {
    log("제작법을 아직 모른다. 먼저 연구가 필요하다. 제작은 3초가 소요된다.");
    render();
    return;
  }
  // requiresTool 지원: 도구가 있어야 하는 레시피는 해당 도구가 있을 때만 매칭
  const recipe = recipes.find((candidate) => {
    if (!hasInventory(candidate.input)) return false;
    if (candidate.requiresTool && !(state.inventory[candidate.requiresTool] > 0)) return false;
    return true;
  });
  if (recipe && applyInventoryRecipe(recipe)) {
    if (recipe.output.spear) state.resources.weapon += 1;
    if (recipe.output.barricade) {
      state.base = Math.min(8, state.base + 1);
      log("바리케이드 설치! 기지 압박이 1 줄었다.");
    }
    if (recipe.output.smelter) {
      log("제련기 건설 완료! smelt 버튼으로 광석을 주괴로 변환할 수 있다.");
    }
    log(`${itemList(recipe.input)}로 ${itemList(recipe.output)} 제작. 제작 시간 3초.`);
  } else if (state.resources.scrap >= 3) {
    state.resources.scrap -= 3;
    state.resources.weapon += 1;
    log("고철 3개로 강화 무기를 제작했다. 제작 시간 3초.");
  } else if (state.resources.food >= 2 && state.resources.water >= 2) {
    state.resources.food -= 2;
    state.resources.water -= 2;
    state.resources.meds += 1;
    log("식량과 물을 배합해 응급 의약품을 만들었다. 제작 시간 3초.");
  } else {
    log("제작 재료가 부족하다.");
  }
  checkAchievements();
  checkEndings();
  render();
}

// 제련기 전용 — 광석을 주괴로 변환
function smelt(oreType) {
  if (!spend(1, "craft")) return;
  if ((state.inventory.smelter || 0) < 1) {
    log("제련기가 없다. 먼저 석재 30개로 제련기를 만들어야 한다.");
    return;
  }
  const recipes_smelt = {
    beryllium: { output: "alloy", outputQty: 1, inputQty: 2, name: "합금" },
    ironOre:   { output: "ironIngot", outputQty: 1, inputQty: 2, name: "철주괴" },
    goldOre:   { output: "goldIngot", outputQty: 1, inputQty: 2, name: "금주괴" },
  };
  const sr = recipes_smelt[oreType];
  if (!sr) { log("알 수 없는 광석 종류."); return; }
  if ((state.inventory[oreType] || 0) < sr.inputQty) {
    log(`${inventoryLabels[oreType] || oreType}이 ${sr.inputQty}개 필요하다.`);
    return;
  }
  state.inventory[oreType] -= sr.inputQty;
  state.inventory[sr.output] = (state.inventory[sr.output] || 0) + sr.outputQty;
  log(`제련 완료: ${sr.name} ${sr.outputQty}개 획득.`);
  render();
}

// 상인 전용 — 물품 판매 (아이템 → 상인 가방 코인)
function merchantSell(itemKey, qty = 1) {
  const player = activePlayer();
  if (player.jobId !== "merchant") {
    log("판매는 상인 전용 기술이다.");
    return;
  }
  if (!spend(1, "craft")) return;
  if ((state.inventory[itemKey] || 0) < qty) {
    log(`${inventoryLabels[itemKey] || itemKey}이 부족하다.`);
    return;
  }
  // 잡화 상인 티어 — 판매 코인 2배
  const upgraded = meta.upgrades.merchant || [];
  const coinMult = upgraded.includes("잡화 상인") ? 2 : 1;
  const sellPrices = {
    wood: 1, stone: 1, soil: 1, scrap: 2,
    ironOre: 3, goldOre: 5, beryllium: 4, diamond: 10,
    alloy: 8, ironIngot: 6, goldIngot: 9,
    food: 2, water: 2,
  };
  const price = (sellPrices[itemKey] || 1) * coinMult;
  state.inventory[itemKey] -= qty;
  player.merchantCoins = (player.merchantCoins || 0) + price * qty;
  log(`${qty}개 판매 → 상인 가방 +${price * qty} 코인 (총 ${player.merchantCoins})`);
  render();
}

// 상인 전용 — 코인으로 자원 구매 ("돈은 곧 힘이다" 티어 필요)
function merchantBuy(itemKey, qty = 1) {
  const player = activePlayer();
  if (player.jobId !== "merchant") {
    log("구매는 상인 전용 기술이다.");
    return;
  }
  const upgraded = meta.upgrades.merchant || [];
  if (!upgraded.includes("돈은 곧 힘이다")) {
    log("'돈은 곧 힘이다' 티어가 필요하다.");
    return;
  }
  if (!spend(1, "craft")) return;
  const buyPrices = {
    food: 3, water: 3, wood: 2, stone: 2,
    ironOre: 6, goldOre: 10, beryllium: 8, diamond: 20,
    fertilizer: 5, carrotSeed: 4,
  };
  const price = buyPrices[itemKey] || 5;
  const total = price * qty;
  if ((player.merchantCoins || 0) < total) {
    log(`코인이 부족하다. 필요: ${total}, 보유: ${player.merchantCoins}`);
    return;
  }
  player.merchantCoins -= total;
  state.inventory[itemKey] = (state.inventory[itemKey] || 0) + qty;
  log(`구매 완료: ${inventoryLabels[itemKey] || itemKey} ${qty}개 (-${total} 코인). 잔액: ${player.merchantCoins}`);
  render();
}

function heal() {
  if (!spend(2)) return;
  const healer = activePlayer();
  const upgraded = meta.upgrades[healer.jobId];
  const target = mostInjuredPlayer();
  const baseHeal = healer.jobId === "doctor" ? 15 : 5;
  const bonus = upgraded.includes("박애") ? 5 : 0;
  const medBonus = state.resources.meds > 0 ? 10 : 0;
  if (state.resources.meds > 0) state.resources.meds -= 1;
  target.hp = Math.min(target.maxHp, target.hp + baseHeal + bonus + medBonus);
  if (upgraded.includes("진정")) target.hp = Math.min(target.maxHp, target.hp + 3);
  if (upgraded.includes("검진")) log("검진 효과로 다음 탐험의 사망률이 낮아진다.");
  if (upgraded.includes("강화제")) { target.boosted = true; log(`강화제 효과로 ${target.name}의 다음 공격력이 8 증가한다.`); }
  log(`${healer.name}이 ${target.name}을 치료했다. 3초 소요, 회복량 ${baseHeal + bonus + medBonus}.`);
  render();
}

function mostInjuredPlayer() {
  return state.players.reduce((target, player) => {
    const targetMissing = target.maxHp - target.hp;
    const playerMissing = player.maxHp - player.hp;
    return playerMissing > targetMissing ? player : target;
  }, state.players[0]);
}

function research() {
  if (!spend(1, "research")) return;
  if (!state.researchedCraft) {
    state.researchedCraft = true;
    log("기본 제작법을 깨달았다. 제작표의 도구와 응급 의약품을 제작할 수 있다.");
  } else if (state.moonPlan && state.resources.scrap >= 6 && state.resources.data >= 3) {
    showEnding("도주 엔딩", "지구는 가망이 없다. 우리라도 달에서 행복하게...");
    return;
  } else if (state.resources.data >= 2 && state.resources.meds >= 1) {
    state.resources.data -= 2;
    state.resources.meds -= 1;
    state.vaccine = Math.min(100, state.vaccine + 25);
    log(`죠나바이러스 백신 연구가 진척되었다. 현재 ${state.vaccine}%.`);
  } else {
    log("백신 연구에는 데이터 2개와 의약품 1개가 필요하다.");
  }
  checkEndings();
  render();
}

function investigate() {
  if (!spend(1)) return;
  const place = state.location;
  if (place === "lab") {
    addNextClue(["lab1", "lab2", "lab3"]);
    addResource("data", 1);
  } else if (place === "hospital") {
    addNextClue(["hospital1"]);
    state.justice = Math.min(10, state.justice + 3);
  } else if (place === "shop") {
    addNextClue(["shop1"]);
    state.moonPlan = true;
  } else if (place === "forest") {
    addNextClue(["forest1"]);
  }
  triggerBuildingEvent();
  log("조사 시간 3초 소요.");
  checkAchievements();
  checkEndings();
  render();
}

function triggerBuildingEvent() {
  const events = eventTables[state.location] || [];
  if (events.length === 0) return;
  const event = events[Math.floor(Math.random() * events.length)];
  event.effect();
  log(event.text);
}

function addNextClue(ids) {
  const id = ids.find((candidate) => !state.clues.has(candidate));
  if (!id) {
    log("이미 이 장소의 핵심 단서는 모두 확보했다.");
    return;
  }
  state.clues.add(id);
  log(`중요 단서를 확보했다: ${clueTexts[id]}`);
}

function expedition() {
  const cost = activePlayer().jobId === "hunter" && meta.upgrades.hunter.includes("추적") ? 3 : 4;
  if (!spend(cost)) return;
  const player = activePlayer();
  const place = getPlace();
  let deathRisk = place.threat * 4 + state.wave * 2 - player.armor;
  if (player.jobId === "hunter") deathRisk -= 10;
  if (meta.upgrades[player.jobId].includes("항체 보유자")) deathRisk -= 10;
  if (meta.upgrades.doctor.includes("검진")) deathRisk -= 4;
  if (state.resources.weapon > 0) deathRisk -= 6;

  const roll = Math.floor(Math.random() * 100);
  if (roll < deathRisk) {
    const damage = Math.max(12, deathRisk);
    player.hp -= damage;
    log(`탐험 중 습격을 받았다. 사망률 판정 실패, ${player.name} 체력 ${damage} 피해.`);
  } else {
    const foodGain = player.jobId === "hunter" ? 4 : 2;
    const waterGain = player.jobId === "citizen" ? 3 : 2;
    addResource("food", foodGain);
    addResource("water", waterGain);
    addResource("scrap", ["city", "construction"].includes(place.id) ? 3 : 1);
    log(`탐험 성공. 3초 소요. 식량 ${foodGain}, 물 ${waterGain}, 고철을 확보했다.`);
    if (player.jobId === "hunter") log("사냥꾼의 유능 효과로 동물 자원 보상을 안정적으로 확보했다.");
    if (!state.forestUnlocked && ["city", "mart", "shop"].includes(place.id)) {
      state.forestUnlocked = true;
      log("탐험 중 숲으로 이어지는 숨겨진 길을 찾았다. 숲 지역이 열렸다.");
    }
  }
  triggerBuildingEvent();
  checkEndings();
  render();
}

function interact() {
  if (!spend(1)) return;
  const player = activePlayer();
  const place = getPlace();
  const upgraded = meta.upgrades[player.jobId] || [];
  const farmerMult = player.jobId === "farmer" ? 2 : 1;

  if (place.id === "forest") {
    const woodAmt = 3 * farmerMult;
    const webAmt = 1 * farmerMult;
    addInventory("wood", woodAmt);
    addInventory("web", webAmt);
    if (player.jobId === "farmer" && upgraded.includes("비료")) {
      addInventory("soil", 1);
      log(`숲 수확 (농부 비료 보너스): 나무 ${woodAmt}, 거미줄 ${webAmt}, 흙 1.`);
    } else {
      log(`숲에서 나무 ${woodAmt}개와 거미줄 ${webAmt}개를 수확했다.`);
    }
  } else if (place.id === "construction" || place.id === "city") {
    const stoneAmt = 1 * farmerMult;
    addInventory("stone", stoneAmt);
    addInventory("soil", 2);
    addResource("scrap", 1);
    // 곡괭이 채광 — 광석 추가 드랍
    if ((state.inventory.pickaxe || 0) > 0) {
      const roll = Math.random();
      let ore, oreName;
      if (roll < 0.05)       { ore = "diamond";   oreName = "다이아몬드"; }
      else if (roll < 0.25)  { ore = "goldOre";   oreName = "금광석"; }
      else if (roll < 0.50)  { ore = "ironOre";   oreName = "철광석"; }
      else                   { ore = "beryllium"; oreName = "베릴륨"; }
      addInventory(ore, 1);
      log(`잔해 탐색 (곡괭이): 돌 ${stoneAmt}, 흙 2, 고철 1, ${oreName} 1 획득!`);
    } else {
      log(`잔해를 뒤져 돌 ${stoneAmt}개, 흙 2개, 고철 1개를 확보했다.`);
    }
  } else if (place.id === "mart") {
    const foodAmt = 1 * farmerMult;
    const waterAmt = 1 * farmerMult;
    addResource("food", foodAmt);
    addResource("water", waterAmt);
    log(`마트 진열대에서 식량 ${foodAmt}개와 물 ${waterAmt}개를 확보했다.`);
  } else if (place.id === "lab") {
    if ((state.inventory.energyCell || 0) > 0) {
      addInventory("energyCell", -1);
      if (!state.cluesFound) state.cluesFound = [];
      const clue2f = Math.random() < 0.5 ? "lab2f_journal" : "lab2f_torn";
      if (!state.cluesFound.includes(clue2f)) {
        state.cluesFound.push(clue2f);
        log(`에너지 전지로 엘리베이터 작동 — 연구소 2층 진입! 단서: [${clueTexts[clue2f]}]`);
      } else {
        log("이미 발견한 단서다. 에너지 전지 1개 소모.");
      }
    } else {
      log("연구소 엘리베이터가 잠겨있다. 에너지 전지가 필요하다.");
    }
  } else {
    addInventory("wood", 1);
    log("주변 자재를 정리해 나무 1개를 확보했다.");
  }
  checkEndings();
  render();
}

function endTurn() {
  if (state.ended) return;
  if (!state.started) {
    log("작전 시작 전에는 턴을 종료할 수 없다.");
    return;
  }
  if (state.phase === "discussion") {
    skipDiscussion();
    return;
  }
  if (state.mode === "team") {
    let nextIndex = state.currentPlayer + 1;
    while (nextIndex < state.players.length && state.players[nextIndex].hp <= 0) nextIndex += 1;
    if (nextIndex < state.players.length) {
      state.currentPlayer = nextIndex;
      log(`${activePlayer().name} ${activeJob().name}의 차례가 되었다.`);
      render();
      return;
    }
  }

  const livingPlayers = state.players.filter((player) => player.hp > 0).length;
  const requiredFood = Math.max(1, livingPlayers);
  const requiredWater = Math.max(1, livingPlayers);
  const enoughSupplies = state.resources.food >= requiredFood && state.resources.water >= requiredWater;
  state.resources.food = Math.max(0, state.resources.food - requiredFood);
  state.resources.water = Math.max(0, state.resources.water - requiredWater);
  if (!enoughSupplies) {
    state.players.forEach((player) => { player.hp -= 12; });
    log("식량 또는 물이 부족해 모든 생존자의 체력이 12 감소했다.");
  } else {
    state.thirst = Math.min(100, state.thirst + 40);
    state.hunger = Math.min(100, state.hunger + 30);
    log("저녁 식량과 물을 나눠 먹고 탈수와 배고픔을 회복했다.");
  }

  const zombie = zombieProfile();
  const teamArmor = Math.max(...state.players.map((player) => player.armor));
  if (state.day >= 2) {
    const isBossWave = state.wave > 0 && state.wave % 5 === 0;
    let pressure = Math.max(1, Math.ceil((zombie.pressure - teamArmor - state.resources.weapon * 3) / 6));
    state.base -= pressure;
    log(`밤의 ${zombie.summary} 웨이브가 기지를 덮쳤다. 기지 체력 ${pressure} 감소.`);
    if (isBossWave) {
      const bossPressure = Math.max(2, Math.ceil((zombieTypes.bossZombie.attack - teamArmor) / 4));
      state.base -= bossPressure;
      log(`⚠️ ${state.wave}웨이브 보스 감염체가 기지를 강타했다! 기지 체력 ${bossPressure} 추가 감소.`);
      triggerBaseHitEffect();
    }
    triggerBaseHitEffect();
    state.wave += 1;
  } else {
    log("1일차 밤은 정찰 단계다. 좀비 웨이브는 2일차부터 시작된다.");
  }
  const hasMentalBonus = state.players.some(p => p.jobId === "soldier" && meta.upgrades.soldier.includes("정신력"));
  // 포효 효과 초기화
  if (state.beastRoarActive) { state.beastRoarActive = false; }

  state.players.forEach((player) => {
    // 밤 좀비 피해
    if (zombie.name.includes("육상") && player.hp > 0) {
      let personalDmg = hasMentalBonus ? Math.max(1, Math.floor(zombie.damage * 0.6)) : zombie.damage;
      // 짐승인간 포효 중이면 피해 50% 감소
      if (player.jobId === "beast" && state.beastRoarActive) personalDmg = Math.max(1, Math.floor(personalDmg * 0.5));
      player.hp -= personalDmg;
      if (hasMentalBonus) log(`정신력 효과로 ${player.name}의 피해가 경감되었다.`);
    }
    player.actions = actionLimit(player.jobId);

    // ── 짐승인간 — 먹기 체크 ──────────────────────────────────────────
    if (player.jobId === "beast" && player.hp > 0) {
      if (!player.beastAteThisTurn) {
        player.beastSkipTurnCount = (player.beastSkipTurnCount || 0) + 1;
        if (player.beastSkipTurnCount >= 2) {
          // 2턴 연속 못 먹으면 사망
          player.hp = 0;
          log(`⚠️ ${player.name}(짐승인간)이 너무 오래 먹지 못해 굶주림으로 쓰러졌다!`);
        } else {
          log(`⚠️ ${player.name}(짐승인간)이 이 턴에 먹지 않았다. 다음 턴에는 반드시 좀비를 처치하고 먹어야 한다!`);
        }
      } else {
        player.beastSkipTurnCount = 0;
      }
      player.beastAteThisTurn = false;
      // 포효 쿨타임 감소
      if (player.beastRoarCooldown > 0) player.beastRoarCooldown -= 1;
    }

    // ── 농부 — 풍년 티어: 10턴마다 당근 씨앗 획득 ────────────────────
    if (player.jobId === "farmer" && player.hp > 0) {
      const upgraded = meta.upgrades.farmer || [];
      player.farmerTurnCounter = (player.farmerTurnCounter || 0) + 1;
      if (upgraded.includes("풍년") && player.farmerTurnCounter % 10 === 0) {
        state.inventory.carrotSeed = (state.inventory.carrotSeed || 0) + 1;
        log(`${player.name}(농부 풍년): 당근 씨앗 1개 획득!`);
      }
      // 대혁명 티어: 3턴마다 공격력 +1
      if (upgraded.includes("대혁명") && player.farmerTurnCounter % 3 === 0) {
        player.attack += 1;
        player.farmerAttackBonus = (player.farmerAttackBonus || 0) + 1;
        log(`${player.name}(농부 대혁명): 공격력 +1 (총 ${player.attack})`);
      }
    }

    // ── 상인 — 종묘상 티어: 턴마다 씨앗 1코인 ──────────────────────
    if (player.jobId === "merchant" && player.hp > 0) {
      const upgraded = meta.upgrades.merchant || [];
      if (upgraded.includes("종묘상")) {
        player.merchantCoins = (player.merchantCoins || 0) + 1;
      }
      if (upgraded.includes("식료품 상인") && state.day % 3 === 0) {
        state.inventory.food = (state.inventory.food || 0) + 1;
        log(`${player.name}(상인 식료품): 식량 1 보급.`);
      }
    }
  });
  state.day += 1;
  state.phase = "discussion";
  state.discussionLeft = 90;
  state.currentPlayer = Math.max(0, state.players.findIndex((player) => player.hp > 0));
  log(`${state.day}일차 오전 7시 토의가 시작되었다.`);
  checkAchievements();
  checkEndings();
  render();
  startDiscussionTimer();
}

function skipDiscussion() {
  if (state.phase !== "discussion") return;
  stopDiscussionTimer();
  state.phase = "game";
  log("모든 플레이어가 토의를 건너뛰었다. 오전 9시 작전을 시작한다.");
  render();
  triggerMapEntry();
}

function checkEndings() {
  if (state.ended) return;
  const everyoneDead = state.players.every((player) => player.hp <= 0);
  if (everyoneDead || state.base <= 0) {
    showEnding("죽음 엔딩", "결국 우리(나)는 여기서 최후를 맞이하는구나... 잘있어 세상아...");
    return;
  }
  if (state.vaccine >= 100 && state.justice >= 8 && state.clues.has("lab3") && state.clues.has("hospital1")) {
    showEnding("해피 엔딩", "다시 원래의 세계로 돌아왔다. 우리와 데드저스티스는 영웅이 되었다. 이제는 영웅을 즐기는 것이 전부이다.");
    return;
  }
  if (state.vaccine >= 100) {
    showEnding("백신 엔딩", "이제 모든 사람을 치료했다. 하지만 엔터톤사이언스가 아직 남아있다. 우리는 이제 대비해야 할 때이다.");
    return;
  }
  if (state.justice >= 8 && state.clues.has("hospital1") && state.clues.has("lab1")) {
    showEnding("협력 엔딩", "드디어 엔터톤사이언스가 없어졌다. 근데 이제는 어떻게 살아야하지?");
    return;
  }
  if (state.base >= 8 && state.resources.food >= 24 && state.resources.water >= 24 && state.resources.weapon >= 4) {
    showEnding("최강의 기지 엔딩", "우리(혹은 나)는 이 세상에 한줄기의 빛을 만들었다. 이것이 계속되었으면 좋겠다.");
  }
}

function checkAchievements() {
  achievements.forEach((achievement) => {
    if (!meta.achievements.has(achievement.id) && achievement.test()) {
      meta.achievements.add(achievement.id);
      log(`업적 달성: ${achievement.name}`);
    }
  });
}

function showEnding(title, body) {
  state.ended = true;
  meta.best.day = Math.max(meta.best.day, state.day);
  meta.best.wave = Math.max(meta.best.wave, state.wave);
  saveMeta();
  stopDiscussionTimer();
  els.endingTitle.textContent = title;
  els.endingBody.textContent = body;
  openDialog(els.endingDialog);
  render();
}

function setLobbyPanel(kind) {
  const content = {
    mail: ["우편함", "출석 보상, 이벤트 보상, 점검 보상을 받는 곳."],
    friends: ["친구", "친구와 대화하고 팀 플레이를 시작하는 곳. 현재 초안은 로컬 핫시트로 대체."],
    settings: ["설정", "사운드, 계정 전환, 언어, 도움말, 문의, 계정 삭제 메뉴가 들어갈 위치."],
    report: ["신고", "비정상 플레이, 버그, 불편 사항을 신고하는 곳."],
    shop: ["상점", "코인, 보석, 유물, 직업 카드, 광고 제거 상품을 구매하는 곳."],
  }[kind];
  els.lobbyPanel.innerHTML = `<article><strong>${content[0]}</strong><p>${content[1]}</p></article>`;
}

function triggerBaseHitEffect() {
  const app = document.querySelector(".app");
  if (!app) return;
  app.classList.remove("base-hit");
  void app.offsetWidth; // reflow to restart animation
  app.classList.add("base-hit");
  setTimeout(() => app.classList.remove("base-hit"), 600);
}

function log(message) {
  const item = document.createElement("li");
  item.textContent = message;
  els.log.prepend(item);
  if (state.started && state.phase !== "lobby") showResultToast(message);
}

let audioContext;
let musicNodes = [];

function toggleMusic() {
  if (musicNodes.length > 0) {
    musicNodes.forEach((node) => node.stop?.());
    musicNodes = [];
    els.musicToggle.classList.remove("active");
    els.musicToggle.innerHTML = `<span class="menu-icon">♪</span>음악`;
    return;
  }
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) {
    showReward("!", "이 브라우저는 배경음악을 지원하지 않는다.");
    return;
  }
  audioContext = audioContext || new AudioCtor();
  const gain = audioContext.createGain();
  gain.gain.value = 0.035;
  gain.connect(audioContext.destination);
  [55, 82.41, 110].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    oscillator.start();
    musicNodes.push(oscillator);
  });
  els.musicToggle.classList.add("active");
  els.musicToggle.innerHTML = `<span class="menu-icon">♪</span>켜짐`;
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "move") {
      showActionFeedback("move");
      log("지도에서 이동할 장소를 선택하면 탐색 행동이 실행된다.");
      return;
    }
    if (action === "attack") runAction(action, attack);
    if (action === "craft") runAction(action, craft);
    if (action === "heal") runAction(action, heal);
    if (action === "research") runAction(action, research);
    if (action === "investigate") runAction(action, investigate);
    if (action === "interact") runAction(action, interact);
  if (action === "smelt_beryllium") smelt("beryllium");
  if (action === "smelt_iron") smelt("ironOre");
  if (action === "smelt_gold") smelt("goldOre");
  if (action === "beast_roar") beastRoar();
  if (action === "beast_tear") beastTear();
  if (action === "merchant_sell_stone") merchantSell("stone", 5);
  if (action === "merchant_sell_iron") merchantSell("ironOre", 1);
  if (action === "merchant_buy_food") merchantBuy("food", 2);
  if (action === "merchant_buy_water") merchantBuy("water", 2);
    if (action === "expedition") runAction(action, expedition);
  });
});

document.querySelectorAll("[data-lobby]").forEach((button) => {
  button.addEventListener("click", () => setLobbyPanel(button.dataset.lobby));
});

document.querySelectorAll("[data-screen]").forEach((button) => {
  button.addEventListener("click", () => setScreen(button.dataset.screen));
});

document.querySelectorAll("[data-shop-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    state.shopTab = button.dataset.shopTab;
    renderShop();
  });
});

document.querySelectorAll("[data-relic-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.relicFilter = button.dataset.relicFilter;
    renderRelics();
  });
});

els.enterLobby.addEventListener("click", enterLobby);
els.openPrep.addEventListener("click", () => setScreen("prep"));
els.startGame.addEventListener("click", launchOperation);
els.job.addEventListener("change", updatePrepConfig);
els.mode.addEventListener("change", updatePrepConfig);
els.teamSize.addEventListener("change", updatePrepConfig);
els.difficulty.addEventListener("change", updatePrepConfig);
els.endTurn.addEventListener("click", endTurn);
els.mobileEndTurn.addEventListener("click", endTurn);
els.skipDiscussion.addEventListener("click", skipDiscussion);
function openInventoryDialog() {
  renderInventoryFull();
  openDialog(els.inventoryDialog);
}
els.openInventory.addEventListener("click", openInventoryDialog);
els.mobileInventory.addEventListener("click", openInventoryDialog);
els.inventoryClose.addEventListener("click", () => {
  closeDialog(els.inventoryDialog);
});
els.musicToggle.addEventListener("click", toggleMusic);
els.adReset.addEventListener("click", () => {
  resetDailyShopIfNeeded();
  if (meta.adResetUses >= 2) {
    showReward("!", "광고 초기화는 12시간마다 2회만 사용할 수 있다.");
    render();
    return;
  }
  meta.adResetUses += 1;
  meta.gems += 30;
  showReward("◇", "광고 초기화 보상: 보석 30");
  render();
});
els.coinReset.addEventListener("click", () => {
  resetDailyShopIfNeeded();
  if (meta.coinResetUses >= 3) {
    showReward("!", "일일 상품 초기화는 12시간마다 3회만 사용할 수 있다.");
    render();
    return;
  }
  if (meta.coins < 1000) {
    showReward("!", "코인이 부족하다.");
    return;
  }
  meta.coins -= 1000;
  meta.coinResetUses += 1;
  meta.freeGemClaims = 0;
  state.shopTab = "daily";
  showReward("↻", "일일 상품을 초기화했다.");
  render();
});
els.restart.addEventListener("click", () => {
  closeDialog(els.endingDialog);
  resetGame(false);
});
els.rewardClose.addEventListener("click", () => {
  closeDialog(els.rewardDialog);
});

els.bootStatus.textContent = "JS 실행됨: 버튼 동작 가능";
els.bootStatus.classList.add("ready");
window.setInterval(() => {
  if (!els.shopScreen.hidden) updateShopTimer();
}, 1000);
loadMeta();
setLobbyPanel("mail");
resetGame(false);
setScreen("combat");
