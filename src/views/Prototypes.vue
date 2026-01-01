<script setup>
    const prototypes = [
        {
            name: "Prototype 1",
            image: "/src/assets/layouts/prototypes/Images.png",
            DATE: "Jun, 11/5/2025",
            Abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed deiusmod tempor ullamco laboris test"
        },
        {
            name: "Prototype 1",
            image: "/src/assets/layouts/prototypes/Images.png",
            DATE: "Jun, 11/5/2025",
            Abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed deiusmod tempor ullamco laboris test"
        },
        {
            name: "Prototype 1",
            image: "/src/assets/layouts/prototypes/Images.png",
            DATE: "Jun, 11/5/2025",
            Abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed deiusmod tempor ullamco laboris test"
        },
        {
            name: "Prototype 1",
            image: "/src/assets/layouts/prototypes/Images.png",
            DATE: "Jun, 11/5/2025",
            Abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed deiusmod tempor ullamco laboris test"
        },
    ];

</script>
<template>
    <div class ="prototypes">
        <div class="prototypes-title">
            <img src="@/assets/special_fonts/prototypes/prototypes.png" />
        </div>
        <div class = "prototypes-content">
            <div
                v-for="(p, index) in prototypes"
                :key="index"
                class="prototype-item"
            >
                <img class="prototype-item-image" :src="p.image" :alt="p.name" />
                <div class="prototype-item-title">
                    <div>{{ p.DATE }}</div>
                    <div>{{ p.name }}</div>
                </div>
                <div class="prototype-item-content">
                    <div class = "prototype-item-abstract">{{ p.Abstract }}</div>
                    <div class="prototype-item-readmore"></div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.prototypes {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: auto;
}
.prototypes-title {
    width: 100%;
    margin-top: 5vw;
    margin-bottom: 5vw;
    padding-left: 7vw;
    
    display: flex;
    justify-content: start;
}
.prototypes-title img {
    width: 27vw;
}
.prototypes-content {
    padding: 2vw 1vw ;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2.8vw;
}

.prototype-item-image {
    width: 43vw;
    height:30.5vw;
}

.prototype-item-title {
    width: 100%;
    display: flex;  
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1vw;
    margin-bottom: 1vw;
}
.prototype-item-content {
    width: 100%;
    display: flex;  
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 1.5vw ;
    padding-bottom: 2.5vw ;
}

.prototype-item-abstract {
    width: 23.1vw;
    font-family: 'Reddit Sans', sans-serif;
    font-weight: 400;
    font-size: 1vw;
}

.prototype-item-readmore {
    width: 5vw;
    height: 1.5vw;
    background-color: #000000;
    transition: background-color 0.3s ease;
    mask-image: url('@/assets/special_fonts/prototypes/Read More.png');
    mask-repeat: no-repeat;
    mask-size: contain;
    mask-position: center;
}
.prototype-item-readmore:hover {
    cursor: pointer;
    background-color: #DD3528;
    transform: scale(1.02);
}
</style>