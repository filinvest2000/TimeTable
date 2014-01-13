
	loadCampusFromXml();


	var rowCount = 0;
	var temp = 0;
	var sortAscCampus = true;
	var sortAscRoom = true;
	var sortAscUnit = true;
	var sortAscModule = true;
	var rows = new Array();
	var retrievedObject = new Array();
	
	function loadCampusFromXml()
	{
		rowCount = 0;
	    $.ajax(
		{
				type: "GET", 
				url: "Campuses.xml",
				dataType: "xml", 
				success: function(xml){ 
				var campusArray = new Array();
	            $(xml).find('campus').each(function(){
						var campcd = $(this).find('code').text();
						var name = $(this).find('desc').text();
                        if( jQuery.inArray(name, campusArray) == -1 ){			
					rows[rowCount] = new Object();
					rows[rowCount].campusCode = ($(this).find('code').text());
					rows[rowCount].campusDesc = ($(this).find('desc').text());
					campusArray.push(campcd, name);
					rowCount++;
					}
				// Put rows into local storage
				sessionStorage.setItem('testObject', JSON.stringify(rows));
				printCampusRows();												}
	);
	},
			error: function(x, t, m) 
			{
			    if(t==="timeout") {
			        getRowsFromStorage();
			    }
			    else
			    {
			        alert("Your browser does not support this page. Please update your internet browser. Alternatively please use Chrome or Firefox. Thank you.");
			    }
		    }
		});
	}

// Print Campus rows	
	function printCampusRows()
	{
		document.getElementById('campuslist').innerHTML = "";
		var output = "<li data-role=\"list-divider\" <table><tr><td><a href=# onclick=\"sortByCampus()\"><h4>Campus</h4></a></td></tr></table></li>";
		for (var i = 0; i < rows.length; i++) 
		{
			output += "<li><a href=\"subjectlist.html?campus="+rows[i].campusCode+"\" data-ajax=\"false\"> <table><tr><td width=60%>"+rows[i].campusDesc+"</td></tr></table></a></li>";
		};
		$('#campuslist').append(output).listview('refresh');
	}
		
		
	function sortByCampus()
	{
		rows.sort(function(a, b){
		if(sortAscCampus)
		{
			if(a.campusDesc < b.campusDesc) return -1;
			if(a.campusDesc > b.campusDesc) return 1;
		}
		else
		{
			if(a.campusDesc < b.campusDesc) return 1;
			if(a.campusDesc > b.campusDesc) return -1;
		}
		return 0;

		})
		sortAscCampus = !sortAscCampus;
		printCampusRows();
	}
	
	
		function getRowsFromStorage()
	{
		//alert("Error contacting server, using most recent data.");
		retrievedObject = sessionStorage.getItem('testObject');
		rows = null;
		rows = JSON.parse(retrievedObject);
		printCampusRows();
	}
	
		
	function refreshCampus()
	{
		//Clear the list1
		document.getElementById('campuslist').innerHTML = "";

		//Load from the xml web service
		loadCampusFromXml();
		printCampusRows();
	}
	
	function loadDemo() {
if(navigator.geolocation) {
document.getElementById("index").innerHTML = "Geolocation supported.";
} else {
document.getElementById("index").innerHTML = "Geolocation is not supported in your browser.";
}
}