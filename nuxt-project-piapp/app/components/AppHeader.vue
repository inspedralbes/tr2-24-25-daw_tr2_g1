<script>
export default {
  name: 'HeaderGencat'
}
</script>
<template>
  <header>
    <div class="container">
      
      <div class="logo">
        <b>::</b>gencat
      </div>

      <nav>
        <a href="#">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Àrea privada
        </a>
        <span>|</span>
        
        <a href="#">Contacte</a>
        <span>|</span>

        <div class="selector-idioma">
          <input type="checkbox" id="check-idioma">
          
          <label for="check-idioma" class="boton-ca">
            CA ▾
          </label>

          <div class="desplegable">
            <a href="#">Català (CA)</a>
            <a href="#">Castellano (ES)</a>
            <a href="#">English (EN)</a>
            <a href="#">Occitan aranés (OC)</a>
          </div>
        </div>

        <span>|</span>
        
        <a href="#">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </a>
      </nav>

    </div>
  </header>
</template>
<style scoped>
header {
  background-color: #333333;
  color: white;
  height: 40px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  display: flex;
  align-items: center;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
}

.logo { font-weight: bold; font-size: 16px; letter-spacing: -0.5px; }
.logo b { color: #fff; margin-right: 2px; }

nav { display: flex; align-items: center; }

nav a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
}

nav span { margin: 0 10px; color: #666; }


.selector-idioma {
  position: relative; 
}

#check-idioma {
  display: none;
}

.boton-ca {
  cursor: pointer;
  font-weight: bold;
  user-select: none;
}

.desplegable {
  display: none; 
  position: absolute;
  top: 30px;
  left: -10px;
  background-color: white;
  min-width: 150px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  padding: 5px 0;
  z-index: 100;
  border-top: 2px solid #d00000;
}

#check-idioma:checked ~ .desplegable {
  display: block;
}

.desplegable a {
  color: #333 !important; 
  display: block;
  padding: 8px 15px;
  font-weight: normal;
}

.desplegable a:hover {
  background-color: #f0f0f0;
}
</style>