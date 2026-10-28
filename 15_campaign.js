/* ===================== campaign landing screen ===================== */
const Campaign = {
  el: null,
  init() {
    this.el = $('#campaign');
    const enter = $('#campaignEnter');
    if (enter) enter.addEventListener('click', () => {
      SFX.ui('ui_click');
      this.dismiss();
    });
  },
  show() { show(this.el, true); },
  dismiss() { show(this.el, false); Menu.open('home'); }
};
