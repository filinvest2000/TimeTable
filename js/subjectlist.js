// Created by Jaime Peret 15/11/2013
// Copyright 2013 Swinburne University of Technology. 
var rowNumber = 0;
var temp = 0;
var recordTotal = 0;
var schCount = 0;
var searchval = "";
var searchind = "";
var code = "";
var name = "";
var savedCampus = "";
var teachingPeriod = "";
var campusCode = "";
var timeStart = "08:00";
var timeEnd = "23:00"; 
var day0 = "";
var day1 = "";
var day2 = "";
var day3 = "";
var day4 = "";
var day5 = "";
var day6 = "";
var value1 = "";
var value2 = "";
var value3 = "";
var rows_1 = new Array();
var rows_2 = new Array();
var serchedRows = new Array();

//var retrievedsesObject = new Array();

	$(document).on('pagebeforeshow', function() {
    var pajname = $.mobile.activePage.attr('id');
    if (pajname == "search")
    {
		// defines header text in search page.
		document.getElementById('SearchH5Text').innerHTML = "" + "Enter Unit Code or Description to search";
		loadTeachPeriod();
		loadCampusCodes();
	}
	else if (pajname == "resultpage")
    {
	//	alert('resultpage (Document On)');
	//	alert('paj resulpage ' +serchedRows.length);   
		   printResults();

    }
	else if (pajname == "MyTimetable")
    {	
//    	loadSearchResults();
    }	
	});

// $(document).bind('pageinit', function() {
//     $( "#resultList" ).sortable({
//        items: "li:not(.ui-li-divider)"
//     });
//     $( "#resultList" ).sortable();
//     $( "#resultList" ).disableSelection();
//     $( "#resultList" ).bind( "sortstop", function(event, ui) {
//     $('#resultList').listview('refresh');
//     });
//   });
	
$(document).ready(function() {
	$("#reset").click(function() {
            $('input[data-type="search"]').val("");
			searchval = "";
			retrievesesStorage();
			populateTeachPeriod();
			populateCampus();
			
			timeStart = "08:00";
			timeEnd = "23:00"; 
			$("#start-time-filter").val("08:00");
			$("#end-time-filter").val("23:00");	
			$("#start-time-filter").selectmenu('refresh', true);
			$("#end-time-filter").selectmenu('refresh', true); 
			$("input[type='checkbox']").prop("checked",false);
			$("input[type='checkbox']").checkboxradio();
			$("input[type='checkbox']").checkboxradio("refresh");
			
			day0 = "";
			day1 = "";
			day2 = "";
			day3 = "";
			day4 = "";
			day5 = "";
			day6 = "";
    });

      $("#search-unitcode").click(function() {
			document.getElementById('search-unitname').value='';
			searchval = "";
			searchind = "search-unitcode";
        });
		
//Sesrch by Unit code
      $("#search-unitname").click(function() {
			document.getElementById('search-unitcode').value='';
			searchval = "";
			searchind = "ByDesc";
        });		

//on click
		$("input").on("click keyup", function () {
			searchval =($(this).val());
		});	
		
// Subject Search  
	   $("#SearchSubj").click(function() 
	   {
			code = $('#search-unitcode').val();
			name = $('#search-unitname').val();
			teachingPeriod = $( '#teachperiod' ).val();
			campusCode = $( '#campus' ).val();

	   if(code == "" && name=="")
		{
		  alert('Enter Unit Code or Description')
	    }
	   else
	   // Both fields are not empty
	   if(code != "" && name !="")
		{
		  searchind = "ByCode";
		  searchval = code;
          dataloadRequest(searchval,teachingPeriod,searchind,campusCode,timeStart,timeEnd,day0,day1,day2,day3,day4,day5,day6);
	    }
	   else
		if(code != "")
		{
		  searchind = "ByCode";
		  searchval = code;
			dataloadRequest(searchval,teachingPeriod,searchind,campusCode,timeStart,timeEnd,day0,day1,day2,day3,day4,day5,day6);
		}
		else
		{
			searchind = "ByName";
			searchval = name;
			dataloadRequest(searchval,teachingPeriod,searchind,campusCode,timeStart,timeEnd,day0,day1,day2,day3,day4,day5,day6);
		}

        });
	
		$('#saveSchedule').click(function(){
    		$('.checkBoxLeft:checked').each(function(){
	//			alert($(this).val());
				alert($('#checkbox_1').val());
			});
				alert('Save Selected \n =====>TO DO NEXT <====');
		});
	
	
}); //end document.ready


