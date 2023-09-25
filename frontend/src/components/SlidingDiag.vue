<template>
	<div class="bg"></div>
	<div class="bg bg2"></div>
	<div class="bg bg3"></div>

</template>

<style>


.bg {
  animation:slide 10s ease-in-out infinite alternate;
  background-image: linear-gradient(-60deg, #aad7f3 50%, rgb(80, 184, 253) 50%);
  bottom:0;
  left:-50%;
  opacity:.5;
  position:fixed;
  right:-50%;
  top:0;
  z-index:-1;
}

.bg2 {
  animation-direction:alternate-reverse;
  animation-duration:12s;
}

.bg3 {
  animation-duration:14s;
}

@keyframes slide {
  0% {
    transform:translateX(-25%);
  }
  100% {
    transform:translateX(25%);
  }
}


</style>