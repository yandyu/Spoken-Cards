// Topic 11 · Marriage 婚姻
// 语块来自书中要点聚焦与高频加粗表达；中文提示采用结构对齐式自然直译
window.SEED_DECKS = window.SEED_DECKS || [];
window.SEED_DECKS.push({ topic: 11, cards: [
  { scene: "求婚", prompt: "你愿意和我结婚吗？", chunk: "Will you marry me?", note: "求婚时最直接、自然的问法；marry 后直接接人，不加 with。", example: "He held out the ring and asked, 'Will you marry me?'" },
  { scene: "求婚动作", prompt: "单膝跪下", chunk: "get down on one knee", note: "常用来描述传统求婚动作；one knee 前不用物主代词。", example: "He got down on one knee in the middle of the restaurant." },
  { scene: "婚姻类型", prompt: "包办婚姻", chunk: "an arranged marriage", note: "指婚姻对象主要由家人安排；arranged 在这里作形容词。", example: "Her grandparents had an arranged marriage but grew very close." },
  { scene: "谈结婚", prompt: "我们想结婚。", chunk: "We want to get married.", note: "get married 强调结婚这个动作；be married 强调已婚状态。", example: "We want to get married next spring." },
  { scene: "婚礼角色", prompt: "伴郎", chunk: "the best man", note: "通常指新郎指定的主要男伴郎；不能直译成 the best person。", example: "My brother has agreed to be my best man." },
  { scene: "婚礼角色", prompt: "伴娘", chunk: "a bridesmaid", note: "指婚礼中陪伴新娘的女性；主要伴娘也可称 maid of honour。", example: "She was a bridesmaid at her cousin's wedding." },
  { scene: "婚前活动 · 新郎", prompt: "新郎的单身告别夜", chunk: "a stag night", note: "英式英语，指新郎婚前与朋友聚会的夜晚；美式常说 bachelor party。", example: "They're organising a quiet stag night in Manchester." },
  { scene: "婚前活动 · 新娘", prompt: "新娘的单身告别夜", chunk: "a hen night", note: "英式英语，指新娘婚前与朋友聚会的夜晚；美式常说 bachelorette party。", example: "Her hen night is the weekend before the wedding." },
  { scene: "婚后旅行", prompt: "去度蜜月", chunk: "go on a honeymoon", note: "表示去度蜜月；谈目的地也常说 go to Italy on our honeymoon。", example: "They're going on a honeymoon after the ceremony." },
  { scene: "纪念日", prompt: "结婚纪念日", chunk: "a wedding anniversary", note: "表示结婚周年纪念日；anniversary 本身已含周年之意。", example: "We always cook dinner together on our wedding anniversary." },
  { scene: "借宿", prompt: "他们让我睡在客房里。", chunk: "They let me crash in the spare room.", note: "crash 非正式表示临时在某处过夜；正式场合用 stay 或 sleep。", example: "My train was cancelled, so Ben let me crash in the spare room." },
  { scene: "累得睡着", prompt: "我昨晚很早就倒头睡了。", chunk: "I crashed out really early last night.", note: "crash out 非正式表示因疲惫而很快睡着。", example: "After the flight, I crashed out really early last night." },
  { scene: "活动满员", prompt: "婚礼现场座无虚席。", chunk: "The wedding was a full house.", note: "a full house 表示剧院、活动或场地满座；通常使用单数。", example: "The final performance was a full house." },
  { scene: "赞美外表", prompt: "她穿着那条裙子美极了。", chunk: "She looked stunning in that dress.", note: "stunning 表示非常漂亮、令人惊艳，语气比 beautiful 更强。", example: "You looked stunning in that blue dress." },
  { scene: "盛装打扮", prompt: "他打扮得整整齐齐。", chunk: "He was all spruced up.", note: "spruce up 表示把自己或某处收拾得整洁漂亮，语气非正式。", example: "Everyone was all spruced up for the awards dinner." },
  { scene: "非正式说结婚", prompt: "他们终于结婚了。", chunk: "They finally tied the knot.", note: "tie the knot 是非正式习语，表示结婚。", example: "After ten years together, they finally tied the knot." },
  { scene: "活动持续", prompt: "我们一直庆祝到凌晨。", chunk: "We celebrated into the early hours.", note: "the early hours 指午夜到黎明之间的凌晨时段。", example: "We talked into the early hours without noticing the time." },
  { scene: "失去意识", prompt: "他昏过去了。", chunk: "He passed out.", note: "pass out 可表示昏倒或因酒精失去意识；也可表示分发，需结合语境。", example: "The room was so hot that one guest passed out." },
  { scene: "无法理解", prompt: "她是怎么做到的，我完全不明白。", chunk: "How she did it is beyond me.", note: "be beyond sb 表示超出某人的理解能力。", example: "Why he turned down that offer is beyond me." },
  { scene: "限定话题", prompt: "说到婚姻……", chunk: "When it comes to marriage, …", note: "when it comes to 用于限定接下来讨论的方面，to 后接名词或动名词。", example: "When it comes to marriage, honest communication matters." },
  { scene: "签署协议", prompt: "在虚线上签字", chunk: "sign on the dotted line", note: "既可按字面表示在虚线上签字，也可引申为正式同意一项安排。", example: "Read the full contract before you sign on the dotted line." },
  { scene: "明确知道", prompt: "我非常清楚这会很难。", chunk: "I know full well that it will be difficult.", note: "know full well 表示完全知道、非常清楚，常带有明知如此的意味。", example: "She knows full well that the deadline cannot be moved." },
  { scene: "维持运转", prompt: "让婚姻顺利维持下去", chunk: "keep a marriage ticking over", note: "tick over 原指机器平稳运转，这里比喻让关系持续正常发展。", example: "Small acts of kindness help keep a relationship ticking over." },
  { scene: "作用很大", prompt: "这会大有帮助。", chunk: "That goes a long way.", note: "go a long way 表示对实现某个结果非常有帮助。", example: "A sincere apology goes a long way after an argument." },
  { scene: "强调距离的益处", prompt: "小别胜新婚。", chunk: "Absence makes the heart grow fonder.", note: "谚语，表示暂时分开可能让感情更深；中文采用对应的常用说法。", example: "A little time apart can help - absence makes the heart grow fonder." }
] });
