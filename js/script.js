var rowCount = 0;
	var temp = 0;
	var progBar="";
	var progressElement="";
	var sortAscName = true;
	var sortAscUse = true;
	var sortAscCap = true;
	var intent = 0;
	var rows = new Array();
	var retrievedObject = new Object();
	var retrievedFavs = new Object();
	var tempFavRows = new Object();
	var index;
	var latlng;

	$(document).on('pageshow', function() {

    var str = $.mobile.activePage.attr('id');

    if (str == "home")
    {
    	loadRows();
    } 
    else if (str == "space")
    {
    	loadRowPage(index);
    }
    else if (str == "favs")
    {
    	loadFavourites();
    }

	});


	function loadRows()
	{
		$.ajax(
		{
			type: 'GET',
			url: 'http://www.jlperet.com.au/james/ss/StudySpaces/files/data.html',
			dataType: 'json',
			timeout: 1500,
			success: function(json)
			{
				    rows = json;

				    var length = rows.length;
				    for (var i = 0; i < length; i++)
				    {
				    	rows[i].count = getPercentage(rows[i].count, rows[i].capacity)
				    }
					// Put rows into local storage
					localStorage.setItem('storedObject', JSON.stringify(rows));
					printRows();
			},
			error: function (x, t, m)
			{
				if(t==="timeout") {
			        getRowsFromStorage();
			    }
			    else
			    {
			        alert("AJAX Error Caught. \nPlease update your internet browser. Alternatively please use Chrome or Firefox.\nx: "+x+"\nt: "+t+"\nm: "+m );
			    }
			}
		});
	}


	function getPercentage(pUse, pCap)
	{
		var temp = pUse;
		temp = temp/pCap*100;
		temp = Math.round(temp/10)* 10;
		if (temp > 100) {temp = 100;}
		return temp;
	}

	function printRows()
	{
		document.getElementById('list').innerHTML = "";
		var output = "<li data-role=\"list-divider\"><table style=\"width:100%;\"><tr><td  style=\"width:55%;\"><a href=# onclick=\"sortByName()\">Study Area</a></td><td style=\"width:20%;text-align: center;\"><a href=# onclick=\"sortByUse()\">In Use</td><td  style=\"width:20%; text-align: center;\" ><a href=# onclick=\"sortByCap()\">Max.</td><td  style=\"width:5%;\"></td></tr></table></li>";

		for (var i = 0; i < rows.length; i++) 
		{
		progBar = "<div id=\"container\" style=\"width:100%; height:20px; background: #CCCCCC\"><div id=\"progress-bar\" style=\"width:"+rows[i].count+"%;background: #FF0000; height:100%;\"></div></div>";
		var name = rows[i].space_name;
			output += "<li><a href=\"#space\" onclick=\"setRow(\'"+name+"\')\" data-transition=\"slide\"><table style=\"width:100%;\"><tr><td style=\"width:60%;\">"+rows[i].space_name+"</td><td style=\"width:20%; text-align: center;\">"+progBar+"</td><td style=\"width:20%; text-align: center;\" >"+rows[i].capacity+"</td></tr></table></li>";
		};

		$('#list').append(output).listview('refresh');
	}

	
	function sortByName()
	{
		rows.sort(function(a, b){
		if(sortAscName)
		{
			if(a.space_name < b.space_name) return -1;
			if(a.space_name > b.space_name) return 1;
		}
		else
		{
			if(a.space_name < b.space_name) return 1;
			if(a.space_name > b.space_name) return -1;
		}
		return 0;

		})
		sortAscName = !sortAscName;
		printRows();
	}

	function sortByUse()
	{
		rows.sort(function(a, b){
			if (sortAscUse){ return a.count - b.count;}
			else {return b.count - a.count;}
		})
		sortAscUse = !sortAscUse;
		printRows();
	}
	function sortByCap()
	{
		rows.sort(function(a, b){
			if (sortAscCap){ return a.capacity - b.capacity;}
			else {return b.capacity - a.capacity;}
		})
		sortAscCap = !sortAscCap;
		printRows();
	}

	function Refresh()
	{
		document.getElementById('list').innerHTML = "";
		loadRows();

	}
	function Back()
	{
		history.back();
	}

	function getRowsFromStorage()
	{
		alert("Error contacting server, using most recent data.");
		retrievedObject = localStorage.getItem('storedObject');
		rows = null;
		rows = JSON.parse(retrievedObject);
		printRows();
	}

	function setRow(name)
	{
		for (var i = 0; i< rows.length; i++)
		{
			if (rows[i].space_name == name)
			{
				index = i;
			}
		};
	}

	function loadRowPage(i)
	{

		latlng = rows[i].lat+","+rows[i].long;
		document.getElementById('headingText').innerHTML = ""+rows[i].space_name;
		document.getElementById('textArea').innerHTML = ""+rows[i].shortdesc;
		document.getElementById('cap').innerHTML = "<div id=\"container\" style=\"width:100%; height:30px; background: #CCCCCC\"><div id=\"progress-bar\" style=\"width:"+rows[i].count+"%;background: #FF0000; height:100%;\">"+rows[i].count+"%</div></div>";

		var output = "<li data-role=\"list-divider\"><table width=100%><tr><td style=\"text-align: center;\">Max Seating</td><td width=30% style=\"text-align: center;\" >Power</td><td width=30% style=\"text-align: center;\" >Wifi Signal</td></tr></table></li>";
			output += "<li><table width=100%><tr><td style=\"text-align: center;\">"+rows[i].capacity+"</td><td width=30% style=\"text-align: center;\" ><img src=\"images/"+getImage(rows[i].power)+"\"></td><td width=30% style=\"text-align: center;\" >"+getWifi(rows[i].wifi)+"</td></tr></table></li>";
		document.getElementById('fac_list').innerHTML = output;


		$('#map_canvas').gmap('destroy');

		$('#map_canvas').triggerEvent('resize');	
		$('#map_canvas').gmap({'center': latlng, 'zoom': 19, 'disableDefaultUI':true, 'callback': function() {
			self = this;
			self.addMarker({'position': latlng }).click(function() {
				self.openInfoWindow({ 'content': rows[i].space_name }, this);
			});
		}}); 
	}

	function getImage(str)
	{
		if (str == "Y")
		{
			return "tick.png";
		}
		else
		{
			return "cross.png"
		}
	}

	function getWifi(number)
	{
		var percentage = number*20;
		return "<div id=\"container\" style=\"width:95%; height:20px; background: #CCCCCC\"><div id=\"progress-bar\" style=\"width:"+percentage+"%;background: #00FF00; height:100%;\"></div></div>";
	}



	function loadFavourites()
	{
		document.getElementById('favText').innerHTML = "";
		document.getElementById('fav_list').innerHTML = "";
		retrievedFavs = localStorage.getItem('favourites');
		tempFavRows = null;
		tempFavRows = JSON.parse(retrievedFavs);
		if (tempFavRows == null)
		{
			document.getElementById('favText').innerHTML = "No favourites stored.";
		}
		else
		{
			var output = "<li data-role=\"list-divider\"><table style=\"width:100%;\"><tr><td  style=\"width:45%;\">Study Area</td><td style=\"width:20%;text-align: center;\">In Use</td><td  style=\"width:20%; text-align: center;\" >Max.</td><td  style=\"width:15%;\"></td></tr></table></li>";

			for (var i = 0; i < tempFavRows.length; i++) 
			{
			progBar = "<div id=\"container\" style=\"width:100%; height:20px; background: #CCCCCC\"><div id=\"progress-bar\" style=\"width:"+tempFavRows[i].count+"%;background: #FF0000; height:100%;\"></div></div>";
			var name = tempFavRows[i].space_name;
				output += "<li data-icon=\"false\"><a href=\"#space\" onclick=\"setRow(\'"+name+"\')\" data-transition=\"slide\"><table style=\"width:100%;\"><tr><td style=\"width:45%;\">"+tempFavRows[i].space_name+"</td><td style=\"width:20%; text-align: center;\">"+progBar+"</td><td style=\"width:20%; text-align: center;\" >"+tempFavRows[i].capacity+"</td><td style=\"width:15%; text-align: center;\"></a><a href=# onclick=\"deleteFromFavourites("+i+")\">Remove</a></td></tr></table></li>";
			};

			$('#fav_list').append(output).listview('refresh');
		}

	}

	function addToFavourites()
	{
		//get stored favourites
		retrievedFavs = localStorage.getItem('favourites');
		tempFavRows = JSON.parse(retrievedFavs);
		if (tempFavRows == null)
		{
			tempFavRows = new Array();
			tempFavRows[0] = rows[index];
		}
		else
		{
			for(i=0; i < tempFavRows.length; i++)
			{
				if (tempFavRows[i].space_name == rows[index].space_name)
				{
					alert(rows[index].space_name+" is already in Favourites.");
					return;
				}
			}
			tempFavRows[tempFavRows.length] = rows[index];
		}

		//update the locally stored object
		localStorage.setItem('favourites', JSON.stringify(tempFavRows));
	}
	function deleteFromFavourites(i)
	{
		//get stored favourites
		retrievedFavs = localStorage.getItem('favourites');
		tempFavRows = JSON.parse(retrievedFavs);

		tempFavRows.splice(i, 1);

		//update the locally stored object
		localStorage.setItem('favourites', JSON.stringify(tempFavRows));

		loadFavourites();
	}

	function ClearFav()
	{
		localStorage.removeItem('favourites', JSON.stringify(tempFavRows));
		loadFavourites();
	}

	function Submit()
	{

   var now = new Date()
   var time = now.getHours()+":"+now.getMinutes()+ " on "+now.getDate()+"/"+now.getMonth()+"/"+now.getFullYear();

		var emailToVar = "jvinar@swin.edu.au";
		var emailFromVar = "jvinar@swin.edu.au";
		var subjectVar = "Feedback for study spaces web app";
		var messageVar = "Feedback received at: " +time +"\n"
						+"Name: "+ $("#name").val() +"\n"
						+"Course: "+ $("#course").val() +"\n\n"
						+"Ease of Use: "+ $('input[name="ease-radio"]:checked').val() +"\n"
						+"Aesthetics: "+ $('input[name="aesth-radio"]:checked').val() +"\n"
						+"Usefulness: "+ $('input[name="use-radio"]:checked').val() +"\n"
						+"Accuracy: "+ $('input[name="acc-radio"]:checked').val() +"\n\n"
						+"Comments: \n"+ $("#comments").val() +"\n"



		
		$.post("sendEmail.php",{ emailTo: emailToVar, emailFrom: emailFromVar, subject: subjectVar, message: messageVar }, function(data)
		{
			Back();
		}
		); 
	}

$(document).on( "click", ".show-page-loading-msg", function() {
  var $this = $( this ),
  theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
  msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
  textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
  textonly = !!$this.jqmData( "textonly" );
  html = $this.jqmData( "html" ) || "";
$.mobile.loading( 'show', {
  text: msgText,
  textVisible: textVisible,
  theme: theme,
  textonly: textonly,
  html: html
  });
})
.on( "click", ".hide-page-loading-msg", function() {
  $.mobile.loading( "hide" );
});