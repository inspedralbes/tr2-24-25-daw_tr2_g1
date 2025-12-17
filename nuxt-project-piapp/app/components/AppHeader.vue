<script>
export default {
  name: 'HeaderGencat',
  data() {
    return {
      menuItems: [
        { nombre: 'Inici',            path: '/' },
        { nombre: 'Requisits previs', path: '/requisits' },
        { nombre: 'Disseny gràfic',   path: '/disseny' },
      ]
    }
  },
  computed: {
    tituloActual() {
      const rutaActual = this.$route.path;
      const itemEncontrado = this.menuItems.find(item => item.path === rutaActual);
      return itemEncontrado ? itemEncontrado.nombre : 'Guia web';
    }
  }
}
</script>

<template>
  <header>
    <div class="top-bar">
      <div class="container">
        <div class="logo"><b>::</b>gencat</div>
        <nav class="top-nav">
          <a href="#">Contacte</a>
          <span>|</span>
          <div class="selector-idioma">
            <input type="checkbox" id="check-idioma" />
            <label for="check-idioma" class="boton-ca">CA ▾</label>
            <div class="desplegable">
              <a href="#">Català (CA)</a>
              <a href="#">Castellano (ES)</a>
              <a href="#">English (EN)</a>
            </div>
          </div>
          <span>|</span>
          <a href="#" class="search-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </a>
        </nav>
      </div>
    </div>

    <div class="main-nav-bar">
      <div class="container">
        <h1 class="site-title">{{ tituloActual }}</h1>
      </div>
    </div>

 <div class="bottom-nav-bar">
      <div class="container">
        <nav class="main-nav">
          
          <template v-for="(item, index) in menuItems" :key="item.nombre">
            
            <NuxtLink 
              :to="item.path"
              class="nav-item"
            >
              {{ item.nombre }}
            </NuxtLink>

            <span v-if="index < menuItems.length - 1" class="sep-menu">|</span>

          </template>

        </nav>
      </div>
    </div>
  </header>
</template>

<style scooped>
body,
html {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  overflow-x: hidden;
  font-family: "Open Sans", sans-serif;
}

header {
  font-family: Arial, sans-serif;
  width: 100%;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.top-bar {
  background-color: #333333;
  color: white;
  font-size: 14px;
  padding: 12px 25px;
  display: flex;
  align-items: center;
}

.top-bar .container {
  justify-content: space-between;
}

.logo {
  font-weight: bold;
  font-size: 16px;
  letter-spacing: -0.5px;
}
.logo b {
  color: #fff;
  margin-right: 2px;
}

.top-nav {
  display: flex;
  align-items: center;
}

.top-nav a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
}

.top-nav span {
  margin: 0 20px;
  color: #666;
}

.search-icon svg {
  width: 16px;
  height: 16px;
}

.selector-idioma {
  position: relative;
}
#check-idioma {
  display: none;
}

.boton-ca {
  cursor: pointer;
  user-select: none;
}

.desplegable {
  display: none;
  position: absolute;
  top: 30px;
  left: -10px;
  background: white;
  min-width: 150px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 999;
  border-top: 2px solid #d00000;
}

#check-idioma:checked ~ .desplegable {
  display: block;
}

.desplegable a {
  color: #333 !important;
  display: block;
  padding: 10px 15px;
  font-weight: normal;
}
.desplegable a:hover {
  background-color: #f0f0f0;
}

.main-nav-bar {
  background-color: #444444;
  color: white;
  padding: 15px 0;
}

.site-title {
  margin: 0;
  font-size: 20px;
  font-weight: normal;
}

.bottom-nav-bar {
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
}

.main-nav {
  display: flex;
  align-items: center;
  width: 100%;
}

.main-nav a {
  text-decoration: none;
  color: #333;
  padding: 15px 0;
  margin-right: 15px;
  border-bottom: 3px solid transparent;
}

.main-nav span {
  color: #ccc;
  margin-right: 15px;
}

.main-nav a.active {
  color: #d00000;
  border-bottom-color: #d00000;
  font-weight: bold;
}

.sep-menu {
  color: #ccc;
  margin: 0 15px; 
  user-select: none; 
}

.nav-item {
  text-decoration: none;
  color: #333;
  padding: 15px 0;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.nav-item.router-link-active, 
.nav-item.router-link-exact-active {
  color: #d00000;
  border-bottom-color: #d00000;
  font-weight: 700;
}
</style>
