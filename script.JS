document.querySelector("#push").onclick = function(){
if (document.querySelector("#AA").value.length == 0) {
    alert("الحقـل فارغ!");
}else{
    // document.querySelector("#tasks").className(".task button");
document.querySelector("#tasks").innerHTML += `
  <div class="task">
    <span class="taskname">
      ${document.querySelector('#newtask input').value}
    </span>
    <button class="delete">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>`;
  var C_task=document.querySelectorAll(".delete");
  for(var i=0;i<C_task.length;i++){
    C_task[i].onclick = function(){
      this.parentNode.remove();
    }
  }
  var tasks=document.querySelectorAll(".task");
  for(var i=0;i<tasks.length;i++){
    tasks[i].onclick = function(){
      this.classList.toggle("completed");
    }
  }
}
console.log("iuhiu")
}