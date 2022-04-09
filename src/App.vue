<template>
  <Navbar />
  <div class="bg"></div>
  <router-view/>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default ({
  name: 'App',
  components: {
    Navbar
  }
})
</script>
