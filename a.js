"use strict";
function _interopDefault(a) {
  return a && "object" == typeof a && "default" in a ? a["default"] : a;
}
var babelPluginTransformVueJsx = _interopDefault(
    require("@vue/babel-plugin-transform-vue-jsx")
  ),
  babelSugarFunctionalVue = _interopDefault(
    require("@vue/babel-sugar-functional-vue")
  ),
  babelSugarInjectH = _interopDefault(require("@vue/babel-sugar-inject-h")),
  babelSugarCompositionApiInjectH = _interopDefault(
    require("@vue/babel-sugar-composition-api-inject-h")
  ),
  babelSugarCompositionApiRenderInstance = _interopDefault(
    require("@vue/babel-sugar-composition-api-render-instance")
  ),
  babelSugarVModel = _interopDefault(require("@vue/babel-sugar-v-model")),
  babelSugarVOn = _interopDefault(require("@vue/babel-sugar-v-on")),
  index = (
    a,
    {
      functional: b = !0,
      injectH: c = !0,
      vModel: d = !0,
      vOn: e = !0,
      compositionAPI: f = !1,
    } = {}
  ) => {
    let g = babelSugarInjectH,
      h = "@vue/composition-api";
    if (f) {
      if (
        (["native", "naruto"].includes(f) && (h = "vue"),
        "vue-demi" === f && (h = "vue-demi"),
        ["auto", !0].includes(f))
      )
        try {
          const a = require("vue/package.json").version;
          a.startsWith("2.7") && (h = "vue");
        } catch (a) {}
      "object" == typeof f && f.importSource && (h = f.importSource),
        (g = [babelSugarCompositionApiInjectH, { importSource: h }]);
    }
    return {
      plugins: [
        b && babelSugarFunctionalVue,
        c && g,
        d && babelSugarVModel,
        e && babelSugarVOn,
        f && [babelSugarCompositionApiRenderInstance, { importSource: h }],
        babelPluginTransformVueJsx,
      ].filter(Boolean),
    };
  };
module.exports = index;
