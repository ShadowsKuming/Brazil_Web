<script setup>
import TheWelcome from '../components/TheWelcome.vue'

function go(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <!-- <main>
    <TheWelcome />
  </main> -->

  <div class = "homepages-body">
    <div class="homepages-first"> 
      <img alt="" src="@/assets/special_fonts/homepages/homepage_contents.png"> </img>
      <nav class="homepages-nav">
        <div class="nav-purpose" @click="go('purpose')">PURPOSE</div>
        <div class="nav-objectives" @click="go('objectives')">OBJECTIVES</div>
        <div class="nav-sdg" @click="go('sdg')">SDG CONTRIBUTIONS</div>
        <div class="nav-timeline" @click="go('timeline')">TIMELINE</div>
      </nav>
    </div>
    <img id = "purpose" class="homepages-layouts" alt="01" src="@/assets/layouts/homepages/02 PURPOSE.png"> </img>
    <img id = "objectives" class="homepages-layouts" alt="02" src="@/assets/layouts/homepages/03 OBJECTIVES.png"> </img>
    <img id = "sdg" class="homepages-layouts-black" alt="03" src="@/assets/layouts/homepages/04 SDG CONTRIBUTIONS.png"> </img>
    <img id = "timeline" class="homepages-layouts" alt="04" src="@/assets/layouts/homepages/TIMELINE.png"> </img>
    <div class="homepages-getintouch" alt="Get in Touch">
      <div id = "getintouch-title">
        <img  src="@/assets/special_fonts/homepages/getintouch-title.png" />
      </div>
      <div id = "getintouch-content">
        <img  src="@/assets/special_fonts/homepages/getintouch-content.png" />
      </div>
      <div id = "getintouch-text"></div>
    </div>
  </div>
</template>

<style scoped>  
.homepages-body {
  width: 100%;
  height: auto;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.homepages-first {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  padding-left:18.3vw;
  padding-right:18.3vw;
  padding-top: 8vw;
  padding-bottom: 6vw;
}
.homepages-first img {
  width: 100%;
  height: auto;
}
.homepages-nav {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin-top: 4vw;
}

.homepages-nav div {
  display: inline-block;
  color:#1a1a1a;
  transition: background-color 0.3s ease, color 0.3s ease;
  border: 1px solid currentColor;
  border-radius: 3vw;
  padding: 0.2vw 1.41vw;
  font-weight: 600;
  font-size: 1.7vw;

}

.homepages-nav div:hover {
  color: #DD3528;
  cursor: pointer;
  transform: scale(1.02);
}



.homepages-layouts {
  width: 100%;
  height: auto;
  padding: 5vw;
}
.homepages-layouts-black {
  width: 100%;
  height: auto;
  background-color: black;
}

.homepages-getintouch {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4.95vw 6.88vw;
  gap: 2.2vw;
  background-color: black;
}

.homepages-getintouch #getintouch-title {
  width: auto;
  height: 8.22vw;
  aspect-ratio: 675/164;
  color: white;
}

.homepages-getintouch #getintouch-content {
  width: auto;
  height: 1.18vw;
  aspect-ratio: 618/30;
  color: white;
}
.homepages-getintouch #getintouch-title img, .homepages-getintouch #getintouch-content img {
  height: 100%;
}
.homepages-getintouch #getintouch-text {
  width: 7.54vw;
  height: 1.09vw;
  background-color: white;
  transition: background-color 0.3s ease;

  mask-image: url('@/assets/special_fonts/homepages/getintouch-text.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
}

.homepages-getintouch #getintouch-text:hover {
  cursor: pointer;
  background-color: #DD3528;
  transform: scale(1.02);
}

</style>


