/**
 * gpa_calc.js
 *
 * GPA Calculator Javascript code
 *
 * Last Updated: 2/9/11
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
 * Default number of class rows to display on the page.
 */
var numRows = 3;

/**
 * Checks the requirements for a repeat and throws an error if they are not met.
 * User must have filled out the cumulative units and GPA, and class unit count.
 *
 * Used for the repeat[] and gradePrev[] ids.
 */
var repeatCheck = function() {
	var row = 0;
	for (row = 0; row < numRows; row++) {
		if (getNames("repeat[]")[row] === this || getNames("gradePrev[]")[row] === this) {
			break;
		}
	}
	
	units = getNames("units[]")[row].value;
	curGPA = getId("curGPA").value;
	curUnits = getId("curUnits").value;
	if (isRealNumber(curUnits) && isRealNumber(curGPA) && isRealNumber(units)) {
		
		if (checkRepeats(curGPA, curUnits)) {
			processGPA();
      }
		else {
			this.checked = false;
			this.selectedIndex = 0;
			alert("There are too many repeat classes selected for the cumulative unit count and GPA you have specified. (You would have a GPA of over 4.0)");
		}
	}
	else {
		this.checked = false;
		this.selectedIndex = 0;
		alert("You must set current cumulative GPA, cumulative units, and the number of units for this class to use the repeat class feature.");
	}
};

/**
 * Checks whether the units value is correct, so whether it is a real number
 * with a length greater than zero.
 */ 
var unitsFunc = function() {
	if (!isRealNumber(this.value) && this.value.length > 0) {
		this.value = "";	
		alert("Incorrect units value entered");
	}
	processGPA();
};

/**
 * Starts the GPA calculator. Checks for URL parameters to set the cumulative GPA and units.
 * Initializes numRows number of class rows. Turns off the repeat column initially.
 */
window.onload = function() {
   $('#container').on('click', 'div.expandPane', function (event) {
      $(this).siblings('div.expandPane').children('ul').slideUp('fast');
      $(this).children('ul').slideToggle('fast');
   });

	$.fn.exists = function () {
		return $(this).length !== 0;
	}
	
	if (getUrlVars()['gpa'] && getUrlVars()['units']) {
		getId("curGPA").value = getUrlVars()['gpa'];
		getId("curUnits").value = getUrlVars()['units'];
		processGPA();
		toggleCumGPA();
	}
	
	for (var i = 0; i < numRows; i++) {
		getNames("units[]")[i].onkeyup = unitsFunc;
		getNames("gradeHigh[]")[i].onchange = function() {processGPA();};
		getNames("gradeLow[]")[i].onchange = function() {processGPA();};
		
		getNames("repeat[]")[i].onchange = repeatCheck;
		getNames("gradePrev[]")[i].onchange = repeatCheck;
	}
	
	gpaCheck = function() {
		if (setGPA())
			processGPA();
		else if (!isRealNumber(this.value) && this.value != "") {
			this.value = "";
			alert("Incorrect GPA or Cumulative Units value entered.");
		}
		else {
			getId("effUnits").value = "";
			getId("effQps").value = "";
			processGPA();
		}
	};
	getId("curGPA").onkeyup = gpaCheck;
	getId("curUnits").onkeyup = gpaCheck;
	toggleRepeat();
}

/**
 * Adds a new class row to the table, and sets up the change handlers.
 */
function addNewRow() {
	$("#termUnits tr:last").after(function() {
		var str = "<tr>";
		str += $("#newRow").html();
		str += "</tr>";
		
		return str;
	});	
	
	getNames("units[]")[numRows].onkeyup = unitsFunc;
	getNames("gradeHigh[]")[numRows].onchange = function() {processGPA();};
	getNames("gradeLow[]")[numRows].onchange = function() {processGPA();};
	
	getNames("repeat[]")[numRows].onchange = repeatCheck;
	getNames("gradePrev[]")[numRows].onchange = repeatCheck;
	
	numRows++;
}

/**
 * Removes the last class row from the table. numRows must be greater than
 * 1. (There must be more than one row in the table to delete a row.)
 */
function removeRow() {
	if (numRows > 1) {
		$("#termUnits tr:last").remove();
		numRows--;
		processGPA();
	}
}

/**
 * Toggles display or hide of the repeat column in the class table.
 */
function toggleRepeat() {
	if ($("td[name='repeatCell']:hidden").exists()) {
		$("td[name='repeatCell']").toggle(true);
		$("th[name='repeatCell']").toggle(true);
		$("#repeatButton").html("Hide Repeats");
		processGPA();
	}
	else {
		$("td[name='repeatCell']").toggle(false);
		$("th[name='repeatCell']").toggle(false);
		$("#repeatButton").html("Show Repeats");	
		processGPA();
	}
}

/**
 * Toggles the cumulative GPA table. This function is called when the
 * user passes in their cumulative gpa and units as parameters, or when
 * the Hide Cumulative GPA button is pressed.
 */
function toggleCumGPA() {
	if ($("#cumGPA:hidden").exists()) {
		$("#cumGPA").toggle(true);
		$("#cumGPAButton").html("Hide Cumulative GPA");
	}
	else {
		$("#cumGPA").toggle(false);
		$("#cumGPAButton").html("Edit Cumulative GPA");	
	}
}

/**
 * Gets the URL variables from the URL and returns them as an array of
 * values, referenced by the name of the value.
 */
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
	
    return vars;
}

