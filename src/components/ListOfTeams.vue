<template>
  <div class="workspace container-fluid">
    <div class="upperRow">
      <div class="leagueList">
        <div class="leagues-list">
          <div @click="this.getTeams(league.id)" class="league" v-for="league in this.allLeagues" :key="league.id">
            <img v-if="league.emblemUrl != null" :src="league.emblemUrl" alt="">
            <h2>{{ league.name }}</h2>
          </div>
        </div>
      </div>
      <div class="teamInfo">
        <div  v-if="this.exactTeam !== null" class="textInfo">
          <h1>{{this.exactTeam.name}}</h1>
          <h2>Founded: {{this.exactTeam.founded}}</h2>
          <h2>Venue: {{this.exactTeam.venue}}</h2>
          <a :href='this.teamEmail'>Website</a>
        </div>
        <img v-if="this.exactTeam" :src="this.exactTeam.crestUrl" alt="">
      </div>
    </div>
    <div class="lowerRow">
      <div class="listofteams">
        <div class="teams-list" v-if="this.allTeams !== null">
          <div @click="this.getTeam(team.id)" class="team" v-for="team in this.allTeams" :key="team.id">
            <img v-if="team.crestUrl != null" :src="team.crestUrl" alt="">
            <h2>{{ team.name }}</h2>
          </div>
        </div>
      </div>
      <div class="squad"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

var alasql = require('alasql')

const url = 'http://api.football-data.org/v2/competitions'
const url2 = 'http://api.football-data.org/v2/teams'
const config = {
  headers: {
    'X-Auth-Token': 'b3bc93615140472f9d07bf7ee721121b'
  }
}

export default {
  name: 'ListOfTeams',
  data () {
    return {
      windowWidth: window.innerWidth,
      mobileView: false,
      tabletView: false,
      leagues: null,
      allLeagues: null,
      renderComponent: null,
      allTeams: null,
      exactTeam: null,
      teamEmail: null
    }
  },
  methods: {
    async getLeagues () {
      const info = await axios.get(url, config)
      this.leagues = info.data.competitions
      this.allLeagues = alasql('SELECT * FROM ? WHERE emblemUrl IS NOT NULL', [this.leagues])
      console.log(this.allLeagues)
    },
    onResize () {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 1200) {
        this.tabletView = true
      } else {
        this.tabletView = false
      }
      if (this.windowWidth <= 830) {
        this.mobileView = true
      } else {
        this.mobileView = false
      }
    },
    async getTeams (id) {
      const info = await axios.get(url + '/' + id + '/' + 'teams', config)
      this.allTeams = info.data.teams
      console.log(this.allTeams)
    },
    async getTeam (id) {
      const info = await axios.get(url2 + '/' + id, config)
      this.exactTeam = info.data
      this.teamEmail = this.exactTeam.website
    },
    // rerender elemnt to get new table list
    forceRerender () {
      // Removing my-component from the DOM
      this.renderComponent = false
      this.$nextTick(() => {
        // Adding the component back in
        this.renderComponent = true
      })
    }
  },
  beforeMount () {
    this.onResize()
    this.getLeagues()
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>
