(function ($) {
   $(window).load(function () {
      $('#container').gpaCalc();

      // Accordion containers (the instructions on the demo page).
      $('#container').on('click', 'div.expandPane', function (event) {
         $(this).siblings('div.expandPane').children('ul').slideUp('fast');
         $(this).children('ul').slideToggle('fast');
      });

      // Disable all links with class no-nav
      $('body').on('click', 'a.no-nav', function (event) {
         return false;
      });
   });
}) (jQuery);
