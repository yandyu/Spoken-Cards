#!/usr/bin/env node

/*
 * One-off content refresh for the built-in deck.
 * The key is the original chunk, so card ids and topic/order stay unchanged.
 */
const fs = require("fs");
const path = require("path");

const replacements = [
  [6, "It can have a knock-on effect on your routine.", "这会把你的日常节奏也打乱。", "It can throw off your routine.", "throw off your routine = 打乱日常节奏；比 knock-on effect 更像日常对话。", "If I stay up too late, it can throw off my routine the next day."],
  [6, "creating a self-fulfilling prophecy", "如果你一直觉得自己做不到，最后反而可能真的做不到。", "It can turn into a self-fulfilling prophecy.", "self-fulfilling prophecy = 自我应验的预言；这里用完整句，方便放进真实回答。", "If you keep telling yourself you can't do it, it can turn into a self-fulfilling prophecy."],
  [12, "In this day and age, …", "说到现在这个时代，人们对婚姻的看法已经变了。", "These days, people see marriage differently.", "these days 是更自然的日常说法；不要只背一个没有主句的开头。", "These days, people see marriage differently, and couples have more choices."],
  [30, "Lack of sleep creates a domino effect.", "睡眠不足会让一连串问题接着发生。", "Lack of sleep can set off a chain reaction.", "set off a chain reaction = 引发一连串连锁反应；口语里比 domino effect 更常见。", "Lack of sleep can set off a chain reaction: you feel tired, impatient and unfocused."],
  [34, "On the whole, the facilities are good.", "总体来说，这里的设施还挺不错。", "Overall, the facilities are pretty good.", "overall / pretty good 是更自然的口语总结方式。", "Overall, the facilities are pretty good, especially for families."],
  [46, "People are leaving the country in droves.", "越来越多人正在离开这个国家。", "People are leaving the country in huge numbers.", "in huge numbers 比 in droves 更容易理解，也更适合主动运用。", "People are leaving the country in huge numbers because they can't find decent jobs."],
  [48, "The job requires skilled manual workers.", "这份工作需要有实际操作经验的人。", "The job calls for people with solid hands-on skills.", "hands-on skills = 实操能力；calls for 比 requires 更像口语。", "The job calls for people with solid hands-on skills, not just a degree."],
  [51, "Helping others changes your perspective on the world forever.", "帮助别人真的会改变你看世界的方式。", "Helping other people can really change the way you see the world.", "把抽象的 perspective 改成日常会说的 the way you see the world。", "Helping other people can really change the way you see the world."],
  [52, "Who walks around with an external power pack linked to their phone?", "谁会一直带着充电宝给手机充电？", "Who walks around with a power bank plugged into their phone?", "power bank 是日常最常用的说法；plugged into 表达连接状态。", "Who walks around with a power bank plugged into their phone all day?"],
  [54, "There are all kinds of crossover between genres.", "不同类型的作品经常会互相借鉴。", "Different genres often overlap.", "overlap = 有重叠、互相借鉴；比 crossover between genres 更直接。", "Different genres often overlap, especially in modern films."],
  [55, "The city has many multilingual residents.", "这个城市有很多人会说不止一种语言。", "Lots of people in this city speak more than one language.", "用 people who speak... 直接表达，避免把 multilingual 当成必须背的书面标签。", "Lots of people in this city speak more than one language."],
  [55, "I want to learn colloquial expressions used in daily conversation.", "我想学真正日常会话里会用的表达。", "I want to learn phrases people actually use in everyday conversation.", "把 colloquial expressions 换成 phrases people actually use，更符合学习者的口语目标。", "I want to learn phrases people actually use in everyday conversation."],
  [55, "We always have fun reminiscing about our old language lessons.", "我们总会很开心地回忆以前的语言课。", "We always enjoy looking back on our old language lessons.", "look back on 是更容易主动使用的回忆表达。", "We always enjoy looking back on our old language lessons."],
  [59, "It has a strong feeling of perspective.", "这幅画让人感觉空间很有层次。", "It gives the painting a real sense of depth.", "sense of depth 是描述画面空间感更自然的说法。", "It gives the painting a real sense of depth, even though it's quite simple."],
  [62, "Work is an integral part of life.", "工作是生活中很重要的一部分。", "Work is a big part of life.", "a big part of life 比 integral part 更自然、更容易脱口而出。", "Work is a big part of life, but it isn't everything."],
  [62, "I strive to maintain a high level of professionalism.", "我会尽量在办公室保持专业。", "I try to keep things professional at work.", "try to keep things professional 是日常工作语境里更自然的表达。", "I try to keep things professional at work, even when things get stressful."],
  [62, "I undertake projects that work in tandem with my life.", "我会做一些能和自己的生活安排配合起来的项目。", "I work on projects that fit in with my life.", "fit in with my life = 和生活安排合得来；undertake / in tandem 偏书面。", "I work on projects that fit in with my life rather than taking over my life."],
  [63, "To answer the question to the letter, I'd say definitely not.", "如果严格按问题的字面来回答，我会说绝对不是。", "If I answer the question literally, I'd say definitely not.", "answer literally 是更常见、更清楚的说法。", "If I answer the question literally, I'd say definitely not."],
  [63, "Creating a clone to be cut up for organs is repulsive.", "为了取器官而制造一个复制人，这个想法太可怕了。", "The idea of making a clone just to take its organs is horrifying.", "horrifying 比 repulsive 更适合表达对这个设想的强烈反感。", "The idea of making a clone just to take its organs is horrifying."],
  [65, "It remains an unexplained phenomenon.", "那仍然是我们解释不了的事情。", "It's still something we can't explain.", "把 phenomenon 换成 something we can't explain，保留意思但更像真实对话。", "It's still something we can't explain, even with today's technology."],
  [65, "The vastness of space puts the idea of alien visitors into perspective.", "宇宙这么大，所以外星人来访也没那么难想象。", "The sheer size of space makes alien visitors seem less far-fetched.", "less far-fetched = 没那么离谱；比 put into perspective 更易用于口语讨论。", "The sheer size of space makes alien visitors seem less far-fetched."],
  [67, "Child stars miss out on things other young people take for granted.", "童星会错过很多普通孩子习以为常的事情。", "Child stars miss out on a lot of things other kids take for granted.", "a lot of things / other kids 是日常会话中更自然的搭配。", "Child stars miss out on a lot of things other kids take for granted, like a normal school life."],
  [68, "I'll watch the next instalment of a gripping niche drama.", "我会接着看下一集让我上头的剧。", "I'll watch the next episode of a show I'm hooked on.", "episode 和 be hooked on 是更高频的日常说法。", "I'll watch the next episode of a show I'm hooked on."],
  [72, "The programme discusses topical issues with regular news updates.", "这个节目会聊热点，也会不断更新新闻。", "The programme covers big issues and gives regular news updates.", "cover big issues 比 discuss topical issues 更口语。", "The programme covers big issues and gives regular news updates throughout the day."],
  [72, "There's something enjoyably tactile about holding and folding a newspaper.", "真正拿着、折叠报纸，手感挺特别的。", "There's something nice about the feel of holding and folding a newspaper.", "the feel of... 是描述触感更自然的口语结构。", "There's something nice about the feel of holding and folding a newspaper."],
  [72, "I appreciate the newspaper's impartiality.", "我喜欢这家报纸，因为它尽量做到公平。", "I like how fair this newspaper is.", "like how fair... 比抽象名词 impartiality 更容易主动使用。", "I like how fair this newspaper is, even when the story is controversial."],
  [72, "Newspaper websites also provide live news feeds.", "新闻网站也会给你实时更新。", "News websites also give you live updates.", "live updates 是日常新闻语境中更高频的说法。", "News websites also give you live updates when something important happens."],
  [72, "For a start, you're listening to someone else's interpretation of events.", "首先，你听到的只是别人对这件事的理解。", "For starters, you're hearing someone else's take on what happened.", "someone else's take on... 是口语里表达“某人的看法”。", "For starters, you're hearing someone else's take on what happened."],
  [73, "After a day, I want to get back to my creature comforts.", "在野外待一天后，我就想回到家里的舒适生活。", "After a day, I want to get back to the comforts of home.", "comforts of home 比 creature comforts 更直观、更常用。", "After a day in the wilderness, I want to get back to the comforts of home."],
  [77, "Greenhouse gases intensify the greenhouse effect.", "温室气体会让温室效应变得更严重。", "Greenhouse gases make the greenhouse effect worse.", "make...worse 是解释因果关系时更自然的口语结构。", "Greenhouse gases make the greenhouse effect worse and raise global temperatures."],
  [84, "That mushroom has a strong odour.", "那种蘑菇闻起来味道很重。", "That mushroom has a strong smell.", "smell 是日常对话的首选；odour 偏书面且常带负面色彩。", "That mushroom has a strong smell, so keep it away from the kitchen."],
  [84, "Plants make a house and garden more aesthetically pleasing.", "植物能让房子和花园看起来好看很多。", "Plants make a house and garden look so much nicer.", "look so much nicer 比 aesthetically pleasing 更像真实口语。", "Plants make a house and garden look so much nicer."],
  [85, "The city needs to improve its transport and water infrastructure.", "这座城市需要改善道路和供水系统。", "The city needs to improve its roads and water systems.", "roads and water systems 比 infrastructure 更具体，也更容易说。", "The city needs to improve its roads and water systems."],
  [85, "If you have a family, safety is always the most important consideration.", "如果你有家人，安全永远是第一位的。", "If you have a family, safety comes first.", "safety comes first 是高频、自然的口语表达。", "If you have a family, safety comes first."],
  [86, "Self-sufficiency requires a lot of strength and determination.", "想靠自己生活，需要很大的毅力和决心。", "Living self-sufficiently takes a lot of strength and determination.", "living self-sufficiently 把抽象名词变成具体生活场景。", "Living self-sufficiently takes a lot of strength and determination."],
  [86, "The pressure of modern society doesn't always equate to the rewards.", "现代生活的压力有时并不值得那些回报。", "The pressure of modern life doesn't always seem worth the reward.", "seem worth the reward 比 equate to 更像日常评价。", "The pressure of modern life doesn't always seem worth the reward."],
  [86, "The number of professionals leaving their jobs seems to be at an all-time high.", "最近辞职的专业人士好像比以前任何时候都多。", "It seems like more professionals are quitting than ever.", "more...than ever 是更自然的比较结构。", "It seems like more professionals are quitting than ever."],
  [86, "You'd have to live without most of your creature comforts.", "你得习惯没有大多数平时觉得理所当然的便利。", "You'd have to live without most of the comforts you take for granted.", "comforts you take for granted 更具体，也更符合对话语气。", "You'd have to live without most of the comforts you take for granted."],
  [87, "In the end, he had to install special shatterproof windows.", "最后，他不得不装上不会碎的特殊玻璃窗。", "In the end, he had to install windows that wouldn't shatter.", "用定语从句解释 shatterproof，学习者更容易在新场景里迁移。", "In the end, he had to install windows that wouldn't shatter."],
  [88, "He is of no fixed abode.", "他没有固定住址。", "He doesn't have a permanent address.", "permanent address 是日常最常用的说法；of no fixed abode 过于法律化。", "He doesn't have a permanent address, so he moves around a lot."],
  [88, "That would sound the death knell for the public health system.", "那可能会让公共医疗体系彻底撑不下去。", "That could be the end of the public health system.", "the end of... 比 death knell 更直白，也更适合口语讨论。", "That could be the end of the public health system as we know it."],
  [88, "Teachers have been leaving in droves for years.", "很多老师已经离开这个行业好多年了。", "Teachers have been leaving in huge numbers for years.", "in huge numbers 比 in droves 更容易理解和主动套用。", "Teachers have been leaving in huge numbers for years because pay has not kept up."],
  [88, "Losing a job has huge knock-on effects on every area of life.", "失业会影响生活的方方面面。", "Losing your job can affect every part of your life.", "affect every part of your life 是更自然的完整句。", "Losing your job can affect every part of your life, not just your finances."],
  [89, "The witness gave testimony in court.", "目击者在法庭上讲了自己看到的事。", "The witness gave evidence in court.", "在英式法律语境里 give evidence 比 give testimony 更常见。", "The witness gave evidence in court about what he had seen."],
  [89, "The issue has come to the forefront once again.", "这个问题又重新成了大家关注的焦点。", "The issue is back in the spotlight.", "back in the spotlight 是新闻和日常评论中更自然的说法。", "The issue is back in the spotlight after a new report was published."],
  [89, "It's noteworthy that this usually happens to people with little social status.", "值得注意的是，这种事通常发生在社会地位不高的人身上。", "It's worth noting that this usually happens to people from poorer backgrounds.", "it's worth noting 更常见；poorer backgrounds 也比 little social status 更自然。", "It's worth noting that this usually happens to people from poorer backgrounds."],
  [89, "Wealthy people can settle cases through out-of-court agreements.", "有钱人可以不进法庭就把官司解决掉。", "Wealthy people can settle a case without going to court.", "without going to court 是更直接的口语表达。", "Wealthy people can settle a case without going to court."],
  [89, "After years of appeals, they were acquitted and released.", "上诉多年后，他们被判无罪并获释。", "After years of appeals, they were found not guilty and released.", "found not guilty 比 acquitted 更容易在口语中主动使用。", "After years of appeals, they were found not guilty and released."],
  [90, "The defendant pleaded guilty in court.", "被告在法庭上承认自己有罪。", "The defendant admitted he was guilty in court.", "admitted he was guilty 比 pleaded guilty 更直白；法律术语可在备注里保留。", "The defendant admitted he was guilty in court."],
  [90, "When the judge passed sentence, the defendant's family cried.", "法官宣布判决时，被告的家人哭了。", "When the judge announced the sentence, the defendant's family cried.", "announce the sentence 比 pass sentence 更容易从中文直接转换。", "When the judge announced the sentence, the defendant's family cried."],
  [90, "It's widely believed that the prison system does not rehabilitate offenders.", "很多人觉得这套监狱制度没能帮助罪犯重新开始。", "People generally think this prison system doesn't help offenders turn their lives around.", "turn their lives around 是常见口语，替代 rehabilitate offenders。", "People generally think this prison system doesn't help offenders turn their lives around."],
  [90, "They say they would never reoffend if they were released.", "他们说，获释后自己绝不会再犯罪。", "They say they'd never commit another crime if they were released.", "commit another crime 比 reoffend 更透明、更容易理解。", "They say they'd never commit another crime if they were released."],
  [90, "An untold number of innocent people have been executed.", "有很多无辜的人被处决了，但具体人数没人知道。", "An unknown number of innocent people have been executed.", "unknown number 直接表达“人数不详”，比 untold number 更清楚。", "An unknown number of innocent people have been executed."],
  [90, "What if the crime is serious enough to warrant the death penalty?", "如果罪行严重到该判死刑，会怎么样？", "What if the crime was serious enough to deserve the death penalty?", "deserve the death penalty 比 warrant 更接近日常讨论。", "What if the crime was serious enough to deserve the death penalty?"],
  [90, "The UK abolished the death penalty a long time ago.", "英国很久以前就取消了死刑。", "The UK got rid of the death penalty a long time ago.", "get rid of 是高频口语；法律语境里的 abolish 可放在备注里补充。", "The UK got rid of the death penalty a long time ago."],
  [91, "A republic does not have a hereditary monarch as its head of state.", "共和国不会由世袭的国王或女王担任国家元首。", "A republic doesn't have a king or queen who inherits the job.", "用 who inherits the job 解释 hereditary，避免只背抽象形容词。", "A republic doesn't have a king or queen who inherits the job."],
  [91, "The UK has a constitutional monarchy.", "英国有君主，但君主不负责日常治理国家。", "The UK has a monarchy, but the monarch doesn't run the government.", "完整对比句更像口语，也更能说清 constitutional monarchy 的含义。", "The UK has a monarchy, but the monarch doesn't run the government."],
  [91, "An oligarchy is controlled by a small group of powerful people.", "寡头政治就是由一小群有权势的人控制。", "An oligarchy is run by a small group of powerful people.", "is run by 比 is controlled by 更口语。", "An oligarchy is run by a small group of powerful people."],
  [91, "An autocracy concentrates power in a single ruler.", "独裁制度就是权力集中在一个人手里。", "An autocracy is run by one ruler.", "is run by one ruler 更直接，也更适合初次开口。", "An autocracy is run by one ruler with very little opposition."],
  [91, "The two countries were sworn enemies for years.", "这两个国家多年来一直互相敌视。", "The two countries had been enemies for years.", "had been enemies 比 sworn enemies 更常用，也降低了记忆负担。", "The two countries had been enemies for years before they finally made peace."],
  [91, "He was a high-ranking officer in the army.", "他是军队里的高级军官。", "He was a senior officer in the army.", "senior officer 是更常见的搭配。", "He was a senior officer in the army before he retired."],
  [91, "She came from a well-connected and influential aristocratic family.", "她出身于一个有权有势、人脉很广的贵族家庭。", "She came from a powerful, well-connected family.", "去掉 aristocratic 等低频修饰词，保留口语真正要表达的重点。", "She came from a powerful, well-connected family."],
  [91, "The truth about their lineage all but vanished.", "关于他们家族血统的真相差点就消失了。", "The truth about their family line almost disappeared.", "family line / almost disappeared 比 lineage / all but vanished 更容易迁移。", "The truth about their family line almost disappeared over time."],
  [91, "They lived their lives in an institution away from the public eye.", "她们一生都住在远离公众关注的机构里。", "They spent their lives in an institution away from public attention.", "public attention 比 public eye 更直观；spend their lives 也更自然。", "They spent their lives in an institution away from public attention."],
  [92, "Both sides agreed to an immediate ceasefire.", "双方同意马上停止战斗。", "Both sides agreed to stop fighting straight away.", "stop fighting straight away 比 immediate ceasefire 更像口头报道。", "Both sides agreed to stop fighting straight away."],
  [92, "The war caused heavy civilian casualties.", "这场战争造成了大量平民死亡。", "The war caused a lot of civilian deaths.", "civilian deaths 是更直白的说法；专业术语在备注里解释。", "The war caused a lot of civilian deaths and displaced millions of people."],
  [92, "Chinese forces helped the DPRK halt the American advance.", "中国军队帮助朝鲜阻止了美军继续推进。", "Chinese forces helped stop the American advance.", "helped stop 比 helped halt 更常用；保留主题信息但降低书面感。", "Chinese forces helped stop the American advance."],
  [92, "The war finally ended with the signing of a truce agreement.", "这场战争最后以双方签署停战协议告终。", "The war finally ended when both sides signed a truce.", "用 when 引出事件，避免抽象的 with the signing of...。", "The war finally ended when both sides signed a truce."],
  [92, "Suicides among returning soldiers outnumber battlefield fatalities.", "回国士兵自杀的人数，比战场上死亡的人数还多。", "More veterans died by suicide than died in battle.", "more...than... 是更自然的数量比较结构。", "More veterans died by suicide than died in battle."],
  [92, "He lived in excruciating pain.", "他长期忍受着难以忍受的疼痛。", "He lived with unbearable pain.", "unbearable pain 比 excruciating pain 更高频、更容易主动使用。", "He lived with unbearable pain for years."],
  [94, "It will be the pinnacle of her career so far.", "这会是她目前职业生涯的最高点。", "This will be the high point of her career so far.", "high point 比 pinnacle 更常见、更口语。", "Winning this award will be the high point of her career so far."],
  [94, "Our efforts seem inconsequential at the moment.", "我们现在做的这些努力，好像还没有带来多大变化。", "Our efforts don't seem to be making much difference at the moment.", "make much difference 是表达“起作用/带来变化”的常用口语。", "Our efforts don't seem to be making much difference at the moment."],
  [95, "As we get on in years, we have fewer chances to do something worthwhile.", "年纪越大，我们做有意义事情的机会可能越少。", "As we get older, we have fewer chances to do something meaningful.", "get older / meaningful 比 get on in years / worthwhile 更常见。", "As we get older, we have fewer chances to do something meaningful."],
  [95, "The next step is to set the wheels in motion.", "下一步就是把计划真正启动起来。", "The next step is to get the plan started.", "get the plan started 比 set the wheels in motion 更直白。", "The next step is to get the plan started and keep it moving."],
  [95, "It's imperative to set small, achievable targets.", "设定小而能做到的目标真的很重要。", "It's really important to set small, achievable goals.", "really important / goals 是更高频、更适合初次开口的表达。", "It's really important to set small, achievable goals."],
  [96, "Think of and describe six genres of film.", "想出并描述六种电影类型。", "Think of and describe six types of film.", "types of film 比 genres of film 更适合日常表达。", "Think of and describe six types of film."],
  [96, "Think of and describe six genres of music.", "想出并描述六种音乐类型。", "Think of and describe six types of music.", "types of music 更常见；genre 可在备注中作为补充词汇。", "Think of and describe six types of music."],
  [96, "Think of ten words associated with rain.", "想出十个和下雨有关的词。", "Think of ten words connected with rain.", "connected with 比 associated with 更自然、更容易主动套用。", "Think of ten words connected with rain."],
  [96, "Think of and describe three modes of air travel.", "想出并描述三种坐飞机出行的方式。", "Think of and describe three ways of travelling by air.", "ways of travelling by air 比 modes of air travel 更符合口语。", "Think of and describe three ways of travelling by air."]
];

