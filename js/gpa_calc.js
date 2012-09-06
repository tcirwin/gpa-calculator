/**
 * gpa_calc.js
 *
 * GPA Calculator Javascript code
 *
 * Last Updated: Aug. 28, 2012
 *
 * Copyright (c) 2012 Therin Irwin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * All of our miscellaneous helper functions go here.
 */
var tci_tools = (function () {
   /**
    * Function shell that checks whether val is an int or float,
    * depending on the function checker that's passed in. Calls
    * an error handler on error, and a callback on success.
    */
   var type_check = function (checker, val, success, error, msg) {
      var intgr = checker(val);

      if (isNaN(intgr)) {
         if (error !== undefined) {
            error(msg);
         }
      }
      else {
         success(intgr);
      }
   };

   return {
      /**
       * Generate getters and setters for the member variable item_name
       * on the prototype type.
       */
      get_set : function (item_name, type) {
         type.prototype['get_' + item_name] = function () {
            return this[item_name];
         };

         type.prototype['set_' + item_name] = function (val) {
            this[item_name] = val;
            this.update();
         }; 
      },
              
      /**
       * Checks that val is an integer
       */
      set_int : function (val, success, error, msg) { 
         return type_check(parseInt, val, success, error, msg);
      },

      /**
       * Checks that val is a float
       */
      set_float : function (val, success, error, msg) { 
         return type_check(parseFloat, val, success, error, msg);
      }
   };
}());

var gpa_calc = (function () {
   var errors = {
      units_nan: {
         desc: "Value entered for units is not a number."
      },
      gpa_nan: {
         desc: "Value entered for GPA is not a number."
      }
   };

   var Cur_Cumulative = function (spec) {
      var units, gpa;
      
      return {
         set_units: function (val, error) { 
            tci_tools.set_int(val, function (intgr) {
               units = intgr;
               spec.update();
            }, error, errors.units_nan);
         },
         set_gpa: function (val, error) {
            tci_tools.set_float(val, function (intgr) {
               gpa = intgr;
               spec.update();
            }, error, errors.gpa_nan);
         },

         get_units: function () { return units; },
         get_points: function () { return units * gpa; }
      };
   };

   var Final_GPA = function (spec) {
      var units = spec.units || 0;
      var gpa_high = spec.gpa_high || 0.0;
      var gpa_low = spec.gpa_low || 0.0;

      return {
         set_units: function (val) {
            units = val;
            spec.unit_callback(val);
         },

         set_gpa_high: function (val) {
            gpa_high = val;
            spec.gpa_high_callback(val);
         },

         set_gpa_low: function (val) {
            gpa_low = val;
            spec.gpa_low_callback(val);
         }
      };
   };

   var Course = function (spec) {
      this.name = spec.course_name;
      this.units = spec.units;
      this.grade_high = spec.grade_high;
      this.grade_low = spec.grade_low;
      this.prev_grade = spec.prev_grade;
      this.repeat = spec.default_repeat;
      this.update = spec.update;
   };

   Course.prototype.get_points_high = function (global_repeat) {
      return this.units * (this.grade_high -
        (this.repeat && global_repeat ? this.prev_grade : 0));
   };

   Course.prototype.get_points_low = function (global_repeat) {
      return this.units * (this.grade_low -
        (this.repeat && global_repeat ? this.prev_grade : 0));
   };

   Course.prototype.effective_units = function (global_repeat) {
      return (this.repeat && global_repeat) ? 0 : this.units;
   };

   Course.prototype.get_units = function () { return this.units; };

   Course.prototype.set_units = function (val, error) {
      var that = this;

      tci_tools.set_int(val, function (intgr) {
         that.units = intgr;
         that.update();
      }, error, errors.units_nan);
   };

   tci_tools.get_set('name', Course);
   tci_tools.get_set('grade_high', Course);
   tci_tools.get_set('grade_low', Course);
   tci_tools.get_set('repeat', Course);
   tci_tools.get_set('prev_grade', Course);

   var Calculator = function (spec) {
      var cur_grades;
      var courses = [];
      var final_gpa = Final_GPA(spec);

      spec.update = function () {
         return spec.update_calc({
            courses: courses,
            cur_grades: cur_grades,
            final_gpa: final_gpa,
            repeat: spec.repeat,
            cumulative: spec.cumulative
         });
      };

      cur_grades = Cur_Cumulative(spec);

      for (var i = 0; i < (spec.num_courses || 3); i++) {
         courses.push(new Course(spec));
      }

      return {
         refresh: spec.update(),
         get_cur_grades: function () { return cur_grades; },
         get_courses: function () { return courses; },
         add_course: function () {
            courses.push(new Course(spec));
         },
         remove_last_course: function () {
            courses.pop();
            spec.update();
         },
         set_repeat: function (val) { 
            spec.repeat = val;
            spec.update();
         },
         set_cumulative: function (val) {
            spec.cumulative = val;
            spec.update();
         }
      };
   };

   return {
      init: Calculator
   };
}());
