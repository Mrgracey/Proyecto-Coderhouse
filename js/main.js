
$( document ).ready(function() {
    $( "#overlayer" ).attr("style", "display: none;");    
    $( ".loader" ).attr("style", "display: none;");
});

class Product {
    constructor(object) {
        
        this.name  = object.name;
        this.price  = parseFloat(object.price);
        this.img = object.img;
        this.size = object.size;
        this.color = object.color;
    }
    calcIva() {
        return this.price * 0.21;
    }
}

const products = [
    {id: '0', name: 'Air Force 1', price: '16000', options: [{stock: '16', sizes: [{size: '7', colors: ['green', 'blue']}, {size: '8', colors: ['green', 'black']}]},{}], img: 'af1.png' },
    {id: '1', name: 'Jordan', price: '12000', options: [{stock: '16', sizes: [{size: '7', colors: ['green', 'blue']}, {size: '8', colors: ['green', 'black']}]},{}], img: 'j.png'},
    {id: '2', name: 'Dunk Low', price: '8000', options: [{stock: '16', sizes: [{size: '7', colors: ['green', 'blue']}, {size: '8', colors: ['green', 'black']}]},{}], img: 'dl.png'},
    {id: '3', name: 'Jordan High', price: '2000', options: [{stock: '16', sizes: [{size: '7', colors: ['green', 'blue']}, {size: '8', colors: ['green', 'black']}]},{}], img: 'jh.png'},
    {id: '4', name: 'Air Max', price: '1000', options: [{stock: '16', sizes: [{size: '7', colors: ['green', 'blue']}, {size: '8', colors: ['green', 'black']}]},{}], img: 'am.png'}
];

let i = 0;
let spanColors = '';
let spanSizes = '';
let productDiv = document.getElementsByClassName('row');
let productButton = document.getElementsByClassName("product");
let cantItemsInCart = 0;

    for (const product of products){
        for (const option of product.options){
            if (option.stock>0) {
                for (const size of option.sizes){
                    spanSizes = spanSizes +`<span class="sizeSpan">${size.size}</span>`;
                    spanColors = spanColors + `<div class="color ${size.size}"><h3>Color :</h3>`;
                    for (const color of size.colors){
                        spanColors = spanColors +`<span class="colorSpan ${color}"></span>`;
                    }
                    spanColors = spanColors + `</div>`;
                }
            }
            
        }
        ivaPrice = product.price * 1.21;
        // productDiv[0].innerHTML = productDiv[0].innerHTML + `<div class="product-card"> <h2>${product.name}</h2> <p>${ivaPrice}AR$</p> <button id="${product.id}" class="product">añadir al carrito</button> </div>`;
        productDiv[1].innerHTML = productDiv[1].innerHTML + `<div class="col-lg-4">
                                                                <div id="${product.id}" class="card">
                                                                    <div class="imgBx">
                                                                        <img src="images/${product.img}" alt="">
                                                                    </div>
                                                                    <div class="contentBx">
                                                                        <h2>${product.name}</h2>
                                                                        <h3>${ivaPrice}AR$</h3>
                                                                        <div class="size">
                                                                            <h3>Tamaño :</h3>
                                                                            ${spanSizes}
                                                                            
                                                                        </div>
                                                                        ${spanColors}
                                                                        <a id="${product.id}" class="product">Añadir al carrito</a>
                                                                    </div>
                                                                </div>
                                                            </div>`;
        spanColors = '';
        spanSizes = '';
        
}







const localSave = (clave, valor) => { localStorage.setItem(clave, valor) };


let A_cartProducts = [];
let A_stored = [];
let command = '';


const parseCart = function() {
    
    A_stored = JSON.parse(localStorage.getItem("cartList"));
    
    
    //Revisamos que A_stored no sea null
    if (A_stored != null) {
        //Iteramos A_stored con for...of para transformar todos sus objetos a tipo producto.
        for (const object of A_stored){
            
            A_cartProducts.push(new Product(object));
            
        }
    }
    
};

const putInCart = function() {
    
    var id = $(this).parent().parent().attr("id");
    var name = products[id].name;
    var price = products[id].price;
    var img = products[id].img;
    var size = $(`#${id} .sizeSpan.selected`).html();
    var color = $(`#${id} .color.${size} .colorSpan.selected`).attr("class").split(' ')[1];
    var object = { id: id, name: `${name}`, price: price, img: img, size: size, color: color }
    command = '';
    A_cartProducts.push(new Product(object));
    
    printCart(command);
};

