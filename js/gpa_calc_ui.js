/**
 * gpa_calc_ui.js
 *
 * GPA Calculator UI code
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
 * Initializes the accordion containers and the GPA Calc demo.
 */
var gpa_calc_ui = (function ($) {

   return {
      init: function (calc) {

         var setError = function (type) {
            $("#calc-err .message").html(type.desc);
            $("#calc-err").show();
         };

         $("#container").on("click", "button.close", function (event) {
            $(this).parent("div.alert-error").hide();
         });

         // Sets the 'Repeat Course' column on or off (on if 'on' is true;
         // off otherwise).
         var setRepeats = function (on) {
            $("td[name='repeatCell']").toggle(on);
            $("th[name='repeatCell']").toggle(on);
            $("#repeatButton").html((on) ? "Hide Repeats" : "Show Repeats");
            calc.set_repeat(on);
         };

         var setCumulative = function (on) {
            $('#curGPAButton').html((on ? "Hide" : "Show") + " Cumulative GPA");
            $('#curGPABox').toggle(on);
            calc.set_cumulative(on);
         };

         // Toggles the 'Repeat Course' column on and off
         var toggleRepeats = function () {
            if ($("td[name='repeatCell']:hidden").length > 1) {
               if (!$('#curGPABox').is(':visible')) {
                  setCumulative(true);
               }

               setRepeats(true);
            }
            else {
               setRepeats(false);
            }
         };


         // initially set repeats to off globally
         setRepeats(false);

         // Set up the onclick event for the repeat toggle button
         $('#repeatButton').click(toggleRepeats);

         // Toggles the Cumulative GPA box on and off
         var toggleCumulative = function () {
            if ($('#curGPABox:hidden').length > 0) {
               setCumulative(true);
            }
            else {
               setCumulative(false);
               setRepeats(false);
            }
         };

         // Set up the onclick event for the cumulative gpa toggle button
         $('#curGPABox').hide();
         $('#curGPAButton').click(toggleCumulative);

         // Set up event handlers for the 'Units Graded' and 'GPA' inputs
         $('#curUnits').change(function (event) {
            calc.get_cur_grades().set_units($(this).val(), setError);
         });
         $('#curGPA').change(function (event) {
            calc.get_cur_grades().set_gpa($(this).val(), setError);
         });

         // We need to set up one event dispatcher for each type of input element
         // present, so we'll makea simple function
         var dispatch = function (listen) {
            // Set up the course listener (using event dispatch)
            // So when we add or delete a course we don't have to explicitly
            // attach an event handler to it
            $('#termUnits').on('change', listen, function (event) {
               // Get the list of courses currently active from the calculator
               var courses = calc.get_courses();
               // Find the row index of the item clicked
               var row = $(this).closest('tr').index();
               var course = courses[row - 1];

               // Now that we have the course, check the name of element they clicked:
               var name = $(this).attr('name');

               if (name === 'units[]') {
                  // Set the units of the course with the value of the input.
                  // If the user inputted something that isn't a number, we'll just
                  // alert them of that and do nothing else.
                  course.set_units($(this).val(), setError);
               }
               else if (name === 'gradeHigh[]') {
                  // Set the high grade (ignoring the error handler because we're
                  // sure that a float is passed)
                  course.set_grade_high($(this).val());
               }
               else if (name === 'gradeLow[]') {
                  // Set the low grade (ignoring the error handler because we're
                  // sure that a float is passed)
                  course.set_grade_low($(this).val());
               }
               else if (name === 'gradePrev[]') {
                  // Set the previous grade (ignoring the error handler because we're
                  // sure that a float is passed)
                  course.set_prev_grade($(this).val());
               }
               else if (name === 'repeat[]') {
                  // Set the repeat flag (ignoring the error handler because we're
                  // sure that a float is passed)
                  course.set_repeat($(this).is(':checked'));
               }
            });
         };

         // And call the dispatchers...
         dispatch('td input');
         dispatch('td select');

         // Add a new row
         $('#addRow').click(function (event) {
            calc.add_course();
            $('#newRow').clone().removeAttr('id').appendTo('#termUnits');
         });

         // Remove the last row
         $('#removeRow').click(function (event) {
            // Minimum # of rows is 3
            if (calc.get_courses().length > 3) {
               calc.remove_last_course();
               $('#termUnits tr:last').remove();
            }
         });
      }
   };
}) (jQuery);
