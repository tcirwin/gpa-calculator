
(function ($) {
   var defaultSettings= {
      unit_callback: function (val) { $("#totUnits").val(val); },
      gpa_high_callback: function (val) { $("#gpaHigh").val(val); },
      gpa_low_callback: function (val) { $("#gpaLow").val(val); },

      course_name: '',
      units: 0,
      gpa_high: 0.0,
      gpa_low: 0.0,

      grade_high: 4.0,
      grade_low: 0.0,
      default_repeat: false,
      repeat: false,
      cumulative: false,
      prev_grade: 1.3,

      /**
       * Default calculator logic. This function is called whenever any
       * of the input elements has been changed.
       *
       * param ui = {
       *    courses: [new Course(s)],
       *    cur_grades: Cur_Cumulative,
       *    final_gpa: Final_GPA,
       *    repeats: true/false,
       *    cumulative: true/false
       * }
       */
      update_calc: function (ui) {
         var tot_units = ui.cumulative ? ui.cur_grades.get_units() : 0,
             tot_points_high = 
              ui.cumulative? ui.cur_grades.get_points() : 0;
         var tot_points_low = tot_points_high;

         tot_units = isNaN(tot_units) ? 0 : tot_units;

         for (var i = 0; i < ui.courses.length; i++) {
            var course = ui.courses[i];

            tot_points_high += course.get_points_high(ui.repeat);
            tot_points_low += course.get_points_low(ui.repeat);
            tot_units += course.effective_units(ui.repeat);
         }

         ui.final_gpa.set_units(tot_units);

         tot_units = (tot_units == 0) ? 1 : tot_units;
         tot_points_high = isNaN(tot_points_high) ? 0 : tot_points_high;
         tot_points_low = isNaN(tot_points_low) ? 0 : tot_points_low;

         ui.final_gpa.set_gpa_high((tot_points_high / tot_units).toFixed(2));
         ui.final_gpa.set_gpa_low((tot_points_low / tot_units).toFixed(2));
      }
   };

   $.fn.gpaCalc = function (spec) {
      var settings = $.extend(defaultSettings, spec);

      return this.each(function () {
         gpa_calc_ui.init(gpa_calc.init(settings));
      });
   };
}) (jQuery);