const printCart = function(command) {
    
    
    let cartProducts = "";
    let cartTotalValue = 0 ;

    if (command == '') {
        parseCart();
            
    }else if(command == 'sort'){
        parseCart();
        var A_sortedCart = [];
        A_sortedCart = A_cartProducts.map(elemento => elemento);
        var A_sortedCart = A_cartProducts;
        A_cartProducts = A_sortedCart.sort(function(a, b) {
            return a.price - b.price;
        });
    }
    
    for ( let product of A_cartProducts){
        cartProducts = cartProducts + `<div id="${i}" class="item">
                                        <div class="row">
                                            <div class="col-4">
                                                <div class="itemImg">
                                                    <img src="images/${product.img}" alt="">
                                                </div>  
                                            </div>
                                            <div class="col-8">
                                                <div class="itemTitle">${product.name}</div>
                                                <span class="itemColor" >Color:</span>
                                                <span class="itemColorSpan ${product.color}"></span>
                                                <br>
                                                <span class="itemSize" >Size:</span>
                                                <span class="itemSize">${product.size}</span>
                                                <div class="itemPrice">
                                                    <div class="row">
                                                        <div class="col-7">${product.price}AR$</div>
                                                        <div class="col-5">I.V.A: ${product.calcIva()}AR$</div>
                                                    </div>
                                                </div>
                                                <button class="itemDelete"><i class="fas fa-trash"></i></button>
                                                
                                            </div>
                                        </div>
                                        
                                        
                                    </div>`;
        

        cartTotalValue = cartTotalValue + product.price + product.calcIva();
        i++;
    
    }
    localSave("cartList", JSON.stringify(A_cartProducts));

    if (A_cartProducts.length == 0) {
        cartProducts = "Tu carrito esta vacío";
    }
    
    $(".cartItems").html(cartProducts);
    // total.innerHTML = "<br>" + cartTotalValue + "&nbspAR$";
    
   
    
    cantItemsInCart = A_cartProducts.length;
    cantItemsInCart = '<p>'+cantItemsInCart+'</p>';
    $('#itemsInCart').html(cantItemsInCart);
    
    A_cartProducts = [];
    i = 0;
};

//vacia el carrito
const emptyCart = function() {
    A_cartProducts = [];
    i = 0;
    command = 'empty';
    printCart(command);
    
    
}

//ordenar de menor a mayor el carrito
const sortCart = function() {
    command = 'sort';
    printCart(command);
    
    
}

const openCart = function() {
    $(".cart").addClass("active");
    $(".container").addClass("openedCart");
    $("#cartOverlayer").attr("style", "display: block;");
    
}

const closeCart = function() {
    $(".cart").removeClass("active");
    $(".container").removeClass("openedCart");
    $("#cartOverlayer").attr("style", "display: none;");
    
}

const sizeSpanClasses = function() {
    var cardId = $(this).parent().parent().parent().attr('id');
    var size1 = $(".sizeSpan.selected").html();
    var cardId1 = $(".sizeSpan.selected").parent().parent().parent().attr('id');
    if (size1 != undefined) {
        // console.log(size1);
        var color1 = ".color." + size1;
        $(color1).attr("style", "height: 0px;padding: 0px;visibility:hidden;opacity:0;");
        $(`#${cardId1}`).mouseenter(function(){
            $(`#${cardId1} .contentBx`).attr("style", "height: 200px;");
        }).mouseleave(function(){
            $(`#${cardId1} .contentBx`).attr("style", "height: 100px;");
        })
        $(`#${cardId1} .product`).attr("style", "pointer-events: none;")
    }
    
    $(".sizeSpan.selected").toggleClass("selected");
    

    var size = $(this).html();
    
    $(this).toggleClass("selected");
    var color = "#" + cardId + " .color." + size;
    $(color).attr("style", "height: auto;padding: 10px;visibility:visible;opacity:1;");
    $(`#${cardId} .contentBx`).attr("style", "height: 260px;");
    $(`#${cardId}`).mouseenter(function(){
        $(`#${cardId} .contentBx`).attr("style", "height: 260px;");
    }).mouseleave(function(){
        $(`#${cardId} .contentBx`).attr("style", "height: 100px;");
    })
    
}

const colorSpanClasses = function() {
    $(".colorSpan.selected").toggleClass("selected");
    $(this).toggleClass("selected");
    
}


const imgSlider = function() {
    var slide = $(this).attr("src");
    $('.starredProduct').attr("src", slide);
    $(".thumb li.selected").toggleClass("selected");
    $(this).parent().toggleClass("selected");
    
}

const deleteItem = function(){

    var itemId = $(this).parent().parent().parent().attr('id');
    console.log(itemId)
    parseCart();
    A_cartProducts.splice(itemId, 1);
    localSave("cartList", JSON.stringify(A_cartProducts));
    command = 'delItem';
    i=0;
    printCart(command);
    
}

printCart(command); 
$(".itemDelete").click(deleteItem);
$(".product").click(putInCart);
$("#openCart").click(openCart);
$("#closeCart").click(closeCart);
$("#deleteCart").click(emptyCart);
$("#sortCart").click(sortCart);
$(".sizeSpan").click(sizeSpanClasses);
$(".colorSpan").click(colorSpanClasses);
$(".colorSpan").click(function(){
    var clickedCardId = $(this).parent().parent().parent().attr('id');
    $(`#${clickedCardId} .product`).attr("style", "pointer-events: auto; cursor: pointer;")
});
$(".thumb img").click(imgSlider);

$("#more").click(function() {
    $('html, body').animate({
        scrollTop: $("#catalog").offset().top
    }, 2000);
});

var mybutton = document.getElementById("openCart");

         // When the user scrolls down 20px from the top of the document, show the button
         window.onscroll = function() {scrollFunction()};

         function scrollFunction() {
         if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            mybutton.style.display = "block";
         } else {
            mybutton.style.display = "none";
         }
         }