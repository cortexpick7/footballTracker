<template>
  <div class="container-fluid navbar" >
    <!--Branding-->
    <div class="branding col-md-1">
      <i class="fa fa-map-signs" aria-hidden="true"></i>
    </div>
    <!--Main navigation-->
    <div :class="(!this.mobileView)?'navigation col-md-6':'navigation-mobile'" v-if="!this.mobileView || (this.mobileView && this.sideBarActive)">
      <router-link @click="activateSideBar()"
      class="animate__animated animate__fadeInDown animate__delay-1s animate__faster"
      to="/"
      style="text-decoration: none;"
      >
        <div class="nav-item">
          <a>
            Matches
          </a>
        </div>
      </router-link>
      <router-link @click="activateSideBar()"
      class="animate__animated animate__fadeInDown animate__delay-1s animate__faster"
      to="/Teams"
      style="text-decoration: none;"
      >
        <div class="nav-item">
          <a >
            Teams
          </a>
        </div>
      </router-link>
      <router-link
      @click="activateSideBar()"
      class="animate__animated animate__fadeInDown animate__delay-1s animate__faster"
      to="/Players"
      style="text-decoration: none;"
      >
        <div class="nav-item">
          <a>
            Players
          </a>
        </div>
      </router-link>
    </div>
    <!--Hamburger menu-->
    <div class="hamburger-icon" v-if="this.mobileView" @click="activateSideBar()">
      <div class="bar-1 animate__animated animate__fadeInLeft animate__faster"></div>
      <div class="bar-2 animate__animated animate__fadeInRight animate__faster"></div>
      <div class="bar-3 animate__animated animate__fadeInLeft animate__faster"></div>
    </div>
  </div>
  <div :class="(this.sideBarActive)?'mobile-bg':'mobile-bg'" v-if="this.sideBarActive"></div>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
      windowWidth: window.innerWidth,
      mobileView: false,
      txt: '',
      sideBarActive: false
    }
  },
  watch: {
    windowWidth (newWidth, oldWidth) {
      this.txt = `it changed to ${newWidth} from ${oldWidth}`
    }
  },
  // checks for resize of window to switch betwenn mobile and desktop views
  beforeMount () {
    this.onResize()
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize () {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 800) {
        this.mobileView = true
      } else {
        this.mobileView = false
      }
    },
    activateSideBar () {
      if (this.mobileView) {
        this.sideBarActive = !this.sideBarActive
      }
    }
  }
}
</script>
