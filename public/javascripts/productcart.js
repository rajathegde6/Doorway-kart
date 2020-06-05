
if(document.readyState == 'loading')
{
  document.addEventListener('DOMcontentLoaded', ready);
}
else{

  ready();
}
function ready()
{
  console.log("running");
  console.log("hi");

  var removecartitembuttons= document.getElementsByClassName('btn-danger');
  console.log(removecartitembuttons);

  for(var i=0; i<removecartitembuttons.length; i++)
  {
    var button= removecartitembuttons[i];
    button.addEventListener('click', removecartitem);
  }

var quantityinputs =document.getElementsByClassName('cart-quantity-input');
for(var j=0; j<quantityinputs.length; j++)
{
  var input= quantityinputs[j];
input.addEventListener('change', quantitychanged);
}

 var addtocartbuttons= document.getElementsByClassName('shop-item-button');
 for(var k=0; k<addtocartbuttons.length; k++)
 {
   var cart= addtocartbuttons[k];
 cart.addEventListener('click', addtocartclicked);
 }
}


function removecartitem(event)
{
  var buttonclicked= event.target;
  buttonclicked.parentElement.parentElement.remove();
updatecarttotal();
}

function quantitychanged(event)
{
  var input=event.target;
  if( input.value >0)
  {
    updatecarttotal();
  }
  else{
    input.value=1;
    updatecarttotal();

  }
}

function addtocartclicked(event)
{
  var cart= event.target;
  var shopitem= cart.parentElement.parentElement;
  var title=shopitem.getElementsByClassName('name')[0].innerText;
  var price=shopitem.getElementsByClassName('price')[0].innerText;
  var imgsrc= shopitem.getElementsByClassName('image')[0];
  var size= shopitem.getElementsByClassName('size')[0].value;
  console.log(title,price,imgsrc,size);

  additemtocart(title,price,imgsrc,size);

}

function additemtocart(title,price,imgsrc,size)
{
var cartrow=document.createElement('div');
var cartitems=document.getElementsByClassName('cart-items')[0];
var cartitemnames= cartitems.getElementsByClassName('cart-item-title');
for( var l=0; l<cartitemnames.length; l++)
{
if(cartitemnames[l].innerText == title)
{

  alert('This item has already been added to cart');
  return;
}

}
var cartrowcontents=`
<div class="cart-item row">
  <div class="cart-item col-lg-3">
    <img  class="cart-item-image" src="/images/${title}.jpg" alt="Denim Jeans" width="100px" height="100px">
    <span class="cart-item-title">${title}</span>
  </div>

<span class="cart-price col-lg-2">$ ${price}</span>
<div class="cart-quantity col-lg-5">
<label for="cart-quantity-input">Quantity</label>
<input class="cart-quantity-input " type="number" value="1">
&nbsp  &nbsp
<label for="size">Size</label>
<select id="sizes"class="size" name="size">
<option value="${size}">${size}</option>
<option value="38">38</option>
    <option value="39">39</option>
      <option value="40">40</option>
        <option value="41">41</option>
</select>
</div>
<div class="cart-remove col-lg-2">

<button class="btn btn-danger " type="button">Remove</button>

</div>
</div>
`;
cartrow.innerHTML =cartrowcontents;
cartitems.append(cartrow);

cartrow.getElementsByClassName('btn-danger')[0].addEventListener('click', removecartitem);
cartrow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantitychanged);
updatecarttotal();

}


function updatecarttotal()
{
var cartitemcontainer= document.getElementsByClassName('cart-items')[0];
 var cartrows=cartitemcontainer.getElementsByClassName('cart-item');
 var total= 0;
if(cartrows.length==0)
{
  document.getElementsByClassName('cart-total-price')[0].innerText="$"+total;

}
 for(var i=0; i<cartrows.length; i++)
 {
 var cartrow=cartrows[i];
 var priceelement = cartrow.getElementsByClassName('cart-price')[0];
 var quantityelement = cartrow.getElementsByClassName('cart-quantity-input')[0];
console.log(priceelement,quantityelement);
var price= parseInt(priceelement.innerText.replace('$',''));
var quantity=quantityelement.value;
console.log(price);
console.log(quantity);
console.log(price * quantity);

total= total + (price * quantity);
console.log(total);
document.getElementsByClassName('cart-total-price')[0].innerText="$"+total;
}

}
var modal = document.getElementById('id01');
var modal = document.getElementById('id02');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