function dayCheckboxClicked(value, checked) {
  //  alert(value +"  " + checked);
	if (checked) {
	//	alert("Value: "+value+"\nChecked: "+checked)
	if (value == "Sunday") {day0 = "Sunday";
	}
	else if (value == "Monday") {day1 = "Monday";
	}
	else if (value == "Tuesday") {day2 = "Tuesday";
	}
	else if (value == "Wednesday") {day3 = "Wednesday";
	}
	else if (value == "Thursday") {day4 = "Thursday";
	}
	else if (value == "Friday") {day5 = "Friday";
	}
	else  if (value == "Saturday") {day6 = "Saturday";
	}		
			
	} else {
//	alert("Value: "+value+"\nChecked: "+checked)
	if (value == "Sunday") {day0 = "";
	}
	else if (value == "Monday") {day1 = "";
	}
	else if (value == "Tuesday") {day2 = "";
	}
	else if (value == "Wednesday") {day3 = "";
	}
	else if (value == "Thursday") {day4 = "";
	}
	else if (value == "Friday") {day5 = "";
	}
	else if (value == "Saturday") {day6 = "";
	}
	}
}

 function selecTime(name, value) {
	if (name == "start-time")
    {
	  timeStart = value; 
	}
	else if (name == "end-time")
    {
	  timeEnd = value; 
    }
	else
	{
	  timeStart = "8:00";
	  timeEnd = "23:00";
	}
}

 // Load Teaching period
	function loadTeachPeriod()
	{
		$.ajax(
		{
			type: 'GET',
			url: '../timetable/data/teachingperiod.txt',
			dataType: 'json',
			success: function(tperiod)
			{
				    rows = tperiod;
				    var length = rows.length;
				    // Put rows into session storage
					sessionStorage.setItem('storedTperiod', JSON.stringify(rows));
					retrievedObject = sessionStorage.getItem('storedTperiod');
					rows_1 = null;
					rows_1 = JSON.parse(retrievedObject);
					populateTeachPeriod();
			},
			error: function (x, t, m)
			{
				if(t==="timeout") {
			        alert("Session timed out 402. \nx: "+x+"\nt: "+t+"\nm: "+m );
			    }
			    else
			    {
			        alert("Error retreiving data 402. \nx: "+x+"\nt: "+t+"\nm: "+m );
			    }
			}
		});
	}

// Load Campus Codes
	function loadCampusCodes()
	{
		$.ajax(
		{
			type: 'GET',
			url: '../timetable/data/Campus.txt',
			dataType: 'json',
			success: function(tcampus)
			{
				    rows = tcampus;
				    var length1 = rows.length;
				    // Put rows into session storage
					sessionStorage.setItem('storedCampus', JSON.stringify(rows));
					retrievedCampus = sessionStorage.getItem('storedCampus');
					rows_2 = null;
					rows_2 = JSON.parse(retrievedCampus);
					populateCampus();
			},
			error: function (x, t, m)
			{
				if(t==="timeout") {
			        alert("Session timed out 403. \nx: "+x+"\nt: "+t+"\nm: "+m );
			    }
			    else
			    {
			        alert("Error retreiving data 403. \nx: "+x+"\nt: "+t+"\nm: "+m );
			    }
			}
		});
	}

 function retrievesesStorage()
	{
		retrievedObject = sessionStorage.getItem('storedTperiod');
		if (retrievedObject != null) {
		rows_1 = null;
		rows_1 = JSON.parse(retrievedObject);
		}
		
		retrievedCampus = sessionStorage.getItem('storedCampus');
		if (retrievedCampus != null) {
		rows_2 = null;
		rows_2 = JSON.parse(retrievedCampus);
		}
	}

	function populateTeachPeriod()
	{
		document.getElementById('teachperiod').innerHTML = "";
		var linecode = "<option value=\"All\">All</option>";
		for (var i = 0; i < rows_1.length; i++)
		{
			linecode += '<option value="' +rows_1[i].TT_SEM_CODE+ '">' +rows_1[i].TEACHING_PERIOD_DESC+ '</option>';
		};
		$('#teachperiod').append(linecode).selectmenu("refresh");
	}

	function populateCampus()
	{
		document.getElementById('campus').innerHTML = "";
		var linecode = "<option value=\"All\">All</option>";
		 
		for (var i = 0; i < rows_2.length; i++)
		{
			linecode += '<option value="' +rows_2[i].CAMPUS_CODE+ '">' +rows_2[i].CAMPUS_DESC+ '</option>';
		};
		$('#campus').append(linecode).selectmenu("refresh");
	}

