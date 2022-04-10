<template>
  <!--Whole container-->
  <div :class="(!this.tabletView)?'page container-fluid mobilePage':'mobilepage container-fluid'">
    <!--Mobile list of leagues after pushing button-->
    <div v-if="renderComponent && this.openList" :class="(this.openList)?'leagues-list-mobile':'notShow'">
      <!--Container for league info-->
      <div class="league" @click="getMatches(league.id), openListOfLeagues()" v-for="league in this.leagues" :key="league.id">
        <img v-if="league.emblemUrl != null" :src="league.emblemUrl" alt="">
        <h2>{{ league.name }}</h2>
      </div>
    </div>
    <!--Button for opening of leagues mobile list-->
    <div class="chooseLeague" v-if="this.tabletView">
      <button @click="openListOfLeagues()" class="openList animate__animated animate__pulse">Choose League</button>
    </div>
    <!--Table on which all matches are shown. Radio buttons on top hlep filter matches by their status-->
    <div :class="(!this.tabletView)?'tableOfMatches col-md-7':'tableOfMatches mobileTable'">
      <div class="spinner" v-if="this.contentLoading"></div>
      <!--Container with competition name and radio buttons to choose which mathes to look for-->
      <div class="top">
        <h1 v-if="matches !== null" class="leagueName">{{this.matches.competition.name}}</h1>
        <div class="chooseMatches">
          <fieldset id="group" v-if="matches !== null">
              <input type="radio" @input="isFinished(), getMatches(this.matches.competition.id)" name="radio"/><label>Finished</label>
              <input type="radio" @input="isScheduled(), getMatches(this.matches.competition.id)" name="radio"/><label>Scheduled</label>
              <input type="radio" @input="isLiveEvent(), getMatches(this.matches.competition.id)" name="radio" checked/><label>LIVE</label>
          </fieldset>
        </div>
      </div>
      <!--Table of matches-->
      <div :class="(this.mobileView)?'table table-mobile':'table'">
        <!--Message which is shown when no matches are found-->
        <div class="messageNotFound"><h1 class="matchesNotFound" v-if="this.allMatches.length === 0">Matches not found</h1></div>
        <table class="tableX" v-if="matches !== null && !this.contentLoading">
        <thead>
          <tr>
            <th class="tableHead">Home team</th>
            <th class="tableHead">Score</th>
            <th class="tableHead">Away team</th>
            <th v-if="!this.mobileView" class="tableHead">Status</th>
            <th v-if="!this.mobileView" class="tableHead">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="match in this.allMatches" :key="match.id">
            <!--Depending on the result teams name is colored with red or green or white-->
            <th  v-if="match.score.winner === 'HOME_TEAM'" class="winner">{{match.homeTeam.name}}</th>
            <th v-else-if="match.score.winner === 'AWAY_TEAM'" class="loser">{{match.homeTeam.name}}</th>
            <th v-else>{{match.homeTeam.name}}</th>
            <th v-if="match.score.fullTime.homeTeam !== null">{{match.score.fullTime.homeTeam + ":" + match.score.fullTime.awayTeam}}</th>
            <!--Message which is shown if there is no info about match result-->
            <th v-else>No data</th>
            <!--Depending on the result teams name is colored with red or green or white-->
            <th v-if="match.score.winner === 'AWAY_TEAM'" class="winner">{{match.awayTeam.name}}</th>
            <th v-else-if="match.score.winner === 'HOME_TEAM'" class="loser">{{match.awayTeam.name}}</th>
            <th v-else>{{match.awayTeam.name}}</th>
            <!--Columns are not shown when the screen widt is less than 700px-->
            <th v-if="!this.mobileView">{{match.status}}</th>
            <th v-if="!this.mobileView">{{match.utcDate.split('T')[0]}}</th>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
    <!--List of leagues for PC monitors with feature of searching league by name-->
    <div class="list col-md-3" v-if="!this.tabletView">
      <div class="filter">
        <h1>Find League By Name</h1>
        <input type="text" @input="findLeague(this.leagueInput), forceRerender()" v-model="leagueInput" placeholder="League name">
      </div>
      <div v-if="renderComponent" class="leagues-list">
        <div class="league" @click="getMatches(league.id)" v-for="league in this.leagues" :key="league.id">
          <img v-if="league.emblemUrl != null" :src="league.emblemUrl" alt="">
          <h2>{{ league.name }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

var alasql = require('alasql')

const url = 'http://api.football-data.org/v2/competitions'
// const url2 = 'http://api.football-data.org/v2/teams'
const config = {
  headers: {
    'X-Auth-Token': 'b3bc93615140472f9d07bf7ee721121b'
  }
}

export default {
  name: 'LisOfLeagues',
  components: {
  },
  data () {
    return {
      leagues: null,
      allLeagues: null,
      leaguesFiltered: null,
      leagueInput: null,
      newLeagues: null,
      renderComponent: true,
      matches: null,
      allMatches: [],
      matchStatus: null,
      finished: false,
      scheduled: false,
      liveEvent: true,
      idOfMatch: null,
      windowWidth: window.innerWidth,
      mobileView: false,
      tabletView: false,
      currentLeague: null,
      openList: false,
      contentLoading: false
    }
  },
  methods: {
    // get all leagues
    async getLeagues () {
      const info = await axios.get(url, config)
      this.leagues = info.data.competitions
      this.allLeagues = alasql('SELECT * FROM ? WHERE emblemUrl IS NOT NULL', [this.leagues])
      this.findLeague('')
    },
    // search league by name on input
    findLeague (inp) {
      this.leagues = alasql('SELECT * FROM ? WHERE name LIKE "' + inp + '%"', [this.allLeagues])
    },
    // finding league by name
    findLeagueByName () {
      this.leagues = alasql('SELECT * FROM ? WHERE name IS ?', [this.allLeagues, this.currentLeague])
    },
    // rerender elemnt to get new table list
    forceRerender () {
      // Removing my-component from the DOM
      this.renderComponent = false
      this.$nextTick(() => {
        // Adding the component back in
        this.renderComponent = true
      })
    },
    // get all availible matches from league by id
    async getMatches (id) {
      this.contentLoading = true
      var newmatches = null
      console.log(this.allMatches)
      if (this.liveEvent === true) {
        const info = await axios.get(url + '/' + id + '/' + 'matches', config)
        this.matches = info.data
        this.allMatches = this.matches.matches
        newmatches = alasql('SELECT * FROM ? WHERE status = \'IN_PLAY\' ORDER BY utcDate DESC', [this.allMatches])
        this.allMatches = null
        this.allMatches = newmatches
      } else if (this.scheduled === true) {
        const info = await axios.get(url + '/' + id + '/' + 'matches', config)
        this.matches = info.data
        this.allMatches = this.matches.matches
        newmatches = alasql('SELECT * FROM ? WHERE status = \'SCHEDULED\' ORDER BY utcDate DESC', [this.allMatches])
        this.allMatches = null
        this.allMatches = newmatches
      } else {
        const info = await axios.get(url + '/' + id + '/' + 'matches', config)
        this.matches = info.data
        this.allMatches = this.matches.matches
        newmatches = alasql('SELECT * FROM ? WHERE status = \'FINISHED\' ORDER BY utcDate DESC', [this.allMatches])
        this.allMatches = null
        this.allMatches = newmatches
      }
      this.contentLoading = false
    },
    // check for events that are live
    isLiveEvent () {
      this.liveEvent = !this.liveEvent
      if (this.liveEvent === true) {
        this.scheduled = false
        this.finished = false
      }
    },
    // check for events that are scheduled
    isScheduled () {
      this.scheduled = !this.scheduled
      if (this.scheduled === true) {
        this.finished = false
        this.liveEvent = false
      }
    },
    // check for events that are finished
    isFinished () {
      this.finished = !this.finished
      if (this.finished === true) {
        this.liveEvent = false
        this.scheduled = false
      }
    },
    // resize control to switch between mobile and desktop versions
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
    // get league id
    getLeagueId (id) {
      this.currentLeague = id
      console.log(this.currentLeague)
    },
    // opening mobile list of leagues to choose from
    openListOfLeagues () {
      this.openList = !this.openList
    }
  },
  beforeMount () {
    this.getLeagues()
    this.onResize()
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
