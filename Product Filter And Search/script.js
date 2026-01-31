let products = {
  data: [
    {
      productName: "Regular White T-Shirt",
      category: "Topwear",
      price: "30",
      image: "white-tshirt.jpg",
    },
    {
      productName: "Beige Short Skirt",
      category: "Bottomwear",
      price: "49",
      image: "short-skirt.jpg",
    },
    {
      productName: "Sporty SmartWatch",
      category: "Watch",
      price: "99",
      image: "sporty-smartwatch.jpg",
    },
    {
      productName: "Basic Knitted Top",
      category: "Topwear",
      price: "29",
      image: "knitted-top.jpg",
    },
    {
      productName: "Black Leather Jacket",
      category: "Jacket",
      price: "129",
      image: "black-leather-jacket.jpg",
    },
    {
      productName: "Stylish Pink Trousers",
      category: "Bottomwear",
      price: "89",
      image: "pink-trousers.jpg",
    },
    {
      productName: "Brown Men's Jacket",
      category: "Jacket",
      price: "189",
      image: "brown-jacket.jpg",
    },
    {
      productName: "Comfy Gray Pants",
      category: "Bottomwear",
      price: "49",
      image: "comfy-gray-pants.jpg",
    },
  ],
  dataa: ["هاتف", "كمبيوتر", "سماعات"]
};
for(var i of products.data){
  var card = document.createElement("div");
  card.classList.add("card",i.category,"hide");
  // card.innerText="kwfmwkpfmpwqfmqpof";
  console.log(card)
  //
  var test = document.createElement("h5");
  test.classList.add("products-name");
  test.innerText=i.productName.toUpperCase();
  //
  var div_img = document.createElement("div");
  div_img.classList.add("image-container");
  var img = document.createElement("img");
  img.setAttribute("src",i.image);
  div_img.appendChild(img);
    //contener
  var container = document.createElement("div");
  container.classList.add("container");
  //
  card.appendChild(div_img);
  container.appendChild(test);

  //
  document.getElementById("products").appendChild(card);
  //prise
  let price = document.createElement("h6");
  price.innerText = "$ "+i.price;
  container.appendChild(price);
  card.appendChild(container);
  
}

// let productss = {
//   data: ["هاتف", "كمبيوتر", "سماعات"]
// };

for (var i of products.data) {
  console.table(i);
}

for (var i in products.data) {
  console.table(i);
}

//filterProduct
function filterProduct(value){
var buttem = document.querySelectorAll(".button-value");
buttem.forEach(buttem => {
  if(value.toUpperCase() == buttem.innerText.toUpperCase()){
    buttem.classList.add("active");
  }
  else{
    buttem.classList.remove("active");
  }
})
let elements = document.querySelectorAll(".card");
  //loop through all cards
  elements.forEach((element) => {
    //display all cards on 'all' button click
    if (value == "all") {
      element.classList.remove("hide");
    } else {
      //Check if element contains category class
      if (element.classList.contains(value)) {
        //display element based on category
        element.classList.remove("hide");
      } else {
        //hide other elements
        element.classList.add("hide");
      }
    }
  });
};

document.getElementById("search").addEventListener("click", () => {
  //initializations
  let searchInput = document.getElementById("search-input").value;
  let elements = document.querySelectorAll(".products-name");
  let cards = document.querySelectorAll(".card");

  //loop through all elements
  elements.forEach((element, index) => {
    //check if text includes the search value
    if (element.innerText.includes(searchInput.toUpperCase())) {
      //display matching card
      cards[index].classList.remove("hide");
    } else {
      //hide others
      cards[index].classList.add("hide");
    }
  });
});



window.onload = ()=>{
  filterProduct("all");
};
