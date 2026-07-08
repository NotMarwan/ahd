<div dir="rtl">

# 🐝 SWARM — سرب البحث الرباعيّ لعهد

> **المهمّة الكبرى:** تزويد مشروع «عهد» (هاكاثون أمد 2026 — التحكيم 18 يوليو) بأدلّةٍ حقيقيّةٍ موثَّقة:
> عناوين صحفيّة، أبحاث، أرقام رسميّة، ومشهد عالميّ — لتقوية العرض أمام لجنة التحكيم.
> **الإلهام:** فريقٌ فاز بمركزٍ أوّل بعرض «جدار عناوين الصحف» عن مشكلته — نبني جدارنا بصدقٍ كامل.

## الوكلاء الأربعة

| المجلّد | التخصّص | الناتج الرئيس |
|---|---|---|
| `agent-1-local-press/` | الصحافة المحلّية والخليجيّة | **بنك عناوين** عن نزاعات السلف بين الأهل والأصدقاء + لقطات |
| `agent-2-academic/` | الأبحاث الأكاديميّة | دراسات الإقراض غير الرسميّ وأثره الاجتماعيّ + اقتباسات مرقّمة |
| `agent-3-official-stats/` | الأرقام الرسميّة | أرقام محدَّثة 2024–25 من مصادر أوّليّة (العدل/ساما/الإحصاء) |
| `agent-4-global/` | العالميّ والمنافسون | عناوين عالميّة + خريطة الحلول القائمة وثغراتها |

## ⚖️ قوانين السرب (تسري على الأربعة — خرقها يُفسد العمل كلّه)

1. **لا اختلاق أبدًا.** كلّ معلومة معها رابطها. عنوانٌ صحفيّ بلا رابط + أرشيف = غير موجود.
2. **الأرشفة إلزاميّة:** كلّ مصدر مهمّ يُؤرشف عبر `web.archive.org/save/<URL>` ويُسجَّل رابط الأرشيف بجانب الأصل.
3. **درجات الثقة:** 🟢 مصدر أوّليّ/رسميّ أو مصدران مستقلّان · 🟡 مصدر واحد موثوق · 🔴 إشارة غير مؤكَّدة.
4. **العمر الزمنيّ يُذكر دائمًا:** رقم 2021 يُكتب «(2021)» — لا يُقدَّم قديمٌ على أنّه جديد.
5. **لا أرقام أمريكيّة تُنسب للسعوديّة.** المحلّيّ محلّيّ والعالميّ عالميّ، مفصولان بوضوح.
6. **روح المشروع:** عهد بنكٌ **يشهد ولا يُقرض** — لا ربا، لا غرامة، لا تصنيف ائتمانيّ. لا تجمع ما يناقضها كأنّه «حلّ».
7. **الصور:** لقطة العنوان تُظهر اسم الصحيفة والتاريخ، تُحفظ في `headlines/` باسم `YYYY-MM-<المصدر>-<وصف>.png`، ويُسجَّل رابطها + أرشيفها في `sources.md`.
8. **الملفّات:** كلّ وكيل يكتب فقط داخل مجلّده: `findings.md` (النتائج) + `sources.md` (سجلّ المصادر) + `headlines/` (الصور). لا يلمس شيئًا خارج مجلّده.

## 🔁 التسليم

عند الانتهاء يكتب الوكيل في نهاية `findings.md` سطرًا: `HANDOFF: ready · <التاريخ> · <عدد النتائج>` —
والمشغِّل/Claude-E يدمج المُجاز منها في `docs/evidence/` وجدار العناوين في العرض التقديميّ.

</div>

---

# SWARM — English mirror (for any model)

Four research agents, one folder each, feeding the Ahd project (AMAD Hackathon, judging 18 July 2026).
**Iron rules:** No fabrication — every claim carries its URL; important sources archived via web.archive.org
(record both links). Confidence grades 🟢🟡🔴. Always state a number's year. Never present US figures as Saudi.
Product spine: a bank that witnesses/seals qard-hasan loans — never lends, judges, charges, or credit-scores;
don't collect anything that contradicts it as a "solution". Headline screenshots go in your folder's
`headlines/` as `YYYY-MM-<source>-<slug>.png` with URLs logged in `sources.md`. Write ONLY inside your own
folder: `findings.md` + `sources.md` + `headlines/`. End with `HANDOFF: ready · <date> · <count>`.
