<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const open = ref(false)
const selection = ref(1)

const options = [
  // { value: 5, label: 'NEWS & EVENTS' },
  // { value: 2, label: 'PROTOTYPES' },
  { value: 3, label: 'PEOPLE' },
  { value: 6, label: 'PROJECTS' },
]

function choose(v) {
  selection.value = v
  open.value = false
  if (v === 1) {
    router.push('/')
  } else if (v === 2) {
    router.push('/prototypes')
  } else if (v === 3) {
    router.push('/people')
  } else if (v === 4) {
    router.push('/contact')
  } else if (v === 5) {
    router.push('/news')
  } else if (v === 6) {
    router.push('/projects')
  } else if (v === 0) {
    window.open('https://shilei.me/', '_blank')
  }
}

function toggle() {
  console.log('open before toggle:', open.value)
  open.value = !open.value
  console.log('open after toggle:', open.value)
}

function onDocClick(e) {
  if (!e.target.closest('.dropdown')) open.value = false
}

document.addEventListener('click', onDocClick)
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

</script>

<template>
  <div class= "app-root">
    <header>
      <!-- <img alt = "hai_lab_logo" class="logo" src="@/assets/icons/logo1.png" width="146" height="116" @click="choose(1)"/> -->
      <div alt = "home_logo" class="home-icon" @click="choose(1)"></div>

      <nav>
        <div class="mask-contact" :class="{active: open}" @click="choose(4)"></div>
        <div class="mask-menu" :class="{ active: open }" @click.stop="toggle"></div>
        <!-- <RouterLink to="/about"><div class="mask-menu"></div></RouterLink> -->
      </nav>
      
    </header>
    <div v-if="open" class ="dropdown-menu">
      <div v-for="o in options" :key="o.value" class="dropdown-item" :class="{ active: o.value === selection }" @click="choose(o.value)">
        {{ o.label }}
      </div>
    </div>
    <RouterView/>
    <footer>
      <div class = "footer-title">
        <img src="@/assets/special_fonts/footer content.png" alt=""></img>
      </div>
      <div class = "footer-contents">
        <div class = "footer-more-info">
          <img src="@/assets/special_fonts/More ways to explore.png" alt=""></img>
          <hr> 
          <img src="@/assets/special_fonts/about.png" alt="" @click="choose(0)"></img>
          <img src="@/assets/special_fonts/project proposal.png" alt="" @click="choose(6)"></img>
          <img src="@/assets/special_fonts/news+events.png" alt="" @click="choose(5)"></img>
          <img src="@/assets/special_fonts/prototypes-go.png" alt="" @click="choose(2)"></img>
          <img src="@/assets/special_fonts/people-go.png" alt="" @click="choose(3)"></img>
          <img src="@/assets/special_fonts/contact-go.png" alt="" @click="choose(4)"></img>
        </div>
        <div class = "footer-logos">
          <img src="@/assets/special_fonts/HAII LAB.png" alt="" class="footer-logo-haii"></img>
          <div Class = "footer-learn-about">
            <img class="footer-learn-more" src ="@/assets/special_fonts/Learn more.png" alt=""></img>
            <div class="footer-about-the-lab" @click="choose(0)"></div>
          </div>
          
        </div>
      </div>
    </footer>
  </div>  
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView /> -->
</template>

<style scoped>
.app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  padding-right: 4vw ;
  padding-left: 1.5vw ;
  padding-top: 1.2vw ;
  padding-bottom: 1.2vw ;
}

.logo {
  cursor: pointer;
  transition: transform 0.25s ease;
}

.logo:hover {
  transform: scale(1.05) rotate(1deg);
}

.home-icon {
  width: 6.88vw;
  height: 1.64vw;
  background-color: #000000;
  transition: background-color 0.3s ease;
  mask-image: url('@/assets/special_fonts/home.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
  cursor: pointer;
  z-index: 100;
}

.home-icon:hover {
  background-color: #DD3528;
  transform: scale(1.02);
}

.mask-contact {
  width: 10.2vw;
  height: 1.64vw;
  background-color: #000000;
  transition: background-color 0.3s ease;
  mask-image: url('@/assets/special_fonts/contact.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
  z-index: 100;
}

.mask-contact.active{
  background-color: #ffffff;
}

.mask-menu {
  width: 6.88vw;
  height: 1.64vw;
  background-color: #000000;
  transition: background-color 0.3s ease;
  mask-image: url('@/assets/special_fonts/menu.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
  margin-left: 50px;
  z-index: 100;
}

.mask-menu.active {
  background-color: #DD3528;
}

header nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 25vw;
}

.mask-contact:hover,
.mask-menu:hover {
  cursor: pointer;
  background-color: #DD3528;
  transform: scale(1.02);
}


.dropdown-menu {
  position: absolute;
  right:0;
  top:0;
  width: 33.33vw;
  height: 100vh;
  background-color: black;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 4vw;
  gap: 3.2vw;
}

.dropdown-btn {
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.15);
  background: white;
  cursor: pointer;
}



.dropdown-item {
  color: #ffffff;
  font-family: 'Albert Sans';
  font-weight: 20;
  font-size: 2vw;
  cursor: pointer;
}

.dropdown-item:hover { 
  cursor: pointer;
  color: #DD3528;
  
}

.dropdown-item.active {
  
  font-weight: 600;
}

.chev { margin-left: 8px; }


footer {
  margin-top: auto;
  background-color: #1a1a1a;
  color: white;
  padding: 4vw 8vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.footer-title img {
  width: 90vw;
  height: auto;
  
}

.footer-contents {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100vw;
  padding: 5vw 5.5vw;
  padding-bottom: 0.4vw;
}

.footer-more-info{
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 1.5vw;
}

.footer-more-info img {
  width: auto;
  height: 1.129vw;
}

.footer-more-info img:hover {
  cursor: pointer;
  filter: brightness(150%);
  transform: scale(1.02);
}

hr{
  width: 320px;
  border: 0.1vw solid #555555;
}

.footer-logos{
  padding-top: 13vw;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 2vw;
}

.footer-logo-haii {
  width: 16vw;
  height: auto;
}

.footer-learn-about{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.3vw;
}


.footer-learn-more {
  
  width: auto;
  height: 0.924vw;
}

.footer-about-the-lab {
  background-color: #ffffff;
  transition: background-color 0.3s ease;
  mask-image: url("@/assets/special_fonts/about_the_lab.png");
  width: 8vw;
  height: 1.2vw;
  margin-bottom: 0.1vw;
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
}


.footer-about-the-lab:hover{
  background-color: #DD3528;
  cursor: pointer;
}

</style>
