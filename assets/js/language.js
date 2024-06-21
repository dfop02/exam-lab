$(document).ready(function () {
  setLocale();
});

function switchLanguage(language) {
  document.documentElement.lang = language;
  const lang = `:lang(${language})`;
  const show = '[lang]' + lang;
  const hide = `[lang]:not(${lang})`;
  document.querySelectorAll(hide).forEach(function (node) {
    node.style.display = 'none';
  });
  document.querySelectorAll(show).forEach(function (node) {
    node.style.display = 'unset';
  });

  // Persist user selection (using localStorage)
  localStorage.setItem('selectedLanguage', language);
}

function setLocale() {
  const optionValues = $('.label-select img').map((i, o) => o.alt).toArray() || ['en'];
  const browser_lang = navigator.language;
  const storedLanguage = localStorage.getItem('selectedLanguage') || browser_lang;

  // Check if browser lang is supported
  // Else, by default the locale is en
  if (optionValues.includes(storedLanguage)) {
    document.documentElement.lang = storedLanguage;
    switchLanguage(storedLanguage);
  }
}