const touched = new Set();
for (const [topic, oldChunk, prompt, chunk, note, example] of replacements) {
  const file = path.join(__dirname, "..", "data", `deck-topic-${String(topic).padStart(2, "0")}.js`);
  let source = fs.readFileSync(file, "utf8");
  const old = `chunk: ${JSON.stringify(oldChunk)}`;
  const next = `chunk: ${JSON.stringify(chunk)}`;
  if (!source.includes(old)) {
    if (source.includes(next)) continue;
    throw new Error(`Topic ${topic}: cannot find ${oldChunk}`);
  }
  source = source.replace(old, next);
  const cardStart = source.lastIndexOf("{", source.indexOf(next));
  const cardEnd = source.indexOf("}", cardStart);
  if (cardStart < 0 || cardEnd < 0) throw new Error(`Topic ${topic}: cannot locate card for ${chunk}`);
  const card = source.slice(cardStart, cardEnd);
  const updated = card
    .replace(/prompt: "(?:[^"\\]|\\.)*"/, `prompt: ${JSON.stringify(prompt)}`)
    .replace(/note: "(?:[^"\\]|\\.)*"/, `note: ${JSON.stringify(note)}`)
    .replace(/example: "(?:[^"\\]|\\.)*"/, `example: ${JSON.stringify(example)}`);
  source = source.slice(0, cardStart) + updated + source.slice(cardEnd);
  fs.writeFileSync(file, source);
  touched.add(file);
}
console.log(`Updated ${replacements.length} cards across ${touched.size} topics.`);
