let imges = ["dice-01.svg","dice-02.svg","dice-03.svg","dice-04.svg","dice-05.svg","dice-06.svg"];

let dice =document.querySelectorAll("img");

// console.log(dice);

function roll() {
    dice.forEach(
        function(die){
            die.classList.add("shake");
            // dice.classList.add(imges);
        //         setTimeout(function() {
        // die.classList.remove("shake");
        // }, 3000);
        }
    )
    let one = Math.floor(Math.random()*6);
    
    let tow = Math.floor(Math.random()*6);
    console.log(one,tow);
    let totale = document.querySelector("#total").innerHTML = "المجموع "+ (2+(one + tow));

    document.querySelector("#die-1").setAttribute("src",imges[one]);
    document.querySelector("#die-2").setAttribute("src",imges[tow]);
}
roll()
