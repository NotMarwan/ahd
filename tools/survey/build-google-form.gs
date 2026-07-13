/* Generated from docs/evidence/survey/form-spec.json. Do not edit by hand. */
function buildAhdDemandSurvey() {
  var form = FormApp.create("استبيان مجهول عن الإقراض والاقتراض بين الأشخاص");
  form.setDescription("استبيان بحثي مجهول للأغراض الدراسية. يستغرق 3–4 دقائق. لا نجمع الاسم أو البريد أو رقم الهاتف أو الهوية أو بيانات الحساب. الإجابات المجمعة فقط تُستخدم في التحليل.");
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setConfirmationMessage("شكراً لمشاركتك. لا تجمع هذه الدراسة بيانات تعريفية، وتُحلل الإجابات مجمعة فقط.");
  var consent = form.addMultipleChoiceItem().setTitle("هل توافق/ين على المشاركة الطوعية واستخدام الإجابات المجهولة بصورة مجمعة؟").setRequired(true);
  consent.setChoices([consent.createChoice("نعم", FormApp.PageNavigationType.CONTINUE), consent.createChoice("لا", FormApp.PageNavigationType.SUBMIT)]);
  var eligible = form.addMultipleChoiceItem().setTitle("هل تقيم/ين حالياً في المملكة العربية السعودية وعمرك 18 سنة أو أكثر؟").setRequired(true);
  eligible.setChoices([eligible.createChoice("نعم", FormApp.PageNavigationType.CONTINUE), eligible.createChoice("لا", FormApp.PageNavigationType.SUBMIT)]);
  var age = form.addMultipleChoiceItem().setTitle("الفئة العمرية").setChoiceValues(["18–24","25–34","35–44","45–54","55+","أفضل عدم الإجابة"]).setRequired(false);
  var nationality = form.addMultipleChoiceItem().setTitle("الجنسية").setChoiceValues(["سعودي","غير سعودي","أفضل عدم الإجابة"]).setRequired(false);
  var lent_frequency = form.addMultipleChoiceItem().setTitle("خلال الاثني عشر شهراً الماضية، كم مرة أقرضت مالاً لشخص تعرفه على أن يعيده؟").setChoiceValues(["أبداً","مرة","2–3","4 فأكثر"]).setRequired(true);
  var borrowed_frequency = form.addMultipleChoiceItem().setTitle("خلال الاثني عشر شهراً الماضية، كم مرة اقترضت مالاً من شخص تعرفه؟").setChoiceValues(["أبداً","مرة","2–3","4 فأكثر"]).setRequired(true);
  var largest_lent = form.addMultipleChoiceItem().setTitle("ما أكبر مبلغ أقرضته تقريباً؟").setChoiceValues(["لم أقرض","أقل من 500","500–1,999","2,000–4,999","5,000–9,999","10,000+","أفضل عدم الإجابة"]).setRequired(true);
  var delayed = form.addMultipleChoiceItem().setTitle("هل تأخر شخص في رد مبلغ لك؟").setRequired(true);
  var painPage = form.addPageBreakItem().setTitle("التجربة عند التأخر");
  var awkward = form.addMultipleChoiceItem().setTitle("كيف كان شعورك تجاه المطالبة بالمبلغ؟").setChoiceValues(["سهل جداً","سهل نوعاً ما","محايد","محرج نوعاً ما","محرج جداً"]).setRequired(true);
  var action = form.addMultipleChoiceItem().setTitle("ما الذي فعلته في آخر مرة؟").setChoiceValues(["طلبت مباشرة","لمّحت","انتظرت وأجلت الطلب","توقفت عن الطلب وسامحت","أفضل عدم الإجابة"]).setRequired(true);
  var strain = form.addMultipleChoiceItem().setTitle("كيف أثرت المسألة على العلاقة؟").setChoiceValues(["أثر واضح","أثر بسيط","لم يؤثر","أفضل عدم الإجابة"]).setRequired(true);
  var afterPainPage = form.addPageBreakItem().setTitle("التوثيق والتفضيلات");
  var documentation = form.addMultipleChoiceItem().setTitle("كيف توثق عادةً الإقراض أو الاقتراض؟").setChoiceValues(["اتفاق مكتوب","تحويل بنكي بمرجع","محادثة WhatsApp","ملاحظة شخصية","لا أوثّق","أفضل عدم الإجابة"]).setRequired(true);
  var reminder = form.addMultipleChoiceItem().setTitle("إذا تأخر السداد، أي طريقة تذكير تفضل؟").setChoiceValues(["تذكير مباشر","تذكير آلي ومحايد","شخص ثالث موثوق","لا أريد تذكيراً","أفضل عدم الإجابة"]).setRequired(true);
  var riba = form.addMultipleChoiceItem().setTitle("ما أهمية عدم الفائدة أو الغرامة لك في هذا النوع من التعامل؟").setChoiceValues(["مهمة جداً","مهمة","محايد","غير مهمة","غير مهمة إطلاقاً"]).setRequired(true);
  var writing = form.addMultipleChoiceItem().setTitle("هل تشعر/ين بالاطمئنان عندما يكون الدين مكتوباً؟").setChoiceValues(["كثيراً","نوعاً ما","لا فرق","أقل اطمئناناً","لا أعرف"]).setRequired(true);
  var concept = form.addMultipleChoiceItem().setTitle("ما رأيك في خدمة محايدة تحفظ اتفاق القرض وترسل تذكيراً لطيفاً عند التأخر، بلا فائدة أو حكم؟").setChoiceValues(["مفيدة جداً","مفيدة","محايد","غير مفيدة","غير مفيدة إطلاقاً"]).setRequired(false);
  var source_group = form.addMultipleChoiceItem().setTitle("رمز مجموعة النشر").setChoiceValues(["G1","G2","G3","G4","G5"]).setRequired(true);
  delayed.setChoices([delayed.createChoice("نعم", painPage), delayed.createChoice("لا", afterPainPage), delayed.createChoice("لا أتذكر", afterPainPage)]);
  var links = {};
  ["G1", "G2", "G3", "G4", "G5"].forEach(function (code) { links[code] = form.createResponse().withItemResponse(source_group.createResponse(code)).toPrefilledUrl(); });
  Logger.log(JSON.stringify({ editUrl: form.getEditUrl(), publishedUrl: form.getPublishedUrl(), sourceLinks: links }));
}
