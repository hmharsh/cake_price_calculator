   // On load
   var Result = []
   var totalPrice=0
   window.onload = function() {
   document.getElementById("ingredientDetails").style.display='none';
   document.getElementById("ingredientTableDiv").style.display='none';
   document.getElementById("name").innerHTML = "";
   document.getElementById("unit").innerHTML = "";
   document.getElementById("perUnit").innerHTML = "";
   document.getElementById("price").value = 0
   document.getElementById("brand").innerHTML = "";
   document.getElementById("comment").value = "";
   document.getElementById("seller").innerHTML = "";
   document.getElementById("totalPrice").innerHTML = totalPrice;
   };

   // Get drop down populated with ingredient name
   var select = document.getElementById("selectIng");
   for(var i = 0; i < itemDetails.length; i++) {
       var opt = itemDetails[i].name;
       var el = document.createElement("option");
       el.textContent = opt;
       el.value = opt;
       select.appendChild(el);
   }


function ingChange(){
   document.getElementById("ingredientDetails").style.display='block';
   document.getElementById("quantity").value = "";
   for(var i = 0; i < itemDetails.length; i++) {
       if ($('#selectedIng').val() == itemDetails[i].name) {
           document.getElementById("name").innerHTML = itemDetails[i].name;
           document.getElementById("unit").innerHTML = itemDetails[i].unit;
           document.getElementById("perUnit").innerHTML = itemDetails[i].unit;
           document.getElementById("price").value = parseFloat(itemDetails[i].price);
           document.getElementById("brand").innerHTML = itemDetails[i].brand;
           document.getElementById("comment").value = itemDetails[i].comment;
           document.getElementById("seller").innerHTML = itemDetails[i].seller;
       }
   }
   document.getElementById("ingredientPrice").innerHTML=0
   document.getElementById("price").disabled = false
   }

   // On change in Quantity
   function changeQuantity(newQuantity){
       if (newQuantity == "") {
           document.getElementById("ingredientPrice").innerHTML = 0
       } else {
         document.getElementById("price").disabled = true
         document.getElementById("ingredientPrice").innerHTML = (parseFloat(document.getElementById('price').value)*parseFloat(document.getElementById("quantity").value))
       }
   }

   // On add button click
   function addIngredient(){
    if (parseFloat(document.getElementById("price").value)*document.getElementById("quantity").value == 0){
      alert("Price should be more than zero")
      return(0)
    }

    // Validate
    var alreadyPresent = false
    for(i=0;i<Result.length;i++){
        if(Result[i].name == document.getElementById("name").innerHTML){
            alreadyPresent = true
        }
    }

    // Add
    if (!alreadyPresent) {
       Result.push(
           {
               "name": document.getElementById("name").innerHTML,
               "price": parseFloat(document.getElementById("price").value)*document.getElementById("quantity").value,
               "brand": document.getElementById("brand").innerHTML,
               "seller": document.getElementById("seller").innerHTML,
               "quantity": parseFloat(document.getElementById("quantity").value) + " " + document.getElementById("perUnit").innerHTML,
               "comment": document.getElementById("comment").value
           }  
       )
       refreshTable(Result)
       refreshPrice()
       document.getElementById("ingredientTableDiv").style.display='block';
       refreshProfitedPrice()
        } else {
            alert("Ingredient: "+ document.getElementById("name").innerHTML +" is already available in recipie")
        }
   }

   // Refresh the table
   function refreshTable(Result){
       table=document.getElementById("ingredientTable")

       // cleanup table
       var rowCount = table.rows.length;
       for (var x=rowCount-1; x>0; x--) {
           table.deleteRow(x);
       }

       // Refill all elements  
       for(var i = 0; i < Result.length; i++) {
          var tr = document.createElement('tr');   
          var td1 = document.createElement('td');
          var td2 = document.createElement('td');
          var td3 = document.createElement('td');
          var td4 = document.createElement('td');
          var td5 = document.createElement('td');
          var td6 = document.createElement('td');
          var td7 = document.createElement('td');
          var text1 = document.createTextNode(Result[i].name);
          var text2 = document.createTextNode(Result[i].brand);
          var text3 = document.createTextNode(Result[i].seller);
          var text4 = document.createTextNode(Result[i].quantity);
          var text5 = document.createTextNode(Result[i].price);
          var text6 = document.createTextNode(Result[i].comment);
          var text7 = document.createElement('span')
          text7.className="delete"
          text7.innerHTML = "❌";
          td1.appendChild(text1);
          td2.appendChild(text2);
          td3.appendChild(text3);
          td4.appendChild(text4);
          td5.appendChild(text5);
          td6.appendChild(text6);
          td7.appendChild(text7);
          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          tr.appendChild(td5);
          tr.appendChild(td6);
          tr.appendChild(td7);
          table.appendChild(tr);
       }
   }

   // On profit value change
   function refreshProfitedPrice() {
           newProfitPercentage = document.getElementById("profitInput").value
           totalPriceVal=parseFloat(document.getElementById("totalPrice").innerHTML)
           document.getElementById("finalPrice").innerHTML = totalPriceVal + (totalPriceVal * parseFloat(newProfitPercentage) /100)
   }

   // On row-delete button click on ingredientTable
   $(document).ready(function(){
    $("#ingredientTable").on('click','.delete',function(){
       removeIngredientFromArr($(this).closest('tr').find("td:first").html()) 
       $(this).closest('tr').remove();
     });
   });

   // Remove supplied ingredient from the Result array based on supplied ingredient name
   function removeIngredientFromArr(ingredientName){
       for(i=0;i<Result.length;i++){

           if(ingredientName==Result[i].name){
               Result.splice(i, 1);
           }
       }
       refreshPrice()
       refreshProfitedPrice()
   }

   // Refresh price
   function refreshPrice(){
       refreshedPrice=0
       for(i=0;i<Result.length;i++){
               refreshedPrice = refreshedPrice + parseFloat(Result[i].price)
       }
       document.getElementById("totalPrice").innerHTML = refreshedPrice
   }
  
   // On Save button click
   function createFile(){
    let recipeName = prompt('Enter recipe name');
    downloadFile(recipeName+".json", JSON.stringify(Result))
   }
   
   // Download supplied content in form of a file
   function downloadFile(name, contents, mime_type) {
    mime_type = mime_type || "application/json";
    var blob = new Blob([contents], {type: mime_type});
    var dlink = document.createElement('a');
    dlink.download = name;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function(e) {
        // revokeObjectURL needs a delay to work properly
        var that = this;
        setTimeout(function() {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
    };

    dlink.click();
    dlink.remove();
   }

  // JSON recipe file upload logic
  function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }
  document.getElementById('file').addEventListener('change', onChange); 

  // On upload of new recipe
  function onReaderLoad(event){
    try {
       Result = JSON.parse(event.target.result);
    } catch(e) {
        alert("Upload a valid recipe file, error:"+e); // error in the above string (in this case, yes)!
    }
       refreshTable(Result)
       refreshPrice()
       refreshProfitedPrice()
       document.getElementById("ingredientTableDiv").style.display='block';
       document.getElementById("ingredientDetails").style.display='block';
  }
  
function clearSelection(){
    $('#selectedIng').val("")
}