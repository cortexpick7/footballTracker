<template>
  <div>
    <button @click="getMatches()">pisa</button>
  </div>
</template>

<script>
import axios from 'axios'

const url = 'http://api.football-data.org//v2/competitions'
const config = {
  headers: {
    'X-Auth-Token': 'b3bc93615140472f9d07bf7ee721121b'
  }
}

export default {
  name: 'Test',
  data () {
    return {
      info: null
    }
  },
  methods: {
    async getMatches () {
      const info = await axios.get(url, config)
      this.info = info.data
      console.log(this.info)
    }
  }
}
</script>