// //Request data
function dataloadRequest(searchBy,teachPeriod,serchInd,campusCod,timefrm,timeto,day0,day1,day2,day3,day4,day5,day6)
	{
		$.ajax(
		{
			type: 'GET',
			url: '../timetable/data/timetable.txt',
			dataType: 'json',
			success: function(timetbl)
			{
				var tmtblrows = new Array();
				var temprows = new Array();
				tmtblrows = timetbl;
				var length = tmtblrows.length;
				var ii = 0;
		//		alert("Length: "+length+"SearchBy: "+searchBy );
				for (var i = 0; i < length; i++)
				{
				   	if (tmtblrows[i].MODULE_CODE == searchBy) {
		//				alert("Searchby: "+searchBy+"tmtblrow[i]: "+tmtblrows[i].MODULE_CODE );
						temprows[ii] = tmtblrows[i];
						ii++;
					}
				}
					recordTotal = temprows.length
	//				alert('recordTotal: '+recordTotal);
					if (recordTotal > 0)
					{
					  temprows = temprows.sort(recordSort("CAMPUS_CODE","up"));
					}
		//	alert('temprows length= ' +temprows.length);
				// Put tmtblrows into session storage
					sessionStorage.setItem('storedTimetable', JSON.stringify(temprows));
					retrieveResults();
					alert("Parameters to pass : \nSEARCH IND: "+serchInd+"\nSEARCH VALUE: "+searchBy+"\nTEACH PERIOD: "+teachPeriod+"\nCampus: "+campusCod+"\nStart Time: "+timefrm+"\nEnd Time:"+timeto+"\nDay0: "+day0+"\nDay1: "+day1+"\nDay2: "+day2+"\nDay3: "+day3+"\nDay4: "+day4+"\nDay5: "+day5+"\nDay6: "+day6);
					window.location.hash = 'resultpage';
			},
			error: function (x, t, m)
			{
				if(t==="timeout") {
			        alert("Session timed out 401. \nx: "+x+"\nt: "+t+"\nm: "+m );
			    }
			    else
			    {
			        alert("Error retreiving data 401. \nx: "+x+"\nt: "+t+"\nm: "+m );
			    }
			}
			
		});
			
	}


function retrieveResults()
	{
		retrievedObject = sessionStorage.getItem('storedTimetable');
		serchedRows = null;
		serchedRows = JSON.parse(retrievedObject);
		var savedCampus = "";
	//		alert('serchedRows ' +serchedRows.length);
	}
	
