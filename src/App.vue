<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const open = ref(false)
const selection = ref(1)

const options = [
  { value: 5, label: 'NEWS & EVENTS' },
  { value: 2, label: 'PROTOTYPES' },
  { value: 3, label: 'PEOPLE' },
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
      <img alt = "hai_lab_logo" class="logo" src="@/assets/icons/logo1.png" width="146" height="116" @click="choose(1)"/>

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
      <div class="footer-getintouch" alt="Get in Touch">
        <div id = "getintouch-title">
          <img  src="@/assets/special_fonts/homepages/getintouch-title.png" />
        </div>
        <div id = "getintouch-content">
          <img  src="@/assets/special_fonts/homepages/getintouch-content.png" />
        </div>
        <div id = "getintouch-text"></div>
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



.footer-getintouch {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4.95vw 6.88vw;
  gap: 2.2vw;
  background-color: black;
}

.footer-getintouch #getintouch-title {
  width: auto;
  height: 8.22vw;
  aspect-ratio: 675/164;
  color: white;
}

.footer-getintouch #getintouch-content {
  width: auto;
  height: 1.18vw;
  aspect-ratio: 618/30;
  color: white;
}
.footer-getintouch #getintouch-title img, .footer-getintouch #getintouch-content img {
  height: 100%;
}
.footer-getintouch #getintouch-text {
  width: 7.54vw;
  height: 1.09vw;
  background-color: white;
  transition: background-color 0.3s ease;

  mask-image: url('@/assets/special_fonts/homepages/getintouch-text.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
}

.footer-getintouch #getintouch-text:hover {
  cursor: pointer;
  background-color: #DD3528;
  transform: scale(1.02);
}


</style>
