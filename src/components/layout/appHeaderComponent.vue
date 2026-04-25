<template>
    <header>
        <ul>
            <li><span class="mdi mdi-menu"></span></li>
            <li><img src="/public/img/logo/logo-sem-fundo.png" alt=""></li>
            <li><span class="mdi mdi-account-circle-outline"></span></li>
        </ul>
    </header>
</template>
<style scoped>
ul{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
li{
    list-style: none;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}
li img{
    width: 100%;
}
li:first-child{
    font-size: 30px;
    justify-content: start;
}
li:last-child{
    font-size: 30px;
    justify-content: end;
}
</style>