<script setup>
  import { computed, ref } from 'vue'
  const selection = ref(1);
  const people = [
    {
      name: "Dr. John Doe",
      role: "Project Lead",
      image: "/src/assets/special_fonts/people/sample_name.png"
    },
    {
      name: "Dr. John Doe",
      role: "Project Lead",
      image: "/src/assets/special_fonts/people/sample_name.png"
    },
    {
      name: "Dr. John Doe",
      role: "Project Lead",
      image: "/src/assets/special_fonts/people/sample_name.png"
    },
    {
      name: "Dr. John Doe",
      role: "Project Lead",
      image: "/src/assets/special_fonts/people/sample_name.png"
    },
    {
      name: "Dr. John Doe",
      role: "PHD Student",
      image: "/src/assets/special_fonts/people/sample_name.png"
    },
    
  ];


  const filteredPeople = computed(() => {
    if (selection.value === 1) {
      return people.filter(p => p.role === 'Project Lead')
    }
    if (selection.value === 2) {
      return people.filter(p => p.role === 'PHD Student')
    }
    return []
  });
</script>

<template>
  <div class="about">
    <div class = "about-nav">
      <img class="about-title" src="@/assets/special_fonts/people/people.png" alt=""></img>
      <div class="about-menu1" :class="{ active: selection === 1 }" @click="selection = 1"></div>
      <div class="about-menu2" :class="{ active: selection === 2 }" @click="selection = 2"></div>
      
    </div>
    <div class = "about-content">
      <div
        v-for="(p, index) in filteredPeople"
        :key="index"
        class="person"
      >
        <img :src="p.image" :alt="p.name" />
        <div class="person-name">
          <div>{{ p.name }}</div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<style>
.about {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: row;
  padding: 5vw 3.85vw ;
}

.about-nav {
  flex : 1;
}
.about-title {
  width: 15.8vw;
  padding-bottom: 4vw;
}

.about-menu1 {
  padding: 1.8vw 0;
  width: 14.68vw;
  background-color: #000000;
  transition: background-color 0.3s ease;
  mask-image: url('@/assets/special_fonts/people/Project Leads.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;

  transition: color 0.25s ease;
}

.about-menu2 {
  padding: 1.8vw 0;
  width: 14.07vw;
  background-color: #000000;
  transition: background-color 0.3s ease;
  mask-image: url('@/assets/special_fonts/people/PHD students.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
  transition: color 0.25s ease;
}

.about-menu1.active,
.about-menu2.active {
  background-color: #DD3528;          
}



.about-content {
  flex : 2;
  background-color: white;
}

.about-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1vw;
}

.person {
  display: flex;
  background-color: #f7f7f7;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 11.09vw ;

}

.person img {
  width: 14.89vw;
  height: 14.89vw;
  object-fit: cover;
  margin-bottom: 5vw;
}

.person-name {
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
  padding: 1vw 2vw ;
}
</style>
