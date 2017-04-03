function MenuChoice(selection)
{
	document.getElementById("customerlist").style.visibility = "hidden";
	document.getElementById("orderhistory").style.visibility = "hidden";
	document.getElementById("update").style.visibility = "hidden";
	
	switch (selection)
	{
		case "customerlist":
			// Makes the Store List HTML section visible
			document.getElementById("customerlist").style.visibility = "visible";
			// Calls the function that creates the store list
			ListCustomers();
			break;
		
		case "orderhistory":
			// Makes the Order History List HTML section visible
			document.getElementById("orderhistory").style.visibility = "visible";
			break;
		
		case "update":
			document.getElementById("update").style.visibility = "visible";
			break;
		
		case "None":
			// No menu item selected so no section should be displayed
			break;
		
		default:
			alert("Please select a different menu option");
	}
}

// This sends a request to the GetAllStores service & creates a table with the data returned
function ListCustomers() //This sends a request to the getAllCustomers service and creates a table with the data returned
{
   var xmlhttp = new XMLHttpRequest(); //Creates the XMLHttpRequest object
   var url = "https://student.business.uab.edu/jsonwebservice/service1.svc/getAllCustomers"; //URL for the service

   xmlhttp.onreadystatechange = function() //creates an event handler for the service request
   {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      {
         var output = JSON.parse(xmlhttp.responseText); //Captures the data returned form the service and puts in an object
         GenerateOutput(output); //Calls the function that creates the output table and passes the data object to it
      }
   }
   xmlhttp.open("GET", url, true); //Sets the options for requesting the service
   xmlhttp.send(); //Calls the service

   function GenerateOutput(result) //This function receives the data form the service and creates a table to display it
   {
      var display = "<table><tr><th>Update</th><th>Customer ID</th><th>Company Name</th><th>Company City</th></tr>"; //Table Headings
      var count = 0; //Count variable to loop
      var customerid = ""; //Variable to store the Customer ID
      var companyname = ""; //Variable to store the Company Name
      var companycity = ""; //Variable to store the Company City

      for(count = 0; count < result.GetAllCustomersResult.length; count ++) //Loop for creating table rows
      {
//Anchor link: <a href="javascript:function("parameter");"> 
				customerid = result.GetAllCustomersResult[count].CustomerID; //Assigns the Customer ID to a variable
				companyname = '<a href="javascript:Orders('+"'"+customerid +"');"+'">'; //Assign hyperlink and store id
				companyname += result.GetAllCustomersResult[count].CompanyName;
				companyname += '</a>';
				companycity = result.GetAllCustomersResult[count].City; //Assigns the City to a variable
				display += '<tr><td><button onclick="StoreInfo(' + "'" + customerid + "')" + '">Update Info</button></td><td>' + customerid + "</td><td>" + companyname + "</td><td>" + companycity + "</td></tr>"; //Creates a table row with button
      }
				display += "</table>"; //Closes the table HTML after table rows are added
				document.getElementById("customerlist").innerHTML = display; //Displays the table in the HTML page
   }
}

	// Retrieves a list of books ordered by a particular store using the store ID for the search
	function Orders(orderid)
	{
		var xmlhttp = new XMLHttpRequest();
		
		// Service URL
		var url = "https://student.business.uab.edu/WebAppService/service1.svc/getOrdersForCustomer/";
		
		// Store ID to complete Service URL
		url += orderid;
		
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var output = JSON.parse(xmlhttp.responseText);
				
				GenerateOutput(output);
			}
		}
		
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
		
		// Function that displays results
		function GenerateOutput(result) {
			var display = "<table><tr><th>Book Name</th><th>Total Ordered</th></tr>";
			
			var count = 0;
			
			for(count = 0; count < result.length; count++)
				{
					display += "<tr><td>" + result[count].BookName + "</td><td>" + result[count].SaleNumber + "</td></tr>";
				}
				
					display += "</table>";
					document.getElementById("books").innerHTML = display;
		}
	}
	
function StoreInfo(customerid)
{
var xmlhttp = new XMLHttpRequest();
var url = "https://student.business.uab.edu/jsonwebservice/service1.svc/GetCustomerOrderInfo/";
//var url = "https://student.business.uab.edu/WebAppService/service1.svc/GetCustomerOrderInfo/";


url += customerid;

xmlhttp.onreadystatechange = function()
   {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      {
         var output = JSON.parse(xmlhttp.responseText);
				 // test
				 	var outcome = result.WasSuccessful;
					var error = result.Exception;
				 // test end
				 //document.getElementById("orderdate").value = output[0].OrderDate;
         document.getElementById("orderid").value = output[0].OrderID;
         document.getElementById("shipaddress").value = output[0].ShipAddress;
         document.getElementById("shipcity").value = output[0].ShipCity;
         document.getElementById("shipname").value = output[0].ShipName;
         document.getElementById("shippostcode").value = output[0].ShipPostCode;
				 //document.getElementById("shippeddate").value = output[0].ShippedDate;
         MenuChoice("customerlist");
      }
   }
   xmlhttp.open("GET", url, true);
   xmlhttp.send();
}
	
	// This function executes an update operation on the Store Name & Store City
	function CustomerUpdate()
		{
			var xmlhttp = new XMLHttpRequest();
			
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp == 200) {
					var result = JSON.parse(xmlhttp.responseText);
					var outcome = result.WasSuccessful;
					var error = result.Exception;
					// Calls the function that displays the result in an alert message
					OperationResult(outcome, error);
					
					// Calls the menu choice function to display the store list
					MenuChoice("customerlist");
				}
			}
			
			//var url = "https://student.business.uab.edu/jsonwebservice/service1.svc/updateStoreAddress/";
			var url = "https://student.business.uab.edu/jsonwebservice/service1.svc/updateOrderAddress/";
			var orderid = Number(document.getElementById("orderID").value);
			var shipname = document.getElementById("storename").value;
			var shipcity = document.getElementById("storecity").value;
			
			// Creates the JSON string to be sent for the update operation
			var parameters = '{"StoreID":' + orderid + ',"StoreName":"' + shipname + '", "StoreCity":"' + shipcity + '"}';
			xmlhttp.open("POST", url, true);
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlcoded");
			xmlhttp.send(parameters);
		}
		
		// Function that displays the result of an operation that adds, deletes, or updates data
		// The function is involved from other functions
		function OperationResult(success, exception)
		{
			switch (success)
			{
				case 1:
					alert("The operation was successful");
					break;
				case 0:
					alert("The operation was not successful:\ " + exception);
					break;
				case -2:
					alert("The operation was not successful because the data string supplied could not be deserialized into the service object.");
					break;
				case -3:
					alert("The operation was not successful because a record with the supplied Order ID could not be found");
					break;
				default:
					alert("The operation code returned is not identifiable.");
			}
		}