/**
 * Returns true if the cumulative GPA and units are valid values, and if so
 * this function sets the effective units and quality points to the cumulative GPA
 * and units. Returns false if either value is invalid.
 */
function setGPA() {
	var curUnits = getId("curUnits");
	var curGPA = getId("curGPA");
	var effUnits = getId("effUnits");
	var effQps = getId("effQps");
	
	if (isRealNumber(curUnits.value)) {
		if (isRealNumber(curGPA.value)) {
			effUnits.value = curUnits.value;
			effQps.value = printRealNum(curUnits.value) * printRealNum(curGPA.value);
			return true;
		}
	}
	
	return false;
}

/**
 * Processes all of the classes the user has entered, and tallies up the unit
 * and quality point count, and lastly displays the calculated GPAs and unit counts.
 */
function processGPA() {
	setGPA();
	var effUnits = getId("effUnits");
	var effQps = getId("effQps");
	var gpaHigh = getId("gpaHigh");
	var gpaLow = getId("gpaLow");
	var ptsHigh = getId("qPointsHigh");
	var ptsLow = getId("qPointsLow");
	var totUnit = getId("totUnits");
	
	updateQualPts();
	updateRepeats(effUnits, effQps);
	var newUnits = printRealNum(effUnits.value);
	var newQps = printRealNum(effQps.value);
	
	totUnit.value = newUnits + addColumn("units");
	ptsHigh.value = addColumn("highPoints") + newQps;
	ptsLow.value = addColumn("lowPoints") + newQps;
	gpaHigh.value = updateGPA(ptsHigh.value, totUnit.value);
	gpaLow.value = updateGPA(ptsLow.value, totUnit.value);
}

/**
 * Returns a fixed, floating-point number with two significant figures
 * representing the GPA, when given the quality points qp and the number
 * of units units. If either value is not a number, this function 
 * will return 0.00
 */
function updateGPA(qp, units) {
	if (printRealNum(units) > 0 && printRealNum(qp) > 0) {
		return (qp / units).toFixed(2);
	}
	else return (0).toFixed(2);
}

/**
 * Calculates the quality points and units that must be subtracted off the
 * total units and total quality points to accurately represent a repeated
 * class. If the repeat column is not visible, this function does nothing.
 * effUnits and effQps should be hidden text boxes that store temporary
 * total unit and quality point values.
 */
function updateRepeats(effUnits, effQps) {
	if ($("td[name='repeatCell']:visible").exists()) {
		for (var i = 0; i < numRows; i++) {
			if (getNames("repeat[]")[i].checked) {
				effQps.value = printRealNum(effQps.value) - printRealNum(getNames("units[]")[i].value) * printRealNum(getNames("gradePrev[]")[i].value);
				effUnits.value = printRealNum(effUnits.value) - printRealNum(getNames("units[]")[i].value);
			}
		}
	}
}

/**
 * Updates all of the row's quality points based on the units and the
 * grade they have selected for the class.
 */
function updateQualPts() {
	for (var i = 0; i < numRows; i++) {
		var units = printRealNum(getNames("units[]")[i].value);
		getNames("highPoints[]")[i].value = units * printRealNum(getNames("gradeHigh[]")[i].value);
		getNames("lowPoints[]")[i].value = units * printRealNum(getNames("gradeLow[]")[i].value);
	}
}

/**
 * Adds up all of the values in a particular column of input fields. The
 * name of the input field should be col + "[]", and the function returns
 * the numerical addition of all of the fields.
 */
function addColumn(col) {
	var totValue = 0;
	
	for (var i = 0; i < numRows; i++) {
		var curVal = getNames(col + "[]")[i].value;
		totValue += printRealNum(curVal);
	}
	
	return totValue;
}

/**
 * Checks all of the repeat columns currently selected to make sure that
 * the GPA does not exceed 4.0 with the repeat selected and that the student
 * has enough quality points in the cumulative GPA count to use a repeat.
 * Returns true if these conditions are met, false if not.
 */
function checkRepeats(curGPA, curUnits) {
	var goodQps = printRealNum(curGPA * curUnits);
	var goodUnits = printRealNum(curUnits);
	
	for (var i = 0; i < numRows; i++) {
		if (getNames("repeat[]")[i].checked) {
			goodQps -= printRealNum(getNames("units[]")[i].value) * printRealNum(getNames("gradePrev[]")[i].value);
			goodUnits -= printRealNum(getNames("units[]")[i].value);
		}
	}
	
	if (goodQps <= 0 || goodUnits <= 0 || (goodQps / goodUnits) > 4) return false;
	else return true;
}

/**
 * Returns true if the variable num is a real number, false if not.
 */
function isRealNumber(num) {
	if (!isNaN(parseFloat(num)) && parseFloat(num) > 0)
		return true;
		
	else return false;
}

/**
 * Returns a float representation of the variable num, if it is a real
 * number. If not, returns 0.
 */
function printRealNum(num) {
	if (!isNaN(parseFloat(num)))
		return parseFloat(num);
		
	else return 0;
}

/**
 * Returns the document element referenced by the id given.
 */
function getId(id) {
	return document.getElementById(id);	
}

/**
 * Returns all of the elements with the name given.
 */
function getNames(name) {
	return document.getElementsByName(name);	
}

/**
 * Toggles the visibility of the ul elements in the div element given.
 */
function togglePane(divpane) {
	$(divpane).children("ul").slideToggle('fast');
}