function printResults()
{
    alert('printResults recordtotal= ' +recordTotal);
	if (recordTotal == 0)
		{
			document.getElementById('collapslist').innerHTML = "";
			var html = '<div id="resultText">No schedule found.</div>';
			$('#collapslist').append(html) 
			$('#collapslist').trigger('create');
			
		}
		
	if (recordTotal > 0)
	{
		savedCampus = serchedRows[0].CAMPUS_CODE;
		var counter = 0
		for (var i = 0; i < serchedRows.length; i++) 
		if (savedCampus == serchedRows[i].CAMPUS_CODE)
			{
			counter++ 
			}
		else
			{
			sessionStorage.setItem(savedCampus, counter);
			savedCampus = serchedRows[i].CAMPUS_CODE;
			counter = 1
			} 
		sessionStorage.setItem(savedCampus, counter);
		
		savedCampus = "";
		document.getElementById('collapslist').innerHTML = "";
		var html = '<div id="collapsible-set" data-role="collapsible-set" data-theme="b" data-content-theme="d">';
		for (var i = 0; i < serchedRows.length; i++) 
		{
			if (savedCampus != serchedRows[i].CAMPUS_CODE)
			{
			var value1 = sessionStorage.getItem(serchedRows[i].CAMPUS_CODE);
	//		alert("Campus "+serchedRows[i].CAMPUS_CODE+ "Value1= " +value1);
			if (savedCampus != "") 
	//		alert("savedCampus: " +savedCampus );
			{
			html +=	'</ul></div>';
			}
			savedCampus = serchedRows[i].CAMPUS_CODE;
			// Campus
			html += '<div id="collapsible" data-role="collapsible">';
			html += '<h4><div>'+serchedRows[i].CAMPUS_CODE+ ' Campus<span id="recfound">Found: '+value1+'</span></div></h4>';
			html += '<ul id="list_1" data-role="listview" data-filter="true" data-filter-theme="c" data-divider-theme="d">';
			
			html += '<li data-role="list-divider">Group: ' +serchedRows[i].ACTIVITY_TYPE+ '  Activity: '+serchedRows[i].CLASS_NUMBER+  '<span class="ui-li-count">Avail: '+serchedRows[i].AVAILABILITY_NUMBER+'</span></li>';
			html += '<li>';
			html += '<label style="border-top-width: 0px;margin-top: 0px;border-bottom-width: 0px;margin-bottom: 0px;border-left-width: 0px;border-right-width: 0px;" data-corners="false">';
			html += '<fieldset data-role="controlgroup"><input type="checkbox" name="checkbox_1" id="checkbox_1" class="checkBoxLeft" data-theme="c"/>';                    
			html += '<label for="checkbox_1" style="border-top-width: 0px;margin-top: 0px;border-bottom-width: 0px;margin-bottom: 0px;border-left-width: 0px;border-right-width: 0px;">';
			html += '<label  style="padding:10px 0px 0px 10px;"><p>Group: '+serchedRows[i].ACTIVITY_TYPE+' Activity: '+serchedRows[i].CLASS_NUMBER+'</p><p><strong>'+serchedRows[i].MODULE_CODE + '_' +serchedRows[i].CAMPUS_CODE + '_' + serchedRows[i].MODULE_SEM+'</strong></p><p><strong>'+serchedRows[i].MODULE_DESC+'</strong></p>';
			html += '<p><strong>Day: '+serchedRows[i].START_DAY+ ' Time: '+serchedRows[i].START_TIME+'</strong></p><p><strong>Start Date: '+serchedRows[i].START_DATE+'</strong></p>';
			html += '<p><strong>Loc: '+serchedRows[i].ROOM_CODE+'  Staff: '+serchedRows[i].STAFF_USERNAME+'</strong></p><p><strong>Weeks: '+serchedRows[i].TEACHING_WEEK_PATTERN+'</strong></p>';
			html += '</label></label</fieldset></label></li>';
			
			}
			else
			{
			html += '<li data-role="list-divider">Group: ' +serchedRows[i].ACTIVITY_TYPE+ '  Activity: '+serchedRows[i].CLASS_NUMBER+  '<span class="ui-li-count">Avail: '+serchedRows[i].AVAILABILITY_NUMBER+'</span></li>';
			html += '<li>';
			html += '<label style="border-top-width: 0px;margin-top: 0px;border-bottom-width: 0px;margin-bottom: 0px;border-left-width: 0px;border-right-width: 0px;" data-corners="false">';
			html += '<fieldset data-role="controlgroup"><input type="checkbox" name="checkbox_1" id="checkbox_1" class="checkBoxLeft" data-theme="c"/>';                    
			html += '<label for="checkbox_1" style="border-top-width: 0px;margin-top: 0px;border-bottom-width: 0px;margin-bottom: 0px;border-left-width: 0px;border-right-width: 0px;">';
			html += '<label  style="padding:10px 0px 0px 10px;"><p>Group: '+serchedRows[i].ACTIVITY_TYPE+' Activity: '+serchedRows[i].CLASS_NUMBER+'</p><p><strong>'+serchedRows[i].MODULE_CODE + "_" +serchedRows[i].CAMPUS_CODE + '_' + serchedRows[i].MODULE_SEM+'</strong></p><p><strong>'+serchedRows[i].MODULE_DESC+'</p>';
			html += '<p><strong>Day: '+serchedRows[i].START_DAY+' Time: '+serchedRows[i].START_TIME+'</strong></p><p><strong>Start Date: '+serchedRows[i].START_DATE+'</strong></p>';
			html += '<p><strong>Loc: '+serchedRows[i].ROOM_CODE+' Staff: '+serchedRows[i].STAFF_USERNAME+'</strong></p><p><strong>Weeks: '+serchedRows[i].TEACHING_WEEK_PATTERN+'</strong></p>';
			html += '</label></label</fieldset></label></li>';
			}
	    
		};
			html +=	'</ul></div>';
		   
		
		html +=	'</div>';
		$('#collapslist').append(html)
		// Force create the collapeible list. 
		$('#collapslist').trigger('create');
	}
}


function recordSort(sortProperty, sortsequence){
	var thisMethod = function(a,b){
		var valueA = a[sortProperty];
		var valueB = b[sortProperty];
		if(typeof valueA != "number" && typeof valueA != "object"){
			var valueA = a[sortProperty].toLowerCase();
			var valueB = b[sortProperty].toLowerCase();
		}
		if(sortsequence.toLowerCase() == "up"){
			if (valueA < valueB) {return -1}
			if (valueA > valueB) {return 1}
		}else{
			if (valueA > valueB) {return -1}
			if (valueA < valueB) {return 1}
		}
		return 0;
	}
	return thisMethod;
}	

